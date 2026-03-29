# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive body model — a self-contained HTML application that renders an anatomical body diagram with clickable/hoverable organ regions. The source artwork comes from a PSD file (`blankaasd.psd`, 698x1698px, 20 layers) with each organ extracted as a base64-embedded PNG inside an inline SVG.

## Architecture

**Single-file app:** Everything lives in `interactive-body-model.html` (~3.4MB, ~2280 lines). It contains inline CSS, an SVG with embedded raster images, and inline JavaScript. The file is large because each body part's PNG is base64-encoded directly in `<image>` tags, plus 11 body system thumbnails are also base64-encoded.

**Three-column layout:**

- **Left column** (`.left-column`, 260px sticky): Body Systems sidebar (`.systems-panel`) + existing pill selection list (`.body-parts-panel`)
- **Middle column** (`.body-model-container`, flex): Interactive SVG body model with organs/sections views, gender toggle, rotate button
- **Right column** (`.tooltip-panel`, 300px sticky): Detail panel showing body system description when a system is selected

**SVG structure:**

- ViewBox: `0 0 698 1698`
- Body silhouette is the non-interactive background (Layer 1)
- Each organ is a `<g class="body-part-group" data-part="..." data-name="...">` containing:
  - A `<image>` element (class `part-image`) with base64 PNG data
  - A `<path class="hit-area">` defining the clickable region as a transparent polygon overlay

**Body Systems data:**

- `BODY_SYSTEMS` array: 11 systems (cardiovascular, digestive, endocrine, immune, integumentary, muscular, nervous, reproductive, respiratory, skeletal, urinary) each with title, color, base64 thumbnail, medical description, and mapped organ IDs
- `ORGAN_TO_SYSTEM` reverse lookup: maps organ IDs back to their parent system(s)
- `activeSystem` tracks the currently selected body system

**Bidirectional linking:**

- `selectSystem(id)` / `deselectSystem()`: clicking a system in the left sidebar highlights all mapped organs in the body model and shows the description in the right tooltip panel
- `updateSystemFromOrgan(id)`: clicking an organ in the body model activates the corresponding system in the sidebar and tooltip
- `deselectPart(id)`: removing an organ via the pill list also updates the system state

**Interaction model:**

- Hover: blue highlight overlay via CSS (`rgba(100, 180, 255, 0.35)`) + drop-shadow filter
- Click: toggle selection (multiple simultaneous selections allowed), persistent stronger blue
- Selected parts appear as a pill list below the systems menu
- Gender toggle: switches between male/female reproductive organs
- Rotate button: CSS 3D flip (front/back view, back view is placeholder)
- Touch support via `touchstart`/`touchend` events

**Body parts (20 layers):** brain, larynx/trachea, thyroid, liver, lungs (left/right), heart, knee joint, gallbladder, spleen, pancreas, kidneys, stomach, intestines, muscle, thymus, bladder, male reproductive, female reproductive.

## Development

No build system — open `interactive-body-model.html` directly in a browser. No dependencies, no package manager.

To serve locally (for testing):

```
python3 -m http.server 8000
```

## Key Files

- `interactive-body-model.html` — the entire application (CSS + SVG + JS, all inline)
- `blankaasd.psd` — source Photoshop file with all organ layers
- `PROJECT_PLAN.md` — phased implementation plan (PSD-to-SVG conversion, interaction, front/back rotation, responsive layout, polish)
- `docs/plans/2026-03-21-three-column-merge-design.md` — design document for the body systems merge
- `docs/plans/2026-03-21-three-column-merge-plan.md` — implementation plan for the merge

## Git Workflow

- **main** branch is the primary branch
- **UAT** branch exists for user acceptance testing
- Feature branches use `feature/` prefix (e.g., `feature/changes-body-map`)

## Important Notes

- The HTML file is ~3.4MB due to base64 images — avoid reading it in full; use offset/limit or grep to find specific sections
- The back-view rotation is a placeholder (no back-view PSD exists yet)
- Male/female reproductive layers are toggled via a gender selector (one hidden at a time)

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Body Part Directory — Interactive Medical Knowledge Platform**

