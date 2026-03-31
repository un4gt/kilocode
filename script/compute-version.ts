#!/usr/bin/env bun

import path from "path"

type Inputs = {
  bump?: string
  version?: string
}

type LatestReleaseResponse = {
  tag_name?: string
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

async function readBaseVersion(): Promise<string> {
  const file = path.join(import.meta.dir, "..", "packages", "kilo-vscode", "package.json")
  const pkg = (await Bun.file(file).json()) as { version?: string }
  if (!pkg.version) throw new Error(`Missing version field in ${file}`)
  return pkg.version
}

function normalizeRepo(repo: string): { owner: string; name: string } {
  const trimmed = repo.trim()
  const match = /^([^/]+)\/([^/]+)$/.exec(trimmed)
  if (!match) {
    throw new Error(`Invalid GH_REPO: ${repo} (expected "owner/repo")`)
  }
  return { owner: match[1], name: match[2] }
}

async function tryReadLatestReleaseVersion(): Promise<string | null> {
  const token = (process.env.GH_TOKEN || "").trim()
  const repo = (process.env.GH_REPO || "").trim()
  if (!token || !repo) return null

  const { owner, name } = normalizeRepo(repo)
  const endpoint = `https://api.github.com/repos/${owner}/${name}/releases/latest`

  try {
    const res = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (res.status === 404) return null
    if (!res.ok) return null

    const json = (await res.json()) as LatestReleaseResponse
    const tag = (json.tag_name || "").trim()
    if (!tag) return null

    const match = /^v?(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)$/.exec(tag)
    if (!match) return null

    return match[1]
  } catch {
    return null
  }
}

async function computeVersion(input: Inputs): Promise<string> {
  const explicit = input.version?.trim()
  if (explicit) return explicit

  const bump = input.bump?.trim().toLowerCase()
  if (bump === "major" || bump === "minor" || bump === "patch") {
    const base = (await tryReadLatestReleaseVersion()) ?? (await readBaseVersion())
    return bumpVersion(base, bump)
  }

  const now = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")
  const rawRef = (process.env.GITHUB_REF_NAME || process.env.GITHUB_REF || "main").toString()
  const channel = rawRef
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")

  return `0.0.0-${channel}-${now}`
}

async function writeOutputs(version: string) {
  if (process.env.GITHUB_OUTPUT) {
    await Bun.write(process.env.GITHUB_OUTPUT, `version=${version}\n`)
  } else {
    console.log(version)
  }
}

try {
  const version = await computeVersion({
    bump: process.env.KILO_BUMP,
    version: process.env.KILO_VERSION,
  })

  await writeOutputs(version)
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
}
