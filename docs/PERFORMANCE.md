# Performance

## Purpose

This document defines the performance requirements for Matthew Blanke's portfolio.

The site is intentionally visual and may use:

- WebGL
- real-time 3D
- generated assets
- scroll-driven motion
- large typography
- project-specific visual systems

Performance must be treated as part of the design system.

The goal is not to maximize technical spectacle.

The goal is:

> **A visually ambitious experience that still feels immediate, smooth, and reliable.**

The page should never feel like a 3D demo that happens to contain portfolio content.

---

# Performance Principles

## 1. Content Before Effects

Meaningful DOM content should render before heavy visual systems are ready.

The user should be able to understand:

- who Matthew is
- what the projects are
- where to navigate
- how to contact him

without waiting for 3D assets.

The loading order should favor:

1. HTML
2. layout
3. typography
4. essential imagery/fallbacks
5. hero enhancement
6. near-future project assets
7. later scene assets

---

## 2. Progressive Enhancement

The site should scale visual complexity according to capability.

Conceptually:

```text
Full experience
↓
Reduced real-time experience
↓
Static rendered fallback
↓
DOM-only content
```

Performance degradation should reduce spectacle before it reduces usability.

---

## 3. One Persistent Canvas

Use one persistent WebGL canvas for the journey.

Avoid multiple independent R3F canvases.

Benefits:

- fewer WebGL contexts
- lower initialization overhead
- easier shared rendering
- simpler memory management
- better scene continuity
- fewer duplicate lights/cameras/loaders

---

## 4. Do Not Block First Meaningful Paint

The initial page must not wait for:

- GLB models
- textures
- postprocessing
- complex JavaScript
- smooth-scroll initialization

before useful content appears.

The hero should have a credible fallback state immediately.

---

# Performance Tiers

The runtime may support three conceptual quality tiers.

These are not necessarily explicit user-facing modes.

---

# Tier A — Full

Target:

- capable desktop/laptop
- modern GPU
- stable WebGL
- sufficient memory

Potential features:

- full hero model
- richer lighting
- pointer response
- full chapter transitions
- higher DPR cap
- interactive project objects

---

# Tier B — Reduced

Target:

- mobile
- lower-power laptops
- weaker integrated GPUs
- thermally constrained devices

Potential reductions:

- lower DPR
- simpler lighting
- fewer objects
- lower-poly models
- simpler materials
- no expensive postprocessing
- reduced pointer behavior
- less frequent animation updates

The composition should remain the same in spirit.

---

# Tier C — Static

Target:

- reduced motion
- WebGL unavailable
- severe performance constraints
- model-load failure

Potential treatment:

- rendered WebP/AVIF visual
- DOM composition
- no real-time 3D
- normal scroll

The site should still feel designed.

---

# Core Web Vitals

The site should aim for strong Core Web Vitals.

Primary concerns:

- LCP
- CLS
- INP

Performance work should prioritize actual user experience over chasing perfect synthetic scores at the expense of design.

---

# Largest Contentful Paint

Potential LCP candidates:

- hero typography
- hero fallback image
- large project visual

Requirements:

- do not make a huge unoptimized 3D render the only hero visual
- reserve dimensions for imagery
- preload only truly critical assets
- avoid render-blocking font behavior where possible

The LCP element should ideally be normal DOM/image content rather than waiting on canvas rendering.

---

# Cumulative Layout Shift

The page should remain visually stable.

Reserve space for:

- hero visual
- large project assets
- fallback images
- font-dependent text where practical

Avoid:

- late-loading content that changes chapter height
- models that resize containers after load
- font swapping that radically changes composition
- dynamically inserted navigation height

Motion transforms should not cause layout shift.

---

# Interaction to Next Paint

Interactive controls should remain responsive.

Potential risk areas:

- chapter navigator
- pointer-follow effects
- project object interactions
- details disclosures
- scroll processing

Avoid heavy synchronous work on input.

Do not process large scene updates in React state on every pointer move.

---

# JavaScript Budget Philosophy

Do not set a fake exact budget before the real prototype exists.

Instead:

- keep dependencies limited
- inspect bundle impact before adding libraries
- dynamically load heavy visual modules where useful
- avoid duplicative animation packages
- avoid large UI frameworks

The portfolio should not ship unrelated application infrastructure.

---

# Dependency Cost

Every dependency should justify:

- bundle cost
- runtime cost
- maintenance cost

Major runtime dependencies after P1:

