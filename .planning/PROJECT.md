# Body Part Directory — Interactive Medical Knowledge Platform

## What This Is

A body-part-centered medical knowledge platform that combines an interactive anatomical body model with a large-scale content directory. Users explore health information by clicking on body parts rather than typing into search forms — discovering diseases, symptoms, medical tests, procedures, treatments, and nutritional guidance through an intuitive visual interface. The platform serves both as a standalone health resource and as a discovery layer for an existing medical test scheduling website.

## Core Value

Make health information discovery intuitive and visual — users start from "where it hurts" and navigate a rich medical knowledge graph, ultimately connecting them to actionable next steps like scheduling a medical test.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- [x] Interactive SVG body model with 20+ clickable organ regions
- [x] Body systems sidebar (11 systems) with bidirectional organ highlighting
- [x] Multi-selection of body parts with pill list tracking
- [x] Gender toggle for reproductive organ variants
- [x] Symptom and disease display per body part (86 body parts mapped)
- [x] ICD-10-CM code mapping to body parts (70K+ diseases)
- [x] Body part highlight regions with ellipse overlays
- [x] Organ modal with symptoms/diseases detail view

### Active

<!-- Current scope. Building toward these. -->

**Milestone 1 — Body Map App Refactor & Web Component**

- [ ] Refactor 7K-line monolithic HTML into clean, modular code structure
- [ ] Package as framework-agnostic Web Component (`<body-map-explorer>`)
- [ ] Dual data mode: bundled data (standalone) + props/API input (integrated)
- [ ] Improved visual quality: professional-grade graphics, colors, polish
- [ ] Improved UX: clear interaction patterns, intuitive navigation, selection feedback
- [ ] Enhanced features: search, filtering, mobile support, better symptom/disease display
- [ ] Performance optimization: lazy loading, cached DOM queries, code splitting

**Milestone 2 — Medical Content Directory (Next.js)**

- [ ] Next.js + PostgreSQL knowledge graph with body parts as hub entities
- [ ] Entity pages: body systems, body parts, diseases, symptoms, tests, procedures, treatments, foods
- [ ] Relationship/listing pages exposing the knowledge graph as crawlable content
- [ ] SEO infrastructure: structured data, sitemaps, internal linking engine
- [ ] ISR rendering strategy for 600K+ pages
- [ ] Content generation pipeline (AI-assisted + editorial review)
- [ ] Admin tooling for content management at scale

**Milestone 3 — Integration & Deployment**

- [ ] Embed body map Web Component into directory as discovery interface
- [ ] Subdomain deployment (e.g., health.existingsite.com) on AWS
- [ ] Connect directory to existing medical test scheduling site
- [ ] Medical test + location programmatic pages (600K+)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Rewriting the existing Angular/WordPress site — directory is a new Next.js project connected via subdomain
- Mobile native apps — web-first, responsive design handles mobile
- Real-time chat / telemedicine features — not part of the content directory vision
- User accounts / personalization in v1 — may add in future milestones
- Gene pages at scale (2M+) — deferred to expansion wave per blueprint
- Health products/services commerce layer — requires business model decisions first

## Context

**Existing medical website:** Angular + MySQL + WordPress on AWS. Helps users find and schedule medical tests online. Current search UX relies on traditional forms expecting users to know what test they want. Performance is slow due to WordPress layer.

**This project's origin:** The interactive body model was built as a prototype exploring visual health search — click a body part, see related conditions and tests. It works but was built without professional practices (single 3.87MB HTML file, no build system, no tests, base64-encoded images inline).

**Data assets already built:**

- 86 body parts mapped to body systems
- ICD-10-CM codes mapped to body parts (70K+ diseases)
- Symptoms mapped to body parts (20K+ symptoms)
- Body part highlight regions with SVG overlays
- 11 body system descriptions with thumbnails

**Blueprint reference:** `docs/Body-Part-Directory-Master-Plan-updated-v2.md` — comprehensive architecture guide for the 600K+ page directory covering data model, URL structure, rendering strategy, SEO, content generation, and phased rollout.

**70% of internet searches are health-related** — this platform taps into massive demand by offering a differentiated, visual discovery experience vs. traditional search-form UX.

## Constraints

- **Existing stack**: Main site is Angular + MySQL + AWS — directory must connect via subdomain, not replace existing infrastructure
- **Infrastructure**: Team will need guidance on DNS/subdomain routing for separate Next.js deployment
- **Data readiness**: Body part → disease → symptom mappings are solid; procedures, treatments, foods, genes need data sourcing
- **Single developer**: Project is primarily solo-developed with AI assistance — phasing and scope management are critical
- **No build system**: Current body map has zero tooling — refactor must introduce a proper development environment
- **Medical accuracy**: Content must be factually accurate — requires editorial review pipeline, especially for AI-generated content

## Key Decisions

| Decision                   | Rationale                                                                                  | Outcome   |
| -------------------------- | ------------------------------------------------------------------------------------------ | --------- |
| Web Component for body map | Framework-agnostic — works in Angular (existing), Next.js (directory), or any future stack | — Pending |
| Next.js for directory      | Best-in-class for SEO-heavy content sites with ISR, superior to Angular for this use case  | — Pending |
| Subdomain deployment       | Avoids touching the fragile WordPress/Angular site while sharing domain authority          | — Pending |
| Body map refactor first    | Existing asset needs cleanup before integration; validates the visual search concept       | — Pending |
| Dual data mode             | Standalone operation with bundled data + API-driven mode for directory integration         | — Pending |

---

_Last updated: 2026-03-29 after project initialization_
