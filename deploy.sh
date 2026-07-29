#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# ONE-LINE COPY & PASTE DEPLOYMENT COMMANDS (LOCAL MAC TO VPS)
# ==============================================================================
# Fast Local Build & Sync:
#   npm run build && rsync -avz --delete --exclude='.DS_Store' --exclude='._*' --exclude='.Spotlight-V100' --exclude='.Trashes' "/Users/jk.deguzman/dev/onekarlo-com/dist/" gatewaysentry:/home/jk/onekarlo-com/
#
# Podman Transient Container Build & Sync (Silent Build):
#   podman run --rm -e NPM_CONFIG_UPDATE_NOTIFIER=false -v "/Users/jk.deguzman/dev/onekarlo-com:/app:z" -w /app docker.io/library/node:alpine sh -c "npm install --no-audit --no-fund --no-notice --quiet && npm run build" && rsync -avz --delete --exclude='.DS_Store' --exclude='._*' --exclude='.Spotlight-V100' --exclude='.Trashes' "/Users/jk.deguzman/dev/onekarlo-com/dist/" gatewaysentry:/home/jk/onekarlo-com/
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

# 5. Enforce strict permissions baseline (750 dirs, 640 files)
echo "--> Applying security permissions baseline (750 dirs / 640 files)..."
find "${DEST_DIR}" -type d -exec chmod 750 {} +
find "${DEST_DIR}" -type f -exec chmod 640 {} +

# 6. Gracefully reload Caddy inside its rootless container
if podman container exists caddy 2>/dev/null; then
  echo "--> Reloading Caddy configuration inside caddy container..."
  podman exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile || echo "Note: Reload skipped if Caddy container is idle."
fi

echo "===================================================="
echo " Success! onekarlo.com deployed cleanly."
echo " Web root: ${DEST_DIR}"
echo " Quadlet path: ${QUADLET_DIR}"
echo "===================================================="
