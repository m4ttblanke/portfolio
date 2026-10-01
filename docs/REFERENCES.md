# References

This document records the canonical visual and interaction references for the portfolio.

The references are listed in **priority order**. Higher references should carry more weight when principles conflict.

The goal is not to copy any one site. The goal is to understand the UX, composition, motion, pacing, content density, and technical patterns that make these references effective, then adapt those principles into an original portfolio for Matthew Blanke.

---

## Reference Priority

1. Clevir — https://clevir.li/
2. Ethan Clark — https://ethanclark.framer.ai/
3. Bureau Nine — https://bureaunine.framer.website/
4. Porta — https://porta.framer.ai/
5. Campione — https://ovo-campione.framer.website/
6. Operator — https://operator-template.framer.website/

The intended influence weighting is approximately:

- **40% Clevir**
- **25% Ethan Clark**
- **15% Bureau Nine**
- **10% Porta**
- **7% Campione**
- **3% Operator**

These percentages are directional, not mathematical requirements.

---

# 1. Clevir

**URL:** https://clevir.li/  
**Source repository:** https://github.com/mohitvirli/mohitvirli.github.io

## Role

Primary reference for:

- scroll architecture
- 3D integration
- spatial storytelling
- persistent visual objects
- technical ambition
- continuous-page interaction

Clevir is the strongest reference because the experience is not merely decorated with motion. The page itself is structured around motion and 3D.

Its public repository identifies the implementation stack as:

- Next.js
- React
- React Three Fiber
- Drei
- GSAP
- Zustand
- Tailwind

That confirms that the kind of experience we want can be built in a React/Next.js architecture without moving to Framer or another no-code runtime.

## UX Decisions Worth Studying

### Scroll is the primary interface

Scrolling does more than move content vertically.

It advances the visual narrative.

The visitor feels like they are progressing through a composed sequence rather than moving between normal stacked website sections.

### Persistent spatial continuity

Visual elements can remain present across multiple scroll states.

Instead of:

```text
Section A
fade out
Section B
fade in
```

the experience can feel like:

```text
Object A
moves / rotates / transforms
becomes part of Scene B
```

This creates continuity.

### Sparse text

Because motion and objects communicate much of the experience, the page does not need to explain every transition with prose.

This is central to the new portfolio direction.

### 3D is integrated, not isolated

The 3D scene is not presented like a separate embedded demo.

It feels like part of the page itself.

### Technical complexity is hidden from the user

The user sees a simple experience even though the implementation underneath may be sophisticated.

That is the target for this portfolio.

## What to Borrow

- one continuous journey
- persistent visual state
- scroll-driven scene transitions
- a shared 3D environment
- restrained DOM content around complex visual behavior
- visual continuity between chapters
- custom interaction rather than template interactions
- React + R3F + GSAP as a viable implementation model

## What Not to Borrow

- exact 3D objects
- exact composition
- exact camera movement
- exact palette
- exact typography
- exact scene timing
- exact interaction choreography
- any recognizable Clevir-specific visual identity

The portfolio must not feel like a Clevir clone.

## Application to Matthew's Portfolio

Clevir should influence the **engineering and experiential architecture** more than the surface styling.

Examples:

- a hero object persists into the Projects chapter
- project objects transform instead of simply appearing
- chapter transitions feel spatial
- one persistent R3F canvas supports multiple scenes
- scroll progress controls visual state
- text remains normal accessible DOM content

---

# 2. Ethan Clark

**URL:** https://ethanclark.framer.ai/

## Role

Primary reference for:

- composition
- typography
- negative space
- sparse copy
- visual hierarchy
- large-scale identity treatment

Ethan Clark is the main counterbalance to Clevir.

Clevir provides technical ambition.

Ethan provides restraint.

## UX Decisions Worth Studying

### Monumental typography

The name itself becomes part of the composition rather than simply a heading above content.

Large typography can:

- frame an image
- overlap with a visual
- define the viewport
- create depth
- establish identity immediately

### Strong central visual

The page uses a large portrait/image as a primary design element.

The visual is not confined to a card.

It interrupts the typography and layout.

### Very little copy

The homepage is concise.

The primary content includes:

- a short introduction
- selected work
- a short About section
- services
- contact

The page does not force the user through long explanations.

### Peripheral UI

Small supporting information lives around large central visual moments.

This contrast creates sophistication.

### Strong whitespace

Empty space is used deliberately.

The page does not attempt to fill every region.

## What to Borrow

- large typography as architecture
- image/object overlap
- minimal visible prose
- strong contrast between large and tiny elements
- generous negative space
- clear hierarchy
- visual confidence
- calm layouts around strong focal points

## What Not to Borrow

- exact portrait treatment
- exact font
- exact layout
- exact red treatment
- exact project presentation
- designer-agency content structure

## Application to Matthew's Portfolio

This reference should strongly influence the hero.

Matthew's name should feel like a visual structure.

The page should not open with:

```text
Hi, I'm Matthew.
I'm a computer science student...
```

Instead, the identity should be communicated through:

