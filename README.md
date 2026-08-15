# onekarlo.com — Engineering Portfolio

[![Node.js](https://img.shields.io/badge/Node.js-22%20container%20build-green.svg)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF.svg)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)](https://www.typescriptlang.org)
[![Podman](https://img.shields.io/badge/Build-Podman-892CA0.svg)](https://podman.io)

This repository contains the source for a personal engineering portfolio. It
uses a small static frontend to explain active projects, systems work, and the
operational thinking behind them.

Public project copy is intentionally anonymized. It describes capabilities,
constraints, outcomes, and representative system patterns without naming
clients, companies, locations, hosts, or private infrastructure.

## What it demonstrates

- A data-driven **Active Projects & Systems** section with category filters,
  accessible project details, and mobile-friendly cards.
- A simulated terminal and topology inspector built with browser APIs.
- A lightweight HTML, TypeScript, and CSS application with no frontend
  framework runtime.
- A containerized build and a guarded Caddy deployment path for static output.

## Stack

| Layer | Tools |
| --- | --- |
| Frontend | HTML, TypeScript, Vite, modular CSS, design tokens |
| Runtime | Native browser APIs and ES modules |
| Build | Node.js 22 container, npm lockfile, Vite production build |
| Delivery | Podman, rootless Caddy, systemd Quadlet references, rsync |

## Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Document shell, metadata, and section anchors |
| `src/data.ts` | Profile, navigation, terminal, and topology data |
| `src/projects.ts` | Active-project data and project rendering |
| `src/styles/` | Tokens, layout, and component styles |
| `public/` | Static assets and fallback pages |
| `quadlet/` | Sanitized Caddy and Quadlet reference fragments |
| `docs/` | Content, deployment, and release guides |
| `deploy.sh` | Build, preflight, sync, and Caddy reload script |

## Local development

Prerequisites:

- Node.js compatible with the checked-in lockfile (the containerized build uses
  Node.js 22).
- npm.
- Podman for the reproducible build and deployment workflows.

Install and start the development server:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The development server supports live reload.

Run a host-independent production build:

```bash
podman info
npm run build:podman
```

The build copies only the required source inputs into a disposable container,
then writes the production bundle to `dist/`. For a local production preview:

```bash
npm run preview
```

`vite preview` is for verification, not a production web server. See the
[Vite production build guide](https://vite.dev/guide/build).

## Deployment

`deploy.sh` requires an explicit target. It never embeds a production host or
filesystem location.

For an already-configured local Caddy container:

```bash
DEPLOY_TARGET=local \
DEPLOY_ROOT="$HOME/onekarlo-com" \
./deploy.sh
```

For a configured remote host:

```bash
DEPLOY_TARGET=deploy-user@deploy-host \
DEPLOY_ROOT=/srv/onekarlo-com \
./deploy.sh
```

The script:

1. Validates Podman, rsync, and the target parameters.
2. Verifies the Caddy container is running and maps `/srv/onekarlo-com` to
   `DEPLOY_ROOT`.
3. Validates the active Caddyfile before changing public files.
4. Builds in an isolated, pinned Node.js container.
5. Synchronizes generated files while preserving site-owned state and replacing
   versioned assets without stale files.
6. Reloads the already-validated Caddy configuration.

It does not install Quadlets, replace a complete Caddyfile, create directories,
or deploy to an unspecified host. Read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
before using a new target.

The files under `quadlet/` are sanitized reference fragments. Podman Quadlets
are declarative systemd units; review the [Podman Quadlet
documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
and merge references into the operator's complete unit rather than replacing
an existing multi-service configuration.

## Content and privacy

Use [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) when changing the Active
Projects & Systems section. Keep public entries capability-focused and remove
client names, company names, geographic locations, IP addresses, usernames,
filesystem paths, credentials, and identifying project metadata.

## GitHub HTTPS workflow

GitHub authentication and Git credential setup use the official GitHub CLI:

```bash
gh auth status --hostname github.com
gh auth setup-git --hostname github.com
git remote get-url origin
```

The `origin` URL must use `https://github.com/...`, never SSH. Local commits
remain local Git operations; authenticated remote transport is provided by
`gh auth setup-git`. See [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md)
for the complete review, commit, and push sequence.

## Further reading

- [System architecture guide](ARCHITECTURE.md)
- [Contributing guide](CONTRIBUTING.md)
- [Deployment runbook](docs/DEPLOYMENT.md)
- [Content guide](docs/CONTENT-GUIDE.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)

## License

© 2026 Juan Karlo de Guzman. Source code is released under the MIT License.
