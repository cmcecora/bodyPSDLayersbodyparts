# Technology Stack

**Analysis Date:** 2026-04-07

## Languages

**Primary:**
- TypeScript 5.9.3 - Application source, config, and tests in `src/body-map-explorer.ts`, `src/body-map-model.ts`, `src/data/data-service.ts`, `vite.config.ts`, and `vitest.config.ts`

**Secondary:**
- HTML - Vite dev entry in `index.html`, manual integration harness in `test/standalone.html`, and a legacy standalone implementation in `interactive-body-model.html`
- JavaScript (ES modules) - Node-based utility scripts in `scripts/check-build-budget.js`, `scripts/split-diseases.js`, and `scripts/validate-bp-coverage.js`
- Shell - Asset conversion helper in `scripts/convert-to-webp.sh`
- Python 3 - Offline data-generation residue in `generate-data-files.py` and `docs/body_parts_results/map_body_parts.py`
- JSON - Static app data under `public/data/diseases.json`, `public/data/diseases/*.json`, and `public/data/symptoms-by-part.json`

## Runtime

**Environment:**
- Browser runtime - The shipped component is a custom-element package for modern browsers, mounted from `src/body-map-explorer.ts` and bootstrapped in `index.html`
- Node.js - Required for package scripts in `package.json`, Vite builds in `vite.config.ts`, and Vitest runs in `vitest.config.ts`
- Effective Node floor: >=20 for local development and test execution because `happy-dom` and `vitest` in `package-lock.json` require Node 20+, even though `vite` and `esbuild` accept Node 18+

**Package Manager:**
- npm - Project manifest in `package.json`
- Lockfile: present as `package-lock.json` (lockfileVersion 3)

## Frameworks

**Core:**
- Lit 3.3.2 - Web component framework used across `src/body-map-explorer.ts`, `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, `src/body-map-data-panel.ts`, `src/body-map-model.ts`, and `src/body-map-modal.ts`

**Testing:**
- Vitest 4.1.2 - Test runner configured in `vitest.config.ts` and exercised by `src/__tests__/*.test.ts` and `src/body-map-explorer.test.ts`
- happy-dom 20.8.9 - Browser-like DOM environment for Vitest in `vitest.config.ts`

**Build/Dev:**
- Vite 6.4.1 - Dev server and library build configured in `vite.config.ts`
- TypeScript 5.9.3 - Strict compile target and declaration output configured in `tsconfig.json`
- Rollup 4.60.0 - Bundling backend used by Vite per `package-lock.json`
- esbuild 0.25.12 - Dependency prebundle and transform backend used by Vite per `package-lock.json`
- Manual validation scripts - `scripts/check-build-budget.js` enforces a 512000-byte critical payload budget; `scripts/validate-bp-coverage.js` audits data/code alignment; `scripts/split-diseases.js` shards `public/data/diseases.json`

## Key Dependencies

**Critical:**
- `lit` 3.3.2 - Core runtime dependency for every shipped UI component under `src/`

**Infrastructure:**
- `vite` 6.4.1 - Local dev server and production library bundler for `dist/body-map-explorer.es.js` and `dist/body-map-explorer.umd.js`
- `typescript` 5.9.3 - Emits declarations to `dist/` and enforces strict typing from `tsconfig.json`
- `vitest` 4.1.2 - Primary automated test framework for the component API and rendering behavior in `src/__tests__/`
- `happy-dom` 20.8.9 - Required to run DOM-heavy component tests without a real browser

## Configuration

**Environment:**
- No runtime env-variable contract is defined in `src/`, `scripts/`, `vite.config.ts`, or `vitest.config.ts`; no `process.env`, `import.meta.env`, or `VITE_` lookups were detected
- A root `.env` file is present, but the current codebase does not reference it
- Runtime customization is API-driven instead of env-driven: `src/body-map-explorer.ts` exposes `asset-base` and `external-data`, and `test/standalone.html` demonstrates both integration points

**Build:**
- `package.json` defines `dev`, `build`, `preview`, `test`, `check:budget`, and `split-diseases`
- `vite.config.ts` builds library output from `src/body-map-explorer.ts`, emits ESM and UMD bundles, keeps sourcemaps on, and disables asset inlining with `assetsInlineLimit: 0`
- `tsconfig.json` targets `ES2021`, uses `moduleResolution: "bundler"`, enables decorators, and writes declarations to `dist/`
- `vitest.config.ts` runs `src/**/*.test.ts` with `globals: true` in a `happy-dom` environment
- No lint or formatter config was detected; there is no `eslint` or `prettier` config at the repo root

## Platform Requirements

**Development:**
- Node.js >=20 recommended to satisfy the locked `happy-dom` and `vitest` engines in `package-lock.json`
- npm installable dependencies via `package-lock.json`
- Browser support for ES modules, custom elements, Shadow DOM, and `fetch`, because the app renders through Lit web components in `src/`
- Static fixture and asset tree must exist locally: `public/assets/` and `public/data/`

**Production:**
- Static hosting or host-application embedding for the built library exported by `package.json`
- Deploy `dist/` together with the static asset/data tree expected by the component: `public/assets/body-parts/`, `public/assets/organs/`, `public/assets/systems/`, `public/assets/silhouette.webp`, `public/assets/sections-body*.webp`, and `public/data/`
- Preserve the `/assets` and `/data` folder layout or provide an equivalent prefix through the `asset-base` property in `src/body-map-explorer.ts`
- No server-side rendering target, database tier, or backend runtime is configured in the repo

## Notable Repo State

- The actively built package is the Vite/Lit code under `src/`; the older monolithic implementation in `interactive-body-model.html` and `interactive-body-model-app.js` remains in the repository as legacy/manual reference material
- `public/assets/` currently contains 77 body-part images, 19 organ images, 23 system thumbnails, plus silhouette and section composites
- `public/data/` currently contains 3 top-level JSON files and 86 disease shard files under `public/data/diseases/`

---

*Stack analysis: 2026-04-07*
