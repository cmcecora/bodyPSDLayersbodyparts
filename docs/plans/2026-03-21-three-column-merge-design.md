# Three-Column Body Model Merge — Design Document

**Date:** 2026-03-21
**Source files:**

- `~/Downloads/bodyPSDLayersbodyparts/interactive-body-model.html` (target)
- `/Volumes/LaCie/Downloads_MacbookPro2025/body-systems-interactive-map-master/anne-copy-2.html` (source for sidebar + tooltip data)

## Goal

Merge the body systems sidebar (left) and tooltip panel (right) from the Anne interactive map project into the existing interactive body model, creating a three-column layout with bidirectional linking between body systems and individual organs.

## Layout

```
LEFT (260px)              MIDDLE (flex:1, max 380px)    RIGHT (300px)
─────────────────────     ─────────────────────────     ─────────────────────
Body Systems Menu         [Organs | Sections] toggle    Tooltip/Detail Panel
 • Cardiovascular ●       SVG body model                 [thumbnail]
 • Digestive ●            (existing interactive model)    System Title
 • Endocrine ●                                            Description text
 • Immune ●               [Male | Female] toggle
 • Integumentary ●        [↻ Rotate Model]
 • Muscular ●
 • Nervous ●
 • Reproductive ●
 • Respiratory ●
 • Skeletal ●
 • Urinary ●
─────────────────────
My Body Parts
 (existing pill list)
```

## Data Model

### Body Systems (from Anne project)

11 systems, each with: id, title, color, thumbnail, description, mapped organ IDs.

### System → Organ Mapping

| System         | Mapped Organs (body model IDs)          |
| -------------- | --------------------------------------- |
| cardiovascular | heart                                   |
| digestive      | stomach, intestines, gallbladder, liver |
| endocrine      | thyroid, pancreas, thymus               |
| immune         | spleen, thymus                          |
| integumentary  | (none — skin not in organ model)        |
| muscular       | muscle, knee_joint                      |
| nervous        | brain                                   |
| reproductive   | male_reproductive, female_reproductive  |
| respiratory    | lungs_left, lungs_right, larynx_trachea |
| skeletal       | knee_joint                              |
| urinary        | kidneys, bladder                        |

## Interaction Design

### Bidirectional Linking

**Left sidebar → Middle + Right:**

1. Click system in left → system gets `.active` class
2. All mapped organs in middle get `.selected` class (highlighted)
3. Right tooltip shows system title, thumbnail, description

**Middle organs → Left + Right:**

1. Click organ in middle → organ gets `.selected` (existing)
2. Look up which system(s) contain that organ
3. First matching system gets `.active` in left sidebar
4. Right tooltip shows that system's description

**Deselection:**

- Click active system → deselects system, removes organ highlights, clears tooltip
- Click selected organ → deselects organ; if no organs from that system remain selected, deselects system

### Existing Behavior Preserved

- Pill selection list still works (moves below systems menu in left column)
- Gender toggle, rotate, view toggle all unchanged
- Organs/Sections view toggle unchanged

## Thumbnail Strategy

Base64-encode the 11 Anne thumbnail PNGs inline to keep single-file architecture.

## CSS Changes

- `.page-layout`: 2-column → 3-column flex, max-width increases to ~1100px
- New `.systems-panel`: left column body systems list
- New `.tooltip-panel`: right column detail display
- `.body-parts-panel`: repositioned below systems panel in left column
- Mobile (≤900px): single column stack — Systems → Body Model → Tooltip

## Implementation Approach

Pure vanilla JS — no jQuery, no Mapplic plugin. Styled to visually echo Mapplic's sidebar/tooltip aesthetic but using the body model's existing design language.
