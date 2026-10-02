# Development

## Purpose

This document defines the engineering workflow for Matthew Blanke's portfolio.

The project should remain easy to understand, easy to change, and difficult to accidentally overengineer.

The site is visually ambitious, but the development process should be disciplined and boring where possible.

The central principle is:

> **Prototype creatively. Engineer conservatively.**

This document covers:

- local development
- package management
- coding conventions
- branching
- pull requests
- testing
- dependency policy
- asset workflow
- documentation updates
- development checkpoints

---

# Project Philosophy

The portfolio should not become a framework experiment.

Use the simplest implementation that supports the intended experience.

Prefer:

- clear code
- local ownership
- small components
- explicit data
- measured abstractions
- stable dependencies

Avoid:

- premature infrastructure
- speculative abstractions
- generalized systems before repetition exists
- unnecessary backend work
- unrelated tooling

---

# Package Manager

Preferred:

```text
pnpm
```

Reasons:

- fast installs
- efficient disk usage
- strict dependency resolution
- good monorepo support if ever needed

Use one package manager consistently.

Commit the lockfile.

Do not mix:

- npm
- yarn
- pnpm

within the project.

---

# Node Version

Use a current LTS Node.js release compatible with the selected Next.js version.

Pin the expected version through one of:

```text
.nvmrc
```

or:

```text
package.json engines
```

or the chosen project-standard equivalent.

Do not depend on an undocumented local Node version.

---

# Initial Stack

Confirmed:

```text
Next.js
React
TypeScript
CSS Modules
```

Planned for prototype validation:

```text
GSAP
ScrollTrigger
Lenis
Three.js
@react-three/fiber
@react-three/drei
```

Potential later dependency:

```text
Zustand
```

only if actual state complexity requires it.

---

# Dependency Policy

Do not install a dependency because it might be useful later.

A dependency must solve a current, specific problem.

Before adding one, ask:

1. What exact problem does this solve?
2. Can the platform or current stack already solve it?
3. Does it overlap with an existing dependency?
4. What bundle/runtime cost does it add?
5. Does it complicate maintenance?

If the answer is weak, do not install it.

---

# Avoided Dependencies

Do not introduce by default:

- component libraries
- icon libraries
- second animation libraries
- second smooth-scroll libraries
- CMS SDKs
- auth SDKs
- backend clients
- large utility frameworks
- global state libraries

Examples not currently desired:

- Framer Motion
- shadcn/ui
- Material UI
- Chakra
- Convex
- WorkOS
- Supabase for portfolio content
- Firebase
- Redux

These may only be reconsidered if product requirements materially change.

---

# Project Initialization

The project should be initialized as a clean Next.js application.

Preferred defaults:

- TypeScript
- App Router
- ESLint
- source directory only if it clearly improves organization
- no Tailwind by default

Do not carry files from the previous portfolio unless they are explicitly selected for reuse.

This is a new codebase.

---

# Repository Cleanliness

The repository should contain only:

- active source code
- production assets
- project documentation
- tests
- required configuration

Do not keep:

- abandoned experiments
- large raw asset exports
- duplicate images
- generated build output
- temporary screenshots
- personal files
- secrets

Use `.gitignore` aggressively for local/generated artifacts.

---

# Formatting

Use automated formatting.

Preferred:

- Prettier

Formatting should be deterministic.

Do not spend code review time debating whitespace.

If an additional formatter is unnecessary, do not add one.

---

# Linting

Use ESLint with Next.js/TypeScript rules.

Linting should catch:

- invalid React patterns
- common TypeScript issues
- unused code
- problematic imports
- accessibility issues where appropriate

Do not create an enormous custom lint configuration.

Start close to framework defaults and add only rules with clear value.

---

# TypeScript

Use strict TypeScript.

Prefer:

- explicit data shapes
- inferred local values
- narrow types
- readonly content where useful

Avoid:

- `any`
- giant shared interfaces
- unnecessary generics
- type complexity that exceeds runtime complexity

Content types should remain simple.

---

# Import Organization

Use stable path aliases if useful.

Example:

```text
@/components
@/content
@/lib
```

Do not create many custom aliases.

Keep import paths understandable.

---

