# Architecture

## Purpose

This document defines the technical architecture for Matthew Blanke's portfolio.

The portfolio is a **single-scroll interactive site** built with Next.js and React.

Its architecture should support:

- semantic HTML content
- scroll-driven interaction
- a persistent 3D scene
- project-specific motion
- strong mobile fallbacks
- reduced-motion behavior
- source-controlled content
- simple deployment
- minimal infrastructure

The central architectural rule is:

> **DOM owns meaning. WebGL owns spatial presentation.**

Important information must remain available without the 3D layer.

---

# Architectural Goals

The architecture should be:

- simple
- modular
- understandable
- easy to art-direct
- easy to prototype
- performant
- accessible
- resistant to overengineering

Avoid building infrastructure before the visual experience proves it needs it.

---

# Core Stack

Confirmed foundation:

- **Next.js**
- **React**
- **TypeScript**

Planned visual stack, pending prototype validation:

- **GSAP**
- **ScrollTrigger**
- **Lenis**
- **Three.js**
- **React Three Fiber**
- **Drei**

Potential state tool:

- **Zustand**, only if prototype complexity proves React state is insufficient

Styling:

- **CSS Modules**
- **CSS custom properties**
- standard CSS layout primitives

Hosting:

- **Vercel**

Content:

- source-controlled TypeScript objects

No backend platform is required.

---

# Explicitly Excluded Infrastructure

The portfolio intentionally does not use:

- Convex
- WorkOS
- CMS
- database
- authentication
- admin panel
- user accounts
- server-side content editing

This is a one-owner portfolio.

Content changes happen through normal source control.

---

# Primary Application Model

The site is primarily one page:

```text
/
```

The homepage contains the complete portfolio journey.

Potential utility route:

```text
/resume
```

Additional routes should be introduced only when they serve a clear product need.

Avoid rebuilding a conventional multi-page portfolio unless future usage proves it necessary.

---

# Expected Project Structure

A target structure. Application paths are relative to `src/`; `docs/` and `decisions/` live at the repository root.

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
      CanvasFallback.tsx

    chapters/
      hero/
        HeroChapter.tsx
        hero.module.css

      projects/
        ProjectsChapter.tsx
        projects.module.css

      experience/
        ExperienceChapter.tsx
        experience.module.css

      education/
        EducationChapter.tsx
        education.module.css

      off-clock/
        OffClockChapter.tsx
        off-clock.module.css

      contact/
        ContactChapter.tsx
        contact.module.css

    scenes/
      hero/
        HeroScene.tsx

      rankle/
        RankleScene.tsx

      plannr/
        PlannrScene.tsx

    ui/
      SceneLabel.tsx
      ProjectMeta.tsx
      ExternalLink.tsx

content/
  projects.ts
  experience.ts
  education.ts
  personal.ts
  navigation.ts

lib/
  motion/
    scroll.ts
    gsap.ts
    reduced-motion.ts

  three/
    scene-state.ts
    quality.ts
    loaders.ts

  assets/
    registry.ts

  accessibility/
    preferences.ts

  constants/
    routes.ts
    breakpoints.ts

public/
  models/
  images/
  textures/
  fallbacks/

docs/
  ...

decisions/
  ...
```

This is a direction, not an immutable structure.

Do not create folders before they are needed.

---

# Server vs. Client Architecture

Next.js should remain server-first where practical.

Most content should render as server components.

Examples:

- headings
- descriptions
- metadata
- links
- experience content
- education labels
- contact links

Client components should be introduced only where required for:

- chapter navigation state
- scroll orchestration
- GSAP timelines
- R3F canvas
- pointer interaction
- scene state

Do not add `"use client"` high in the tree without a specific reason.

---

# DOM Responsibility

The DOM is the source of truth for meaningful content.

The DOM should contain:

- H1/H2/H3 structure
- project names
- project descriptions
- role/company names
- academic content
- links
- buttons
- navigation
- contact information
- accessible labels

The DOM should remain understandable if:

- JavaScript fails
- WebGL fails
- 3D models fail
- animations are disabled

---

# WebGL Responsibility

WebGL should own only spatial/visual enhancement.

Examples:

- hero sculpture
- Rankle 3D objects
- Plannr document/calendar transformation
- decorative spatial transitions
- depth
- lighting
- object choreography

WebGL should not own essential text.

Avoid rendering meaningful copy as 3D text unless the same information exists in accessible DOM content.

---

# Persistent Canvas Architecture

Use **one persistent R3F canvas** for the main journey.

Conceptually:

```text
<Journey>
  <JourneyCanvas />
  <JourneyDOM />
  <ChapterNavigator />
