# Accessibility

## Purpose

This document defines the accessibility requirements for Matthew Blanke's portfolio.

The site is intentionally motion-heavy, visually experimental, and partially WebGL-driven.

That makes accessibility a design and architecture requirement from the beginning, not a cleanup step at the end.

The central principle is:

> **The experience may be enhanced by motion and 3D, but meaning must never depend on them.**

Accessibility requirements apply to:

- semantic structure
- keyboard access
- focus behavior
- reduced motion
- color contrast
- touch interaction
- responsive layout
- screen readers
- non-WebGL fallback
- text alternatives
- browser zoom
- content order

---

# Core Accessibility Principles

## 1. Meaningful Content Lives in the DOM

Important content must exist as semantic HTML.

This includes:

- Matthew's name
- project titles
- project descriptions
- experience entries
- education information
- links
- contact information
- navigation

Do not rely on:

- 3D text
- canvas-only labels
- baked text in images
- motion state alone

to communicate essential information.

---

## 2. WebGL Is Progressive Enhancement

The page must remain understandable if:

- WebGL is unavailable
- JavaScript partially fails
- models fail to load
- shaders fail
- the canvas is hidden
- the user prefers reduced motion

The visual layer should improve the experience without owning the information architecture.

---

## 3. Keyboard Access Is First-Class

Every interactive element must be usable by keyboard.

This includes:

- chapter navigation
- project links
- disclosure controls
- résumé links
- social/contact links
- any scene-local controls
- any interaction that also exists on hover

The user should be able to traverse the page logically with:

```text
Tab
Shift+Tab
Enter
Space
Escape
```

where appropriate.

---

# Semantic Structure

Use normal document semantics.

Expected hierarchy:

```html
<header>
<nav>
<main>
<section>
<h1>
<h2>
<h3>
<footer>
```

Do not replace semantic structure with generic `<div>` elements simply because the site is visually unconventional.

---

# Heading Hierarchy

The page should have one primary H1.

Likely:

```text
Matthew Blanke
```

Major chapters should use H2s:

```text
Projects
Experience
Education
Off the Clock
Contact
```

Project titles may use H3s where appropriate.

Do not choose heading levels based on visual size.

Use CSS for visual scale.

---

# Chapter Landmarks

Each major chapter should be a semantic `<section>` with a stable ID.

Example:

```html
<section id="projects" aria-labelledby="projects-heading">
  <h2 id="projects-heading">Projects</h2>
</section>
```

This improves:

- screen-reader navigation
- deep linking
- document structure
- testing

---

# Skip Link

Provide a skip link near the top of the document.

Example:

```text
Skip to main content
```

It may remain visually hidden until focused.

The skip link must:

- become visible on focus
- move focus correctly
- work without animation
- not be obscured by the fixed chapter navigator

---

# Chapter Navigator Accessibility

The chapter navigator is a major interactive element and requires careful semantics.

## Requirements

- use a real `<nav>`
- include an accessible label
- use real links for chapter destinations
- current chapter should expose `aria-current` where appropriate
- keyboard focus must be visible
- expanded state must be operable without hover
- touch users must have explicit open/close behavior
- Escape should close an expanded menu when appropriate

Potential structure:

```html
<nav aria-label="Portfolio sections">
  <a href="#name">Name</a>
  <a href="#projects">Projects</a>
  ...
</nav>
```

If the navigator has a compact toggle, that toggle should expose:

```text
aria-expanded
aria-controls
```

as appropriate.

---

# Focus Management

Do not move focus automatically during normal scrolling.

Scrolling to a chapter should not unexpectedly steal focus.

Focus should only move when:

- a modal-like pattern truly requires it
- a disclosure opens and needs explicit focus behavior
- an accessibility pattern calls for it

Avoid programmatically forcing focus merely because a section became active.

---

# Focus Visibility

All interactive controls must have a visible focus state.

Do not use:

```css
outline: none;
```

without an accessible replacement.

The focus style should:

- be high contrast
- remain visible over local project colors
- work on light and dark surfaces
- match the visual system

A custom focus ring is encouraged if it remains clear.