# Naming

## Components

Use PascalCase.

```text
ChapterNavigator.tsx
HeroScene.tsx
RankleScene.tsx
```

## Hooks

Use:

```text
useSomething
```

## CSS Modules

Use:

```text
component-name.module.css
```

or one consistent project-wide variant.

## Content Files

Use lowercase descriptive names.

```text
projects.ts
experience.ts
education.ts
```

---

# Component Design

Components should have a clear reason to exist.

Extract a component when:

- it represents a meaningful visual/semantic unit
- it is reused
- the parent becomes difficult to understand
- it owns distinct logic

Do not extract every small DOM fragment.

Avoid a component tree made of wrappers with no behavior or semantics.

---

# Client Components

Use `"use client"` narrowly.

Good reasons:

- interaction
- browser APIs
- GSAP
- R3F
- local state
- pointer input

Bad reason:

- convenience

Do not turn the entire homepage into one client component.

---

# CSS Development

Use CSS Modules for chapter/component styles.

Global CSS should contain only shared concerns such as:

- reset
- base typography
- tokens
- body/root behavior
- accessibility utilities

Prefer:

- CSS Grid
- Flexbox
- logical properties
- fluid sizing
- `clamp()`

Avoid:

- large inline style objects
- utility-class sprawl
- random hard-coded absolute coordinates as the primary layout system

---

# Design Tokens

Use CSS custom properties for recurring values.

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

Do not create a massive design-token framework before the design is stable.

---

# Content Development

Portfolio content should live outside visual components when practical.

Example:

```text
content/projects.ts
content/experience.ts
content/education.ts
content/personal.ts
```

Visual components should consume structured content.

Do not hard-code the same project facts in several components.

---

# Factual Content

Do not invent:

- dates
- technologies
- metrics
- roles
- project status
- team size
- authorship

If a fact is uncertain, mark it for verification rather than filling it in.

See `CONTENT.md`.

---

# Branch Strategy

Keep branching simple.

Recommended:

```text
main
feature/*
prototype/*
fix/*
```

## `main`

Must remain deployable.

## `feature/*`

Normal scoped implementation.

Examples:

```text
feature/chapter-nav
feature/rankle-scene
```

## `prototype/*`

Experimental visual work that may be discarded.

Examples:

```text
prototype/hero-spatial
prototype/plannr-transform
```

## `fix/*`

Focused bug or accessibility/performance fixes.

---

# Commit Strategy

Commits should be understandable.

Prefer commits that represent one coherent change.

Examples:

```text
feat: add chapter navigator foundation
feat: prototype hero canvas
fix: preserve hash navigation with reduced motion
docs: define Rankle asset brief
perf: reduce hero model texture size
```

Avoid:

```text
stuff
changes
final
fixes
wip123
```

Temporary WIP commits are acceptable locally, but clean history before important merge points when practical.

---

# Pull Requests

Use pull requests for meaningful work.

A PR should explain:

- what changed
- why
- screenshots/video when visual
- testing performed
- known limitations
- documentation changes
- follow-up work intentionally excluded

Keep PRs scoped.

Do not combine:

- hero redesign
- dependency migration
- resume changes
- performance refactor

into one enormous PR without necessity.

---

# Visual PR Evidence

For substantial visual work, include:

- desktop screenshot
- mobile screenshot
- reduced-motion screenshot or note
- short screen recording when motion is central

The purpose is to review actual composition, not infer visual quality from code.

---

# Prototype PRs

Prototype branches may be intentionally disposable.

Prototype code does not need production abstraction quality.

It must still avoid:

- dangerous hacks
- secrets
- inaccessible structure
- impossible-to-clean architecture

The purpose of a prototype is to answer a design question quickly.

After approval, productionize deliberately.

---

# Documentation-First Changes

Major architectural or creative changes should update docs before or alongside implementation.

Relevant documents include:

- `PRD.md`
- `ART_DIRECTION.md`
- `UX.md`
- `MOTION.md`
- `ARCHITECTURE.md`
- `ASSETS.md`

If implementation contradicts documentation, either:

1. implementation is wrong, or
2. documentation needs an explicit update

Do not allow them to drift silently.

---

# Architecture Decisions

