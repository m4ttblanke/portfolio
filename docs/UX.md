# UX Architecture

## Purpose

This document defines the user experience architecture for Matthew Blanke's portfolio.

It describes:

- the one-page journey
- chapter order
- navigation behavior
- information hierarchy
- interaction expectations
- mobile behavior
- reduced-motion behavior
- how visitors move between discovery and detail

It does not define exact visual styling, animation timings, or implementation APIs.

Those belong in:

- `ART_DIRECTION.md`
- `DESIGN.md`
- `MOTION.md`
- `ARCHITECTURE.md`

---

# Core UX Model

The primary portfolio experience is one continuous scroll journey.

The homepage is the portfolio.

Visitors should not need to navigate through multiple pages to understand:

- who Matthew is
- what he builds
- where he has worked
- what he studies
- what he is interested in
- how to contact him

The journey is divided into chapters:

```text
01 NAME
02 PROJECTS
03 EXPERIENCE
04 EDUCATION
05 OFF THE CLOCK
06 CONTACT
```

The user may experience the page in two ways:

### Linear mode

Scroll from beginning to end.

This is the intended primary experience.

### Random-access mode

Use the fixed chapter navigator to jump directly to a chapter.

This supports:

- recruiters who want Projects immediately
- reviewers looking for Education
- returning visitors
- keyboard users
- mobile visitors who want direct access

The two modes must coexist cleanly.

---

# UX Principle

> The page should feel guided without feeling trapped.

The portfolio may be highly choreographed, but the user must always retain control.

Do not:

- hijack scroll
- lock users into long animations
- require watching transitions before content becomes accessible
- hide navigation
- disable browser conventions
- force interaction before scrolling
- make users "play through" the portfolio

The experience should feel authored, not restrictive.

---

# Information Hierarchy

The page should expose information in layers.

## Layer 1 — Immediate understanding

Visible without interaction.

Examples:

- name
- project name
- one-line project explanation
- role/company
- field of study
- contact action

## Layer 2 — Supporting context

Available through concise visible metadata or lightweight interaction.

Examples:

- stack
- status
- dates
- role details
- selected coursework
- short technical note

## Layer 3 — Deep detail

Optional.

Examples:

- architecture
- project evidence
- development history
- implementation details
- complete résumé information

Layer 3 should never dominate the main scroll journey.

---

# Chapter Navigator

## Purpose

The chapter navigator provides persistent orientation and fast access without consuming the primary viewport.

It replaces a conventional fixed top navigation bar.

---

## Default State

The navigator remains compact.

Possible conceptual states:

```text
01
```

or:

```text
INDEX
```

or a similarly minimal marker.

The exact visual treatment is not yet locked.

The current chapter should still be identifiable in the compact state.

---

## Expanded State

On desktop, hover or keyboard focus may expand the navigator.

Expected structure:

```text
01  NAME
02  PROJECTS
03  EXPERIENCE
04  EDUCATION
05  OFF THE CLOCK
06  CONTACT
```

Requirements:

- current chapter clearly indicated
- hover is not required for access
- focus opens the same information
- Escape closes the expanded state when appropriate
- chapter links are real links or buttons with correct semantics
- tab order is logical
- focus remains visible
- expanded navigation never traps focus

---

## Mobile State

Mobile must not depend on hover.

A tap opens the chapter navigator.

Requirements:

- clear open/close control
- comfortable touch targets
- no accidental chapter activation while opening
- no full-screen takeover unless justified by prototype testing
- no gesture-only access
- no reliance on pointer position

The mobile index should remain fast and visually light.

---

## Chapter State

The active chapter should update as the visitor scrolls.

The active state should be derived from actual section visibility/progress rather than hard-coded pixel offsets whenever possible.

Expected anchors:

```text
#name
#projects
#experience
#education
#off-clock
#contact
```

The navigator should support direct links such as:

```text
/#projects
/#education
```

