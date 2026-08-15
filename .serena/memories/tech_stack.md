# Tech Stack
- TypeScript 5.9.x, strict compilation; Vite 6.4.x; ESM package (`"type": "module"`).
- Browser target: ES2022 + DOM/DOM.Iterable.
- `tsconfig.json`: `noEmit`, `strict`, `noUnusedLocals`, `noUnusedParameters`; only `src` is included.
- No application framework/dependency layer: features use browser DOM APIs and local TypeScript modules.
- Entry: `src/main.ts`; static shell: `index.html`; global/component styles: `src/styles/`.
- Local execution: Docker Sandbox via `jk-sbx-project`; use sandbox commands for
  npm, TypeScript, Vite build, preview, and UI verification.
- Build and delivery: `deploy.sh` builds in the initialized Docker Sandbox,
  then syncs `dist/` over SSH and uses rootless Podman/Caddy only for remote
  preflight and reload.
- Public content: anonymized project capabilities in `src/data.ts`; privacy and
  release guidance lives in `docs/CONTENT-GUIDE.md` and `docs/RELEASE-CHECKLIST.md`.
