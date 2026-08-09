#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# ONE-LINE COPY & PASTE DEPLOYMENT COMMANDS (ANONYMIZED VPS ALIAS: gatewaysentry)
# ==============================================================================
# Podman Transient Container Build & Direct Sync to VPS (Recommended):
#   podman run --rm -e NPM_CONFIG_UPDATE_NOTIFIER=false -v "/Users/jk.deguzman/dev/onekarlo-com:/app:z" -w /app docker.io/library/node:alpine sh -c "npm install --no-audit --no-fund --no-notice --quiet && npm run build" && rsync -avz --delete --exclude='.DS_Store' --exclude='._*' --exclude='.Spotlight-V100' --exclude='.Trashes' "/Users/jk.deguzman/dev/onekarlo-com/dist/" gatewaysentry:/home/jk/onekarlo-com/
#
# Fast Local Build & Direct Sync to VPS:
#   npm run build && rsync -avz --delete --exclude='.DS_Store' --exclude='._*' --exclude='.Spotlight-V100' --exclude='.Trashes' "/Users/jk.deguzman/dev/onekarlo-com/dist/" gatewaysentry:/home/jk/onekarlo-com/
# ==============================================================================

echo "===================================================="
echo " Deploying onekarlo.com via Podman Container Build"
echo "===================================================="

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="${HOME}/onekarlo-com"
QUADLET_DIR="${HOME}/.config/containers/systemd/onekarlo-com"

# 1. Build static site using transient Node Alpine Podman container
#    (Preserves Fedora CoreOS immutable model - no host npm/node needed!)
echo "--> Compiling TypeScript & Vite bundle via transient podman container (node:alpine)..."
podman run --rm \
  -e NPM_CONFIG_UPDATE_NOTIFIER=false \
  -v "${PROJECT_DIR}:/app:z" \
  -w /app \
  docker.io/library/node:alpine \
  sh -c "npm install --no-audit --no-fund --no-notice --quiet && npm run build"

# 2. Ensure destination directories exist
echo "--> Preparing server target directories..."
mkdir -p "${DEST_DIR}"
mkdir -p "${QUADLET_DIR}"

# 3. Sync compiled dist/ contents to ~/onekarlo-com
echo "--> Syncing build output to ${DEST_DIR}..."
cp -r "${PROJECT_DIR}/dist/"* "${DEST_DIR}/"

# 4. Copy Quadlet config files to ~/.config/containers/systemd/onekarlo-com/
echo "--> Syncing Quadlet snippets to ${QUADLET_DIR}..."
if [ -d "${PROJECT_DIR}/quadlet" ]; then
  cp -r "${PROJECT_DIR}/quadlet/"* "${QUADLET_DIR}/" || true
fi

# 5. Validate and format local Caddyfile snippet using transient Podman container
if [ -f "${PROJECT_DIR}/quadlet/Caddyfile.snippet" ]; then
  echo "--> Validating & formatting Caddyfile.snippet via transient Podman container..."
  podman run --rm \
    -v "${PROJECT_DIR}/quadlet:/etc/caddy:z" \
    docker.io/library/caddy:alpine \
    caddy fmt --overwrite /etc/caddy/Caddyfile.snippet || true
fi

# 6. Enforce strict permissions baseline (750 dirs, 640 files)
echo "--> Applying security permissions baseline (750 dirs / 640 files)..."
find "${DEST_DIR}" -type d -exec chmod 750 {} +
find "${DEST_DIR}" -type f -exec chmod 640 {} +

# 7. Format, validate, and gracefully reload Caddy inside rootless Podman container
if podman container exists caddy 2>/dev/null; then
  echo "--> Formatting & validating production Caddyfile inside caddy container..."
  podman exec caddy caddy fmt --overwrite /etc/caddy/Caddyfile || true
  podman exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
  
  echo "--> Reloading Caddy configuration inside rootless caddy container..."
  podman exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
fi

echo "===================================================="
echo " Success! onekarlo.com deployed cleanly."
echo " Web root: ${DEST_DIR}"
echo " Quadlet path: ${QUADLET_DIR}"
echo "===================================================="
