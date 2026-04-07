# Phase 1: Scaffolding & Asset Extraction - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 01-scaffolding-asset-extraction
**Areas discussed:** Component shell scope, Image asset organization, Data file strategy

---

## Component Shell Scope

| Option                         | Description                                                                                                                                                                     | Selected |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Minimal skeleton (Recommended) | A bare `<body-map-explorer>` rendering a placeholder/empty layout grid. Proves npm run dev/build work, images load from external WebP files. Phase 2 builds the real SVG model. |          |
| Static visual port             | Port CSS layout + SVG markup into Lit templates. Component looks like prototype but no interactivity. Gives Phase 2 a visual foundation.                                        |          |
| You decide                     | Claude picks the approach that best balances Phase 1's success criteria with clean handoff to Phase 2.                                                                          | ✓        |

**User's choice:** You decide — Claude's discretion
**Notes:** User trusts Claude to determine the right balance between proving the pipeline and providing a useful foundation for Phase 2.

---

## Image Asset Organization

### Image location

| Option                       | Description                                                                                                                                                 | Selected |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| public/assets/ (Recommended) | Images in Vite's public/ directory, served as-is, never bundled into JS. Three subdirs: organs/, body-parts/, systems/. Host apps use asset-base attribute. | ✓        |
| src/assets/                  | Standard Vite asset location with hash filenames. Requires careful config to prevent base64 inlining (Vite inlines assets <4KB by default).                 |          |
| You decide                   | Claude picks based on Web Component distribution requirements and base64 pitfall.                                                                           |          |

**User's choice:** public/assets/ (Recommended)
**Notes:** User selected the safe approach that guarantees images stay external to the JS bundle.

### WebP conversion scope

| Option                   | Description                                                                                                              | Selected |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- |
| All images (Recommended) | Convert all 155 images (66 organs + 77 body-part thumbs + 12 system images) to WebP. Consistent format, maximum savings. | ✓        |
| Only the 66 organ PNGs   | Only convert base64-extracted organ images. Leave existing PNGs as-is.                                                   |          |
| You decide               | Claude picks based on effort vs benefit.                                                                                 |          |

**User's choice:** All images (Recommended)
**Notes:** User wants consistent WebP across the board.

---

## Data File Strategy

| Option                                   | Description                                                                                                                                         | Selected |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Convert to JSON in public/ (Recommended) | Convert window.\* JS files to pure JSON in public/data/. Component fetches at runtime. Never bundled. Evolves into per-body-part chunks in Phase 4. | ✓        |
| Convert to ES modules                    | Rewrite as export default TypeScript modules in src/data/. Tree-shakeable but risks inflating JS bundle with 7.3MB diseases file.                   |          |
| Keep as external scripts                 | Leave as window.\* JS files. Minimal change, zero bundle risk, but host page must include 3 extra script tags.                                      |          |
| You decide                               | Claude picks based on Web Component distribution needs and Phase 4 compatibility.                                                                   |          |

**User's choice:** Convert to JSON in public/ (Recommended)
**Notes:** User chose the pattern that naturally evolves into per-body-part chunks when Phase 4 splits the data.

---

## Claude's Discretion

- Component shell scope: full discretion on visual output of Phase 1
- Vite configuration details
- TypeScript strictness and linting
- Project directory layout within src/
- WebP quality settings and tooling

## Deferred Ideas

None — discussion stayed within phase scope
