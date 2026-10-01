# Design System

## Purpose

This document defines the visual design system for Matthew Blanke's portfolio.

It translates the broader creative direction into concrete visual rules for:

- typography
- spacing
- layout
- grid behavior
- color
- surfaces
- navigation
- buttons and links
- responsive design
- layering
- project-local visual systems

This is not the motion specification and not the software architecture.

Those belong in:

- `MOTION.md`
- `ARCHITECTURE.md`

The design system should support a portfolio that feels:

- clean
- sleek
- minimal
- spatial
- premium
- highly art-directed

without drifting into generic product-design conventions.

---

# Design Principles

## 1. Composition Before Components

The page should be composed scene by scene.

Do not begin with a library of cards and assemble the site from them.

The visual system should support:

- large type
- strong asymmetry
- viewport-scale layouts
- overlapping objects
- negative space
- scene-specific arrangements

Reusable components should exist where they genuinely help consistency.

They should not force every chapter into the same structure.

---

## 2. Minimal Interface

The interface layer should be visually quiet.

Avoid unnecessary:

- containers
- borders
- pills
- cards
- shadows
- badges
- controls
- labels

The content and visual objects should dominate the screen.

---

## 3. Strong Scale Contrast

The site should rely on dramatic differences in scale.

Use:

- very large display type
- medium structural labels
- small supporting metadata

Avoid making everything a slightly different version of the same size.

Scale should create hierarchy instantly.

---

## 4. Negative Space Is Structural

Whitespace should be treated as part of the composition.

Do not fill unused areas simply because they appear empty.

Negative space may:

- separate scenes
- frame a 3D object
- create tension
- make large typography feel intentional
- give motion room to operate

---

## 5. Project Worlds May Differ

The global system should remain coherent, but Rankle and Plannr may temporarily adopt different local palettes and visual logic.

The portfolio should feel like:

> one author presenting several worlds

not:

> one rigid visual system forced onto every project.

---

# Typography

Exact fonts are intentionally not locked yet.

Typography should be selected through prototyping.

Do not inherit typography from the previous portfolio by default.

---

# Display Typeface Requirements

The display face should:

- hold up at very large sizes
- have a strong silhouette
- feel contemporary
- remain readable when cropped
- work with tight tracking
- tolerate overlap with images/objects
- not feel overly editorial or fashion-only
- not feel like a generic startup grotesk

Potential categories:

- neo-grotesk
- geometric grotesk
- condensed or semi-condensed display sans
- modern industrial sans

The display typeface should feel strong enough that single words can function as visual objects.

---

# Body / UI Typeface Requirements

The body face should:

- be highly readable
- work at small sizes
- remain neutral beside expressive display type
- have strong numerals
- have good punctuation
- render cleanly on mobile
- support metadata and labels without becoming visually noisy

A single family may potentially cover both display and body roles if it has enough range, but this should be validated visually.

---

# Typographic Roles

The exact values should be tuned during prototyping.

The system should conceptually support the following roles.

## Hero Display

Used for:

- MATTHEW
- BLANKE
- major chapter words
- occasional giant year

Characteristics:

- extremely large
- tight line-height
- deliberate cropping allowed
- tight or custom tracking

Example conceptual sizing:

```css
font-size: clamp(5rem, 14vw, 14rem);
line-height: 0.82–0.95;
```

Do not treat this as a final token.

---

## Scene Title

Used for:

- RANKLE
- PLANNR
- EXPERIENCE
- EDUCATION

Characteristics:

- large
- prominent
- potentially viewport responsive
- simpler than hero type

---

## Section Label

Used for:

```text
01
PROJECTS
CURRENT
LIVE
```

Characteristics:

- small
- uppercase where appropriate
- precise
- strong tracking
- visually quiet

---

## Body Copy

Used for:

- one-line explanations
- short project descriptions
- supporting context

Characteristics:

- comfortable reading width
- short line lengths
- never dense

---

## Metadata

Used for:

- stack
- status
- dates
- links
- labels

Characteristics:

- small
- compact
- high contrast
- readable

---

# Line Length

Visible prose should remain narrow enough to scan quickly.

