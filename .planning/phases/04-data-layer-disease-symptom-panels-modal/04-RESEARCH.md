# Phase 4: Data Layer, Disease/Symptom Panels & Modal - Research

**Researched:** 2026-04-06
**Domain:** Lit v3 lazy-loading, per-body-part JSON data splitting, disease/symptom 4th-column panel, positioned modal with tabs and skeleton loader
**Confidence:** HIGH

## Summary

Phase 4 adds the data layer to the existing 3-column Lit v3 web component. The work has three concerns: (1) a Node.js build script that splits the 7.56 MB `diseases.json` into 83 per-body-part JSON files under `public/data/diseases/`; (2) a new 4th column in the `body-map-explorer` grid that shows collapsible disease/symptom cards for each selected organ, with a global search/filter and skeleton shimmer loading state; (3) a positioned modal with tabbed Symptoms/Diseases content and a triangular carat pointer, triggered by body-section clicks in the `body-map-model`.

The existing codebase is already well-prepared: `body-map-model` fires `organ-selection-change` events for organ clicks (the data panel trigger) and `organ2-click` for organs2 view. Section clicks in `_handleSectionClick` currently toggle internal state only — Phase 4 needs that handler upgraded to also dispatch a `section-click` event carrying the click coordinates and section ID so the modal can position itself. The symptoms-by-part.json file (101 KB) is small enough to load in full on first need and cache; no splitting required (D-06).

Key size data from the actual files: `bp_arms` is the largest chunk at 831 KB, median is 21 KB, many body parts are under 10 KB. The split produces files ranging from 0.2 KB to 831 KB — acceptable for lazy loading because users only ever fetch the file(s) for their currently selected body parts.

**Primary recommendation:** Follow the data service singleton pattern from `src/data/systems.ts`, extend `body-map-explorer` with a 4th grid column, add a `body-map-data-panel` component, a `body-map-modal` component, and a `DataService` singleton — all in Lit v3 with the existing design tokens.

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Fourth column added to the layout grid. Grid changes from `260px 1fr 300px` to `260px 1fr 300px 1fr` (or similar).
- **D-02:** Each selected body part gets its own collapsible card in the 4th column with disease and symptom sub-sections inside. Multiple body parts stack vertically.
- **D-03:** One global search/filter input at the top of the 4th column, filtering across all visible body parts' diseases and symptoms simultaneously. Debounced input per DATA-03.
- **D-04:** Disease names displayed without ICD-10 codes. Codes are available in the data but not shown in the UI.
- **D-05:** The 7.6MB `diseases.json` is split into 83 individual JSON files — one per body part key (e.g., `public/data/diseases/bp_brain.json`). Build-time Node.js script performs the split.
- **D-06:** `symptoms-by-part.json` (100KB) is NOT split — loaded as a whole file on first need, cached in memory.
- **D-07:** A Node.js script in `scripts/` (e.g., `scripts/split-diseases.js`) reads `public/data/diseases.json` and writes per-body-part files to `public/data/diseases/`. Added as an npm script.
- **D-08:** Fetched data cached in an in-memory `Map<string, DiseaseEntry[]>` in the data service. First selection fetches; subsequent selections return cached data. Cache cleared on page reload only.
- **D-09:** Body-section modal shows both symptoms and diseases, organized with tabs — "Symptoms" tab and "Diseases" tab.
- **D-10:** Modal positioned adjacent to the click point with a triangular carat pointer, matching the existing app's `symptom-modal` pattern. Smart repositioning to stay within viewport bounds.
- **D-11:** Symptoms in the modal are selectable via checkboxes. Selected symptoms tracked in state.
- **D-12:** Modal includes its own search/filter input at the top of the content area.
- **D-13:** Modal dismissed by clicking outside (backdrop click) or pressing Escape.
- **D-14:** Skeleton shimmer lines shown while data loads — in both 4th column and modal.
- **D-15:** When a body part has no diseases or symptoms, show a muted "No diseases found for [body part]" or "No symptoms found for [body part]" message inline.
- **D-16:** Network errors show inline "Failed to load data. [Retry]" message. User can click retry.

### Claude's Discretion

