#!/usr/bin/env bun

import path from "path"

type Inputs = {
  bump?: string
  version?: string
  repo?: string
}

function toChannel(): string {
  const raw = (process.env.GITHUB_REF_NAME || process.env.GITHUB_REF || "main").toString()
  return raw
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
}

function bumpVersion(base: string, bump: string): string {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(base)
  if (!match) {
    throw new Error(`Cannot bump non-semver base version: ${base}`)
  }
  const major = Number(match[1]) || 0
  const minor = Number(match[2]) || 0
  const patch = Number(match[3]) || 0

  if (bump === "major") return `${major + 1}.0.0`
  if (bump === "minor") return `${major}.${minor + 1}.0`
  return `${major}.${minor}.${patch + 1}`
}

async function computeVersion(input: Inputs): Promise<string> {
  const explicit = input.version?.trim()
  if (explicit) return explicit

  const bump = input.bump?.trim().toLowerCase()
  if (bump === "major" || bump === "minor" || bump === "patch") {
    const pkg = (await Bun.file(
      path.join(import.meta.dir, "..", "packages", "kilo-vscode", "package.json"),
    ).json()) as {
      version?: string
    }
    const base = pkg.version
    if (!base) {
      throw new Error("Missing base version in packages/kilo-vscode/package.json")
    }
    return bumpVersion(base, bump)
  }

  const now = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")
  return `0.0.0-${toChannel()}-${now}`
}

async function main() {
  const input: Inputs = {
    bump: process.env.KILO_BUMP,
    version: process.env.KILO_VERSION,
    repo: process.env.GH_REPO,
  }
  const repo = input.repo || (process.env.GITHUB_REPOSITORY ?? "").trim()
  if (!repo) {
    throw new Error("GH_REPO (or GITHUB_REPOSITORY) is required")
  }

  const version = await computeVersion(input)
  const tag = `v${version}`
  const outDir = path.join(import.meta.dir, "..", "packages", "kilo-vscode", "out")

  console.log(`Publishing VSIX to GitHub release: ${repo} ${tag}`)
  console.log(`VSIX directory: ${outDir}`)

  const targets = [
    "linux-x64",
    "linux-arm64",
    "alpine-x64",
    "alpine-arm64",
    "darwin-x64",
    "darwin-arm64",
    "win32-x64",
    "win32-arm64",
  ]

  const prefix = "kilocode-lite"
  const vsixFiles = targets.map((t) => path.join(outDir, `${prefix}-${t}.vsix`))

  const exists = await releaseExists(repo, tag)
  if (!exists) {
    await createDraftRelease(repo, tag, `VSIX build for ${tag}`)
  }

  await uploadAssets(repo, tag, vsixFiles)

  // If this is a "latest" release (not preview), publish the draft.
  if (version.startsWith("0.0.0-")) {
    console.log("Preview build detected; leaving release as draft.")
    return
  }

  await markReleasePublished(repo, tag)
  console.log("Release published.")
}

try {
  await main()
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}

type GitHubRelease = { id: number }

function normalizeRepo(repo: string): { owner: string; name: string } {
  const trimmed = repo.trim()
  const match = /^([^/]+)\/([^/]+)$/.exec(trimmed)
  if (!match) {
    throw new Error(`Invalid GH_REPO: ${repo} (expected "owner/repo")`)
  }
  return { owner: match[1], name: match[2] }
}

async function githubRequest<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const token = (process.env.GH_TOKEN || "").trim()
  if (!token) {
    throw new Error("GH_TOKEN is required")
  }

  const url = endpoint.startsWith("https://") ? endpoint : `https://api.github.com${endpoint}`
  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  if (!res.ok) {
    throw new Error(`GitHub API ${method} ${endpoint} failed: ${res.status} ${res.statusText}\n${text}`)
  }
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

async function releaseExists(repo: string, tag: string): Promise<boolean> {
  const { owner, name } = normalizeRepo(repo)
  try {
    await githubRequest<GitHubRelease>("GET", `/repos/${owner}/${name}/releases/tags/${encodeURIComponent(tag)}`)
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("404") || msg.includes("Not Found")) return false
    throw err
  }
}

async function createDraftRelease(repo: string, tag: string, notes: string): Promise<void> {
  const { owner, name } = normalizeRepo(repo)
  const sha = (process.env.GITHUB_SHA || "").trim()
  await githubRequest("POST", `/repos/${owner}/${name}/releases`, {
    tag_name: tag,
    name: tag,
    body: notes,
    draft: true,
    prerelease: false,
    ...(sha ? { target_commitish: sha } : {}),
  })
}

async function markReleasePublished(repo: string, tag: string): Promise<void> {
  const { owner, name } = normalizeRepo(repo)
  const release = await githubRequest<GitHubRelease>(
    "GET",
    `/repos/${owner}/${name}/releases/tags/${encodeURIComponent(tag)}`,
  )
  await githubRequest("PATCH", `/repos/${owner}/${name}/releases/${release.id}`, {
    draft: false,
  })
}

async function uploadAssets(repo: string, tag: string, files: string[]): Promise<void> {
  const { owner, name } = normalizeRepo(repo)
  const release = await githubRequest<GitHubRelease>(
    "GET",
    `/repos/${owner}/${name}/releases/tags/${encodeURIComponent(tag)}`,
  )

  for (const file of files) {
    await uploadAssetToRelease({ owner, name, releaseId: release.id, file })
  }
}

async function uploadAssetToRelease(args: {
  owner: string
  name: string
  releaseId: number
  file: string
}): Promise<void> {
  const token = (process.env.GH_TOKEN || "").trim()
  if (!token) {
    throw new Error("GH_TOKEN is required")
  }

  const filePath = args.file
  const stat = await Bun.file(filePath).exists()
  if (!stat) {
    throw new Error(`VSIX file not found: ${filePath}`)
  }

  const baseName = path.basename(filePath)

  // Delete existing asset with same name (idempotent / clobber behavior).
  const assets = await githubRequest<Array<{ id: number; name: string }>>(
    "GET",
    `/repos/${args.owner}/${args.name}/releases/${args.releaseId}/assets`,
  )
  const existing = assets.find((a) => a.name === baseName)
  if (existing) {
    await githubRequest("DELETE", `/repos/${args.owner}/${args.name}/releases/assets/${existing.id}`)
  }

  const uploadUrl = `https://uploads.github.com/repos/${args.owner}/${args.name}/releases/${args.releaseId}/assets?name=${encodeURIComponent(baseName)}`
  const data = await Bun.file(filePath).arrayBuffer()

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/octet-stream",
      "Content-Length": String(data.byteLength),
    },
    body: data,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub upload failed for ${baseName}: ${res.status} ${res.statusText}\n${text}`)
  }
}