```text
GSAP (+ ScrollTrigger)
Three.js
React Three Fiber
```

Drei and Lenis were evaluated and not adopted.

This is already a substantial visual stack.

Avoid adding overlapping libraries such as:

- Framer Motion
- another smooth-scroll library
- multiple state libraries
- general-purpose component frameworks

without clear need.

---

# Three.js / R3F Performance

Potential performance risks:

- too many draw calls
- large geometry
- transparent materials
- high-resolution textures
- too many lights
- postprocessing
- high DPR
- constantly updating scenes

Prioritize simple, strong visual design over rendering complexity.

---

# Draw Calls

Keep draw calls low where practical.

Ways to reduce:

- merge static meshes
- reuse materials
- instance repeated geometry
- avoid unnecessary mesh fragmentation

Do not optimize blindly before profiling.

---

# Geometry

Prefer strong silhouette over polygon density.

Initial guidance:

- moderate-poly interactive models
- simplify invisible details
- use lower-detail mobile variants if needed

The hero object should not contain complexity that cannot be seen at normal viewport scale.

---

# Textures

Texture memory can become more expensive than geometry.

Guidelines:

- use modest texture resolution
- avoid unnecessary 4K maps
- use simple materials when possible
- compress textures
- share textures when appropriate

Potential later formats:

- WebP
- AVIF
- KTX2

Use the format that measurably improves production performance.

---

# Materials

Keep material complexity restrained.

Avoid:

- many transparent layers
- complex transmission everywhere
- expensive shader networks
- multiple materials per tiny object

Transparency and refraction should be used only when central to the art direction.

---

# Lighting

Prefer a small lighting setup.

Potential:

- one key
- one fill
- environment map
- optional rim

Avoid many dynamic lights.

Baked or simplified lighting may be preferable for some objects.

---

# Shadows

Real-time shadows are optional.

Use only when they materially improve the composition.

Potential alternatives:

- baked shadows
- contact shadow
- rendered fallback
- simple ambient grounding

Avoid large high-resolution shadow maps without clear benefit.

---

# Postprocessing

Default position:

> No heavy postprocessing.

Potential effects that should be treated skeptically:

- bloom
- SSAO
- depth of field
- motion blur
- chromatic aberration
- film grain in WebGL

If an effect is used, prove that:

1. it materially improves the scene
2. performance remains acceptable
3. mobile has a simpler treatment
4. reduced-motion/static fallback remains coherent

---

# Device Pixel Ratio

Do not allow unlimited device DPR.

Potential conceptual caps:

```text
desktop: ~1.5–2
mobile: lower
```

Exact values should be measured.

High DPR can dramatically increase GPU cost.

The difference between 2x and 3x rendering may not justify the cost.

---

# Frame Rate

The target should feel smooth on intended hardware.

Aim for:

- near 60fps during normal scroll on capable devices
- stable interaction without major frame drops
- graceful simplification on weaker hardware

Do not require 60fps at all costs if visual quality can be simplified intelligently.

---

# Render Loop

Avoid unnecessary continuous rendering.

Potential strategies:

- render continuously only in active animated scenes
- reduce updates when scenes are static
- pause idle animation offscreen
- avoid frame updates for hidden assets

R3F's render behavior should be configured based on actual scene needs.

---

# Visibility

Objects not currently needed should not consume unnecessary work.

Potential:

- hide inactive scene groups
- stop updating inactive objects
- unload very heavy later assets if memory becomes an issue

Do not keep every chapter fully active in the render loop.

---

# Scroll Performance

Scroll handling must remain lightweight.

Avoid:

- large JavaScript handlers on every scroll event
- repeated DOM measurement per frame
- React state updates on every scroll tick
- large layout recalculations

Use:

- ScrollTrigger
- refs
- transforms
- cached measurements

appropriately.

---

# GSAP Performance

Prefer transforms and opacity.

Good:

```text
translate
scale
rotate
opacity
```

Use caution with:

```text
width
height
top
left
filter
large blur
clip-path on huge surfaces
```

depending on browser behavior.

Measure complex effects instead of assuming.

---

# Lenis Performance

Not adopted in P1 (`decisions/001`); scrolling is native.

A smooth-scroll layer would only be justified if it improved the experience without introducing:

- input latency
- mobile issues
- scroll desynchronization
- excessive main-thread work

Native scroll is acceptable.

A smooth-scroll library is not mandatory.

---

# Fonts

Typography is central, but font loading should remain disciplined.