---

## Jump Behavior

Clicking a chapter should:

1. close the navigator if expanded
2. move to the requested chapter
3. preserve keyboard expectations
4. update the URL hash sensibly
5. avoid disorienting scroll behavior

For normal-motion users, movement may be smoothly choreographed.

For reduced-motion users, navigation should be immediate or minimally animated.

---

# Chapter 01 — Name

## Purpose

Answer:

> Who is Matthew Blanke?

within seconds.

The chapter should establish:

- identity
- professional direction
- visual tone
- interaction quality

---

## Primary Takeaway

Matthew is a technically strong computer science student and software/product builder with strong visual taste.

The exact public descriptor should remain concise.

---

## Visible Content

Likely:

- MATTHEW BLANKE
- short professional descriptor
- one concise secondary line
- hero object
- chapter navigation

Avoid:

- biography paragraph
- long introduction
- multiple CTAs
- résumé summary
- skill list

---

## Primary Visual

One dominant generated object.

Potentially:

- sculptural MB
- dimensional identity form
- custom typographic object

The visual should share the viewport with large typography.

---

## Interaction

Potential interaction:

- subtle pointer response
- scroll-driven transformation
- spatial movement into Projects

The interaction should be immediately understandable without instructions.

---

## Entry State

The visitor arrives in a stable, composed hero.

No intro animation should delay access.

No splash screen.

No loading experience that blocks text.

---

## Exit Transition

The hero should transition into Projects through spatial continuity.

Potential behavior:

- object moves
- object rotates
- scale changes
- typography recedes
- project environment emerges

The transition itself should communicate that the user is entering Work.

---

## Mobile

Mobile should preserve:

- strong name
- hero visual
- one concise descriptor

It may simplify:

- object complexity
- pointer response
- typography overlap
- camera behavior

---

## Reduced Motion

Provide a stable hero composition.

Scrolling should move normally into Projects.

Do not leave the hero object frozen in an awkward transitional pose.

---

# Chapter 02 — Projects

## Purpose

Answer:

> What does Matthew actually build?

The section should establish product and engineering credibility quickly.

---

# Project Hierarchy

## Flagship

1. Rankle
2. Plannr

These receive major visual scenes.

## Secondary

A small selection of additional work may appear later in the Projects chapter.

Secondary work should be much lighter.

---

# Rankle Scene

## Primary Takeaway

Rankle is a daily social ranking game designed around committing to a ranking and comparing it with other people.

---

## Visible Content

Likely:

```text
RANKLE

A daily ranking game built for arguments with friends.

NEXT.JS / SUPABASE
LIVE ↗
```

Exact copy remains subject to `CONTENT.md`.

---

## Primary Visual

A custom object system inspired by:

- tier lists
- ranking cards
- voting
- game pieces

The visual should communicate the product concept before the user reads supporting copy.

---

## Interaction

Potential interactions:

- tiles separate or reorder
- a ranked object moves between tiers
- pointer proximity affects pieces
- scroll reveals comparison state

Interaction must remain concise.

Do not recreate the full application UI.

---

## Optional Detail

A lightweight control may expose additional information.

Conceptually:

```text
DETAILS +
```

Potential optional detail:

- project role
- technical decisions
- source
- architecture note

The default state remains concise.

---

# Rankle → Plannr Transition

The transition should not feel like:

```text
Rankle ends
blank section
Plannr begins
```

Instead, use spatial choreography.

Possible concept:

- Rankle objects collapse
- color drains
- geometry aligns
- paper/document form emerges

The exact transition will be developed during prototyping.

---

# Plannr Scene

## Primary Takeaway

Plannr turns a syllabus into reviewed calendar information.

---

## Visible Content

Likely:

```text
PLANNR

Drop in a syllabus.
Get back a calendar.

SWIFTUI / FASTAPI
TESTFLIGHT ↗
```

