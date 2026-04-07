# Codebase Structure

**Analysis Date:** 2026-04-07

## Directory Layout

```text
[project-root]/
├── .planning/               # GSD project state, roadmap, phase history, and codebase docs
├── docs/                    # Planning references, extraction artifacts, and supporting research files
├── public/                  # Runtime assets and JSON copied into the Vite build output
├── scripts/                 # Manual asset/data generation and validation scripts
├── src/                     # Lit source, domain catalogs, shared tokens, and tests
├── dist/                    # Generated library bundle plus copied runtime assets/data
├── bodyimage/               # Source/reference PNGs for systems artwork
├── bpart_images/            # Source/reference body-part imagery and placeholders
├── video-screenshots/       # Captured UI frames used as visual references
├── index.html               # Vite dev harness that mounts `<body-map-explorer>`
├── interactive-body-model.html # Legacy standalone prototype
├── interactive-body-model-app.js # Legacy standalone script/data bundle
├── package.json             # npm scripts and package metadata
├── vite.config.ts           # Library build entry and output configuration
└── tsconfig.json            # TypeScript compiler settings
```

## Directory Purposes

**`src/`:**
- Purpose: Hold all current application source code.
- Contains: Root and child Lit components, static domain data, design tokens, and tests.
- Key files: `src/body-map-explorer.ts`, `src/body-map-model.ts`, `src/body-map-sidebar.ts`, `src/body-map-detail-panel.ts`, `src/body-map-data-panel.ts`, `src/body-map-modal.ts`

**`src/data/`:**
- Purpose: Own canonical IDs, metadata, mappings, geometry, and data access helpers.
- Contains: Domain definition arrays, reverse lookup maps, `DataProvider`, section-to-body-part mappings, modal anchor helpers, and highlight region geometry.
- Key files: `src/data/body-parts.ts`, `src/data/organs.ts`, `src/data/systems.ts`, `src/data/sections.ts`, `src/data/data-service.ts`, `src/data/section-mapping.ts`

**`src/styles/`:**
- Purpose: Centralize styling primitives shared across components.
- Contains: CSS custom property tokens packaged as Lit `css`.
- Key files: `src/styles/tokens.css.ts`

**`src/__tests__/`:**
- Purpose: Hold the primary automated test suite.
- Contains: Vitest specs for the model, explorer, modal, data panel, data service, and data integrity.
- Key files: `src/__tests__/body-map-explorer.test.ts`, `src/__tests__/body-map-model.test.ts`, `src/__tests__/data-service.test.ts`

**`public/assets/`:**
- Purpose: Ship runtime images by stable file path.
- Contains: Organ overlays, body-part photos, body system thumbnails, silhouettes, and front/back section art.
- Key files: `public/assets/silhouette.webp`, `public/assets/sections-body.webp`, `public/assets/body-parts/*.webp`, `public/assets/organs/*.webp`, `public/assets/systems/*.webp`

**`public/data/`:**
- Purpose: Ship runtime JSON used by the default data provider.
- Contains: Bulk symptoms files plus per-body-part disease JSON keyed by `bp_*` filenames.
- Key files: `public/data/symptoms-by-part.json`, `public/data/diseases/*.json`

**`scripts/`:**
- Purpose: Maintain generated assets and runtime datasets outside the component code.
- Contains: Disease splitting, coverage validation, image extraction, silhouette extraction, and WebP conversion scripts.
- Key files: `scripts/split-diseases.js`, `scripts/validate-bp-coverage.js`, `scripts/extract-sections-body.mjs`, `scripts/convert-to-webp.sh`

**`docs/`:**
- Purpose: Preserve planning documents and data-extraction artifacts that explain how the assets and mappings were produced.
- Contains: Design plans, body-part batching/results JSON, spreadsheets, and helper scripts.
- Key files: `docs/plans/2026-03-21-three-column-merge-plan.md`, `docs/plans/2026-03-08-back-view-interactive-sections-design.md`, `docs/body_parts_results/map_body_parts.py`

**`dist/`:**
- Purpose: Hold generated distributable output.
- Contains: ES and UMD bundles plus copied assets and JSON data for the packaged library.
- Key files: `dist/body-map-explorer.es.js`, `dist/body-map-explorer.umd.js`, `dist/assets/`, `dist/data/`

**`.planning/`:**
- Purpose: Hold GSD workflow state and repository-local planning artifacts.
- Contains: `PROJECT.md`, `STATE.md`, requirements, roadmap, phase directories, and codebase map documents.
- Key files: `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/codebase/`

## Key File Locations

**Entry Points:**
- `src/body-map-explorer.ts`: Library entry, root custom element registration, and application shell.
- `index.html`: Development harness that imports `src/body-map-explorer.ts` directly.
- `interactive-body-model.html`: Legacy self-contained HTML prototype outside the current build.
- `interactive-body-model-app.js`: Legacy standalone script referenced by the older prototype.

