# Phase 1: Scaffolding & Asset Extraction - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up a Vite + Lit + TypeScript build pipeline from scratch and extract all base64-encoded assets from the monolithic HTML file into external files. Phase 1 delivers the project foundation that every subsequent phase builds on. It does NOT rebuild the interactive body model (Phase 2) or wire up any sidebar/panel behavior (Phase 3+).

</domain>

<decisions>
## Implementation Decisions

### Component Shell Scope

- **D-01:** Claude's discretion on what Phase 1 renders. The component should prove the build pipeline works (`npm run dev`, `npm run build`) and demonstrate that external images load correctly. The exact visual output (empty grid vs static port) is Claude's call based on clean handoff to Phase 2.

### Image Asset Organization

- **D-02:** All extracted images go in `public/assets/` with three subdirectories:
  - `public/assets/organs/` — 66 organ WebP images (extracted from base64 in HTML)
  - `public/assets/body-parts/` — 77 body part thumbnail WebPs (converted from `bpart_images/`)
  - `public/assets/systems/` — 12 body system WebPs (converted from `bodyimage/`)
- **D-03:** All 155 images (66 organs + 77 body-part thumbnails + 12 system images) converted to WebP format. No PNGs remain in the deliverable.
- **D-04:** Images placed in Vite's `public/` directory to guarantee they are never bundled into JS output. This directly addresses the critical base64-in-JS-bundle pitfall identified in research.

### Data File Strategy

- **D-05:** The three data files (`diseases-data.js`, `symptoms-data.js`, `symptoms-by-bodypart-data.js`) are converted from `window.*` JS globals to pure JSON files in `public/data/`:
  - `public/data/diseases.json` (~7.3 MB)
  - `public/data/symptoms.json` (~429 KB)
  - `public/data/symptoms-by-part.json` (~99 KB)
- **D-06:** Component loads data via `fetch()` at runtime, never bundled into JS. This pattern naturally evolves into per-body-part JSON chunks when Phase 4 (DATA-05) splits the data.

### Claude's Discretion

- Component shell scope: Claude decides how much visual structure Phase 1 renders, balancing "canonical source" success criterion with clean Phase 2 handoff
- Exact Vite configuration details (library mode settings, build targets, dev server options)
- TypeScript strictness level and linting setup
- Project directory layout within `src/` (component files, types, utilities)
- WebP conversion quality settings and tooling choice

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Roadmap

- `.planning/REQUIREMENTS.md` — BUILD-01 through BUILD-05 define Phase 1 acceptance criteria
- `.planning/ROADMAP.md` — Phase 1 success criteria (5 items) and phase dependency chain

### Research (Stack & Architecture)

- `.planning/research/SUMMARY.md` — Stack decision rationale: Lit v3 + Vite library mode + TypeScript, phase ordering, confidence assessment
- `.planning/research/PITFALLS.md` — Critical pitfall: base64 images must NOT be bundled into JS output; Vite's default 4KB inline threshold
- `.planning/research/WEB_COMPONENTS.md` — Web Component patterns, Shadow DOM, CustomEvent with `composed: true`
- `.planning/research/SVG_OPTIMIZATION.md` — SVG and image optimization strategies, WebP conversion

### Codebase Analysis

- `.planning/codebase/STACK.md` — Current technology: zero build tooling, file sizes, data pipeline
- `.planning/codebase/STRUCTURE.md` — Current file layout, line ranges for CSS/HTML/JS sections, where code lives
- `.planning/codebase/CONVENTIONS.md` — Naming patterns, CSS organization, JS module pattern (IIFE)

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `bpart_images/` (77 PNG files): Body part thumbnails already exist as external files — need WebP conversion and relocation to `public/assets/body-parts/`
- `bodyimage/` (12 PNG files): Body system overview images already exist as external files — need WebP conversion and relocation to `public/assets/systems/`
- `generate-data-files.py`: Python script that produces the 3 data files from ICD-10-CM source — may inform the JSON conversion process

### Established Patterns

- 66 base64 organ PNGs are embedded in `<image>` tags within `<g class="body-part-group">` SVG groups (lines 1374-2031 of HTML)
- 11 body system base64 thumbnails are embedded in the `BODY_SYSTEMS` array (lines 2579-3225 of JS)
- Data files use `window.DISEASES_BY_BODY_PART`, `window.SYMPTOMS_DATA`, `window.SYMPTOMS_BY_BODY_PART` global assignment pattern
- All CSS is inline in a single `<style>` block (lines 7-1277)
- All JS is in a single IIFE (lines 2577-7009)

### Integration Points

- The monolithic `interactive-body-model.html` remains as reference — Phase 2+ will extract logic from it
- `generate-data-files.py` may need a small update to output JSON instead of `window.*` JS files
- Existing `.gitignore` needs updates for `node_modules/`, `dist/`, etc.

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User trusts Claude's judgment on shell scope and project structure details.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 01-scaffolding-asset-extraction_
_Context gathered: 2026-03-29_
