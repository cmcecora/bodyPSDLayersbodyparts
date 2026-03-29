# Web Component Packaging & Build Tooling

**Project:** Body Map Explorer (`<body-map-explorer>`)
**Researched:** 2026-03-29
**Overall confidence:** MEDIUM-HIGH (MDN verified + established technology patterns)

---

## 1. Web Component Framework Decision: Use Lit

**Recommendation:** Use **Lit** (v3.x, ~5KB gzipped) as the Web Component base class.

**Why Lit over alternatives:**

| Criterion           | Lit                                            | Stencil                               | Vanilla                            |
| ------------------- | ---------------------------------------------- | ------------------------------------- | ---------------------------------- |
| Bundle size         | ~5KB gzipped                                   | ~14KB gzipped                         | 0KB (but more code)                |
| Learning curve      | Low (extends HTMLElement)                      | Medium (Angular-like decorators, JSX) | Lowest (raw APIs)                  |
| Reactive properties | Built-in (`@property`)                         | Built-in (`@Prop`)                    | Manual (attributeChangedCallback)  |
| Template system     | Tagged template literals (html\`\`)            | JSX                                   | Manual DOM manipulation            |
| Shadow DOM          | Default, opt-out available                     | Default                               | Manual attachShadow                |
| NPM publishing      | Standard ES modules                            | Generates per-framework wrappers      | Standard ES modules                |
| Angular integration | Works via standard custom elements             | Has Angular output target             | Works via standard custom elements |
| Community           | Largest Web Component community, Google-backed | Ionic team, smaller community         | N/A                                |
| TypeScript          | First-class support                            | Required                              | Optional                           |

**Why NOT Stencil:** Stencil's compiler approach adds build complexity and larger runtime. Its framework wrapper output targets are useful for React/Vue but irrelevant here -- the target is Angular (which consumes standard custom elements natively) and Next.js (which also works with standard custom elements). Stencil's JSX templates would also be unfamiliar territory vs. Lit's tagged templates, which read like HTML.

**Why NOT Vanilla:** The body map component has significant state management needs (selected organs, active system, current view, gender toggle, modal state). Vanilla Web Components require manually implementing reactive properties, efficient re-rendering, and template updates. Lit provides all of this in 5KB. For a component with 10+ state variables and 30+ functions, the productivity gain is significant.

**Confidence:** MEDIUM -- Lit v3 is well-established and widely used. I was unable to verify the exact latest version via npm registry (WebFetch was restricted), but Lit 3.x has been stable since late 2023. The feature comparison is based on training data and MDN documentation.

---

## 2. Shadow DOM Strategy: Use Shadow DOM with Careful SVG Handling

**Recommendation:** Use **open Shadow DOM** for the component, with the SVG rendered directly inside the shadow root.

### Shadow DOM Benefits for This Project

1. **Style encapsulation is critical.** The component has ~1,200 lines of CSS. Without Shadow DOM, embedding this component in an Angular app or Next.js page would create style conflicts. The body map CSS uses generic selectors (`.left-column`, `h2`, `li a`, `p`) that would collide with host page styles.

2. **DOM encapsulation prevents accidental breakage.** The component relies on ~91 `getElementById` calls and ~37 `querySelectorAll` calls. Without Shadow DOM, a host page with conflicting IDs would break the component.

3. **Self-contained distribution.** Shadow DOM makes the component truly portable -- drop `<body-map-explorer>` into any page and it works.

### SVG Inside Shadow DOM: Confirmed Working

Per MDN documentation (verified), SVG elements work normally within shadow DOM trees:

```javascript
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
shadow.appendChild(svg);
```

SVG elements inherit the same encapsulation benefits. The `dir` and `lang` attributes inherit from the shadow host, which is desirable for this component.

### Known Shadow DOM Limitations to Handle

1. **`getElementById` does not cross shadow boundaries.** The current code's ~91 `getElementById` calls all need to be converted to `this.shadowRoot.getElementById()` or `this.renderRoot.querySelector()` (Lit's pattern). This is a mechanical refactor, not a design problem.

2. **External stylesheets cannot penetrate Shadow DOM.** Host page fonts and global resets will not apply inside the component. Solution: include the system font stack in the component's own styles (already done in the current CSS).

3. **SVG `<use>` references do not cross shadow boundaries.** If using SVG symbols/sprites, `<use href="#symbol-id">` will not find symbols defined outside the shadow root. Solution: keep all SVG definitions inside the shadow root.

4. **CSS custom properties DO cross shadow boundaries.** This is the recommended theming mechanism. Expose `--body-map-*` custom properties for host page theming:

```css
/* Inside component */
:host {
  --body-map-bg: var(--body-map-bg, #f5f5f5);
  --body-map-accent: var(--body-map-accent, #6cb5f4);
  --body-map-text: var(--body-map-text, #434448);
}
```

```css
/* Host page theming */
body-map-explorer {
  --body-map-bg: #1a1a2e;
  --body-map-accent: #e94560;
}
```

**Confidence:** HIGH -- Verified via MDN documentation that SVG works in Shadow DOM and that CSS custom properties cross the boundary.

---

## 3. Event Communication: CustomEvent with `composed: true`

**Recommendation:** Dispatch `CustomEvent` instances with `bubbles: true` and `composed: true` for all user-facing events.

Per MDN documentation (verified), the `composed` flag is what allows events to cross Shadow DOM boundaries:

```javascript
// Inside the component
this.dispatchEvent(
  new CustomEvent("body-part-selected", {
    detail: {
      partId: "bp_head",
      partName: "Head",
      organIds: ["brain"],
      systemId: "nervous",
    },
    bubbles: true,
    composed: true,
  }),
);
```

### Event API Design

| Event Name             | Detail Payload                                    | When Fired                   |
| ---------------------- | ------------------------------------------------- | ---------------------------- |
| `body-part-selected`   | `{ partId, partName, organIds }`                  | User selects a body part     |
| `body-part-deselected` | `{ partId, partName }`                            | User deselects a body part   |
| `system-selected`      | `{ systemId, systemTitle, organIds }`             | User selects a body system   |
| `system-deselected`    | `{ systemId }`                                    | User deselects a body system |
| `organ-clicked`        | `{ organId, organName, diseases, symptoms }`      | User clicks an organ         |
| `selection-changed`    | `{ selectedParts, selectedOrgans, activeSystem }` | Any selection state change   |

### Property/Attribute API Design

Use Lit's `@property` decorator for reactive attributes:

```javascript
// Attributes (string/boolean, set from HTML)
static properties = {
  gender: { type: String },          // 'male' | 'female'
  view: { type: String },            // 'organs' | 'sections'
  theme: { type: String },           // 'light' | 'dark'
  readonly: { type: Boolean },       // disable selection
};

// Properties (complex objects, set from JS)
selectedParts   // Set<string> - programmatically pre-select parts
diseasesData    // Object - inject disease data from API
symptomsData    // Object - inject symptom data from API
```

### Dual Data Mode Pattern

```html
<!-- Standalone: bundled data -->
<body-map-explorer></body-map-explorer>

<!-- Integrated: API-driven data -->
<body-map-explorer
  .diseasesData="${apiData.diseases}"
  .symptomsData="${apiData.symptoms}"
></body-map-explorer>
```

**Confidence:** HIGH -- CustomEvent with composed/bubbles verified via MDN.

---

## 4. Slot Strategy: Minimal Slots, Maximum Self-Containment

**Recommendation:** Use named slots sparingly for extensibility, not for core layout.

Per MDN documentation (verified), slots project external content into a Web Component. For this component, the core three-column layout should live entirely inside the shadow root, with slots for optional customization:

```html
<body-map-explorer>
  <!-- Optional: custom header above the body model -->
  <div slot="header">Custom Branding</div>

  <!-- Optional: custom footer below the body model -->
  <div slot="footer">Powered by HealthCo</div>

  <!-- Optional: custom action when organ is clicked -->
  <template slot="organ-detail">
    <a href="/tests?organ={{organId}}">Schedule a Test</a>
  </template>
</body-map-explorer>
```

**Why minimal slots:** The body map is a complex, tightly-coupled multi-panel UI. Breaking it into slots would create a fragile API where consumers need to understand internal layout assumptions. Keep the layout self-contained and use events + properties for integration.

**Confidence:** HIGH -- Slot patterns verified via MDN.

---

## 5. Component Internal Architecture

### Multi-Class Decomposition

Break the monolithic IIFE into Lit sub-components:

```
<body-map-explorer>          (main orchestrator)
  <body-map-sidebar>         (systems list + body parts nav)
  <body-map-model>           (SVG body model + view controls)
  <body-map-detail-panel>    (right-side system/organ details)
  <body-map-data-columns>    (diseases + symptoms lists)
  <body-map-modal>           (symptom selection overlay)
```

Each sub-component is a Lit element with its own shadow root, registered as a private custom element (e.g., `body-map-sidebar` -- consumers only interact with `body-map-explorer`).

### State Management: Lit Context Protocol or Simple Event Bus

For state shared across sub-components (selectedParts, activeSystem, currentView):

**Option A -- Lit Context (recommended):** Lit's `@lit/context` package provides a provider/consumer pattern purpose-built for Web Component trees. The top-level `<body-map-explorer>` provides context, children consume it.

```javascript
// In body-map-explorer (provider)
import { provide } from '@lit/context';

@provide({ context: bodyMapContext })
state = { selectedParts: new Set(), activeSystem: null };
```

**Option B -- Props-down-events-up:** Parent passes state as properties to children, children dispatch events up. Simpler but more boilerplate.

**Recommendation:** Start with props-down-events-up for simplicity. Migrate to Lit Context if prop drilling becomes painful (more than 3 levels deep is the threshold).

**Confidence:** MEDIUM -- Lit Context is part of the Lit ecosystem but I could not verify current API shape via Context7/WebFetch. Props-down-events-up is a standard pattern with HIGH confidence.

---

## 6. Build Tooling: Use Vite in Library Mode

**Recommendation:** Use **Vite** (v6.x) with `build.lib` configuration for building the Web Component for distribution.

### Why Vite

| Criterion         | Vite                                      | Rollup                                   | esbuild                     |
| ----------------- | ----------------------------------------- | ---------------------------------------- | --------------------------- |
| Dev server        | HMR with instant reload                   | None (need separate server)              | None (need separate server) |
| Library mode      | Built-in `build.lib`                      | Native (Vite uses Rollup under the hood) | No library mode             |
| Asset handling    | Inline + external thresholds              | Plugin required                          | Basic                       |
| Code splitting    | Automatic                                 | Manual configuration                     | Not supported               |
| TypeScript        | Built-in (esbuild for dev, tsc for types) | Plugin required                          | Native                      |
| Config complexity | Low (~20 lines for this project)          | Medium                                   | Low but limited             |

**Vite is the right choice because:**

1. It wraps Rollup for production builds, giving full Rollup plugin compatibility
2. Its dev server with HMR makes iterating on the component fast
3. `build.lib` mode outputs both ESM and UMD bundles with one config
4. It handles the asset inlining threshold natively (critical for this project's base64 images)
5. The `@nicholidev/vite-plugin-web-components` or similar can handle custom element bundling

### Vite Configuration for This Project

```javascript
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/body-map-explorer.js",
      name: "BodyMapExplorer",
      formats: ["es", "umd"],
      fileName: (format) => `body-map-explorer.${format}.js`,
    },
    rollupOptions: {
      // Lit is bundled in (not external) for zero-dep distribution
      // external: [],
    },
    // Inline assets smaller than 100KB as base64
    // Larger assets (organ PNGs) kept as separate files
    assetsInlineLimit: 100 * 1024,
  },
});
```

### Handling Large Static Assets (Multi-MB Data Files)

The 7.6MB `diseases-data.js` and 440KB `symptoms-data.js` need special handling:

**Strategy: Separate the data bundle from the component bundle.**

```
dist/
  body-map-explorer.es.js        # Component code (~50-80KB gzipped)
  body-map-explorer.umd.js       # UMD variant
  body-map-explorer.css           # (if extracted)
  data/
    diseases.json                 # 7.6MB (loaded on demand)
    symptoms.json                 # 440KB (loaded on demand)
    symptoms-by-bodypart.json     # 100KB (loaded on demand)
  assets/
    organs/                       # Extracted PNG files
      brain.png
      heart.png
      ...
