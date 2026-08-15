# Contributing Guidelines

This is a small personal portfolio, so changes should stay focused, readable,
and easy to verify. Contributions are welcome for accessibility, performance,
content quality, and maintainability improvements.

## Before changing the site

Read:

- [README.md](README.md) for project commands and scope.
- [ARCHITECTURE.md](ARCHITECTURE.md) for the runtime and delivery model.
- [docs/LOCAL-DEVELOPMENT.md](docs/LOCAL-DEVELOPMENT.md) for the sandbox
  workflow.
- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) before editing public project
  copy.

Do not add client names, company names, geographic locations, IP addresses,
usernames, private paths, credentials, or identifying project metadata to public
source or documentation.

## Development workflow

```bash
jk-sbx-project ensure
jk-sbx-project exec npm ci
jk-sbx-project exec-bg npm run dev
jk-sbx-project publish 3000
```

The app is a Vite-powered TypeScript site. Keep business/content data in the
existing data modules, keep shared values in the design tokens, and preserve
the current separation between structure, behavior, and styles.

Prefer small, composable changes. Do not introduce a frontend framework or a
new dependency for behavior that browser APIs already support.

## Verification

Run the reproducible build inside the Docker Sandbox before opening a change:

```bash
jk-sbx-project exec npm run build
```

For visual or interaction changes, preview the production output in the
sandbox:

```bash
jk-sbx-project exec-bg npm run preview
jk-sbx-project publish 3000
```

Check the affected flow at desktop and narrow mobile widths. At minimum,
verify keyboard focus, Enter/Space activation, Escape-to-close behavior,
visible focus styles, reduced-motion behavior, readable contrast, and the
absence of browser-console errors. `vite preview` is a verification server,
not a production server.

When documentation or shell scripts change, also run:

```bash
git diff --check
bash -n deploy.sh
```

Use [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment-specific checks.

## Documentation discipline

Keep the guides synchronized with the implementation. When a change affects
commands, build inputs, deployment paths, security headers, accessibility
behavior, or release procedure:

- update the relevant guide in the same change;
- remove instructions that no longer match the repository;
- keep private infrastructure details and credentials out of public docs; and
- record the documentation review in the release checklist.

If no guide needs changing, confirm that the existing documentation still
matches the revised behavior before committing.

## Content changes

Project entries should communicate:

1. The capability or system problem.
2. The role or workflow supported.
3. The representative technical pattern.
4. The observable outcome or operating constraint.

Use generic descriptions. The public site is a portfolio, not a client case
study or infrastructure inventory.

## GitHub HTTPS and signed-commit workflow

Local commits use Git. GitHub authentication and the Git credential helper use
the official `gh` CLI over HTTPS:

```bash
gh auth status --hostname github.com
gh auth setup-git --hostname github.com
gh config get git_protocol
git remote get-url origin
```

Confirm `origin` begins with `https://github.com/` before any push. Create a
focused signed local commit, then push the current branch through that
authenticated HTTPS helper:

```bash
git add path/to/changed-files
git commit -S -m "docs: update project and deployment guides"
git push origin HEAD
git log -1 --format='%h %G? %GS %s'
```

The signature status must be `G` (good). If local signing is not configured,
stop and configure a GitHub-supported GPG, SSH, or S/MIME signing method
before committing. Do not put tokens, private URLs, server addresses, or
generated output in a commit. Use
[docs/RELEASE-CHECKLIST.md](docs/RELEASE-CHECKLIST.md) for the complete release
sequence.

## Reporting issues

Open an issue with:

- A short description of the problem.
- Browser, operating system, and viewport details when relevant.
- Reproduction steps.
- A screenshot or console error with secrets and private identifiers removed.

Please avoid attaching client material or internal infrastructure details.
