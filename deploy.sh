#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# onekarlo.com deployment: isolated Podman build, target sync, and production
# Caddy validation. No production host or filesystem location is bundled.
#
# Set DEPLOY_TARGET and/or DEPLOY_ROOT before running this script.
# DEPLOY_TARGET=local remains the escape hatch for an already-configured local
# Podman Caddy host. Any other DEPLOY_TARGET is treated as an SSH destination.
# ============================================================================

echo "===================================================="
echo " Deploying onekarlo.com via Podman Container Build"
echo "===================================================="

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_TARGET="${DEPLOY_TARGET:-}"
DEPLOY_ROOT="${DEPLOY_ROOT:-/srv/onekarlo-com}"
CADDY_CONTAINER="${CADDY_CONTAINER:-caddy}"
# This is the path inside the Caddy container, not the host-side path.
CADDYFILE_PATH="${CADDYFILE_PATH:-/etc/caddy/Caddyfile}"
NODE_IMAGE="${NODE_IMAGE:-docker.io/library/node:22.14.0-alpine3.21}"
CADDY_IMAGE="${CADDY_IMAGE:-docker.io/library/caddy:alpine}"
BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/onekarlo-build.XXXXXX")"

cleanup() {
  rm -rf -- "${BUILD_DIR}"
}
trap cleanup EXIT

die() {
  echo "ERROR: $*" >&2
  exit 1
}
normalize_path() {
  case "$1" in
    /) printf '/\n' ;;
    *) printf '%s\n' "${1%/}" ;;
  esac
}

case "${DEPLOY_TARGET}" in
  local) ;;
  "") die "DEPLOY_TARGET is required; set it to local or a configured SSH host" ;;
  -*) die "DEPLOY_TARGET must not begin with '-' (SSH options are not accepted)" ;;
  *[!A-Za-z0-9_.:@-]*) die "DEPLOY_TARGET contains unsupported characters; use an SSH alias, hostname, or user@host" ;;
esac