Exact copy remains subject to `CONTENT.md`.

---

## Primary Visual

The visual sequence should communicate:

```text
SYLLABUS
→ DATES
→ REVIEW
→ CALENDAR
```

Potential assets:

- document
- highlighted lines
- detached dates
- calendar tiles

---

## Interaction

Scroll should help visualize transformation.

The user should not need to interact manually to understand the core product.

Optional pointer/tap interactions may add detail but should not be required.

---

## Secondary Work

After Rankle and Plannr, the page may introduce selected smaller work.

The presentation should remain concise.

Possible structure:

```text
COURSE SEARCH
NETWORK PROTOCOLS
COMPUTATIONAL WORK
```

A shared visual stage may change based on the currently focused or hovered project.

Do not create a large card grid.

Do not create mini case studies.

---

## Projects Exit

Projects should transition into Experience with a noticeable reduction in visual intensity.

The visitor should feel:

> I understand what he builds. Now show me where he has been.

---

# Chapter 03 — Experience

## Purpose

Answer:

> What environments has Matthew worked in?

without duplicating the résumé.

---

## Primary Takeaway

Matthew has substantial real-world work experience, academic support experience, and software/product experience.

---

## Visible Content

Potential experiences:

- Trader Joe's
- Physics Learning Center
- UCSB / project work where appropriate

Each experience should use very little copy.

---

## Visual Model

Avoid standard timeline UI.

Potential approach:

Large years become visual architecture.

Example:

```text
2020

TRADER JOE'S
```

then:

```text
2024

PHYSICS LEARNING CENTER
```

then:

```text
2025

UCSB
```

The exact years and sequencing must be verified in `CONTENT.md`.

---

## Interaction

Scroll may:

- move large year typography
- replace role information
- shift the composition through time

No manual timeline dragging should be required.

---

## Detail Strategy

The homepage only communicates the important signal.

Full details live in the résumé.

Provide a clear résumé path without reproducing the document.

---

## Mobile

Mobile may display experiences sequentially.

Large year typography can remain, but should not make role details unreadable.

---

# Chapter 04 — Education

## Purpose

Answer:

> What does Matthew study, and what is the shape of his technical background?

---

## Primary Takeaway

Matthew's academic background combines:

- Computer Science
- Mathematics / Physics
- Technology Management

The interaction should make these relationships understandable quickly.

---

## Visual Model

Potentially a spatial cluster system.

Primary clusters:

```text
COMPUTER SCIENCE
MATHEMATICS + PHYSICS
TECHNOLOGY MANAGEMENT
```

Supporting course nodes may gather around each cluster.

---

## Interaction

Potential behavior:

- clusters assemble with scroll
- nearby nodes subtly respond to pointer
- relationships become visually apparent

Avoid making the visitor decode a complicated graph.

This is an art-directed academic map, not a data visualization product.

---

## Content Density

Show representative coursework, not every course.

Selection criteria:

- academically meaningful
- relevant to target audience
- demonstrates breadth
- demonstrates progression

Complete academic details do not need to appear on the homepage.

---

## Mobile

Clusters may become sequential grouped sections.

Do not force a complex graph onto a narrow screen.

---

# Chapter 05 — Off the Clock

## Purpose

Answer:

> Who is Matthew outside school and software?

with minimal prose.

---

## Primary Takeaway

Matthew has clear interests and personality beyond technical work.

---

## Potential Topics

A small selection from:

- sports
- vinyl/music
- games
- travel

The final selection will be defined in `CONTENT.md`.

---

## Visual Model

Potential generated still-life.

Example objects:

- vinyl record
- basketball
- baseball
- controller
- travel object

The objects should feel like one art-directed composition.

---

## Interaction

Potential behavior:

- objects separate slightly
- labels appear
- hover/focus identifies individual items
- scroll changes composition

Avoid:

- hobby cards
- icon grids
- long descriptions

---

## Mobile

