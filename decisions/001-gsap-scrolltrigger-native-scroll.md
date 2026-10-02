# 001 — GSAP and ScrollTrigger on native scrolling

Status: Accepted
Date: 2026-10-01

## Context

The journey is scroll-choreographed: the hero breaks apart, its pieces become Rankle's tier boards, and those become Plannr's syllabus, review queue and calendar. The docs planned GSAP, ScrollTrigger and Lenis, all pending validation in P1. The choreography needs to scrub forwards and backwards, survive resize and direct hash loads, and stay out of the way of keyboard scrolling, anchors, touch and reduced motion.

## Decision

- GSAP with ScrollTrigger is the motion system. `src/lib/motion/gsap.ts` is the single registration point.
- Scrolling is native. Lenis (and any smooth-scroll layer) is not used.
- Each chapter owns its timelines in a small `*Motion` client component, created inside `gsap.matchMedia()` so they exist only when `prefers-reduced-motion` is not `reduce`. There is no global timeline.
- Scroll is smoothed where it matters, per timeline, with `scrub: 0.6`. Timelines scrub values; they do not snap, pin with JavaScript or hijack scrolling.
- Holds use CSS `position: sticky` frames inside tall runway blocks, not ScrollTrigger pinning.
- ScrollTrigger re-measures after web fonts load and whenever `html[data-webgl]` changes, because both change layout. Mobile browser-chrome resizes are ignored (`ignoreMobileResize`).

## Why

- Native scrolling keeps anchors, keyboard scrolling, Find in Page, touch momentum and assistive technology working with no integration code. In P1 the scrubbed timelines already read as smooth, so Lenis would have added a dependency, an extra scroll loop and reduced-motion handling without a visible gain.
- Sticky frames give holds that work without JavaScript and collapse with one CSS rule (reduced motion, WebGL off), where ScrollTrigger `pin` adds spacers and measured offsets.
- Per-chapter timelines keep each scene removable and reviewable on its own, as `AGENTS.md` asks.
- Alternatives: Lenis with GSAP (not adopted, see above); Framer Motion (excluded by the repository rules).

## Consequences

- Scroll feel is the browser's own. If a future scene genuinely needs inertial smoothing, adding it is a new decision that supersedes this one.
- Every new chapter must create its timelines inside `gsap.matchMedia()` and provide a static composition for reduced motion.
- Runway lengths (`svh` heights of the scene blocks) are CSS, per breakpoint; timelines read their progress from them rather than from hard-coded pixel offsets.
- Layout changes that move triggers (fonts, fallback state) must keep calling `ScrollTrigger.refresh()`.
