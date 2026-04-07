# Codebase Structure

**Analysis Date:** 2026-03-29

## Directory Layout

```
bodyPSDLayersbodyparts/
├── interactive-body-model.html      # THE application (CSS + HTML/SVG + JS, ~7011 lines, ~3.9MB)
├── symptoms-data.js                 # External data: 18K symptom strings (~440KB)
├── diseases-data.js                 # External data: diseases by body part (~7.6MB)
├── symptoms-by-bodypart-data.js     # External data: symptoms by body part (~100KB)
├── symptoms-data.json               # Raw JSON of symptoms data (~440KB)
├── generate-data-files.py           # Python script to generate the three .js data files
├── CLAUDE.md                        # AI assistant instructions
├── PROJECT_PLAN.md                  # Phased implementation plan
├── .env                             # Environment config (exists, not read)
├── .gitignore                       # Git ignore rules
├── blankaasd.psd                    # Source PSD: organ layers (698x1698px, 20 layers)
├── 2bodymodelgreen.psd              # Green body model PSD
├── bodybackviewwoman.psd            # Back-view female PSD
├── femaleBodygreen.psd              # Female body green PSD
├── femaleBodywhite.psd              # Female body white PSD
├── tranparentbackview.psd           # Transparent back-view PSD
├── interactive-body-model copy.html # Backup/older copy of the main file
├── bodyimage/                       # Body system thumbnail PNGs (12 files)
├── bpart_images/                    # Body part thumbnail PNGs (~86 files + placeholder SVGs)
│   └── testsMOBILEanimation/        # Mobile animation test images (7 files)
├── docs/                            # Documentation and data pipeline
│   ├── plans/                       # Design and implementation plan docs
│   ├── body_parts_batches/          # ICD code batch JSON files (075 batches)
│   ├── body_parts_results/          # Mapped body part results JSON (056 results)
│   │   └── map_body_parts.py        # Mapping script for body parts
│   ├── merge_body_parts.py          # Script to merge body part data
│   └── icd10cm_codes_2026.xlsx      # ICD-10-CM medical codes source spreadsheet
├── video-screenshots/               # Screenshots from demo video (7 frames)
├── .planning/                       # GSD planning directory
│   └── codebase/                    # Codebase analysis documents
├── .claude/                         # Claude Code configuration
│   ├── settings.local.json          # Local settings
│   └── worktrees/                   # Claude worktree copies
├── .playwright-mcp/                 # Playwright MCP logs
├── *.png                            # ~30 test/calibration screenshots in root
└── .git/                            # Git repository
```

## Directory Purposes

**Root (`/`):**

- Purpose: Contains the application itself and all supporting files
- Contains: Main HTML file, external data JS files, PSD sources, test screenshots, Python data generation scripts
- Key files: `interactive-body-model.html`, `symptoms-data.js`, `diseases-data.js`, `symptoms-by-bodypart-data.js`, `generate-data-files.py`

**`bodyimage/`:**

- Purpose: Thumbnail images for the 11 body systems (+ male/female reproductive)
- Contains: 12 PNG files, one per body system
- Key files: `cardiovascular_system.png`, `digestive_system.png`, `nervous_system.png`, etc.
- Referenced by: `SYSTEM_IMAGE_MAP` constant inside `showTooltip()` function (line ~3354 in HTML)

**`bpart_images/`:**

- Purpose: Thumbnail images for the 57 body parts shown in the nav panel and body part cards
- Contains: ~86 PNG files + 8 placeholder SVGs for imaging modalities
- Key files: `brain.png`, `heart.png`, `lungs.png`, `kidneys.png`, `liver.png`, etc.
- Referenced by: `BODY_PARTS_DATA[].image` property (e.g., `"bpart_images/head.png"`)

**`docs/`:**

- Purpose: Documentation, design plans, and the data pipeline for ICD-10-CM medical data
- Contains: Design markdown files, batch JSON input files, mapped result JSON files, Python processing scripts

**`docs/plans/`:**

- Purpose: Design and implementation planning documents
- Contains: 3 markdown files
- Key files:
  - `2026-03-08-back-view-interactive-sections-design.md`: Back-view design spec
  - `2026-03-21-three-column-merge-design.md`: Three-column layout design
  - `2026-03-21-three-column-merge-plan.md`: Three-column merge implementation plan

**`docs/body_parts_batches/`:**

- Purpose: Input data for the disease/symptom data pipeline -- ICD-10-CM codes split into 75 JSON batches
- Contains: `batch_001.json` through `batch_075.json`
- Used by: `generate-data-files.py` to produce `diseases-data.js`

**`docs/body_parts_results/`:**

- Purpose: Output of the body-part mapping pipeline -- maps ICD codes to body part IDs
- Contains: `results_001.json` through `results_056.json`, plus `map_body_parts.py`
- Used by: `generate-data-files.py` to produce `diseases-data.js`

**`video-screenshots/`:**

