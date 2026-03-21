# Three-Column Body Model Merge — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a body systems sidebar (left) and tooltip detail panel (right) from the Anne project into the existing interactive body model, with bidirectional organ-to-system linking.

**Architecture:** Single-file vanilla JS app. New HTML sections for systems panel and tooltip panel inserted into existing `interactive-body-model.html`. New CSS added to existing style block. New JS added to existing script block. Thumbnail images base64-encoded inline.

**Tech Stack:** HTML5, CSS3 (flexbox), vanilla JavaScript. No external dependencies.

---

### Task 1: Base64-encode thumbnail images

**Files:**

- Read: `/Volumes/LaCie/Downloads_MacbookPro2025/body-systems-interactive-map-master/images/{cardiovascular,digestive,endocrine,immune,integumentary,muscular,nervous,reproductive,respiratory,skeletal,urinary}.png`
- Create: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/thumbnails-base64.txt` (temporary reference file)

**Step 1: Generate base64 strings for all 11 thumbnails**

Run:

```bash
for f in cardiovascular digestive endocrine immune integumentary muscular nervous reproductive respiratory skeletal urinary; do
  echo "=== $f ==="
  base64 -i "/Volumes/LaCie/Downloads_MacbookPro2025/body-systems-interactive-map-master/images/${f}.png" | tr -d '\n'
  echo ""
done > /Users/chriscecora/Downloads/bodyPSDLayersbodyparts/thumbnails-base64.txt
```

**Step 2: Verify the file was created**

Run: `wc -l /Users/chriscecora/Downloads/bodyPSDLayersbodyparts/thumbnails-base64.txt`
Expected: 22 lines (11 labels + 11 base64 strings)

---

### Task 2: Update CSS — Three-column layout and systems panel

**Files:**

- Modify: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/interactive-body-model.html` (the style block, lines 7-336)

**Step 1: Update `.page-layout` for three columns**

Change existing `.page-layout` CSS from max-width 900px to 1100px.

**Step 2: Add new CSS for left column wrapper and systems panel**

Insert BEFORE the existing `.body-parts-panel` styles:

```css
.left-column {
  flex: 0 0 260px;
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.systems-panel {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.systems-panel h2 {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #434448;
  margin: 0;
  padding: 12px 16px;
  border-bottom: 2px solid #6cb5f4;
}
.systems-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.systems-list li {
  border-bottom: 1px solid #f0f0f0;
}
.systems-list li:last-child {
  border-bottom: none;
}
.systems-list li a {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  text-decoration: none;
  color: #434448;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s ease;
  cursor: pointer;
}
.systems-list li a:hover {
  background: #f5f8fc;
}
.systems-list li.active a {
  background: #eef4fb;
  font-weight: 600;
}
.systems-list li .system-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
}
.systems-list li .system-thumb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
  object-fit: cover;
}
```

**Step 3: Simplify `.body-parts-panel`**

Remove sticky positioning and flex sizing since it now lives inside `.left-column`.

**Step 4: Add CSS for `.tooltip-panel` (right column)**

```css
.tooltip-panel {
  flex: 0 0 300px;
  position: sticky;
  top: 20px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0;
  min-height: 200px;
  overflow: hidden;
  position: relative;
}
.tooltip-panel-empty {
  color: #999;
  font-size: 13px;
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
}
.tooltip-panel-content {
  display: none;
  padding: 20px;
}
.tooltip-panel-content.visible {
  display: block;
}
.tooltip-panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.tooltip-panel-thumb {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
  object-fit: cover;
}
.tooltip-panel-title {
  font-size: 20px;
  font-weight: 600;
  color: #434448;
  margin: 0;
  line-height: 1.3;
}
.tooltip-panel-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: #e8e8e8;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.tooltip-panel-close:hover {
  background: #ff6b6b;
  color: #fff;
}
.tooltip-panel-description {
  font-size: 13px;
  line-height: 20px;
  color: #434448;
}
.tooltip-panel-system-bar {
  height: 4px;
  width: 100%;
}
```

**Step 5: Update mobile responsive CSS**

Change breakpoint from 700px to 900px. Add rules for `.left-column` and `.tooltip-panel` to go full width and lose sticky positioning.

**Step 6: Verify in browser, then commit**

```bash
git add interactive-body-model.html
git commit -m "style: add three-column layout CSS for systems panel and tooltip"
```

---

### Task 3: Add HTML structure — Systems panel, left column wrapper, tooltip panel

**Files:**

- Modify: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/interactive-body-model.html` (body HTML around lines 385-396 and after line 1342)

**Step 1: Wrap existing body-parts-panel in new left-column div, add systems panel above it**

Replace the opening of `.page-layout` through the end of `.body-parts-panel` with a new `.left-column` wrapper containing:

1. New `.systems-panel` with `h2` header and empty `ul#systemsList`
2. Existing `.body-parts-panel` (unchanged content, just nested deeper)

**Step 2: Add tooltip panel after `.body-model-container` closing div**

