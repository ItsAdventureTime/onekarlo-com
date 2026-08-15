# Task Completion
- Run `jk-sbx-project exec npm run build` in the Docker Sandbox as the
  type-check and production-build gate.
- For visible UI changes, run the sandbox preview and manually inspect desktop,
  mobile, keyboard, dialog focus, and reduced-motion states.
- For deployment changes, run `bash -n deploy.sh` and review the target
  mount/preflight contract in `docs/DEPLOYMENT.md`.
- Run `git diff --check` before committing.
- Before pushing, verify `origin` is HTTPS, GitHub CLI auth is active, and the
  local commit signature reports `G` (good).
- No repository lint, formatter, or automated test commands are configured.