Target generally:

```text
40–65 characters
```

for normal body copy.

Large project descriptions may be even shorter.

Avoid full-width paragraphs.

---

# Type Alignment

Use alignment intentionally.

Possible patterns:

- left aligned large typography
- small metadata pushed to edges
- visual objects occupying opposite fields
- occasional centered moments where justified

Do not center every section.

Do not default to symmetrical layouts.

---

# Grid

The site should use an underlying grid without making the grid visible everywhere.

Desktop may use a flexible 12-column or similarly structured system.

However:

> The grid exists to support composition, not to dictate it.

Objects and typography may break the grid where justified.

---

# Desktop Grid Principles

Recommended baseline:

- 12 columns
- generous outer margins
- responsive gutters
- strong alignment points
- full-bleed capability

The exact grid should be established during P1 prototyping.

Potential conceptual structure:

```text
| margin | 12 flexible columns | margin |
```

Use CSS Grid rather than fixed pixel positioning for major layout structure.

Absolute positioning may be used within art-directed scenes where necessary.

---

# Tablet Layout

Tablet should not merely inherit desktop spacing.

At medium widths:

- reduce overlap
- simplify object positioning
- preserve scale contrast
- keep strong negative space
- avoid collapsing everything into one column prematurely

---

# Mobile Layout

Mobile is a separate composition.

Priorities:

1. hierarchy
2. readability
3. touch interaction
4. visual identity
5. performance

Mobile may:

- reduce 3D complexity
- use rendered fallbacks
- change typography scale relationships
- stack scenes differently
- remove unnecessary overlap
- reposition metadata

Do not attempt to perfectly preserve desktop composition.

---

# Spacing

Avoid building the system around dozens of tiny spacing tokens.

Prefer a limited scale with clear differences.

Conceptual scale:

```text
XS
S
M
L
XL
2XL
SCENE
```

Example purposes:

- XS: inline relationships
- S: metadata spacing
- M: local component spacing
- L: text-to-visual spacing
- XL: section internal spacing
- 2XL: large compositional separation
- SCENE: viewport-scale breathing room

The final values should be fluid where possible.

Use `clamp()` for large-scale spacing rather than excessive breakpoints.

---

# Scene Height

Do not force every chapter to exactly `100vh`.

Some scenes may be:

- shorter
- one viewport
- several viewport heights due to scroll choreography

Use the visual story to determine height.

Avoid long empty pinned sections with little change.

Pinned scroll should always justify the time it asks from the visitor.

---

# Color System

The global palette should begin neutral.

Exact colors are not locked yet.

The base palette should include:

```text
BACKGROUND
INK
MUTED
SUBTLE
BORDER / RULE
```

A likely direction is:

- light neutral background
- near-black primary text
- warm or cool subtle gray
- project-specific accent color

Avoid overly saturated global branding.

---

# Background

The base background should feel clean rather than sterile.

Pure white may be evaluated against a subtle warm or neutral white.

Avoid visible paper texture unless a scene specifically earns it.

The V2 site should not inherit the old publication/newsprint look.

---

# Ink

Primary text should be near-black rather than visually weak gray.

High contrast should support:

- readability
- large typography
- strong silhouettes

Secondary text may use a muted tone but must remain accessible.

---

# Project Colors

## Rankle

Allowed local palette:

- red
- yellow
- blue
- black
- white

Use project color strongly within the Rankle scene.

Do not keep Rankle colors active across the rest of the page.

---

## Plannr

Allowed local palette:

- navy
- gold/yellow
- cool blue
- warm neutral

The palette should feel organized and academic.

---

# Color Transition

Project color may enter and leave through:

- object materials
- background shifts
- typography
- lighting
- accent elements

Do not create harsh palette changes without visual transition.

---

# Surfaces

The base design should avoid container-heavy surfaces.

Default scene elements should generally sit directly in space.

When a surface is necessary, it should have a reason:

- physical object
- document
- panel tied to project concept
- interaction target
- accessibility/readability requirement

Avoid generic cards.

---

# Border Radius

Do not establish a universal large rounded-corner system.

