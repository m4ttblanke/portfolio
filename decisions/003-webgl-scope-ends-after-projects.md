# 003 — WebGL scope ends after Projects

Status: Accepted
Date: 2026-10-29

## Context

The docs planned a spatial treatment for every chapter. Experience would have sticky year numerals, Education a cluster or node map that might be procedural WebGL, Off the Clock a 3D still life, and Contact a return of the live hero object. P1 built one persistent canvas whose shared plates carry the story from the hero through Rankle to Plannr (`002`).

P2 had to finish the journey (Experience, Education, Off the Clock, Contact) and decide how far that canvas reaches. The second half is quieter material: dates, credentials, three personal facts and contact links. Prototyping showed that 3D did not explain any of it better than type does. Measurement also showed that the canvas kept clearing an empty frame on every scroll event and mouse move long after the last scene had left the viewport.

## Decision

**Live WebGL storytelling ends after Plannr.**

- The canvas tells the P1 object story: hero, Rankle, Plannr. No P2 chapter adds scene objects, scene progress or canvas work.

**P2 chapters are DOM, CSS and images.**

- Experience is a shared time field of CSS duration rules.
- Education is one typographic block.
- Off the Clock is a typeset still life of generated raster images, with a small desktop-only GSAP drift.
- Contact is static.
- All P2 motion runs through per-chapter `*Motion` components on DOM elements (`ExperienceMotion`, `OffClockMotion`). None of it writes to `scene`.

**The persistent canvas stays mounted for the whole visit.**

- It is not torn down when the visitor passes Plannr, so scrolling back up into Projects resumes the live scenes with no reload, no context re-creation and no fallback flash.

**P2 scroll and pointer activity do not wake the canvas.**

- `sceneInView()` in `canvas/anchors.ts` states the condition under which any P1 scene group can be visible: `scrollY < plannr.blockBottom`.
- Scroll invalidation (`useAnchors`) runs only while that holds, plus one frame on the way out so the last pose is hidden.
- Pointer tilt (`Kit`) still records the pointer but invalidates only while a scene is in view.
- Layout changes (`ResizeObserver`) always draw one frame, so a direct load or a resize lower on the page still leaves the canvas correct.
- Measured result: scrolling Experience to the end of Contact issues 0 WebGL draws and 0 clears.

**Contact uses a static MB callback.**

- The MB relief returns at the end of the closing line as the hero's own captured fallback render (`fallbacks.hero`), an image with `alt=""`, lazy-loaded.
- It is not a live canvas pose, and it looks the same on every presentation path.

## Why

- **Narrative meaning.** The object story is about what Matthew builds. The plates become tier rows, then dates, then a calendar. Carrying them into Experience or Education would turn a meaningful transformation into decoration. Ending the 3D at Projects makes the drop in energy part of the journey: high through Projects, then Experience medium-low, Education lowest, Off the Clock a brief rise, Contact a still resolution.
- **Less spectacle.** The docs ask for minimal interface and maximum choreography, and warn against animating every section. The second half reads better as composed type than as more objects.
- **A light P2.** P2 added no 3D chunk, no models and no textures. Its JavaScript is two small DOM motion components. The Off the Clock images are lazy and sized per viewport.
- **No needless rendering.** Every frame past Plannr only cleared a transparent canvas. Stopping those frames removed GPU work and battery cost without changing anything visible.

Alternatives considered:

- **Unmount the canvas after Projects.** Rejected. Scrolling back up would need a new context, a reload of the scene, and a fallback flash at exactly the moment the story replays.
- **Pause the render loop entirely (`frameloop="never"`) in P2.** Rejected. It adds state for no measurable gain over gating invalidation, which already yields zero frames.
- **A live MB pose in Contact.** Rejected. It would wake the canvas at the bottom of the page and cost a WebGL path, a fallback path and a capture, all for an image that never moves. The static render is the same object at the same pose.
- **WebGL for Education (nodes, clusters) or Off the Clock (3D objects).** Rejected after prototyping. Type carried Education more legibly. The generated images give Off the Clock a tactile still life at a fraction of the cost, with an identical static path.

## Consequences

- The canvas reaches the hero, Rankle and Plannr only. A new live scene below Projects needs a new ADR that supersedes this one, and must extend `sceneInView()` (or replace it) so its region wakes the loop.
- Any new scene group that can be visible past Plannr's block would be invisible to scroll and pointer wake-ups until `sceneInView()` changes. Keep the hide condition and `sceneInView()` in step.
- Scrubbed P1 timelines may still wake the loop for up to about 0.6 s while their values settle after leaving Plannr. That is accepted.
- P2 chapters must stay meaningful as plain DOM. Their reduced-motion, compact, no-JS and no-WebGL presentations are the same composition with motion removed. No P2 chapter has a WebGL-specific fallback, because none needs one.
- The Contact MB must be re-captured whenever the hero's canonical pose changes, together with the hero fallback (`docs/ASSETS.md`).
- The documented plans for sticky Experience years, an Education node or cluster map, a 3D Off the Clock still life and a live Contact return are retired. The docs now describe what was built.
