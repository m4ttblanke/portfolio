# Motion System

## Purpose

This document defines the motion language for Matthew Blanke's portfolio.

Motion is a structural part of the experience.

It should help:

- connect chapters
- explain transformation
- create depth
- establish hierarchy
- reinforce project identity
- make the portfolio feel spatial and authored

Motion should never exist merely because animation is possible.

The core rule is:

> **Motion communicates change. It does not decorate entry.**

---

# Motion Principles

## 1. Motion Must Have a Job

Every meaningful animation should answer at least one of these questions:

- What changed?
- What became important?
- Where did this object go?
- How are these two scenes related?
- What should the visitor notice?
- What transformed into what?

If an animation has no answer, remove it.

---

## 2. No Default Fade-Up System

Do not create a generic utility that automatically applies:

```text
opacity 0
translateY 20px
→
opacity 1
translateY 0
```

to every section.

This portfolio should not feel like a template.

Elements may fade where appropriate, but fading should never become the default motion language.

---

## 3. Motion Connects Scenes

The strongest motion should occur between states or chapters.

Preferred:

```text
hero object
→ rotates
→ shifts position
→ becomes part of Projects
```

rather than:

```text
hero fades out
projects fade in
```

Spatial continuity is more important than spectacle.

---

## 4. Calm Is Part of Motion Design

Some scenes should barely move.

This makes the more complex sequences feel intentional.

Motion density should vary.

A calm viewport is not unfinished.

---

## 5. Motion Must Be Interruptible

The visitor always controls the scroll.

Do not:

- lock scrolling
- force playback
- block navigation until animation completes
- disable user input during long transitions
- queue long non-interruptible timelines

If the user scrolls quickly, the experience should resolve gracefully.

---

## 6. Scroll Is the Main Timeline

Vertical scroll is the primary progress mechanism.

Motion should map to scroll progress where that relationship improves understanding.

Do not force horizontal scroll as the primary navigation model.

Do not create artificial scroll snapping by default.

---

# Core Motion Primitives

The portfolio should use a limited set of reusable motion behaviors.

The same primitives can appear in different chapters with different visual outcomes.

---

# 1. Spatial Transformation

## Definition

A visual object changes:

- position
- scale
- rotation
- orientation
- composition role

as the visitor moves between states.

## Purpose

Creates continuity.

## Examples

Hero object:

```text
identity sculpture
→ recedes
→ rotates
→ aligns with Work
```

Plannr:

```text
syllabus
→ fragments into deadlines
→ resolves into calendar tiles
```

## Guidance

Use when an object truly changes meaning or role.

Do not animate scale/rotation randomly.

---

# 2. Depth / Parallax

## Definition

Different spatial layers move at different rates.

Potential layers:

- background
- 3D object
- typography
- metadata

## Purpose

Creates depth and spatial separation.

## Guidance

Keep parallax subtle.

Avoid exaggerated effects that make reading uncomfortable.

Text should generally move less than decorative visuals.

Do not apply parallax to every scene.

---

# 3. Mask / Reveal

## Definition

Content appears through:

- clipping
- masking
- cropping
- occlusion
- object movement

rather than a generic opacity transition.

## Purpose

Supports editorial and spatial composition.

## Examples

- title revealed behind a 3D object
- image revealed as another layer moves
- project name enters through a horizontal mask
- year typography emerges from behind viewport edge

## Guidance

Reveal direction should relate to layout.

Do not use arbitrary wipes.

---

# 4. Typographic Motion

## Definition

Large typography moves as visual structure.

Potential behavior:

- translation
- cropping
- masking
- scale
- tracking change
- controlled rotation in rare cases

## Purpose

Makes type participate in the spatial composition.

## Guidance

Body copy should rarely animate dramatically.

Use typographic motion mainly for:

- names
- project titles
- years
- chapter words

---

# 5. Proximity / Magnetic Response

## Definition

An interactive element responds subtly to pointer proximity.

Potential behavior:

- slight translation
- small scale shift
- subtle rotation
- arrow movement

## Purpose

Provides tactile feedback.

## Guidance

Use selectively.

Best candidates:

- chapter navigator
- key CTA
- project object
- major link

Avoid making every link magnetic.

Pointer response must never reduce readability.

---

# 6. Object Manipulation

## Definition

A user may directly affect a visual object.

Potential behavior:

- small drag
- tilt
- rotate
- choose an item
- move a game piece

## Purpose

Creates memorable tactile moments.

## Guidance

Object manipulation must remain optional.

The page must still make sense without it.

Do not require precision dragging to access information.

---

# 7. Spatial Transition

## Definition

One chapter visually transforms into the next.

## Purpose

Makes the entire page feel like one journey.

## Guidance

This is the most important high-level motion behavior.

Each transition should have a specific narrative reason.

---

# Chapter Motion Language

## 01 — Name

### Motion Character

- smooth
- restrained
- confident
- spatial

