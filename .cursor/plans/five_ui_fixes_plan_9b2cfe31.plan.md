---
name: Five UI Fixes Plan
overview: "Fix five issues in the Lit-based body map explorer: respiratory system column 4 display, gender-filtered reproductive system display, section deselection highlighting, modal header HTML entity decoding, and Organs 2 tab modal opening."
todos:
  - id: fix-respiratory
    content: Add lungs_left to respiratory organIds and optionally add detailBodyPartIds in systems.ts
    status: pending
  - id: fix-reproductive-gender
    content: Propagate gender from model to explorer and filter reproductive detailBodyPartIds by gender
    status: pending
  - id: fix-section-deselect
    content: Add selected boolean to section-click event and handle deselection in explorer (don't reopen modal)
    status: pending
  - id: fix-header-entities
    content: Replace HTML entities (&amp;) with plain & in sections.ts name strings
    status: pending
  - id: fix-organs2-modal
    content: Add organ2-click handler in explorer to open symptoms/diseases modal; handle sidebar clicks in Organs2 view
    status: pending
isProject: false
---

# Five UI Bug Fixes for Body Map Explorer

All changes target the Lit component app (`src/` files). The standalone `interactive-body-model.html` is not in scope.

---

## 1. Respiratory system: show Lungs + Larynx/Trachea in column 4

**Root cause:** In [src/data/systems.ts](src/data/systems.ts), respiratory `organIds` is `["lungs_right", "larynx_trachea"]` -- missing `"lungs_left"`. Additionally, respiratory has no `detailBodyPartIds`, so the only cards that appear in column 4 come from the deduped organ IDs.

**Current behavior:** When clicking respiratory, `_panelOrganIds` (in [src/body-map-explorer.ts](src/body-map-explorer.ts) line ~227) deduplicates `lungs_right` via `ORGAN_TO_DATA_KEY` (both `lungs_left` and `lungs_right` map to `"lungs"`), and `larynx_trachea` maps to `"larynx"`. So column 4 should show `bp_lungs` and `bp_larynx` cards. The SVG highlighting only highlights the right lung.

**Fix:**

- In `src/data/systems.ts` line 117: add `"lungs_left"` to respiratory `organIds` so both lungs highlight on the SVG model
- Add `detailBodyPartIds: ["bp_trachea"]` to the respiratory system if trachea data exists separately, OR confirm the existing dedup logic already produces both Lungs and Larynx cards (it should, since `lungs_right` -> `bp_lungs` and `larynx_trachea` -> `bp_larynx`)

```117:118:src/data/systems.ts
    organIds: ["lungs_right", "larynx_trachea"],
  },
```

Change to:

```typescript
    organIds: ["lungs_left", "lungs_right", "larynx_trachea"],
    detailBodyPartIds: ["bp_trachea"],
```

Verify: `bp_lungs.json`, `bp_larynx.json`, and `bp_trachea.json` all exist in `public/data/diseases/`. The symptom data also has `bp_larynx` and `bp_lungs` keys.

---

## 2. Reproductive system: filter body parts by gender

**Root cause:** In [src/data/systems.ts](src/data/systems.ts), reproductive `detailBodyPartIds` (lines 100-109) lists all 8 body parts (male + female) regardless of the active gender. The explorer's `_panelOrganIds` getter blindly includes all `detailBodyPartIds` with no gender filter. The explorer doesn't even have access to `currentGender` from the model.

**Fix (3 steps):**

- **Step A:** Propagate gender from model to explorer. In [src/body-map-model.ts](src/body-map-model.ts), dispatch a `gender-change` event from `_setGender()` (line 526). In [src/body-map-explorer.ts](src/body-map-explorer.ts), add a `@state() _currentGender` property, listen for `@gender-change` on `<body-map-model>`, and update state.
- **Step B:** Define which `detailBodyPartIds` belong to which gender. Add a metadata structure (e.g. a constant in `systems.ts` or inline in the explorer) that maps:
  - Male: `["bp_penis", "bp_prostate", "bp_testicles"]`
  - Female: `["bp_vagina", "bp_vulva", "bp_fallopian_tubes", "bp_ovaries", "bp_uterus", "bp_breasts"]`
- **Step C:** Filter `_panelOrganIds` in the explorer. When `activeSystem?.id === "reproductive"`, filter `systemDetailIds` to only include gender-appropriate items. Also filter `_detailPhotoEntries` similarly for column 3.

---

## 3. Section deselection: remove highlight on second click

**Root cause:** The toggle logic in [src/body-map-model.ts](src/body-map-model.ts) `_handleSectionClick` (line 578) correctly toggles `_selectedSections` and calls `requestUpdate()`. However, the `section-click` event dispatched to the explorer does not indicate whether the section was selected or deselected. In [src/body-map-explorer.ts](src/body-map-explorer.ts) `_handleSectionClick` (line 516), when the modal was previously closed (via X button) and a highlighted section is clicked again:

1. The model correctly removes the highlight
2. But the explorer sees `_modalSectionId !== sectionId` (because modal was closed), and **reopens the modal**

This means clicking a highlighted section always reopens the modal even when the intent is to deselect.

**Fix:**

- In `body-map-model.ts` `_handleSectionClick`: include a `selected: boolean` field in the `section-click` event detail indicating whether the section is now selected or deselected
- In `body-map-explorer.ts` `_handleSectionClick`: check the `selected` field. Only open the modal when `selected === true`. When `selected === false`, close the modal if it's open for that section.

```diff
// body-map-model.ts _handleSectionClick
+ const isNowSelected = this._selectedSections.has(partId);
  this.dispatchEvent(new CustomEvent("section-click", {
    detail: {
      sectionId: partId,
      sectionName: partName,
+     selected: isNowSelected,
      clientX: event.clientX,
      clientY: event.clientY,
    },
```

```diff
// body-map-explorer.ts _handleSectionClick
+ const { sectionId, sectionName, clientX, clientY, selected } = event.detail;
+ if (!selected) {
+   if (this._modalSectionId === sectionId) this._closeModal();
+   return;
+ }
```

---

## 4. Modal header: decode `Head & Neck` to `Head & Neck`

**Root cause:** In [src/data/sections.ts](src/data/sections.ts), section names are stored with HTML entity encoding: `"Head & Neck"`, `"Mid-section & Lower Torso"`, `"Middle & Lower Back"`. This is the source string in JavaScript, not HTML markup. When Lit renders `${this.sectionName}` in [src/body-map-modal.ts](src/body-map-modal.ts) line 506, it auto-escapes, so the literal `&` appears in the UI rather than `&`.

**Fix:** Replace the HTML entities with plain `&` in the source strings in `src/data/sections.ts`:

- Line 13: `"Head & Neck"` -> `"Head & Neck"` (2 occurrences: front and back)
- Line 27: `"Mid-section & Lower Torso"` -> `"Mid-section & Lower Torso"`
- Line 76: `"Middle & Lower Back"` -> `"Middle & Lower Back"`

Also update the corresponding `data-name` attributes in [interactive-body-model.html](interactive-body-model.html) if those sections use the same strings (lines ~2054, ~2257).

---

## 5. Organs 2 tab: open symptoms/diseases modal on body part click

**Root cause:** In [src/body-map-model.ts](src/body-map-model.ts) line 538, clicking an organ in Organs2 view dispatches an `organ2-click` event. However, [src/body-map-explorer.ts](src/body-map-explorer.ts) does NOT listen for this event (confirmed: no `organ2-click` handler exists). The modal only opens for `section-click` events.

**Fix (2 steps):**

- **Step A: Handle organ click in Organs2.** In `body-map-explorer.ts`:
  - Add `@organ2-click=${this._handleOrgan2Click}` on the `<body-map-model>` element (line ~633)
  - Implement `_handleOrgan2Click(event)` that:
    1. Extracts `organId` from event detail
    2. Maps the SVG organ ID to a bp key using `ORGAN_TO_DATA_KEY` and `applyBpPrefix` (e.g. `brain` -> `bp_brain`, `lungs_right` -> `bp_lungs`)
    3. Looks up the organ's display name from `BODY_PARTS` or `ORGANS`
    4. Opens the modal (same pattern as `_handleSectionClick` but for a single bp key)
    5. Fetches diseases and symptoms for that bp key
- **Step B: Handle sidebar body-part click in Organs2.** Currently `_handleBodyPartSelectRequest` toggles body part selection and populates column 4 cards (same in all views). For Organs2, instead of toggling selection, it should open the modal. Add a view-mode check:
  - Query the current view from `body-map-model` (either via a property binding or event)
  - If in Organs2 view, open the modal for the clicked body part instead of toggling column 4 selection
  - The body part ID is already a `bp_` key, so fetch diseases/symptoms directly

---

## Files to modify

| File                          | Changes                                                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/systems.ts`         | Add `lungs_left` to respiratory `organIds`; optionally add `detailBodyPartIds`                                                  |
| `src/data/sections.ts`        | Replace `&` with `&` in 4 section name strings                                                                                  |
| `src/body-map-model.ts`       | Add `selected` boolean to `section-click` event; dispatch `gender-change` event from `_setGender`                               |
| `src/body-map-explorer.ts`    | Handle `organ2-click`; add gender state + filtering for reproductive; fix section deselect logic; handle Organs2 sidebar clicks |
| `interactive-body-model.html` | Update `data-name` attributes to use `&` instead of `&` (optional -- only if standalone HTML also needs the fix)                |