- Exact 4th column width and responsive breakpoint behavior
- Internal component decomposition (data-panel, disease-list, symptom-list, modal sub-components)
- Skeleton shimmer animation CSS implementation
- Tab component design inside the modal (simple underline tabs vs pill tabs)
- Debounce timing for search input (200-300ms range)
- How selected symptoms integrate with existing component state in the explorer
- Disease list item styling details (font size, padding, hover states)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID       | Description                                                             | Research Support                                                                                              |
| -------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| DATA-01  | Selected body part displays related diseases in a scrollable list       | diseases.json split script + DataService fetch + 4th column card component                                    |
| DATA-02  | Selected body part displays related symptoms in a scrollable list       | symptoms-by-part.json cached load + 4th column card component                                                 |
| DATA-03  | Disease/symptom lists support search/filter with debounced input        | Global filter input at top of 4th column, 200-300ms debounce, filter function on cached entries               |
| DATA-04  | Disease/symptom data is lazy-loaded per body part (not all upfront)     | DataService Map cache + fetch on first selection; symptoms loaded on first need                               |
| DATA-05  | Data files split into per-body-part JSON chunks                         | `scripts/split-diseases.js` Node.js script, `npm run split-diseases`, 83 output files                         |
| MODAL-01 | Clicking a body section opens a detail modal with symptoms and diseases | `_handleSectionClick` upgraded to dispatch `section-click` event with coordinates; `body-map-modal` component |
| MODAL-02 | Modal positions relative to the clicked region                          | Viewport-aware positioning using `getBoundingClientRect` + carat offset logic from reference HTML             |
| MODAL-03 | Modal displays skeleton loading state while data loads                  | Shimmer animation from reference HTML (lines 1072-1105), replicated as Lit CSS                                |
| MODAL-04 | Modal can be closed by clicking outside or pressing Escape              | Backdrop click handler + `keydown` listener on `document`                                                     |

</phase_requirements>

---

## Standard Stack

### Core

| Library    | Version  | Purpose                    | Why Standard                                                      |
| ---------- | -------- | -------------------------- | ----------------------------------------------------------------- |
| lit        | ^3.0.0   | Web component framework    | Already in use, Phase 1-3 all use Lit v3 [VERIFIED: package.json] |
| TypeScript | ^5.5.0   | Type safety                | Already in use, all src files are .ts [VERIFIED: package.json]    |
| Vite       | ^6.0.0   | Build tooling + dev server | Already in use [VERIFIED: package.json]                           |
| Vitest     | ^4.1.2   | Test runner                | Already in use, 51 passing tests [VERIFIED: vitest run output]    |
| happy-dom  | ^20.8.9  | DOM environment for tests  | Already in use [VERIFIED: package.json]                           |
| Node.js    | v20.19.0 | Data split script runtime  | Available on machine [VERIFIED: node --version]                   |

### Supporting

| Library | Version | Purpose                        | When to Use                                                  |
| ------- | ------- | ------------------------------ | ------------------------------------------------------------ |
| (none)  | —       | No new npm dependencies needed | All needed functionality is achievable with Lit + vanilla TS |

**No new npm packages are required for this phase.** [VERIFIED: codebase inspection confirms Lit handles reactive state, templates, and CSS-in-JS; fetch API is native; debounce is a 3-line vanilla function]

**Installation:**

```bash
# No new packages. All existing:
npm install  # already done
```

**Version verification:**

```bash
# Verified at research time:
# lit: ^3.0.0 installed
# vitest: ^4.1.2 installed
# Node.js: v20.19.0
```

---

## Architecture Patterns

### Recommended Project Structure

New files to create in this phase:

```
src/
├── body-map-explorer.ts        # MODIFY: add 4th column, data loading orchestration
├── body-map-model.ts           # MODIFY: section-click event dispatch
├── body-map-data-panel.ts      # NEW: 4th column component with collapsible cards
├── body-map-modal.ts           # NEW: positioned section modal with tabs
├── data/
│   ├── systems.ts              # EXISTING: reference pattern to follow
│   └── data-service.ts         # NEW: DataService singleton (fetch + cache)
├── __tests__/
│   ├── data-service.test.ts    # NEW: unit tests for DataService
│   ├── body-map-data-panel.test.ts  # NEW
│   └── body-map-modal.test.ts  # NEW
scripts/
└── split-diseases.js           # NEW: Node.js data splitting script

public/data/
├── diseases.json               # EXISTING: 7.56 MB source (kept as-is)
├── diseases/
│   ├── bp_brain.json           # NEW (generated by split script)
│   ├── bp_heart.json           # NEW (generated by split script)
│   └── ... (83 total)
├── symptoms-by-part.json       # EXISTING: 101 KB (loaded whole, not split)
└── symptoms.json               # EXISTING: 421 KB (for future autocomplete)
```

### Pattern 1: DataService Singleton

**What:** A TypeScript module exporting a singleton service with typed fetch methods and in-memory Map caches.
**When to use:** Central data fetching and caching for disease/symptom data, so multiple components don't race-fetch the same body part.

