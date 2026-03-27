# Kilo Runtime

This package is the bundled runtime shipped inside `kilocode-- (kilocode lite)`.

It contains the agent runtime, HTTP server, session system, tools, and terminal UI that the VS Code extension launches in the background through `kilo serve`.

## What Lives Here

- agent orchestration and tool execution
- the local HTTP and SSE server used by the extension
- session storage, permissions, worktrees, and review flows
- the bundled `kilo` binary that gets packaged into the VSIX

## Development

Run the runtime directly during local development:

```bash
bun run dev
```

Run CLI tests from this package:

```bash
bun test
```

Build release binaries used by the extension:

```bash
./script/build.ts
```

## Scope

This repo is no longer maintained as a standalone multi-product distribution. The runtime remains here because the VS Code extension depends on it.

## License

MIT