- large name
- one concise professional descriptor
- one strong generated visual object
- restrained supporting information

The same principle should apply to projects:

**one strong visual + one clear idea + minimal metadata.**

---

# 3. Bureau Nine

**URL:** https://bureaunine.framer.website/

## Role

Primary reference for:

- restraint
- pacing
- whitespace
- calm sections
- minimal interface

Bureau Nine matters because this portfolio could easily become over-designed.

The site should contain sophisticated animated scenes, but those scenes need quiet neighbors.

## UX Decisions Worth Studying

### Calm pacing

Not every viewport needs a spectacle.

A simple layout can make the next animated scene feel more expensive.

### Minimal navigation

Navigation is clear but does not dominate the visual experience.

### Whitespace as content

Large empty regions create rhythm and confidence.

### Low interface density

The design does not rely on:

- card stacks
- badges
- dense metadata
- multiple button styles
- decorative interface chrome

## What to Borrow

- restraint
- breathing room
- quiet transitions
- confidence in empty space
- simple layouts between complex moments
- low UI density

## What Not to Borrow

- agency-specific messaging
- exact minimalist structure
- overly static pacing if it conflicts with the intended scroll journey

## Application to Matthew's Portfolio

Every intricate scene should be followed or preceded by something calmer.

For example:

```text
high-energy Rankle interaction
↓
quiet transition
↓
minimal Experience composition
```

The goal is not constant stimulation.

The goal is rhythm.

---

# 4. Porta

**URL:** https://porta.framer.ai/

## Role

Primary reference for:

- media-first project presentation
- large visual objects
- concise project information
- strong visual framing
- project identity

## UX Decisions Worth Studying

### Visual-first presentation

The project visual carries most of the page.

Text supports it rather than competing with it.

### Minimal project metadata

Projects do not need:

- long technical summaries
- architecture explanations
- development histories
- multiple paragraphs

The primary scene can communicate only the information needed for orientation.

### Strong object framing

A project can be represented by one dominant visual object rather than a collage of screenshots.

### Simple navigation language

Project calls to action remain direct.

## What to Borrow

- project as visual object
- sparse metadata
- simple project CTA
- large media
- visual framing over explanatory prose
- clean transitions between project moments

## What Not to Borrow

- design-studio positioning
- exact project layouts
- exact spacing
- exact typography
- generic portfolio template structure

## Application to Matthew's Portfolio

Rankle and Plannr should each have one immediately understandable primary visual.

Rankle may use:

- ranking cards
- tier objects
- game pieces

Plannr may use:

- syllabus document
- extracted deadlines
- calendar tiles

The user should understand the product before reading detailed text.

---

# 5. Campione

**URL:** https://ovo-campione.framer.website/

## Role

Secondary reference for:

- controlled overlap
- bold visual moments
- collage-like composition
- occasional visual excess
- image layering

Campione should influence isolated scenes, not the entire portfolio.

## UX Decisions Worth Studied

### Layering

Visual assets overlap rather than remaining contained inside strict rectangles.

### Large imagery

Images can dominate the viewport.

### Dramatic composition

Some layouts intentionally feel less restrained.

### Typography and imagery interact

Text can become part of the visual composition rather than remaining separate from it.

## What to Borrow

- occasional overlap
- large visual crops
- layered project moments
- moments of controlled visual excess
- image/object interaction with typography

## What Not to Borrow

- constant collage
- dense image walls
- overly decorative layering
- excessive visual noise
- using this language for every chapter

## Application to Matthew's Portfolio

Campione should influence approximately 5–15% of the experience.

Good candidates:

- Off the Clock
- a Rankle scene
- a project transition
- a personal still-life scene
- selected generated asset compositions

The base system should remain cleaner than Campione.

---

# 6. Operator

**URL:** https://operator-template.framer.website/

## Role

Secondary reference for:

- numbered navigation
- chapter/index mental model
- simple section labeling
- quick random access

Operator is less important visually than the other references, but it directly supports the desired navigation model.

## UX Decisions Worth Studying

### Numbered sections

The visitor can understand the page as a sequence.

Example:

```text
01
02
03
04
```

This creates structure without requiring a conventional navigation bar.

### Clear chapter names

Numbering paired with concise labels makes navigation scannable.

### Persistent orientation

The user can understand where they are in the experience.

## What to Borrow

- numbered chapter model
- clear section labels
- persistent index concept
- simple navigation hierarchy

## What Not to Borrow

- exact menu style
- exact typography
- agency/template structure
- conventional section layouts

## Application to Matthew's Portfolio

This directly informs the corner navigator:

```text
01  NAME
02  PROJECTS
03  EXPERIENCE
04  EDUCATION
05  OFF THE CLOCK
06  CONTACT
```

The navigator should remain visually small until the user chooses to interact with it.

---

# Combined Design Model

The portfolio should not average the six references into one generic style.

Each reference has a specific job.

## Clevir

Defines:

**How the site moves.**

## Ethan Clark

Defines:

**How the site composes.**

## Bureau Nine

