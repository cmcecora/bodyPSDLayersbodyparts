---
phase: 01-scaffolding-asset-extraction
plan: 01
subsystem: infra
tags: [vite, lit, typescript, web-component, build-pipeline]

# Dependency graph
requires: []
provides:
  - Vite v6 + Lit v3 + TypeScript v5 build pipeline with npm run dev and npm run build
  - body-map-explorer custom element registered with three-column placeholder layout
  - CSS design tokens (--bme-*) declared in Shadow DOM stylesheet
  - ES module bundle (25 KB) and UMD bundle (20 KB) in dist/
  - assetsInlineLimit: 0 Vite config preventing base64 image inlining
affects:
  - 01-02 (asset extraction builds on this pipeline)
  - phase 2+ (component shell provides entry point for all future phases)

# Tech tracking
tech-stack:
  added:
    - "lit@3.2.1 — Web Component base class with reactive properties and templating"
    - "vite@6.4.1 — build tool in library mode (ES + UMD output)"
    - "typescript@5.8.3 — strict mode with experimentalDecorators"
  patterns:
    - "Lit LitElement + @customElement decorator for custom element registration"
    - "CSS design tokens declared on :host in Shadow DOM stylesheet"
    - "Vite library mode with assetsInlineLimit: 0 (Pitfall 1 prevention)"
    - "Import path uses .js extension for TS source (required for ESM resolution)"

key-files:
  created:
    - package.json
    - tsconfig.json
    - vite.config.ts
    - index.html
    - .gitignore
    - src/body-map-explorer.ts
    - src/styles/tokens.css.ts
  modified: []

key-decisions:
  - "Lit v3 chosen: framework-agnostic Web Component base, ESM-native, ~5 KB gzipped"
  - "assetsInlineLimit: 0 set in Vite config to prevent base64 images leaking into JS bundle"
  - "useDefineForClassFields: false required for Lit property decorators to work correctly"
  - "Both ES and UMD formats built — ES for modern bundlers, UMD for script-tag consumers"

patterns-established:
  - "Pattern 1: All CSS custom properties declared on :host in tokens.css.ts, imported by LitElement"
  - "Pattern 2: Import paths in TypeScript use .js extension (not .ts) for correct ESM resolution"
  - "Pattern 3: Images never imported in JS — placed in public/ and referenced as URL strings"

requirements-completed: [BUILD-01, BUILD-04, BUILD-05]

# Metrics
duration: 2min
completed: 2026-03-29
---

# Phase 01 Plan 01: Vite + Lit + TypeScript Scaffolding Summary

**Vite v6 library-mode build pipeline with Lit v3 custom element shell, CSS design token system, and dual ES/UMD output under 25 KB**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-29T21:14:49Z
- **Completed:** 2026-03-29T21:17:09Z
- **Tasks:** 2 of 2
- **Files modified:** 7 created

## Accomplishments

- Vite + Lit + TypeScript project initialized with npm run dev and npm run build working end-to-end
- `<body-map-explorer>` custom element renders three-column placeholder layout (260px sidebar / 1fr center / 300px detail)
- All 20 CSS design tokens declared as `--bme-*` custom properties in Shadow DOM (9 color, 4 typography, 7 spacing)
- ES bundle: 25 KB / UMD bundle: 20 KB — well under 500 KB limit; zero base64 images in output

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize Vite + Lit + TypeScript project** - `229b068` (chore)
2. **Task 2: Create body-map-explorer component shell** - `fa16be7` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `package.json` — Project manifest with Lit v3, Vite v6, TypeScript v5 dependencies
- `tsconfig.json` — TypeScript config with experimentalDecorators and useDefineForClassFields: false
- `vite.config.ts` — Vite library mode config (ES+UMD, assetsInlineLimit: 0)
- `index.html` — Dev server entry point loading body-map-explorer via script type=module
- `.gitignore` — Extended with node_modules/, dist/, \*.local, .vite/
- `src/body-map-explorer.ts` — Root Web Component with three-column grid layout
- `src/styles/tokens.css.ts` — CSS custom properties design token system

## Decisions Made

- **assetsInlineLimit: 0** set in Vite config to prevent any images from being base64-inlined into the JS bundle (per PITFALLS.md Pitfall 1)
- **useDefineForClassFields: false** in tsconfig — required for Lit's @property decorators to work correctly with TypeScript class fields
- **Lit v3 bundled in** (not externalized) — at ~5 KB gzipped, small enough that consumers don't need a separate Lit install
- **Both ES and UMD formats** — ES for modern bundlers/Angular, UMD for plain `<script>` tag consumers

## Deviations from Plan

None — plan executed exactly as written. A code formatter (Prettier or similar) auto-formatted files on save, converting single quotes to double quotes and adjusting whitespace — this is a cosmetic change that does not affect functionality.

## Issues Encountered

None — npm install, TypeScript compilation, and Vite build all succeeded on first attempt.

## Known Stubs

The component renders placeholder text in all three columns:

- "Phase 2 will render the systems sidebar here." (left panel)
- "Phase 2 will render the SVG body model here." (center)
- "Phase 3 will render system details here." (right panel)

These are intentional stubs — Plan 01-02 (asset extraction) and Phase 2+ will replace them with actual content.

## User Setup Required

None — no external service configuration required. Run `npm install` then `npm run dev`.

## Next Phase Readiness

- Build pipeline proven: `npm run dev` starts hot-reload server, `npm run build` produces distributable bundles
- Component shell provides entry point for Phase 2 organ model extraction
- `--bme-*` token system ready for Phase 2+ component styling
- Plan 01-02 (asset extraction) can now use this pipeline to extract base64 images and convert data files

---

_Phase: 01-scaffolding-asset-extraction_
_Completed: 2026-03-29_