```typescript
// Source: modeled on src/data/systems.ts pattern [VERIFIED: codebase]
// src/data/data-service.ts

export interface DiseaseEntry {
  name: string; // ICD code is present in JSON but NOT exposed per D-04
}

export interface DataServiceState {
  loading: boolean;
  error: string | null;
  diseases: DiseaseEntry[];
  symptoms: string[];
}

const _diseaseCache = new Map<string, DiseaseEntry[]>();
const _symptomsAllCache: Map<string, string[]> = new Map();
let _symptomsData: Record<string, string[]> | null = null;
let _symptomsLoading: Promise<Record<string, string[]>> | null = null;

export async function fetchDiseases(
  bodyPartId: string,
  assetBase = "",
): Promise<DiseaseEntry[]> {
  if (_diseaseCache.has(bodyPartId)) {
    return _diseaseCache.get(bodyPartId)!;
  }
  const prefix = assetBase.replace(/\/$/, "");
  const url = `${prefix}/data/diseases/${bodyPartId}.json`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  const raw: Array<{ code: string; name: string }> = await resp.json();
  const entries: DiseaseEntry[] = raw.map(({ name }) => ({ name }));
  _diseaseCache.set(bodyPartId, entries);
  return entries;
}

export async function fetchSymptomsForPart(
  bodyPartId: string,
  assetBase = "",
): Promise<string[]> {
  if (_symptomsAllCache.has(bodyPartId)) {
    return _symptomsAllCache.get(bodyPartId)!;
  }
  if (!_symptomsLoading) {
    const prefix = assetBase.replace(/\/$/, "");
    const url = `${prefix}/data/symptoms-by-part.json`;
    _symptomsLoading = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`Failed to fetch ${url}`);
      return r.json();
    });
  }
  _symptomsData = await _symptomsLoading;
  const list = (_symptomsData ?? {})[bodyPartId] ?? [];
  _symptomsAllCache.set(bodyPartId, list);
  return list;
}
```

**Key insight:** The symptoms file is loaded ONCE and shared across all body parts (D-06). Disease files are per-body-part (D-05/D-08).

### Pattern 2: 4th Column Grid Expansion in Explorer

**What:** `body-map-explorer` grid template changes from 3 to 4 columns; a `body-map-data-panel` component is added in the 4th slot.
**When to use:** Explorer owns the data loading state; passes data down to the panel as properties.

```typescript
// Source: src/body-map-explorer.ts [VERIFIED: codebase]
// Modified render() in BodyMapExplorer:

// Grid change:
// OLD: grid-template-columns: 260px 1fr 300px;
// NEW: grid-template-columns: 260px 1fr 300px 1fr;

render() {
  return html`
    <div class="layout">
      <!-- col 1: sidebar -->
      <div class="panel">
        <body-map-sidebar ...></body-map-sidebar>
      </div>
      <!-- col 2: body model -->
      <div class="body-model-area">
        <body-map-model
          ...
          @section-click=${this._handleSectionClick}
        ></body-map-model>
      </div>
      <!-- col 3: detail panel -->
      <div class="panel">
        <body-map-detail-panel .system=${this.activeSystem}></body-map-detail-panel>
      </div>
      <!-- col 4: data panel (NEW) -->
      <div class="panel data-panel-col">
        <body-map-data-panel
          .selectedOrganIds=${this.selectedOrganIds}
          .organDataMap=${this._organDataMap}
          .loadingIds=${this._loadingIds}
          .errorIds=${this._errorIds}
          .filterQuery=${this._filterQuery}
          @filter-change=${this._handleFilterChange}
          @retry-organ=${this._handleRetryOrgan}
        ></body-map-data-panel>
      </div>
    </div>
    <!-- Modal (outside grid, position: fixed) -->
    ${this._modalSectionId !== null ? html`
      <body-map-modal
        .sectionId=${this._modalSectionId}
        .diseases=${this._modalDiseases}
        .symptoms=${this._modalSymptoms}
        .loading=${this._modalLoading}
        .error=${this._modalError}
        .anchorX=${this._modalAnchorX}
        .anchorY=${this._modalAnchorY}
        @modal-close=${this._handleModalClose}
        @symptom-toggle=${this._handleSymptomToggle}
      ></body-map-modal>
    ` : nothing}
  `;
}
```

### Pattern 3: section-click Event Dispatch from body-map-model

**What:** `_handleSectionClick` in `body-map-model` currently only toggles internal `_selectedSections` state. Phase 4 needs it to also dispatch an event with coordinates and section ID for the modal.

```typescript
// Source: src/body-map-model.ts lines 529-546 [VERIFIED: codebase]
private _handleSectionClick(event: MouseEvent) {
  const group = (event.target as Element | null)?.closest(".body-section-group");
  const partId = group?.getAttribute("data-part");
  if (!partId) return;

  // Existing toggle logic preserved
  if (this._selectedSections.has(partId)) {
    this._selectedSections.delete(partId);
  } else {
    this._selectedSections.add(partId);
  }
  this.requestUpdate();

  // NEW: dispatch event for modal
  this.dispatchEvent(
    new CustomEvent("section-click", {
      detail: {
        sectionId: partId,
        clientX: event.clientX,
        clientY: event.clientY,
      },
      bubbles: true,
      composed: true,
    }),
  );
}
```

### Pattern 4: Modal Viewport-Aware Positioning

**What:** Modal positioned using `position: fixed` with coordinates computed from the click's `clientX/clientY`. Smart offset logic prevents the modal from clipping outside the viewport — mirrors the logic from the reference HTML's `symptom-modal`.

