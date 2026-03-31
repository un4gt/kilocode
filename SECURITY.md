# Security

## IMPORTANT

We do not accept AI generated security reports. We receive a large number of
these and we absolutely do not have the resources to review them all. If you
submit one that will be an automatic ban from the project.

## Threat Model

### Overview

`kilocode-- (kilocode lite)` is an AI-powered VS Code extension with a bundled local runtime. It provides an agent system with access to powerful tools including shell execution and file operations (and may access the network depending on your configuration).

### No Sandbox

The bundled runtime does **not** sandbox the agent. The permission system exists as a UX feature to help users stay aware of what actions the agent is taking - it prompts for confirmation before executing commands, writing files, etc. However, it is not designed to provide security isolation.

If you need true isolation, run the extension/runtime inside a Docker container or VM.

### Server Mode

Server mode is opt-in only. When enabled, set `KILO_SERVER_PASSWORD` to require HTTP Basic Auth. Without this, the server runs unauthenticated (with a warning). It is the end user's responsibility to secure the server - any functionality it provides is not a vulnerability.

### Out of Scope

| Category                        | Rationale                                                               |
| ------------------------------- | ----------------------------------------------------------------------- |
| **Server access when opted-in** | If you enable server mode, API access is expected behavior              |
| **Sandbox escapes**             | The permission system is not a sandbox (see above)                      |
| **LLM provider data handling**  | Data sent to your configured LLM provider is governed by their policies |
| **MCP server behavior**         | External MCP servers you configure are outside our trust boundary       |
| **Malicious config files**      | Users control their own config; modifying it is not an attack vector    |

---

# Reporting Security Issues

We value the contributions of the security research community and recognize the importance of a coordinated approach to vulnerability disclosure. If you have discovered a security vulnerability, we encourage you to let us know immediately. We welcome the opportunity to work with you to resolve the issue promptly.

Please report vulnerabilities via GitHub Security Advisories:

- https://github.com/un4gt/kilocode/security/advisories/new

After the initial reply to your report, the security team will keep you informed of the progress towards a fix and full announcement, and may ask for additional information or guidance.

If your report is specific to upstream hosted services (for example `api.kilo.ai`), please contact the upstream project separately as this fork does not operate those services.