Touch users need a clear way to reveal any hidden labels.

Do not depend on hover.

The composition may simplify significantly.

---

# Chapter 06 — Contact

## Purpose

Give the journey a clear ending and make contact frictionless.

---

## Primary Content

- email
- GitHub
- LinkedIn
- résumé

Potential closing line:

```text
SAY HI.
```

or another concise treatment.

Exact language remains open.

---

## Visual Model

The hero object may return or resolve here.

This creates a visual callback and gives the experience closure.

---

## Interaction

Keep interaction minimal.

Contact links should behave normally.

Do not add:

- elaborate contact forms
- multi-step interactions
- hidden email reveal
- artificial friction

---

## End State

The user should feel the journey is complete.

The ending may include a very small footer for:

- copyright
- build credit
- minimal utility information

Do not let the footer visually overpower Contact.

---

# Resume UX

A résumé should remain directly accessible.

Potential route:

```text
/resume
```

The final implementation may be:

- HTML résumé
- embedded/downloadable PDF
- both

The homepage should link to it clearly.

The résumé should not become another major visual chapter.

---

# Deep Project Information

The main journey should not force deep technical case studies.

Possible future models:

## Disclosure

```text
DETAILS +
```

Expands limited additional context.

## Project Route

A route such as:

```text
/projects/rankle
```

may exist if a clear use case emerges.

## External Source

GitHub or live project links may provide the needed depth.

Do not create project routes automatically.

---

# Scroll Behavior

The browser's vertical scroll remains the primary progress mechanism.

Requirements:

- predictable
- interruptible
- keyboard compatible
- touch compatible
- reduced-motion compatible

Do not implement hard scroll snapping by default.

Do not force full-page snap sections unless prototype testing proves it improves the experience.

---

# Smooth Scrolling

A smooth scrolling library was evaluated in P1 and not adopted: the journey uses native scrolling (`decisions/001-gsap-scrolltrigger-native-scroll.md`).

If one is reconsidered:

- native scroll behavior remains the conceptual foundation
- smooth scrolling must not break keyboard navigation
- anchors must still work
- reduced motion must be respected
- browser history must remain understandable

If smooth scrolling harms usability or performance, remove it.

---

# Scroll Progress and Scene State

Each chapter should own local progress.

Conceptually:

```text
chapter progress: 0 → 1
```

Global state should track:

- current chapter
- high-level scene
- navigator state

Avoid one massive global animation timeline.

The UX should remain modular.

---

# Loading Experience

Do not create a blocking cinematic loader.

The user should see useful content quickly.

Expected order:

1. meaningful DOM content
2. base layout
3. enhanced visual layer
4. optional heavy assets

If a 3D asset has not loaded yet, the page should still be usable.

Potential fallback:

- static generated render
- simplified visual
- reserved composition

---

# WebGL Failure

The portfolio must still function if:

- WebGL is unavailable
- canvas initialization fails
- a model fails to load

The DOM must preserve:

- headings
- project descriptions
- links
- experience
- education
- contact

The visual layer enhances the experience but does not own the information.

---

# Reduced Motion UX

Reduced motion is a separate experience state.

Do not merely disable durations.

Each major scene should have a stable static composition.

Expected behavior:

## Name

Hero object in readable final pose.

## Projects

Project objects statically composed.

## Experience

Years and roles visible without animated transitions.

## Education

Clusters already assembled or presented sequentially.

## Off the Clock

Objects already arranged and labeled.

## Contact

Final resolved composition.

Chapter navigation should move immediately or with minimal motion.

---

# Keyboard UX

Everything meaningful should remain usable by keyboard.

Requirements:

- chapter navigator
- project links
- detail disclosures
- résumé
- contact links
- any hover-revealed information

Do not create interactions where keyboard users cannot access equivalent content.

Focus movement should remain predictable.

---

# Pointer UX

Pointer interactions should be subtle.