- Purpose: Frame captures from a demo video
- Contains: 7 PNGs named `frame-03s.png` through `frame-23s.png`
- Generated: Yes (from video capture)
- Committed: Yes

**`.planning/codebase/`:**

- Purpose: GSD codebase analysis documents consumed by planning and execution commands
- Contains: ARCHITECTURE.md, STRUCTURE.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

## Key File Locations

**Entry Points:**

- `interactive-body-model.html`: The entire application. Open in browser to run.

**Configuration:**

- `.env`: Environment configuration (existence noted only)
- `.gitignore`: Git ignore rules
- `CLAUDE.md`: AI assistant instructions and project context

**Core Logic (all within `interactive-body-model.html`):**

- Lines 7-1277: All CSS (styles, layout, animations, responsive)
- Lines 1279-2573: HTML body (page layout, SVG body model, panels, modal)
- Lines 1330-2216: Front-view SVG (organs-layer, sections-layer, bp-highlight-layer)
- Lines 2218-2400: Back-view SVG (back-sections-layer)
- Lines 2536-2572: Symptom selection modal markup
- Lines 2577-7009: Inline JavaScript (IIFE)
- Lines 2579-3225: `BODY_SYSTEMS` array (11 systems with base64 thumbnails, descriptions, processes)
- Lines 3226-3294: `ORGAN_TO_SYSTEM`, `SYSTEM_TO_BODY_PARTS`, `REPRODUCTIVE_BODY_PARTS`
- Lines 3297-3744: Sidebar/tooltip rendering and system selection functions
- Lines 3767-4523: `SECTION_SORT_ORDER`, `SECTION_SYMPTOMS`, `ORGAN2_SYMPTOMS`, lookup tables
- Lines 4523-4744: `BODY_PART_SVG_COORDS`, `BODY_PART_HIGHLIGHT_REGIONS`
- Lines 4745-4756: State variables (`selectedOrgans`, `selectedSections`, `selectedSymptoms`, `currentView`, etc.)
- Lines 4856-5140: `setView()`, `setGender()`, `rotateModel()`
- Lines 5148-5642: Click/touch event handlers for organs and sections
- Lines 5694-6383: `BODY_PARTS_DATA` array (57 body parts with images, organIds, descriptions)
- Lines 6385-6459: Body parts nav state and rendering
- Lines 6475-6622: `toggleBodyPart()` function
- Lines 6625-7001: Body part cards, disease/symptom spanning sections, search handlers
- Lines 7001-7008: Initialization (`setView("sections")`, entrance animations)

**External Data:**

- `symptoms-data.js`: Global `window.SYMPTOMS_DATA` -- flat array of ~18K symptom name strings
- `diseases-data.js`: Global `window.DISEASES_BY_BODY_PART` -- object mapping body part IDs to arrays of `{ name, code }` disease objects
- `symptoms-by-bodypart-data.js`: Global `window.SYMPTOMS_BY_BODY_PART` -- object mapping body part IDs to arrays of symptom strings

**Data Generation:**

- `generate-data-files.py`: Reads `docs/body_parts_batches/*.json`, `docs/body_parts_results/*.json`, and `docs/icd10cm_codes_2026.xlsx` to produce the three external `.js` data files
- `docs/body_parts_results/map_body_parts.py`: Maps anatomical names to UI body part IDs
- `docs/merge_body_parts.py`: Merges body part data from multiple sources

**Source Assets:**

- `blankaasd.psd`: Primary source Photoshop file (698x1698px, 20 organ layers)
- `bodybackviewwoman.psd`: Back-view PSD for female body
- `tranparentbackview.psd`: Transparent back-view PSD

**Testing/Screenshots:**

- `test_*.png`, `test-*.png`: ~30 visual regression test screenshots in root directory
- `*.grid.png`, `calibration-*.png`, `final-*.png`: Calibration and positioning screenshots

## Naming Conventions

**Files:**

- Main app: `interactive-body-model.html` (kebab-case)
- Data files: `{data-type}-data.js` (kebab-case with `-data` suffix)
- Body part images: `{bodypart}.png` (lowercase, no separators) in `bpart_images/`
- Body system images: `{system_name}.png` (snake_case) in `bodyimage/`
- Test screenshots: `test_*.png` or `test-*.png` (mixed snake/kebab)
- Plan documents: `YYYY-MM-DD-{slug}.md` (date-prefixed kebab-case)

**HTML IDs:**

- SVG groups: `group-{organ_id}` (e.g., `group-brain`, `group-lungs_left`)
- Panels: camelCase (e.g., `systemsPanel`, `bodyPartsNavPanel`, `tooltipPanel`, `spanningSections`)
- Buttons: `btn-{name}` (e.g., `btn-organs`, `btn-male`)

**CSS Classes:**

