# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive body model — a self-contained HTML application that renders an anatomical body diagram with clickable/hoverable organ regions. The source artwork comes from a PSD file (`blankaasd.psd`, 698x1698px, 20 layers) with each organ extracted as a base64-embedded PNG inside an inline SVG.

## Architecture

**Single-file app:** Everything lives in `interactive-body-model.html` (~1.3MB, 443 lines). It contains inline CSS, an SVG with embedded raster images, and inline JavaScript. The file is large because each body part's PNG is base64-encoded directly in `<image>` tags.

**SVG structure:**

- ViewBox: `0 0 698 1698`
- Body silhouette is the non-interactive background (Layer 1)
- Each organ is a `<g class="body-part-group" data-part="..." data-name="...">` containing:
  - A `<image>` element (class `part-image`) with base64 PNG data
  - A `<path class="hit-area">` defining the clickable region as a transparent polygon overlay

**Interaction model:**

- Hover: blue highlight overlay via CSS (`rgba(100, 180, 255, 0.35)`) + drop-shadow filter
- Click: toggle selection (multiple simultaneous selections allowed), persistent stronger blue
- Selected parts appear as a pill list below the model
- Gender toggle: switches between male/female reproductive organs
- Rotate button: CSS 3D flip (front/back view, back view is placeholder)
- Touch support via `touchstart`/`touchend` events

**Body parts (20 layers):** brain, larynx/trachea, thyroid, liver, lungs (left/right), heart, knee joint, gallbladder, spleen, pancreas, kidneys, stomach, intestines, muscle, thymus, bladder, male reproductive, female reproductive.

## Development

No build system — open `interactive-body-model.html` directly in a browser. No dependencies, no package manager.

To serve locally (for testing):

```
python3 -m http.server 8000
```

## Key Files

- `interactive-body-model.html` — the entire application (CSS + SVG + JS, all inline)
- `blankaasd.psd` — source Photoshop file with all organ layers
- `PROJECT_PLAN.md` — phased implementation plan (PSD-to-SVG conversion, interaction, front/back rotation, responsive layout, polish)

## Git Workflow

- **main** branch is the primary branch
- **UAT** branch exists for user acceptance testing
- Feature branches use `feature/` prefix (e.g., `feature/changes-body-map`)

## Important Notes

- The HTML file is ~1.3MB due to base64 images — avoid reading it in full; use offset/limit or grep to find specific sections
- The back-view rotation is a placeholder (no back-view PSD exists yet)
- Male/female reproductive layers are toggled via a gender selector (one hidden at a time)
