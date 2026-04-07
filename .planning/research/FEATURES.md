# Feature Landscape

**Domain:** Interactive medical body map Web Component
**Researched:** 2026-03-29

## Table Stakes

Features users expect from an interactive body map component. Missing = product feels incomplete.

| Feature                  | Why Expected                                                | Complexity | Notes                                                  |
| ------------------------ | ----------------------------------------------------------- | ---------- | ------------------------------------------------------ |
| Clickable body regions   | Core interaction model -- users click to explore            | Medium     | Already implemented, needs refactor into component     |
| Hover feedback           | Visual affordance that regions are interactive              | Low        | Already implemented via CSS                            |
| Multi-selection          | Users want to select multiple body parts                    | Low        | Already implemented with Set-based state               |
| Body system grouping     | Standard medical categorization                             | Medium     | Already implemented with 11 systems                    |
| Organ-to-system linking  | Click organ, see which system it belongs to                 | Medium     | Already implemented bidirectionally                    |
| Gender toggle            | Male/female reproductive anatomy differs                    | Low        | Already implemented                                    |
| Disease/symptom display  | The "so what" after selecting a body part                   | High       | Already implemented, needs lazy loading                |
| Search/filter in lists   | Users need to find specific diseases/symptoms in long lists | Medium     | Already implemented with debounced search              |
| Mobile responsive layout | 50%+ of health searches are mobile                          | High       | Current breakpoint is minimal, needs container queries |
| Keyboard navigation      | Accessibility requirement, screen reader users              | Medium     | Not implemented, needed for WCAG 2.1                   |

## Differentiators

Features that set this product apart. Not expected in a generic body map, but create value.

| Feature                              | Value Proposition                                                   | Complexity        | Notes                                            |
| ------------------------------------ | ------------------------------------------------------------------- | ----------------- | ------------------------------------------------ |
| Dual data mode (bundled + API)       | Component works standalone OR integrated -- unique in the ecosystem | Medium            | No existing body map component offers this       |
| Framework-agnostic Web Component     | Works in Angular, Next.js, plain HTML -- no React lock-in           | Medium            | Most body map components are React-only          |
| Raster organ images (PSD-sourced)    | Higher visual fidelity than vector-only body maps                   | Low               | Already have the artwork, just optimize delivery |
| ICD-10-CM code mapping               | Medical-grade disease classification, not generic labels            | Low (data exists) | 70K+ diseases already mapped                     |
| Per-body-part symptom data           | Enables "where does it hurt" discovery flow                         | Low (data exists) | 20K+ symptoms already mapped                     |
| CSS custom property theming          | Host pages can brand the component to match their design            | Low               | Standard Shadow DOM pattern                      |
| Programmatic selection API           | Host app can pre-select body parts based on URL or context          | Low               | Properties + methods on the custom element       |
| Body section view (ellipse overlays) | Users can explore by body region, not just internal organs          | Medium            | Already implemented, unique to this project      |

## Anti-Features

Features to explicitly NOT build in the Web Component.

| Anti-Feature                    | Why Avoid                                                                       | What to Do Instead                                                        |
| ------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 3D body model (WebGL)           | Massive complexity increase, accessibility nightmare, mobile performance issues | Keep 2D SVG -- it is the right level of fidelity for a medical directory  |
| User accounts / personalization | Scope creep, belongs in the host application                                    | Dispatch events, let host app handle persistence                          |
| AI symptom checker / diagnosis  | Medical liability risk, regulatory issues, not a component concern              | Expose data via events, let host app integrate with AI if desired         |
| Inline content editing          | Component is a viewer/selector, not a CMS                                       | Provide data via properties, editing happens in admin tools               |
| Animation-heavy transitions     | Distract from medical content, accessibility concerns with motion               | Keep subtle hover/selection transitions only                              |
| Built-in analytics tracking     | Privacy concern, host app should own analytics                                  | Dispatch events, host app sends to their analytics provider               |
| Embedded third-party scripts    | Security risk, CSP violations, unpredictable behavior                           | Component is self-contained, zero external requests except its own assets |

## Feature Dependencies

```
Asset extraction         --> SVG body model component
SVG body model           --> Sidebar + detail panel (need model to test selection)
Sidebar + detail panel   --> Data columns (need selection state to filter data)
Data columns             --> Lazy data loading (need rendering before optimizing loading)
All sub-components       --> Orchestrator component API (compose into public element)
Component API            --> NPM packaging (need stable API before publishing)
```

## MVP Recommendation

For Milestone 1, prioritize in this order:

1. **Extracting and optimizing assets** -- unlocks everything else
2. **Core SVG body model with organ click/hover** -- the visual heart of the product
3. **Body systems sidebar with bidirectional selection** -- validates the interaction model
4. **Lazy-loaded disease/symptom display** -- proves the data integration works
5. **Dual data mode (bundled + API props)** -- enables Milestone 3 integration

Defer:

- **Back view rotation**: Artwork does not exist yet (no back-view PSD). Architect the component to support it later but do not block on it
- **86 body part nav panel**: Complex UI, can ship initially with organ-level selection only and add the granular 86-part nav in a fast-follow
- **Mobile layout**: Important but should come after desktop architecture is stable
- **Accessibility**: Should be woven in throughout, but a dedicated polish pass is Phase 6

## Sources

- Codebase analysis: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONCERNS.md`
- PROJECT.md milestone definitions
- Training data on medical visualization UI patterns
