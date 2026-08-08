# onekarlo.com — Personal Engineering & Systems Portfolio

[![Node.js](https://img.shields.io/badge/Node.js-v26.5.0-green.svg)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-v6.4.3-646CFF.svg)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.3-3178C6.svg)](https://www.typescriptlang.org)
[![Podman](https://img.shields.io/badge/Podman-Quadlets-892CA0.svg)](https://podman.io)
[![Fedora CoreOS](https://img.shields.io/badge/OS-Fedora%20CoreOS-51A2DA.svg)](https://fedoraproject.org/coreos)
[![Caddy](https://img.shields.io/badge/Caddy-HTTP%2F3-00B4D8.svg)](https://caddyserver.com)
[![Signatures](https://img.shields.io/badge/Commits-1Password%20SSH%20Signed-blue.svg)](https://1password.com)

Welcome! This repository holds the source code and infrastructure configurations for [onekarlo.com](https://onekarlo.com), the personal website and systems engineering portfolio of **Juan Karlo "JK" de Guzman**.

I built this site to showcase real-world production projects across remote operations management, Linux platform engineering, self-hosted AI model infrastructure, and educational program direction.

---

## 💡 How It Works

Instead of pulling in heavy JavaScript frameworks or complex single-page app routers for a personal portfolio, I kept things simple, fast, and durable:

- **Framework-Agnostic Core**: Written in plain HTML5, Vanilla TypeScript, and modular CSS using design tokens. The entire site compiles into a lightweight ~10 kB HTML payload in under 150 milliseconds.
- **Interactive Terminal & Topology Inspector**: Features a simulated CLI shell and a interactive server node inspector showing real-time traffic flow through CDN, reverse proxy, host OS, and container layers.
- **Immutable Linux Host**: Hosted on Fedora CoreOS, an immutable Linux distribution where system updates apply atomically via `rpm-ostree`.
- **Rootless Podman Quadlets**: Container services (like Caddy Server) run rootless using Podman Quadlets, which compile `.container` and `.volume` files directly into native systemd user services.

For a deeper dive into the infrastructure setup, check out [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 🛠️ Tech Stack at a Glance

| Layer | Tools & Technologies |
|---|---|
| **Frontend** | HTML5, Vanilla TypeScript 5.7, Vite 6, Custom CSS Tokens, Glassmorphic UI |
| **Container Engine** | Podman Rootless + Systemd Quadlets (`.container` & `.volume`) |
| **Web Server** | Caddy Server (Rootless container, automatic TLS 1.3, HTTP/3) |
| **Host OS** | Fedora CoreOS (Immutable base, atomic `rpm-ostree` updates, SELinux Enforcing) |
| **CDN & Edge** | Bunny.net Anycast CDN (DDoS mitigation, Brotli compression, Edge Caching) |
| **AI Workloads** | Ubuntu Cloud GPUs (RunPod & Hyperstack), PyTorch, vLLM, Bifrost (Go proxy), big-AGI |

---

## 🚀 Getting Started

If you want to run or inspect the project locally, follow these steps.

### Prerequisites
- **Node.js**: v26+ (or Node LTS)
- **npm**: v11+
- **Podman**: (Optional, if testing containerized builds locally)

### 1. Clone the repository
```bash
git clone https://github.com/ItsAdventureTime/onekarlo-com.git
cd onekarlo-com
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the dev server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. Live reloading is enabled out of the box.

### 4. Build for production
### 3. Production & Transient Container Build
All build compilations run strictly inside transient `node:alpine` containers via local macOS Podman (`podman machine start`). Containers automatically self-destruct (`--rm`) upon completion to prevent disk clutter and leftover build caches:

```bash
# Ensure Podman machine is running
podman machine start

# Run transient containerized build (--rm self-destructs container on exit)
npm run build:podman
```
The output compiles cleanly into `dist/`.

---

## 📦 Deployment Pipeline

Deployments run via `deploy.sh`. The script builds the static site inside a transient `node:alpine` Podman container (so your host machine doesn't need global dependencies installed) and syncs the compiled `dist/` directory to the server over SSH using `rsync`:

```bash
# Single-line containerized build & sync
podman run --rm -e NPM_CONFIG_UPDATE_NOTIFIER=false -v "$PWD:/app:z" -w /app docker.io/library/node:alpine sh -c "npm install --no-audit --no-fund --no-notice --quiet && npm run build" && \
rsync -avz --delete --exclude='.DS_Store' --exclude='._*' --exclude='.Spotlight-V100' --exclude='.Trashes' "dist/" gatewaysentry:/home/jk/onekarlo-com/
```

---

## 🛡️ Privacy & Commit Signing

- **1Password SSH Commit Signing**: Every commit in this repository is signed using my 1Password SSH key agent (`op-ssh-sign`).
- **Anonymized Remote Configuration**: All production SSH host details use local SSH config aliases (`gatewaysentry`), ensuring no private IP addresses or personal credentials leak into public commits.
- **Private Documentation**: Personal context prompts and internal operational notes are excluded from version control via `.gitignore`.

---

## 🤝 Contributing & Feedback

Got questions or suggestions? Take a look at [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on opening issues, running test audits, or submitting pull requests.

---

## 📄 License

© 2026 **Juan Karlo "JK" de Guzman**. Source code released under the MIT License.
Hosting provided by [GatewaySentry](https://gatewaysentry.com).
