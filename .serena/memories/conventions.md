# Conventions
- Keep `src/main.ts` as interaction/bootstrap orchestration; place focused UI behavior in feature modules (`terminal.ts`, `topology.ts`, `projects.ts`).
- Keep page content/models in `src/data.ts` using typed interfaces and exported constants.
- Import styles explicitly from the entry module.
- DOM behavior initializes from `DOMContentLoaded`; preserve this lifecycle for elements declared in `index.html`.
- TypeScript must satisfy strict and unused-symbol checks; avoid dead exports/locals.