---

# Keyboard Order

DOM order should match the conceptual reading order.

Do not rely on:

- `order`
- large absolute positioning changes
- complex visual rearrangement

in ways that make keyboard order confusing.

Visual composition may be asymmetric, but the DOM sequence should remain understandable.

---

# Hover Independence

No essential content may require hover.

Anything exposed on hover must also be accessible through:

- focus
- tap
- visible content
- an explicit control

This applies especially to:

- project labels
- Off the Clock object labels
- secondary project previews
- chapter navigator expansion

---

# Touch Accessibility

Touch targets should be comfortably sized.

Use approximately:

```text
44 × 44 CSS pixels
```

as a practical minimum target where possible.

Avoid tightly packed links.

Touch interactions should not depend on:

- precision
- hover simulation
- tiny draggable objects
- double tap
- multi-finger gestures

---

# Reduced Motion

Support:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced motion is not simply a faster or zero-duration version of the normal experience.

Each major scene should have a deliberate static or minimally animated composition.

---

# Reduced Motion Requirements

When reduced motion is enabled:

- disable nonessential parallax
- disable pointer-follow motion
- disable looping idle motion
- avoid scrubbed object transformations where unnecessary
- avoid long smooth-scroll travel
- avoid scroll-linked scaling/rotation that may cause discomfort
- preserve normal document flow
- preserve all content

Anchor navigation should be immediate or nearly immediate.

---

# Reduced Motion by Chapter

## Name

- hero object in a stable readable pose
- no mouse-follow behavior
- no persistent camera movement
- no large-scale scroll rotation

## Projects

- Rankle pieces statically arranged
- Plannr transformation represented as a composed static sequence
- no requirement to scrub through visual states

## Experience

- years and roles remain readable in sequence
- no large sliding timeline needed

## Education

- clusters appear already organized or as grouped DOM sections

## Off the Clock

- objects remain static
- labels are directly accessible

## Contact

- final composition appears directly

---

# Smooth Scrolling

If Lenis or another smooth-scroll layer is used, reduced-motion preferences must be respected.

Smooth scrolling must not interfere with:

- keyboard scrolling
- Page Up / Page Down
- Home / End
- anchor links
- browser back/forward
- touch scrolling
- assistive technologies

If compatibility is poor, native scrolling takes precedence.

---

# Color Contrast

Text must meet WCAG contrast requirements.

Target:

- normal text: at least 4.5:1
- large text: at least 3:1
- meaningful non-text UI indicators: at least 3:1 where applicable

Do not assume large display type is exempt from readability concerns.

Project-local color palettes must be checked independently.

---

# Color Is Not the Only Signal

Do not communicate:

- active state
- current chapter
- selected project
- focus
- errors

through color alone.

Pair color with:

- weight
- underline
- shape
- marker
- label
- position

---

# Text Size

Body copy should remain comfortably readable.

Avoid tiny text below roughly:

```text
14px
```

for meaningful body/UI content unless there is a specific tested reason.

Supporting metadata may be small, but must remain legible on mobile and at zoom.

---

# Browser Zoom

The site should remain usable at:

```text
200%
```

browser zoom.

Requirements:

- no essential content clipped
- navigation remains operable
- text remains readable
- no horizontal scrolling caused by fixed desktop assumptions where avoidable
- fixed UI does not obscure content

Viewport-scale typography must adapt gracefully.

---

# Reflow

At narrow widths, content should reflow rather than require horizontal scrolling.

Art-directed overlap may be reduced or removed on small screens.

Do not preserve desktop composition at the expense of readability.

---

# Screen Reader Experience

The screen-reader experience should be concise and logical.

Decorative visual elements should generally be hidden from assistive technology.

Examples:

```html
aria-hidden="true"
```

for purely decorative canvas or visual fragments.

Do not expose dozens of meaningless 3D mesh names.

---

# Canvas Accessibility

The R3F canvas should not become a noisy accessibility subtree.

If the canvas is purely visual:

- mark it appropriately decorative
- keep meaningful content in adjacent DOM
- avoid redundant labels

