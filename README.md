# Portfolio

Interactive personal portfolio for Matthew Blanke.

The site is designed as one continuous scroll journey rather than a conventional collection of portfolio pages. Typography, motion, 3D objects, generated visual assets, whitespace, and concise content work together to present Matthew's work, academic background, experience, and personality.

The guiding creative principle is:

> **Minimal interface. Maximum choreography.**

---

## Product Direction

The portfolio should feel:

- clean
- sleek
- spatial
- highly art-directed
- technically sophisticated
- visually restrained most of the time
- intricate and expressive at key moments

The public experience is centered on one long-scroll homepage with a compact chapter navigator.

Planned chapters:

```text
01 NAME
02 PROJECTS
03 EXPERIENCE
04 EDUCATION
05 OFF THE CLOCK
06 CONTACT
```

Rankle and Plannr are the flagship project scenes.

---

## Core Stack

Confirmed:

- Next.js
- React
- TypeScript
- CSS Modules

Planned for prototype validation:

- GSAP
- ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- Drei

Potential later addition:

- Zustand, only if real cross-scene state complexity justifies it

Deployment:

- Vercel

---

## Architecture

The project intentionally has:

- no CMS
- no admin panel
- no authentication
- no database

Portfolio content is source controlled.

A core architecture rule is:

> **DOM owns meaning. WebGL owns spatial presentation.**

Meaningful content should remain semantic HTML.

WebGL is used for:

- 3D objects
- depth
- scene transitions
- atmosphere
- spatial storytelling

The primary journey is expected to use one persistent React Three Fiber canvas rather than one canvas per section.

---

## Content Model

Content should remain concise.

A major scene should generally expose no more than approximately 40–60 visible words by default, and many scenes should use less.

The portfolio should not become:

- a rewritten résumé
- a set of long public case studies
- a generic project-card grid
- a CMS-driven content site

Instead, the site should communicate through:

- composition
- motion
- typography
- custom assets
- concise metadata
- optional deeper detail

---

## Project Structure

The intended architecture is roughly:

```text
app/
  layout.tsx
  page.tsx
  resume/
    page.tsx

components/
  journey/
    Journey.tsx

    navigation/
      ChapterNavigator.tsx

    canvas/
      JourneyCanvas.tsx
      SceneController.tsx

    chapters/
      hero/
      projects/
      experience/
      education/
      off-clock/
      contact/

    scenes/
      hero/
      rankle/
      plannr/

    ui/

content/
  projects.ts
  experience.ts
  education.ts
  personal.ts
  navigation.ts

lib/
  motion/
  three/
  assets/
  accessibility/
  constants/

public/
  models/
  images/
  textures/
  fallbacks/

docs/
decisions/
```

This structure is directional rather than immutable.

Do not create folders before they are needed.

---

## Documentation

The documentation is part of the project foundation and should remain current as decisions change.

### Product

- `docs/PRD.md` — product requirements, audience, goals, non-goals, success criteria

### References and Creative Direction

- `docs/REFERENCES.md` — canonical visual references and what each contributes
- `docs/ART_DIRECTION.md` — overall creative direction and visual character
- `docs/UX.md` — one-page journey, chapter behavior, navigation, interaction model
- `docs/CONTENT.md` — copy strategy, information hierarchy, content limits
- `docs/DESIGN.md` — typography, layout, color, spacing, surface, responsive rules
- `docs/MOTION.md` — scroll choreography, motion primitives, reduced-motion behavior

### Engineering

- `docs/ARCHITECTURE.md` — software structure, DOM/WebGL boundary, client/server model
- `docs/ASSETS.md` — generated asset workflow, 3D/image strategy, optimization expectations
- `docs/ACCESSIBILITY.md` — keyboard, semantics, reduced motion, WebGL fallback, zoom, touch
- `docs/PERFORMANCE.md` — loading, WebGL budgets, quality tiers, runtime performance
- `docs/DEVELOPMENT.md` — local workflow, dependencies, branching, testing, implementation discipline
- `docs/DEPLOYMENT.md` — Vercel, previews, production cutover, redirects, launch process

### Agent Guidance

- `AGENTS.md` — durable repository-level rules for coding agents
- `CLAUDE.md` — operating guide for Claude when planning and implementing work

