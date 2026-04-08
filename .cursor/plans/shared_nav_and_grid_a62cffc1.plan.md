---
name: Shared Nav And Grid
overview: Add a shared modern header/navigation pattern to both apps and introduce a mirrored `BodyPartGrid` experience, with native implementations for Next App Router and the Lit body-map explorer.
todos:
  - id: map-next-shell
    content: Plan the Next App Router shell, shared header, and nav source-of-truth files.
    status: pending
  - id: plan-next-grid
    content: Plan the Next `BodyPartGrid` route, loading boundary, compact-mode toggle, and asset staging work.
    status: pending
  - id: plan-lit-shell
    content: Plan the Lit header integration and sidebar page-link list without breaking existing explorer behavior.
    status: pending
  - id: plan-lit-grid
    content: Plan the Lit `BodyPartGrid` view mode, expanded 3rd-column layout, and localized skeleton loading.
    status: pending
  - id: verify-cross-app
    content: Define verification steps for responsiveness, animations, lazy loading, and non-reloading shell behavior across both apps.
    status: pending
isProject: false
---

# Shared Nav And Grid

## Goal

Ship a consistent, modern, responsive site header and secondary navigation across both codebases, then add a `BodyPartGrid` entry point that behaves natively in each app without forcing a cross-stack router rewrite.

## Recommended Approach

Implement the same information architecture and visual system in both apps, but keep each stack native:

- In `/Users/chriscecora/gsd-workspaces/body-part-dir`, use App Router layouts/pages/loading boundaries for real page navigation.
- In `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts`, extend the existing Lit shell in `src/body-map-explorer.ts` and `src/body-map-sidebar.ts` with a mirrored header/nav and a view-state-driven `BodyPartGrid` mode.

This avoids blocking on a bigger router migration while still giving users a coherent navigation model across both experiences.

## Files To Touch

### Next app: `/Users/chriscecora/gsd-workspaces/body-part-dir`

- Modify `/Users/chriscecora/gsd-workspaces/body-part-dir/src/app/layout.tsx`
  Add global shell structure, shared header mount point, metadata cleanup, and persistent page chrome.
- Modify `/Users/chriscecora/gsd-workspaces/body-part-dir/src/app/page.tsx`
  Replace the starter page with the main landing view that includes the new header/nav and links to `BodyPartGrid`.
- Modify `/Users/chriscecora/gsd-workspaces/body-part-dir/src/app/globals.css`
  Add the motion tokens, responsive spacing, hover/scroll transitions, and site-level visual language.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/components/site-header.tsx`
  Shared modern header with logo, menu items, settings/profile icons, mobile collapse behavior, and scroll state.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/components/site-nav-links.tsx`
  Centralized nav item definitions shared by header and inline page links.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/app/body-part-grid/page.tsx`
  Real routed `BodyPartGrid` page.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/app/body-part-grid/loading.tsx`
  Route-level skeleton shell so the header and surrounding chrome stay mounted while grid content loads.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/components/body-part-grid.tsx`
  Client component for the image grid, density toggle, incremental image loading, and skeleton placeholders.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/components/body-part-grid-shell.tsx`
  Column layout wrapper for the grid page so the third column can expand and the fourth column can be omitted cleanly.
- Create `/Users/chriscecora/gsd-workspaces/body-part-dir/src/lib/body-part-grid-data.ts`
  Normalized source for body-part image/link metadata used by the new page.
- Optionally create `/Users/chriscecora/gsd-workspaces/body-part-dir/public/assets/body-parts/` and `/Users/chriscecora/gsd-workspaces/body-part-dir/public/assets/systems/`
  Stage the actual image assets required by the Next grid.

### Lit app: `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts`

- Modify `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/src/body-map-explorer.ts`
  Add the site header above the existing grid, introduce view state for `BodyPartGrid`, and swap the normal 4-column explorer layout for a 3-column grid view where the content column expands and the fourth column disappears.
- Modify `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/src/body-map-sidebar.ts`
  Add the second scroll list of page links beneath the body-parts list and align styling with the new site chrome.
- Modify `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/src/styles/tokens.css.ts`
  Extend tokens for header glass, hover/active states, motion timing, icon buttons, and responsive nav treatments.
- Create `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/src/body-map-header.ts`
  Shared header component with logo block, nav bar, profile/settings icon actions, mobile menu, and entrance/scroll animations.
