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

Education:

```text
isolated subject labels
→ gather into clusters
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
- large year typography enters
- visual environment becomes simpler

The visitor should feel a change from:

```text
WHAT I BUILD
```

to:

```text
WHERE I'VE BEEN
```

---

# Experience Motion Language

### Character

- calm
- chronological
- deliberate

### Potential Behaviors

- years move through the viewport
- role information changes as a year becomes active
- typography shifts in scale

Avoid:

- dots moving along a line
- animated resume cards
- progress-line timelines

The years themselves should carry the motion.

---

# Experience → Education

Potential concept:

```text
timeline
→ fragments into conceptual clusters
```

or:

```text
year numerals
→ reduce into academic nodes
```

This should feel less chronological and more spatial.

---

# Education Motion Language

### Character

- spatial
- exploratory
- calm

### Potential Behaviors

- subject clusters assemble
- secondary course labels orbit or settle near category anchors
- pointer proximity creates small movement
- scroll adjusts cluster relationships

Avoid:

- chaotic force-directed graph
- physics simulation where labels constantly move
- unreadable node clouds

All labels must remain understandable.

---

# Education → Off the Clock

The visual system may loosen.

Potential:

```text
structured academic cluster
→ disperses
→ becomes still-life objects
```

The transition should signal:

```text
WORK / STUDY
→ PERSONAL
```

---

# Off the Clock Motion Language

### Character

- playful
- tactile
- slightly less rigid

### Potential Behaviors

- objects separate
- labels appear
- selected item subtly comes forward
- small rotations
- gentle depth changes

This section can use the most expressive pointer behavior.

Still avoid turning it into a toy.

---

# Off the Clock → Contact

Motion should resolve rather than escalate.

Potential:

- objects recede
- scene simplifies
- hero object reappears
- typography becomes dominant again

The site should visually return to its identity system.

---

# Contact Motion Language

### Character

- quiet
- conclusive
- minimal

Potential:

- hero object settles into a final pose
- links reveal simply
- final typography resolves

No elaborate interaction is needed.

---

# Scroll-Driven Motion

Scroll progress should be used when the visual relationship maps naturally to progress.

Good examples:

- object rotation through a scene
- document transformation
- project transition
- large typography movement
- cluster assembly

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
- education cluster formation

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

- roles and years shown in normal flow

## Education

- clusters preassembled or converted to grouped layout

## Off the Clock

- objects composed statically
- labels directly available

## Contact

- final composition shown directly

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

Lenis may be used for scroll feel.

Its use is provisional.

It must not:

- break anchor navigation
- interfere with keyboard scroll
- cause accessibility problems
- create input lag
- fight ScrollTrigger
- behave poorly on touch

If Lenis does not materially improve the experience, remove it.

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

# Open Motion Decisions

These should remain unresolved until P1 testing:

- exact easing curves
- exact scroll smoothing
- whether Lenis stays
- whether the hero is pinned
- exact Name → Projects choreography
- exact Rankle interaction
- exact Rankle → Plannr transition
- exact Plannr pin duration
- whether magnetic links are used
- whether pointer response appears outside hero/projects
- whether custom shaders are needed
- exact low-power fallback threshold
- exact motion timing tokens

These should be learned through prototype quality and performance testing.

---

# Final Motion Standard

The visitor should not think:

> This site has a lot of animations.

They should think:

> **This entire thing feels unusually smooth and intentional.**

Motion should make the experience feel physically connected.

The best motion will be noticed emotionally before it is noticed technically.
