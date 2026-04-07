# Coding Conventions

**Analysis Date:** 2026-04-07

## Naming Patterns

**Files:**
- Use kebab-case for source modules in `src/`, especially custom elements and data modules: `src/body-map-explorer.ts`, `src/body-map-model.ts`, `src/body-map-data-panel.ts`, `src/data/body-part-modal-anchor.ts`.
- Keep CSS token modules on the same pattern with a descriptive suffix: `src/styles/tokens.css.ts`.
- Name tests with a `.test.ts` suffix. Most suites live in `src/__tests__/`, while one older API suite remains co-located at `src/body-map-explorer.test.ts`.

**Functions:**
- Use camelCase for exported functions and class methods: `fetchDiseases`, `fetchSymptomsForPart`, `getDefaultDataProvider`, `getBodyPartModalAnchor`.
- Prefix component-internal methods and getters with `_` inside Lit classes: `_handleSystemToggleRequest`, `_renderDiseasesTab`, `_panelOrganIds`, `_bodyPartImageUrl`.
- Use verb-led handler names for UI and event methods: `_handleRetryClick`, `_emitToggle`, `_dispatchOrganSelectionEvent`.

**Variables:**
- Use `UPPER_SNAKE_CASE` for immutable datasets and lookup tables in `src/data/`: `BODY_SYSTEMS`, `BODY_PARTS`, `BODY_SYSTEMS_BY_ID`, `SECTION_TO_BP_KEYS`, `ORGAN_TO_DATA_KEY`.
- Use private `_camelCase` fields for mutable component state in Lit classes: `_selectedBodyPartIds`, `_loadingIds`, `_modalError`, `_bodyPartsSearch`.
- Use short, local names only inside tight scopes, usually for render transforms: `q`, `next`, `base`, `prefix`.

**Types:**
- Use PascalCase for interfaces, classes, and aliases: `BodySystemDefinition`, `BodyPartPhotoEntry`, `DiseaseEntry`, `BodyMapExplorer`.
- Model finite UI states with string unions instead of enums: `type ViewMode = "organs" | "organs2" | "sections"` in `src/body-map-model.ts`.
- Keep DOM tag registration explicit with `declare global` `HTMLElementTagNameMap` blocks at the end of each component file such as `src/body-map-modal.ts` and `src/body-map-detail-panel.ts`.

## Code Style

**Formatting:**
- No formatter config is present in the repository root. Match the existing manual style used across `src/**/*.ts`.
- Use double quotes, semicolons, and trailing commas in multiline literals and calls, as seen in `src/body-map-explorer.ts`, `src/body-map-model.ts`, and `src/data/systems.ts`.
- Keep indentation at two spaces and prefer readable multiline object/array literals over compressed one-line structures when data is long, especially in `src/data/body-parts.ts` and `src/data/sections.ts`.
- Prefer early returns in getters and guards instead of nested branching, as in `src/body-map-explorer.ts`, `src/body-map-modal.ts`, and `src/data/body-part-modal-anchor.ts`.

**Linting:**
- No `eslint`, `prettier`, or `biome` config was detected in the repo root.
- Treat `tsconfig.json` as the main static quality gate. Current enforced compiler constraints are `strict`, `forceConsistentCasingInFileNames`, `moduleResolution: "bundler"`, and decorator support for Lit components.

## Import Organization

**Order:**
1. Third-party runtime imports first: `lit`, `vitest`, or `node:*` modules, as in `src/body-map-model.ts` and `src/__tests__/body-part-photos.test.ts`.
2. Side-effect custom-element registration imports next when a test or container needs the tag defined: `import "../body-map-modal.js";` in `src/__tests__/body-map-modal.test.ts`.
3. Relative value imports from sibling modules after that: `import { BODY_SYSTEMS } from "./data/systems.js";` in `src/body-map-explorer.ts`.
4. Type-only imports are separated with `type` to keep runtime imports clean: `import type { DiseaseEntry } from "./data/data-service.js";` in `src/body-map-modal.ts`.

**Path Aliases:**
- No path aliases are configured in `tsconfig.json`.
- Use explicit relative ESM imports with a `.js` extension from TypeScript source, even inside `src/`: `./body-map-model.js`, `../data/systems.js`.

## Error Handling

**Patterns:**
- Keep network and file failure translation close to the data boundary. `src/data/data-service.ts` wraps `fetch` failures in contextual `Error` messages and normalizes unknown symptom keys to empty arrays.
- Store recoverable UI errors in component state instead of throwing from render. `src/body-map-explorer.ts` uses `_errorIds` and `_modalError`; `src/body-map-data-panel.ts` and `src/body-map-modal.ts` render retry affordances from those states.
- Bubble retry and close actions as typed `CustomEvent`s rather than wiring child components directly to services. Current examples are `retry-organ` in `src/body-map-data-panel.ts` and `modal-retry` / `modal-close` in `src/body-map-modal.ts`.
- Fail fast in Node scripts with thrown errors or non-zero exit codes. `scripts/check-build-budget.js` and `scripts/validate-bp-coverage.js` are the pattern to follow for verification scripts.

