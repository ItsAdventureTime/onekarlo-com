# Deployment Runbook

deploy.sh builds the static site in Podman, verifies the Caddy target, syncs
the generated public files, and reloads the already-validated Caddy
configuration.

The script intentionally contains no production hostname, address, username,
or host filesystem location. Set the target explicitly for every deployment.

## Deployment contract

| Variable | Required | Meaning |
| --- | --- | --- |
| DEPLOY_TARGET | yes | local or an explicit SSH destination |
| DEPLOY_ROOT | no | Host-side source of /srv/onekarlo-com; defaults to /srv/onekarlo-com |
| CADDY_CONTAINER | no | Running container name; defaults to caddy |
| CADDYFILE_PATH | no | Path inside the Caddy container; defaults to /etc/caddy/Caddyfile |
| NODE_IMAGE | no | Pinned Node.js build image override |
| CADDY_IMAGE | no | Caddy image used only for fragment formatting |

DEPLOY_ROOT is a host path. /srv/onekarlo-com is the container-side mount
destination and is not automatically created by the script.

## Prerequisites

Local workstation:

- Podman with a working machine or service;
- rsync;
- ssh for a remote target;
- access to the configured Caddy host.

Remote host:

- rootless Podman;
- a running Caddy container managed by the operator's systemd/Quadlet setup;
- a writable web-root directory mounted at /srv/onekarlo-com;
- a Caddyfile that validates inside the running container.

The script does not install a Quadlet, create the Caddyfile, create the web
root, or change unrelated services.

## Local validation

Run the build and shell checks before any live sync:

~~~bash
podman info
npm run build:podman
bash -n deploy.sh
git diff --check
~~~

If the Caddy fragment changed, format-check it with the same Caddy image policy
used by the deployment script. Review the complete host Caddyfile separately;
the checked-in fragment is not a replacement configuration.

## First-time target verification

Confirm the target's actual mount before choosing DEPLOY_ROOT:

~~~bash
ssh deploy-user@deploy-host \
  podman inspect --format '{{range .Mounts}}{{if eq .Destination "/srv/onekarlo-com"}}{{.Source}}{{end}}{{end}}' \
  caddy
~~~

The printed source must exactly equal DEPLOY_ROOT. If it does not, stop and
review the active Quadlet. Do not deploy to a guessed directory.

For a reviewed Quadlet or Caddyfile change, reload the operator-managed user
service first:

~~~bash
ssh deploy-user@deploy-host systemctl --user daemon-reload
ssh deploy-user@deploy-host systemctl --user restart caddy.service
~~~

## Run the script

For a configured local Caddy host:

~~~bash
DEPLOY_TARGET=local \
DEPLOY_ROOT="$HOME/onekarlo-com" \
./deploy.sh
~~~

For a configured remote host:

~~~bash
DEPLOY_TARGET=deploy-user@deploy-host \
DEPLOY_ROOT=/srv/onekarlo-com \
./deploy.sh
~~~

## Safety behavior

Before synchronization, the script:

1. rejects empty or unsafe target/path values;
2. checks Podman and rsync availability;
3. checks that Caddy exists and is running;
4. verifies the /srv/onekarlo-com mount mapping;
5. validates the active Caddyfile;
6. builds from an allowlisted source copy in a disposable Node.js container.

The sync preserves unrelated entries at the web-root level. It replaces the
generated assets/ tree with deletion enabled so stale hashed assets do not
remain. The live bind-mounted directory is not an atomic whole-directory
swap; schedule a maintenance window if an atomic cutover is required.

Caddy reload occurs only after sync verification. If reload fails after files
are synchronized, the script reports the state; inspect the Caddy logs and
reload the validated configuration after fixing the cause.

## Recovery

1. Keep the last known-good Git commit and generated bundle available.
2. Fix the Caddy configuration or target mapping before retrying.
3. Re-run the script with the same explicit DEPLOY_TARGET and DEPLOY_ROOT.
4. If the bundle itself is wrong, check out or restore the last known-good
   commit in a separate working tree, build it, and deploy that output.

Do not delete the shared web root to recover. The script is designed to
preserve site-owned state outside generated public assets.

## Guidance applied

- [Vite production builds](https://vite.dev/guide/build) define the static
  vite build output and distinguish vite preview from production serving.
- [Podman Quadlet documentation](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
  defines rootless .container and .volume units and their systemd search
  paths.
- [GitHub deployment environments](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments)
  support branch restrictions, approvals, and environment-scoped secrets for
  any future automated deployment workflow.
- [GitHub secret guidance](https://docs.github.com/en/actions/concepts/security/secrets)
  supports keeping credentials out of source and exposing them only where a
  workflow explicitly requires them.
