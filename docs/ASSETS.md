# Asset System

## Purpose

This document defines how visual assets are conceived, generated, evaluated, optimized, registered, and used in Matthew Blanke's portfolio.

Generated assets are expected to play a major role in the visual identity of the site.

Matthew should not be required to manually create specialized 3D models, illustrations, textures, or rendered visual objects.

The portfolio may use Astra or other approved generation tools to produce those assets.

The central rule is:

> **Composition first. Asset brief second. Generation third.**

Do not generate random objects and then design scenes around them.

Every asset must have a job.

---

# Asset Philosophy

Assets should support:

- identity
- atmosphere
- explanation
- transformation
- spatial continuity
- personality
- project differentiation

They should not exist merely because they look impressive.

A useful asset should answer at least one of these questions:

- What does this scene need visually?
- What does this object communicate?
- How does this asset support the project concept?
- Does this asset help connect one chapter to another?
- Does it create a stronger composition than text alone?
- Does it deserve the performance cost it introduces?

If not, do not create it.

---

# Asset Types

The portfolio may use several asset classes.

## 1. Real-Time 3D Models

Preferred format:

```text
.glb
```

Use when:

- the object needs camera movement
- the object changes spatially
- the object should respond to pointer movement
- the object needs to persist between scenes
- the visitor benefits from seeing it from multiple angles

Examples:

- hero identity sculpture
- Rankle tiles
- Plannr document/calendar pieces
- Off the Clock still-life objects

---

## 2. Rendered 3D Images

Preferred formats:

```text
.webp
.avif
```

Use when:

- real-time 3D adds little value
- the scene only needs one or two viewpoints
- performance matters more than manipulation
- the object is highly detailed
- a fallback is needed

Rendered assets may still feel dimensional without requiring WebGL.

---

## 3. Transparent Cutout Assets

Preferred:

```text
.webp
.png
```

Use for:

- layered compositions
- project visual fragments
- decorative depth
- fallback scenes

Prefer WebP where transparency and compression remain acceptable.

---

## 4. SVG / Procedural Graphics

Use for:

- simple geometric elements
- rules
- icons
- line systems
- abstract diagrams
- scalable interface symbols

Do not generate raster artwork for something that can be expressed cleanly as SVG or CSS.

---

## 5. Procedural WebGL

Use when:

- geometry is simple
- behavior matters more than asset detail
- the effect is easier to generate in code
- responsive adaptation is important

Examples:

- education nodes
- simple particles if ever justified
- connecting geometry
- abstract structural forms

Do not use generated models for shapes that are trivial to create procedurally.

---

## 6. Real Product Screenshots

Use when:

- the actual interface is the clearest evidence
- the product UI itself matters
- generated representation would obscure reality

Screenshots should be:

- current
- privacy-safe
- appropriately cropped
- optimized
- used selectively

Do not create screenshot walls.

---

## 7. Video / Loop Assets

Use sparingly.

Potential formats:

```text
.webm
.mp4
```

Use when:

- a loop communicates something better than interactive 3D
- a complex scene would be too expensive in real time
- a rendered transition is sufficient

Avoid autoplay-heavy pages with multiple videos running simultaneously.

---

# Asset Workflow

Every major asset should follow this sequence.

## Step 1 — Scene Composition

Define the scene without the asset.

Determine:

- where the visual focal point is
- approximate size
- viewport relationship
- typography relationship
- motion role
- desktop layout
- mobile layout

A rough wireframe is enough.

---

## Step 2 — Asset Job

Write one sentence:

> This asset exists to...

Examples:

> This asset exists to give the hero a distinctive identity object that can persist into Projects.

> This asset exists to make Rankle's tier-list concept understandable without showing the app UI.

> This asset exists to visually transform a Plannr syllabus into calendar events.

If that sentence is weak, the asset brief is not ready.

---

## Step 3 — Asset Brief

Create a structured brief.

Each major asset should define:

```text
ID
chapter
purpose
asset type
visual description
required silhouette
materials
camera assumptions
animation requirements
interaction requirements
desktop use
mobile use
fallback
file-size target
polygon target if applicable
texture target
background requirements
things to avoid
```

