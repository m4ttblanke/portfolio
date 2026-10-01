<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Rules

## Purpose

This file defines repository-level rules for any coding agent working on Matthew Blanke's portfolio.

It should remain concise, durable, and focused on the project's non-negotiable architecture and design constraints.

For detailed product and design intent, read the documents in `docs/`.

---

# Product

This repository contains a single-scroll interactive personal portfolio built with:

- Next.js
- React
- TypeScript

The primary public experience lives at:

```text
/
```

The site is designed as one continuous journey rather than a conventional multi-page portfolio.

---

# Planning Before Implementation

For medium and large implementation tasks, produce a concise implementation
plan and wait for review before modifying code.

Planning is required when a task involves one or more of:

- multiple files or subsystems
- new architecture or data/state flow
- new dependencies
- new routes or major components
- substantial UI or UX work
- significant motion, Three.js, or WebGL work
- cross-cutting accessibility or performance changes
- refactors that materially change existing structure

Planning is not required for small, localized work such as:

- typo or copy fixes
- small styling adjustments
- obvious one-file bug fixes
- minor configuration fixes
- similarly low-risk maintenance

When it is unclear whether a task is small or medium, prefer planning first.

A plan should be proportional to the task. Do not create an elaborate
planning phase for straightforward work.

During the planning phase:

- do not modify files
- do not install dependencies
- do not commit or push
- do not open or merge a pull request

Wait for explicit approval of the plan before implementation.

---

# Read Before Significant Work

Before making substantial changes, read the relevant documentation.

At minimum for visual or interaction work:

```text
docs/PRD.md
docs/ART_DIRECTION.md
docs/UX.md
docs/DESIGN.md
docs/MOTION.md
```

For engineering changes, also read:

```text
docs/ARCHITECTURE.md
docs/DEVELOPMENT.md
docs/PERFORMANCE.md
docs/ACCESSIBILITY.md
```

For generated or 3D assets, also read:

```text
docs/ASSETS.md
```

For deployment changes, read:

```text
docs/DEPLOYMENT.md
```

Do not silently contradict the documentation.

If a requested change conflicts with it, identify the conflict and either:

1. follow the existing documented direction, or
2. update the relevant documentation as part of the change.

---

# Architecture

## Content

Portfolio content is source-controlled.

There is intentionally:

- no CMS
- no admin panel
- no authentication
- no database

Do not add any of these without an explicit product-level decision.

---

## DOM and WebGL

The core rule is:

> **DOM owns meaning. WebGL owns spatial presentation.**

Meaningful content must exist in semantic HTML.

WebGL may enhance:

- visual identity
- 3D objects
- depth
- transitions
- atmosphere

Do not place essential information only inside a canvas.

---

## Canvas

Use one persistent React Three Fiber / Three.js canvas for the primary journey.

Do not create a separate WebGL canvas for every chapter.

---

## Client Boundaries

Keep the application server-first where practical.

Use `"use client"` only where required for:

- interaction
- browser APIs
- GSAP
- R3F
- scene state
- pointer behavior

Do not turn the full app into a client component for convenience.

---

## State

Start with React state, refs, and local component ownership.

Do not introduce Zustand or another global state library unless real cross-scene complexity justifies it.

Do not push frame-by-frame animation state through React renders.

---

# Visual Direction

The guiding phrase is:

> **Minimal interface. Maximum choreography.**

The visual system should be:

- clean
- sleek
- spacious
- spatial
- restrained
- highly art-directed

Complexity should appear in:

- motion
- composition
- custom assets
- spatial relationships

not in UI chrome.

---

# Avoid Generic Portfolio Patterns

Do not introduce:

- generic project-card grids
- Bento layouts
- glassmorphism
- floating gradient blobs
- fake terminals
- hacker aesthetics
- Matrix effects
- skill bars
- contribution graphs as decoration
- logo clouds
- generic SaaS sections
- repetitive rounded cards
- excessive badges
- long case-study walls of text

---

# Typography

Typography should be structural.

Large display type may:

- define the viewport
- overlap imagery
- crop against edges
- become part of transitions

Do not inherit typography from the previous portfolio by default.

Exact typefaces remain open until prototyping establishes them.

---

# Content

Visible copy must remain concise.

A major scene should generally expose no more than approximately:

```text
40–60 words
```

by default.

Many scenes should use less.

Do not invent:

- project metrics
- roles
- dates
- technologies
- authorship
- academic facts
- personal facts

If a claim is uncertain, leave it uncommitted until verified.

Do not turn the homepage into a résumé.

---

# Projects

Rankle and Plannr are the flagship projects.

They should receive the strongest project treatment.

Secondary projects should remain lighter and should only appear when they contribute a distinct signal.

Do not create mini case studies for every project.

---

# Motion

Motion must communicate change.

Do not implement a default fade-up system.

Do not animate every section merely because it enters the viewport.

Prefer:

- spatial transformation
- mask/reveal
- typographic movement
- depth
- meaningful project transitions
- selective proximity response

Avoid:

- scroll hijacking
- forced snap scrolling
- excessive spring behavior
- constant looping motion
- decorative animation with no narrative role

Each chapter should own local motion rather than relying on one giant global GSAP timeline.

---

# Reduced Motion

Reduced motion is a first-class design state.

Do not merely set all durations to zero.

Each motion-heavy scene must have a deliberate static or minimally animated composition.

The full portfolio must remain understandable under:

```text
prefers-reduced-motion: reduce
```

