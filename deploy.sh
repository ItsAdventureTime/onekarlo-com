#!/usr/bin/env bash
set -Eeuo pipefail

# Fixed production target. Run this file directly:
#
#   ./deploy.sh
#
# SSH may still ask for the VPS password unless the host has a key configured.
readonly REMOTE="jk@216.75.75.136"
readonly REMOTE_CADDY_DIR="/home/jk/caddy"
readonly REMOTE_CADDYFILE="${REMOTE_CADDY_DIR}/conf/Caddyfile"
readonly REMOTE_QUADLET="/home/jk/.config/containers/systemd/caddy/caddy.container"
readonly REMOTE_WEB_ROOT="/home/jk/onekarlo-com"
readonly CADDY_CONTAINER="caddy"
readonly CADDY_CONFIG="/etc/caddy/Caddyfile"
readonly CONTAINER_WEB_ROOT="/srv/onekarlo-com"
readonly SANDBOX_COMMAND="jk-sbx-project"

echo "===================================================="
echo " Deploying onekarlo.com"
echo "===================================================="

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$(mktemp -d "${TMPDIR:-/tmp}/onekarlo-deploy.XXXXXX")"
SSH_CONTROL="${RUN_DIR}/ssh-control"
SSH_ARGS=(-o ControlMaster=auto -o ControlPersist=60 -o "ControlPath=${SSH_CONTROL}")
RSYNC_SSH="ssh -o ControlMaster=auto -o ControlPersist=60 -o ControlPath=${SSH_CONTROL}"

cleanup() {
  if [ -S "${SSH_CONTROL}" ]; then
    ssh "${SSH_ARGS[@]}" -O exit -- "${REMOTE}" >/dev/null 2>&1 || true
  fi
  rm -rf -- "${RUN_DIR}"
}
trap cleanup EXIT

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

for command_name in "${SANDBOX_COMMAND}" rsync ssh; do
  command -v "${command_name}" >/dev/null 2>&1 || fail "${command_name} is required"
done

cd "${PROJECT_DIR}"

echo "--> Building the site inside the project Docker Sandbox..."
"${SANDBOX_COMMAND}" ensure
"${SANDBOX_COMMAND}" run \
  'npm ci --no-audit --no-fund --no-update-notifier && npm run build'

test -f "${PROJECT_DIR}/dist/index.html" || fail "Build did not produce dist/index.html"

echo "--> Checking the VPS and Caddy configuration..."
if ! ssh "${SSH_ARGS[@]}" -- "${REMOTE}" bash -s -- \
  "${REMOTE_WEB_ROOT}" \
  "${REMOTE_CADDY_DIR}" \
  "${REMOTE_CADDYFILE}" \
  "${REMOTE_QUADLET}" \
  "${CADDY_CONTAINER}" \
  "${CONTAINER_WEB_ROOT}" \
  "${CADDY_CONFIG}" <<'REMOTE_PREFLIGHT'
set -Eeuo pipefail

web_root="$1"
caddy_dir="$2"
caddyfile="$3"
quadlet="$4"
caddy_container="$5"
container_web_root="$6"
caddy_config="$7"

fail_remote() {
  echo "ERROR: $*" >&2
  exit 1
}

normalize_path() {
  case "$1" in
    /) printf '/\n' ;;
    *) printf '%s\n' "${1%/}" ;;
  esac
}

command -v podman >/dev/null 2>&1 || fail_remote "podman is missing on the VPS"
command -v rsync >/dev/null 2>&1 || fail_remote "rsync is missing on the VPS"
command -v awk >/dev/null 2>&1 || fail_remote "awk is missing on the VPS"

[ -d "${caddy_dir}" ] || fail_remote "Caddy directory is missing: ${caddy_dir}"
[ -r "${caddyfile}" ] || fail_remote "Caddyfile is missing or unreadable: ${caddyfile}"
[ -f "${quadlet}" ] || fail_remote "Quadlet is missing: ${quadlet}"
[ -d "${web_root}" ] || fail_remote "Deployment directory is missing: ${web_root}"
[ -w "${web_root}" ] || fail_remote "Deployment directory is not writable: ${web_root}"

podman container exists "${caddy_container}" 2>/dev/null || \
  fail_remote "Caddy container is missing: ${caddy_container}"

running="$(podman inspect --format '{{.State.Running}}' "${caddy_container}" 2>/dev/null || true)"
[ "${running}" = "true" ] || \
  fail_remote "Caddy container is not running: ${caddy_container}"

mounts="$(podman inspect --format '{{range .Mounts}}{{printf "%s|%s\n" .Destination .Source}}{{end}}' "${caddy_container}")"
web_source=""
caddy_source=""
while IFS='|' read -r destination source; do
  case "${destination}" in
    "${container_web_root}") web_source="${source}" ;;
    /etc/caddy) caddy_source="${source}" ;;
  esac
done <<< "${mounts}"