### Potential Behaviors

- hero object responds subtly to pointer
- name reveals through object overlap
- object rotates or repositions with early scroll
- hero typography changes relationship to object
- scene transforms into Projects

### Avoid

- bouncy intro
- long entrance animation
- forced logo reveal
- cinematic loading sequence

The hero should be fully understandable immediately.

---

# Name → Projects

This should be one of the strongest transitions.

Potential sequence:

```text
hero object
→ moves away from identity composition
→ rotates / unfolds / changes material emphasis
→ visual field introduces project color
→ RANKLE enters
```

The exact choreography should emerge through prototyping.

The goal is continuity.

---

# Rankle Motion Language

### Character

- energetic
- playful
- slightly sharper
- game-like without becoming cartoonish

### Potential Behaviors

- tier tiles separate
- ranked object snaps between tiers
- stack shifts with scroll
- project color enters decisively
- comparison state reveals

### Easing

May be slightly quicker and more responsive than the global base.

Still avoid exaggerated spring behavior.

---

# Rankle → Plannr

Transition should noticeably change visual logic.

Potential sequence:

```text
loose game pieces
→ align
→ colors reduce
→ shapes flatten
→ document structure emerges
```

The transition can reinforce the contrast:

```text
PLAYFUL
→ PRECISE
```

---

# Plannr Motion Language

### Character

- precise
- ordered
- controlled
- explanatory

### Primary Transformation

```text
SYLLABUS
→ DEADLINES
→ REVIEW
→ CALENDAR
```

### Potential Behaviors

- text highlights appear
- selected date elements detach
- extracted items align
- accepted events settle into a calendar
- document structure resolves cleanly

Avoid:

- fake AI scanning beams
- loading dots
- typewriter extraction
- particles
- fake "thinking" animation

The motion should explain the product, not dramatize AI.

---

# Projects → Experience

Motion intensity should decrease.

Potential:

- project objects recede
- color returns toward neutral
- visual environment becomes simpler

The visitor should feel a change from:

```text
WHAT I BUILD
```

to:

```text
WHERE I'VE BEEN
```

Implemented (P2): no transition choreography. The live scenes end with Plannr (`decisions/003`), and Experience begins as type on the bone page. The drop in intensity is the change.

---

# Experience Motion Language

### Character

- calm
- chronological
- deliberate

### Implemented (P2)

