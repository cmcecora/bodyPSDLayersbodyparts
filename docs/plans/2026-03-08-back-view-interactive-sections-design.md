# Back View Interactive Sections — Design

## Goal

Replace the placeholder back-view rotation with a fully interactive back body model extracted from `tranparentbackview.psd`.

## PSD Source

- File: `tranparentbackview.psd` (960x2600px, 8 layers)
- Layer 2 (visible): Back body silhouette (base image)
- Head: bbox 302,71 → 669,509
- Upper back: bbox 245,458 → 688,990
- Middle/lower back: bbox 223,946 → 736,1413
- Extremities Arms: bbox 14,524 → 953,1492
- Extremities legs: bbox 231,1283 → 736,2511

## Architecture

**Dual SVG with CSS 3D flip:**

- Front face: existing SVG (organs + sections, unchanged)
- Back face: new SVG (viewBox 0 0 960 2600) with back body base + 5 section groups

**CSS:** Both SVGs get `backface-visibility: hidden`. Back SVG pre-rotated `rotateY(180deg)`.

**Back sections:**
| PSD Layer | data-part | data-name |
|---|---|---|
| Head | back_head | Head & Neck |
| Upper back | back_upper_back | Upper Back |
| Middle/lower back | back_middle_lower_back | Middle & Lower Back |
| Extremities Arms | back_upper_extremities | Upper Extremities (Arms) |
| Extremities legs | back_lower_extremities | Lower Extremities (Legs) |

## Behavior

- Selections are **shared** between front and back (same `selectedSections` Set)
- Organs/sections toggle **always available** (on back in organs mode = just the silhouette, no interactive organs)
- Same interaction model: hover highlight, click to select, pill list in left panel
- `SECTION_SORT_ORDER` extended with back section IDs
