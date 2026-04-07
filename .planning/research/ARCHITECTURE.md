# Architecture Patterns

**Domain:** Interactive medical body map Web Component
**Researched:** 2026-03-29

## Recommended Architecture

### High-Level Component Tree

```
<body-map-explorer>                    (public API surface, orchestrator)
  |
  +-- <body-map-sidebar>               (left column: systems + body parts)
  |     +-- systems list               (11 body systems, clickable)
  |     +-- body parts nav             (57 body parts, filterable)
  |
  +-- <body-map-model>                 (center: SVG body model)
  |     +-- SVG silhouette             (background, non-interactive)
  |     +-- SVG organ images           (raster PNGs via <image href>)
  |     +-- SVG highlight overlays     (selection/hover feedback)
  |     +-- SVG hit areas              (transparent click targets)
  |     +-- SVG section areas          (body region polygons)
  |     +-- view/gender/rotate controls
  |
  +-- <body-map-detail-panel>          (right column: system description)
  |     +-- system info card           (description, processes, key parts)
  |
  +-- <body-map-data-columns>          (far right: diseases + symptoms)
  |     +-- disease list               (filterable, lazy-loaded)
  |     +-- symptom list               (filterable, lazy-loaded)
  |
  +-- <body-map-modal>                 (overlay: symptom selection)
        +-- symptom search             (autocomplete filter)
        +-- symptom list               (per-organ/section symptoms)
```

### Component Boundaries

| Component               | Responsibility                                                                                  | Communicates With                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `body-map-explorer`     | Public API, state orchestration, sub-component composition, asset path resolution, data loading | All sub-components (parent), host page (events/properties) |
| `body-map-sidebar`      | Render systems list, render body parts nav, handle system/body-part clicks                      | Explorer (events up, props down)                           |
| `body-map-model`        | Render SVG, manage organ/section images and hit areas, handle click/hover/touch, view switching | Explorer (events up, props down)                           |
| `body-map-detail-panel` | Render system description, processes, key parts                                                 | Explorer (props down only)                                 |
| `body-map-data-columns` | Render disease/symptom lists, handle search/filter                                              | Explorer (events up, props down)                           |
| `body-map-modal`        | Render symptom selection overlay, position relative to click                                    | Explorer (events up, props down)                           |

### Data Flow

```
Host Page
  |
  |  attributes/properties (gender, view, selectedParts, dataFetcher)
  v
[body-map-explorer]  ------>  CustomEvents (body-part-selected, system-selected, etc.)
  |                                |
  |  props down                    v
  v                           Host Page event listeners
[body-map-sidebar]
[body-map-model]     <-- events up (organ-clicked, section-clicked)
[body-map-detail-panel]
[body-map-data-columns]
[body-map-modal]
```

**State lives in `body-map-explorer`.** Sub-components are stateless renderers that receive data via properties and emit events when users interact. The orchestrator updates state and passes new props down, triggering Lit's reactive re-render.

## Patterns to Follow

### Pattern 1: Props-Down Events-Up

**What:** Parent component owns all state. Children receive data as properties and fire events for user actions.

**When:** All communication between `body-map-explorer` and its sub-components.

**Example:**

```typescript
// body-map-model.ts (child)
@customElement("body-map-model")
export class BodyMapModel extends LitElement {
  @property({ type: String }) view = "sections";
  @property({ type: String }) gender = "male";
  @property({ type: Array }) selectedOrgans: string[] = [];
  @property({ type: String }) activeSystem = "";

  private handleOrganClick(organId: string) {
    this.dispatchEvent(
      new CustomEvent("organ-clicked", {
        detail: { organId },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

// body-map-explorer.ts (parent)
@customElement("body-map-explorer")
export class BodyMapExplorer extends LitElement {
  @state() private selectedOrgans: string[] = [];

  private handleOrganClicked(e: CustomEvent) {
    const { organId } = e.detail;
    // Toggle selection
    this.selectedOrgans = this.selectedOrgans.includes(organId)
      ? this.selectedOrgans.filter((id) => id !== organId)
      : [...this.selectedOrgans, organId];
  }

  render() {
    return html`
      <body-map-model
        .selectedOrgans=${this.selectedOrgans}
        @organ-clicked=${this.handleOrganClicked}
      ></body-map-model>
    `;
  }
}
```

### Pattern 2: Asset Path Resolution via import.meta.url

**What:** Resolve asset paths relative to the component's module location, not the host page's URL.

**When:** Loading organ PNGs, data JSON files, or any external asset.

**Example:**

```typescript
export class BodyMapExplorer extends LitElement {
  private static assetBase = new URL("./assets/", import.meta.url).href;

  resolveAsset(path: string): string {
    return new URL(path, BodyMapExplorer.assetBase).href;
  }

  // Usage in template
  render() {
    return html` <image href=${this.resolveAsset("organs/brain.webp")} /> `;
  }
}
```

### Pattern 3: Lazy Data Loading with Caching

**What:** Load disease/symptom data only when first needed, then cache.

**When:** User clicks an organ or searches the disease list.

**Example:**

```typescript
export class BodyMapExplorer extends LitElement {
  private dataCache = new Map<string, any>();

  async loadData(type: "diseases" | "symptoms", bodyPartId: string) {
    const key = `${type}:${bodyPartId}`;
    if (this.dataCache.has(key)) return this.dataCache.get(key);

    // API mode: use provided fetcher
    if (this.dataFetcher) {
      const data = await this.dataFetcher(type, bodyPartId);
      this.dataCache.set(key, data);
      return data;
    }

    // Bundled mode: fetch from co-located JSON
    const url = this.resolveAsset(`data/${type}/${bodyPartId}.json`);
    const data = await fetch(url).then((r) => r.json());
    this.dataCache.set(key, data);
    return data;
  }
}
```