Each duration rule extends from its start toward its end (`scaleX` 0 → 1, transform origin at the rule's start). It starts when the rule enters the viewport and is complete when the rule reaches 60% of the viewport height.

- Linear, scrubbed (`scrub: 0.6`). Scrolling back retracts it; a fast scroll or direct load lands fully drawn.
- Static presentation creates nothing: the rules are drawn.

### Implemented (P2.5): the scale calibrates

On desktop (above 60rem, where the shared scale exists) the year numerals start slightly right of their ticks and settle onto them as the rules draw, as if the scale were stretched about 1% and then found its true measure.

- Only the numeral glyphs move (an inner `data-experience-year` span). The ticks, which are the year spans' own borders, never move, so the encoded time is correct at every moment.
- Offset: 14 px × the year's field position (2022: 0; the latest year about 11 px), settling to 0.
- One tween, from the scale entering the viewport until the last rule reaches 60% (when the last rule finishes drawing). Linear, `scrub: 0.6`.
- PRESENT, names, roles, dates and copy never move. Duration remains the only encoding.
- Below 60rem the per-entry gauges draw as before; there is no numeral motion.

### Implemented (P2.6 Gate B): time compresses, durations answer

Supersedes the P2.5 calibration above, which was the same idea at about 14 px.

**Compression (desktop, above 60rem).**
- The whole field starts stretched 1.25× about its 2022 origin and compresses to its true scale. It runs from the field entering the viewport until its top reaches 30% of the height: linear in scroll, `scrub: 0.6`.
- One custom property, `--f` (1.25 → 1), drives every position: ticks, numerals, PRESENT, rules, projections and the hanging text. Each is offset from its settled place by (`--f` − 1) × its position, so they all sit on one temporary scale. No rule ever reads a false date against its ticks (measured: rule starts within 0.01 px of `start × f × width` at every frame).
- Offsets are transforms (`100cqi` is the field width), never layout, so the compression causes no layout shift. Offsets of type are whole pixels, and no type is promoted to a layer.
- Measured travel at 1440: Trader Joe's 28 px, Physics Learning Center 177 px, SpaceComputer 267 px (its rule 321 px; it enters from the right edge), PRESENT from off-screen.
- The steps start 0.35 of a step wider (`--spread`) and close with it, a 15–30 px diagonal settle that stays subordinate to the horizontal.
- The rules draw during the same pass, overlapping the compression (`--draw` 0 → 1, staggered).

**Rule draw.** The draw is a CSS custom property folded into the rule's own `scale`, never a GSAP transform. GSAP resets the individual `translate`/`scale`/`rotate` properties whenever it animates a transform, which would strip the compression offsets.

**Gauges (60rem and below).** Each gauge opens from 0.7 to full width about 2022 as its entry rises to mid-screen (entering → top at 50%). Its rule draws as before. The text never moves, and nothing runs off the screen.

**Engagement.** An entry is engaged while its text is pointed at (hover-capable devices) or its name holds focus (arrival from the navigator).
- The engaged entry's rule doubles in weight (`--weight`, registered, so only the weight eases while `--f` follows the scroll).
- Projections draw from its start and end up to the year scale.
- The years it spans, with their ticks (and PRESENT if ongoing), come to full ink. `ExperienceMotion` marks them on pointer and focus events, never per frame.
- Other entries settle back: rules 1 px and muted, text muted, all fully readable.
- Timing: engage 420 ms `cubic-bezier(0.22, 1.2, 0.36, 1)`, release 640 ms `cubic-bezier(0.25, 1, 0.5, 1)`.
- On phones, arrival focus doubles the gauge and mutes the other entries.
- No bending, no proximity warping: endpoints are always true.

Avoid:

- dots moving along a line
- animated resume cards
- progress-line timelines

---

# Experience → Education

Implemented (P2): none. Education follows in normal flow.

---

# Education Motion Language

### Character

- spatial
- exploratory
- calm

### Implemented (P2.5): typography measuring itself

The three lines enter at one shared Archivo width and resolve to their own calibrated widths, which bring them to one measure. Identical settings show how unequal the phrases are; the calibration resolves it. Nothing slides, fades, scales or reveals: only the real width axis moves.

- `EducationMotion` (tiny client component; the chapter stays server-rendered) tweens one custom property, `--resolve` (0 → 1), on the three `h3`s. The CSS interpolates `font-stretch` from `--wdth-from` to each line's (or phrase's) `--wdth`.
- Start: wdth 76 above 40rem, 66 on phones. Both are below every final width at that breakpoint, so no line ever runs past the measure or into the credential margin. Finals are unchanged (112.7 / 94.1 / 80; phones 93.8, 119.7 · 70.8, 105.3 · 75.2, 70.3).
- Above 60rem: one shared tween, no stagger, from the block entering the viewport until its top reaches 40%. A direct `#education` load lands resolved.
- 60rem and below (phones, 200% zoom): the lines stand up to a screen apart, so each line has its own range, from entering the viewport until its bottom reaches 85%. It is resolved before it rises into the reading area.
- Linear, `scrub: 0.6`. Scrolling back unresolves it.
- Font size and line height never change, so no line moves vertically and no trigger re-measures. Browsers quantize `font-stretch` to 0.25% steps (about 1.3 px of line width per step); no further quantization was added, and the interpolation is otherwise continuous.
- Layout stability: on desktop, as a line's first phrase widens, its second phrase moves along the line. Over a full scroll this measures CLS 0.014 at 1440 (accepted; well inside 0.1). Phones stack the phrases: CLS 0.
- The resolving rule sits in `@supports (font-stretch: calc(50% + 1%))`, after plain final declarations: a browser that cannot compute it keeps the exact final widths. Static presentation and no-JS never set `--resolve`, which defaults to 1 (the final widths).
- The credential margin, the gloss, the West Valley attribution and the A.A. line never move.

### Implemented (P2.6 Gate B): breadth under tension

**Resolution, stronger.**
- Shared start is now wdth 64 above 40rem (was 76) and 62 on phones (the axis minimum; was 66). The loaded Archivo axis is 62–125. Finals are unchanged.
- At 60rem and below each line now finishes when its bottom reaches 55% of the height (was 85%), so it resolves while it is being read.
- Layout stability: the larger range raises desktop CLS to about 0.045 per pass (the second phrase moving along a widening line). It is accepted, well inside 0.1. Phones stay at 0.