Insert before the closing of `.page-layout`:

- `div.tooltip-panel#tooltipPanel` containing:
  - `div.tooltip-panel-system-bar#tooltipSystemBar` (colored accent bar)
  - `p.tooltip-panel-empty#tooltipEmpty` with placeholder text
  - `div.tooltip-panel-content#tooltipContent` with close button, header (thumb + title), and description paragraph

**Step 3: Verify in browser, then commit**

```bash
git add interactive-body-model.html
git commit -m "feat: add systems panel and tooltip panel HTML structure"
```

---

### Task 4: Add JavaScript — BODY_SYSTEMS data, sidebar rendering, bidirectional linking

**Files:**

- Modify: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/interactive-body-model.html` (script block)

**Step 1: Add BODY_SYSTEMS data constant**

Insert at the top of the IIFE (right after `(function () {`). Array of 11 objects, each with: id, title, color, thumbnail (base64 data URI from Task 1), description (from anne-copy-2.html), organs (array of body model organ IDs).

Also add reverse lookup map `ORGAN_TO_SYSTEM` (built by iterating BODY_SYSTEMS) and `activeSystem` state variable.

**Step 2: Add renderSystemsSidebar() function**

Uses DOM creation methods (createElement, appendChild) to populate `#systemsList`. Each list item gets a colored dot, thumbnail image, and system name. Click handler calls `selectSystem(sys.id)`.

**Step 3: Add showTooltip(systemId) and hideTooltip() functions**

`showTooltip`: Sets `textContent` for title and description, sets `src` for thumbnail, sets background color on system bar, shows content div, hides empty message.

`hideTooltip`: Reverses — hides content, shows empty message, clears bar color.

**Step 4: Add selectSystem(systemId) and deselectSystem() functions**

`selectSystem`:

- If same system clicked, calls deselectSystem and returns (toggle behavior)
- Deselects previous system's organs (removes `.selected` class, deletes from `selectedOrgans` set)
- Sets `activeSystem`, adds `.selected` to all mapped organ groups, adds to `selectedOrgans` set
- Respects gender toggle (skips hidden reproductive organs)
- Updates sidebar `.active` class
- Calls `showTooltip()` and `renderSelectedList()`

`deselectSystem`:

- Removes `.selected` from all current system's organs
- Clears `activeSystem`, removes `.active` from all sidebar items
- Calls `hideTooltip()` and `renderSelectedList()`

**Step 5: Add updateSystemFromOrgan(organId) bridge function**

Called after the existing organ click handler's selection logic:

- Looks up system IDs via `ORGAN_TO_SYSTEM[organId]`
- If organ was just deselected: checks if any organs from active system remain selected; if not, deselects system
- If organ was just selected: activates first matching system, updates sidebar and tooltip

**Step 6: Wire bridge into existing organ click handler**

Find the existing click handler for `.body-part-group .hit-area` (around line 1476). After the existing `selectedOrgans.add(partId)` or `selectedOrgans.delete(partId)` logic, add call to `updateSystemFromOrgan(partId)`.

**Step 7: Add tooltip close handler and initial render call**

At the end of the IIFE:

- `tooltipClose` click listener calls `deselectSystem()`
- Call `renderSystemsSidebar()` to populate on page load

**Step 8: Full browser test**

Verify:

- Systems sidebar lists all 11 systems with dots and thumbnails
- Click system highlights mapped organs, shows tooltip
- Click organ activates corresponding system + tooltip
- Toggle behavior (click again to deselect)
- Tooltip close button works
- Pill list still works below systems menu
- Gender toggle respects reproductive system
- View toggle and rotate still work
- No console errors

**Step 9: Commit**

```bash
git add interactive-body-model.html
git commit -m "feat: add body systems data, sidebar rendering, and bidirectional organ linking"
```

---

### Task 5: Clean up and update docs

**Files:**

- Delete: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/thumbnails-base64.txt`
- Modify: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/CLAUDE.md`

**Step 1: Delete temp base64 file**

```bash
rm /Users/chriscecora/Downloads/bodyPSDLayersbodyparts/thumbnails-base64.txt
```

**Step 2: Update CLAUDE.md architecture section**

Add documentation about:

- Three-column layout (systems panel, body model, tooltip panel)
- BODY_SYSTEMS data array and ORGAN_TO_SYSTEM reverse lookup
- Bidirectional linking: selectSystem/deselectSystem/updateSystemFromOrgan
- New HTML elements: systemsList, tooltipPanel, tooltipContent, etc.

**Step 3: Final end-to-end verification checklist**

- Three columns at 1100px+ width
- Mobile stacking at 900px or less (Systems, Body Model, Tooltip order)
- All 11 systems clickable with correct organ mappings
- Bidirectional linking works both ways
- All existing features preserved (gender, rotate, view toggle, pills)
- No console errors

**Step 4: Commit**

```bash
git add interactive-body-model.html CLAUDE.md
git commit -m "docs: update CLAUDE.md with three-column architecture, remove temp files"
```