**Configuration:**
- `package.json`: Defines `dev`, `build`, `preview`, `test`, `check:budget`, and `split-diseases` scripts.
- `vite.config.ts`: Uses `src/body-map-explorer.ts` as the library entry and writes bundles into `dist/`.
- `vitest.config.ts`: Configures `happy-dom` and includes `src/**/*.test.ts`.
- `tsconfig.json`: Enables `strict` TypeScript compilation and emits declarations into `dist/`.

**Core Logic:**
- `src/body-map-explorer.ts`: Shared state ownership, data loading, derived selections, and component composition.
- `src/body-map-model.ts`: SVG rendering, keyboard navigation, view switching, gender switching, and section/body-part interactions.
- `src/data/data-service.ts`: Default fetch-backed `DataProvider` plus caching and organ-to-data-key translation.
- `src/data/systems.ts`: Body system catalog and reverse organ-to-system map.
- `src/data/body-parts.ts`: Sidebar/detail body-part catalog and photo helper functions.

**Testing:**
- `src/__tests__/body-map-explorer.test.ts`: Root-shell integration behavior.
- `src/__tests__/body-map-model.test.ts`: SVG model behavior and interaction paths.
- `src/__tests__/body-map-modal.test.ts`: Modal behavior and retry/close interactions.
- `src/__tests__/data-service.test.ts`: Default data provider caching and fetch behavior.
- `src/body-map-explorer.test.ts`: Additional co-located explorer spec kept outside `src/__tests__/`.

## Naming Conventions

**Files:**
- Top-level runtime components use flat kebab-case names with a shared prefix: `src/body-map-explorer.ts`, `src/body-map-model.ts`, `src/body-map-sidebar.ts`.
- Data modules use noun-based filenames that mirror the dataset or mapping they export: `src/data/systems.ts`, `src/data/section-mapping.ts`, `src/data/body-part-modal-anchor.ts`.
- Tests use `*.test.ts`; most live in `src/__tests__/`, with `src/body-map-explorer.test.ts` as the main exception.
- Runtime JSON filenames in `public/data/diseases/` must stay aligned with `bp_*` body-part IDs used in `src/data/body-parts.ts` and `src/data/section-mapping.ts`.

**Directories:**
- Source directories are lowercase and responsibility-based: `src/data`, `src/styles`, `src/__tests__`.
- Runtime asset directories are type-based: `public/assets/body-parts`, `public/assets/organs`, `public/assets/systems`.
- Planning and research directories are grouped by workflow rather than runtime behavior: `.planning/`, `docs/`, `video-screenshots/`.

## Ownership Conventions

**Shared State Ownership:**
- Put any new cross-panel or cross-view state in `src/body-map-explorer.ts`.
- Keep child components in `src/body-map-*.ts` presentation-focused; they should emit events upward instead of fetching data or mutating sibling state directly.

**Domain Catalog Ownership:**
- Put new IDs, labels, mappings, geometry, or filename crosswalks in `src/data/` next to the existing domain module that owns that concept.
- If a feature depends on a new asset filename, update both the owning source catalog in `src/data/*.ts` and the matching file in `public/assets/`.

**Runtime Data Ownership:**
- Keep fetch logic and default caching in `src/data/data-service.ts`.
- Keep shipped content files in `public/data/`; do not hardcode disease or symptom lists into component files.

**Styling Ownership:**
- Put reusable tokens in `src/styles/tokens.css.ts`.
- Keep component-specific layout and interaction styles inside each component’s `static styles` block rather than creating a global stylesheet.

## Where to Add New Code

**New Feature:**
- Primary code: `src/body-map-explorer.ts` if the feature changes shared state or affects multiple panels; otherwise add a new `src/body-map-<feature>.ts` component beside the existing peers.
- Tests: `src/__tests__/` for new Vitest specs that cover the feature end to end; match the component or module name in the filename.

**New Component/Module:**
- Implementation: `src/body-map-<role>.ts` for UI components, or `src/data/<concept>.ts` for domain data and mappings.

**Utilities:**
- Shared helpers: place them beside the owning concern instead of creating a generic `utils/` directory. Examples: data helpers belong in `src/data/`, and visual helper logic belongs in the relevant `src/body-map-*.ts` component.

**New Assets or Data Files:**
- Runtime images: `public/assets/<category>/`
- Runtime JSON: `public/data/` or `public/data/diseases/`
- Source or generation inputs: `bpart_images/`, `bodyimage/`, or `docs/` when the files are reference material rather than shipped runtime assets

## Special Directories

**`dist/`:**
- Purpose: Generated package output for consumers.
- Generated: Yes
- Committed: No

**`public/data/diseases/`:**
- Purpose: Per-body-part disease JSON keyed by `bp_*` identifiers.
- Generated: Yes
- Committed: Yes

**`public/assets/`:**
- Purpose: Runtime images referenced by the current Lit app.
- Generated: Yes
- Committed: Yes

**`docs/body_parts_batches/`:**
- Purpose: Body-part extraction batch artifacts used during asset and data preparation.
- Generated: Yes
- Committed: Yes

**`docs/body_parts_results/`:**
- Purpose: Body-part extraction result artifacts and the mapping helper script.
- Generated: Yes
- Committed: Yes

**`.planning/`:**
- Purpose: Workflow metadata and project planning context.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-07*
