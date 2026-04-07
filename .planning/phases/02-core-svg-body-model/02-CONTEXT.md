# Phase 2: Core SVG Body Model - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the `<body-map-model>` Lit sub-component that renders the anatomical body diagram with all organ layers, hit-area overlays, hover/click interaction, gender toggle, and three view modes. Phase 2 delivers the core visual model that users see and interact with. It does NOT wire up the body systems sidebar (Phase 3), data panels (Phase 4), or component API (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Visual Fidelity

- **D-01:** Pixel-faithful replica of the existing body model visuals. The rendered component must match the current `interactive-body-model.html` appearance — same hover effects (`rgba(100, 180, 255, 0.35)`), same selection highlights, same drop-shadow filter. Visual refinement is scoped to Phase 6 (UX-01).
- **D-02:** Body silhouette background extracted from existing HTML exactly as-is. Guarantees pixel alignment with organ overlays.
- **D-03:** Hover tooltip (organ name near cursor) deferred to Phase 3+. Phase 2 only shows the visual highlight on hover.
- **D-04:** Selected-organ pill list deferred to Phase 3. Phase 2 shows selection state only on the organs themselves (highlight effect).

### View Mode Scope

- **D-05:** All three view modes implemented: organs (individual organ layers), organs2 (organ groups), and sections (body regions). Despite MODEL-06 mentioning only organs + sections, the user wants full parity with the existing app.
- **D-06:** Front/back rotation deferred entirely to Phase 6. No rotate button in Phase 2. The entire front/back feature (mechanism + artwork) ships together.

### Control Placement

- **D-07:** Split layout for controls — view-switcher tabs (Organs / Organs 2 / Sections) placed above the SVG model, gender toggle placed below the SVG model. This separates view-level controls from content-level controls.
- **D-08:** View-switcher tabs use text labels only (no icons). Matches existing app style, consistent with pixel-faithful approach.

### Image Loading

- **D-09:** All organ images load on component mount, not lazy-loaded. Total WebP payload is ~200-400 KB — manageable without lazy loading. Lazy loading deferred to Phase 6 (PERF-03) if profiling shows it's needed.

### Claude's Discretion

- Entrance animations: Claude decides whether to replicate the existing fade-in/slide animations or skip for Phase 2
- SVG aspect ratio and scaling behavior within the three-column layout
- SVG data approach: how organ hit-area paths, positions, and image references are structured in the codebase (inline Lit template, JSON data file, or external SVG)
- Component decomposition: how `<body-map-model>` is structured internally (single component vs. smaller sub-components)
- State management pattern for organ selection within the component

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap

- `.planning/REQUIREMENTS.md` — MODEL-01 through MODEL-07 define Phase 2 acceptance criteria
- `.planning/ROADMAP.md` — Phase 2 success criteria (5 items) and phase dependency chain

### Source Code (Extract From)

- `interactive-body-model.html` lines 1374-2031 — SVG organ `<g class="body-part-group">` elements with hit-area paths (20 organs)
- `interactive-body-model.html` lines 2046-2200 — SVG section `<g class="body-section-group">` elements (14 sections)
- `interactive-body-model.html` lines 150-170 — CSS hover/selection styles for `.body-part-group` and `.body-section-group`
- `interactive-body-model.html` lines 4856-5100 — JavaScript `setView()`, `setGender()` interaction logic

### Phase 1 Deliverables (Build On)

- `src/body-map-explorer.ts` — Root component shell with three-column grid layout
- `src/styles/tokens.css.ts` — CSS design tokens (`--bme-*` custom properties)
- `public/assets/organs/` — 19 WebP organ images (brain, heart, lungs_left, etc.)
- `vite.config.ts` — Build configuration with `assetsInlineLimit: 0`

### Research

- `.planning/research/PITFALLS.md` — Critical pitfall: base64 images must NOT be bundled into JS output
- `.planning/research/WEB_COMPONENTS.md` — Shadow DOM patterns, CustomEvent with `composed: true`
- `.planning/research/SVG_OPTIMIZATION.md` — SVG optimization strategies

### Codebase Analysis

- `.planning/codebase/CONVENTIONS.md` — Naming patterns, CSS organization, JS interaction patterns
- `.planning/codebase/STRUCTURE.md` — File layout, line ranges for CSS/HTML/JS sections

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `public/assets/organs/*.webp` (19 files): Extracted organ images ready for `<image>` tag references
- `src/styles/tokens.css.ts`: CSS design tokens already established — Phase 2 should use these for any new styling
- `src/body-map-explorer.ts`: Shell component with three-column grid — Phase 2 adds `<body-map-model>` to the center column

### Established Patterns

- Lit v3 with `@customElement` decorator for element registration
- CSS custom properties declared on `:host` in Shadow DOM stylesheet
- Import paths use `.js` extension for TypeScript sources (ESM resolution)
- Images referenced as URL strings, never imported in JS

### Integration Points

- The center column (`body-model-area` div) in `body-map-explorer.ts` is where `<body-map-model>` replaces the placeholder text
- Phase 3 will need to communicate with `<body-map-model>` for bidirectional organ-system selection — Phase 2 should expose selection state via Lit reactive properties or events
- The 20 organ IDs (brain, heart, lungs_left, etc.) and their `data-name` attributes must be preserved for Phase 3+ compatibility

</code_context>

<specifics>
## Specific Ideas

- Split controls: view tabs above SVG, gender toggle below — this is a deliberate divergence from the existing app's layout where both are above
- All three views (organs, organs2, sections) despite MODEL-06 only mentioning two — user wants full parity

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-core-svg-body-model_
_Context gathered: 2026-03-29_
