# Deployment runbook

`deploy.sh` is intentionally configured for one production VPS. The normal
deployment command is:

```bash
bash ./deploy.sh
```

Do not set `DEPLOY_TARGET`, `DEPLOY_ROOT`, or other deployment variables. The
script already knows the SSH target and the paths for this server. If the
repository is ever shared with someone who must not know the production
endpoint, replace the fixed values in `deploy.sh` before sharing it.

## Fixed server contract

| Resource | Path or value |
| --- | --- |
| Caddy data directory | `/home/jk/caddy/` |
| Host Caddyfile | `/home/jk/caddy/conf/Caddyfile` |
| Rootless Quadlet | `/home/jk/.config/containers/systemd/caddy/caddy.container` |
| Host web root | `/home/jk/onekarlo-com` |
| Caddy config inside the container | `/etc/caddy/Caddyfile` |
| Web root inside the container | `/srv/onekarlo-com` |
| Container name | `caddy` |

The host web root and the Caddy config directory must already exist. The
script does not install the Quadlet, create production directories, or replace
the complete operator-managed Caddyfile.

## Prerequisites

The workstation needs:

- Podman with a running machine or service;
- `rsync` and `ssh`;
- network access to the VPS;
- an SSH key or the VPS password.

The VPS needs rootless Podman, `rsync`, `awk`, a running `caddy` container, and
the Quadlet at the fixed path above. The Caddy service should mount:

```ini
Volume=/home/jk/caddy/conf:/etc/caddy:ro,Z
Volume=/home/jk/onekarlo-com:/srv/onekarlo-com:ro,Z
```

Podman documents `~/.config/containers/systemd/` as a rootless Quadlet search
path and recommends managing the generated service with user-level systemd:
[Podman systemd units](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html).

## What the script does

1. Reuses one SSH connection so a password prompt is not repeated for every
   phase.
2. Checks the fixed Caddy directory, Caddyfile, Quadlet, and web root.
3. Confirms the running container maps the expected host paths.
4. Expands the two absolute handler imports, then streams the Caddyfile to
   `caddy validate --config -` inside the running container.
5. Builds the site in a pinned Node.js Podman container.
6. Syncs generated files to `/home/jk/onekarlo-com` while preserving unrelated
   root entries and replacing stale hashed assets.
7. Reloads Caddy only after validation and a successful sync.

Caddy documents `caddy validate` as a stronger check than config adaptation,
because it also loads and provisions modules without starting the server. The
script uses the documented Caddyfile adapter explicitly:
[Caddy command line](https://caddyserver.com/docs/command-line).

## Local checks

Run these before committing changes:

```bash
podman info
npm run build:podman
bash -n deploy.sh
git diff --check
```

Do not run `vite preview` as the production server. It is for local
verification only. The production build guide is available in the
[Vite documentation](https://vite.dev/guide/build).

## Troubleshooting

### Caddyfile permission denied

The live Caddyfile is bind-mounted read-only and may not be readable from the
container's rootless user namespace, even when validation runs as container
root. The script therefore reads the host file as the SSH user, expands the
two absolute handler imports, and streams the complete configuration to Caddy
through standard input. It uses the same approach during reload and does not
weaken permissions on the active Caddy configuration.

If validation still fails, inspect the host file permissions and the active
mounts. Do not make the complete Caddyfile world-readable just to bypass the
check.

### Mount mismatch

The script stops before syncing if the running container does not map:

```text
/home/jk/onekarlo-com -> /srv/onekarlo-com
/home/jk/caddy/conf -> /etc/caddy
```

Review the active Quadlet, then reload the user service after an intentional
change:

```bash
systemctl --user daemon-reload
systemctl --user restart caddy.service
```

### SSH password prompts

The script uses a temporary SSH control socket during the run. A password may
be requested once. For regular deployments, configure an SSH key for the
fixed host rather than putting a password in the script or an environment
variable.

### Failed reload after sync

The script reports this separately because the web files have already been
synced. Review the Caddy journal, correct the configuration, validate it again,
and reload the running service. Do not delete the web root as a recovery step.

## Related references

- [Podman systemd units](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
- [Caddy command line](https://caddyserver.com/docs/command-line)
- [Vite production build](https://vite.dev/guide/build)
