# Technology Stack

**Analysis Date:** 2026-03-29

## Languages

**Primary:**

- HTML5 — The entire application UI, SVG body model, and structure (`interactive-body-model.html`)
- CSS3 — All styling is inline within `<style>` in `interactive-body-model.html` (lines 7-1190)
- JavaScript (ES6) — All application logic is inline within `<script>` in `interactive-body-model.html` (lines 2577-7008), plus three external JS data files

**Secondary:**

- Python 3 — Offline data generation scripts (`generate-data-files.py`, `docs/merge_body_parts.py`, `docs/body_parts_results/map_body_parts.py`)
- JSON — Intermediate data format for batch/result files (`docs/body_parts_batches/batch_*.json`, `docs/body_parts_results/results_*.json`, `symptoms-data.json`)

## Runtime

**Environment:**

- Any modern web browser (Chrome, Firefox, Safari, Edge) — no server-side runtime required
- Python 3.x — only needed for running data generation scripts offline

**Package Manager:**

- None — no `package.json`, `requirements.txt`, `pyproject.toml`, or any dependency manifest exists
- No lockfiles present

## Frameworks

**Core:**

- None — the application is 100% vanilla HTML/CSS/JavaScript with zero framework dependencies
- No React, Vue, Angular, Svelte, or any other UI framework

**Testing:**

- None — no test framework (Jest, Vitest, Playwright, etc.) is configured
- A `.playwright-mcp/` directory exists with a single console log file, but no Playwright config or test files

**Build/Dev:**

- None — no build system (Webpack, Vite, esbuild, Rollup, etc.)
- No transpilation, bundling, or minification pipeline
- Open `interactive-body-model.html` directly in a browser to run

## Key Dependencies

**Critical (loaded at runtime via `<script src>`):**

- `symptoms-data.js` (429 KB) — Flat array of ~10,000+ symptom strings, assigned to `window.SYMPTOMS_DATA`
- `diseases-data.js` (7.3 MB) — Disease entries grouped by body part ID (ICD-10-CM codes), assigned to `window.DISEASES_BY_BODY_PART`
- `symptoms-by-bodypart-data.js` (99 KB) — Symptoms grouped by body part ID, assigned to `window.SYMPTOMS_BY_BODY_PART`

**Offline tooling (Python standard library + openpyxl):**

- `openpyxl` — Used in `generate-data-files.py` (line 435) and `docs/merge_body_parts.py` (line 1) to read/write Excel files
- `json`, `glob`, `os`, `re` — Python standard library modules for data processing

**Infrastructure:**

- No external packages, CDNs, or third-party JavaScript libraries
- No CSS frameworks (Bootstrap, Tailwind, etc.)
- No web fonts loaded — uses system font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

## Configuration

**Environment:**

- `.env` file exists (empty, 0 bytes) — no environment variables are used by the application
- `.gitignore` excludes `.env`, `.gitignore`, and `.claude/settings.local.json`
- No environment variables are referenced anywhere in the codebase (no `process.env`, no API keys)

**Build:**

- No build configuration files exist
- No `tsconfig.json`, `webpack.config.*`, `vite.config.*`, `eslint.*`, or `.prettierrc`

## Platform Requirements

**Development:**

- A web browser (any modern browser)
- A local file server for testing (optional): `python3 -m http.server 8000`
- Python 3 + `openpyxl` only if regenerating data files from the ICD-10-CM Excel source

**Production:**

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

**PSD Files (Photoshop source artwork):**

- `blankaasd.psd` (2.4 MB) — Original 698x1698px, 20-layer organ artwork
- `2bodymodelgreen.psd` (4.5 MB) — Green-tinted body model variant
- `femaleBodygreen.psd` (4.3 MB) — Female body, green variant
- `femaleBodywhite.psd` (4.3 MB) — Female body, white variant
- `bodybackviewwoman.psd` (5.4 MB) — Back view female body
- `tranparentbackview.psd` (8.2 MB) — Transparent back view

**Extracted PNG Assets:**

- `bodyimage/` (13 files) — Body system overview images (cardiovascular, digestive, etc.) used in tooltip panel
- `bpart_images/` (86 files) — Individual body part images, used as source for base64 encoding

## Data Pipeline

The data generation pipeline is offline-only and does not run during the application lifecycle:

1. **Source:** `docs/icd10cm_codes_2026.xlsx` (12 MB Excel file with ICD-10-CM codes)
2. **Batch processing:** `docs/body_parts_batches/batch_*.json` (75 batch files) contain ICD codes split for processing
3. **Body part mapping:** `docs/body_parts_results/map_body_parts.py` maps diseases to anatomical terms via keyword matching
4. **Result files:** `docs/body_parts_results/results_*.json` (56 result files) contain mapped body parts
5. **Merge:** `docs/merge_body_parts.py` writes results back to the Excel file
6. **Generate JS:** `generate-data-files.py` joins batch + result files, normalizes ~260 anatomical terms to 57 UI body part IDs, and outputs `diseases-data.js` and `symptoms-by-bodypart-data.js`

---

_Stack analysis: 2026-03-29_
