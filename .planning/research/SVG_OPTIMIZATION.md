# SVG Optimization & Asset Strategy

**Project:** Body Map Explorer
**Researched:** 2026-03-29
**Overall confidence:** MEDIUM-HIGH (MDN verified + established performance patterns)

---

## 1. The Core Problem: 3.87 MB HTML with 66 Base64 Images

The current `interactive-body-model.html` embeds 66 base64-encoded PNG references (17 organ layers + 11 system thumbnails + body silhouette + hit area paths + section overlays + additional images) inside the SVG. This creates several compounding problems:

1. **33% size inflation.** Base64 encoding inflates binary data by ~33%. A 100KB PNG becomes ~133KB as base64 text.
2. **No independent caching.** All images are part of one HTML document. If any code changes, the browser re-downloads all 3.87 MB.
3. **No parallel loading.** The browser cannot start decoding images until it has parsed the entire HTML document containing them.
4. **Memory pressure.** All 66 images must be decoded and held in memory simultaneously, even if only some organs are visible.
5. **Blocked rendering.** The SVG cannot render incrementally -- it waits for the full document parse.

**Total current payload breakdown:**

| Content                          | Approximate Size | Notes                                        |
| -------------------------------- | ---------------- | -------------------------------------------- |
| CSS (inline)                     | ~45 KB           | 1,277 lines                                  |
| HTML structure                   | ~15 KB           | Layout, panels                               |
| SVG paths (hit areas + sections) | ~30 KB           | Vector data                                  |
| Base64 organ PNGs (17)           | ~2.5 MB          | The bulk of the file                         |
| Base64 system thumbnails (11)    | ~800 KB          | Sidebar icons                                |
| Inline JS (constants + logic)    | ~500 KB          | BODY_SYSTEMS data includes base64 thumbnails |
| **Total HTML**                   | **~3.87 MB**     |                                              |
| External JS data files           | ~8.0 MB          | diseases + symptoms                          |
| **Total page weight**            | **~12 MB**       |                                              |

---

## 2. Primary Recommendation: Extract PNGs as Separate Files

**Extract all base64-encoded PNGs into separate `.png` files and reference them via `href` attributes.**

### Before (current)

```xml
<image class="part-image"
  x="220" y="50" width="260" height="200"
  href="data:image/png;base64,iVBORw0KGgo...{50KB of base64}..." />
```

### After (recommended)

```xml
<image class="part-image"
  x="220" y="50" width="260" height="200"
  href="assets/organs/brain.png" />
```

### Benefits

| Metric             | Base64 Inline            | External Files                        |
| ------------------ | ------------------------ | ------------------------------------- |
| HTML file size     | ~3.87 MB                 | ~100 KB (est.)                        |
| Browser caching    | None (one blob)          | Each PNG cached independently         |
| Parallel loading   | No                       | Yes (6+ concurrent requests)          |
| First paint        | After full parse         | Progressive                           |
| Size overhead      | +33% per image           | Raw binary                            |
| Cache invalidation | Any change = full reload | Only changed files reload             |
| CDN optimization   | Not possible             | Per-file CDN caching, WebP conversion |

### Why This Specifically Matters for a Web Component

When `<body-map-explorer>` is embedded in a host page, the component's JS bundle should be small (~50-80KB). If base64 images are embedded in the component code, every import of the component downloads megabytes of image data. External files are loaded only when the component renders.

### Implementation

The `bpart_images/` directory already contains 86 extracted PNG files. The organ images used in the SVG can be sourced from there:

```
assets/organs/
  brain.png
  heart.png
  lungs-left.png
  lungs-right.png
  liver.png
  stomach.png
  intestines.png
  kidneys.png
  gallbladder.png
  spleen.png
  pancreas.png
  thyroid.png
  thymus.png
  bladder.png
  larynx-trachea.png
  knee-joint.png
  muscle.png
  male-reproductive.png
  female-reproductive.png
  body-silhouette.png
```

**Confidence:** HIGH -- This is a well-established web performance best practice verified by MDN documentation on SVG `<image>` elements.

---

## 3. Consider WebP/AVIF Conversion

**Recommendation:** Convert PNGs to WebP for ~60-80% file size reduction with no visible quality loss for this type of medical illustration.