case "${DEPLOY_ROOT}" in
  /*) ;;
  *) die "DEPLOY_ROOT must be an absolute path (got: ${DEPLOY_ROOT})" ;;
esac

case "${DEPLOY_ROOT}" in
  *[!A-Za-z0-9_./-]*) die "DEPLOY_ROOT contains unsupported characters; use an absolute path without shell metacharacters" ;;
esac

if [ "${DEPLOY_ROOT}" = "/" ]; then
  die "DEPLOY_ROOT must identify the site web root, not the filesystem root"
fi

case "${CADDY_CONTAINER}" in
  ""|-*|*[!A-Za-z0-9_.-]*) die "CADDY_CONTAINER contains unsupported characters; use a Podman container name" ;;
esac

case "${CADDYFILE_PATH}" in
  /*) ;;
  *) die "CADDYFILE_PATH must be an absolute path (got: ${CADDYFILE_PATH})" ;;
esac

case "${CADDYFILE_PATH}" in
  *[!A-Za-z0-9_./-]*) die "CADDYFILE_PATH contains unsupported characters; use an absolute path without shell metacharacters" ;;
esac

command -v podman >/dev/null 2>&1 || die "podman is required; start the Podman machine before deploying"
command -v rsync >/dev/null 2>&1 || die "rsync is required on the deployment workstation"
podman info >/dev/null || die "Podman is unavailable; start the Podman machine before deploying"

if [ "${DEPLOY_TARGET}" = "local" ]; then
  TARGET_DESCRIPTION="local Podman host"
else
  command -v ssh >/dev/null 2>&1 || die "ssh is required for remote target ${DEPLOY_TARGET}"
  TARGET_DESCRIPTION="SSH target ${DEPLOY_TARGET}"
fi

preflight_local() {
  local running mount_source mounts

  if ! podman container exists "${CADDY_CONTAINER}" 2>/dev/null; then
    die "Caddy container '${CADDY_CONTAINER}' is missing on the local Podman host; install the Quadlet and start it before using DEPLOY_TARGET=local"
  fi

  running="$(podman inspect --format '{{.State.Running}}' "${CADDY_CONTAINER}" 2>/dev/null || true)"
  if [ "${running}" != "true" ]; then
    die "Caddy container '${CADDY_CONTAINER}' exists but is not running; start the configured service before deployment"
  fi

  mounts="$(podman inspect --format '{{range .Mounts}}{{printf "%s\n" .Destination}}{{end}}' "${CADDY_CONTAINER}" 2>/dev/null || true)"
  mount_source="$(podman inspect --format '{{range .Mounts}}{{if eq .Destination "/srv/onekarlo-com"}}{{.Source}}{{end}}{{end}}' "${CADDY_CONTAINER}" 2>/dev/null || true)"
  if [ -z "${mount_source}" ]; then
    die "Caddy container '${CADDY_CONTAINER}' does not mount /srv/onekarlo-com.
Active mount destinations:
${mounts:-<none>}
Expected local source: ${DEPLOY_ROOT}
Check the active Quadlet and restart the configured caddy.service before deploying."
  fi
  if [ "$(normalize_path "${mount_source}")" != "$(normalize_path "${DEPLOY_ROOT}")" ]; then
    die "Caddy web-root mapping is '${mount_source}', but DEPLOY_ROOT is '${DEPLOY_ROOT}'.
Active mount destinations:
${mounts:-<none>}"
  fi
  if [ ! -d "${DEPLOY_ROOT}" ]; then
    die "DEPLOY_ROOT '${DEPLOY_ROOT}' does not exist on the local host"
  fi
  if [ ! -w "${DEPLOY_ROOT}" ]; then
    die "DEPLOY_ROOT '${DEPLOY_ROOT}' is not writable by the deployment user"
  fi

  if ! podman exec "${CADDY_CONTAINER}" caddy validate --config "${CADDYFILE_PATH}" --adapter caddyfile; then
    die "Caddyfile validation failed in local container '${CADDY_CONTAINER}'; fix ${CADDYFILE_PATH} before deployment"
  fi
}

preflight_remote() {
  if ! ssh -- "${DEPLOY_TARGET}" bash -s -- "${DEPLOY_ROOT}" "${CADDY_CONTAINER}" "${CADDYFILE_PATH}" <<'REMOTE_PREFLIGHT'
set -eu

deploy_root=$1
caddy_container=$2
caddyfile_path=$3

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

normalize_path() {
  case "$1" in
    /) printf '/\n' ;;
    *) printf '%s\n' "${1%/}" ;;
  esac
}


command -v podman >/dev/null 2>&1 || fail "podman is missing on the remote host; install Podman before deployment"

if ! podman container exists "${caddy_container}" 2>/dev/null; then
  fail "Caddy container '${caddy_container}' is missing; complete first-time Quadlet setup and start it before deployment"
fi

running="$(podman inspect --format '{{.State.Running}}' "${caddy_container}" 2>/dev/null || true)"
if [ "${running}" != "true" ]; then
  fail "Caddy container '${caddy_container}' exists but is not running; use systemctl --user start caddy.service after fixing the Quadlet"
fi

mounts="$(podman inspect --format '{{range .Mounts}}{{printf "%s <- %s\n" .Destination .Source}}{{end}}' "${caddy_container}" 2>/dev/null || true)"
mount_source="$(podman inspect --format '{{range .Mounts}}{{if eq .Destination "/srv/onekarlo-com"}}{{.Source}}{{end}}{{end}}' "${caddy_container}" 2>/dev/null || true)"
quadlet_dir="${HOME}/.config/containers/systemd"
quadlet_file="${quadlet_dir}/caddy/caddy.container"
flat_quadlet="${quadlet_dir}/caddy.container"
legacy_quadlet="${quadlet_dir}/caddy"
quadlet_hint="Quadlet file ${quadlet_file} is present."
if [ ! -f "${quadlet_file}" ]; then
  if [ -f "${flat_quadlet}" ]; then
    quadlet_hint="Found flat Quadlet ${flat_quadlet}; expected nested production unit ${quadlet_file} for this host layout. Verify which unit supplies caddy.service."
  elif [ -f "${legacy_quadlet}" ]; then
    quadlet_hint="Found ${legacy_quadlet}, but Podman Quadlet requires the .container extension; place the unit at ${quadlet_file}, run systemctl --user daemon-reload, and restart caddy.service."
  elif [ -d "${legacy_quadlet}" ]; then
    quadlet_hint="Found Quadlet directory ${legacy_quadlet}, but missing ${quadlet_file}; add the .container file, run systemctl --user daemon-reload, and restart caddy.service."
  else
    quadlet_hint="Missing ${quadlet_file}; verify the rootless Quadlet for caddy.service."
  fi
fi
if [ -z "${mount_source}" ]; then
  fail "Caddy container '${caddy_container}' does not mount /srv/onekarlo-com.
Active mounts:
${mounts:-<none>}
Expected source: ${deploy_root}
${quadlet_hint}
After reviewing the unit, run:
systemctl --user daemon-reload
systemctl --user restart caddy.service
Then rerun deployment."
fi
if [ "$(normalize_path "${mount_source}")" != "$(normalize_path "${deploy_root}")" ]; then
  fail "Caddy web-root mapping is '${mount_source}', but DEPLOY_ROOT is '${deploy_root}'.
Active mounts:
${mounts:-<none>}"
fi
if [ ! -d "${deploy_root}" ]; then
  fail "DEPLOY_ROOT '${deploy_root}' does not exist on the remote host"
fi
if [ ! -w "${deploy_root}" ]; then
  fail "DEPLOY_ROOT '${deploy_root}' is not writable by the SSH user"
fi

if ! podman exec "${caddy_container}" caddy validate --config "${caddyfile_path}" --adapter caddyfile; then
  fail "Caddyfile validation failed in '${caddy_container}'; fix ${caddyfile_path} before deployment"
fi

echo "Target Caddy preflight passed: container=${caddy_container} web_root=${deploy_root} caddyfile=${caddyfile_path}"
REMOTE_PREFLIGHT
  then
    die "remote Caddy preflight failed for ${DEPLOY_TARGET}; no live web files were changed"
  fi
}

echo "--> Preflighting ${TARGET_DESCRIPTION}..."
if [ "${DEPLOY_TARGET}" = "local" ]; then
  preflight_local
else
  preflight_remote
fi

if [ -f "${PROJECT_DIR}/quadlet/Caddyfile.snippet" ]; then
  echo "--> Checking Caddyfile snippet formatting (format check only; production Caddyfile is not replaced)..."
  podman run --rm \
    --entrypoint caddy \
    -v "${PROJECT_DIR}/quadlet:/etc/caddy:ro,z" \
    "${CADDY_IMAGE}" \
    fmt /etc/caddy/Caddyfile.snippet >/dev/null
fi

echo "--> Building with ${NODE_IMAGE} in an isolated workspace..."
podman run --rm \
  -e NPM_CONFIG_UPDATE_NOTIFIER=false \
  -v "${PROJECT_DIR}:/src:ro,z" \
  -v "${BUILD_DIR}:/build:z" \
  -w /build \
  "${NODE_IMAGE}" \
  sh -c '
    set -eu
    rm -rf /build/node_modules /build/dist
    for input in package.json package-lock.json index.html tsconfig.json vite.config.ts; do
      test -f "/src/${input}"
      cp -a "/src/${input}" /build/
    done
    cp -a /src/src /build/src
    if [ -d /src/public ]; then
      cp -a /src/public /build/public
    fi
    npm ci --no-audit --no-fund --no-update-notifier
    npm run build
  '

test -d "${BUILD_DIR}/dist" || die "build did not produce dist/"

if [ "${DEPLOY_TARGET}" = "local" ]; then
  SYNC_DESTINATION="${DEPLOY_ROOT%/}/"
else
  SYNC_DESTINATION="${DEPLOY_TARGET}:${DEPLOY_ROOT%/}/"
fi

# The VPS web root is shared with site-owned state. Preserve existing entries
# at the root, replace generated assets exactly, and chmod only transferred
# public files through rsync.
RSYNC_COMMON_ARGS=(
  --exclude='.DS_Store'
  --exclude='._*'
  --exclude='.Spotlight-V100'
  --exclude='.Trashes'
  --chmod='Du+rwx,Dgo-rwx,Dg+rx,Fu+rw,Fgo-rwx,Fg+r'
)
RSYNC_ROOT_ARGS=("${RSYNC_COMMON_ARGS[@]}" --exclude='assets/')
RSYNC_ASSETS_ARGS=("${RSYNC_COMMON_ARGS[@]}")

echo "--> Syncing generated public files to ${SYNC_DESTINATION} while preserving existing site data..."
rsync -a --delay-updates \
  "${RSYNC_ROOT_ARGS[@]}" \
  "${BUILD_DIR}/dist/" "${SYNC_DESTINATION}"

if [ -d "${BUILD_DIR}/dist/assets" ]; then
  echo "--> Replacing versioned assets without leaving stale files..."
  rsync -a --delete --delete-delay --delay-updates \
    "${RSYNC_ASSETS_ARGS[@]}" \
    "${BUILD_DIR}/dist/assets/" "${SYNC_DESTINATION}assets/"
fi

echo "--> Verifying sync completion (the live bind-mounted directory is not atomic)..."
if ! SYNC_DIFFERENCES="$(
  rsync -a --dry-run --itemize-changes \
    "${RSYNC_ROOT_ARGS[@]}" \
    "${BUILD_DIR}/dist/" "${SYNC_DESTINATION}"
  if [ -d "${BUILD_DIR}/dist/assets" ]; then
    rsync -a --delete --dry-run --itemize-changes \
      "${RSYNC_ASSETS_ARGS[@]}" \
      "${BUILD_DIR}/dist/assets/" "${SYNC_DESTINATION}assets/"
  fi
)"; then
  die "post-sync verification could not inspect ${SYNC_DESTINATION}"
fi
if [ -n "${SYNC_DIFFERENCES}" ]; then
  echo "${SYNC_DIFFERENCES}" >&2
  die "post-sync verification found differences; the live bind-mounted directory may be incomplete"
fi

echo "--> Sync complete; protected site-owned state and applied permissions only to transferred public files."

echo "--> Reloading validated Caddy configuration after successful sync..."
if [ "${DEPLOY_TARGET}" = "local" ]; then
  podman exec "${CADDY_CONTAINER}" caddy reload --config "${CADDYFILE_PATH}" --adapter caddyfile
else
  if ! ssh -- "${DEPLOY_TARGET}" podman exec "${CADDY_CONTAINER}" caddy reload --config "${CADDYFILE_PATH}" --adapter caddyfile; then
    die "remote Caddy reload failed for ${DEPLOY_TARGET}; the files were synced but the running configuration was not reloaded"
  fi
fi

echo "===================================================="
echo " Success! onekarlo.com deployed cleanly."
echo " Target: ${DEPLOY_TARGET}"
echo " Web root: ${DEPLOY_ROOT}"
echo "===================================================="
