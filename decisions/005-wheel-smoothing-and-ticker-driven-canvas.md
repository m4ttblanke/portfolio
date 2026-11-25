# 005 — Wheel smoothing with Lenis, and a canvas drawn on the GSAP ticker

Status: Accepted
Date: 2026-11-25

Supersedes the "Scrolling is native. Lenis is not used." clause of `001`. The rest of `001` stands.

## Context

On a MacBook Pro (Retina, 120 Hz) the journey felt choppy everywhere, and worst on the first scroll. Profiling a production build found the main thread healthy (no task over about 10 ms during a full scroll, even with the CPU throttled 4×), and three causes outside it:

1. **First-pass GPU work.** Rankle and Plannr stay hidden until reached, so their shader programs compiled, and their label textures uploaded, mid-scroll. Fixed separately with a startup prewarm (`docs/PERFORMANCE.md`, Render Loop).
2. **Canvas fill cost.** A full-viewport, 4× MSAA canvas at the 1.5 DPR cap, composited over the page on every scroll frame.
3. **Canvas and page out of step.** Native scrolling moves the page on the compositor thread right away. The canvas, which places the kit from `window.scrollY`, could only draw on the main thread a frame later, so objects tracking the page (the hero relief, Rankle's arrival, the Plannr hand-off) trailed the type they register with.

The third cause cannot be fixed while the browser owns scrolling.

## Decision

- **Lenis smooths wheel and trackpad input** (`components/journey/scroll/SmoothScroll.tsx`). It is created only for fine pointers with motion allowed and outside compact presentation, inside `gsap.matchMedia()`, so reduced motion, compact viewports and touch never get it. Touch (`syncTouch: false`), keyboard, scrollbar drags, Find in Page, anchors and Back/Forward stay native, and Lenis resyncs after each of them.
- **One loop, in order.** Lenis runs from the GSAP ticker as its first listener. It calls `ScrollTrigger.update` from its scroll event, then GSAP renders its timelines, then the canvas draws. The page's new scroll position and the frame drawn for it are committed in the same animation frame.
- **The canvas is `frameloop="never"`, drawn by `FrameDriver`** (`canvas/JourneyScene.tsx`). It is still demand-driven: scroll, layout, pointer, progress and damping call `requestFrame()` (`lib/motion/scene-progress.ts`), and the driver calls R3F's `advance()` at most once per tick, only when a frame was requested. Past the P1 scenes it draws once to clear and then nothing (`003` unchanged).
- **Navigator travel stays native** (`004` unchanged). Before a trip it settles any smoothing still in flight (`lib/motion/smooth-scroll.ts`), so the trip's first frame is not read as the visitor's drift.
- **MSAA only below 1.5 device pixels per CSS pixel.** At 1.5 and up the canvas renders below the screen's density and is upscaled, which softens edges anyway; there MSAA cost the most GPU time for the least visible gain.

## Why

- Only main-thread scrolling can put the page and the WebGL frame in the same frame. Lenis still writes the real document scroll, so ScrollTrigger, sticky holds, `scroll-margin`, anchors and assistive technology are unchanged, unlike a transform-based "virtual scroll".
- Driving the canvas from the same ticker, rather than R3F's own `requestAnimationFrame`, fixes the order within the frame. Two independent rAF loops give no ordering guarantee.
- Alternatives:
  - Lower DPR alone: helps fill cost, not the desync.
  - Lenis with R3F's demand loop: the canvas would still draw a frame late.
  - ScrollTrigger `normalizeScroll`: also moves scrolling to the main thread, but changes touch and keyboard behavior more broadly.

## Consequences

- The GSAP ticker runs every animation frame while the page is open, a no-op when nothing has moved. That is the standard Lenis cost.
- Scroll feel on desktop is now the site's, not the browser's. Lenis defaults (`lerp: 0.1`) apply on top of the timelines' own `scrub: 0.6`; if the choreography feels floaty, tune one of the two, not both.
- `frameloop="never"` here is not the pause `003` rejected: the canvas still draws on request, only from a different loop.
- Anything that changes what the canvas shows must call `requestFrame()`. R3F's `invalidate()` does nothing under `frameloop="never"`.
- A nested scroller that should keep native wheel behavior needs `data-lenis-prevent`, as the navigator's list has.
- Keyboard, anchors, reduced motion and touch must keep being checked whenever this layer changes.
- If the smoothing ever harms usability or performance, remove `SmoothScroll`. The ticker-driven canvas works the same without it.