Defines:

**How the site breathes.**

## Porta

Defines:

**How projects are presented.**

## Campione

Defines:

**Where the site is allowed to become visually excessive.**

## Operator

Defines:

**How the visitor navigates the journey.**

---

# Resulting Portfolio Style

The combined direction can be described as:

> A clean, minimal, high-end interactive portfolio where one continuous scroll journey is punctuated by intricate 3D objects, strong spatial transitions, monumental typography, and occasional layered visual moments.

The experience should feel:

- modern
- spatial
- premium
- technically sophisticated
- visually restrained most of the time
- unexpectedly expressive at key moments

The interface itself should remain minimal.

Complexity belongs in:

- choreography
- composition
- generated assets
- transitions
- spatial relationships

not in:

- menus
- controls
- cards
- copy
- UI chrome

---

# Reference Synthesis Rules

When implementing a new scene, ask these questions.

## 1. What is the dominant influence?

Every scene should have one primary reference influence.

Do not attempt to incorporate all six references into every viewport.

## 2. Is the scene understandable while paused?

The composition must work as a still image.

Motion should improve it, not rescue it.

## 3. Is there too much text?

If so, use:

- scale
- imagery
- objects
- motion
- hierarchy

before adding additional explanation.

## 4. Is 3D doing a real job?

3D should contribute:

- identity
- explanation
- atmosphere
- transition
- spatial continuity

If it does none of those, remove it.

## 5. Does the scene have a calm neighbor?

High-energy visual moments should not be continuous.

## 6. Does the interaction feel authored?

Avoid default library demos.

Motion and interaction should feel specific to the content.

---

# Things This Portfolio Must Avoid

The reference sites are useful partly because they do not resemble generic software-engineer portfolios.

Avoid:

- terminal interfaces
- Matrix aesthetics
- glowing code
- floating technology logos
- skill bars
- GitHub contribution graphs as decoration
- generic project cards
- Bento grids
- glassmorphism
- endless rounded rectangles
- generic gradient blobs
- random 3D spheres
- meaningless chrome materials
- generic Framer-template composition
- copy-heavy case studies on the main journey
- fade-up animation on every section
- decorative scroll effects with no narrative purpose
- multiple competing animation systems
- treating every section as equally loud

---

# Project-Specific Reference Application

## Name / Hero

Primary influences:

1. Ethan Clark
2. Clevir
3. Bureau Nine

Goals:

- monumental name
- one dominant generated object
- minimal supporting copy
- substantial negative space
- object persists into the next transition

---

## Rankle

Primary influences:

1. Clevir
2. Porta
3. Campione

Goals:

- game objects
- strong project color
- understandable interaction
- concise copy
- slightly more energy and overlap

---

## Plannr

Primary influences:

1. Clevir
2. Porta
3. Bureau Nine

Goals:

- document transformation
- clean visual logic
- spatial transition from syllabus to calendar
- restrained interface
- product understood visually

---

## Experience

Primary influences:

1. Bureau Nine
2. Ethan Clark
3. Operator

Goals:

- large year typography
- minimal copy
- strong pacing
- no conventional résumé timeline component

---

## Education

Primary influences:

1. Clevir
2. Bureau Nine

Goals:

- spatial academic relationships
- restrained node/constellation behavior
- avoid transcript-style layout

---

## Off the Clock

Primary influences:

1. Campione
2. Clevir
3. Ethan Clark

Goals:

- visual still life
- generated objects
- personality with very little prose
- more playful composition

---

## Contact

Primary influences:

1. Bureau Nine
2. Ethan Clark
3. Clevir

Goals:

- quiet resolution
- strong type
- minimal actions
- visual callback to the hero

---

# Engineering Reference

Clevir's source repository is also the primary engineering reference because it demonstrates a working stack in the same broad category of experience.

Its documented stack includes:

- Next.js
- React
- React Three Fiber
- Drei
- GSAP
- Zustand
- Tailwind

This portfolio is not required to use the same stack exactly.

Current planned direction:

- Next.js
- React
- TypeScript
- CSS Modules
- GSAP
- ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- Drei

Zustand should only be introduced if prototype complexity proves it necessary.

Tailwind is not currently preferred.

---

# Originality Requirement

The references are principles, not templates.

The final portfolio must have:

- original compositions
- original generated assets
- original typography decisions
- original motion choreography
- original project representations
- original color behavior
- original scene transitions

No implementation should deliberately recreate a reference site's distinctive:

- layout
- object
- animation sequence
- project arrangement
- visual identity

The intended result should make the influences understandable to a design-aware viewer without making any single source feel copied.

---

# Final Reference Test

Before approving a major visual scene, ask:

> Does this feel like it belongs in the same design world as these references while still unmistakably being Matthew Blanke's portfolio?

If the answer is no because it feels generic, improve the art direction.

If the answer is no because it feels copied, increase originality.

If the answer is yes only because of animation, improve the static composition.

If the answer is yes only because of 3D, improve the typography and hierarchy.

The target is a complete visual system, not a collection of effects.