### Pattern 4: SVG Event Delegation

**What:** Single event listener on a parent SVG group, delegate to individual hit areas via `data-*` attributes.

**When:** Handling clicks on 17+ organ hit areas.

**Example:**

```typescript
private setupHitAreaListeners() {
  const hitLayer = this.shadowRoot!.querySelector('#hit-areas');
  hitLayer?.addEventListener('click', (e: Event) => {
    const target = (e.target as SVGElement).closest('[data-organ]');
    if (!target) return;
    const organId = (target as SVGElement).dataset.organ!;
    this.dispatchEvent(new CustomEvent('organ-clicked', {
      detail: { organId },
      bubbles: true,
      composed: true
    }));
  });
}
```

### Pattern 5: CSS Custom Property Theming

**What:** Expose CSS custom properties on `:host` for external theming.

**When:** Host pages need to customize colors, fonts, or spacing.

**Example:**

```typescript
static styles = css`
  :host {
    /* Layout */
    --bm-sidebar-width: 240px;
    --bm-detail-width: 300px;
    --bm-gap: 24px;

    /* Colors */
    --bm-bg: #f5f5f5;
    --bm-surface: #ffffff;
    --bm-text: #434448;
    --bm-accent: #6cb5f4;
    --bm-hover: rgba(100, 180, 255, 0.35);
    --bm-selected: rgba(100, 180, 255, 0.5);
    --bm-border: #e0e0e0;

    /* Typography */
    --bm-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --bm-font-size-base: 14px;

    display: block;
    font-family: var(--bm-font-family);
    background: var(--bm-bg);
  }
`;
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Base64 Images in JS Bundle

**What:** Importing PNGs in JavaScript source so the bundler inlines them as base64 strings.

**Why bad:** A single `import brain from './organs/brain.png'` in Vite (with default `assetsInlineLimit: 4096`) would inline images under 4KB. But if the limit is raised or images are small enough, the component JS bundle balloons. Even without inlining, importing images means the bundler processes them, potentially increasing build time.

**Instead:** Use external `href` attributes in SVG `<image>` elements, resolved via `import.meta.url`. Keep images as static files in the `dist/assets/` directory, never imported into JS.

### Anti-Pattern 2: Global State or Singletons

**What:** Using module-level variables or `window.*` globals for component state.

**Why bad:** Breaks if multiple `<body-map-explorer>` instances exist on a page. The current app uses `window.toggleBodyPart()`, `window.setView()`, etc.

**Instead:** All state lives as instance properties on the `BodyMapExplorer` class. No `window.*` assignments.

### Anti-Pattern 3: innerHTML for Dynamic Content

**What:** Using `innerHTML = ""` to clear and rebuild DOM sections.

**Why bad:** Destroys event listeners, creates GC pressure, potential XSS if data sources change. The current app uses `innerHTML` in 2 places and `while(el.firstChild) el.removeChild(el.firstChild)` pattern elsewhere.

**Instead:** Use Lit's `html` tagged template literal. Lit efficiently diffs and patches only changed parts of the DOM.

### Anti-Pattern 4: Querying DOM by ID Inside Event Handlers

**What:** `document.getElementById('symptomModal')` inside frequently-called functions.

**Why bad:** DOM queries are relatively expensive when repeated in loops or event handlers. The current app has ~91 getElementById calls, many inside render functions called on every state change.

**Instead:** Use Lit's `@query` decorator to cache references:

```typescript
@query('#symptom-modal') private modalEl!: HTMLElement;
```

### Anti-Pattern 5: Synchronous Data Loading

**What:** `<script src="diseases-data.js">` loading 7.6 MB of data before the page renders.

**Why bad:** Blocks the main thread for 300-500ms on desktop, seconds on mobile. All data is parsed even if the user never looks at diseases.

**Instead:** Lazy-load data via `fetch()` when first needed (see Pattern 3 above).

## Scalability Considerations

| Concern            | Current (prototype)            | At 1K daily users                      | At 100K daily users                       |
| ------------------ | ------------------------------ | -------------------------------------- | ----------------------------------------- |
| Bundle size        | 12 MB total                    | Must be < 500 KB initial               | CDN with gzip, < 100 KB component JS      |
| Data loading       | All upfront (8 MB)             | Lazy per-organ (~100-200 KB per click) | API-driven, paginated, edge-cached        |
| Image format       | PNG base64 inline              | WebP external files                    | WebP + CDN + responsive sizes             |
| State management   | Global vars in IIFE            | Lit reactive properties                | Same (component-scoped, no scaling issue) |
| Multiple instances | Not supported (window globals) | Supported (class instance state)       | Same                                      |
| Rendering          | Full DOM rebuild on changes    | Lit efficient diffing                  | Same (20 organs is well within limits)    |

## Sources

- MDN Custom Elements lifecycle: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements (verified)
- MDN CustomEvent: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent (verified)
- MDN Shadow DOM: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM (verified)
- Codebase analysis: `.planning/codebase/ARCHITECTURE.md` (primary source for current patterns)
- Lit documentation: https://lit.dev (training data)
