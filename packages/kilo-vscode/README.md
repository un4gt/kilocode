# kilocode-- (kilocode lite)

`kilocode-- (kilocode lite)` is the VS Code extension package in this repository.

It bundles the internal Kilo runtime, launches it in the background, and renders the chat, agent manager, inline editing, and review flows inside VS Code.

## Install

- VSIX (this fork): https://github.com/un4gt/kilocode/releases
- Marketplace (upstream / official): https://marketplace.visualstudio.com/items?itemName=kilocode.Kilo-Code

This fork uses a separate extension identifier (`un4gt.kilocode-lite`) so it can be installed alongside upstream.

## Highlights

- AI chat and code generation inside VS Code
- Bundled internal runtime, no separate backend install required
- Agent Manager for parallel sessions and worktree-based isolation
- Inline suggestions, code actions, terminal actions, and review tools

## Developer Setup

```bash
bun install
bun run --cwd packages/kilo-vscode compile
bun run --cwd packages/kilo-vscode test:unit
```

Useful commands:

- `bun run --cwd packages/kilo-vscode extension`
- `bun run --cwd packages/kilo-vscode watch`
- `bun run --cwd packages/kilo-vscode format`
- `bun run --cwd packages/kilo-vscode knip`
- `bun run --cwd packages/kilo-vscode check-kilocode-change`

## Snapshot Builds

```bash
bun run --cwd packages/kilo-vscode snapshot:build
bun run --cwd packages/kilo-vscode snapshot:install
```

## License

This package is distributed under the MIT License. See [LICENSE](/LICENSE).

## Acknowledgements

This extension is a fork of the MIT-licensed Kilo Code project. Thanks to the upstream authors and contributors.

- Upstream repository: https://github.com/Kilo-Org/kilocode
