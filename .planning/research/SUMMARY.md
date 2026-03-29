# Research Summary: Body Map Web Component Refactor

**Domain:** Interactive medical visualization + Web Component packaging
**Researched:** 2026-03-29
**Overall confidence:** MEDIUM-HIGH

## Executive Summary

The refactor from a 7K-line monolithic HTML file to a distributable Web Component is architecturally sound and technically feasible. The core challenge is not any single technology decision but managing the asset strategy: the current 12 MB total payload (3.87 MB HTML with base64 images + 8 MB external data files) must be decomposed into a lightweight component shell (~50-80 KB) with lazy-loaded images and on-demand data.

Lit v3 is the recommended Web Component base class. It adds only ~5 KB gzipped while providing reactive properties, efficient template rendering, and Shadow DOM management -- all features that would require significant boilerplate to implement from scratch for a component with 10+ state variables and 30+ interactive functions. Vanilla Web Components would work but multiply development time for no user-facing benefit. Stencil adds unnecessary compilation complexity for a project targeting standard custom element consumers (Angular, Next.js).

The SVG body model with raster PNG organ layers is the right visual approach and should be preserved. The primary optimization is extracting 66 base64-encoded PNGs (~3.5 MB of the HTML file) into separate files, converting to WebP (~70% smaller), and lazy-loading below-fold organs. Combined with splitting the 7.6 MB disease data into per-body-part JSON chunks loaded on demand, the initial page load drops from ~12 MB to under 500 KB.

Vite in library mode provides the build tooling, outputting ESM + UMD bundles for both bundler consumption (Angular/Next.js) and CDN/script-tag usage (standalone). The dual data mode -- bundled data for standalone operation, API-driven data for directory integration -- is the key architectural pattern that bridges Milestone 1 (standalone component) and Milestone 3 (embedded in Next.js directory).

## Key Findings

**Stack:** Lit v3 + Vite library mode + TypeScript. No runtime dependencies beyond Lit (~5 KB).

**Architecture:** Shadow DOM Web Component with internal sub-components (sidebar, model, detail panel, data columns, modal). Props-down-events-up state management. CustomEvent with `composed: true` for host page communication.

**Critical pitfall:** Base64 images embedded in the JS bundle. If organ PNGs are accidentally bundled as base64 strings in the component's JS output, the "web component" becomes a 3+ MB JavaScript file -- defeating the purpose of the refactor. Images must be external files loaded via `href` attributes, with `import.meta.url` for path resolution.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Phase 1: Project Scaffolding & Asset Extraction** - Set up Vite + Lit + TypeScript project structure. Extract all base64 PNGs to separate files. Convert to WebP. Establish build pipeline. This must come first because every subsequent phase depends on the new project structure.
   - Addresses: Monolithic file decomposition, base64 extraction, build system
   - Avoids: Working in the old single-file paradigm

2. **Phase 2: Core SVG Body Model Component** - Build `<body-map-model>` sub-component with the SVG, organ layers, hit areas, and view switching. This is the foundational visual component.
   - Addresses: SVG rendering, hit area interaction, lazy image loading, CSS containment
   - Avoids: Trying to build UI panels before the core model works

3. **Phase 3: Sidebar & Detail Panel Components** - Build `<body-map-sidebar>` (systems list, body parts nav) and `<body-map-detail-panel>` (system descriptions). Wire up bidirectional selection.
   - Addresses: Body system selection, organ-to-system linking, panel interactions
   - Avoids: Over-coupling by building panels as independent sub-components

4. **Phase 4: Data Layer & Disease/Symptom Panels** - Implement lazy data loading, per-body-part JSON splitting, disease/symptom list rendering. Build `<body-map-data-columns>` and `<body-map-modal>`.
   - Addresses: 7.6 MB data problem, on-demand loading, search/filtering
   - Avoids: Loading all data upfront

5. **Phase 5: Component API & Distribution** - Build the `<body-map-explorer>` orchestrator that composes sub-components. Define the public API (attributes, properties, events, slots). Package for NPM. Write documentation.
   - Addresses: Framework-agnostic distribution, dual data mode, theming via CSS custom properties
   - Avoids: API design before implementation is stable

6. **Phase 6: Polish & Performance** - Accessibility (ARIA, keyboard nav), mobile responsive layout, visual quality improvements, performance profiling against budget.
   - Addresses: Accessibility gaps, responsive breakpoints, visual polish
   - Avoids: Premature optimization before architecture is settled

**Phase ordering rationale:**

- Phases 1-2 establish the foundation (build system + core visual) -- everything depends on these
- Phase 3 adds the supporting UI panels while the SVG model is fresh
- Phase 4 tackles the data problem separately from the visual layer (different concerns)
- Phase 5 wraps everything in the public API once internals are stable
- Phase 6 is polish that should not happen until the architecture is settled

**Research flags for phases:**

- Phase 1: May need deeper research on Vite asset handling configuration
- Phase 4: Data splitting strategy needs experimentation -- optimal chunk sizes depend on actual data distribution
- Phase 5: Angular integration testing needed with actual Angular project
- Phase 6: Accessibility patterns for SVG interactive elements may need dedicated research

## Confidence Assessment

| Area                   | Confidence  | Notes                                                                     |
| ---------------------- | ----------- | ------------------------------------------------------------------------- |
| Stack (Lit + Vite)     | MEDIUM-HIGH | Well-established technologies, exact latest versions not verified via npm |
| SVG optimization       | HIGH        | Base64 extraction is a clear win, verified via MDN                        |
| Web Component patterns | HIGH        | Shadow DOM, CustomEvent, slots all verified via MDN                       |
| Data loading strategy  | MEDIUM-HIGH | Patterns are standard, per-body-part splitting needs experimentation      |
| Prior art / ecosystem  | LOW-MEDIUM  | Could not verify current state of open-source body map projects           |
| Angular integration    | HIGH        | CUSTOM_ELEMENTS_SCHEMA is stable and well-documented                      |

## Gaps to Address

- Exact Lit v3 API surface -- verify `@lit/context` package stability during Phase 3
- Vite v6 library mode configuration -- may need adjustment based on testing
- WebP conversion quality -- need visual comparison with current PNGs to ensure medical illustration fidelity
- Intersection Observer behavior with SVG `<image>` elements inside Shadow DOM -- needs browser testing
- Back-view body model -- still needs artwork (PSD does not exist yet), which affects component architecture for the rotation feature
- Mobile layout -- current responsive breakpoint is minimal, Web Component needs container queries instead of media queries