```

**Why separate:**

- The component should load fast (~50-80KB) without waiting for 8MB of data
- Data can be lazy-loaded when the user first clicks an organ or searches
- In integrated mode (Next.js directory), data comes from the API, not bundled files
- Separate files can be cached independently by CDNs

**Confidence:** MEDIUM -- Vite's library mode is well-documented in training data and confirmed as a stable Vite feature. Exact v6 API shape was not verified via official docs.

---

## 7. NPM Package Publishing Pattern

### Package Structure

```
@bodypartdirectory/body-map-explorer/
  package.json
  dist/
    body-map-explorer.es.js      # ESM bundle (primary)
    body-map-explorer.umd.js     # UMD bundle (CDN/script tag)
    body-map-explorer.d.ts       # TypeScript declarations
    data/                        # Optional bundled data
  src/                           # Source (not published)
```

### package.json

```json
{
  "name": "@bodypartdirectory/body-map-explorer",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/body-map-explorer.umd.js",
  "module": "dist/body-map-explorer.es.js",
  "types": "dist/body-map-explorer.d.ts",
  "exports": {
    ".": {
      "import": "./dist/body-map-explorer.es.js",
      "require": "./dist/body-map-explorer.umd.js"
    },
    "./data/*": "./dist/data/*"
  },
  "files": ["dist"],
  "customElements": "custom-elements.json",
  "dependencies": {
    "lit": "^3.0.0"
  }
}
```

### Usage Patterns

```html
<!-- CDN / Script tag (standalone) -->
<script
  type="module"
  src="https://cdn.example.com/body-map-explorer.es.js"