Guidelines:

- use a limited number of families
- use only required weights
- subset where practical
- use Next.js font handling where appropriate
- avoid loading a huge variable font if only a narrow range is used

Font choices should be evaluated for both visual quality and file size.

---

# Images

Use responsive image sizing.

Avoid sending desktop-sized images to mobile.

Prefer:

- AVIF
- WebP

where quality is acceptable.

Use appropriate source dimensions.

Do not upscale poor source images unnecessarily.

---

# Hero Loading Strategy

Potential order:

1. render typography immediately
2. show reserved hero visual area
3. show lightweight fallback
4. initialize canvas
5. load hero model
6. replace or blend fallback with real-time object

The visitor should never stare at an empty hero while waiting for 3D.

---

# Project Asset Loading

Rankle and Plannr assets should be loaded before they are needed, but not necessarily at initial page load.

Potential strategy:

- preload when user approaches Projects
- load Rankle first
- load Plannr shortly after

Use real-world testing to choose thresholds.

---

# Later Asset Loading

Experience may need little or no heavy asset loading.

Education and Off the Clock should load later.

Do not preload personal still-life assets on first paint.

---

# Model File Sizes

Exact budgets should be based on prototype measurements.

Initial directional target:

- hero model: ideally around or below ~1–1.5 MB compressed
- project model systems: similar or smaller where practical
- static fallback: substantially smaller

These are targets, not absolute rules.

A larger file must earn its cost.

---

# Texture Budget

Initial preference:

- 1K textures where sufficient
- 2K only when clearly visible
- 4K rarely

Material-driven models may need no large texture maps.

---

# Mobile Asset Budget

Mobile should generally receive less.

Potentially:

- smaller images
- lower-resolution textures
- lower-poly model
- fewer meshes
- static fallback

Do not assume mobile bandwidth or GPU capability.

---

# Memory

Long-scroll WebGL experiences can accumulate memory.

Watch:

- textures
- geometry
- render targets
- postprocessing buffers
- loaded scenes

Dispose resources that are no longer needed if they are not shared.

Avoid duplicate model instances that could share geometry/materials.

---

# Page Lifecycle

Test:

- reload
- resize
- orientation change
- route navigation
- returning from `/resume`
- browser back/forward

The canvas should not leak resources or duplicate animation systems.

---

# Development Profiling

Use actual tools.

Potential:

- Chrome Performance panel
- Chrome Memory tools
- React Profiler
- Next.js bundle analyzer if needed
- R3F performance helpers during development
- Lighthouse
- Web Vitals
- Vercel Speed Insights later

Do not optimize based only on intuition.

---

# Performance Testing Viewports

At minimum test:

- wide desktop
- typical laptop
- 390px mobile
- smaller mobile
- high-DPR device
- reduced-motion mode

If possible, test on real hardware in addition to emulation.

---

# Low-Power Testing

At least once before production, test on:

- integrated graphics laptop
- older mobile device or throttled equivalent

A site that runs well only on a high-end development machine is not acceptable.

---

# Network Testing

Test under throttled conditions.

At minimum:

- fast Wi-Fi
- moderate mobile connection
- cold cache

The user should still receive meaningful content quickly.

---

# Performance and Accessibility

Performance fallbacks should align with accessibility fallbacks.

Reduced-motion users may receive:

- less animation
- fewer real-time updates
- static scenes

This can improve both comfort and performance.

Do not conflate reduced motion with "low quality," but use the simpler rendering state intelligently.

---

# Performance and SEO

Meaningful content should render in the DOM.

This helps:

- crawlers
- fast text paint
- resilience

Do not require canvas initialization for the page to have useful content.

---

# Performance Budgets

Final budgets should be established after P1.

Track at minimum:

- JS transfer size
- hero asset size
- total initial transfer
- model sizes
- texture sizes
- LCP
- CLS
- INP
- average frame rate in key scenes

Do not choose arbitrary numbers before measuring the prototype.

## P1 Baseline

Measured on the production build (`pnpm build && pnpm start`) in headless Chrome with GPU rendering, cache disabled. Sizes are compressed transfer sizes.

**Transfer**

