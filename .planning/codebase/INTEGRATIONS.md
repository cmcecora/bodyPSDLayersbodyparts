# External Integrations

**Analysis Date:** 2026-04-07

## APIs & External Services

**Static same-origin asset/data loading:**
- Internal JSON and image fetching only - `src/data/data-service.ts` fetches `/data/diseases/*.json` and `/data/symptoms-by-part.json`, while `src/body-map-model.ts`, `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, and `src/data/body-parts.ts` resolve image URLs under `/assets`
  - SDK/Client: Browser `fetch` and native `<img>` loading, no third-party SDK
  - Auth: Not applicable

**Host-application data provider seam:**
- Host-provided `externalData` integration - `src/body-map-explorer.ts` accepts either a static object or a `DataProvider` with `fetchDiseases()` and `fetchSymptoms()` so a consumer can replace repo-local JSON with its own API or backend
  - SDK/Client: Consumer-supplied; the repo only defines the interface in `src/data/data-service.ts`
  - Auth: Delegated to the embedding host if it wires `externalData` to a protected service

**Asset/CDN prefix seam:**
- Prefix-based asset hosting - `asset-base` in `src/body-map-explorer.ts` rewrites both image and JSON paths, and the behavior is covered in `src/body-map-explorer.test.ts` and `src/__tests__/data-service.test.ts`
  - SDK/Client: Not applicable
  - Auth: Not applicable

## Data Storage

**Databases:**
- None
  - Connection: Not applicable
  - Client: Not applicable

**File Storage:**
- Repo-local static files under `public/`
  - App data lives in `public/data/diseases.json`, `public/data/diseases/*.json`, and `public/data/symptoms-by-part.json`
  - Runtime imagery lives in `public/assets/body-parts/`, `public/assets/organs/`, `public/assets/systems/`, `public/assets/silhouette.webp`, and `public/assets/sections-body*.webp`
  - Data and assets are prepared by local scripts such as `scripts/split-diseases.js`, `scripts/extract-base64.mjs`, `scripts/extract-silhouette.mjs`, `scripts/extract-sections-body.mjs`, and `scripts/convert-to-webp.sh`

**Caching:**
- In-memory only
  - `src/data/data-service.ts` keeps a `Map` cache for disease shards and a singleton in-memory cache/promise for `symptoms-by-part.json`
  - No `localStorage`, `sessionStorage`, `IndexedDB`, service worker, or Redis integration was detected

## Authentication & Identity

**Auth Provider:**
- None in-repo
  - Implementation: The shipped package has no login, session, token, or identity layer; if a consumer plugs in a remote `externalData` provider from `src/body-map-explorer.ts`, authentication belongs to that host application

## Monitoring & Observability

**Error Tracking:**
- None

**Logs:**
- Script stdout/stderr only
  - `scripts/check-build-budget.js`, `scripts/validate-bp-coverage.js`, `scripts/split-diseases.js`, and the extraction scripts use `console.log`, `console.warn`, and `console.error`
  - No runtime telemetry, analytics, Sentry, Datadog, or OpenTelemetry integration was detected in `src/`

## CI/CD & Deployment

**Hosting:**
- Not explicitly configured
  - The package shape in `package.json` (`main`, `module`, `exports`, `types`, `files`) indicates a distributable browser library built into `dist/`
  - Production hosting model is static-file serving or embedding into a host app that can also serve the expected `assets/` and `data/` trees

**CI Pipeline:**
- None detected
  - No `.github/workflows/`, `Dockerfile`, `netlify.toml`, `vercel.json`, `render.yaml`, or similar deployment manifest exists at the repo root

## Environment Configuration

**Required env vars:**
- None

**Secrets location:**
- A root `.env` file exists, but no env-variable reads are present in `src/`, `scripts/`, `vite.config.ts`, or `vitest.config.ts`
- Any credentials for a future remote `externalData` provider would need to live in the consuming application, not in this repository’s current runtime path

## Webhooks & Callbacks

**Incoming:**
- None
  - No HTTP endpoints, webhook receivers, or server callbacks are defined in the repo

**Outgoing:**
- None at the network layer
  - The component exposes UI callbacks as DOM `CustomEvent`s rather than webhooks; `test/standalone.html` and `src/body-map-explorer.test.ts` exercise `organ-selected`, `organ-deselected`, `body-part-selected`, `body-part-deselected`, and `system-selected`

## Asset and Hosting Assumptions

- The library assumes that image assets stay under `{assetBase}/assets` and JSON data stays under `{assetBase}/data`; this path contract is encoded in `src/body-map-model.ts`, `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, `src/data/body-parts.ts`, and `src/data/data-service.ts`
- `vite.config.ts` sets `assetsInlineLimit: 0`, so deploys must publish the referenced files rather than rely on base64-inlined bundles
- `scripts/check-build-budget.js` measures the critical payload as `dist/body-map-explorer.es.js` plus the default initial-render assets, so alternative hosting should preserve those file names or update the budget logic alongside any path changes

---

*Integration audit: 2026-04-07*
