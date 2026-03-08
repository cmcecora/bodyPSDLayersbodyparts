# Interactive Body Model — Project Plan

## Current Asset Analysis

**Source file:** `blankaasd.psd` — 698×1698px, 20 layers
**Layers identified (front view):**

| # | Layer Name | Size | Notes |
|---|-----------|------|-------|
| 1 | Layer 1 (body silhouette) | 698×1698 | Base body outline, always visible |
| 2 | brain | 127×126 | |
| 3 | larynx trachea | 70×207 | |
| 4 | thyroid | 59×94 | |
| 5 | liver | 161×105 | |
| 6 | lungs (right) | 248×221 | First lungs layer |
| 7 | heart | 80×113 | |
| 8 | lungs (left) | 250×223 | Second lungs layer |
| 9 | knee joint | 68×152 | |
| 10 | gallbladder | 32×46 | |
| 11 | spleen | 57×52 | |
| 12 | pancreas | 95×70 | |
| 13 | kidneys | 161×78 | |
| 14 | stomach | 145×134 | |
| 15 | intestines | 252×255 | |
| 16 | muscle | 66×178 | |
| 17 | thymus | 35×46 | |
| 18 | bladder | 87×129 | |
| 19 | male reproductive | 103×145 | Hidden by default |
| 20 | female reproductive | 166×103 | Hidden by default |

---

## Phase 1: PSD → High-Quality SVG Conversion

**Goal:** Extract each layer from the PSD and convert into clean SVG paths/elements.

### Steps:

1. **Export each layer as a high-resolution PNG** with transparency preserved
   - Export at 2× original resolution for crisp rendering
   - Preserve exact positioning from the PSD canvas (layer offsets)

2. **Trace each PNG layer into SVG vector paths**
   - Use potrace/autotrace or manual vectorization for clean outlines
   - Alternatively: embed high-res PNGs inside SVG `<image>` tags (faster, retains original art quality perfectly)
   - Decision point: **pure vector vs. embedded raster** — pure vector gives smaller files and infinite scalability but may lose artistic detail; embedded raster preserves the exact PSD look

3. **Assemble a single master SVG file**
   - Set viewBox to `0 0 698 1698` to match the PSD canvas
   - Each body part becomes a named `<g>` group (e.g., `<g id="brain">`)
   - Position each element using the original PSD layer offsets
   - Layer 1 (body silhouette) becomes the non-interactive background

4. **Create clickable hit areas**
   - For each body part, generate a transparent `<path>` or `<polygon>` overlay that defines the clickable/hoverable region
   - These hit areas should closely follow the shape of each organ
   - This is critical — without proper hit areas, hover/click won't feel natural

**Deliverable:** A single SVG file with all body parts as named, individually-targetable groups.

---

## Phase 2: Interactive Hover & Selection Behavior

**Goal:** Implement mouse hover highlighting and click-to-select toggling.

### Hover behavior:
- On mouse enter → apply a medium-light blue highlight overlay (`rgba(100, 180, 255, 0.4)` or similar CSS filter)
- On mouse leave → if the part is NOT selected, remove the highlight
- On mouse leave → if the part IS selected, keep the highlight (selected state)
- Implementation options:
  - **CSS filter approach:** `filter: brightness(1.1) drop-shadow(0 0 8px #64b5f6)` on hover
  - **SVG overlay approach:** duplicate the path with a blue fill at reduced opacity
  - **CSS mix-blend-mode:** overlay a blue tint layer

### Click/select behavior:
- Click on an unselected part → mark it as "selected," apply persistent blue highlight
- Click on a selected part → deselect it, remove highlight
- Multiple parts can be selected simultaneously
- Selected state uses a slightly stronger blue than hover (e.g., `rgba(66, 165, 245, 0.5)`)

### Accessibility & UX:
- Cursor changes to `pointer` on hoverable areas
- Optional: show the body part name as a tooltip on hover
- Smooth CSS transitions for highlight appearance/disappearance (~200ms)