If a 3D interaction becomes genuinely interactive, provide an equivalent accessible DOM control.

---

# Images and Alt Text

Informative images require useful alternative text.

Decorative imagery should use empty alt text:

```html
alt=""
```

Do not write alt text such as:

> Image of an image showing...

Describe the meaningful content or function.

Generated art used purely as atmosphere does not need verbose descriptions.

---

# Product Screenshots

If a screenshot communicates product functionality, alt text should describe the relevant function, not every visible pixel.

Example:

> Rankle daily ranking interface showing ordered choices before results are revealed.

Avoid unnecessarily long image descriptions unless detail is important.

---

# Generated Assets

Generated visuals should not be treated as meaningful content by default.

If the object communicates only atmosphere or identity:

- keep it decorative
- preserve equivalent textual context nearby

If the object communicates a product process, the process should also be represented in text.

---

# Motion-Only Information

Never require the user to infer important facts from movement alone.

Example:

Bad:

A date moves from a syllabus into a calendar, but there is no text explaining what happened.

Better:

Visible DOM copy states the core transformation:

```text
Syllabus → reviewed calendar events
```

while motion illustrates it.

---

# Audio

The current portfolio direction does not require audio.

Do not add autoplay audio.

If audio is ever introduced:

- it must not autoplay by default
- controls must be keyboard accessible
- captions/transcripts must be provided where relevant
- the site must remain complete without sound

---

# Flashing and Visual Effects

Avoid flashing content.

Do not create effects that rapidly alternate brightness or color.

Avoid intense glitch effects.

The site should not contain visual patterns likely to trigger photosensitive reactions.

---

# Parallax

Keep parallax low amplitude.

Users with vestibular sensitivity may be affected by large independent motion.

Reduced-motion mode should remove parallax.

Avoid large full-screen background movement in opposition to scroll direction.

---

# Pinning and Scroll Effects

Pinned sections must not trap keyboard or touch users.

Pinned content should:

- remain logically ordered in the DOM
- not require precision scrolling
- not obscure focus
- remain understandable if pinning is disabled

Reduced-motion mode may disable pinning where appropriate.

---

# Disclosures

If optional details are expandable, use accessible disclosure patterns.

Potential:

```html
<button aria-expanded="false">
  Details
</button>
```

Requirements:

- real button
- keyboard operable
- state exposed
- content follows logical DOM order
- no focus trap
- no hover dependency

---

# External Links

External links may use:

```text
↗
```

visually.

Do not depend solely on the arrow to communicate purpose.

Link text should remain meaningful.

Examples:

```text
Live site ↗
GitHub ↗
LinkedIn ↗
```

---

# New Tabs

Avoid forcing new tabs unless justified.

If a link intentionally opens a new tab, communicate that behavior if needed.

Do not make every external link open in a new window by default.

---

# Contact Links

Email, GitHub, LinkedIn, and résumé links should be normal semantic links.

Do not hide email behind a canvas interaction or reveal animation.

Contact actions should work with:

- keyboard
- screen readers
- touch
- browser context menus

---

# Résumé Accessibility

If `/resume` includes an HTML version:

- use semantic headings
- use lists where appropriate
- support print
- preserve reading order

If a PDF is provided:

- the PDF should be tagged and accessible where practical
- provide an HTML alternative if the PDF is not reliably accessible

Do not make the PDF the only way to access critical information if the route can provide HTML.

---

# Mobile Accessibility

Mobile-specific requirements:

- no hover-only interactions
- large touch targets
- no canvas gesture that blocks page scroll
- no text hidden outside viewport
- fixed navigation must not cover content
- zoom should remain enabled
- orientation changes should not break layout

Do not disable pinch zoom.

---

# Pointer Interactions

Pointer-only enhancements should remain optional.

Examples:

- magnetic link behavior
- object tilt
- proximity response

If these disappear, no information should be lost.

---

# Accessibility and Animation Libraries

GSAP, ScrollTrigger, Lenis, and R3F should never override semantic behavior.

Libraries are implementation details.

Accessibility behavior belongs to the product.

---

# JavaScript Disabled / Partial Failure