| Format | Typical Size vs PNG | Browser Support            | Transparency |
| ------ | ------------------- | -------------------------- | ------------ |
| PNG    | Baseline            | Universal                  | Yes          |
| WebP   | 25-40% of PNG       | 97%+ (all modern browsers) | Yes          |
| AVIF   | 15-30% of PNG       | ~93% (growing)             | Yes          |

**Strategy:** Ship WebP as primary with PNG fallback. Use the `<picture>` element pattern or, inside SVG, use JavaScript to detect WebP support and set `href` accordingly:

```javascript
// In the Web Component
const supportsWebP = document
  .createElement("canvas")
  .toDataURL("image/webp")
  .startsWith("data:image/webp");

const ext = supportsWebP ? "webp" : "png";
imageEl.setAttribute("href", `assets/organs/brain.${ext}`);
```

Alternatively, since the Web Component controls all image loading, simply use WebP everywhere -- the 3% of browsers that do not support it are old enough that the component likely has other issues there anyway.

**Estimated savings:**

| Content              | PNG Size    | WebP Size (est.)     | Savings     |
| -------------------- | ----------- | -------------------- | ----------- |
| 17 organ PNGs        | ~2.5 MB     | ~600-800 KB          | ~1.7 MB     |
| 11 system thumbnails | ~800 KB     | ~200-300 KB          | ~500 KB     |
| Body silhouette      | ~200 KB     | ~50-80 KB            | ~120 KB     |
| **Total images**     | **~3.5 MB** | **~850 KB - 1.2 MB** | **~2.3 MB** |

**Confidence:** HIGH -- WebP support data and size reduction ratios are well-documented.

---

## 4. SVG Hit Area Optimization

The current app uses `<path class="hit-area">` elements with transparent fill overlaying each organ image. This is the correct approach and should be preserved.

### Current Pattern (keep)

```xml
<g class="body-part-group" data-part="brain" data-name="Brain">
  <image class="part-image" x="220" y="50" width="260" height="200"
    href="assets/organs/brain.png" />
  <path class="hit-area" fill="transparent"
    d="M280,80 L390,80 L410,120 L400,170 L370,200 L290,200 L260,170 L250,120 Z" />
</g>
```

### Hit Area Best Practices

1. **Keep paths simple.** A polygon with 6-12 vertices is sufficient for click detection. Do not trace the exact organ outline -- users expect some margin of error. The current ~8-vertex polygons are appropriate.

2. **Use `pointer-events: all` on hit areas.** This ensures clicks register even on the transparent fill:

```css
.hit-area {
  fill: transparent;
  stroke: none;
  pointer-events: all;
  cursor: pointer;
}
```

3. **Do NOT use `pointer-events: none` on the image layer.** Instead, let the hit area sit on top (later in SVG stacking order) and handle all events there. The image should have `pointer-events: none` so clicks pass through to the hit area.

```css
.part-image {
  pointer-events: none; /* Let hit-area handle clicks */
}
```

4. **Consider CSS `clip-path` for highlight effects** instead of overlay rectangles. This allows the highlight to conform to the organ shape without additional SVG elements:

```css
.body-part-group.selected .part-image {
  filter: brightness(1.3) drop-shadow(0 0 8px rgba(100, 180, 255, 0.6));
}
```

The current approach using CSS `filter: drop-shadow()` and fill overlays is reasonable. Drop-shadow filters are GPU-accelerated on modern browsers and perform well with 20 layers.

**Confidence:** HIGH -- Standard SVG interaction patterns.

---

## 5. SVG Rendering Performance with 20+ Layers

### Current State Assessment

20 raster image layers inside one SVG is well within browser performance limits. SVG renderers handle hundreds of elements efficiently. The performance bottleneck in this project is **not SVG rendering** -- it is:

1. **Initial payload size** (12 MB) causing slow first load
2. **Synchronous data file parsing** (7.6 MB `diseases-data.js` blocks the main thread for ~300-500ms)
3. **DOM re-rendering** (full innerHTML rebuilds on state changes)

### Optimizations Worth Implementing

**A. Lazy-load organ images below the fold.**

The SVG viewport is 698x1698px. Organs below the fold (intestines, bladder, knee joint, reproductive organs at y > ~600px) do not need to load immediately:

