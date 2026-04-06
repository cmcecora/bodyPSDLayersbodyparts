# Phase 4: Data Layer, Disease/Symptom Panels & Modal - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06
**Phase:** 04-data-layer-disease-symptom-panels-modal
**Areas discussed:** Disease/symptom panel placement, Data splitting & loading, Modal design & behavior, Loading & empty states

---

## Disease/Symptom Panel Placement

| Option                              | Description                                                                                             | Selected |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- |
| Right column (replace detail panel) | When a body part is selected, the right panel switches from system description to disease/symptom lists |          |
| Fourth column (match existing app)  | Add a 4th column matching the existing HTML's spanning-sections pattern                                 | ✓        |
| Below model in center column        | Disease/symptom panels appear below the body model, scrolls vertically                                  |          |
| Right column tabs (system + data)   | Right panel gets tabs for System Info and Diseases/Symptoms                                             |          |

**User's choice:** Fourth column (match existing app)
**Notes:** Preserves the existing app's layout pattern users are familiar with.

---

| Option                             | Description                                                                            | Selected |
| ---------------------------------- | -------------------------------------------------------------------------------------- | -------- |
| Collapsible sections per body part | Each selected body part gets its own expandable card with disease/symptom sub-sections | ✓        |
| Single merged list                 | All diseases from all selected body parts in one list                                  |          |
| Tabbed per body part               | Horizontal tabs, one per selected body part                                            |          |

**User's choice:** Collapsible sections per body part
**Notes:** Matches existing body-part-cards pattern from the monolithic HTML.

---

| Option                                 | Description                                             | Selected |
| -------------------------------------- | ------------------------------------------------------- | -------- |
| One global search at top of 4th column | Single search box filters across all visible body parts | ✓        |
| Per-body-part search                   | Each body part card has its own search input            |          |
| You decide                             | Claude's discretion                                     |          |

**User's choice:** One global search at top of 4th column

---

| Option                   | Description                                        | Selected |
| ------------------------ | -------------------------------------------------- | -------- |
| Name only                | Cleaner look, ICD codes available but not shown    | ✓        |
| Name + ICD code          | Both displayed, e.g. 'Abdominal distension (R140)' |          |
| Name, with code on hover | Clean default with ICD code shown on hover         |          |

**User's choice:** Name only

---

## Data Splitting & Loading

| Option                          | Description                                             | Selected |
| ------------------------------- | ------------------------------------------------------- | -------- |
| One JSON file per body part key | 83 separate files, build-time script splits master file | ✓        |
| Grouped by body region          | ~15 region files merging related body parts             |          |
| Keep single file, lazy-parse    | Load full 7.6MB once, parse only requested keys         |          |

**User's choice:** One JSON file per body part key

---

| Option                        | Description                                       | Selected |
| ----------------------------- | ------------------------------------------------- | -------- |
| Load whole file on first need | 100KB is small enough, one fetch, cache in memory | ✓        |
| Split per body part too       | Consistent with disease splitting                 |          |
| You decide                    | Claude's discretion                               |          |

**User's choice:** Load whole symptoms file on first need

---

| Option                        | Description                      | Selected |
| ----------------------------- | -------------------------------- | -------- |
| Node.js script in scripts/    | JS ecosystem, runs as npm script | ✓        |
| Extend existing Python script | Add to generate-data-files.py    |          |
| Vite plugin at build time     | Custom Vite plugin               |          |

**User's choice:** Node.js script in scripts/

---

| Option                    | Description                                         | Selected |
| ------------------------- | --------------------------------------------------- | -------- |
| In-memory Map cache       | Map<string, DiseaseEntry[]>, cleared on page reload | ✓        |
| No caching — always fetch | Rely on browser HTTP cache                          |          |
| You decide                | Claude's discretion                                 |          |

**User's choice:** In-memory Map cache

---

## Modal Design & Behavior

| Option                         | Description                                  | Selected |
| ------------------------------ | -------------------------------------------- | -------- |
| Symptoms + diseases with tabs  | Two tabs inside modal: Symptoms and Diseases | ✓        |
| Symptoms only (match existing) | Replicate existing symptom-only modal        |          |
| Combined list, no tabs         | Single scrollable list with both             |          |

**User's choice:** Symptoms + diseases with tabs

---

| Option                              | Description                                                  | Selected |
| ----------------------------------- | ------------------------------------------------------------ | -------- |
| Near click point with carat pointer | Adjacent to click with triangular carat, smart repositioning | ✓        |
| Centered overlay                    | Traditional centered modal with dark backdrop                |          |
| Slide-in from right                 | Panel slides in from right edge                              |          |

**User's choice:** Near click point with carat pointer

---

| Option                                      | Description                                | Selected |
| ------------------------------------------- | ------------------------------------------ | -------- |
| Selectable with checkboxes (match existing) | Users can check symptoms, tracked in state | ✓        |
| Read-only list                              | Display only, no selection                 |          |
| You decide                                  | Claude's discretion                        |          |

**User's choice:** Selectable with checkboxes

---

| Option                         | Description                               | Selected |
| ------------------------------ | ----------------------------------------- | -------- |
| Yes, search input inside modal | Filter input at top of modal content area | ✓        |
| No search in modal             | Full list, scroll to find                 |          |

**User's choice:** Search input inside modal

---

## Loading & Empty States

| Option                 | Description                                     | Selected |
| ---------------------- | ----------------------------------------------- | -------- |
| Skeleton shimmer lines | Animated placeholder lines mimicking list shape | ✓        |
| Simple spinner         | Circular spinner centered in loading area       |          |
| You decide             | Claude's discretion                             |          |

**User's choice:** Skeleton shimmer lines

---

| Option                             | Description               | Selected |
| ---------------------------------- | ------------------------- | -------- |
| Simple 'No data available' message | Muted text line inline    | ✓        |
| Hide the section entirely          | Don't show empty sections |          |
| You decide                         | Claude's discretion       |          |

**User's choice:** Simple 'No data available' message

---

| Option                           | Description                                         | Selected |
| -------------------------------- | --------------------------------------------------- | -------- |
| Inline error with retry button   | 'Failed to load data. [Retry]' in place of skeleton | ✓        |
| Silent fail with console warning | Show empty state, log to console                    |          |
| You decide                       | Claude's discretion                                 |          |

**User's choice:** Inline error with retry button

---

## Claude's Discretion

- Exact 4th column width and responsive breakpoint behavior
- Internal component decomposition
- Skeleton shimmer animation CSS implementation
- Tab component design inside modal
- Debounce timing for search input
- How selected symptoms integrate with explorer state
- Disease list item styling details

## Deferred Ideas

None — discussion stayed within phase scope
