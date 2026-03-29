# External Integrations

**Analysis Date:** 2026-03-29

## APIs & External Services

**None.** This application makes zero network requests at runtime. There are:

- No `fetch()` calls
- No `XMLHttpRequest` usage
- No WebSocket connections
- No third-party SDK imports
- No CDN references (no googleapis, unpkg, jsdelivr, or cloudflare URLs)
- No analytics or tracking scripts

The application is fully self-contained and works entirely offline once the HTML and JS data files are loaded.

## Data Storage

**Databases:**

- None — no database of any kind (SQL, NoSQL, or embedded)

**File Storage:**

- Local filesystem only
- All data is embedded inline (base64 PNGs in the HTML) or loaded via same-origin `<script src>` tags
- Three external JS data files must be co-located with the HTML file:
  - `symptoms-data.js`
  - `diseases-data.js`
  - `symptoms-by-bodypart-data.js`
- Body system images loaded from `bodyimage/*.png` (referenced in `interactive-body-model.html` lines 3354-3368)

**Caching:**

- None — no `localStorage`, `sessionStorage`, `IndexedDB`, or service worker usage
- All state is held in JavaScript variables in memory and lost on page reload

## Authentication & Identity

**Auth Provider:**

- None — no authentication, no user accounts, no sessions
- The application is a standalone client-side tool with no user identity concept

## Monitoring & Observability

**Error Tracking:**

- None — no Sentry, Bugsnag, or similar error tracking service

**Logs:**

- Browser console only (no structured logging framework)
- A single `.playwright-mcp/console-2026-03-23T03-46-02-313Z.log` file exists from a past Playwright MCP session

## CI/CD & Deployment

**Hosting:**

- Not configured — no deployment target is defined
- The app can be hosted on any static file server (Netlify, Vercel, S3, GitHub Pages, etc.)

**CI Pipeline:**

- None — no `.github/workflows/`, no `Dockerfile`, no `Makefile`, no `vercel.json`, no `netlify.toml`
- No automated testing, linting, or deployment pipeline

## Environment Configuration

**Required env vars:**

- None — the application has no environment variable dependencies

**Secrets location:**

- `.env` file exists but is empty (0 bytes) and is listed in `.gitignore`
- No API keys, tokens, or secrets are used anywhere in the codebase

## Webhooks & Callbacks

**Incoming:**

- None

**Outgoing:**

- None

## Offline Data Pipeline (Not Runtime)

The only external data dependency is an offline pipeline for generating the JS data files. This is NOT part of the runtime application but is documented here for completeness.

**ICD-10-CM Medical Data Source:**

- Source file: `docs/icd10cm_codes_2026.xlsx` (12 MB, ICD-10-CM codes for 2026)
- This is a static Excel spreadsheet, not an API connection
- The file contains disease codes, names, and a "BodyPart_Symp" sheet mapping body parts to symptoms

**Python Data Processing Scripts:**

- `generate-data-files.py` — Main generation script; reads batch/result JSON files and the Excel file, outputs three JS data files
- `docs/merge_body_parts.py` — Merges body part mapping results back into the Excel source file
- `docs/body_parts_results/map_body_parts.py` — Maps ICD-10-CM disease names to anatomical body parts via keyword matching (hardcoded logic, no external API)

**Python Dependencies (offline only):**

- `openpyxl` — Required for reading/writing Excel files in the data pipeline
- All other imports are Python standard library (`json`, `glob`, `os`, `re`)

**Data Flow:**

```
icd10cm_codes_2026.xlsx
        |
        v
map_body_parts.py (keyword-based mapping, no API)
        |
        v
batch_*.json + results_*.json (docs/body_parts_batches/, docs/body_parts_results/)
        |
        v
generate-data-files.py
        |
        v
diseases-data.js, symptoms-by-bodypart-data.js (loaded by browser at runtime)
```

## Third-Party Libraries

**Runtime:**

- None — zero third-party JavaScript libraries

**Offline tooling:**

- `openpyxl` (Python) — Excel file reader/writer

## Browser APIs Used

The application relies on the following standard browser APIs (not external integrations, but documented for awareness):

- **DOM API** — `document.getElementById()`, `document.querySelector()`, `document.querySelectorAll()`, `createElement()`, etc.
- **SVG DOM** — Inline SVG manipulation via standard DOM methods
- **CSS Transitions & Animations** — `@keyframes` for entrance animations (lines 1088-1170 of `interactive-body-model.html`)
- **CSS Grid** — Four-column layout (`grid-template-columns: 240px minmax(0, 380px) 340px minmax(300px, 1fr)`)
- **CSS 3D Transforms** — `rotateY(180deg)` for front/back model rotation
- **Event Handling** — `addEventListener("click")`, `mouseenter`, `mouseleave` (no touch events despite CLAUDE.md mention)
- **Timer APIs** — `setTimeout()` for debouncing search input, `requestAnimationFrame()` for smooth scroll/position updates

---

_Integration audit: 2026-03-29_