**Reference CSS (from `interactive-body-model.html` lines 919-1025):** [VERIFIED: codebase]

- `.symptom-modal`: `position: fixed`, `width: 520px`, `max-width: calc(100vw - 32px)`, `max-height: min(440px, 70vh)`
- `.symptom-modal-carat`: `position: fixed`, `width: 14px`, `height: 14px`, `transform: rotate(45deg)`, carat is a rotated square creating the triangular pointer
- Enter animation: `opacity: 0 + translateY(16px)` → `opacity: 1 + translateY(0)` via CSS transition
- Close animation: `opacity: 0 + translateY(-10px)` with shorter 0.22s duration
- Backdrop: `position: fixed; inset: 0; background: rgba(0,0,0,0.08)`

```typescript
// Source: pattern from reference HTML [VERIFIED: codebase]
// Modal positioning algorithm:
private _computeModalPosition(clickX: number, clickY: number) {
  const modalW = 520;
  const modalH = 440;
  const caratSize = 14;
  const gap = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Default: open to the right of click point
  let left = clickX + gap;
  let top = clickY - modalH / 2;

  // Flip left if no room on right
  if (left + modalW > vw - 16) {
    left = clickX - modalW - gap;
  }
  // Clamp vertical
  top = Math.max(16, Math.min(top, vh - modalH - 16));

  return { left, top, caratLeft: clickX, caratTop: clickY - caratSize / 2 };
}
```

### Pattern 5: Skeleton Shimmer

**What:** CSS-only animated gradient shimmer as a loading placeholder. Applied inside `body-map-data-panel` and `body-map-modal` while data is fetching.

**Reference CSS (from `interactive-body-model.html` lines 1072-1105):** [VERIFIED: codebase]

```css
/* Replicate inside Lit component css`` template */
.skeleton-bar {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}
.skeleton-bar.short {
  width: 55%;
}
.skeleton-bar.medium {
  width: 72%;
}
.skeleton-bar.long {
  width: 90%;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

**Shadow DOM note:** `@keyframes` inside a Lit component's `static styles` is scoped to that component's Shadow DOM. [VERIFIED: Lit v3 docs pattern — CSS inside `css\`\`` is injected into Shadow DOM adoptedStyleSheets]

### Pattern 6: Data Split Script

**What:** Node.js CommonJS or ESM script that reads `public/data/diseases.json` and writes 83 individual files.

```javascript
// scripts/split-diseases.js
// Source: D-07 decision, Node.js v20.19.0 [VERIFIED: node --version]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const source = JSON.parse(
  readFileSync(join(root, "public/data/diseases.json"), "utf-8"),
);
const outDir = join(root, "public/data/diseases");
mkdirSync(outDir, { recursive: true });

for (const [key, entries] of Object.entries(source)) {
  // Strip ICD codes per D-04 — only write {name} objects
  const stripped = entries.map(({ name }) => ({ name }));
  writeFileSync(join(outDir, `${key}.json`), JSON.stringify(stripped), "utf-8");
}
console.log(`Split ${Object.keys(source).length} files to ${outDir}`);
```

Add to `package.json` scripts: `"split-diseases": "node scripts/split-diseases.js"`

### Pattern 7: Debounced Filter Input

**What:** A simple debounce utility (no library) with 250ms default delay, used for the global search input in the 4th column and the modal's search input.

```typescript
// Inline utility — no import needed
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  ms: number,
): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}
```

### Pattern 8: Tab Component Inside Modal

