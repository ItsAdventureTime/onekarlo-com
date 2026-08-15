# Suggested Commands
- `jk-sbx-project ensure` creates or reuses the project Docker Sandbox.
- `jk-sbx-project exec npm ci` installs lockfile-defined dependencies in the sandbox.
- `jk-sbx-project exec-bg npm run dev` starts Vite; `jk-sbx-project publish 3000` exposes it.
- `jk-sbx-project exec npm run build` runs the type-check and production build gate.
- `jk-sbx-project exec-bg npm run preview` serves `dist/` for local verification; it is not a production server.
- `bash -n deploy.sh` checks deployment-script syntax.
- `git diff --check` checks whitespace errors in the current patch.
- `gh auth setup-git --hostname github.com` configures authenticated HTTPS Git transport.
- No dedicated test, lint, or format script is configured.