- Components: kebab-case (e.g., `body-part-group`, `systems-panel`, `section-hit-area`)
- State modifiers: single word (e.g., `.selected`, `.active`, `.collapsed`, `.visible`)
- Layout: kebab-case (e.g., `page-layout`, `left-column`, `right-column`)

**JavaScript:**

- Constants: UPPER_SNAKE_CASE (e.g., `BODY_SYSTEMS`, `ORGAN_TO_SYSTEM`, `BODY_PARTS_DATA`)
- State variables: camelCase (e.g., `selectedOrgans`, `currentView`, `activeSystem`)
- Functions: camelCase (e.g., `selectSystem`, `renderBodyPartsNavPanel`, `toggleBodyPart`)
- Data part IDs: snake_case (e.g., `head_neck`, `upper_body`, `male_reproductive`)
- Body part IDs: `bp_` prefix + snake_case (e.g., `bp_head`, `bp_brain`, `bp_heart`)

## Where to Add New Code

**New Interactive Feature:**

- Add CSS styles inside the `<style>` block at `interactive-body-model.html` (before line 1277)
- Add HTML markup inside the `<body>` at appropriate column location (lines 1279-2573)
- Add JavaScript inside the IIFE `(function() { ... })()` at `interactive-body-model.html` (before line 7008)
- If the function must be callable from inline `onclick`, assign it to `window.functionName`

**New Body System:**

- Add entry to `BODY_SYSTEMS` array (line 2579+) with `id`, `title`, `color`, `thumbnail` (base64), `description`, `organs`, `keyParts`, `processes`
- Add corresponding organ IDs to the system's `organs` array
- Add entry to `SYSTEM_TO_BODY_PARTS` mapping (line 3236)
- Add system thumbnail PNG to `bodyimage/` directory

**New Body Part:**

- Add entry to `BODY_PARTS_DATA` array (line 5694+) with `id`, `name`, `image`, `organIds`, `description`
- Add thumbnail PNG to `bpart_images/`
- Add highlight region to `BODY_PART_HIGHLIGHT_REGIONS` (line 4556+) for sections-view ellipse overlay
- If the body part maps to an organ in the SVG, include the organ ID in `organIds`

**New SVG Organ (for organs view):**

- Add a `<g class="body-part-group" id="group-{id}" data-part="{id}" data-name="{Display Name}">` inside `#organs-layer` (after line 1374)
- Include `<image class="part-image">` with base64 PNG and `<path class="hit-area">` with polygon coordinates
- The click handler is automatically registered by the `querySelectorAll(".body-part-group .hit-area")` loop at line 5149

**New SVG Body Section (for sections view):**

- Add a `<g class="body-section-group" data-part="{id}" data-name="{Display Name}">` inside `#sections-layer` (after line 2033)
- Include `<path class="section-hit-area">` with polygon coordinates
- The click handler is automatically registered by the `querySelectorAll(".body-section-group .section-hit-area")` loop at line 5203

**New External Data:**

- Create a `.js` file assigning to `window.VARIABLE_NAME`
- Add `<script src="new-data.js"></script>` before the inline `<script>` tag (around line 2576)
- Reference via `window.VARIABLE_NAME || fallback` inside the IIFE

**New Disease/Symptom Data:**

- Update source data in `docs/body_parts_batches/` and `docs/body_parts_results/`
- Run `python3 generate-data-files.py` to regenerate `diseases-data.js` and `symptoms-by-bodypart-data.js`

## Special Directories

**`docs/body_parts_batches/`:**

- Purpose: ICD-10-CM code batch input files for the data pipeline
- Generated: Partially (split from source spreadsheet)
- Committed: Yes

**`docs/body_parts_results/`:**

- Purpose: Mapped disease-to-body-part results from the pipeline
- Generated: Yes (by `map_body_parts.py`)
- Committed: Yes

**`.planning/codebase/`:**

- Purpose: GSD codebase analysis documents for AI-assisted planning/execution
- Generated: Yes (by GSD map-codebase command)
- Committed: Yes

**`.claude/worktrees/`:**

- Purpose: Claude Code worktree copies for parallel editing
- Generated: Yes (by Claude Code)
- Committed: No (should be in .gitignore)

**Root-level `*.png` files (~30 files):**

- Purpose: Test screenshots and calibration images used during development
- Generated: Yes (by Playwright MCP and manual testing)
- Committed: Yes (but could be moved to a `test-screenshots/` directory)

## File Size Summary

| File                           | Size  | Lines | Purpose                   |
| ------------------------------ | ----- | ----- | ------------------------- |
| `interactive-body-model.html`  | 3.9MB | 7,011 | Entire application        |
| `diseases-data.js`             | 7.6MB | large | Disease data by body part |
| `symptoms-data.js`             | 440KB | 1     | Symptom strings array     |
| `symptoms-by-bodypart-data.js` | 100KB | small | Symptoms by body part     |
| `generate-data-files.py`       | 15KB  | ~300  | Data generation script    |

---

_Structure analysis: 2026-03-29_