Rounded corners should appear only where conceptually appropriate.

Examples:

- actual interface screenshot
- device-like element
- game tile
- intentional object design

The page itself should not feel like a collection of rounded boxes.

---

# Shadows

Use sparingly.

Acceptable:

- physical object separation
- subtle dimensional layering
- generated asset integration

Avoid:

- generic card shadow
- floating SaaS panel treatment
- excessive soft drop shadows

3D lighting should usually create depth more naturally than CSS shadow.

---

# Lines and Rules

Lines may be used for:

- navigation
- metadata
- structural labels
- subtle alignment

Use clean hairlines rather than decorative framing.

Avoid repeated editorial-rule language from V1.

---

# Buttons

Buttons should remain visually simple.

Primary actions may often be text links rather than button containers.

Examples:

```text
LIVE ↗
SOURCE ↗
RÉSUMÉ ↗
DETAILS +
```

Use filled buttons only when the hierarchy genuinely requires one.

Avoid:

- giant pill buttons
- repeated CTA blocks
- gradient buttons
- overly animated button chrome

---

# Links

Links should have strong interactive feedback.

Possible behaviors:

- underline shift
- text movement
- arrow movement
- magnetic proximity
- subtle mask/reveal

The interaction should remain restrained.

Links must remain obviously interactive without requiring hover.

---

# Chapter Navigator Design

The chapter navigator should be:

- fixed
- compact
- quiet
- legible
- precise

At rest, it should occupy very little space.

Expanded state may show:

```text
01  NAME
02  PROJECTS
03  EXPERIENCE
04  EDUCATION
05  OFF THE CLOCK
06  CONTACT
```

Avoid:

- large floating glass panel
- hamburger icon if unnecessary
- generic mobile-menu aesthetic
- heavy shadow
- excessive blur

The navigator should feel like an instrument, not a card.

---

# Numbering

Numbering may help establish journey structure.

Examples:

```text
01
02
03
```

Use numbering consistently if adopted.

Do not overuse numbering on every content element.

Chapter numbers are structural.

Project numbering is optional.

---

# Iconography

Do not build the visual system around icons.

Prefer:

- text
- arrows
- generated objects
- typography

Use icons only where they improve clarity.

Avoid technology-logo collections.

---

# Arrows and Symbols

Simple symbols may be useful:

```text
↗
→
+
×
```

These can become part of the interface language.

Keep them typographic and minimal.

---

# Images

Images should generally be:

- large
- purposeful
- well-cropped
- integrated into composition

Avoid:

- thumbnail grids
- generic device mockups
- screenshots inside multiple nested frames

A real screenshot may appear when it genuinely communicates the product.

Generated assets may be preferable when they communicate the project concept more clearly.

---

# 3D Placement

3D should not always sit centered in a hero-like composition.

Potential placements:

- offset against large typography
- partially cropped by viewport
- crossing grid boundaries
- occupying a visual stage
- moving between scenes

The object should feel physically integrated with typography and layout.

---

# Layering

Define a small set of conceptual layers.

Example:

```text
0  base background
1  decorative / canvas background
2  primary 3D scene
3  large typography
4  content / metadata
5  chapter navigation
6  overlays if required
```

The exact implementation should avoid arbitrary z-index values.

Use documented layer tokens.

---

# Z-Index Strategy

Do not use random values such as:

```css
z-index: 9999;
```

Create named layer tokens.

Example:

```css
--z-base: 0;
--z-scene: 10;
--z-type: 20;
--z-content: 30;
--z-nav: 40;
--z-overlay: 50;
```

Exact values may differ.

---

# Breakpoints

Do not overfit the design to device-specific widths.

Prefer layout-driven breakpoints.

Initial conceptual categories:

```text
wide desktop
desktop
tablet
mobile
small mobile
```

Exact breakpoints should be established through real composition testing.

Avoid dozens of media queries.

---

# Fluid Design

Use fluid sizing for:

- display type
- large spacing
- object dimensions
- viewport relationships

Prefer:

```css
clamp()
min()
max()
```

where appropriate.

This should reduce abrupt responsive jumps.

---

# Hover

