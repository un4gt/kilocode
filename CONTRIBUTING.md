# Contributing to kilocode-- (kilocode lite)

See [the Documentation for details on contributing](https://kilo.ai/docs/contributing).

## TL;DR

There are lots of ways to contribute to the project:

- **Code Contributions:** Implement new features or fix bugs
- **Documentation:** Improve existing docs or create new guides
- **Bug Reports:** Report issues you encounter
- **Feature Requests:** Suggest new features or improvements
- **Community Support:** Help other users in the community

The Kilo Community is [on Discord](https://kilo.ai/discord).

## Developing the VS Code Extension

- **Requirements:** Bun 1.3.10+
- Install dependencies and launch the extension from the repo root:

  ```bash
  bun install
  bun run extension
  ```

### Developing the VS Code Extension

Build and launch the extension in an isolated VS Code instance:

```bash
bun run extension        # Build + launch in dev mode
```

This auto-detects VS Code on macOS, Linux, and Windows. Override with `--app-path PATH` or `VSCODE_EXEC_PATH`. Use `--insiders` to prefer Insiders, `--workspace PATH` to open a specific folder, or `--clean` to reset cached state.

### Internal runtime

The extension still launches an internal local runtime from `packages/opencode/`, but that runtime is not treated as a standalone end-user product in this trimmed repository.

If you need to work on the runtime code that backs the extension, use the package-local commands there directly.

### Testing with a local backend

To point the extension-backed runtime at a local backend (for example a Kilo API server on port 3000), set `KILO_API_URL` before launching the extension:

```bash
KILO_API_URL=http://localhost:3000 bun run extension
```

This redirects gateway traffic such as auth, model listing, provider routing, and profile calls to your local server. The default is `https://api.kilo.ai`.

There are also optional overrides for other services:

| Variable                  | Default                          | Purpose                                   |
| ------------------------- | -------------------------------- | ----------------------------------------- |
| `KILO_API_URL`            | `https://api.kilo.ai`            | Kilo API (gateway, auth, models, profile) |
| `KILO_SESSION_INGEST_URL` | `https://ingest.kilosessions.ai` | Session export / cloud sync               |
| `KILO_MODELS_URL`         | `https://models.dev`             | Model metadata                            |

> **VS Code:** The repo includes a "VSCode - Run Extension (Local Backend)" launch config in `.vscode/launch.json` that sets `KILO_API_URL=http://localhost:3000` automatically.

### Pull Request Expectations

- **Issue First Policy:** All PRs must reference an existing issue.
- **UI Changes:** Include screenshots or videos (before/after).
- **Logic Changes:** Explain how you verified it works.
- **PR Titles:** Follow conventional commit standards (`feat:`, `fix:`, `docs:`, etc.).

### Issue and PR Lifecycle

To keep our backlog manageable, we automatically close inactive issues and PRs after a period of inactivity. This isn't a judgment on quality — older items tend to lose context over time and we'd rather start fresh if they're still relevant. Feel free to reopen or create a new issue/PR if you're still working on something!

### Style Preferences

- **Functions:** Keep logic within a single function unless breaking it out adds clear reuse.
- **Destructuring:** Avoid unnecessary destructuring.
- **Control flow:** Avoid `else` statements; prefer early returns.
- **Types:** Avoid `any`.
- **Variables:** Prefer `const`.
- **Naming:** Concise single-word identifiers when descriptive.
- **Runtime APIs:** Use Bun helpers (e.g., `Bun.file()`).
