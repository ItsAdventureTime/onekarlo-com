# Task Completion
- Verify Podman with `podman info`, then run `npm run build:podman` as the
  type-check and production-build gate.
- For visible UI changes, run `npm run preview` and manually inspect desktop,
  mobile, keyboard, dialog focus, and reduced-motion states.
- For deployment changes, run `bash -n deploy.sh` and review the target
  mount/preflight contract in `docs/DEPLOYMENT.md`.
- Run `git diff --check` before committing.
- No repository lint, formatter, or automated test commands are configured.