Hover may enhance:

- links
- chapter navigation
- project objects
- secondary project selection

Hover should never be required to understand content.

Avoid every element reacting to the pointer.

Selective response feels more expensive.

---

# Focus

Keyboard focus should be visually intentional.

Do not accept browser focus rings only because they are technically visible if they clash badly with the visual system.

Create a clear focus language that remains:

- accessible
- high contrast
- consistent

Do not hide focus.

---

# Active States

Active state should be communicated through more than subtle color shifts.

Potential methods:

- weight
- underline
- position
- scale
- marker
- label

Use motion only as enhancement.

---

# Rankle Scene Design System

Rankle may temporarily introduce:

- brighter colors
- stronger object overlap
- game-piece geometry
- more energetic typography

Still preserve:

- clean hierarchy
- minimal visible copy
- strong whitespace

The scene should feel intentionally louder than the global base.

---

# Plannr Scene Design System

Plannr should introduce:

- organized grids
- document shapes
- calendar geometry
- navy/gold accents
- precise alignment

The scene should feel calmer and more structured than Rankle.

---

# Experience Scene Design System

Potential design elements:

- giant year numerals
- compact labels
- strong alignment
- large empty fields

Avoid:

- timeline cards
- circular nodes
- vertical lines with dots

---

# Education Scene Design System

Potential visual elements:

- nodes
- clusters
- labels
- subtle connecting geometry
- spatial grouping

Keep it visually legible.

Do not let the section look like a network-analysis dashboard.

---

# Off the Clock Scene Design System

This section may loosen the grid more.

Potentially:

- still-life objects
- overlapping labels
- varied object scale
- more playful composition

Still avoid clutter.

This is the strongest candidate for controlled Campione influence.

---

# Contact Scene Design System

Return to simplicity.

Potential:

- enormous closing phrase
- a few links
- hero object callback
- substantial whitespace

No giant footer system.

No dense legal or sitemap area unless needed.

---

# Static Fallback Design

Every motion-heavy scene needs a stable static state.

The static state should not look like:

- a paused animation
- an unfinished transition
- a broken 3D layout

It should look intentionally composed.

This matters for:

- reduced motion
- low-power devices
- WebGL fallback
- screenshots
- crawlers
- testing

---

# Design Anti-Patterns

Do not use:

- Bento grids
- card walls
- glassmorphism
- giant border-radius everywhere
- glowing gradients
- random blobs
- stock 3D primitives
- full-screen gradients as visual identity
- terminal aesthetics
- generic tech logos
- decorative code
- skill bars
- floating logos
- repeated device mockups
- multiple font families without reason
- overly tiny gray text
- excessive all-caps body text
- every section centered
- every section boxed
- excessive metadata
- repeated visual patterns from V1

---

# Design Review Checklist

Before approving a scene:

## Hierarchy

Can the dominant idea be understood in two seconds?

## Scale

Is there enough contrast between primary and supporting elements?

## Whitespace

Is the composition allowed to breathe?

## Copy

Can anything be removed?

## Object

Does the visual object have a clear job?

## Grid

Is the grid helping without making the scene rigid?

## Static Quality

Does the scene look excellent while paused?

## Responsiveness

Does mobile feel designed rather than compressed?

## Accessibility

Is important information still readable without motion or WebGL?

## Originality

Does the scene feel authored rather than template-derived?

---

# Open Design Decisions

The following remain intentionally unresolved until visual prototyping:

- exact display font
- exact body font
- base background color
- global accent color if any
- exact desktop grid
- exact breakpoint values
- exact chapter navigator appearance
- hero object material
- exact button style
- exact project scene compositions
- whether any project scene uses dark mode
- exact contact closing phrase
- exact mobile hero composition

Do not lock these through documentation alone.

They should be decided by testing real compositions.

---

# Final Design Standard

The design should feel polished without looking over-designed.

The site should appear simple at first glance.

Its complexity should reveal itself through:

- movement
- spatial relationships
- object detail
- transitions
- responsive behavior

not through visual clutter.

The target is:

> **a minimal visual system capable of supporting highly intricate moments without losing clarity.**