- Create `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/src/body-part-grid-view.ts`
  Mirrored grid view with 4-up default cards, compact image mode, lazy image loading, and local skeleton placeholders.
- Create `/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/src/data/site-nav.ts`
  Centralized nav labels/targets for header and sidebar link lists.

## Implementation Sequence

### 1. Establish the shared navigation model and visual rules

- Normalize the five requested nav items: `Body Part`, `Disease`, `Symptom`, `Medical Test`, `Medical Treatment`.
- Define a single nav metadata shape per app so the header and the sidebar link list use the same source of truth.
- Choose one visual direction and reuse it across both stacks: modern medical UI, elevated glass/soft-panel header, restrained motion, clear keyboard focus, and responsive collapse behavior.

### 2. Build the Next global shell first

- Move the Next app off the starter layout by introducing a shared header in `src/app/layout.tsx` and a real landing page in `src/app/page.tsx`.
- Keep the header persistent so route changes do not remount the entire page frame.
- Add smooth load/hover/scroll behaviors in CSS only where possible, with any JS limited to scroll state and mobile menu toggling.

### 3. Add the Next `BodyPartGrid` route

- Create `/body-part-grid` as the first linked destination.
- Build a layout variant that removes the fourth column entirely and lets the main content column occupy the available width.
- Default to a 4-card-per-row image grid, then expose a compact “see all images” density mode using the same data set.
- Use route-level loading plus component-level image skeletons so navigating to the page does not blank the entire shell.
- Keep image loading scoped to the grid component so only the content region updates while the header/nav remain stable.

### 4. Mirror the header/nav inside the Lit explorer

- Add the same logo/nav/icon affordances above the current explorer grid in `src/body-map-explorer.ts`.
- Keep the explorer’s existing responsive grid, but add a second layout mode for `BodyPartGrid` where the data panel is removed and the remaining content column expands.
- Add the second scrollable page-link list below the body-parts list in `src/body-map-sidebar.ts`.
- Reuse existing panel styling patterns and the skeleton treatment already present in `src/body-map-data-panel.ts` for visual consistency.

### 5. Add the Lit `BodyPartGrid` view

- Keep it as a native view-state change instead of introducing a full router in this pass.
- Lazy-load the grid view component if feasible so the core explorer bundle does not pay the cost until the user enters that view.
- Implement card and compact image modes, per-image skeletons, and transitions that affect only the grid content area.

### 6. Asset staging for the Next app

- The Next app currently does not have the real body-part WebP thumbnails under its root `public/` tree.
- Add a plan step to copy or otherwise stage the expected files into `/Users/chriscecora/gsd-workspaces/body-part-dir/public/assets/body-parts/` and `/Users/chriscecora/gsd-workspaces/body-part-dir/public/assets/systems/`, matching existing filename conventions from the vendored `bodyPSDLayersbodyparts/src/data/` metadata.
- If asset staging cannot happen in the same pass, the plan should explicitly split UI scaffolding from thumbnail enablement.

## Verification

- Next app:
  - Confirm the global header appears on `/` and `/body-part-grid`.
  - Confirm mobile nav collapse/expand, hover states, and scroll-reactive header styling.
  - Confirm `BodyPartGrid` shows 4-up cards by default and switches to compact image mode without a full page reload.
  - Confirm route `loading.tsx` preserves header/shell while grid content skeletons render.
- Lit app:
  - Confirm the header renders above the existing explorer without regressing current 4-column behavior.
  - Confirm the sidebar now contains a second scrollable page-link list under body parts.
  - Confirm switching to `BodyPartGrid` hides the 4th column, expands the main content area, and loads only grid content with skeleton placeholders.
  - Confirm hover/load/scroll animations remain responsive and keyboard accessible.

## Risks To Manage

- The Next app is greenfield UI right now, so it needs both shell creation and content page creation in the same pass.
- The Lit app is already stateful and test-covered, so layout/view changes should be isolated from organ/system selection behavior.
- The largest non-UI blocker is missing body-part image assets in the Next app’s root `public/` directory.

## Suggested Execution Order

1. Stage or confirm Next image assets.
2. Implement shared Next shell and header.
3. Implement Next `BodyPartGrid` route and loading behavior.
4. Implement Lit header and sidebar page links.
5. Implement Lit `BodyPartGrid` view mode.
6. Run targeted UI and regression verification in both apps.