```javascript
// Use Intersection Observer on organ groups
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector(".part-image");
        img.setAttribute("href", img.dataset.src);
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "200px" },
); // 200px ahead of viewport

document
  .querySelectorAll(".body-part-group")
  .forEach((g) => observer.observe(g));
```

Per MDN documentation (verified), Intersection Observer works with SVG elements that are rendered in the page viewport.

Note: The native `loading="lazy"` attribute on `<img>` does NOT apply to SVG `<image>` elements (confirmed via MDN -- only `<img>`, `<iframe>`, `<video>`, `<audio>` support it). Intersection Observer is the correct approach for SVG images.

**B. Use CSS `contain: layout style paint` on the SVG container.**

Per MDN documentation (verified), CSS containment tells the browser that the contained element's layout/style/paint does not affect the rest of the page:

```css
.body-model-container {
  contain: layout style paint;
}
```

This allows the browser to optimize rendering by not recalculating the entire page when SVG elements change state (hover, selection).

**C. Use `will-change` sparingly for animated elements.**

```css
.body-part-group .hit-area {
  will-change: fill, opacity; /* Only on elements that animate */
}
```

Do NOT apply `will-change` to all 20 organ groups -- this creates 20 compositor layers and wastes GPU memory. Apply it only to the currently hovered element via JavaScript.

**D. Avoid SVG filter stacking.**

The current CSS applies `filter: drop-shadow(...)` on hover. Drop-shadow filters are fast for individual elements but expensive when many are active simultaneously. If the user selects an entire body system (e.g., all 4 digestive organs), having 4 drop-shadow filters is fine. But avoid stacking filters on 15+ elements simultaneously.

**Confidence:** HIGH -- Standard web performance patterns, Intersection Observer verified via MDN, CSS containment verified via MDN.

---

## 6. SVG Structure Optimization for the Web Component

### Recommended SVG Architecture

```xml
<svg viewBox="0 0 698 1698" xmlns="http://www.w3.org/2000/svg">
  <!-- Layer 0: Background silhouette (not interactive) -->
  <image href="assets/body-silhouette.png"
    x="0" y="0" width="698" height="1698"
    class="silhouette" />

  <!-- Layer 1: Organ images (raster, non-interactive) -->
  <g id="organ-images">
    <image data-organ="brain" href="assets/organs/brain.png"
      x="220" y="50" width="260" height="200"
      class="part-image" style="pointer-events:none" />
    <!-- ... other organs ... -->
  </g>

  <!-- Layer 2: Highlight overlays (dynamically shown/hidden) -->
  <g id="highlight-layer" style="pointer-events:none">
    <!-- Filled when organs are selected -->
  </g>

  <!-- Layer 3: Body part ellipse highlights (sections view) -->
  <g id="bp-highlight-layer" style="pointer-events:none">
    <!-- Filled when body parts are selected -->
  </g>

  <!-- Layer 4: Hit areas (top layer, captures all clicks) -->
  <g id="hit-areas">
    <path data-organ="brain" d="M280,80..." class="hit-area" />
    <!-- ... other hit areas ... -->
  </g>

  <!-- Layer 5: Section hit areas (sections view, toggled) -->
  <g id="section-hit-areas" style="display:none">
    <path data-section="head_neck" d="M..." class="section-hit-area" />
    <!-- ... other sections ... -->
  </g>
</svg>
```

**Key changes from current architecture:**

1. **Separate image and hit-area layers.** Currently each organ group contains both `<image>` and `<path>`. Separating them into layers allows the hit-area layer to always be on top without z-index management.

2. **Use `data-*` attributes instead of wrapping `<g>` groups.** Reduces DOM depth and simplifies queries. Instead of `querySelector('.body-part-group[data-part="brain"] .hit-area')`, use `querySelector('.hit-area[data-organ="brain"]')`.

3. **Single event delegation on the hit-areas group** instead of individual listeners on each path:

```javascript
this.shadowRoot.querySelector("#hit-areas").addEventListener("click", (e) => {
  const hitArea = e.target.closest(".hit-area");
  if (!hitArea) return;
  const organId = hitArea.dataset.organ;
  this.handleOrganClick(organId);
});
```

This reduces from ~17 event listeners to 1, improving memory usage and simplifying cleanup.