## Logging

**Framework:** None in browser code. `console.log` and `console.error` are used only in Node scripts.

**Patterns:**
- Keep `src/` runtime code silent. No application logging was detected in `src/body-map-explorer.ts`, `src/body-map-model.ts`, `src/body-map-sidebar.ts`, or related child components.
- Use console output only for developer-facing scripts that summarize a validation pass, such as `scripts/check-build-budget.js`, `scripts/validate-bp-coverage.js`, and `scripts/split-diseases.js`.

## Comments

**When to Comment:**
- Add comments for architectural intent, performance constraints, or threat-model reasoning, not for obvious render code. Strong examples are the module header in `src/data/data-service.ts`, the threat-model notes in `src/body-map-modal.ts`, and the debounce note in `src/body-map-data-panel.ts`.
- Use short inline comments to explain behavior forks or compatibility rules when the code path is not obvious, as in the Organs2 modal path and system/body-part exclusivity comments in `src/body-map-explorer.ts`.

**JSDoc/TSDoc:**
- Lightweight JSDoc is used on exported functions and modules that carry domain constraints: `src/data/data-service.ts` and `src/data/body-part-modal-anchor.ts`.
- Do not add JSDoc to every private helper. Current practice documents the why and contract, then relies on descriptive method names for the rest.

## Function Design

**Size:**
- Accept large class files for complex Lit components. `src/body-map-explorer.ts` and `src/body-map-model.ts` are the current orchestration and rendering hubs.
- Pull reusable helpers to module scope when they should not be recreated per render. The standalone `debounce()` helper in `src/body-map-modal.ts` and `src/body-map-data-panel.ts` is the established pattern.

**Parameters:**
- Pass typed `CustomEvent` payloads into handlers for container-level orchestration: `_handleSystemToggleRequest(event: CustomEvent<{ systemId: BodySystemId }>)` in `src/body-map-explorer.ts`.
- Prefer explicit `Map`, `Set`, string unions, and typed arrays over broad object bags for stateful UI data, as seen across `src/body-map-explorer.ts` and `src/body-map-data-panel.ts`.

**Return Values:**
- Return `html` or `nothing` from render helpers rather than mutating DOM imperatively. See `_renderSkeleton()`, `_renderError()`, `_renderSymptomsTab()` in `src/body-map-modal.ts`.
- Return `null` from lookup helpers when absence is meaningful, for example `getOrganGroupModalAnchor()` in `src/data/body-part-modal-anchor.ts` and computed getters in `src/body-map-detail-panel.ts`.

## Module Design

**Exports:**
- Use named exports only. No default exports were detected in `src/`.
- Component modules both define and register their custom elements in the same file using `@customElement`, then export the class, for example `src/body-map-sidebar.ts` and `src/body-map-model.ts`.
- Data modules export typed source arrays plus derived lookup maps in the same file, for example `src/data/body-parts.ts` and `src/data/systems.ts`.

**Barrel Files:** None detected. Import from concrete file paths such as `src/data/systems.ts` or `src/styles/tokens.css.ts`.

## Review Hotspots

**Explorer Orchestration:**
- Treat `src/body-map-explorer.ts` as the highest-risk change surface. It coordinates sidebar, model, detail panel, data panel, modal state, and async loading. Review event names, selection invariants, and per-organ error handling together whenever editing this file.

**SVG Rendering And Interaction:**
- Treat `src/body-map-model.ts` as a rendering hotspot. Small changes affect asset selection, SVG IDs/classes, keyboard state, custom-event payloads, and many tests in `src/__tests__/body-map-model.test.ts`.

**Dual Event Compatibility:**
- Preserve the current public event contract intentionally. `src/body-map-explorer.ts` still listens to both `organ-select-request` and `body-part-select-request`, while `src/body-map-sidebar.ts` only emits `body-part-select-request`. Any cleanup here must update both `src/body-map-explorer.test.ts` and `src/__tests__/body-map-explorer.test.ts`.

**Legacy Reference Artifacts:**
- Avoid treating `interactive-body-model-app.js`, `diseases-data.js`, `symptoms-data.js`, and `symptoms-by-bodypart-data.js` as the source of truth without checking the typed modules in `src/data/`. The active application and test flow is centered on `src/` plus `public/`.

---

*Convention analysis: 2026-04-07*
