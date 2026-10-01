# Claude Development Guide

## Purpose

This file defines how Claude should work inside Matthew Blanke's portfolio repository.

It is not the product requirements document.

It is not the full design specification.

It is an operating guide for planning, implementing, reviewing, and reporting work in this codebase.

The goal is to keep Claude:

- aligned with the documented creative direction
- conservative about architecture
- disciplined about scope
- explicit about uncertainty
- careful with factual content
- rigorous about accessibility and performance
- useful during visual prototyping without prematurely locking the design

The core rule is:

> **Read the documentation before making the implementation decide the product.**

---

# Repository Context

This is a fresh portfolio codebase.

The project is intentionally separate from the previous portfolio implementation.

Do not assume legacy architecture, styling, infrastructure, or design patterns should be preserved.

The confirmed foundation is:

- Next.js
- React
- TypeScript

The site is designed as a:

> **single-scroll, highly art-directed interactive portfolio**

The primary public experience lives at:

```text
/
```

The project intentionally has:

- no CMS
- no admin panel
- no authentication
- no database

Content is source-controlled frontend content.

---

# Required Reading

Before significant visual or product work, read:

```text
docs/PRD.md
docs/REFERENCES.md
docs/ART_DIRECTION.md
docs/UX.md
docs/CONTENT.md
docs/DESIGN.md
docs/MOTION.md
```

Before significant engineering work, also read:

```text
docs/ARCHITECTURE.md
docs/ACCESSIBILITY.md
docs/PERFORMANCE.md
docs/DEVELOPMENT.md
```

Before asset work, read:

```text
docs/ASSETS.md
```

Before deployment work, read:

```text
docs/DEPLOYMENT.md
```

Also read:

```text
AGENTS.md
```

Treat these documents as the current source of truth.

Do not rely on assumptions from the previous portfolio.

---

# Documentation Precedence

When documents overlap, use this priority:

```text
1. Explicit current user instruction
2. docs/PRD.md
3. docs/ART_DIRECTION.md
4. docs/UX.md
5. docs/ARCHITECTURE.md
6. Specialized documentation for the task
7. AGENTS.md
8. Existing implementation
```

Existing code is not automatically correct if it conflicts with current documentation.

If code and docs conflict, identify the conflict.

Do not silently choose whichever is easier.

---

# Working Style

When given a task:

1. inspect the relevant files
2. identify the smallest correct scope
3. state assumptions only when needed
4. implement the requested change
5. verify it
6. report exactly what changed
7. identify unresolved issues or deferred work

Do not expand the task unless necessary to make it correct.

---

# Scope Discipline

Do not turn a focused task into a broad refactor.

For example, if asked to prototype the chapter navigator, do not also:

- redesign Projects
- introduce global state
- add analytics
- restructure the entire app
- add a CMS
- change deployment
- redesign typography globally

Stay within the requested milestone.

If a dependency or adjacent change is truly required, explain why.

---

# Creative Direction

The central phrase is:

> **Minimal interface. Maximum choreography.**

The base should feel:

- clean
- sleek
- spacious
- restrained
- premium

The focal moments may feel:

- intricate
- dimensional
- playful
- spatial
- technically ambitious

Do not confuse "interactive" with "busy."

Do not confuse "3D" with "good art direction."

---

# Reference Roles

Use the reference set according to its documented purpose.

## Clevir

Use for:

- scroll architecture
- spatial continuity
- persistent 3D
- scene transitions

## Ethan Clark

Use for:

- composition
- oversized typography
- negative space
- sparse copy

## Bureau Nine

Use for:

- restraint
- pacing
- quiet sections

## Porta

Use for:

- visual-first project presentation

## Campione

Use sparingly for:

- controlled overlap
- bolder layered moments

## Operator

Use for:

- chapter/index navigation logic

Do not copy:

- exact layouts
- exact camera moves
- exact assets
- exact typography
- exact motion sequences

References are principles, not templates.

---

# Visual Anti-Patterns

Do not introduce:

- generic Bento grids
- glassmorphism
- rounded-card walls
- generic gradient blobs
- fake terminals
- Matrix effects
- code wallpaper
- skill bars
- floating framework logos
- generic SaaS sections
- oversized pill-button systems
- random chrome spheres
- random glass objects
- meaningless abstract 3D
- template-like Framer layouts
- default fade-up animations everywhere

If a visual solution feels generic, stop and reconsider it.

---

# Content Discipline

Visible copy should remain concise.

A major scene should generally expose no more than approximately:

```text
40–60 visible words
```

by default.

Many scenes should use less.

Do not invent factual content.

Never invent:

- metrics
- dates
- technologies
- roles
- project status
- team size
- authorship
- academic details
- personal details