</Journey>
```

The canvas may be:

- fixed
- full-viewport
- layered behind or between DOM content

depending on the final composition.

Do not create one independent canvas per chapter.

Benefits:

- one WebGL context
- shared lighting
- shared renderer
- continuity between scenes
- lower setup overhead
- easier object transitions
- centralized performance management

---

# Scene Controller

A central scene controller should coordinate the persistent canvas.

Responsibilities may include:

- current chapter
- active scene
- chapter progress
- visibility of scene objects
- shared camera state
- device quality tier
- reduced-motion state

Keep this controller small.

Do not create a giant scene state machine unless the prototype proves it necessary.

---

# Scene Isolation

Each major 3D scene should remain modular.

Examples:

```text
HeroScene
RankleScene
PlannrScene
```

Each scene owns:

- its objects
- its materials
- its local transformation logic
- its asset references

The global controller should not contain project-specific geometry details.

---

# Scroll Architecture

Each chapter should own local scroll progress.

Conceptually:

```text
Hero        0 → 1
Rankle      0 → 1
Plannr      0 → 1
Experience  0 → 1
Education   0 → 1
OffClock    0 → 1
Contact     0 → 1
```

Avoid one giant global GSAP timeline.

Preferred model:

- each chapter initializes its own ScrollTrigger/timeline
- global state only tracks high-level chapter/scene status
- transitions between chapters are explicitly coordinated

This makes:

- debugging easier
- responsive behavior easier
- cleanup safer
- scene ownership clearer

---

# GSAP Architecture

GSAP should own:

- choreographed DOM transforms
- scene transition timelines
- scroll-linked sequencing
- synchronized DOM/WebGL transitions

Potential organization:

```text
lib/motion/gsap.ts
components/journey/chapters/*/useChapterMotion.ts
```

or a similar local pattern.

Do not create a universal animation abstraction before actual repetition exists.

---

# ScrollTrigger Architecture

ScrollTrigger may coordinate:

- chapter activation
- local progress
- pinning
- scrubbed timelines
- transition thresholds

Requirements:

- timelines clean up on unmount
- resize behavior remains correct
- direct hash navigation works
- reverse scrolling works
- reduced motion can bypass complex triggers
- mobile behavior can differ

Do not depend on magic hard-coded page pixel values.

---

# Lenis Architecture

Lenis is provisional.

If used:

- create one instance
- integrate cleanly with GSAP/ScrollTrigger
- preserve anchor navigation
- preserve keyboard scrolling
- disable or simplify under reduced-motion if appropriate
- test touch carefully

Do not create multiple scroll containers.

If Lenis adds little value, remove it.

---

# State Management

Start with normal React state.

Potential state categories:

- current chapter
- navigator open/closed
- reduced-motion preference
- scene quality tier
- canvas readiness

Do not add Zustand initially.

Zustand becomes justified only if:

- distant components need frequent synchronized scene state
- prop/context relationships become difficult
- persistent canvas and DOM need shared high-frequency state
- state remains conceptually simple but globally consumed

Do not use a global store merely because the reference repo uses one.

---

# High-Frequency Animation State

Do not push frame-by-frame animation state through React renders.

For high-frequency values:

- use refs
- use GSAP
- use R3F `useFrame`
- use Three.js object properties
- use motion-specific stores only if necessary

React state should represent meaningful application states, not every animation frame.

---

# Content Architecture

All content is source-controlled.

Potential model:

```ts
export const projects = [
  {
    id: "rankle",
    title: "Rankle",
    summary: "...",
    stack: ["Next.js", "Supabase"],
    href: "...",
    source: "...",
  },
]
```

Separate content from composition.

Content files should not contain:

- animation values
- camera values
- CSS class names
- layout coordinates

Those belong to presentation code.

---

# Content Files

Expected:

```text
content/projects.ts
content/experience.ts
content/education.ts
content/personal.ts
content/navigation.ts
```

Only create files that earn their existence.

Content should remain easy to edit manually.

---

# Asset Registry

Generated assets should be registered centrally.

Potential:

```ts
export const assets = {
  hero: {
    model: "/models/hero-mb.glb",
    fallback: "/fallbacks/hero-mb.webp",
  },
}
```

Benefits:

- one place to track paths
- easier fallback handling
- easier optimization audits
- easier asset replacement

See `ASSETS.md`.

---

# Asset Loading

Heavy assets should not block initial meaningful content.

Priority:

1. HTML
2. typography/layout
3. hero fallback
4. hero 3D
5. near-future project assets
6. later chapter assets

Use lazy loading / preloading intentionally.

Do not preload every GLB at page start.

---

# Model Loading

Prefer:

- GLB
- compressed geometry where useful
- optimized textures
- controlled material count

R3F/Drei loaders may be used.

Loading failure must resolve to a static fallback rather than a broken empty scene.

---

# Fallback Architecture

Every major 3D scene should have a fallback.

Potential hierarchy:

```text
Full WebGL
↓
Simplified WebGL
↓
Generated static image
↓
DOM-only composition
```

The site should not fail visually because one model cannot load.

---

# Quality Tiers

The runtime may eventually support quality tiers.

Conceptually:

## Full

- capable desktop
- full 3D
- richer lighting
- pointer response

## Reduced

- mobile / weaker hardware
- lower DPR
- simplified models/effects

## Static

- reduced motion
- WebGL unavailable
- severe performance constraints

Do not build a complicated device detection system prematurely.

Start with simple capability/responsive decisions.

---

# Styling Architecture

Prefer CSS Modules for chapter/component-local styles.

Use global CSS only for:

- reset
- tokens
- typography foundation
- root behavior
- global accessibility helpers

Avoid one giant global stylesheet.

---

# CSS Custom Properties

Use custom properties for shared design values.

Examples:

```css
--color-bg
--color-ink
--color-muted

--space-sm
--space-md
--space-lg

--z-scene
--z-content
--z-nav
```

Do not over-tokenize every value.

Only promote values that genuinely recur.

---

# Layer Architecture

Use named layer tokens.

Example:

```text
base
canvas
display type
content
navigation
overlay
```

Avoid arbitrary z-index escalation.

The persistent canvas should have an explicit relationship to DOM layers.

---

# Layout Architecture

Use normal layout primitives first:

- CSS Grid
- Flexbox
- block flow
- sticky/pinned regions where needed

Absolute positioning should be reserved for art-directed internal scene composition.

Avoid building the whole page through absolute coordinates.

---

# Chapter Components

Each chapter should own:

- semantic section wrapper
- chapter ID
- local DOM content
- local layout
- local motion setup
- responsive behavior

Example:

```tsx
<section id="projects" aria-labelledby="projects-heading">
```

The chapter structure should remain understandable even without animation.

---

# Navigation Architecture

The chapter navigator should consume a single source of truth.

Potential:

```ts
export const chapters = [
  { id: "name", label: "Name", number: "01" },
  { id: "projects", label: "Projects", number: "02" },
  ...
]
```

Use the same source for:

- navigator
- IDs
- active chapter matching
- optional analytics later

Avoid duplicated chapter labels.

---

# Active Chapter Detection

Potential strategies:

- IntersectionObserver
- ScrollTrigger callbacks
- hybrid approach

Choose the simplest robust method during prototyping.

Requirements:

- stable near boundaries
- supports reverse scroll
- works after resizing
- supports direct hash entry
- does not flicker rapidly

---

# URL / Hash Behavior

Chapter navigation should use meaningful hashes.

Examples:

```text
/#projects
/#experience
```

The application should handle:

- direct load on a hash
- browser back
- browser forward
- copy/paste URLs

Do not use custom state that makes the URL lie about the current location.

---

# Resume Route

The likely `/resume` route should remain simple.

Potential implementation:

- HTML resume
- PDF download
- both

Do not make the resume route depend on WebGL.

It should load quickly and print cleanly if HTML-based.

---

# Metadata and SEO

Next.js metadata should define:

- title
- description
- canonical URL
- Open Graph metadata
- favicon/icons

Important content should remain server-rendered where possible.

Do not hide the entire portfolio behind a client-only render.

---

# Error Handling

The portfolio should fail gracefully.

Potential failures:

- model load failure
- WebGL failure
- image failure
- script failure

Fallback behavior should preserve:

- content
- navigation
- project links
- contact links

Do not display technical error UI to normal visitors unless unavoidable.

---

# Loading States

Avoid heavy loading UI.

Prefer:

- reserved composition
- static fallback
- progressive enhancement

Do not use:

- percent loader
- fake terminal loader
- intro animation gate
- spinner over the whole page

---

# Testing Architecture

Testing should focus on stable product behavior.

Good tests:

- semantic structure
- content presence
- chapter navigation
- hash routing
- reduced-motion behavior
- fallback content
- no overflow
- accessibility
- asset registration
- route behavior

Avoid brittle tests for:

- exact pixel positions
- exact animation intermediate frames
- exact GSAP timeline internals
- decorative values

Visual regression should be used selectively after major compositions are approved.

---

# Dependency Policy

Dependencies must have a concrete role.

Likely initial dependencies:

```text
next
react
react-dom
typescript
```

Planned after validation:

```text
gsap
lenis
three
@react-three/fiber
@react-three/drei
```

Do not add:

- component libraries
- icon packages
- animation libraries
- state libraries
- utility frameworks

without an actual need.

---

# No UI Component Library by Default

Do not introduce:

- shadcn
- Material UI
- Chakra
- Mantine
- similar general component systems

The public interface is too art-directed to benefit from a generic component library.

Simple accessible primitives can be built directly.

---

# No CMS

Content lives in Git.

Reasons:

- one author
- infrequent updates
- stronger type safety
- less infrastructure
- easier deployment
- no authentication requirement
- no backend dependency
- simpler mental model

This is an architectural decision, not a temporary omission.

---

# No Authentication

There is no admin interface.

There are no user-specific experiences.

There is no reason to maintain auth middleware, sessions, or user accounts.

Do not introduce authentication unless the product requirements change materially.

---

# No Database

The portfolio does not require persistent application data.

Do not introduce:

- Postgres
- Supabase database
- Convex
- Firebase

for portfolio content management.

Project products may themselves use those technologies; the portfolio does not.

---

# Analytics

Analytics are optional and should be added later.

Potential:

- Vercel Analytics
- Speed Insights

Do not let analytics become a P0/P1 blocker.

Avoid invasive tracking.

---

# Environment Variables

The site should require very few or no secrets initially.

Potential future environment variables may include analytics configuration.

Do not create `.env` complexity without need.

---

# Development Boundaries

The first prototype should not implement the entire target architecture.

P0 should establish:

- Next.js foundation
- CSS system
- semantic homepage
- chapter source of truth
- empty/placeholder persistent canvas
- navigator prototype

P1 should validate:

- R3F
- GSAP
- ScrollTrigger
- Lenis if useful
- hero
- Rankle
- Plannr

Only then should later chapter architecture expand.

---

# Architectural Anti-Patterns

Avoid:

## One Giant Client Component

Do not make the entire app a single `"use client"` page.

## One Giant GSAP Timeline

Keep chapter motion modular.

## Canvas-Only Site

Meaningful content belongs in the DOM.

## Multiple WebGL Contexts

Prefer one persistent canvas.

## Premature Global Store

Start with React state.

## CMS Overengineering

No backend for content.

## Animation-Driven Layout

Normal CSS should establish the base composition.

## Random Absolute Coordinates

Use grid/layout primitives for structure.

## Dependency Accumulation

Install tools only when needed.

## Framework Reimplementation

Use Next.js strengths instead of rebuilding routing, metadata, and image handling manually.

---

# Architecture Review Checklist

Before approving a new technical pattern, ask:

### Does this make the experience easier to build?

If no, reject it.

### Does it introduce infrastructure the product does not need?

If yes, reject it.

### Does meaningful content remain in the DOM?

If no, redesign it.

### Does it work without WebGL?

If no, add fallback.

### Does it force high-level client rendering?

If yes, find a narrower boundary.

### Is this state really application state?

If no, keep it in the motion/scene layer.

### Does this dependency solve a concrete problem?

If no, do not install it.

### Can this remain local to one chapter?

If yes, avoid global abstraction.

### Will this still make sense six months later?

If no, simplify it.

---

# Open Architectural Decisions

Settled during P0: Next.js 16 (App Router, `src/` directory) and pnpm.

These should remain unresolved until prototyping:

- whether Lenis remains
- whether Zustand becomes necessary
- exact global/client component boundary
- exact scene-controller API
- active-chapter detection strategy
- whether hero canvas initializes immediately or lazily
- exact quality-tier strategy
- exact model compression pipeline
- whether `/resume` is HTML, PDF, or both
- whether any project detail route is eventually justified

Do not resolve these through speculation alone.

---

# Final Architecture Standard

The final system should feel much simpler than the visual experience it produces.

The architecture is successful if:

- the public site feels complex and polished
- the codebase remains understandable
- content is easy to update
- visual scenes remain isolated
- motion is modular
- 3D is centralized
- fallbacks are obvious
- infrastructure is minimal

The desired outcome is:

> **high visual complexity built on low operational complexity.**
