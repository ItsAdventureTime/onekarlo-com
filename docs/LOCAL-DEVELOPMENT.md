# Local development guide

The macOS host is the control plane for source edits, Git, `gh`, SSH, and
deployment commands. Project execution runs in the repository's deterministic
Docker Sandbox so Node.js, npm, Vite, TypeScript, and preview processes do not
depend on host-installed runtimes.

## Prerequisites

Install and start Docker Desktop (or a compatible Docker Engine), then make
sure `jk-sbx-project` is available on the host. Run commands from the project
root:

```bash
cd ~/dev/onekarlo-com
jk-sbx-project ensure
```

`ensure` creates or reuses the sandbox. It is safe to run before each work
session. The project workspace is shared read/write with the sandbox, while
dependency and compiler caches remain sandbox-private.

## Install and develop

Install from the committed lockfile inside the sandbox:

```bash
jk-sbx-project exec npm ci
```

Start the Vite development server in the background and publish its port:

```bash
jk-sbx-project exec-bg npm run dev
jk-sbx-project publish 3000
```

Open <http://127.0.0.1:3000>. Source edits remain visible immediately because
the repository workspace is mounted directly into the sandbox.

## Production-build verification

Run the normal TypeScript and Vite build in the sandbox:

```bash
jk-sbx-project exec npm run build
```

To inspect the generated `dist/` output through Vite's static preview:

```bash
jk-sbx-project exec-bg npm run preview
jk-sbx-project publish 3000
```

Use either the dev server or the preview server at a time. Vite's preview
server is for local verification, not production hosting. The production
deployment script performs its own pinned container build before synchronizing
files to the VPS.

## Compound commands and lifecycle

Use `run` for a short compound command:

```bash
jk-sbx-project run 'npm ci && npm run build'
```

Check the sandbox or stop it when finished:

```bash
jk-sbx-project status
jk-sbx-project stop
```

`stop` preserves the sandbox for the next session. Do not use `destroy` as a
routine cleanup step; it removes the reusable sandbox state and requires an
intentional reset.

## Verification checklist

Before committing a change, run:

```bash
jk-sbx-project exec npm run build
bash -n deploy.sh
git diff --check
```

For UI changes, also inspect the production preview at a wide desktop width
and a narrow mobile width. Verify keyboard focus, dialog Escape handling,
reduced-motion behavior, readable contrast, responsive reflow, and the browser
console.

## Related references

- [Vite static deployment guide](https://vite.dev/guide/static-deploy.html)
- [Contributing guide](../CONTRIBUTING.md)
- [Deployment runbook](DEPLOYMENT.md)
- [Release checklist](RELEASE-CHECKLIST.md)