></script>
<body-map-explorer></body-map-explorer>
```

```javascript
// Angular / Next.js (bundler)
import "@bodypartdirectory/body-map-explorer";
// Now <body-map-explorer> is available in templates
```

```javascript
// Angular-specific: add CUSTOM_ELEMENTS_SCHEMA
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

**Confidence:** HIGH -- NPM package publishing patterns are well-established and framework-agnostic Web Component consumption is proven.

---

## 8. Prior Art: Interactive Body Map Components

### Known Open-Source Projects

| Project                           | Technology | Approach                                        | Status              |
| --------------------------------- | ---------- | ----------------------------------------------- | ------------------- |
| `react-body-highlighter` (npm)    | React      | Pure SVG paths (no raster), click/hover regions | Active, React-only  |
| `@nicholidev/human-anatomy` (npm) | React      | SVG-based anatomy diagram                       | Unclear maintenance |
| `healthman` / body-map libs       | Various    | Vector SVG body outlines                        | Small/abandoned     |
| Biodigital Human                  | WebGL/3D   | Full 3D body model (commercial)                 | Commercial product  |
| Visible Body                      | WebGL/3D   | 3D anatomy atlas (commercial)                   | Commercial product  |

**Key insight from prior art:** Most open-source body map components use **pure vector SVG paths** (no raster images), which keeps bundle size tiny (~20-50KB). They are also React-specific, not Web Components. There is no established open-source Web Component for interactive anatomy maps.

