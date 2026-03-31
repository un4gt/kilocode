# kilocode-- (kilocode lite) Privacy Notes

**Last Updated: March 31, 2026**

This repository is a community-maintained fork. The software runs locally and is committed to transparency about where data may be sent.

### **Where Your Data Goes (And Where It Doesn't)**

- **Code & Files**: The extension/runtime can access files on your local machine when needed for AI-assisted features. When you use an AI provider, relevant context may be sent to that provider (e.g., OpenAI, Anthropic, OpenRouter) to generate responses. AI providers may store or retain data per their policies.
- **Commands**: Commands run on your local environment. If you use AI-powered features, command output and surrounding context may be sent to your configured AI provider.
- **Prompts & AI Requests**: Prompts and relevant project context may be sent to your configured AI provider to generate responses.
- **Upstream Kilo Services**: Some features may communicate with upstream Kilo endpoints by default (for example `https://api.kilo.ai`) unless you override them (see `KILO_API_URL` and related variables in `CONTRIBUTING.md`). Those services are not operated by this fork.
- **API Keys & Credentials**: Provider credentials are stored locally on your device and only sent to the provider(s) you configure.

### **Your Choices & Control**

- You can run models locally to prevent data being sent to third-parties.

### **Security & Updates**

We take reasonable measures to secure your data, but no system is 100% secure. If our privacy policy changes, we will update this document and note the changes in our release notes.

### **Contact Us**

For privacy-related questions about this fork, please open an issue:

- https://github.com/un4gt/kilocode/issues

---

By using the software, you acknowledge that network requests may be made to configured third-party services, and that your configured providers’ policies apply to any data you send them.
