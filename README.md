# onekarlo.com: Engineering Portfolio

[![Docker Sandbox](https://img.shields.io/badge/Local%20Build-Docker%20Sandbox-2496ED.svg)](https://docs.docker.com/ai/sandboxes/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF.svg)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6.svg)](https://www.typescriptlang.org)
[![Caddy](https://img.shields.io/badge/VPS-Caddy-1F88C0.svg)](https://caddyserver.com/)

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
- A sandboxed build and a guarded Caddy deployment path for static output.

## Stack

| Layer | Tools |
| --- | --- |
| Frontend | HTML, TypeScript, Vite, modular CSS, design tokens |
| Runtime | Native browser APIs and ES modules |
| Build | Docker Sandbox, npm lockfile, Vite production build |
| Local execution | Docker Sandbox via `jk-sbx-project` |
| Delivery | SSH/rsync, rootless Caddy, systemd Quadlet references |

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

- Docker Desktop (or a compatible Docker Engine).
- The `jk-sbx-project` command-line wrapper.
- `rsync` and `ssh` when using the production deployment script; Podman remains
  a VPS-side Caddy prerequisite.

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
jk-sbx-project exec npm run build
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

`deploy.sh` is configured for the production VPS in this repository. Run it
directly from the project root:

```bash
./deploy.sh
```

If a checkout has lost the executable bit, use `bash ./deploy.sh` once and
restore the mode before committing with `chmod +x deploy.sh`.

The script expects the existing rootless Caddy service to use:

- `/home/jk/caddy/conf/Caddyfile` on the VPS;
- `/home/jk/.config/containers/systemd/caddy/caddy.container`;
- `/home/jk/onekarlo-com` as the host-side web root.

The script:

1. Builds locally inside the initialized Docker Sandbox.
2. Validates rsync, SSH, and the fixed VPS paths.
3. Verifies the Caddy container is running and maps `/srv/onekarlo-com` to
`/home/jk/onekarlo-com`.
4. Validates the active Caddyfile before changing public files.
5. Synchronizes generated files while preserving site-owned state and replacing
   versioned assets without stale files.
6. Reloads the already-validated Caddy configuration through the VPS's
   rootless Podman-managed Caddy container.

The deployment workstation does not need Podman; only the VPS-side Caddy
service uses it for validation and reload.

It does not install Quadlets, replace a complete Caddyfile, or create missing
production directories. Read [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) before
changing the fixed target.

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

## GitHub HTTPS and signed-commit workflow

GitHub authentication and Git credential setup use the official GitHub CLI:

```bash
gh auth status --hostname github.com
gh auth setup-git --hostname github.com
gh config get git_protocol
git remote get-url origin
```

The `origin` URL must use `https://github.com/...`, never SSH. Local commits
remain local Git operations; authenticated HTTPS transport is provided by
`gh auth setup-git`. `gh` does not sign a local commit for you, so keep Git
commit signing enabled and verify the resulting signature before pushing. See
the [GitHub commit-signing guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
and [docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md) for the complete
review, commit, and push sequence.

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