If information is uncertain, flag it.

Use verified source-controlled content where available.

---

# Flagship Projects

The primary projects are:

```text
Rankle
Plannr
```

These should receive the strongest visual treatment.

Secondary projects should remain lighter.

Do not automatically create full case-study routes or long descriptions.

---

# DOM / Canvas Boundary

Non-negotiable rule:

> **DOM owns meaning. WebGL owns spatial presentation.**

Meaningful content belongs in semantic HTML.

The canvas may own:

- 3D models
- camera
- lighting
- spatial transitions
- depth
- decorative visual behavior

Do not make essential information canvas-only.

Do not render important text solely inside WebGL.

---

# Persistent Canvas

The intended architecture uses one persistent R3F / Three.js canvas.

Do not create one canvas per chapter.

Scene modules may change, but the renderer should remain shared unless there is a compelling measured reason otherwise.

---

# Client Components

Use `"use client"` narrowly.

Do not place it at the app root for convenience.

Client boundaries are justified for:

- GSAP
- ScrollTrigger
- R3F
- browser APIs
- pointer interaction
- local interactive state

Keep normal content server-rendered where practical.

---

# State Management

Start with:

- React state
- refs
- context only where appropriate

Do not install Zustand automatically.

Add a global store only if real cross-scene state becomes difficult to manage without one.

Do not route frame-by-frame animation values through React state.

---

# Motion Rules

Motion must communicate something.

Preferred motion primitives:

- spatial transformation
- depth
- mask/reveal
- typographic movement
- proximity response
- scene-to-scene transition

Avoid:

- default fade-up system
- spring animation everywhere
- constant floating
- arbitrary parallax
- scroll hijacking
- hard scroll snapping by default
- forced playback
- long uninterruptible timelines

Each chapter should own local motion.

Do not create one massive global GSAP timeline.

---

# GSAP

If GSAP is adopted:

Use it for:

- scene choreography
- scroll-linked sequencing
- DOM transforms
- synchronized scene transitions

Do not use GSAP for trivial CSS hover states.

Prefer CSS for simple UI transitions.

---

# ScrollTrigger

If ScrollTrigger is adopted:

- clean up triggers
- support reverse scroll
- support resize
- support direct hash navigation
- avoid magic pixel assumptions
- avoid duplicate triggers
- test fast scrolling

Pinned scenes must justify the scroll distance they consume.

---

# Lenis

Lenis is provisional.

Do not assume it must stay.

If used, verify:

- keyboard behavior
- touch behavior
- anchor behavior
- reduced motion
- ScrollTrigger integration
- back/forward navigation

If it does not materially improve the experience, remove it.

---

# 3D Rules

3D assets need a clear purpose.

Good reasons:

- identity
- product explanation
- transformation
- spatial continuity
- personal still-life

Bad reasons:

- visual filler
- "because the site needs 3D"
- generic futuristic aesthetic

Do not use placeholder blobs as final design.

A primitive may be used temporarily to verify canvas lifecycle, but label it clearly as non-final.

---

# Generated Assets

Generated assets should follow:

```text
composition
→ asset purpose
→ asset brief
→ generation
→ contextual review
→ optimization
→ fallback
→ integration
```

Do not generate an asset before its role is defined.

Use `docs/ASSETS.md`.

Initial major asset systems should remain limited to:

1. hero identity object
2. Rankle object system
3. Plannr object system

Do not generate a full asset library before these prove the direction.

---

# Accessibility

Accessibility is part of implementation, not post-processing.

Every meaningful feature should consider:

- keyboard
- focus
- touch
- reduced motion
- semantic HTML
- contrast
- browser zoom
- WebGL fallback

Do not hide meaningful content behind hover.

Do not disable focus.

Do not disable pinch zoom.

Do not auto-focus sections while scrolling.

---

# Reduced Motion

Reduced motion must be intentionally composed.

Do not solve reduced motion only with:

```css
animation-duration: 0s;
```

Each motion-heavy scene should define a stable state.

If a scene depends on animation to make sense, redesign the fallback.

---

# Performance

Measure before adding complexity.

Prefer:

- one canvas
- limited materials
- simple lighting
- moderate geometry
- compressed assets
- lazy loading
- reduced mobile complexity
- no heavy postprocessing by default

Avoid:

- unlimited DPR
- 4K textures without need
- continuous rendering for inactive scenes
- many dynamic lights
- frame-by-frame React state updates

A visually simpler scene that runs well is preferable to a technically impressive one that feels heavy.

---

# Styling

Use:

```text
CSS Modules
CSS custom properties
CSS Grid
Flexbox
fluid sizing
```

Do not introduce Tailwind unless explicitly reconsidered.