A body-part-centered medical knowledge platform that combines an interactive anatomical body model with a large-scale content directory. Users explore health information by clicking on body parts rather than typing into search forms — discovering diseases, symptoms, medical tests, procedures, treatments, and nutritional guidance through an intuitive visual interface. The platform serves both as a standalone health resource and as a discovery layer for an existing medical test scheduling website.

**Core Value:** Make health information discovery intuitive and visual — users start from "where it hurts" and navigate a rich medical knowledge graph, ultimately connecting them to actionable next steps like scheduling a medical test.

### Constraints

- **Existing stack**: Main site is Angular + MySQL + AWS — directory must connect via subdomain, not replace existing infrastructure
- **Infrastructure**: Team will need guidance on DNS/subdomain routing for separate Next.js deployment
- **Data readiness**: Body part → disease → symptom mappings are solid; procedures, treatments, foods, genes need data sourcing
- **Single developer**: Project is primarily solo-developed with AI assistance — phasing and scope management are critical
- **No build system**: Current body map has zero tooling — refactor must introduce a proper development environment
- **Medical accuracy**: Content must be factually accurate — requires editorial review pipeline, especially for AI-generated content
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- HTML5 — The entire application UI, SVG body model, and structure (`interactive-body-model.html`)
- CSS3 — All styling is inline within `<style>` in `interactive-body-model.html` (lines 7-1190)
- JavaScript (ES6) — All application logic is inline within `<script>` in `interactive-body-model.html` (lines 2577-7008), plus three external JS data files
- Python 3 — Offline data generation scripts (`generate-data-files.py`, `docs/merge_body_parts.py`, `docs/body_parts_results/map_body_parts.py`)
- JSON — Intermediate data format for batch/result files (`docs/body_parts_batches/batch_*.json`, `docs/body_parts_results/results_*.json`, `symptoms-data.json`)
## Runtime
- Any modern web browser (Chrome, Firefox, Safari, Edge) — no server-side runtime required
- Python 3.x — only needed for running data generation scripts offline
- None — no `package.json`, `requirements.txt`, `pyproject.toml`, or any dependency manifest exists
- No lockfiles present
## Frameworks
- None — the application is 100% vanilla HTML/CSS/JavaScript with zero framework dependencies
- No React, Vue, Angular, Svelte, or any other UI framework
- None — no test framework (Jest, Vitest, Playwright, etc.) is configured
- A `.playwright-mcp/` directory exists with a single console log file, but no Playwright config or test files
- None — no build system (Webpack, Vite, esbuild, Rollup, etc.)
- No transpilation, bundling, or minification pipeline
- Open `interactive-body-model.html` directly in a browser to run
## Key Dependencies
- `symptoms-data.js` (429 KB) — Flat array of ~10,000+ symptom strings, assigned to `window.SYMPTOMS_DATA`
- `diseases-data.js` (7.3 MB) — Disease entries grouped by body part ID (ICD-10-CM codes), assigned to `window.DISEASES_BY_BODY_PART`
- `symptoms-by-bodypart-data.js` (99 KB) — Symptoms grouped by body part ID, assigned to `window.SYMPTOMS_BY_BODY_PART`
- `openpyxl` — Used in `generate-data-files.py` (line 435) and `docs/merge_body_parts.py` (line 1) to read/write Excel files
- `json`, `glob`, `os`, `re` — Python standard library modules for data processing
- No external packages, CDNs, or third-party JavaScript libraries
- No CSS frameworks (Bootstrap, Tailwind, etc.)
- No web fonts loaded — uses system font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
## Configuration
- `.env` file exists (empty, 0 bytes) — no environment variables are used by the application
- `.gitignore` excludes `.env`, `.gitignore`, and `.claude/settings.local.json`
- No environment variables are referenced anywhere in the codebase (no `process.env`, no API keys)
- No build configuration files exist
- No `tsconfig.json`, `webpack.config.*`, `vite.config.*`, `eslint.*`, or `.prettierrc`
## Platform Requirements
- A web browser (any modern browser)
- A local file server for testing (optional): `python3 -m http.server 8000`
- Python 3 + `openpyxl` only if regenerating data files from the ICD-10-CM Excel source
- Static file hosting only — serve `interactive-body-model.html` and the three `.js` data files from any web server or CDN
- No server-side processing required
- No database required
- Total payload: ~11.5 MB across 4 files (HTML + 3 JS data files)
## File Size Breakdown
| File                           | Size                | Purpose                                                       |
| ------------------------------ | ------------------- | ------------------------------------------------------------- |
| `interactive-body-model.html`  | 3.7 MB, 7,011 lines | Entire app (CSS + SVG + JS), large due to base64-encoded PNGs |
| `diseases-data.js`             | 7.3 MB              | ICD-10-CM disease data by body part                           |
| `symptoms-data.js`             | 429 KB              | Flat symptom list for autocomplete                            |
| `symptoms-by-bodypart-data.js` | 99 KB               | Symptoms grouped by body part                                 |
| `symptoms-data.json`           | 429 KB              | JSON duplicate of symptoms-data.js (not loaded at runtime)    |
## Source Assets
- `blankaasd.psd` (2.4 MB) — Original 698x1698px, 20-layer organ artwork
- `2bodymodelgreen.psd` (4.5 MB) — Green-tinted body model variant
- `femaleBodygreen.psd` (4.3 MB) — Female body, green variant
- `femaleBodywhite.psd` (4.3 MB) — Female body, white variant
- `bodybackviewwoman.psd` (5.4 MB) — Back view female body
- `tranparentbackview.psd` (8.2 MB) — Transparent back view
- `bodyimage/` (13 files) — Body system overview images (cardiovascular, digestive, etc.) used in tooltip panel
- `bpart_images/` (86 files) — Individual body part images, used as source for base64 encoding
## Data Pipeline
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## File Naming
| Pattern                     | Examples                                                               | Notes                                     |
| --------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| Kebab-case HTML             | `interactive-body-model.html`                                          | Main application file                     |
| Kebab-case JS data files    | `diseases-data.js`, `symptoms-data.js`, `symptoms-by-bodypart-data.js` | External data loaded via `<script>` tags  |
| Snake_case test screenshots | `test_head_selected.png`, `test_all_57_parts.png`                      | Manual QA artifacts                       |
| Kebab-case test screenshots | `test-ellipses-head-v1.png`, `test-body-parts-fullview.png`            | Newer test screenshots (mixed convention) |
| PSD source files            | `blankaasd.psd`, `femaleBodygreen.psd`                                 | No consistent naming for source assets    |
## CSS Conventions
### Class Naming
- **Kebab-case** throughout: `.body-part-group`, `.systems-panel`, `.left-column`, `.symptom-modal-list`
- **BEM-like** in some areas but not strictly enforced: `.systems-list li a` (descendant selectors preferred over BEM modifiers)
- **Functional prefixes**: `.page-layout`, `.body-model-container`, `.tooltip-panel`
### CSS Organization (within `<style>` tag)
### Color System
- Background: `#f5f5f5` (page), `#fff` (panels)
- Headers: `#434448` background with `#fff` text
- Accent: `#6cb5f4` (blue border/highlight)
- Hover: `rgba(100, 180, 255, 0.35)` (blue overlay)
- Borders: `#e0e0e0` (panels), `#f0f0f0` (list dividers)
- Each body system has a dedicated color (e.g., cardiovascular: `#e87722`)
## HTML Conventions
### SVG Structure
- Body parts wrapped in `<g class="body-part-group" data-part="..." data-name="...">`
- Each group contains: `<image class="part-image">` (base64 PNG) + `<path class="hit-area">` (click target)
- Group IDs follow `group-{part_id}` pattern (e.g., `group-brain`, `group-heart`)
- Data attributes: `data-part` (snake_case ID), `data-name` (human-readable display name)
### ID Naming
- Panel IDs: camelCase (`systemsList`, `tooltipContent`, `tooltipProcesses`, `symptomModalList`)
- System list items: `system-{id}` (e.g., `system-cardiovascular`)
- SVG groups: `group-{part_id}` (e.g., `group-brain`)
## JavaScript Conventions
### Module Pattern
- Entire app wrapped in a single IIFE: `(function() { ... })()`
- No ES modules, no imports/exports
- Global functions exposed via `window.setView`, `window.setGender`, `window.rotateModel`
### Variable Naming
| Pattern            | Scope                      | Examples                                                                        |
| ------------------ | -------------------------- | ------------------------------------------------------------------------------- |
| `UPPER_SNAKE_CASE` | Constants/data             | `BODY_SYSTEMS`, `ORGAN_TO_SYSTEM`, `BODY_PARTS_DATA`, `SYSTEM_TO_BODY_PARTS`    |
| `camelCase`        | Local variables, functions | `activeSystem`, `selectedBodyParts`, `selectSystem()`, `renderSystemsSidebar()` |
| `var`              | Older code sections        | DOM element references in `selectSystem`/`deselectSystem`                       |
| `const`/`let`      | Newer code sections        | System-related logic, newer functions                                           |
### Function Style
- Named `function` declarations for top-level functions: `function selectSystem(systemId) { ... }`
- Anonymous `function` expressions for callbacks: `.forEach(function(item) { ... })`
- No arrow functions used anywhere in the codebase
- No async/await or Promises
### Data Structure Patterns
- Arrays of objects for ordered data: `BODY_SYSTEMS`, `BODY_PARTS_DATA`
- Plain objects for lookup maps: `ORGAN_TO_SYSTEM`, `SYSTEM_TO_BODY_PARTS`, `BP_TO_ORGAN2_KEY`
- `Set` for tracking selections: `selectedBodyParts`, `systemSelectedBodyParts`
- Linear `.find()` scans on arrays rather than Map/object lookups
### DOM Manipulation
- Direct DOM API: `document.getElementById()`, `document.createElement()`, `document.querySelectorAll()`
- No jQuery, no templating library
- Event listeners added via `addEventListener()` (not inline `onclick` attributes in HTML)
- SVG namespace creation: `document.createElementNS("http://www.w3.org/2000/svg", ...)`
### State Management
- Module-scoped mutable variables: `activeSystem`, `selectedBodyParts`, `currentView`, `currentGender`
- No state container, no pub/sub, no reactive system
- State changes trigger imperative DOM updates (manual add/remove classes, create/destroy elements)
## Comment Style
- Section-delimiting comments: `/* Four-column layout wrapper */`, `/* Body Systems sidebar */`
- Inline comments are sparse — code is mostly self-documenting by naming
- No JSDoc, no @param annotations, no type hints
- TODO/FIXME markers are rare to nonexistent
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Zero build system -- the entire app runs by opening `interactive-body-model.html` in a browser
- All presentation logic (CSS), markup (HTML/SVG), and behavior (JS) coexist in one ~7000-line file
- External data is loaded via `<script src="...">` tags that assign global `window.*` variables
- All JavaScript is wrapped in a single IIFE `(function () { ... })()` to avoid polluting global scope, with explicit `window.*` assignments for functions called from inline `onclick` handlers
- DOM manipulation is imperative -- no framework, no virtual DOM, no templating engine
## Layers
- Purpose: All visual styling, layout, animations, and responsive breakpoints
- Location: `interactive-body-model.html` lines 7-1277 (inline `<style>` block)
- Contains: Grid layout, component styles, hover/selected states, keyframe animations, responsive media queries
- Depends on: Nothing external
- Used by: HTML markup and dynamically created DOM elements
- Purpose: Page structure, interactive body model with two SVGs (front view + back view)
- Location: `interactive-body-model.html` lines 1279-2573
- Contains: Four-column grid layout, left sidebar panels, center body model with layered SVG, right detail panel, column 4 disease/symptom sections, symptom selection modal
- Depends on: CSS styles
- Used by: JavaScript event handlers and DOM queries
- Purpose: All medical/anatomical data -- body systems, organ mappings, body parts, symptoms, diseases
- Location: Inline constants at `interactive-body-model.html` lines 2579-4745, plus three external files:
- Contains: `BODY_SYSTEMS` array (11 systems with base64 thumbnails), `ORGAN_TO_SYSTEM` reverse lookup, `SYSTEM_TO_BODY_PARTS` mapping, `BODY_PARTS_DATA` (57 body parts), `SECTION_SYMPTOMS`, `ORGAN2_SYMPTOMS`, various coordinate/region lookup tables
- Depends on: Nothing
- Used by: Behavior layer functions
- Purpose: All interactivity -- event handling, state management, DOM rendering, view switching
- Location: `interactive-body-model.html` lines 2577-7009 (inline `<script>` block)
- Contains: State variables, rendering functions, event listeners, view/gender/rotation logic
- Depends on: Data layer, Markup layer (DOM queries by ID and class selectors)
- Used by: Inline `onclick` handlers in HTML, and self-registered event listeners
## Data Flow
- `selectedOrgans` (Set): Currently selected organ IDs in organs view
- `selectedSections` (Set): Currently selected section IDs in sections view
- `selectedSymptoms` (Map): Key is `"sectionId::symptomName"`, value is `{ section, symptom, sectionName }`
- `selectedBodyParts` (Set): Currently selected body part IDs (from nav panel or system selection)
- `systemSelectedBodyParts` (Set): Body parts auto-added by system selection (tracked separately for cleanup)
- `activeSystem` (string|null): Currently active body system ID
- `currentView` (string): `'organs'`, `'organs2'`, or `'sections'`
- `currentGender` (string): `'male'` or `'female'`
- `isFlipped` (boolean): Whether the model is showing the back view
- `organ2HighlightedGroup` (Element|null): Tracks temporarily highlighted organ in organs2 mode
- `currentModalContext` (object|null): `{ type: 'section'|'organ2', key, name }` for open symptom modal
## Key Abstractions
- Purpose: Represents a single interactive organ in the SVG (organs view)
- Examples: `<g id="group-brain" class="body-part-group" data-part="brain" data-name="Brain">`
- Pattern: Each group contains a `<image class="part-image">` with base64 PNG and a `<path class="hit-area">` defining the clickable polygon
- 20 organ groups total (lines 1374-2031)
- Purpose: Represents a clickable body region in the SVG (sections view)
- Examples: `<g class="body-section-group" data-part="head_neck" data-name="Head / Neck">`
- Pattern: Each group contains a `<path class="section-hit-area">` with a large polygon covering a body zone
- 7 front sections, 7 back sections (some paired for arms/legs)
- Purpose: Represents a selectable body part in the nav panel (57 total)
- Examples: `{ id: "bp_head", name: "Head", image: "bpart_images/head.png", organIds: [], description: "..." }`
- Pattern: Each entry has an `id`, display `name`, thumbnail `image` path, array of linked `organIds`, and a medical `description`
- Location: `interactive-body-model.html` lines 5694-6383
- Purpose: Represents one of 11 body systems with metadata
- Examples: `{ id: "cardiovascular", title: "Cardiovascular", color: "#e87722", thumbnail: "data:image/png;base64,...", description: "...", organs: ["heart"], keyParts: "Heart, Blood Vessels, Blood", processes: [...] }`
- Location: `interactive-body-model.html` lines 2579-3225
- Purpose: Maps body part IDs to SVG ellipse coordinates for overlay highlights in sections view
- Pattern: `{ bp_head: { cx: 348, cy: 110, rx: 50, ry: 55 }, bp_ears: [{ cx: 305, cy: 115, rx: 12, ry: 18 }, { cx: 392, cy: 115, rx: 12, ry: 18 }] }`
- Location: `interactive-body-model.html` lines 4556-4744
## Entry Points
- Location: `interactive-body-model.html` (open in browser)
- Triggers: Browser loads HTML, parses CSS, renders SVG, executes inline script IIFE
- Responsibilities: Builds sidebar, registers event listeners, calls `setView("sections")` as default, triggers entrance animations
- Location: `interactive-body-model.html` lines 1316-1326 (HTML), line 4856 (`window.setView`)
- Triggers: `onclick="setView('organs')"`, `onclick="setView('organs2')"`, `onclick="setView('sections')"`
- Responsibilities: Crossfade SVG layers, update button active state, manage highlight overlays
- Location: `interactive-body-model.html` lines 2404-2410 (HTML), line 5004 (`window.setGender`)
- Triggers: `onclick="setGender('male')"` / `onclick="setGender('female')"`
- Responsibilities: Show/hide reproductive organ layers, swap body parts if reproductive system active
- Location: `interactive-body-model.html` lines 2413-2421 (HTML), line 5101 (`window.rotateModel`)
- Triggers: `onclick="rotateModel()"`
- Responsibilities: CSS 3D flip via `.flipped` class, swap front/back section layers
## Error Handling
- Null/undefined guards: `if (!bp) return;`, `if (!sys) return;`
- Graceful image fallback: `onerror="this.style.display='none'"` on body part thumbnails
- Optional data: `window.SYMPTOMS_DATA || null` for external data that may not load
- No try/catch blocks, no error boundaries, no user-facing error messages
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
