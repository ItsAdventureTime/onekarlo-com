# Contributing Guidelines

Thanks for taking the time to check out this project! While `onekarlo.com` is primarily my personal portfolio, I welcome bug reports, performance suggestions, and ideas for improvements.

---

## 🛠️ Development Workflow

### 1. Environment Setup
Make sure you have Node.js (v26 or LTS) and npm installed.

```bash
# Clone the repository
git clone https://github.com/ItsAdventureTime/onekarlo-com.git
cd onekarlo-com

# Install dependencies
npm install
```

### 2. Local Development
Run the Vite development server:
```bash
npm run dev
```
Open `http://localhost:3000` to preview your changes in real time.

### 3. Code Standards & File Structure
- Keep components framework-agnostic. Logic lives in `src/`, with styles broken into `tokens.css`, `main.css`, and `components.css`.
- Use TypeScript type annotations for data models and state objects.
- Maintain dark-mode design tokens defined in `src/styles/tokens.css`.

---

## 🧪 Testing & Quality Audits

Before submitting changes or opening a pull request, run the automated quality audit script to verify UI/UX and performance rules:

```bash
# Build the production bundle
npm run build

# Run the quality audit test suite
node scratch/test_audit.js
```

### What the Audit Verifies:
1. **Em Dash Audit**: Checks that no raw em dashes are present in user-facing content.
2. **Contrast Audit**: Ensures navigation buttons maintain high contrast (`#040812 !important`).
3. **Mobile GPU Optimization**: Confirms touch devices disable heavy mouse cursor glow followers.
4. **Mobile Topology Grid**: Verifies 2-column mobile layout rules.
5. **Terminal Output Formatting**: Checks `white-space: pre-wrap` formatting for multi-line CLI text.
6. **LCP Performance Audit**: Ensures font preloads include `fetchpriority="high"`.

---

## 🔐 Commit Signing

All commits in this repository require SSH signature verification. If you are submitting commits, please ensure your Git client is configured to sign commits using an SSH key or GPG key:

```bash
# Example SSH commit signing configuration
git config --global gpg.format ssh
git config --global user.signingkey "ssh-ed25519 YOUR_PUBLIC_KEY"
git config --global commit.gpgsign true
```

---

## 📬 Reporting Issues

If you notice a bug, broken link, or accessibility issue:
1. Open an issue on [GitHub Issues](https://github.com/ItsAdventureTime/onekarlo-com/issues).
2. Describe the problem, include your browser/OS version, and attach a screenshot if applicable.

Thank you for helping keep this project clean, fast, and accessible!
