# Phase 2: Core SVG Body Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 02-core-svg-body-model
**Areas discussed:** Visual fidelity, View mode scope, Control placement, SVG data approach

---

## Visual Fidelity

| Option                               | Description                                                                       | Selected |
| ------------------------------------ | --------------------------------------------------------------------------------- | -------- |
| Pixel-faithful replica (Recommended) | Replicate existing hover/selection effects exactly. Visual refinement in Phase 6. | ✓        |
| Faithful with minor cleanup          | Match the look but fix obvious rough edges. No new design language.               |          |
| Start the visual refresh now         | Begin visual upgrade in Phase 2 — new hover effects, selection indicators.        |          |

**User's choice:** Pixel-faithful replica
**Notes:** Phase 6 (UX-01) is the designated place for visual refinement.

### Follow-up: Body Silhouette

| Option                                   | Description                                                   | Selected |
| ---------------------------------------- | ------------------------------------------------------------- | -------- |
| Extract from existing HTML (Recommended) | Pull silhouette exactly as it exists. Guarantees pixel match. | ✓        |
| You decide                               | Claude picks best approach based on source file.              |          |

**User's choice:** Extract from existing HTML

### Follow-up: Entrance Animations

| Option                             | Description                                       | Selected |
| ---------------------------------- | ------------------------------------------------- | -------- |
| Yes, replicate entrance animations | Copy existing fade-in/slide animations.           |          |
| Skip animations for now            | Organs appear immediately. Animations in Phase 6. |          |
| You decide                         | Claude determines based on complexity vs. impact. | ✓        |

**User's choice:** You decide (Claude's discretion)

### Follow-up: SVG Aspect Ratio

| Option                              | Description                                         | Selected |
| ----------------------------------- | --------------------------------------------------- | -------- |
| Preserve aspect ratio, scale to fit | Maintains 698:1698 ratio, scales responsively.      |          |
| Fixed dimensions                    | Lock at exactly 698x1698 pixels.                    |          |
| You decide                          | Claude picks best approach for three-column layout. | ✓        |

**User's choice:** You decide (Claude's discretion)

### Follow-up: Hover Tooltip

| Option                    | Description                                    | Selected |
| ------------------------- | ---------------------------------------------- | -------- |
| Include hover tooltip     | Show organ name near cursor on hover.          |          |
| Defer tooltip to Phase 3+ | Phase 2 just handles highlight effects.        | ✓        |
| You decide                | Claude determines based on MODEL requirements. |          |

**User's choice:** Defer tooltip to Phase 3+

### Follow-up: Pill List

| Option                         | Description                                          | Selected |
| ------------------------------ | ---------------------------------------------------- | -------- |
| Include in Phase 2             | Selected organs show as removable pills below model. |          |
| Defer to Phase 3 (Recommended) | Pill list is sidebar behavior, belongs with Phase 3. | ✓        |
| You decide                     | Claude determines based on component architecture.   |          |

**User's choice:** Defer to Phase 3

---

## View Mode Scope

| Option                               | Description                                                     | Selected |
| ------------------------------------ | --------------------------------------------------------------- | -------- |
| Organs + Sections only (Recommended) | Two views per MODEL-06. Keeps scope tight.                      |          |
| All three views                      | Replicate all three existing views (organs, organs2, sections). | ✓        |
| Organs only                          | Just individual organ view. Minimal scope.                      |          |

**User's choice:** All three views
**Notes:** User wants full parity with existing app, even though MODEL-06 only mentions two views.

### Follow-up: Front/Back Rotation

| Option                                           | Description                                            | Selected |
| ------------------------------------------------ | ------------------------------------------------------ | -------- |
| Include flip mechanism with placeholder back     | Wire up rotate button, show placeholder for back view. |          |
| Defer rotation entirely to Phase 6 (Recommended) | Entire front/back feature ships together in Phase 6.   | ✓        |
| You decide                                       | Claude determines based on architecture needs.         |          |

**User's choice:** Defer rotation entirely to Phase 6

---

## Control Placement

| Option                          | Description                                                   | Selected |
| ------------------------------- | ------------------------------------------------------------- | -------- |
| Above the SVG (match existing)  | View tabs and gender toggle both above. Familiar layout.      |          |
| Split: tabs above, gender below | View-switcher above, gender toggle below. Separates concerns. | ✓        |
| You decide                      | Claude picks best placement for three-column layout.          |          |

**User's choice:** Split: tabs above, gender below
**Notes:** Deliberate divergence from existing app where both controls are above the SVG.

### Follow-up: Tab Style

| Option                            | Description                                    | Selected |
| --------------------------------- | ---------------------------------------------- | -------- |
| Text labels only (match existing) | Simple text tabs. Clear and readable.          | ✓        |
| Icons + text labels               | Icon next to each label. More polished.        |          |
| You decide                        | Claude picks based on pixel-faithful approach. |          |

**User's choice:** Text labels only

---

## SVG Data Approach

| Option                                | Description                                               | Selected |
| ------------------------------------- | --------------------------------------------------------- | -------- |
| Inline Lit SVG template (Recommended) | SVG markup in render() as Lit tagged template. Simple.    |          |
| JSON data file + programmatic SVG     | Extract coordinates to JSON, generate SVG dynamically.    |          |
| External .svg file loaded at runtime  | Keep SVG as standalone file, load via fetch().            |          |
| You decide                            | Claude picks best balance of maintainability/performance. | ✓        |

**User's choice:** You decide (Claude's discretion)

### Follow-up: Image Loading

| Option                  | Description                                             | Selected |
| ----------------------- | ------------------------------------------------------- | -------- |
| All on mount (simpler)  | Load all 19 organ WebPs on mount. ~200-400 KB total.    | ✓        |
| Lazy-load by visibility | Load only viewport-visible organs. Better performance.  |          |
| You decide              | Claude picks based on file sizes and PERF requirements. |          |

**User's choice:** All on mount (simpler)

---

## Claude's Discretion

- Entrance animations (replicate or skip)
- SVG aspect ratio and scaling behavior
- SVG data approach (inline template, JSON, or external file)
- Component decomposition (single vs. sub-components)
- State management pattern for organ selection

## Deferred Ideas

None — discussion stayed within phase scope