---

# Accessibility

Accessibility is not optional.

Requirements include:

- semantic headings
- keyboard access
- visible focus
- touch-safe interactions
- reduced-motion support
- sufficient contrast
- meaningful content outside WebGL
- accessible chapter navigation
- sensible reading order

Do not hide essential content behind hover.

Do not disable pinch zoom.

Do not hide focus.

---

# Performance

Visual ambition must not compromise usability.

Prefer:

- one persistent canvas
- lazy-loaded heavy assets
- compressed models
- limited materials
- reasonable DPR
- simple lighting
- minimal postprocessing
- static fallbacks

Do not preload every scene asset at startup.

Do not add expensive effects without measuring them.

---

# Generated Assets

Generated assets are allowed and expected.

Potential sources include Astra or other approved generation workflows.

Every major asset must have:

- a clear purpose
- a scene role
- a fallback strategy
- a performance justification

Do not generate assets before the scene composition and asset brief exist.

Do not use generic:

- chrome blobs
- glass spheres
- random primitives
- stock futuristic objects

---

# Styling

Use:

- CSS Modules
- CSS custom properties
- CSS Grid
- Flexbox
- fluid sizing

Do not introduce Tailwind or a UI framework without an explicit architectural decision.

Do not create a giant global stylesheet.

---

# Dependencies

Do not add dependencies casually.

A new dependency must solve a current, specific problem.

Avoid overlapping tools.

Do not introduce by default:

- Framer Motion
- shadcn/ui
- Material UI
- Chakra
- Redux
- CMS SDKs
- auth SDKs
- backend clients

Likely planned visual dependencies are:

```text
GSAP
ScrollTrigger
Lenis
Three.js
React Three Fiber
Drei
```

These should still be validated through prototype work.

---

# Components

Prefer local, understandable components.

Extract a component when it has a meaningful reason to exist.

Do not create abstraction layers before repetition exists.

Avoid:

- giant files
- giant shared utility modules
- wrapper components with no behavior
- generic design-system infrastructure that the project does not need

---

# Testing

Test stable behavior.

Prioritize:

- semantic structure
- chapter navigation
- hash navigation
- reduced-motion behavior
- fallback content
- accessibility
- route behavior
- production build

Do not create brittle tests for exact animation frames or unstable visual details during early prototyping.

Do not lock visual design with screenshot regression tests before the creative direction is approved.

---

# Visual Review

Substantial visual work must be reviewed at minimum at:

- desktop
- mobile
- reduced motion

When motion is central, use a short screen recording or preview deployment in addition to screenshots.

A feature is not done because it works at one desktop width.

---

# Mobile

Mobile is a separate composition, not a compressed desktop design.

It may use:

- reduced 3D complexity
- alternate object layout
- static fallbacks
- simpler interactions

Do not preserve desktop spectacle at the expense of mobile quality.

---

# Repository Scope

This is a new portfolio codebase.

Do not copy implementation patterns from the previous portfolio simply because they already exist.

Reuse only explicitly selected:

- verified content
- links
- screenshots/assets
- redirects
- factual evidence

Do not reintroduce the previous portfolio's:

- editorial shell
- publication metaphors
- admin
- Convex
- WorkOS
- old case-study layouts
- legacy design system

---

# Development Workflow

Recommended branches:

```text
main
feature/*
prototype/*
fix/*
```

`main` should remain deployable.

Prototype branches may be discarded.

Use pull requests for meaningful changes.

For substantial PRs, include:

- what changed
- why
- screenshots/video where relevant
- testing performed
- known limitations

---

# Build Quality

Before merging production-bound work, verify:

- lint
- typecheck
- production build
- relevant tests
- no unexplained console errors
- no hydration warnings
- no broken asset requests

Visual work also requires visual review.

---

# Documentation

Documentation is part of the product.

Update documentation when decisions change.

Do not allow code and docs to drift silently.

Relevant docs:

```text
docs/PRD.md
docs/REFERENCES.md
docs/ART_DIRECTION.md
docs/UX.md
docs/CONTENT.md
docs/DESIGN.md
docs/MOTION.md
docs/ARCHITECTURE.md
docs/ASSETS.md
docs/ACCESSIBILITY.md
docs/PERFORMANCE.md
docs/DEVELOPMENT.md
docs/DEPLOYMENT.md
```

---

# Architecture Decision Records

Use `decisions/` for major cross-cutting choices.

Good ADR topics:

- one persistent canvas
- no CMS
- GSAP as primary motion system
- adoption of Zustand if it becomes necessary
- major fallback strategy changes

Do not create ADRs for minor implementation details.

---

# Scope Discipline

Do not expand the requested task unnecessarily.

If implementing a hero prototype, do not also:

- redesign Contact
- add a CMS
- refactor unrelated content
- change deployment architecture
- add multiple speculative libraries

Prefer the smallest change that proves the intended idea.

---

# Prototype Sequence

The first creative prototype should focus on:

1. chapter navigator
2. hero
3. hero-to-projects transition
4. Rankle
5. Rankle-to-Plannr transition
6. Plannr
7. mobile treatment
8. reduced-motion treatment

Do not fully implement Experience, Education, Off the Clock, or Contact before the initial visual direction is approved.

---

# Decision Standard

When uncertain, prefer the option that is:

- simpler
- more accessible
- easier to measure
- easier to remove
- more aligned with the documented art direction
- less dependent on infrastructure

The codebase should remain calmer than the experience it creates.
