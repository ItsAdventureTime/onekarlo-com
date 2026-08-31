# onekarlo.com: Engineering Portfolio

[![Docker Sandbox](https://img.shields.io/badge/Local%20Build-Docker%20Sandbox-2496ED.svg)](https://docs.docker.com/ai/sandboxes/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF.svg)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)](https://www.typescriptlang.org)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020.svg)](https://developers.cloudflare.com/workers/)

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
- Core Web Vitals & LCP performance optimization (`font-size-adjust` metric stabilization,
  `content-visibility: auto` layout deferral, and zero-runtime CSS).
- WCAG 2.2 AA accessibility (streamlined keyboard tab flow, high-contrast tokens,
  and minimum 44px touch targets).
- Memory-safe client lifecycles with guarded `requestAnimationFrame` and event cleanup.
- A lightweight HTML, TypeScript, and CSS application with no frontend
  framework runtime.
- A sandboxed build and Cloudflare Workers Static Assets deployment path.

## Stack

| Layer | Tools |
| --- | --- |
| Frontend | HTML, TypeScript, Vite, modular CSS, design tokens |
| Runtime | Native browser APIs and ES modules |
| Build | Docker Sandbox, npm lockfile, Vite production build |
| Local execution | Docker Sandbox via `jk-sbx-project` |
| Delivery | Cloudflare Workers Static Assets |

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
| `wrangler.jsonc` | Cloudflare Workers Static Assets configuration |
| `scripts/wrangler.sh` | Wrangler launcher with a writable npm prefix |
| `deploy.sh` | Legacy VPS Caddy deployment script |

The optional `compose.yaml` provides an Alpine build container and local Nginx
demo. Its `node_modules` named volume is generated state; use
`docker compose down -v` when recovering from an incomplete dependency install.

## Local development

Prerequisites:

- Docker Desktop (or a compatible Docker Engine).
- The `jk-sbx-project` command-line wrapper.
- `rsync` and `ssh` only when using the legacy VPS Caddy deployment script.

The repository's local execution plane is a deterministic Docker Sandbox. From
the project root:

```bash
jk-sbx-project ensure
jk-sbx-project exec npm ci
jk-sbx-project exec-bg npm run dev
jk-sbx-project publish 3000
```

Open `http://localhost:3000`. The development server supports live reload.

Run a host-independent production build in the sandbox:

```bash
docker compose run --rm build
```

For a local production preview, stop the dev server first, then run:

```bash
jk-sbx-project exec-bg npm run preview
jk-sbx-project publish 3000
```

`vite preview` is for verification, not a production web server. See the
[Vite production build guide](https://vite.dev/guide/build).
See [docs/LOCAL-DEVELOPMENT.md](docs/LOCAL-DEVELOPMENT.md) for the complete
sandbox workflow.

## Deployment

Deploy the Vite output to Cloudflare Workers Static Assets:

```bash
jk-sbx-project exec npm run build
docker compose run --rm build npm run verify:workers
docker compose run --rm build npm run preview:workers
docker compose run --rm build npm run deploy:workers
```

Authenticate once with the container-safe device flow:

```bash
docker compose run --rm build \
  ./node_modules/.bin/wrangler login --device
```

Read [the Workers deployment guide](docs/CLOUDFLARE-WORKERS.md) for the
one-time login, preview verification, custom-domain cutover, and CI setup.
The existing VPS Caddy files remain available only for an intentional rollback.

## Content and privacy

Use [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) when changing the Active
Projects & Systems section. Keep public entries capability-focused and remove
client names, company names, geographic locations, IP addresses, usernames,
filesystem paths, credentials, and identifying project metadata.

## GitHub HTTPS workflow

GitHub authentication and Git credential setup use the official GitHub CLI over
HTTPS:

```bash
gh auth status --hostname github.com
gh auth setup-git --hostname github.com
gh config get git_protocol
git remote get-url origin
```

The `origin` URL must use `https://github.com/...`, never SSH. Local commits
remain local Git operations; authenticated HTTPS transport is provided by
`gh auth setup-git`. HTTPS authentication does not create a cryptographic
commit signature. Use `git commit -S` only when a working GPG, SSH, or S/MIME
signer is configured; otherwise use a normal local commit and do not describe
it as signed. See [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md) for
the complete review, commit, and push sequence.

## Further reading

- [System architecture guide](ARCHITECTURE.md)
- [UI and UX guide](docs/UI-UX-GUIDE.md)
- [Contributing guide](CONTRIBUTING.md)
- [Deployment runbook](docs/DEPLOYMENT.md)
- [Local development guide](docs/LOCAL-DEVELOPMENT.md)
- [Content guide](docs/CONTENT-GUIDE.md)
- [Release checklist](docs/RELEASE-CHECKLIST.md)

## License

© 2026 Juan Karlo de Guzman. Source code is released under the MIT License.
