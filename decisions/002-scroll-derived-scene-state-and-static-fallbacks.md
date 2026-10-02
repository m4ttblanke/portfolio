# 002 — Scroll-derived scene state, one shared object system, static fallbacks

Status: Accepted
Date: 2026-10-01

## Context

P1 needed the hero, Rankle and Plannr to read as one continuous object story: the MB identity plates break apart and become Rankle's tier rows, Rankle's item cards flip over to become Plannr's extracted dates, and the rows flatten into syllabus lines. That needs state shared between DOM motion and WebGL at frame rate, layout that stays registered with responsive type, and a presentation that holds up with no WebGL, under reduced motion and when the scene fails. The docs already required one persistent canvas, meaningful content in the DOM, and a fallback for every major scene; they left open how state flows and what the fallbacks are.

## Decision

**Scene state is derived from scroll.**

- One plain mutable object, `scene` in `src/lib/motion/scene-progress.ts`, holds normalized progress values (`hero`, `rankle`, `handoff`, `plannr`) and the fine-pointer position.
- Chapter timelines write it through `setScene`, which wakes the demand-driven render loop. The canvas reads it inside `useFrame`.
- It is never React state, and no store library is used.
- Every object pose is a pure function of that progress plus the current scroll position, so scrubbing backwards, fast flings and direct hash loads all resolve to the same frame.

**The DOM owns layout.**

- Each scene has empty, `aria-hidden` stage elements laid out by CSS grid per breakpoint (`data-scene-anchor`, `data-rankle-board`, `data-plannr-zone`).
- The canvas measures them (`canvas/anchors.ts`) and positions objects in those rectangles, following the sticky frame as it holds and releases.
- Pose constants live in `scenes/*/…Pose.ts`.

**There is one persistent canvas with one shared object system.**

- `JourneyCanvas` lazily loads `JourneyScene`, the only module that imports three and R3F.
- One canvas is drawn, fixed behind the content: demand rendering, DPR capped at 1.5, generated room-environment lighting plus one directional light, no postprocessing.
- The same plate meshes (`canvas/Kit.tsx`) carry through every P1 scene. Scene components add only what is new (Rankle's friend board, Plannr's page, chips and calendar).
- Geometry is procedural; no model files are loaded.

**Static fallbacks are real renders, shown until WebGL proves itself.**

- Each scene's stage contains a `<picture>` (`fallback/SceneFallback.tsx`) holding a WebP render of the live scene at its canonical pose, art-directed for desktop and mobile.
- `html[data-webgl]` governs presentation:
  - **Absent** while pending and under reduced motion: fallbacks visible.
  - **`live`** only after the scene's first rendered frame: fallbacks hidden.
  - **`off`** when WebGL is unsupported, the scene throws, or the context is lost: fallbacks visible, the canvas layer hidden for the rest of the visit, and the scroll runways collapse to normal flow.
- Reduced motion never mounts the canvas or downloads the 3D chunk, and collapses the runways.
- Amended 2026-10-01: a compact viewport, `(max-width: 40rem) and (max-height: 30rem)` (narrow and short together, e.g. 250%+ page zoom), triggers the same static presentation, defined once in `src/lib/motion/presentation.ts`.

## Why

- Deriving state from scroll keeps the choreography reversible and deterministic, and keeps React out of the frame loop. A single small object was enough for three scenes, so a store such as Zustand would have added indirection without solving a P1 problem.
- DOM-measured stages let typography and objects be designed together in CSS, and give mobile a genuinely different composition without a second code path in the scene.
- One canvas with carried-over objects is what makes the transitions feel physical. Separate canvases per chapter cannot hand an object from one scene to the next, and would multiply WebGL contexts.
- Rendering the fallbacks from the real scene keeps the static path visually the same product rather than a placeholder. Revealing the canvas only after a real frame avoids a blank stage while the 3D chunk loads, or when initialization silently fails.

## Consequences

- New scenes must expose a CSS-laid-out stage, write their progress into `scene`, keep poses pure functions of progress and scroll, and ship a captured fallback in `src/lib/assets/fallbacks.ts` with a static composition for reduced motion.
- When a scene's canonical composition changes, its fallback images must be re-captured (see `docs/ASSETS.md`).
- Fallback images download on the static paths, and the near-viewport ones also on the live path before WebGL confirms (about 45 KB for Rankle on desktop, accepted in P1).
- Once `data-webgl="off"` is set it is final for the page load. A restored context does not bring the canvas back.
- If cross-scene state grows beyond progress values and the pointer, revisit the store decision in a new ADR.
