# Suggested Commands
- `npm ci` installs the lockfile-defined dependencies.
- `npm run dev` starts Vite on all interfaces, port 3000.
- `npm run build:podman` is the reproducible type-check and production-build gate.
- `npm run preview` serves `dist/` for local verification; it is not a production server.
- `bash -n deploy.sh` checks deployment-script syntax.
- `git diff --check` checks whitespace errors in the current patch.
- No dedicated test, lint, or format script is configured.