**Engagement (desktop with motion).** An area is engaged while pointed at, or while its title holds focus (arrival from the navigator).
- The engaged line stretches +5 on the real width axis past the shared measure (`--pull`, registered). The other two give 3 (`--yield`) and turn muted.
- +8 was planned. At desktop sizes a line grows about 0.93–1.0 em at +8, which would push the credentials past the viewport edge. +5 is the most that keeps 10 px between line and rule and the credentials inside the viewport at every desktop width (1440: push 34–39 px, credentials ≥ 32 px from the edge). The engaged/inactive contrast is still 8 units.
- The credentials are pushed right by the line's growth less its slack and the gutter, rounded to whole pixels: `--push`, from each line's measured `--grow` and `--slack` in ems.
- The ruled margin bends out around them instead of breaking. The rule is a clip-path polyline (the margin's `::before`): it leaves the rule's line, runs beside the pushed credentials and returns over 1.5 rem. Its diagonals are offset 1.5 px vertically (about 1.3 px square to the line), so they match the vertical's optical weight. At rest it is exactly the straight 1 px rule. The engaged rule comes to ink.
- Same engage/release timing as Experience. Font axis, never `scaleX`. Nothing reflows vertically, and the chapter clips horizontally as a guard.
- Phones: no width engagement (the phrases already fill the screen). Arrival focus brings the rule above the credentials to ink and mutes the other lines.
- Gate D clearance fix: the bend's top diagonal used to sit beside the title's cap height and crossed the line's last glyph. It now leaves the rule's line in the space above the row (`--lead`). The rule of the row above gives way by the same length (`--above`, eased without overshoot) so the two never fork. The first row has no rule above, so its rule starts at the pushed position. The target clearance is 14 px, and the pushed credentials close in 8 px toward their rule (a transform, no rewrap). Measured title-to-rule clearance including overshoot: 10–17 px at 1440, 11–17 at 1280, 12–16 at 961. The credentials stay 12 px or more inside the viewport.
- Reduced motion: ink and rule states only, with no width change and no push.

---

# Education → Off the Clock

The visual system may loosen.

Implemented (P2): no transition choreography. The loosening is compositional. Off the Clock moves from Education's rigid block to a Z of objects and words.

---

# Off the Clock Motion Language

### Character

- playful
- tactile
- slightly less rigid

Implemented (Gate 4, extended in P2.5): desktop-only, scroll-scrubbed, no pointer behavior. Three planes over one pass (section top at the viewport bottom → section bottom at the top), each through its settled position at mid-pass:

- **Objects (front).** Each drifts upward at its own rate: the glove 7% of its own height, the record 5%, the controller 3%.
- **The record's turn.** The record also turns −1.5° → 0° → +1.5° about its disc centre (measured `transform-origin`), clockwise: a barely perceptible physical turn, never a spin. Its baked sheen and shadow turn with it, which is why it stays this small. It has its own compositor layer (`will-change: transform`, desktop with motion only), so the turn is not re-rasterized every frame.
- **Display title (back).** OFF THE CLOCK lags: y −8 px → +8 px, snapped to whole pixels, so the type is never resampled and repaints only when the offset changes.
- **Words (middle).** BASEBALL, VINYL, GAMES and the facts never move.

Linear, `scrub: 0.6`; scrolling back reverses it. No pin, scaling, pointer response or loop. The glove and title never come closer than about 54 px (1280) / 60 px (1440); no object crosses a word or fact at any point of the pass. Phones, reduced motion, compact presentation and no-JS show the settled composition.

### Implemented (P2.6 Gate C): physical depth

Supersedes the P2.5 drift and turn above.

- **Scroll depth.** Each object travels over its own pass across the viewport (its top entering at the bottom → its bottom leaving at the top), linear, `scrub: 0.6`, so the planes separate while each is on screen. Travel is in content-width units, raised in Gate D so the layering reads at normal scrolling speed:
  - Glove 8.9u, record 5.8u, controller 3.3u: 120 / 78 / 44 px at 1440 (was 90 / 60 / 38). The front plane gains most and the rear least, so the separation grows while the controller stays quiet.
  - The title is a slower back plane, moving the opposite way, 4.8u (64 px at 1440, was 50).
  - Below 1440 the depth eases off in proportion to the stage. The facts are fixed-size type, so the room around them shrinks faster than the stage; at 961 the record keeps at least 10 px from the Baseball fact.
  - Phones: 56 / 43 / 25 px, objects only.
- **No turn.** Translation only. The baked sheen and shadow argued against rotation, and translation carries depth better.
- **Pointer depth** (desktop, fine pointer). Pointer position relative to the still life's centre, clamped to ±1, leans each object with it: glove ±21 / ±13 px, record ±14 / ±9, controller ±7 / ±5 (x / y; Gate D, was 16 / 10, 11 / 7, 6 / 4). The title leans against it: ∓8 / ∓5. The amplitudes are set at 1440 and scale down with narrower stages. GSAP `quickTo`, 0.9 s, `power3.out`: damped, no overshoot, eased back to zero on leave. Listeners are on the chapter only, attached only while it is in view.
- **Architecture.** Scroll depth is `--depth` on each `<picture>` (composed with the phone record's `--bleed`); pointer depth is `--px` / `--py` on its `<img>`. The title's scroll and pointer parts are summed into one whole-pixel `translate`. GSAP tweens only custom properties, so the CSS `translate` is never reset and the two systems never write the same transform. Each image is its own compositor layer (`will-change: translate`, with JS and motion, not compact); the title is never promoted.
- **Engagement.** Arrival from the navigator focuses a subject's word. Its index dash runs on as a 3 rem rule, its object leans 1.35× further, and the other two subjects' words and facts settle to muted ink.
- **Static.** Reduced motion, compact and no-JS: the settled still life.

---

# Off the Clock → Contact

Motion should resolve rather than escalate.

Implemented (P2): no transition choreography. Off the Clock's drift settles as it leaves, and Contact arrives still.

---

# Contact Motion Language

### Character

- quiet
- conclusive
- minimal

Implemented (P2, P2.5): nothing moves on scroll. The page has stopped; only the thing the visitor acts on responds.

- On hover (`@media (hover: hover)` only) or keyboard focus (`:focus-visible`, alongside the outline), the rule under MOVE. runs on 0.5 em past the word, rightward only. The word keeps its own underline at rest, so the resting rule is unchanged; the extension is a `::after` segment that scales from its left edge.
- 320 ms in, 200 ms out, `cubic-bezier(0.2, 0, 0, 1)`: no overshoot, no loop. Reduced motion: the same state, without the transition.
- Touch: no hover state; a tap opens the mail link.
- The MB and the text never move. CSS only.
- Known: in Chromium at phone sizes the extension can sit 1 CSS px below the word's underline (Chromium snaps the underline there). It is visible only on keyboard focus, since phones have no hover.

Links above behave as ordinary links.

### Implemented (P2.6 Gate C): the visitor moves it

Supersedes the P2.5 behavior above. Contact still never moves on its own; every response is to the visitor.

**Rows.** `--row-engage` (registered, 0 → 1) is a row's engagement: hover (hover-capable devices), keyboard focus, arrival from the navigator (`[data-arrived]`), or a press on touch (`:active`).
- The value moves 20 px right (phones 0.75 rem).
- A 1 px tie draws from just after the label's own text, through the rest of the label column and the gap, to the moving value. It is a flex filler whose negative end margin reaches the value. On phones, where the label sits above the value, a hairline runs in from the row's edge instead.
- The outbound arrow leans 0.12 em up and out, the underline thickens to 2 px, and the other rows settle to muted ink.
- Engage 420 ms with overshoot, release 640 ms; a press engages in 160 ms.
- A tap's own focus never engages, so nothing sticks after a tap.
- Reduced motion: ink, tie and underline change; nothing moves.

**Approach (Gate D).** On fine pointers, while Contact is on screen, `ContactMotion` eases two pointer-driven amounts that the CSS combines with the states above through `max()`. Contact still never moves on its own.
- `--near` per row (closeness to its centre line, fading past its value): the nearest row's value starts to slide out and its tie to draw, up to 60% of engagement, and its neighbours follow faintly.
- `--reach` on the closing line (approach from above): the rule starts to run, MOVE. to stretch and the MB to lean, up to 40%.
- Follow: `quickTo` 0.5 s, `power3.out`, eased back to zero on leave.
- Hover and focus still complete each gesture. Touch, reduced motion and compact create nothing.
- The closing line's gestures are registered properties (`--stretch`, `--rule`, `--reply`) so they can transition on their own curves while the pointer amount blends in.

**YOUR MOVE.** Desktop hover or keyboard focus (and a touch press):
- MOVE. stretches 112 → 118 on the real width axis. It uses the elastic engage curve over 520 ms.
- Its rule runs from the moving end of the word to the content edge (`100cqi`). It travels on an even ease-in-out over 540 ms (`cubic-bezier(0.65, 0, 0.35, 1)`), so the run can be watched. At 1440 it reaches the MB at 277 ms, passes its centre at 327 ms and arrives at 536 ms.
- The MB then replies: one 0.1 em step toward the word (21 px at 1440). It starts at 380 ms (`--mb-delay`, just after the rule passes its centre), lands in 280 ms without overshoot, and holds while engaged.
- Release: 640 ms.
- Touch: the rule and width run in 180 ms and never delay the mail action. The MB stays put.
- Reduced motion: the final state appears instantly; the MB never moves.

---

# Scroll-Driven Motion

Scroll progress should be used when the visual relationship maps naturally to progress.

Good examples:

- object rotation through a scene
- document transformation
- project transition
- large typography movement

Poor examples:

- animating every metadata label
- fading every paragraph
- continuously rotating objects with no narrative role

---

# Pinning

Pinned sections may be used sparingly.

A pinned scene is justified when:

- a visual transformation needs time
- the user benefits from seeing multiple states in one viewport
- motion explains a concept

Examples:

- Plannr transformation
- hero transition

Do not pin a section merely to make it feel interactive.

Pinned duration should be as short as possible while still communicating the idea.

---

# Easing

The global motion character should feel controlled.

Likely easing families:

- power
- cubic
- quart
- custom restrained curves

Avoid default heavy spring physics.

Potential conceptual direction:

```text
enter:
smooth deceleration

exit:
slightly faster

object response:
quick but restrained
```

Exact easing tokens should be established after prototype testing.

---

# Duration

Do not lock exact timings too early.

General principles:

## Micro Interaction

Fast.

Approximately:

```text
100–250ms
```

## UI Expansion

Moderate.

Approximately:

```text
200–400ms
```

## Scene Transition

Driven by scroll rather than fixed duration where possible.

## Autonomous Motion

Avoid long autonomous sequences.

The user should not wait for them.

---

# Continuous Motion

Avoid continuous animation unless it provides real value.

Examples that may be acceptable:

- extremely subtle idle rotation
- gentle object drift
- small shader behavior

Examples to avoid:

- constant spinning
- floating everything
- looping text
- endless marquee with no purpose
- perpetual decorative motion

Continuous motion should stop or simplify under reduced-motion settings.

---

# Pointer Motion

Pointer response should be low amplitude.

Good:

- 1–4° object rotation
- small translation
- slight magnetic pull
- gentle depth change

Avoid:

- objects chasing the cursor
- huge perspective shifts
- unstable typography
- nausea-inducing parallax

Pointer behavior should disappear gracefully on touch.

---

# Touch Motion

Touch users should not lose core functionality.

Do not require:

- hover
- precision drag
- cursor proximity
- mouse-follow interactions

Touch may use:

- tap
- simple press
- normal scroll

Complex pointer effects may simply not exist on touch devices.

---

# Reduced Motion

Reduced motion is a designed alternate mode.

Use:

```css
@media (prefers-reduced-motion: reduce)
```

but do more than remove duration.

Each scene should define:

- stable visual state
- readable object pose
- visible content
- normal document flow
- immediate navigation

---

# Reduced Motion Behavior by Scene

## Name

- hero object static
- no pointer movement
- no scroll transformation
- normal transition into Projects

## Rankle

- pieces statically arranged
- no tier movement required
- project fully understandable

## Plannr

- visual sequence statically composed
- all stages understandable

## Experience

- duration rules drawn in full; roles and dates as text

## Education

- final widths; engagement changes ink and rule only

## Off the Clock

- objects at their settled positions
- labels and facts always visible

## Contact

- unchanged (no motion)

---

# Motion and Accessibility

Motion must never be the only signal.

If an object moves into an active state, also use:

- text
- contrast
- scale
- outline
- label

where appropriate.

Do not convey essential information solely through position changes.

---

# Motion and Performance

Motion should avoid unnecessary layout work.

Prefer animating:

- transform
- opacity
- shader uniforms
- camera values

Avoid repeatedly animating:

- width
- height
- top
- left
- large layout-affecting properties

unless there is a clear reason.

---

# GSAP Responsibility

GSAP should own choreographed motion.

Likely uses:

- ScrollTrigger
- timeline sequencing
- transform control
- text/object transitions
- scene transitions

Do not mix multiple high-level animation systems without reason.

---

# CSS Responsibility

CSS should own:

- hover
- focus
- simple state transitions
- lightweight micro-interactions

Do not use GSAP for a basic underline hover.

---

# R3F / Three.js Responsibility

R3F / Three.js should own:

- 3D transforms
- camera
- lighting
- materials
- object visibility
- scene-specific spatial effects

DOM animation and 3D animation should be coordinated through shared scene progress, not separate unrelated timelines.

---

# Lenis Responsibility

Not adopted in P1 (`decisions/001-gsap-scrolltrigger-native-scroll.md`): scrolling is native, and each timeline smooths its own values with `scrub: 0.6`.

Any future smooth-scroll layer must not:

- break anchor navigation
- interfere with keyboard scroll
- cause accessibility problems
- create input lag
- fight ScrollTrigger
- behave poorly on touch

A smooth-scroll layer is only justified if it materially improves the experience.

---

# State Responsibility

Do not use motion state as application state when avoidable.

Scene state should remain simple.

Potential global states:

- current chapter
- scene readiness
- reduced-motion preference
- device capability
- navigator state

Do not create a large animation state machine unless the prototype proves one is needed.

---

# Motion Debugging

During development, support a way to inspect:

- chapter progress
- active ScrollTriggers
- scene state
- reduced-motion mode

This may be a development-only helper.

Do not expose debugging UI publicly.

---

# Motion Testing

Every significant motion sequence should be tested for:

- desktop
- mobile
- touch
- keyboard navigation
- reduced motion
- resize
- fast scroll
- reverse scroll
- direct hash navigation
- browser back/forward

Also test:

- entering mid-page
- refreshing on a hash
- rapid scrolling through a pinned scene

The site must recover cleanly.

---

# Motion Failure Modes

Avoid:

## Scroll desynchronization

DOM says one chapter is active while 3D shows another.

## Stale transforms

Objects remain in an incorrect position after resize or navigation.

## Transition dependency

Content becomes inaccessible if animation initialization fails.

## Animation accumulation

Repeated navigation creates duplicate timelines or listeners.

## Resize breakage

Pinned distances no longer match layout after viewport changes.

## Mobile jank

Desktop effects run unnecessarily on low-power devices.

---

# Motion Anti-Patterns

Do not use:

- fade-up on every section
- animation on every line of text
- excessive stagger
- massive spring bounce
- scroll hijacking
- forced snap scrolling
- spinning 3D logos
- continuous floating objects everywhere
- long unskippable intro
- artificial loading animations
- mouse trails
- cursor gimmicks by default
- random distortion
- glitch effects without narrative reason
- project-specific motion leaking into every chapter

---

# Prototype Motion Scope

The first motion prototype should implement only:

1. chapter navigator behavior
2. hero pointer response
3. hero scroll transformation
4. Name → Projects transition
5. Rankle object behavior
6. Rankle → Plannr transition
7. Plannr transformation
8. reduced-motion alternatives
9. mobile simplification

Do not build motion for:

- Experience
- Education
- Off the Clock
- Contact

until the initial motion language is approved.

---

# Motion Review Checklist

Before approving an animation:

### Purpose

What does this motion communicate?

### Necessity

Would the scene be clearer without it?

### Spatial Logic

Does the motion follow the visual composition?

### Control

Can the user interrupt or reverse it?

### Performance

Does it remain smooth on intended devices?

### Accessibility

Does reduced motion preserve the meaning?

### Static State

Does the scene still look excellent when motion ends?

### Originality

Does it feel authored rather than copied from a demo?

### Density

Is there too much other motion happening nearby?

### Consistency

Does it belong to the portfolio's motion language?

---

# Motion Established in P1

The opening journey (hero → Rankle → Plannr) is one continuous object story. The same machined plates are rearranged scene by scene; nothing fades in from nowhere.

## System

- Each chapter owns its timelines in a client `*Motion` component (`HeroMotion`, `RankleMotion`, `PlannrMotion`), created inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
- Timelines are linear (`ease: "none"`) and scrubbed with `scrub: 0.6`. They write normalized progress into the shared `scene` object, and the canvas derives every pose from it, so reversing, fast flings and direct hash loads all land on the same frame.
- Eased tweens are used only for DOM type reveals inside those timelines (`power2.in` for the name parting, `power3.out` for title rises).
- Holds are CSS sticky frames inside tall runway blocks. There is no ScrollTrigger pinning, snapping or scroll hijacking.
- Rendering is on demand. Nothing animates while the page is idle.

## Choreography

| Moment | Runway | What changes |
|---|---|---|
| Hero | not pinned (one viewport) | The MB plates form an anamorphic, slightly turned relief that overlaps the name. On fine pointers they tilt up to 5°/3.5°, damped, fading out over the first quarter of the exit. |
| Hero → Rankle | first viewport of scroll | The name lines part like curtains, cropping off opposite edges. The plates turn over and travel into the Rankle stage; the long plates become your board's tier rows. |
| Rankle | 300svh desktop / 240svh mobile | The title rises out of a mask. While the frame is held, the prompt "Best breakfast food" rises out of its own mask as your rows form (scene progress 0.06–0.18), your labeled plates settle into your tiers (0.16–0.42), the friend's board fills (0.38–0.66), and threads connect each item's plates edge to edge (0.62–0.80), ending in the comparison hold (0.80–1). |
| Rankle → Plannr | Plannr frame rising (one viewport) | The prompt, YOU / A FRIEND and the tier letters fade (`autoAlpha`) over hand-off 0–0.3, with the friend's board and the threads retracting. Your plates flip to their paper side (the printed name turns away with the face) and become date chips. Tier rows flatten into syllabus lines on a paper page. Scrubbed, so scrolling back restores everything in reverse order. |
| Plannr | 300svh desktop / 280svh mobile | Dates are highlighted, lift into a review queue and receive verdicts (one declined date stays on the page). The approved dates land in a landscape calendar while the page recedes. The DOM step list (Syllabus, Dates, Review, Calendar) tracks the current stage. |

## Mobile

- Mobile is its own composition, set by CSS stage zones: the Rankle boards sit under the copy, and the Plannr stage sits above its copy.
- The page fills the stage and then recedes for the full-width calendar.
- Moving objects may cross the monumental name type during the hero exit. They never cross small copy, links, metadata or navigation.

## Reduced Motion and Compact Viewports

The same static presentation applies on a compact viewport, `(max-width: 40rem) and (max-height: 30rem)`, where a held 100svh frame cannot fit a scene and its copy (for example 250%+ page zoom). Here the scenes flow at natural height. Width alone never disables motion.


- No timelines are created and the canvas never mounts.
- Runways collapse to one viewport per scene.
- Each scene shows its captured static composition: the canonical MB, the Rankle comparison hold, and the Plannr syllabus plus calendar.
- All four Plannr steps are shown at full ink, so no meaning depends on motion.
- Chapter links jump instantly.

# Motion Established in P2 and P2.5

The second half is DOM motion only. The canvas does nothing past Plannr (`decisions/003`). Each chapter has its own motion language: lines measure time, letters measure breadth, objects occupy space, and Contact waits for input.

| Chapter | Motion | Presentation without it |
|---|---|---|
| Experience | P2.6: the field compresses 1.25 → 1 about 2022 with a diagonal settle while the rules draw (desktop); gauges open 0.7 → 1 (60rem and below); engaged entries thicken, project to the scale and light their years | settled field; engagement as ink and weight only |
| Education | P2.6: the lines resolve from 64 (phones 62) to their calibrated widths on the real `wdth` axis; an engaged line stretches +5, the others give 3, and its margin rule bends out (desktop) | final widths; engagement as ink only |
| Off the Clock | P2.6: per-object scroll depth (desktop 90 / 60 / 38 px at 1440, phones 46 / 36 / 22), the title a counter-moving back plane, damped pointer depth on desktop | settled still life |
| Contact | P2.6: rows engage (value shift, tie, arrow, muted siblings); MOVE. stretches, its rule travels to the edge, the MB replies; CSS only | instant ink/rule/width states, no movement |

- All timelines use the P1 system: per-chapter client components, `gsap.matchMedia` with `PRESENTATION_CONDITIONS`, linear and `scrub: 0.6`. None adds a listener of its own.
- Intended intensity (P2.5): Projects highest; Experience about 4/10; Education about 3; Off the Clock about 6, the only later rise; Contact about 1 (interaction only). P2.6 raises Experience to about 6 and Education to about 5.
- No pinning, sticky holds, pointer behavior or loops.
- Reduced motion, compact viewports and no-JS create no timelines and show the composed state. No-WebGL and scene failure leave P2 motion unchanged, because it does not depend on the canvas.

# Navigation Travel (P2.6 Gate A)

Navigation is part of the choreography (`decisions/004`). A navigator activation travels the native document scroll to its destination, so every chapter in between plays at speed. Nothing else travels: Back/Forward, hash loads and the skip link stay native and instant.

- **Duration:** `t = clamp(0.8s, 0.6 + 0.5·√v, 2.4s)`, with `v` the distance in viewport heights.
- **Curve:** a smoothed trapezoid velocity profile. Speed rises from rest along a smoothstep, cruises, then falls along a mirrored smoothstep. Position is the integral of that profile (`travelEase` in `lib/motion/travel.ts`). The ramp share of each end goes from 0.5 (one viewport or less: no cruise) to 0.28 (eight viewports or more), so a long trip peaks at about 1.4× its average speed. A cubic in-out would peak at about 3×.
- **Measured at 1440×900:**
  - Projects → Experience: 6.0 viewports in 1.79s
  - Hero → Contact: 10.5 viewports in 2.18s
  - Contact → Projects: 9.5 viewports in 2.11s
  - Computer Science → Mathematics + Physics: 0.17 viewports in 0.8s
- **Interruption:** wheel, touch, pointer down, any non-modifier key, or scroll the trip did not write (over 3 px) stops it on that frame, with no snap and no resume.
- **Menu motion:**
  - The index opens with its existing downward clip (its clip now reaches past the list to the left and below, where the rails hang).
  - A rail draws its connector (`scaleX`, 160ms) and is revealed right to left along it (220ms). Its labels slide the last half rem against the rail, staggered 25ms.
  - A rail closes all at once in 120ms.
  - On touch, an opened group unrolls down its rule (220ms).
  - Under reduced motion every menu state is instant and travel is a jump.

# Hero Pointer Tilt (P2.6 Gate D)

The MB relief tilts with the pointer up to ±9° yaw / ±6° pitch at the viewport edges (was ±5° / ±3.5°, too slight to notice). It is the same damped response (`MathUtils.damp`, rate 5) and the same fade-out over the first quarter of the hero exit, so the rest pose and the hand-off to Rankle are unchanged. It settles within about 1.5 s; idle at rest is 0 frames.

# Open Motion Decisions

Settled in P1:

- easing and smoothing (as above)
- Lenis: not adopted
- the hero is not pinned
- the Name → Projects choreography
- the Rankle hold
- the Rankle → Plannr transition
- the Plannr runway

Settled in P2:

- pointer response stays in the hero; no P2 chapter responds to the pointer (re-examined in P2.5 for Off the Clock and rejected: at 2–6 px it read as a UI effect, not depth)
- P2.5: no fades, slides or reveals in the second half; motion there is measurement (rules, numerals, the width axis), depth (Off the Clock's planes) or response (Contact)
- later chapters reuse `scrub: 0.6` and linear scrubbing; no separate timing tokens were needed
- no chapter after Projects uses live WebGL (`decisions/003`)

Settled in P2.6 Gate A:

- navigator jumps travel the real scroll (`decisions/004`); Back/Forward never animate

Still open:

- whether magnetic links are used
- whether custom shaders are needed
- exact low-power fallback threshold (P1: full WebGL or static only)

These should be learned through prototype quality and performance testing.

---

# Final Motion Standard

The visitor should not think:

> This site has a lot of animations.

They should think:

> **This entire thing feels unusually smooth and intentional.**

Motion should make the experience feel physically connected.

The best motion will be noticed emotionally before it is noticed technically.
