# Tech Stack
- TypeScript 5.9.x, strict compilation; Vite 6.4.x; ESM package (`"type": "module"`).
- Browser target: ES2022 + DOM/DOM.Iterable.
- `tsconfig.json`: `noEmit`, `strict`, `noUnusedLocals`, `noUnusedParameters`; only `src` is included.
- No application framework/dependency layer: features use browser DOM APIs and local TypeScript modules.
- Entry: `src/main.ts`; static shell: `index.html`; global/component styles: `src/styles/`.
