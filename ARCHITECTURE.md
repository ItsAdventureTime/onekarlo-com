# System Architecture & Infrastructure Guide

This document explains the technical design, host setup, and container management strategy behind [onekarlo.com](https://onekarlo.com).

---

## 🏗️ Architectural Core Principles

When building the infrastructure for this site, I prioritized three core principles:

1. **Host Immutability**: The operating system should be disposable and fully reproducible. System packages aren't installed directly on the host OS; container workloads run isolated on top.
2. **Minimal Runtime Overhead**: The frontend relies on native web APIs rather than client-side frameworks. This keeps initial page load fast and eliminates bundle bloat.
3. **Rootless Security by Default**: Every container process runs unprivileged without root access, minimizing the blast radius in the event of a container breakout.

---

## 🌐 End-to-End Traffic Flow

```text
[ User Browser ] 
       │ (HTTPS / HTTP3)
       ▼
[ Bunny.net Anycast CDN ] ── Edge Caching & DDoS Mitigation
       │ (TLS 1.3 / Proxy Headers)
       ▼
[ Fedora CoreOS Host ] ── Immutable OS (rpm-ostree / SELinux Enforcing)
       │ (Internal Socket / Port Forward)
       ▼
[ Caddy Web Server ] ── Rootless Podman Quadlet Service
       │ (Static File Serving)
       ▼
[ Static Assets (dist/) ] ── HTML5 / TypeScript ES Modules / CSS Tokens
```

---

## 🐧 Host Operating System: Fedora CoreOS

The server runs **Fedora CoreOS**, a minimal, container-focused operating system.

### Why Fedora CoreOS?
- **Atomic OS Updates**: Updates apply in the background using `rpm-ostree`. If an update ever fails, the system rolls back automatically on the next boot without breaking running containers.
- **Ignition & Declarative Setup**: Server provisioning relies on declarative Ignition configs, making it easy to recreate the server from scratch if needed.
- **SELinux in Enforcing Mode**: Mandatory Access Control (MAC) rules restrict what container processes can access on the filesystem.

---

## 📦 Container Engine: Podman Quadlets

Instead of managing container lifecycles with raw Docker CLI commands or external compose files, I use **Podman Quadlets**.

Quadlets are a feature built directly into Podman that automatically translates declarative container definition files (`.container` and `.volume`) into native `systemd` user services.

### Example Quadlet Config (`quadlet/Caddyfile.snippet`)

```ini
[Unit]
Description=Caddy Web Server for onekarlo.com
After=network-online.target

[Container]
Image=docker.io/library/caddy:alpine
ContainerName=caddy
PublishPort=80:80
PublishPort=443:443
Volume=%h/onekarlo-com:/usr/share/caddy:ro
Volume=%h/.config/containers/systemd/onekarlo-com/Caddyfile:/etc/caddy/Caddyfile:ro

[Install]
WantedBy=default.target
```

### Key Advantages of Quadlets:
- **Native Systemd Lifecycle**: Commands like `systemctl --user status caddy` or `journalctl --user -u caddy` work natively.
- **Automatic Restart & Recovery**: Systemd automatically restarts containers if they crash or after host reboots.
- **Rootless Execution**: Containers run under unprivileged user namespaces. Container process IDs map to non-root IDs on the host.

---

## 🧠 AI Infrastructure & Model Serving Stack

Beyond web hosting, my day-to-day operations involve managing self-hosted AI model serving infrastructure:

1. **Compute Instances**: PyTorch workloads run on Ubuntu cloud GPU instances rented from RunPod and Hyperstack.
2. **Inference Engine**: **vLLM** handles high-throughput LLM serving with PagedAttention and continuous batching.
3. **Go Proxy Router (Bifrost)**: A lightweight Go proxy manages request queuing, model fallback routing, and rate limits.
4. **Multi-Model Evaluation UI**: **big-AGI** serves as the frontend interface for side-by-side model testing, integrating OpenRouter and Hugging Face API routes.

---

## ⚡ Performance Optimization Strategy

To achieve near-instant initial page loads (LCP < 1.0s):

- **Font Preloading**: Critical web fonts use `<link rel="preload" fetchpriority="high">` alongside `font-display: swap` to prevent Flash of Invisible Text (FOIT).
- **Critical CSS Inlining**: Essential layout rules and dark theme variables are inlined directly into `<head>`, allowing the page shell to render on the very first painted frame.
- **Offscreen Section Deferral**: Offscreen content blocks use CSS `content-visibility: auto`, reducing initial layout calculations and main-thread work.