| Path | JS | Fonts | CSS | Fallback images | Total |
|---|---|---|---|---|---|
| Desktop, WebGL live | 427 KB (183 KB initial + 245 KB lazy 3D chunk) | 88 KB | 5 KB | 62 KB (hero, Rankle) | 614 KB |
| Mobile 390, WebGL live | 427 KB | 88 KB | 5 KB | 35 KB | 587 KB |
| Reduced motion, desktop | 183 KB (no 3D chunk) | 88 KB | 5 KB | 78 KB (all three) | 385 KB |
| Reduced motion, mobile | 183 KB | 88 KB | 5 KB | 48 KB | 355 KB |
| No WebGL, desktop | 183 KB | 88 KB | 5 KB | 78 KB | 385 KB |

- The 3D chunk is three.js plus R3F and the scenes: 939 KB raw.
- It is requested only when WebGL is available and reduced motion is off.
- No models or textures are loaded.

**Rendering, per frame at 1440×900**

| Point | Draw calls | Triangles |
|---|---|---|
| Hero | 21 | 3.0k |
| Rankle hold (peak) | 61 | 6.9k |
| Hand-off | 33 | 3.5k |
| Plannr review | 46 | 3.7k |
| Calendar hold | 49 | 3.7k |

- **DPR cap:** 1.5. The canvas is 2160×1350 on a 2× desktop and 585×1266 on a 3× phone.
- **Idle:** 0 draw calls over 5 s (demand rendering).
- **Scripted scroll, hero to the end of Plannr in 8 s:** 480 frames, average 16.67 ms, p95 16.7 ms, none over 20 ms. This is vsync-bound on a fast GPU; it is not a mid-range phone figure.

**Lab vitals (localhost, unthrottled)**

- LCP 44–68 ms (the hero name on desktop, the hero render on mobile).
- CLS ≤ 0.004.
- These only show that nothing blocks the first paint and nothing shifts. Field numbers need a deployed, throttled or real-device measurement.

Budgets for later chapters should be set against this baseline: keep the initial (non-3D) JS near 180 KB, add no per-scene 3D downloads without a measured reason, and keep peak draw calls in the tens.

---

# Performance Decision Gate

After P1, ask:

### Does the hero become interactive quickly?

### Does Projects load before the user reaches it?

### Is scrolling smooth on a normal laptop?

### Does mobile feel intentional rather than compromised?

### Are models worth their transfer cost?

### Is Lenis helping?

P1 answers:

- Lenis: not adopted.
- Postprocessing: none.
- DPR: capped at 1.5; no further reduction was needed in P1 measurements.
- Models: none were needed; scenes are procedural.

### Are postprocessing effects necessary?

### Does DPR need further reduction?

### Should any real-time scene become a rendered asset instead?

The answer may involve simplifying the design.

That is acceptable.

---

# Performance Anti-Patterns

Avoid:

- loading every model immediately
- multiple canvases
- unlimited DPR
- large 4K textures
- many transparent materials
- expensive postprocessing by default
- frame-by-frame React state
- continuous animation everywhere
- duplicate animation libraries
- giant component libraries
- uncompressed video
- loading heavy personal assets above the fold
- keeping hidden scenes actively rendering
- optimizing only for desktop

---

# Production Checklist

Before launch:

## Initial Load

- meaningful content appears immediately
- no blocking 3D loader
- font behavior is stable
- hero fallback works

## WebGL

- one canvas
- reasonable DPR
- optimized models
- controlled materials
- no major leaks

## Scroll

- no obvious jank
- no layout thrash
- pinned sections recover correctly

## Mobile

- simpler scene where necessary
- acceptable memory use
- touch remains responsive

## Fallbacks

- WebGL failure works
- reduced motion works
- static assets are optimized

## Metrics

- inspect Core Web Vitals
- inspect bundle
- inspect asset transfer
- inspect runtime performance

---

# Open Performance Decisions

Settled in P1 (see the baseline above):

- DPR cap: 1.5
- Lenis: not adopted
- demand rendering for the whole canvas
- no postprocessing
- the hero scene loads lazily after hydration, behind its static render

Still open:

- exact JS budget
- exact initial transfer budget
- exact model size limits
- exact triangle budgets
- exact texture format
- whether KTX2 is necessary
- whether Draco or Meshopt is preferred
- exact low-power detection strategy
- whether to defer the Rankle fallback download on the live path (about 45 KB on desktop; accepted for P1, revisit only if profiling shows it matters)

---

# Final Performance Standard

The visitor should never feel that they are waiting for the portfolio to prove how technically ambitious it is.

The site should feel:

- immediate
- smooth
- quiet under load
- stable
- responsive

The desired outcome is:

> **visual ambition without performance anxiety.**