**Confidence:** HIGH -- Standard SVG layering and event delegation patterns.

---

## 7. Data Loading Strategy

### Problem: 8 MB of Data Files

The current architecture loads all data synchronously at page load:

```html
<script src="symptoms-data.js"></script>
<!-- 440 KB -->
<script src="diseases-data.js"></script>
<!-- 7.6 MB -->
<script src="symptoms-by-bodypart-data.js"></script>
<!-- 100 KB -->
```

This blocks rendering for 300-500ms (or seconds on mobile) while parsing 8 MB of JavaScript.

### Solution: Lazy-Load Data on Demand

**Phase 1: Move to JSON + dynamic import**

```javascript
// In the Web Component
async loadDiseaseData(bodyPartId) {
  if (!this._diseasesData) {
    const response = await fetch(this.resolveAssetPath('data/diseases.json'));
    this._diseasesData = await response.json();
  }
  return this._diseasesData[bodyPartId] || [];
}
```

Data is loaded only when the user first interacts with an organ that needs it. Subsequent lookups use the cached data.

**Phase 2: Split data by body part**

Instead of one 7.6 MB file, split into per-body-part JSON files:

```
data/diseases/
  bp_head.json      (~100 KB)
  bp_heart.json     (~80 KB)
  bp_lungs.json     (~120 KB)
  ...
```

This way, only the data for selected body parts is ever loaded. Most users will only explore 2-5 body parts per session.

**Phase 3: API integration mode**

In the Next.js directory context, data comes from the database via API:

```javascript
// Consumer provides a data fetcher
<body-map-explorer
  .dataFetcher=${async (partId) => {
    const res = await fetch(`/api/body-parts/${partId}/diseases`);
    return res.json();
  }}
></body-map-explorer>
```

### Asset Path Resolution

The Web Component needs to know where its assets are relative to the host page. Use `import.meta.url` for reliable path resolution:

```javascript
class BodyMapExplorer extends LitElement {
  static assetBase = new URL("./assets/", import.meta.url).href;

  resolveAssetPath(relativePath) {
    return new URL(relativePath, BodyMapExplorer.assetBase).href;
  }
}
```

This works whether the component is loaded from a CDN, a local dev server, or bundled into another app.

**Confidence:** MEDIUM-HIGH -- Dynamic import and fetch patterns are standard. `import.meta.url` for asset resolution is a well-known pattern for Web Components but exact behavior across all bundlers should be tested.

---

## 8. Image Optimization Pipeline

### Build-Time Optimization

Add an image optimization step to the build:

```bash
# In package.json scripts
"optimize-images": "sharp-cli --input src/assets/organs/*.png --output dist/assets/organs/ --webp --quality 85"
```

Or use Vite's built-in asset handling:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    assetsInlineLimit: 4096, // Only inline < 4KB (e.g., tiny icons)
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
```

### Recommended Image Processing

| Image Type                | Current Format             | Recommended                       | Optimization                          |
| ------------------------- | -------------------------- | --------------------------------- | ------------------------------------- |
| Organ images (17)         | PNG base64 inline          | WebP external files               | lossy 85% quality, ~70% smaller       |
| System thumbnails (11)    | PNG base64 inline          | WebP external files, or SVG icons | Replace with vector if possible       |
| Body silhouette (1)       | PNG base64 inline          | WebP external file                | lossy 90% quality                     |
| Body part nav images (86) | PNG files in bpart_images/ | WebP + resize to display size     | Many are likely larger than displayed |

### System Thumbnail Alternative: Replace with SVG Icons

The 11 system thumbnails are currently base64 PNGs (~800 KB total). These are small icons (32x32px display) showing simplified body system diagrams. Consider replacing them with inline SVG icons:

- SVG icons would be ~1-2 KB each (11-22 KB total vs 800 KB)
- Scale perfectly at any resolution
- Can be colored via CSS custom properties to match system colors
- Can be included directly in the component JS bundle

This is a design decision that depends on whether the current thumbnails' visual fidelity is important. If they are simple silhouettes, SVG replacement is strongly recommended.

**Confidence:** MEDIUM -- Image optimization tooling and WebP conversion are established practices. The specific Vite/sharp configuration may need adjustment based on actual image content.

---

## 9. CSS Optimization for SVG Interactions

### Current CSS Overhead

The component has ~1,277 lines of CSS. Key SVG-related styles:

```css
/* Hover state */
.body-part-group:hover .hit-area {
  fill: rgba(100, 180, 255, 0.35);
}
.body-part-group:hover .part-image {
  filter: drop-shadow(0 0 6px rgba(100, 180, 255, 0.5));
}