---

## Reference Set

Canonical references, in priority order:

1. https://clevir.li/
2. https://ethanclark.framer.ai/
3. https://bureaunine.framer.website/
4. https://porta.framer.ai/
5. https://ovo-campione.framer.website/
6. https://operator-template.framer.website/

Their roles are intentionally different:

```text
Clevir       → motion, spatial continuity, persistent 3D
Ethan Clark  → typography, composition, whitespace
Bureau Nine  → restraint, pacing, calm
Porta        → visual-first project presentation
Campione     → controlled overlap and bolder moments
Operator     → numbered chapter navigation
```

The goal is not to copy any of them.

The final portfolio should use original:

- compositions
- assets
- motion choreography
- typography decisions
- project representations
- transitions

---

## Flagship Projects

### Rankle

A daily ranking game built around committing to a ranking and comparing it with other people.

Primary scene direction:

- tier-list objects
- physical game-piece feeling
- stronger project color
- concise copy
- energetic motion

### Plannr

A product that turns syllabus information into reviewed calendar events.

Primary scene direction:

```text
SYLLABUS
→ DATES
→ REVIEW
→ CALENDAR
```

The scene should communicate that transformation visually.

---

## Accessibility

Accessibility is a first-class requirement.

The site should support:

- semantic HTML
- keyboard navigation
- visible focus
- touch interaction
- reduced-motion preferences
- sufficient contrast
- screen readers
- browser zoom
- non-WebGL fallback

Reduced motion should be a deliberately composed experience, not merely animations with durations set to zero.

---

## Performance

The site should remain fast despite its visual ambition.

Key principles:

- render meaningful DOM content before heavy assets
- use one persistent WebGL canvas
- lazy-load later scene assets
- cap DPR
- keep geometry and materials reasonable
- avoid heavy postprocessing by default
- provide static fallbacks
- simplify mobile where necessary

Visual complexity must earn its performance cost.

---

## Generated Assets

Generated assets are expected and may be produced with Astra or other approved generation tools.

Initial major asset systems should be limited to:

1. hero identity object
2. Rankle object system
3. Plannr object system

The asset workflow is:

```text
composition
→ purpose
→ brief
→ generation
→ contextual review
→ optimization
→ fallback
→ integration
```

Do not generate a large asset library before the initial visual language is validated.

---

## Development Strategy

### P0 — Foundation

Complete:

- documentation
- Next.js / React / TypeScript setup
- CSS foundation
- linting / formatting / typecheck
- semantic journey structure
- chapter navigation skeleton
- persistent canvas foundation

No polished public scenes yet.

### P1 — Creative Prototype

Build only:

- chapter navigator
- hero
- Name → Projects transition
- Rankle
- Rankle → Plannr transition
- Plannr
- mobile treatment
- reduced-motion treatment

Then stop and review.

The main question is:

> **Does this experience make someone want to keep scrolling?**

Do not fully build Experience, Education, Off the Clock, or Contact until P1 proves the direction.

---

## Development Commands

Commands will be finalized once the project is initialized.

Expected shape:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

Testing commands will be added only when the selected test tooling is justified.

---

## Branching

Recommended:

```text
main
feature/*
prototype/*
fix/*
```

`main` should remain deployable.

Prototype branches may be discarded.

---

## Deployment

The site will deploy through Vercel.

Production target:

```text
matthewblanke.com
```

The current portfolio should remain live until the new site is fully reviewed and ready for domain cutover.

Legacy routes that still matter, including Plannr-related paths, must be audited and redirected before launch.

---

## Repository Rules

Before significant work:

1. read the relevant docs
2. stay within the requested scope
3. do not invent facts
4. do not add dependencies casually
5. preserve semantic DOM content
6. treat mobile and reduced motion as first-class
7. verify visual work in context
8. update documentation when decisions change

For the complete agent rules, see:

```text
AGENTS.md
CLAUDE.md
```

---

## Current Status

The project is currently in the **documentation and foundation phase**.

The codebase should remain intentionally small until the documentation is accepted and the initial technical foundation is created.

The previous portfolio is not the implementation baseline for this project.

This repository is a fresh start.