**Deliverable:** Fully interactive SVG with hover glow and click-to-toggle selection.

---

## Phase 3: Front/Back View Rotation

**Goal:** Add a toggle link below the model to flip between front and back views.

### Important note:
> The current PSD (`blankaasd.psd`) contains **only front-facing layers**. A back-view PSD/image is needed for this feature to work fully.

### Implementation plan:
1. **Create a "Rotate Model" link/button** positioned below the SVG with appropriate padding
2. **On click**, perform a smooth 180° Y-axis CSS 3D rotation (`transform: rotateY(180deg)`)
3. **During the rotation midpoint (90°)**, swap the SVG content from front layers to back layers
4. **The back view SVG** would follow the same structure — named groups, hit areas, hover/select behavior
5. Both views share the same selection state if desired (e.g., selecting "lungs" on front also highlights the corresponding back area)

### CSS 3D flip technique:
```css
.body-model-container {
  perspective: 1000px;
}
.body-model {
  transition: transform 0.6s ease-in-out;
  transform-style: preserve-3d;
}
.body-model.flipped {
  transform: rotateY(180deg);
}
```

### Fallback if no back-view asset exists:
- Show the same silhouette mirrored (CSS `scaleX(-1)`) as a placeholder
- Display a message: "Back view coming soon"

**Deliverable:** Rotation toggle with smooth 3D flip animation.

---

## Phase 4: Responsive & Scalable Layout

**Goal:** Ensure the body model looks and behaves identically from mobile to large desktop.

### Approach:
1. **SVG viewBox scaling** — the SVG uses `viewBox="0 0 698 1698"` with `width="100%" height="auto"`, so it scales naturally to any container
2. **Container CSS:**
   ```css
   .body-model-wrapper {
     max-width: 400px;      /* sensible max on desktop */
     width: 100%;            /* scales down on mobile */
     margin: 0 auto;         /* centered */
   }
   ```
3. **Touch support** — hover effects also work as tap-to-highlight on mobile (using `touchstart`/`touchend` events)
4. **Hit area sizing** — all click targets remain proportional since they're inside the SVG viewBox
5. **Test at breakpoints:** 320px, 375px, 768px, 1024px, 1440px
6. **Rotate link** stays directly below the SVG at all sizes with consistent padding

**Deliverable:** Fully responsive component that works identically across all screen sizes.

---

## Phase 5: Polish & Delivery

**Goal:** Final QA, optimization, and delivery of production-ready files.

### Steps:
1. **Optimize SVG** — minimize file size (SVGO), remove unnecessary metadata
2. **Cross-browser testing** — Chrome, Firefox, Safari, Edge
3. **Performance audit** — ensure smooth 60fps hover animations
4. **Code cleanup** — well-commented HTML/CSS/JS, semantic class names
5. **Deliver final package:**
   - `index.html` — standalone demo page
   - `body-model.svg` — the SVG asset (front view)
   - `body-model-back.svg` — back view SVG (when available)
   - `styles.css` — all styling
   - `interaction.js` — hover/click/rotation logic
   - Or: a single self-contained `.html` file with everything inline

---

## Decision Points Needed From You

1. **Vector tracing vs. embedded raster?**
   - **Option A (Recommended):** Embed the original PSD artwork as high-res images inside SVG, with vector hit-area overlays for interaction. Preserves exact visual quality.
   - **Option B:** Full vector trace of every layer. Infinite scalability but may lose artistic detail/gradients.

2. **Back view asset:** Do you have a back-view PSD? If not, should I create a placeholder/mirrored version, or skip the rotation feature for now?

3. **Male/female reproductive toggle:** The PSD has both (male visible, female hidden). Should the interactive version include a toggle between them, show one by default, or exclude both?

4. **Tooltip labels:** Should hovering show the body part name (e.g., "Heart", "Lungs") as a floating label?

5. **Selection output:** When parts are selected, should the page expose the selection somewhere (e.g., a list of selected body parts below the model)?