A fully no-JavaScript experience is not necessarily required to preserve every visual feature.

However, server-rendered HTML should still expose meaningful basic content where Next.js permits it.

At minimum, failure of interactive enhancement should not remove:

- name
- project summaries
- experience
- education
- contact links

---

# Accessibility Testing

Testing should include both automated and manual checks.

## Automated

Potential tools:

- axe
- Lighthouse
- eslint accessibility rules where useful

Automated checks are necessary but not sufficient.

---

# Manual Keyboard Test

Verify:

1. load page
2. press Tab
3. access skip link
4. navigate chapter index
5. activate chapter links
6. reach project links
7. open/close any disclosures
8. reach Contact
9. move backward with Shift+Tab

No keyboard trap should exist.

---

# Manual Reduced Motion Test

Enable reduced motion at OS/browser level.

Verify:

- composition remains intentional
- content remains complete
- scrolling remains comfortable
- navigation works
- no hidden animation-only states remain
- no looping decorative movement continues unnecessarily

---

# Manual Screen Reader Review

At minimum, inspect the semantic output with a screen reader or accessibility tree.

Verify:

- one H1
- logical H2/H3 order
- chapter landmarks
- sensible link names
- navigator semantics
- decorative content hidden
- no redundant canvas output

---

# Manual Zoom Test

Test at:

```text
200%
```

Verify:

- chapter navigator
- hero
- project copy
- disclosures
- contact links
- fixed UI

Remain usable.

---

# Manual Mobile Test

Verify:

- chapter navigation
- touch targets
- scrolling
- orientation change
- no hover-only content
- no accidental WebGL drag blocking page scroll
- reduced motion if available

---

# Accessibility Testing Targets

At minimum, test:

- Chrome desktop
- Safari desktop
- mobile Safari
- mobile Chrome

Also test keyboard behavior independent of browser.

---

# Accessibility Anti-Patterns

Do not:

- hide focus
- make canvas the only source of text
- use hover-only content
- disable pinch zoom
- autoplay audio
- create flashing effects
- rely on color alone
- force smooth scrolling despite reduced motion
- trap focus in chapter navigation
- use meaningless `aria-label`s everywhere
- add ARIA where native HTML already solves the problem
- auto-focus sections during normal scroll
- require drag interactions
- use tiny fixed navigation controls
- render body copy inside WebGL
- hide semantic headings for visual convenience

---

# Accessibility Review Checklist

Before approving a chapter:

## Semantics

Is the content structured correctly in HTML?

## Keyboard

Can every meaningful action be completed without a mouse?

## Focus

Is focus clearly visible?

## Motion

Does reduced motion preserve meaning and composition?

## Contrast

Does text remain readable across local color changes?

## Touch

Are interactions comfortable on mobile?

## Canvas Independence

Does the chapter still make sense without the 3D layer?

## Zoom

Does the composition survive browser zoom?

## Labels

Are links and controls named clearly?

## Reading Order

Does DOM order make sense independently of visual positioning?

---

# Prototype Accessibility Scope

The first creative prototype must already validate:

- semantic chapter structure
- chapter navigator keyboard access
- focus treatment
- reduced-motion mode
- mobile touch behavior
- non-WebGL fallback for hero/projects
- no essential hover-only information

Do not postpone these until the full site is finished.

---

# Open Accessibility Decisions

The following may be refined during implementation:

- exact focus-ring visual treatment
- whether reduced motion uses static 3D or rendered images
- whether Lenis is disabled entirely under reduced motion
- final chapter navigator expansion semantics
- exact accessibility treatment for any future 3D direct manipulation
- final `/resume` accessibility approach

These decisions should be resolved through real testing.

---

# Final Accessibility Standard

The goal is not merely to make an experimental portfolio technically compliant.

The goal is:

> **the accessible version should still feel intentionally designed.**

A user who:

- prefers reduced motion
- uses a keyboard
- uses touch
- cannot run WebGL
- zooms the page
- relies on assistive technology

should still receive a complete, coherent portfolio.

The visual experience may vary.

The quality of the experience should not.