Use lightweight ADRs for important irreversible or cross-cutting choices.

Directory:

```text
decisions/
```

Suggested format:

```md
# 001 — Use One Persistent R3F Canvas

## Context

...

## Decision

...

## Why

...

## Consequences

...
```

Use ADRs for decisions such as:

- one persistent canvas
- no CMS
- GSAP over alternate animation systems
- adoption of Zustand if it happens
- a major rendering/fallback strategy

Do not create ADRs for minor implementation details.

---

# Testing Philosophy

Test behavior that should remain stable.

Avoid testing artistic implementation details too early.

Good tests:

- chapter links exist
- navigation updates correctly
- anchors work
- reduced-motion path exists
- content renders
- fallback renders
- routes resolve
- semantic headings are correct
- no critical accessibility violations

Avoid brittle tests for:

- exact transform values
- exact frame positions
- exact GSAP timeline internals
- exact pixel layout during early visual iteration

---

# Unit Tests

Use unit tests only where logic justifies them.

Potential candidates:

- chapter state utilities
- content parsing/helpers
- asset registry logic
- quality-tier utilities

Do not unit-test static JSX for its own sake.

---

# Integration / Browser Tests

Browser tests may be valuable for:

- chapter navigation
- hash routing
- direct deep links
- disclosures
- reduced-motion behavior
- keyboard interaction
- responsive menu behavior

Choose a browser-testing tool only when enough behavior exists to justify it.

Do not install Playwright on day one unless the project immediately needs it.

---

# Accessibility Testing

During development, check:

- semantic headings
- keyboard access
- focus
- reduced motion
- contrast
- touch targets
- canvas independence

Automated tools can help, but manual testing is required.

See `ACCESSIBILITY.md`.

---

# Visual Regression

Do not create strict screenshot regression tests before the art direction is approved.

Early visual work should remain easy to change.

Once major scenes are stable, visual regression can protect:

- approved hero states
- chapter navigation
- mobile compositions
- static reduced-motion states

Do not lock experimental pixels prematurely.

---

# Performance Testing

Performance checks should happen throughout 3D development.

After adding a major scene, inspect:

- model size
- texture size
- frame rate
- draw calls
- bundle impact
- mobile behavior

Do not wait until launch to discover that the visual stack is too heavy.

---

# Browser Support

Target current major evergreen browsers.

At minimum:

- Chrome
- Safari
- Firefox
- Edge

Mobile:

- Safari on iOS
- Chrome on Android

Do not spend major effort supporting obsolete browsers unless analytics later justify it.

---

# Development Viewports

At minimum review:

```text
1440px desktop
typical laptop width
tablet
390px mobile
small mobile
```

Do not design only at one desktop width.

---

# Local Development Scripts

Expected scripts may include:

```json
{
  "dev": "...",
  "build": "...",
  "start": "...",
  "lint": "...",
  "typecheck": "...",
  "test": "..."
}
```

Only add scripts once the relevant tooling exists.

Keep names conventional.

---

# Build Requirement

Before merging to `main`, the project should pass:

- production build
- lint
- typecheck
- relevant tests

Visual review is also required for visual changes.

---

# CI

CI should remain small.

Initial checks may include:

- install
- lint
- typecheck
- production build

Add tests when meaningful tests exist.

Do not create a large CI matrix for a personal portfolio.

---

# Generated Assets in Development

Generated assets should not be dropped directly into production without review.

Workflow:

1. generate
2. review
3. optimize
4. rename
5. add fallback
6. register
7. test desktop/mobile
8. commit

Source generation files should not automatically enter `public/`.

See `ASSETS.md`.

---

# Temporary Assets

Use clearly marked placeholders during prototype work.

Examples:

```text
hero-placeholder.glb
rankle-blockout.glb
```

Do not let temporary assets silently become final.

When a temporary asset is used, track the replacement explicitly.

---

# Debug Tools

Development-only debug helpers may include:

- chapter progress
- active scene
- FPS
- reduced-motion status
- quality tier
- asset load status

They must not ship visibly in production.

Prefer lightweight toggles rather than permanent debug infrastructure.

---

# Console Discipline

Production should have no unexplained:

- console errors
- React warnings
- WebGL warnings
- failed asset requests
- hydration warnings

Intentional development logs should be removed before merge.

---

# Error Boundaries

Use error boundaries only where they provide real value.

Potentially useful around:

- heavy visual/canvas layer

The DOM portfolio should remain available if the visual layer fails.

Do not over-wrap every component.

---

# Environment Variables

Keep secrets and configuration minimal.

Never commit:

- private keys
- tokens
- service credentials

At this stage, the portfolio should ideally require few or no secrets.

Use:

```text
.env.local
```

for local secrets if future integrations require them.

---

# Security

The portfolio has a small attack surface because it has:

- no auth
- no database
- no user-generated content
- no admin

Maintain that simplicity.

Avoid adding server endpoints without need.

If external content is ever introduced, review sanitization and trust boundaries first.

---

# External Links

Keep project/social URLs centralized when practical.

This makes it easier to:

- update links
- audit broken links
- avoid duplicated constants

Do not create a complex config system solely for links.

---

# Resume Development

The `/resume` route should remain isolated from the interactive portfolio layer.

It should not depend on:

- WebGL
- GSAP
- project scene state

If HTML-based, it should support:

- printing
- mobile
- accessibility

---

# Prototype Sequence

Development should follow this order.

## P0 — Foundation

- documentation complete
- initialize Next.js/React/TypeScript
- establish CSS foundation
- establish lint/format/typecheck
- create semantic empty journey
- create chapter source of truth
- create chapter navigator skeleton
- create empty/fallback canvas architecture

No polished scenes yet.

---

## P1 — Creative Prototype

Build only:

- hero
- hero object integration
- Name → Projects
- Rankle scene
- Rankle → Plannr
- Plannr scene
- mobile version
- reduced-motion version

This phase validates the direction.

---

## P1 Decision Gate

Do not automatically continue.

Review:

- composition
- pacing
- motion quality
- performance
- mobile
- accessibility
- whether the experience actually feels exciting

If it does not, redesign now.

---

## Later Phases

Only after approval:

- Experience
- Education
- Off the Clock
- Contact
- deeper polish
- optimization
- production cutover

---

# Definition of Done for a Visual Feature

A substantial visual feature is not done when it works on one desktop browser.

It is done when:

- composition is approved
- desktop works
- mobile works
- reduced motion works
- keyboard path works
- fallback works where applicable
- no console errors
- performance is acceptable
- docs remain accurate
- production build passes

---

# Code Review Questions

Before merging, ask:

### Scope

Did this change stay within its intended purpose?

### Simplicity

Is there a simpler implementation?

### Architecture

Does meaningful content remain in the DOM?

### Reuse

Is abstraction based on real repetition?

### Dependencies

Did we add anything unnecessary?

### Accessibility

Does the interaction work without pointer/motion?

### Performance

Did asset/runtime cost increase materially?

### Mobile

Was mobile intentionally reviewed?

### Documentation

Did architectural/design assumptions change?

### Cleanup

Did prototype artifacts accidentally remain?

---

# Development Anti-Patterns

Do not:

- rewrite architecture during every feature
- add packages casually
- build admin infrastructure
- reintroduce a CMS
- create giant shared utility files
- create giant global animation timelines
- move all content into client state
- abstract before repetition
- build a custom design-system framework
- over-test unstable visuals
- optimize invisible details
- merge visually unreviewed scenes
- leave placeholder assets indefinitely
- treat desktop as the only real design

---

# Open Development Decisions

Settled during P0: Node.js 24 (`.nvmrc`), Next.js 16 with a `src/` directory, and pnpm.

These remain intentionally open until prototyping:

- whether Prettier needs extra plugins
- whether Playwright is justified
- test runner choice if unit tests become necessary
- exact CI provider configuration
- whether bundle analysis tooling becomes permanent
- exact debug-panel implementation

Choose only when needed.

---

# Final Development Standard

The codebase should remain calmer than the website.

A new development session should be able to answer quickly:

- where content lives
- where each chapter lives
- where 3D scenes live
- where motion lives
- which docs govern the work

The desired result is:

> **a small, disciplined codebase capable of producing a highly art-directed experience.**