/* Selected state */
.body-part-group.selected .hit-area {
  fill: rgba(100, 180, 255, 0.5);
}
```

### Recommendations

1. **Use CSS custom properties for all colors** to enable theming:

```css
:host {
  --bm-hover-fill: rgba(100, 180, 255, 0.35);
  --bm-selected-fill: rgba(100, 180, 255, 0.5);
  --bm-highlight-shadow: rgba(100, 180, 255, 0.5);
}

.hit-area:hover {
  fill: var(--bm-hover-fill);
}
```

2. **Use Lit's `css` tagged template for scoped styles:**

```javascript
import { css } from 'lit';

static styles = css`
  :host {
    display: block;
    contain: layout style paint;
  }
  .hit-area {
    fill: transparent;
    pointer-events: all;
    cursor: pointer;
    transition: fill 0.15s ease;
  }
`;
```

3. **Adopt Constructable Stylesheets** (used automatically by Lit):

Instead of `<style>` elements in each shadow root, Lit uses `adoptedStyleSheets` which share a single parsed stylesheet across all instances of the component. This is more memory-efficient if multiple `<body-map-explorer>` instances exist on a page (unlikely but good practice).

**Confidence:** HIGH -- Standard CSS-in-JS patterns for Web Components, verified via MDN Shadow DOM documentation.

---

## 10. Performance Budget

### Target Metrics

| Metric                         | Current               | Target          | How                        |
| ------------------------------ | --------------------- | --------------- | -------------------------- |
| Component JS bundle            | ~3.87 MB (everything) | < 80 KB gzipped | Extract images + data      |
| First Contentful Paint         | ~3-5s (est.)          | < 1s            | Lazy data, external images |
| Time to Interactive            | ~5-8s (est.)          | < 2s            | Lazy data loading          |
| Total images payload           | ~3.5 MB (base64)      | < 1 MB (WebP)   | WebP conversion            |
| Data payload (initial)         | ~8 MB (all at once)   | 0 KB (lazy)     | Load on demand             |
| Data payload (per organ click) | 0 (already loaded)    | ~100-200 KB     | Per-body-part JSON         |
| Memory (idle)                  | ~50 MB (est.)         | < 20 MB         | Lazy image decode          |

### Monitoring

Use Web Component-friendly performance monitoring:

```javascript
connectedCallback() {
  super.connectedCallback();
  performance.mark('body-map-connected');
}

firstUpdated() {
  performance.mark('body-map-rendered');
  performance.measure('body-map-init', 'body-map-connected', 'body-map-rendered');
}
```

**Confidence:** MEDIUM -- Targets are estimated based on typical web performance benchmarks. Actual measurements needed after implementation.

---

## Confidence Assessment

| Area                             | Confidence  | Notes                                                            |
| -------------------------------- | ----------- | ---------------------------------------------------------------- |
| Extract base64 to files          | HIGH        | MDN verified, established best practice                          |
| WebP conversion                  | HIGH        | Universal browser support, well-documented savings               |
| Hit area patterns                | HIGH        | Standard SVG interaction model                                   |
| Intersection Observer for SVG    | HIGH        | Verified via MDN                                                 |
| CSS containment                  | HIGH        | Verified via MDN                                                 |
| Data lazy loading                | MEDIUM-HIGH | Patterns are standard, exact implementation details need testing |
| import.meta.url asset resolution | MEDIUM      | Well-known pattern but bundler behavior varies                   |
| Performance budget targets       | MEDIUM      | Estimates, need real measurement                                 |
| System thumbnail SVG replacement | LOW-MEDIUM  | Design decision, depends on visual requirements                  |

---

## Sources

- MDN SVG Image element: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag (verified)
- MDN Lazy Loading: https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading (verified)
- MDN CSS Containment: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment (verified)
- MDN Shadow DOM: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM (verified)
- Codebase analysis: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`, `.planning/codebase/STACK.md` (primary source)