Potential uses:

- proximity response
- slight object rotation
- magnetic button behavior
- revealing secondary labels

Avoid custom cursor behavior unless prototype testing demonstrates clear value.

Pointer interactions should never be required to understand the page.

---

# Touch UX

Touch behavior should be designed explicitly.

Requirements:

- adequate target sizes
- no hover-only content
- no precision dragging requirement
- optional object interaction should not interfere with page scrolling
- chapter navigation should be easy to open and close

Complex desktop interactions may be simplified on touch devices.

---

# Content Expansion

If optional detail is used, expansion should remain lightweight.

Avoid giant modal experiences.

Potential patterns:

- inline reveal
- drawer-like detail
- scene-local disclosure

The interaction should preserve context.

Do not send the user into a large text wall.

---

# Chapter Transitions

Transitions should communicate a change in subject.

Potential qualities:

## Name → Projects

identity becomes work

## Projects → Experience

visual complexity quiets

## Experience → Education

timeline becomes conceptual/spatial

## Education → Off the Clock

structured information loosens

## Off the Clock → Contact

objects resolve into a simple ending

Transitions should be meaningful rather than decorative.

---

# Pacing

The portfolio should alternate between high and low intensity.

Possible rhythm:

```text
Name
high impact

Rankle
high energy

Plannr
precise / visual

Experience
calmer

Education
spatial

Off the Clock
playful

Contact
quiet
```

Do not make every chapter equally animated.

---

# Mobile Journey

Mobile should preserve the narrative order.

However, the exact composition may differ significantly.

Mobile priorities:

1. identity
2. clear project understanding
3. readable experience
4. understandable education
5. personality
6. easy contact

Desktop-only visual complexity may be reduced.

Mobile is successful if it feels deliberately composed, not if it perfectly replicates desktop.

---

# UX Success Criteria

The journey succeeds if:

1. A first-time visitor understands who Matthew is almost immediately.
2. Projects are understandable without long reading.
3. The chapter navigator makes the long page easy to navigate.
4. Scroll transitions feel authored but never restrictive.
5. Visitors can skip directly to relevant content.
6. Experience does not feel like a copied résumé.
7. Education communicates breadth without feeling like a transcript.
8. Off the Clock adds personality without becoming filler.
9. Contact is obvious and low-friction.
10. The page remains understandable without WebGL.
11. The page remains usable with reduced motion.
12. Keyboard and touch users receive complete access.
13. Mobile feels intentionally designed.
14. The visitor is never confronted with an intimidating wall of text.
15. The entire experience feels like one journey rather than stacked unrelated sections.

---

# UX Anti-Patterns

Do not implement:

- full-screen loaders that block entry
- scroll hijacking
- mandatory drag interactions
- hard scroll snapping by default
- hover-only essential content
- multi-level menu systems
- giant mobile menus without reason
- long project accordions
- modal case studies
- card grids
- repeated "Learn More" buttons everywhere
- timeline dots/lines simply because Experience is chronological
- education tables
- hobby cards
- interaction instructions for obvious actions
- gamification
- forced autoplay sequences
- transitions that take control away from the user

---

# Prototype Validation

Before building the full journey, the first prototype should include only:

1. chapter navigator
2. Name / hero
3. Name → Projects transition
4. Rankle
5. Rankle → Plannr transition
6. Plannr
7. basic mobile treatment
8. reduced-motion treatment

Do not build Experience, Education, Off the Clock, or Contact until this prototype is approved.

The primary prototype question is:

> **Does this experience make someone want to keep scrolling?**

Secondary questions:

- Is the navigator intuitive?
- Is the page too animated?
- Is there enough whitespace?
- Is the text concise enough?
- Do the projects make sense immediately?
- Does 3D feel meaningful?
- Does mobile retain the character?
- Does reduced motion still feel designed?

If the prototype fails those tests, revise the direction before expanding scope.