**What this means for this project:**

- There is a genuine gap in the ecosystem -- a framework-agnostic Web Component body map does not exist
- The raster-image approach (PNGs from PSD layers) gives higher visual fidelity than vector-only alternatives
- The tradeoff is bundle size -- but extracting PNGs as separate files (see SVG_OPTIMIZATION.md) makes this manageable
- Consider publishing as open source eventually -- it would be the first serious Web Component body map

**Confidence:** LOW-MEDIUM -- I could not verify current npm package status via WebFetch. The projects listed are based on training data and may have changed. The claim that "no Web Component body map exists" needs validation.

---

## 9. Angular Integration Considerations

Since the existing production site is Angular, the Web Component must work seamlessly there:

1. **CUSTOM_ELEMENTS_SCHEMA** -- Angular needs this schema declaration to accept unknown element names without compiler errors
2. **Property binding** -- Angular's `[property]="value"` syntax works with Web Component properties
3. **Event binding** -- Angular's `(event)="handler($event)"` works with CustomEvent
4. **Two-way binding** -- Not automatic. Use `(selection-changed)` event + `[selectedParts]` property
5. **Zone.js** -- CustomEvents dispatched inside a Web Component do trigger Angular change detection if they cross the shadow boundary with `composed: true`

**Confidence:** HIGH -- Angular has had first-class Web Component support via `CUSTOM_ELEMENTS_SCHEMA` since Angular 2.

