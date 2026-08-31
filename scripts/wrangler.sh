#!/usr/bin/env bash
set -Eeuo pipefail

# The Docker Sandbox image may advertise a global npm prefix whose lib
# directory is absent. Give npx a writable, sandbox-private prefix instead.
readonly WRANGLER_PREFIX="${XDG_CACHE_HOME:-${HOME}/.cache}/onekarlo-wrangler"
mkdir -p "${WRANGLER_PREFIX}/lib"
export NPM_CONFIG_PREFIX="${WRANGLER_PREFIX}"

if [[ "${1:-}" == "login" ]]; then
  shift
  set -- login --device "$@"
fi

exec npx --yes --package=wrangler@4 wrangler "$@"
