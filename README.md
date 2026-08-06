# onekarlo.com — Tech Infrastructure & Operations Portfolio

[![Node.js](https://img.shields.io/badge/Node.js-v26.5.0-green.svg)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-v6.4.3-646CFF.svg)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.3-3178C6.svg)](https://www.typescriptlang.org)
[![Podman](https://img.shields.io/badge/Podman-Quadlets-892CA0.svg)](https://podman.io)
[![Fedora CoreOS](https://img.shields.io/badge/OS-Fedora%20CoreOS-51A2DA.svg)](https://fedoraproject.org/coreos)
[![Caddy](https://img.shields.io/badge/Caddy-HTTP%2F3-00B4D8.svg)](https://caddyserver.com)
[![Signatures](https://img.shields.io/badge/Commits-1Password%20SSH%20Signed-blue.svg)](https://1password.com)

The official personal web portfolio and systems architecture showcase for **Juan Karlo "JK" de Guzman** — *Remote Operations Manager, Tech Infrastructure Specialist, & Systems Consultant*.

Live Site: [onekarlo.com](https://onekarlo.com)

---

## ⚡ Architecture Overview

```text
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│     Bunny.net Anycast     │ ───► │    Caddy Reverse Proxy    │ ───► │     Fedora CoreOS Host    │
│  (Global Edge & DDoS)     │      │   (Systemd Podman Quadlet)│      │  (Immutable rpm-ostree)   │
└───────────────────────────┘      └───────────────────────────┘      └─────────────┬─────────────┘
                                                                                    │
                                                                                    ▼
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│    vLLM + PyTorch Cloud   │ ◄─── │   Bifrost Go Proxy Router │ ◄─── │   Podman Rootless Engine  │
│  (Ubuntu RunPod/Hyper)    │      │  (big-AGI Multi-Model UI) │      │  (.container & .volume)   │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

---

## 🎯 Key Features

- **Framework-Agnostic Static Architecture**: Zero heavy frontend runtime dependencies. Compiled via **Vite 6** + **TypeScript 5.7** into pure HTML, CSS, and ES modules (`~10kB` HTML, `~120ms` build time).
- **Interactive CLI Terminal Emulator**: Embedded browser terminal simulation supporting commands like `status`, `skills`, `architecture`, `projects`, and `contact`.
- **System Topology Inspector**: Dynamic interactive node inspector visualising edge-to-origin data flow, systemd Quadlet mounts, and security controls.
- **Filterable Case Studies**: Showcase of production work across AI infrastructure, financial control software, Linux platform engineering, and ESL program operations.
- **Core Web Vitals Optimized**: Critical CSS inlining, font preloading (`fetchpriority="high"`), `font-display: swap`, and zero render delay.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | HTML5, Vanilla TypeScript 5.7, Vite 6, CSS Design Tokens, Glassmorphism |
| **Container Engine** | Podman Rootless, Systemd Quadlets (`.container`, `.volume`) |
| **Origin Web Server** | Caddy Server (Rootless Podman container, automatic TLS 1.3) |
| **Operating System** | Fedora CoreOS (Immutable base, atomic `rpm-ostree` updates, SELinux Enforcing) |
| **Edge CDN** | Bunny.net Anycast CDN (DDoS protection, Brotli compression, Edge Caching) |
| **AI Infrastructure** | Ubuntu Cloud GPUs (RunPod & Hyperstack), PyTorch, vLLM, Bifrost (Go proxy), big-AGI |

---

## 💻 Local Development

### Prerequisites
- Node.js `v26+` (or Node LTS)
- npm `v11+`
- Podman (optional for containerized builds)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
```bash
# Local fast build
npm run build

# Containerized Podman build (isolated Node Alpine container)
npm run build:podman
```

---

## 🚀 Production Deployment (`deploy.sh`)

Deployments use an automated script that compiles static assets inside a transient `node:alpine` Podman container and syncs compiled assets (`dist/`) directly to the production web root over SSH:

```bash
# Execute local Podman build and sync to production server
podman run --rm -e NPM_CONFIG_UPDATE_NOTIFIER=false -v "$PWD:/app:z" -w /app docker.io/library/node:alpine sh -c "npm install --no-audit --no-fund --no-notice --quiet && npm run build" && \
rsync -avz --delete --exclude='.DS_Store' --exclude='._*' --exclude='.Spotlight-V100' --exclude='.Trashes' "dist/" gatewaysentry:/home/jk/onekarlo-com/
```

---

## 🔒 Security & Privacy Controls

- **Zero-IP & Email Exposure**: Server IP addresses and personal emails are abstracted behind local SSH host aliases (`gatewaysentry`) and GitHub no-reply aliases.
- **100% Signed Commits**: Every Git commit is signed using **1Password SSH Key Integration** (`op-ssh-sign`).
- **Private Documentation**: System context prompts, prompt instructions, and internal notes are excluded from Git tracking via strict `.gitignore` rules.

---

## 📄 License & Attribution

© 2026 **Juan Karlo "JK" de Guzman**. All rights reserved.
Hosted on rootless Podman Quadlets on Fedora CoreOS via [GatewaySentry](https://gatewaysentry.com).
