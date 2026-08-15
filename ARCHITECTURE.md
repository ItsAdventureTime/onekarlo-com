# System Architecture Guide

This document describes the public site's frontend, build boundary, and
deployment contract. It deliberately omits client identities, locations,
hostnames, addresses, and private infrastructure details.

## Design principles

1. **Progressive enhancement**: the document remains meaningful HTML; TypeScript
   adds filtering, dialogs, terminal behavior, and topology interaction.
2. **Small runtime surface**: Vite compiles native TypeScript and CSS without a
   frontend framework runtime or client-side router.
3. **Data-driven content**: project, profile, navigation, terminal, and topology
   content live in typed source modules rather than being duplicated in event
   handlers or styles.
4. **Privacy by default**: public copy uses capability and system-pattern
   language. Identifying client, company, location, host, and credential data
   stays out of the public repository.
5. **Reproducible delivery**: builds run from the lockfile in a pinned Node.js
   container; production delivery validates the target before synchronization.

## Runtime flow

```text
[ Browser ]
    │ HTTPS
    ▼
[ Optional edge/CDN ]
    │ static request
    ▼
[ Caddy in rootless Podman ]
    │ read-only site mount
    ▼
[ dist/ ]
    ├── index.html
    ├── assets/*.js
    ├── assets/*.css
    └── public fallback files
```

Caddy serves the generated static directory. The site has no server-side
application, runtime database, or API dependency in the browser.

## Frontend modules

```text
index.html
└── src/main.ts
    ├── src/data.ts       profile, navigation, terminal, topology data
    ├── src/projects.ts   active-project data and project UI
    ├── src/terminal.ts   simulated command-line interaction
    ├── src/topology.ts   node inspector and connection state
    ├── src/clipboard.ts  copy interaction and status feedback
    └── src/styles/
        ├── tokens.css       colors, type, spacing, motion tokens
        ├── main.css         layout and global rules
        └── components.css   section and component styles
```

`src/projects.ts` owns the Active Projects & Systems collection. Each entry
contains a stable identifier, a category, a short capability description,
representative systems, a status, and optional detail content. Rendering,
filter state, dialog state, focus return, and empty-state messaging remain in
the same feature boundary.

## Interaction and accessibility

The project collection uses semantic controls rather than clickable containers:

- category filters expose their pressed state with `aria-pressed`;
- project cards are keyboard-operable and open a labeled dialog;
- Escape closes the dialog and focus returns to the triggering card;
- visible focus styles remain available for keyboard navigation;
- pointer-follow decoration is nonessential and disabled for reduced-motion
  users;
- the layout collapses to a single readable column on narrow viewports.

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) as the accessibility reference
and [the reduced-motion media feature guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
when changing interaction or animation behavior.

## Build boundary

The production command is `vite build`, which creates a static bundle in
`dist/`. The repository also exposes `npm run build:podman`; it copies only
the package manifests, Vite entry files, `src/`, and `public/` into an isolated
Node.js container before running `npm ci` and the production build.

The build boundary excludes `.git`, host sockets, credentials, and unrelated
workspace files. `vite preview` may verify `dist/` locally but is not a
production server.

## Caddy and Quadlet contract

The files under `quadlet/` are sanitized reference fragments. They are not a
complete production installation and must not replace an operator's existing
multi-service unit or Caddyfile.

A rootless deployment convention is:

```ini
[Container]
Image=docker.io/library/caddy@sha256:98eb57d882ccd5213d1688764db10c1ca2c58a1ca3a6717a3411ad798f7a423a
ContainerName=caddy
Volume=%h/caddy/conf:/etc/caddy:ro,Z
Volume=%h/caddy/data:/data:Z
Volume=%h/caddy/config:/config:Z
Volume=%h/onekarlo-com:/srv/onekarlo-com:ro,Z
Exec=caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
```

Quadlet `.container` and `.volume` files are translated into systemd units.
Read the [Podman systemd unit documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
before installing or modifying them. Review the complete host unit for its
actual networks, mounts, image policy, and service dependencies.

## Caddy site contract

The merge fragment in `quadlet/Caddyfile.snippet` models the site-specific
contract:

```caddyfile
onekarlo.com {
    root * /srv/onekarlo-com
    import common_security
    import onekarlo_portfolio_csp
    import private_noindex

    @html path / /index.html
    header @html >Cache-Control "public, max-age=300, must-revalidate"

    @versioned_assets path /assets/*
    header @versioned_assets >Cache-Control "public, max-age=31536000, immutable"

    file_server {
        hide data config storage database db uploads backups .git .env* *.db *.sqlite *.sqlite3
    }
}
```

The complete Caddyfile remains the source of truth. `deploy.sh` checks the
fragment's formatting, validates the active Caddyfile inside the running
container, synchronizes generated public files, and reloads only after a
successful verification.

## Deployment boundary

`deploy.sh` requires:

- `DEPLOY_TARGET=local` for a configured local Caddy container, or an explicit
  SSH destination for a remote host;
- `DEPLOY_ROOT` equal to the host-side source of the `/srv/onekarlo-com` bind
  mount;
- a running Caddy container with a valid Caddyfile;
- local Podman and rsync, plus SSH for remote targets.

The script never installs Quadlets, replaces the complete Caddyfile, creates a
production target, or embeds a host address. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
for the runbook.

## Change impact guide

| Change | Primary files | Verification |
| --- | --- | --- |
| Project content | `src/projects.ts`, `docs/CONTENT-GUIDE.md` | build, content/privacy review |
| Filter or dialog behavior | `src/projects.ts`, `src/main.ts` | keyboard and mobile QA |
| Layout or motion | `src/styles/` | desktop/mobile/reduced-motion QA |
| Terminal or topology | `src/terminal.ts`, `src/topology.ts` | build and interaction QA |
| Delivery behavior | `deploy.sh`, `docs/DEPLOYMENT.md` | `bash -n`, container build, dry review |
| Caddy reference | `quadlet/`, `ARCHITECTURE.md` | format and syntax review |