---

## Step 4 — Generate Variants

Generate multiple variants when possible.

Do not accept the first result automatically.

Evaluate:

- silhouette
- originality
- legibility
- material quality
- compatibility with typography
- visual consistency
- animation suitability
- performance feasibility

---

## Step 5 — Select in Context

Never approve an asset in isolation.

Place it into the actual scene composition.

Check:

- desktop
- mobile
- light/dark background if relevant
- motion state
- static fallback state

The strongest standalone object is not necessarily the strongest portfolio asset.

---

## Step 6 — Optimize

Before production:

- reduce unnecessary geometry
- compress textures
- remove unused materials
- remove invisible geometry
- merge meshes where appropriate
- reduce texture resolution
- convert formats
- create fallback render
- verify naming

---

## Step 7 — Register

Add the asset to the central registry.

Do not scatter hard-coded paths throughout the application.

---

# Asset Registry

A central registry should track major assets.

Conceptual example:

```ts
export const assetRegistry = {
  hero: {
    model: "/models/hero-mb.glb",
    fallback: "/fallbacks/hero-mb.webp",
  },

  rankle: {
    model: "/models/rankle-tiles.glb",
    fallback: "/fallbacks/rankle-tiles.webp",
  },

  plannr: {
    model: "/models/plannr-document.glb",
    fallback: "/fallbacks/plannr-document.webp",
  },
}
```

The actual schema should remain simple.

The registry may later include:

- preload priority
- quality tier
- dimensions
- file size
- source metadata

Do not overengineer the registry prematurely.

---

# Naming Convention

Use clear, stable names.

Recommended:

```text
hero-mb-v01.glb
rankle-tiles-v01.glb
plannr-document-v01.glb
offclock-vinyl-v01.glb
```

Avoid:

```text
final.glb
final2.glb
cool-object.glb
new-final-final.glb
```

Version assets intentionally.

---

# Directory Structure

Potential:

```text
public/
  models/
    hero/
    rankle/
    plannr/
    off-clock/

  images/
    projects/
    personal/

  textures/
    shared/
    rankle/
    plannr/

  fallbacks/
    hero/
    rankle/
    plannr/
```

Only create directories that become necessary.

---

# Source Asset Storage

If large source files are needed, do not automatically place them in the production public directory.

Examples:

- high-poly source model
- Blender source
- uncompressed textures
- generation exports

These may belong in:

```text
assets-source/
```

or external archival storage.

Production should contain only optimized runtime assets.

---

# Astra Usage

Astra may be used to generate:

- 3D models
- dimensional typography
- stylized objects
- rendered stills
- textures
- compositional layers

Astra should receive precise art direction.

Bad request:

> Make a cool futuristic 3D object.

Better:

> Create a single sculptural object derived from the letters M and B. The silhouette should read from a front three-quarter camera angle. Use one translucent acrylic material and one matte dark material. Avoid chrome, neon, floating fragments, and generic blob geometry. The object must remain legible when rendered at roughly 40% of a desktop viewport height.

Asset briefs should be scene-specific.

---

# Hero Asset

## Working ID

```text
hero-mb-01
```

## Purpose

Create a distinctive identity object for Matthew that can function as:

- hero focal point
- motion anchor
- transition object
- possible Contact callback

## Desired Qualities

- original
- strong silhouette
- clean
- sculptural
- contemporary
- not overly futuristic
- readable from controlled angles

Potential direction:

- dimensional MB
- machined form
- acrylic structure
- industrial typographic sculpture

## Avoid

- chrome sphere
- generic glass blob
- torus
- liquid metal
- random abstract object
- generic AI sculpture
- excessive tiny detail

## Real-Time Need

Likely yes.

The object may:

- rotate
- shift
- scale
- persist between scenes

## Fallback

Transparent rendered still.

---

# Rankle Asset System

## Working ID

```text
rankle-tiles-01
```

## Purpose

Communicate Rankle's tier-list and ranking behavior visually without recreating the application UI.