**What:** Simple underline-style tabs (per Claude's Discretion). Minimal state: `activeTab: 'symptoms' | 'diseases'`. No external tab library needed.

```typescript
// Underline tab pattern — consistent with existing `.view-tabs` in body-map-model.ts
// Uses same toggling pattern: active tab gets underline border-bottom
```

### Anti-Patterns to Avoid

- **Fetching all 83 disease files on page load:** Each file must only load on first body-part selection (DATA-04). Pre-loading defeats the purpose of splitting.
- **Using `document.addEventListener` for Escape/backdrop in Lit component:** Use `connectedCallback`/`disconnectedCallback` to add/remove event listeners cleanly, or use Lit's `@queryAll` and event delegation from the host element. Failure to clean up creates memory leaks across re-renders.
- **Merging system highlight IDs into selectedOrganIds:** Established anti-pattern from Phase 3 (STATE.md). The data panel must only show cards for user-selected organs (`selectedOrganIds`), never for system-highlighted organs.
- **Storing click coordinates in URL params or component attributes:** Coordinates are ephemeral — pass as properties only, never serialize.
- **Caching per component instance:** The DataService cache must be module-level (singleton), not inside a component `@state`. Component instances are created/destroyed; a per-instance cache would re-fetch on every re-mount.

---

## Don't Hand-Roll

| Problem                | Don't Build                                       | Use Instead                                          | Why                                                                                    |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------- |
| CSS shimmer animation  | Custom canvas/JS animation                        | CSS `@keyframes` gradient shift                      | Reference HTML already has working implementation (lines 1072-1105); pure CSS, zero JS |
| Debounce               | Full throttle/debounce library (lodash)           | 5-line vanilla `debounce()` function                 | No external dep needed; 200-300ms debounce is trivial                                  |
| Modal positioning math | Full positioning library (Popper.js, Floating UI) | Vanilla JS viewport math                             | Modal only needs one layout pass; reference HTML already implements the algorithm      |
| Fetch caching          | Service Worker / React Query / SWR                | `Map<string, T>` in a module-level singleton         | Requirements specify in-memory Map (D-08); no persistence needed                       |
| Tab component          | External tab library                              | 2-state `activeTab` variable + conditional CSS class | Only 2 tabs, no animation required                                                     |
| Data splitting         | Webpack code-splitting / dynamic imports          | Node.js script producing static JSON files           | Static JSON files are simpler, framework-agnostic, and compatible with any CDN         |

**Key insight:** The reference HTML (`interactive-body-model.html`) already solved every UI problem in this phase. The task is to re-implement those solutions in Lit Shadow DOM, not to reinvent them.

---

## Common Pitfalls

### Pitfall 1: Shadow DOM Blocks `position: fixed` Stacking Context

**What goes wrong:** A `body-map-modal` with `position: fixed` rendered inside `body-map-explorer`'s Shadow DOM may not escape the explorer's CSS stacking context if the host element has `transform`, `filter`, or `will-change` applied. The modal would be clipped or mispositioned.
**Why it happens:** CSS `position: fixed` is relative to the nearest containing block that creates a new stacking context, which can be inside a Shadow root boundary.
**How to avoid:** Either (a) render the modal in the Light DOM via `createRenderRoot()` override, or (b) use a `<slot>` to project the modal outside the Shadow DOM, or (c) ensure the `body-map-explorer` `:host` has no `transform`/`filter`/`will-change` CSS properties. Option (c) is simplest given the current codebase.
**Warning signs:** Modal appears inside the body model area, or is clipped to the explorer's bounding box.

### Pitfall 2: Event Listeners Not Cleaned Up

**What goes wrong:** `keydown` listener added on `document` for Escape key dismissal in the modal component is not removed on disconnect. After the modal is removed from DOM, the listener remains active and fires for all keyboard input.
**Why it happens:** `addEventListener` on `document` persists independently of component lifecycle.
**How to avoid:** Add in `connectedCallback`, remove in `disconnectedCallback`. Alternatively, use Lit's `@eventOptions` with a bound method stored as a class property.
**Warning signs:** Pressing Escape anywhere on the page after a modal has been opened then closed triggers unexpected behavior.

### Pitfall 3: Debounce Inside Lit render() Creates New Function Each Render

**What goes wrong:** `@input=${debounce(this._handleFilter, 250)}` creates a new debounce wrapper on every render, resetting the timer on every re-render cycle (which Lit triggers on any `@state` change).
**Why it happens:** Lit calls `render()` reactively; every property access in the template is re-evaluated.
**How to avoid:** Create the debounced handler once in the constructor or as a class field: `private _debouncedFilter = debounce(this._handleFilter.bind(this), 250)`. Reference it in the template by name.
**Warning signs:** Filter appears to only work after the user stops typing AND the component finishes re-rendering (double-delay).

### Pitfall 4: diseases.json Keys May Not Match Organ IDs

**What goes wrong:** `selectedOrganIds` from `body-map-model` uses organ IDs like `"brain"`, `"heart"`. `diseases.json` keys are prefixed: `"bp_brain"`, `"bp_heart"`. The DataService fetch URL will be wrong if the mapping is not applied.
**Why it happens:** The organ data layer (Phase 2) uses un-prefixed IDs; the disease data layer uses `bp_` prefixed keys.
**How to avoid:** The DataService must apply a prefix mapping: `const key = id.startsWith("bp_") ? id : \`bp*\${id}\``. Verify mapping by inspecting the actual `diseases.json`keys.
**Warning signs:** Fetches for`/data/diseases/brain.json`return 404; correct URL is`/data/diseases/bp_brain.json`. [VERIFIED: diseases.json keys all start with `bp*`]

### Pitfall 5: Large bp_arms and bp_skin Files (831 KB / 557 KB) Affect Perceived Performance

**What goes wrong:** Users who select "arms" or "skin" body parts (if these are exposed in the organ IDs) will trigger a 831 KB fetch, stalling the panel rendering noticeably on slow connections.
**Why it happens:** The data is not uniformly distributed — `bp_arms` has 6,300 disease entries (831 KB uncompressed), far above the 93 KB average.
**How to avoid:** Ensure the skeleton shimmer is visible immediately on selection (before fetch resolves). The UX impact is mitigated by showing a loading state. If server-side gzip is available, 831 KB compresses to ~200 KB. If host server doesn't gzip JSON, consider adding a "show first 50" cap with a "Show all" button (this is already present in the reference HTML as `.show-more-item`).
**Warning signs:** Blank panel for 1-3 seconds on slow connections after selecting "arms" — skeleton should be visible immediately.

### Pitfall 6: Symptoms-by-part.json Keys Use `bp_` Prefix But May Not Cover All Organ IDs

**What goes wrong:** Some organ IDs (e.g., `"male_reproductive"`) may not have a matching `"bp_male_reproductive"` key in `symptoms-by-part.json`.
**Why it happens:** The symptoms data was generated independently from the organ list; key coverage is not guaranteed.
**How to avoid:** DataService should return `[]` (empty array) when a key is missing, not throw. Show "No symptoms found" (D-15) rather than an error.
**Warning signs:** Empty symptoms panel for some organs even though symptoms-by-part.json loaded successfully.

### Pitfall 7: Modal Backdrop Click vs. Modal Content Click Confusion

**What goes wrong:** Clicking inside the modal content dismisses the modal because the backdrop click event bubbles up from the click target.
**Why it happens:** If the backdrop covers the entire viewport (including over the modal), a click on a list item inside the modal also fires the backdrop's click handler.
**How to avoid:** The backdrop should be a sibling element behind the modal (z-index lower than modal). Use `event.stopPropagation()` on the modal container, or only close when `event.target === backdropElement` (the reference HTML uses `pointer-events: none` on the overlay wrapper and only attaches the click handler to the backdrop element itself).
**Warning signs:** Modal closes whenever user clicks any list item inside it.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Lit @state for async data loading (multi-organ map)

```typescript
// Source: Lit v3 reactive properties pattern [VERIFIED: existing body-map-explorer.ts pattern]
@state() private _organDataMap = new Map<string, DiseaseEntry[]>();
@state() private _loadingIds = new Set<string>();
@state() private _errorIds = new Map<string, string>();

private async _loadOrganData(organId: string) {
  if (this._organDataMap.has(organId) || this._loadingIds.has(organId)) return;

  this._loadingIds = new Set([...this._loadingIds, organId]);
  try {
    const diseases = await fetchDiseases(organId, this.assetBase ?? "");
    const next = new Map(this._organDataMap);
    next.set(organId, diseases);
    this._organDataMap = next;
  } catch (err) {
    const nextErr = new Map(this._errorIds);
    nextErr.set(organId, String(err));
    this._errorIds = nextErr;
  } finally {
    const next = new Set(this._loadingIds);
    next.delete(organId);
    this._loadingIds = next;
  }
}
```

**Note:** Lit's `@state` reactive properties must be reassigned (not mutated) to trigger re-render. Always create a new `Map` or `Set` from the old one. [VERIFIED: Lit reactivity docs pattern, confirmed by existing component patterns in codebase]

### Collapsible card with CSS grid animation (from reference HTML)

```typescript
// Source: interactive-body-model.html lines 282-296 [VERIFIED: codebase]
// Replicate in Lit:
static styles = css`
  .section-collapsible {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.25s ease;
    opacity: 1;
  }
  .collapsed .section-collapsible {
    grid-template-rows: 0fr;
    opacity: 0;
  }
  .section-collapsible-inner {
    overflow: hidden;
  }
`;
```

### Modal Escape key and backdrop dismiss

```typescript
// Source: established Lit lifecycle pattern [VERIFIED: Lit connectedCallback pattern]
connectedCallback() {
  super.connectedCallback();
  this._onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this._close();
  };
  document.addEventListener("keydown", this._onKeyDown);
}

disconnectedCallback() {
  super.disconnectedCallback();
  document.removeEventListener("keydown", this._onKeyDown);
}

private _onKeyDown!: (e: KeyboardEvent) => void;
```

### Count badge (from reference HTML)

```typescript
// Source: interactive-body-model.html line 299-305 [VERIFIED: codebase]
// .section-count-badge: background #6cb5f4, color #fff, padding 2px 10px, border-radius 10px
// Use var(--bme-accent) token for the blue color
```

---

## State of the Art

| Old Approach                                   | Current Approach                       | When Changed  | Impact                                                       |
| ---------------------------------------------- | -------------------------------------- | ------------- | ------------------------------------------------------------ |
| 7.6 MB global JS file with all disease data    | Per-body-part JSON files, lazy-fetched | Phase 4 (now) | Only 1 file loads per selection; most files are under 100 KB |
| `window.DISEASES_BY_BODY_PART` global variable | `fetch()` + in-memory Map cache        | Phase 4 (now) | No upfront parse cost; supports CDN hosting                  |
| All data loaded synchronously at page parse    | Lazy loading with skeleton state       | Phase 4 (now) | Initial page load stays fast                                 |

**Deprecated/outdated:**

- `diseases-data.js` (old global JS file): Phase 4 replaces with per-part JSON files. The old file is already converted to `diseases.json` (Phase 1). The split script generates `public/data/diseases/*.json`.
- `symptoms-by-bodypart-data.js` (old global): Replaced by `symptoms-by-part.json` fetched via `fetch()`.

---

## Assumptions Log

| #   | Claim                                                                                                                                      | Section                           | Risk if Wrong                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A1  | Organ IDs in `selectedOrganIds` can be prefixed with `bp_` to form disease JSON file paths (e.g., `"brain"` → `"bp_brain.json"`)           | Architecture Patterns / Pitfall 4 | DataService fetches wrong URLs; all disease loads return 404. Mitigation: verify mapping in Wave 0 task.                   |
| A2  | The `body-map-explorer` host element has no CSS `transform`, `filter`, or `will-change` that would trap `position: fixed` stacking context | Pitfall 1                         | Modal clips to explorer bounds. Mitigation: test on first modal render; fix is removing those CSS properties from `:host`. |
| A3  | `symptoms-by-part.json` keys align closely enough to organ IDs (after `bp_` prefix) to return meaningful results for most organs           | Common Pitfalls 6                 | Some organs show "No symptoms found" even when data exists. Low impact: D-15 handles empty state gracefully.               |
| A4  | Section IDs from `body-map-model` (e.g., `"head_neck"`, `"chest"`) have matching keys in `symptoms-by-part.json` for the modal             | Architecture / Pattern 3          | Modal shows empty symptoms tab. Low impact: graceful empty state.                                                          |

---

## Open Questions

1. **Key mapping between `selectedOrganIds` and `diseases.json` / `symptoms-by-part.json` keys**
   - What we know: `diseases.json` has 83 keys, all `bp_`-prefixed. `symptoms-by-part.json` has 84 keys, also `bp_`-prefixed. Organ IDs in `selectedOrganIds` are un-prefixed (e.g., `"brain"`, `"heart"`).
   - What's unclear: Do all 20 organ IDs (from Phase 2) have matching `bp_` keys in both data files? Some organs like `"male_reproductive"` may map to `"bp_male_reproductive"` or a different key.
   - Recommendation: Wave 0 task should print a mapping verification: for each organ ID, check whether `bp_{id}` exists in both JSON files. Document gaps.

2. **Modal anchor for section clicks in Shadow DOM — coordinate system**
   - What we know: `_handleSectionClick` receives a `MouseEvent` with `clientX/clientY` (viewport coordinates). These are passed via the `section-click` CustomEvent to the explorer.
   - What's unclear: When `body-map-modal` renders as a child of `body-map-explorer`'s Shadow DOM and uses `position: fixed`, it must use the same `clientX/clientY` coordinate space. This should work correctly since `position: fixed` is always relative to the viewport regardless of Shadow DOM boundaries.
   - Recommendation: Verify in browser test during Wave 1.

3. **4th column width for the data panel**
   - What we know: User left this to Claude's Discretion. Reference HTML uses `1fr`. Current grid is `260px 1fr 300px`.
   - What's unclear: Whether `1fr` for the data panel is appropriate, or if a fixed width like `320px` would be better.
   - Recommendation: Use `minmax(280px, 1fr)` to prevent the column from collapsing on narrow viewports, consistent with existing pattern where the body model column also uses `1fr`.

---

## Environment Availability

| Dependency                          | Required By                 | Available | Version          | Fallback |
| ----------------------------------- | --------------------------- | --------- | ---------------- | -------- |
| Node.js                             | `scripts/split-diseases.js` | Yes       | v20.19.0         | —        |
| npm                                 | `npm run split-diseases`    | Yes       | 10.8.2           | —        |
| `public/data/diseases.json`         | Split script source         | Yes       | 7.56 MB, 83 keys | —        |
| `public/data/symptoms-by-part.json` | DataService symptoms fetch  | Yes       | 101 KB, 84 keys  | —        |
| Vitest                              | Tests                       | Yes       | 4.1.2            | —        |
| happy-dom                           | Test DOM environment        | Yes       | 20.8.9           | —        |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

---

## Validation Architecture

### Test Framework

| Property           | Value                               |
| ------------------ | ----------------------------------- |
| Framework          | Vitest 4.1.2 + happy-dom 20.8.9     |
| Config file        | `vitest.config.ts` (exists)         |
| Quick run command  | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run`                    |

All 51 existing tests pass as of research date. [VERIFIED: vitest run output]

### Phase Requirements → Test Map

| Req ID            | Behavior                                                                                | Test Type | Automated Command                                          | File Exists? |
| ----------------- | --------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------- | ------------ |
| DATA-04 / DATA-05 | DataService fetches per-body-part JSON only on first call; cache returns on second call | unit      | `npx vitest run src/__tests__/data-service.test.ts`        | Wave 0       |
| DATA-01           | Disease list appears in data panel when organ is selected                               | unit      | `npx vitest run src/__tests__/body-map-data-panel.test.ts` | Wave 0       |
| DATA-02           | Symptom list appears in data panel when organ is selected                               | unit      | `npx vitest run src/__tests__/body-map-data-panel.test.ts` | Wave 0       |
| DATA-03           | Filter input narrows disease/symptom lists                                              | unit      | `npx vitest run src/__tests__/body-map-data-panel.test.ts` | Wave 0       |
| MODAL-01          | section-click event opens modal component                                               | unit      | `npx vitest run src/__tests__/body-map-modal.test.ts`      | Wave 0       |
| MODAL-03          | Modal renders skeleton bars when `loading=true`                                         | unit      | `npx vitest run src/__tests__/body-map-modal.test.ts`      | Wave 0       |
| MODAL-04          | Escape key closes modal                                                                 | unit      | `npx vitest run src/__tests__/body-map-modal.test.ts`      | Wave 0       |
| MODAL-02          | Modal position coordinates                                                              | manual    | Browser visual inspection                                  | manual       |

**Note:** `happy-dom` does not support `position: fixed` visual layout, so MODAL-02 (visual positioning) must be verified in a real browser. All behavioral tests (data loading, filtering, open/close) are automatable.

### Sampling Rate

- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/__tests__/data-service.test.ts` — covers DATA-04, DATA-05 (fetch + cache)
- [ ] `src/__tests__/body-map-data-panel.test.ts` — covers DATA-01, DATA-02, DATA-03
- [ ] `src/__tests__/body-map-modal.test.ts` — covers MODAL-01, MODAL-03, MODAL-04
- [ ] `src/data/data-service.ts` — the service module under test
- [ ] `scripts/split-diseases.js` — Node.js split script (no Vitest test needed; verify by checking output directory after run)

---

## Security Domain

> `security_enforcement` is not set to false in config.json — including section.

### Applicable ASVS Categories

| ASVS Category         | Applies | Standard Control                                |
| --------------------- | ------- | ----------------------------------------------- |
| V2 Authentication     | No      | No auth in this phase                           |
| V3 Session Management | No      | Stateless component; no sessions                |
| V4 Access Control     | No      | All content is public health data               |
| V5 Input Validation   | Yes     | Filter/search input: sanitize before use in DOM |
| V6 Cryptography       | No      | No secrets, no encryption                       |

### Known Threat Patterns

| Pattern                                           | STRIDE    | Standard Mitigation                                                                                                                                                                               |
| ------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| XSS via disease/symptom content inserted into DOM | Tampering | Lit's `html` template literal auto-escapes string values; NEVER use `innerHTML` or `unsafeHTML` for disease/symptom names                                                                         |
| XSS via search input reflected into DOM           | Tampering | Lit template binding escapes text nodes by default; filter function uses `.filter(item => item.toLowerCase().includes(query))` on string data only                                                |
| URL injection via `assetBase` attribute           | Tampering | `assetBase` is used to construct fetch URLs; validate it does not contain `javascript:` or data URIs. Use same `_assetPrefix()` pattern from `body-map-model.ts` which strips trailing slash only |

**Key rule:** Always use Lit's `html` template literal for rendering disease names and symptom strings. Never call `innerHTML` or Lit's `unsafeHTML` directive on data from the JSON files.

---

## Sources

### Primary (HIGH confidence)

- `src/body-map-explorer.ts` — Current 3-column grid, state pattern, event handler pattern [VERIFIED: direct file read]
- `src/body-map-model.ts` lines 481-546 — Organ click and section click handlers [VERIFIED: direct file read]
- `src/data/systems.ts` — Data module pattern to replicate [VERIFIED: direct file read]
- `src/styles/tokens.css.ts` — Design tokens (`--bme-*` properties) [VERIFIED: direct file read]
- `interactive-body-model.html` lines 237-380 — Disease/symptom panel CSS reference [VERIFIED: direct file read]
- `interactive-body-model.html` lines 894-1105 — Modal CSS + skeleton shimmer CSS reference [VERIFIED: direct file read]
- `public/data/diseases.json` — 7.56 MB, 83 `bp_`-prefixed keys, entries are `{code, name}` [VERIFIED: python3 inspection]
- `public/data/symptoms-by-part.json` — 101 KB, 84 `bp_`-prefixed keys, entries are string arrays [VERIFIED: python3 inspection]
- `vitest.config.ts` — Test config, `happy-dom` environment, `src/**/*.test.ts` include [VERIFIED: direct file read]
- `package.json` — All dependency versions, existing npm scripts [VERIFIED: direct file read]

### Secondary (MEDIUM confidence)

- Lit v3 reactivity model (Map/Set reassignment requirement) — established from prior phases and codebase patterns [VERIFIED: consistent with existing component code]

### Tertiary (LOW confidence)

- None.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries already installed, verified versions
- Architecture: HIGH — all patterns derived from existing codebase files and reference HTML
- Pitfalls: HIGH — derived from direct code inspection and known Lit/Shadow DOM constraints
- Data structure: HIGH — verified by Python inspection of actual JSON files

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable stack; data files are static; Lit v3 API is stable)
