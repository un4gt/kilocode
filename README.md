# kilocode-- (kilocode lite)

`kilocode-- (kilocode lite)` is a trimmed fork of Kilo Code focused on a single deliverable: the VS Code extension.

This repository keeps the extension, its internal runtime, and the shared packages required to build and test that stack. Standalone desktop, web, docs, container, Zed, and auxiliary SDK packaging surfaces have been removed on purpose.

## What stays in this repo

- `packages/kilo-vscode` - the VS Code extension
- `packages/opencode` - the internal runtime the extension launches
- `packages/sdk/js` - generated client types shared by the extension and runtime
- `packages/kilo-ui`, `packages/ui`, `packages/kilo-i18n` - extension UI and localization packages
- `packages/kilo-gateway`, `packages/kilo-telemetry`, `packages/plugin`, `packages/util`, `packages/script` - runtime support packages

## Install

- VSIX (this fork): https://github.com/un4gt/kilocode/releases
- Marketplace (upstream / official): https://marketplace.visualstudio.com/items?itemName=kilocode.Kilo-Code

This fork uses its own VS Code extension identifier (`publisher`: `un4gt`, `name`: `kilocode-lite`) so it can be installed alongside upstream without collisions.

## Local Development

```bash
bun install
bun run extension
```

Useful commands:

- `bun turbo typecheck`
- `bun run extension`
- `bun run --cwd packages/kilo-vscode compile`
- `bun run --cwd packages/kilo-vscode test:unit`

## Release Outputs

The release workflow builds:

- VSIX packages uploaded to GitHub Releases

VSIX files are emitted as `kilocode-lite-<target>.vsix`.

## License

The project remains under the MIT License. See [LICENSE](/LICENSE).

## Acknowledgements

This project is based on the MIT-licensed Kilo Code codebase and retains upstream license notices. Thanks to the original Kilo Code / OpenCode authors and contributors.

- Upstream repository: https://github.com/Kilo-Org/kilocode