[ -n "${web_source}" ] || fail_remote "Caddy does not mount ${container_web_root}.\nActive mounts:\n${mounts:-<none>}"
[ "$(normalize_path "${web_source}")" = "$(normalize_path "${web_root}")" ] || \
  fail_remote "Caddy web-root mount is ${web_source}, expected ${web_root}"

[ -n "${caddy_source}" ] || fail_remote "Caddy does not mount /etc/caddy"
[ "$(normalize_path "${caddy_source}")" = "$(normalize_path "${caddy_dir}/conf")" ] || \
  fail_remote "Caddy config mount is ${caddy_source}, expected ${caddy_dir}/conf"

expand_caddyfile() {
  local pimascor_handlers="${caddy_dir}/conf/pimascor-production.handlers.Caddyfile"
  local padang_handlers="${caddy_dir}/conf/padang-demo.handlers.Caddyfile"

  [ -r "${pimascor_handlers}" ] || \
    fail_remote "Imported Caddy handler file is missing or unreadable: ${pimascor_handlers}"
  [ -r "${padang_handlers}" ] || \
    fail_remote "Imported Caddy handler file is missing or unreadable: ${padang_handlers}"

  awk \
    -v pimascor_handlers="${pimascor_handlers}" \
    -v padang_handlers="${padang_handlers}" '
      $0 ~ /^[[:space:]]*import[[:space:]]+\/etc\/caddy\/pimascor-production\.handlers\.Caddyfile[[:space:]]*$/ {
        while ((getline line < pimascor_handlers) > 0) print line
        close(pimascor_handlers)
        next
      }
      $0 ~ /^[[:space:]]*import[[:space:]]+\/etc\/caddy\/padang-demo\.handlers\.Caddyfile[[:space:]]*$/ {
        while ((getline line < padang_handlers) > 0) print line
        close(padang_handlers)
        next
      }
      { print }
    ' "${caddyfile}"
}

echo "--> Validating ${caddyfile} through Caddy's stdin..."
if ! expand_caddyfile | podman exec --user 0 -i "${caddy_container}" \
  caddy validate --config - --adapter caddyfile; then
  fail_remote "Caddyfile validation failed: ${caddyfile}"
fi

echo "Remote preflight passed"
REMOTE_PREFLIGHT
then
  fail "VPS preflight failed; no live files were changed"
fi

RSYNC_COMMON_ARGS=(
  --archive
  --compress
  --delay-updates
  --exclude='.DS_Store'
  --exclude='._*'
  --exclude='.Spotlight-V100'
  --exclude='.Trashes'
  --chmod='Du+rwx,Dgo-rwx,Dg+rx,Fu+rw,Fgo-rwx,Fg+r'
)

echo "--> Syncing the generated site to ${REMOTE_WEB_ROOT}..."
rsync "${RSYNC_COMMON_ARGS[@]}" \
  --exclude='assets/' \
  -e "${RSYNC_SSH}" \
  "${PROJECT_DIR}/dist/" "${REMOTE}:${REMOTE_WEB_ROOT%/}/"

if [ -d "${PROJECT_DIR}/dist/assets" ]; then
  rsync "${RSYNC_COMMON_ARGS[@]}" \
    --delete \
    -e "${RSYNC_SSH}" \
    "${PROJECT_DIR}/dist/assets/" "${REMOTE}:${REMOTE_WEB_ROOT%/}/assets/"
fi

echo "--> Reloading the validated Caddy configuration..."
if ! ssh "${SSH_ARGS[@]}" -- "${REMOTE}" bash -s -- \
  "${REMOTE_CADDY_DIR}" \
  "${REMOTE_CADDYFILE}" \
  "${CADDY_CONTAINER}" <<'REMOTE_RELOAD'
set -Eeuo pipefail

caddy_dir="$1"
caddyfile="$2"
caddy_container="$3"

expand_caddyfile() {
  local pimascor_handlers="${caddy_dir}/conf/pimascor-production.handlers.Caddyfile"
  local padang_handlers="${caddy_dir}/conf/padang-demo.handlers.Caddyfile"

  awk \
    -v pimascor_handlers="${pimascor_handlers}" \
    -v padang_handlers="${padang_handlers}" '
      $0 ~ /^[[:space:]]*import[[:space:]]+\/etc\/caddy\/pimascor-production\.handlers\.Caddyfile[[:space:]]*$/ {
        while ((getline line < pimascor_handlers) > 0) print line
        close(pimascor_handlers)
        next
      }
      $0 ~ /^[[:space:]]*import[[:space:]]+\/etc\/caddy\/padang-demo\.handlers\.Caddyfile[[:space:]]*$/ {
        while ((getline line < padang_handlers) > 0) print line
        close(padang_handlers)
        next
      }
      { print }
    ' "${caddyfile}"
}

expand_caddyfile | podman exec --user 0 -i "${caddy_container}" \
  caddy reload --config - --adapter caddyfile
REMOTE_RELOAD
then
  fail "Files were synced, but Caddy reload failed"
fi

echo "===================================================="
echo " Success! onekarlo.com deployed."
echo "===================================================="