Do not introduce a general UI component library.

Do not convert the codebase to a design-system framework.

---

# Component Design

Create components that represent meaningful units.

Good examples:

```text
ChapterNavigator
HeroChapter
RankleScene
PlannrScene
ProjectMeta
```

Avoid wrapper proliferation.

Do not abstract patterns that occur once.

Premature reuse is not a goal.

---

# File Changes

Before editing:

- inspect the relevant file
- inspect nearby dependencies
- understand current conventions

Do not rewrite entire files unnecessarily.

Prefer minimal diffs when quality is equal.

Do not delete unrelated code.

---

# Dependency Changes

Before adding a package, explain:

- why it is needed
- what problem it solves
- why current dependencies cannot solve it

Do not add speculative dependencies.

If installing a package, use the repository's selected package manager.

Keep the lockfile updated.

---

# Testing

Run the checks appropriate to the change.

Expected baseline once configured:

```text
lint
typecheck
build
tests
```

For visual work, also inspect:

- desktop
- mobile
- reduced motion
- keyboard
- console
- overflow

Do not claim verification that was not performed.

---

# Visual Testing

For substantial visual changes, produce evidence where tooling permits:

- desktop screenshot
- mobile screenshot
- reduced-motion screenshot
- short recording for motion

Do not judge a motion-heavy experience only from source code.

---

# Visual Lock-In

Do not add strict screenshot regression tests during exploratory design.

Only introduce visual regression after a scene has been explicitly approved.

Do not make early prototypes difficult to change.

---

# Browser Checks

At meaningful milestones, check:

- Chrome
- Safari

and mobile behavior where possible.

Do not assume WebGL, sticky behavior, or scroll choreography behaves identically everywhere.

---

# Error Discipline

Do not leave unexplained:

- console errors
- hydration warnings
- asset 404s
- WebGL warnings
- React key warnings
- build warnings

Investigate before calling work complete.

---

# Reporting

At the end of a task, report:

## Changed

Concise summary of implementation.

## Verified

Exact commands and visual states checked.

## Not Changed

Important out-of-scope areas intentionally left alone.

## Open Issues

Anything uncertain, blocked, or intentionally deferred.

Do not write an overly long self-congratulatory report.

Make it useful for review.

---

# Git

Do not:

- force push
- rewrite shared history
- merge without instruction
- delete branches unexpectedly
- push secrets

If asked to prepare a PR, keep scope coherent.

Use clear commit messages.

---

# Branch Naming

Preferred:

```text
feature/*
prototype/*
fix/*
```

Examples:

```text
prototype/hero-spatial
feature/chapter-nav
fix/mobile-overflow
```

---

# Prototype Policy

Prototype code is allowed to be less abstract than production code.

That is intentional.

During prototype phases, optimize for:

- learning
- composition
- motion quality
- interaction validation

Do not spend large amounts of time building generic infrastructure before the direction is approved.

After approval, harden deliberately.

---

# Current Prototype Boundary

The first creative prototype should focus only on:

1. chapter navigator
2. hero
3. Name → Projects transition
4. Rankle
5. Rankle → Plannr transition
6. Plannr
7. mobile treatment
8. reduced-motion treatment

Do not fully design:

- Experience
- Education
- Off the Clock
- Contact

until the first prototype has been reviewed and approved.

Simple structural placeholders may exist only if needed for navigation testing.

---

# Do Not Reuse V1 Design

The prior portfolio implementation is not the visual or architectural baseline.

Do not reintroduce:

- editorial publication shell
- magazine metaphor
- newsprint texture
- old masthead
- old selected-work wall
- old case-study layouts
- old metadata-heavy visual patterns
- admin
- Convex
- WorkOS

Verified facts and selected assets may be reused when intentionally chosen.

Implementation patterns should not be carried over by default.

---

# Decision Process

When several implementations are possible, prefer the option that:

1. best supports the documented art direction
2. preserves accessibility
3. is easier to remove
4. introduces less infrastructure
5. performs better
6. keeps content semantic
7. is easier to understand later

Do not choose complexity for technical novelty.

---

# When to Stop

Stop and ask for review when:

- a major visual direction has multiple plausible options
- a new dependency would materially shape architecture
- a generated asset would lock composition
- a scene looks substantially different from documentation
- the next step would expand beyond the current milestone
- verified content is missing
- implementation would require inventing personal/project facts

Do not fill creative uncertainty with random code.

---

# Definition of Good Work

Good work in this repository:

- looks intentional
- stays within scope
- keeps the code simple
- preserves semantic content
- respects accessibility
- measures performance
- follows the visual direction
- leaves room for iteration

The site itself may be intricate.

The implementation process should remain controlled.
