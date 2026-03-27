# Releasing kilocode-- (kilocode lite)

Releases are triggered through `.github/workflows/publish.yml`.

The workflow keeps the repo focused on the VS Code extension release path:

1. compute the next version and draft a GitHub release
2. build platform VSIX packages
3. version the repo, publish the extension, and finalize the GitHub release

## How To Trigger A Release

1. Open the `publish` workflow in GitHub Actions.
2. Choose the branch, usually `main`.
3. Set one of:
   - `bump`: `patch`, `minor`, or `major`
   - `version`: an explicit version override
4. Run the workflow.

## What The Workflow Does

### `version`

- runs `script/version.ts`
- computes the new version
- creates a draft GitHub release
- exposes the version and tag to downstream jobs

### `build-vscode`

- runs `packages/kilo-vscode/script/build.ts`
- produces VSIX files named `kilocode-lite-<target>.vsix`
- uploads them as the `kilocode-lite-vsix` artifact

### `publish`

- bumps every retained `package.json` version
- refreshes `bun.lock`
- commits and tags the release version
- publishes the pre-release VSIX files to the VS Code Marketplace
- publishes the stable VSIX files to Open VSX
- uploads the VSIX files to the GitHub release
- marks the GitHub release as published

## Secrets

Required secrets:

- `KILO_API_KEY`
- `KILO_ORG_ID`
- `KILO_MAINTAINER_APP_ID`
- `KILO_MAINTAINER_APP_SECRET`
- `VSCE_TOKEN`
- `OVSX_TOKEN`

## Notes

- This trimmed repo no longer publishes standalone desktop, web, docs, Zed, container, or extra SDK distribution artifacts.
- License and notice files remain unchanged and must continue to ship with releases.