---

## 10. Development Workflow

### Recommended Dev Setup

```bash
# Initialize project
npm create vite@latest body-map-explorer -- --template vanilla-ts
cd body-map-explorer
npm install lit

# Dev dependencies
npm install -D typescript @custom-elements-manifest/analyzer

# Development
npm run dev      # Vite dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
```

### File Structure

```
body-map-explorer/
  src/
    body-map-explorer.ts         # Main component (orchestrator)
    components/
      body-map-sidebar.ts        # Systems + body parts panel
      body-map-model.ts          # SVG body model
      body-map-detail.ts         # Right detail panel
      body-map-data-columns.ts   # Disease/symptom lists
      body-map-modal.ts          # Symptom selection modal
    data/
      body-systems.ts            # BODY_SYSTEMS constant
      organ-mappings.ts          # ORGAN_TO_SYSTEM, etc.
      body-parts.ts              # BODY_PARTS_DATA
      highlight-regions.ts       # BODY_PART_HIGHLIGHT_REGIONS
    assets/
      organs/                    # Extracted PNG files
        brain.png
        heart.png
        ...
      body-silhouette.png        # Background layer
    styles/
      shared.ts                  # Shared CSS (Lit css tagged templates)
      theme.ts                   # CSS custom property definitions
    types/
      index.ts                   # TypeScript interfaces
    utils/
      svg-helpers.ts             # SVG coordinate conversion, etc.
      data-loader.ts             # Lazy data loading logic
  index.html                     # Dev harness
  vite.config.ts
  tsconfig.json
  package.json
  custom-elements-manifest.config.js
```

**Confidence:** HIGH -- Standard Vite + Lit project structure.

---

## Confidence Assessment

| Area                | Confidence  | Notes                                                           |
| ------------------- | ----------- | --------------------------------------------------------------- |
| Lit recommendation  | MEDIUM-HIGH | Well-established, but exact v3 latest not verified via npm      |
| Shadow DOM + SVG    | HIGH        | Verified via MDN documentation                                  |
| CustomEvent API     | HIGH        | Verified via MDN documentation                                  |
| Vite library mode   | MEDIUM      | Feature exists and is documented, exact v6 config not verified  |
| NPM publishing      | HIGH        | Standard patterns, well-established                             |
| Prior art           | LOW-MEDIUM  | Could not verify current state of open-source body map projects |
| Angular integration | HIGH        | CUSTOM_ELEMENTS_SCHEMA has been stable for years                |

---

## Sources

- MDN Web Components overview: https://developer.mozilla.org/en-US/docs/Web/API/Web_components (verified)
- MDN Shadow DOM guide: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM (verified)
- MDN Custom Elements guide: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements (verified)
- MDN CustomEvent: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent (verified)
- MDN Templates and Slots: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots (verified)
- Lit documentation: https://lit.dev/docs/ (training data, not verified in this session)
- Vite documentation: https://vitejs.dev/guide/ (training data, not verified in this session)
- Stencil documentation: https://stenciljs.com/docs/introduction (training data, not verified in this session)
