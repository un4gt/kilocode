# AGENTS.md

`kilocode-- (kilocode lite)` is a trimmed monorepo that keeps only the VS Code extension and the packages required to build and run it.

- ALWAYS USE PARALLEL TOOLS WHEN APPLICABLE.
- The default branch in this repo is `main`.
- Prefer automation: execute requested actions without confirmation unless blocked by missing info or safety or irreversibility.
- You may be running in a git worktree. All changes must be made in your current working directory. Never modify files in another checkout.

## Build And Dev

- Dev extension: `bun run extension` from repo root
- Extension compile: `bun run --cwd packages/kilo-vscode compile`
- Extension watch: `bun run --cwd packages/kilo-vscode watch`
- Typecheck: `bun turbo typecheck`
- SDK regen: after changing endpoints in `packages/opencode/src/server/`, run `./script/generate.ts`
- Extension knip: `bun run knip` from `packages/kilo-vscode/`
- kilocode_change check: `bun run check-kilocode-change` from `packages/kilo-vscode/`

## Repo Shape

The supported product is the VS Code extension. The runtime package remains only because the extension launches it internally.

Key packages:

| Package | Name | Purpose |
| --- | --- | --- |
| `packages/kilo-vscode/` | `kilo-code` | VS Code extension |
| `packages/opencode/` | `@kilocode/cli` | Internal runtime and HTTP server used by the extension |
| `packages/sdk/js/` | `@kilocode/sdk` | Generated TypeScript SDK |
| `packages/kilo-ui/` | `@kilocode/kilo-ui` | Shared UI components for the extension |
| `packages/ui/` | `@opencode-ai/ui` | UI primitives used by `kilo-ui` |
| `packages/kilo-i18n/` | `@kilocode/kilo-i18n` | Shared translations |
| `packages/kilo-gateway/` | `@kilocode/kilo-gateway` | Auth and provider routing |
| `packages/kilo-telemetry/` | `@kilocode/kilo-telemetry` | Telemetry |
| `packages/plugin/` | `@kilocode/plugin` | Plugin and tool types |
| `packages/util/` | `@opencode-ai/util` | Shared utilities |
| `packages/script/` | `@opencode-ai/script` | Release script helpers |

## Style Guide

- Keep things in one function unless composable or reusable
- Avoid unnecessary destructuring
- Avoid `try`/`catch` where possible
- Avoid `any`
- Prefer Bun APIs when possible
- Prefer single-word names for new locals, params, and helpers unless clarity really requires more

### Prefer `const`

Good:

```ts
const x = cond ? 1 : 2
```

Bad:

```ts
let x

if (cond) x = 1
else x = 2
```

### Avoid `else`

Prefer early returns.

### No Empty `catch`

If a `catch` exists, handle or log the error.

## Testing

- Avoid mocks unless there is no practical alternative
- Tests should exercise the real implementation, not duplicate it

## Commit Scopes

[Conventional Commits](https://www.conventionalcommits.org/) with scopes matching retained packages: `vscode`, `cli`, `agent-manager`, `sdk`, `ui`, `i18n`, `gateway`, `telemetry`.

## Fork Merge Process

This repo still carries upstream OpenCode code in `packages/opencode/`. Keep the upstream diff small:

1. Prefer `packages/opencode/src/kilocode/` and `packages/opencode/test/kilocode/` for Kilo-specific additions
2. Minimize edits to shared upstream files
3. Use `kilocode_change` markers in shared upstream files
4. Do not use `kilocode_change` markers inside paths that already contain `kilocode`
