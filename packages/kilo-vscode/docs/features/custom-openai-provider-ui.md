# Custom OpenAI-Compatible Provider UI

**Priority:** P1
**Issue:** [#6163](https://github.com/Kilo-Org/kilocode/issues/6163)

No UI for adding custom OpenAI-compatible providers. Users must manually edit `opencode.json`. The older shared web client had a full `DialogCustomProvider`.

## Remaining Work

- Recreate the legacy `DialogCustomProvider` flow directly in the extension webview
- Add "Add custom provider" button to the Providers tab
- Dialog should collect: Provider ID, display name, base URL, API key, model entries, optional custom HTTP headers
- On save, write to CLI config via `handleUpdateConfig()` endpoint
- Validate inputs; show inline errors
- After adding, provider should appear in list and models in model selector