## Potential Components

- S/A/B/C/F tiles
- loose ranking cards
- one or more abstract ranked objects
- stack or fan composition

## Desired Qualities

- playful
- physical
- simple
- colorful
- readable
- modular

## Materials / Color

Local Rankle palette:

- red
- yellow
- blue
- black
- white

## Interaction Needs

Potential:

- individual objects move between tiers
- tiles separate
- stack rearranges
- pointer proximity

Objects should be independently addressable where needed.

## Avoid

- literal mobile UI
- dashboard
- excessive text baked into geometry
- photorealistic board game
- toy-like cartoon style

---

# Plannr Asset System

## Working ID

```text
plannr-document-01
```

## Purpose

Visually communicate:

```text
SYLLABUS
→ DATES
→ REVIEW
→ CALENDAR
```

## Potential Components

- syllabus sheet
- highlighted lines
- detachable date markers
- calendar cells
- structured grid pieces

## Desired Qualities

- precise
- clean
- academic
- organized
- modular

## Interaction Needs

Pieces may:

- detach
- reorder
- align
- resolve into calendar structure

## Avoid

- generic productivity dashboard
- floating iPhone
- app-store marketing render
- fake AI effects
- unnecessary device mockup

---

# Education Assets

Prefer procedural geometry before generated models.

Potential:

- nodes
- labels
- simple connectors
- subtle depth

The education scene should remain readable.

Do not create elaborate 3D objects unless they add meaningful value.

---

# Off the Clock Asset System

Potential individually generated objects:

```text
vinyl
basketball
baseball
controller
travel object
headphones
```

Do not generate all of these immediately.

First determine the final scene composition and selected personal topics.

The objects should share:

- compatible scale
- compatible lighting
- compatible materials
- compatible camera assumptions

They should feel like one still-life, not assets from unrelated libraries.

---

# Contact Asset

Prefer reuse or transformation of the hero asset.

This creates narrative closure.

Do not generate a completely unrelated Contact object unless the final composition demands it.

---

# Asset Consistency

Generated assets from different chapters do not need identical materials.

They should still share a quality bar.

Consistency may come from:

- lighting discipline
- camera discipline
- edge treatment
- material restraint
- clean silhouette
- limited texture complexity

The site should not feel like a gallery of unrelated AI outputs.

---

# Lighting

Prefer controlled lighting.

Potential base:

- one large key
- subtle fill
- controlled rim or environment

Avoid:

- neon cyberpunk lighting
- excessive bloom
- rainbow reflections
- highly dramatic lighting that destroys form

Project scenes may vary locally.

---

# Camera Assumptions

Asset briefs should specify intended camera range.

Do not generate objects that only look good from one impossible perspective if the scene requires rotation.

For interactive models, validate at:

- front
- three-quarter
- moderate side angle

Do not expect every object to work from full 360° unless required.

---

# Geometry Budget

Exact limits will be defined after testing.

Initial preference:

- keep individual interactive hero/project assets under roughly 100k triangles when practical
- lower is better when silhouette does most of the work
- simplify aggressively on mobile where possible

Do not increase geometry for invisible detail.

---

# Materials

Keep material count low.

Prefer:

- 1–4 materials per object/system
- clean PBR
- controlled roughness
- limited transparency

Avoid many tiny material slots.

Transparency should be used carefully because of rendering cost and sorting complexity.

---

# Texture Strategy

Prefer simple material-driven objects where possible.

If textures are required:

- use reasonable resolution
- compress them
- avoid 4K textures unless clearly justified
- use texture atlases where appropriate

Potential later formats:

- WebP
- AVIF
- KTX2

Exact pipeline should be validated during performance work.

---

# Model Compression

Potential tools:

- Draco
- Meshopt
- glTF-transform

Do not choose a compression method before testing runtime cost and output quality.

Compression should reduce transfer size without creating excessive decode cost.

---

# Static Fallbacks

Every major interactive asset should have a fallback.

Potential format:

```text
.webp
```

Fallbacks should preserve:

- silhouette
- color
- composition
- visual identity

They should not look like error states.

---

# Mobile Asset Strategy

Mobile does not automatically load every desktop asset.

Potential approaches:

- lower-poly model
- lower texture resolution
- simplified scene
- static render
- fewer objects

Choose the simplest version that preserves the visual concept.

---

# Reduced Motion Asset Strategy

Reduced motion may still use 3D if the object remains static and performance is acceptable.

However, a static generated render may be preferable.

The reduced-motion scene should still feel art-directed.

---

# Asset Preloading

Do not preload all assets.

Potential strategy:

## Initial

- hero fallback
- hero model if lightweight enough

## Near Projects

- Rankle asset
- Plannr asset

## Later

- education/off-clock assets only as the user approaches

Use actual measurements to determine preload timing.

---

# Error Handling

If an asset fails:

1. show fallback
2. preserve layout
3. preserve content
4. avoid visible technical error

The visitor should not see:

```text
Failed to load GLTF
```

---

# Asset Performance Metadata

Later, the registry may track:

```text
transfer size
triangle count
texture memory
material count
fallback size
```

This can support performance audits.

Do not require this metadata before the asset pipeline is mature.

---

# Image Optimization

Use Next.js image optimization where appropriate.

Do not use `next/image` blindly for:

- canvas textures
- GLB assets
- certain CSS backgrounds

Use the right loading mechanism for the asset type.

---

# Generated Text

Avoid baking meaningful text into images or 3D models.

If visual text is part of an object:

- also provide it in DOM
- ensure accessibility
- ensure localization is not a concern
- make sure it remains legible

Prefer DOM typography for primary information.

---

# Copyright and Ownership

Do not use generated assets that intentionally reproduce:

- copyrighted characters
- brand mascots
- protected artwork
- recognizable artist-specific work

Project-specific assets should represent Matthew's own products and identity.

---

# Asset Approval Checklist

Before accepting an asset:

## Purpose

Does it have a clear job?

## Composition

Does it improve the scene in context?

## Originality

Does it feel specific rather than generic?

## Silhouette

Is it readable quickly?

## Motion

Can it support the required transformation?

## Mobile

Does it have a viable mobile version?

## Fallback

Is there a static fallback path?

## Performance

Is its cost justified?

## Consistency

Does it belong in the broader portfolio?

## Accessibility

Does meaningful information also exist outside the asset?

---

# Asset Rejection Criteria

Reject assets that are:

- generic
- visually noisy
- excessively detailed
- hard to optimize
- impossible to animate
- weak in silhouette
- over-reliant on chrome/glass trends
- visually unrelated to the scene
- indistinguishable from stock 3D
- only impressive in isolation
- dependent on huge textures
- difficult to simplify for mobile

---

# Initial Asset Roadmap

Do not generate the entire portfolio asset library at once.

## Prototype Batch 1

Only:

1. hero identity object
2. Rankle object system
3. Plannr object system

These three assets are enough to validate the design language.

---

# Prototype Asset Decision Gate

After integrating Batch 1, evaluate:

- Does generated 3D actually improve the portfolio?
- Are objects cohesive?
- Is the style too futuristic?
- Is performance acceptable?
- Do scenes remain clean?
- Is the visual identity original?
- Does mobile still work?
- Are rendered fallbacks sufficient for some scenes?

Only then generate later assets.

---

# Open Asset Decisions

Remain unresolved until prototyping:

- exact hero material
- exact hero silhouette
- whether hero is literal MB or abstract
- exact Rankle geometry
- exact Plannr document style
- whether KTX2 is needed
- compression method
- exact triangle budgets
- exact texture budgets
- whether education needs 3D
- exact Off the Clock object set
- whether some scenes use rendered loops instead of real-time 3D
- final fallback strategy per scene

---

# Final Asset Standard

The asset system is successful when generated objects feel like they were designed specifically for this portfolio.

The visitor should not think:

> These are AI-generated assets.

They should think:

> **This site has a very specific visual world.**

Generation is only the production method.

Art direction remains the source of quality.
