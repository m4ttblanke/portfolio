# 004 — Choreographed navigation on native scroll

Status: Accepted
Date: 2026-11-02

## Context

The chapter navigator used plain hash links, so every jump was an instant cut. A visitor who jumped from the hero to Contact never saw the journey in between, and the second half's motion was never seen in passing. P2.6 asks for navigation to become part of the choreography: a deliberate jump should visibly travel through the chapters in between, faster than scrolling but never a cut.

`001` keeps scrolling native: no Lenis and no smoothing layer. Every chapter's motion is a scrubbed ScrollTrigger timeline that reads the real document scroll, and the canvas wakes from scroll (`002`, `003`). The navigator also gained subsections (Rankle, Plannr, each Experience entry, Education area, Off the Clock subject and Contact link), some of which land inside a choreography runway rather than at an element's top.

## Decision

**A deliberate navigator activation travels; nothing else does.**

- `src/lib/motion/travel.ts` drives the native document scroll with one `requestAnimationFrame` loop calling `window.scrollTo()`. Native scroll stays the only source of truth: ScrollTrigger, the navigator's observers and the canvas all see ordinary scroll events. No React state is involved.
- Duration grows with distance `v` in viewport heights: `t = clamp(0.8 s, 0.6 + 0.5·√v, 2.4 s)`.
- The curve is a smoothed trapezoid velocity profile. Speed rises from rest along a smoothstep, cruises, and falls along a mirrored smoothstep to rest, so speed and acceleration are zero at both ends. The ramp share of each end goes from 0.5 (one viewport or less: all ramp, no cruise) to 0.28 (eight viewports or more). A long trip's peak speed is about 1.4× its average.
- The destination is re-read every frame (element top, less `scroll-margin-top`, plus any `data-nav-hold` share of a sticky runway), so a layout change mid-trip never strands the stop.
- The visitor always wins. `wheel`, `touchstart`, `touchmove`, `pointerdown` and any non-modifier `keydown` cancel a trip at once. So does any scroll movement the trip did not write (more than 3 px; this covers scrollbar drags and Find in Page). A cancelled trip stops where it is: no snap and no resume. A new activation cancels the current trip and starts from the current position.

**History and focus.**

- Only unmodified primary activation is intercepted. Modified and middle clicks stay native.
- The hash is pushed with `history.pushState` when the trip starts. Activating the current hash again adds no entry.
- While travelling, focus rests on the navigator's toggle. When the trip arrives, focus moves to the destination with `preventScroll`: the contact link itself, or the destination's heading. Headings get `tabindex="-1"` on first use. A cancelled trip moves no focus.
- Back and Forward are never animated. `popstate` cancels any trip, and the browser's own restoration wins.
- Direct hash loads land natively. Once fonts and the page have loaded, and only if the visitor has not yet scrolled or pressed anything, the position is corrected instantly to the computed destination. This is how `#rankle` and `#plannr` reach their composed scenes.
- Reduced motion jumps instantly through the same path, then focuses the destination.

## Why

- **Real scroll.** Every chapter's existing motion runs during the trip with no special cases. A trip through Projects fast-forwards the hero exit, Rankle and the hand-off, because those timelines only ever read scroll.
- **Exact control.** A frame loop the module owns can re-read its target, detect the visitor's input precisely, and stop on any frame.
- **No dependency.** One small module replaces a library.
- **Alternatives rejected:**
  - Instant anchors: the journey is skipped.
  - CSS `scroll-behavior: smooth`: no control over duration or curve, cannot be cancelled cleanly, and would also animate the skip link and every in-page anchor.
  - Lenis or any virtual scroll layer: contradicts `001`, adds a second scroll loop, and would make ScrollTrigger read a proxy.
  - GSAP ScrollToPlugin: installed and capable, but it fixes its endpoint when the tween starts and detects interruption only from position heuristics (`autoKill`).
  - A cubic in-out ease: its peak speed is about 3× the average, so long trips read as a cut with slow ends.
  - Animated Back/Forward: history traversal must restore the browser's exact state.

## Consequences

- The project owns a small travel utility and its history, focus and interruption behavior. Changes to the navigator's activation must keep the rules above.
- Navigator trips take 0.8–2.4 s instead of an instant jump. Hero → Contact measured about 2.2 s at 1440×900.
- Every navigator destination must be a real element. A destination inside a choreography runway declares `data-nav-hold`, a share of the hold, so it lands on a composed state and needs no spacer element. Static presentation collapses the runway and the hold to zero.
- A trip through Projects renders the canvas exactly as manual scrolling would. P2 trips add no WebGL work (`003`).
- In Chromium, Back to a fragment entry lands on that fragment's position, as it does for native anchors. For `#rankle` and `#plannr` that is the block top, not the composed hold. This is accepted as browser-native behavior.
