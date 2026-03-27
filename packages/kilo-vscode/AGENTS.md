# AGENTS.md

This package is the VS Code extension for `kilocode-- (kilocode lite)`.

## Context

The extension is the only supported end-user surface in this repo. It still depends on the bundled internal runtime in `packages/opencode/`, plus shared UI, SDK, i18n, gateway, telemetry, and utility packages.

## Commands

```bash
bun run extension
bun run compile
bun run watch
bun run test
bun run test:unit
bun run lint
bun run format
```

Single test:

```bash
bun run test -- --grep "test name"
```

## Internal Runtime

The extension bundles `bin/kilo` and launches `kilo serve --port 0` as a child process. Communication is over HTTP and SSE through `@kilocode/sdk`.

To refresh the local bundled binary:

```bash
bun script/local-bin.ts --force
```

## Architecture

Core areas in this package:

- `src/` - VS Code extension host code
- `webview-ui/` - sidebar and agent-manager Solid UI
- `tests/unit/` - fast unit coverage for extension logic
- `tests/visual-regression*` - visual baselines for webview UI

The Agent Manager is part of this package, not a separate product.

## Webview UI

Use `@kilocode/kilo-ui` components for new webview work.

- Import from deep paths, for example `@kilocode/kilo-ui/button`
- Global styles come from `@kilocode/kilo-ui/styles`
- Prefer existing tokens, slots, and `data-component` conventions over custom CSS
- Use existing extension webview code as the primary reference implementation

## Debugging

- Extension logs: "Extension Host" output channel
- Webview logs: "Developer: Open Webview Developer Tools"
- Prefix debug output with `[Kilo New]`

## Naming

- Commands must keep the `kilo-code.new.` prefix unless a migration explicitly changes it
- Keep the sidebar view ID `kilo-code.SidebarProvider` for compatibility

## Style

Follow the repo root guide:

- Prefer `const` over `let`
- Prefer early returns over `else`
- Avoid `any`
- Prefer single-word names

## File Size Caps

`src/agent-manager/` has file-size guard tests in `tests/unit/agent-manager-arch.test.ts`. Do not raise those caps. Extract helpers instead.

## Markdown Tables

Do not pad markdown tables for alignment. Use single spaces around cell content to avoid noisy diffs.

## Committing

Run `bun run format` before committing to keep diffs focused.
