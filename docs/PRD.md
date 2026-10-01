# Product Requirements Document

## Product

**Matthew Blanke Portfolio V2**

A single-scroll, highly art-directed interactive portfolio built with Next.js and React.

The site should feel less like a conventional portfolio website and more like a directed digital experience. Typography, motion, 3D, generated visual assets, whitespace, and carefully controlled interaction should communicate Matthew's work and personality with minimal visible prose.

The primary public experience lives on one continuous homepage. Visitors may scroll through it linearly or use a persistent chapter navigator to jump directly to major sections.

---

## Product Vision

Build a portfolio that makes Matthew immediately feel:

- technically strong
- capable of shipping real products
- visually sophisticated
- thoughtful about product and engineering
- memorable as a person, not only as a résumé

The portfolio should be understandable quickly without requiring visitors to read long case studies.

A visitor should be able to understand the major story of the portfolio within roughly **30–60 seconds**, while still having optional paths to deeper technical information when they want it.

The experience should feel:

- clean
- sleek
- deliberate
- spatial
- interactive
- technically ambitious
- visually distinctive
- concise

The guiding product principle is:

> **Minimal interface. Maximum choreography.**

---

## Target Audience

### Primary

#### Software Engineering Recruiters

They should be able to quickly understand:

- who Matthew is
- what he builds
- what technologies he works with
- that he has experience shipping real products
- that he can work across product and engineering
- where to find his résumé, GitHub, LinkedIn, and contact information

The experience should not require them to read long case studies to understand the important work.

#### Graduate-School Reviewers

They should be able to quickly understand:

- Matthew's computer science background
- his mathematics and physics foundation
- his Technology Management experience
- his academic interests
- evidence of technically substantial work
- the breadth of his coursework and projects

### Secondary

- engineers
- designers
- technical collaborators
- founders
- classmates
- professors
- people discovering Matthew through GitHub or LinkedIn

---

## Core Experience

The primary portfolio is one continuous scroll journey divided into chapters.

### 01 — Name

Purpose:

Introduce Matthew immediately and establish the visual identity of the site.

Primary content:

- Matthew Blanke
- concise professional identity
- one short supporting statement
- primary hero visual/object

The hero should use very little copy.

The visual composition and motion should establish the tone of the entire experience.

---

### 02 — Projects

Purpose:

Show that Matthew builds real products and technically substantial software.

Primary projects:

- Rankle
- Plannr

These should receive the strongest project treatment.

Each flagship project should be understandable within seconds through:

- project name
- one concise explanation
- a strong visual or interactive demonstration
- a small set of relevant technologies
- status or live link
- optional access to deeper information

Secondary work may include selected academic or engineering projects where each item contributes a distinct signal.

Secondary projects should remain substantially lighter than Rankle and Plannr.

The projects section should not become a collection of long case studies.

---

### 03 — Experience

Purpose:

Communicate Matthew's professional and practical history without reproducing a résumé.

Potential content includes:

- Trader Joe's
- Physics Learning Center tutoring
- relevant project or academic experience where appropriate

The website should communicate experience visually and concisely.

The résumé remains the source for complete detail.

---

### 04 — Education

Purpose:

Show the shape of Matthew's academic background rather than reproduce a transcript.

The section should communicate the relationship between:

- Computer Science
- Mathematics
- Physics
- Technology Management

Relevant coursework may be represented visually or spatially rather than as a long list.

The section should make Matthew's interdisciplinary background understandable at a glance.

---

### 05 — Off the Clock

Purpose:

Reveal personality without relying on an "About Me" paragraph.

Potential subjects include:

- sports
- music and vinyl
- games
- travel

The section should be primarily visual and highly concise.

It should make Matthew feel more human without becoming a generic hobbies section.

---

### 06 — Contact

Purpose:

Provide a simple, clear ending to the journey.

Primary actions:

- Email
- GitHub
- LinkedIn
- Résumé

The ending should visually resolve the experience rather than introduce new complexity.

---

## Navigation

The site should not rely on a conventional persistent top navigation bar.

Instead, the primary navigation pattern is a **fixed chapter index positioned in a corner of the viewport**.

At rest, it should remain compact.

Example:

```text
01
```

On hover or keyboard focus on desktop, it may expand into:

```text
01  NAME
02  PROJECTS
03  EXPERIENCE
04  EDUCATION
05  OFF THE CLOCK
06  CONTACT
```

On touch devices, it should open through an explicit tap interaction.

Requirements:

- current chapter is identifiable
- each chapter is keyboard accessible
- Escape closes the expanded navigator where appropriate
- touch users do not depend on hover
- chapter links use stable anchors
- browser navigation remains sane
- reduced-motion users receive an appropriate alternative
- navigation must remain usable if the visual/3D layer fails

Expected anchors:

```text
/#name
/#projects
/#experience
/#education
/#off-clock
/#contact
```

---

## Content Strategy

The portfolio should communicate through composition and interaction before prose.

### Primary rule

> If an object, image, motion, or title can communicate the idea, do not add a paragraph explaining it.

### Visible-copy target

A major scene should generally expose no more than approximately **40–60 words** by default.

Many scenes should use substantially less.

### Content layers

#### Primary

Immediately visible information required to understand the scene.

#### Secondary

Optional information revealed through a deliberate interaction such as:

- More +
- Details +
- project link
- disclosure
- dedicated route if eventually justified

#### Deep detail

Technical evidence, architecture explanations, development history, and other material that should not interrupt the primary journey.

Deep detail should be available where useful but never forced on every visitor.

---

## Project Presentation

### Rankle

Primary idea:

A daily ranking game built for arguments with friends.

The visual experience should communicate ranking, competition, social comparison, and game-like energy.

Visible information should remain concise.

Potential visible metadata:

- Daily social game
- Next.js
- Supabase
- Live link

The project should not require a long public architecture explanation.

---

### Plannr

Primary idea:

Turn a syllabus into reviewed deadlines and calendar events.

The visual experience should communicate transformation:

```text
SYLLABUS
→ DATES
→ REVIEW
→ CALENDAR
```

Potential visible metadata:

- iOS
- SwiftUI
- Python / FastAPI
- TestFlight or product link

The transformation itself should explain the product wherever possible.

---

### Secondary Projects

Secondary projects should only appear when they contribute a distinct signal.

Examples of useful signals:

- inherited/team codebase work
- networking/systems
- computational science
- numerical methods
- algorithms
- technically interesting experiments

Secondary work should not receive flagship-scale treatment unless it clearly earns it.

Avoid including ordinary coursework simply to increase project count.

---

## Visual Asset Strategy

The portfolio may use custom generated assets extensively.

Matthew should not be expected to manually create 3D models, illustrations, or other specialized visual assets.

Assets may be produced through Astra or other approved generation workflows.

Potential generated assets include:

- hero identity sculpture
- Rankle objects
- Plannr document/calendar objects
- chapter-transition assets
- abstract dimensional typography
- rendered fallback images
- personal still-life objects
- textures or supporting graphic elements

Generated assets should serve a specific compositional or narrative purpose.

Do not generate assets merely because they look interesting.

The workflow should be:

1. define the composition
2. determine the asset's job
3. write the asset brief
4. generate the asset
5. optimize it for production
6. provide fallback treatment where required

---

## Motion Philosophy

Motion is part of the product architecture, not decoration.

The scroll itself should help tell the story.

Motion may be used to:

- transform persistent objects
- move between chapters
- reveal relationships
- establish depth
- show product transformations
- connect otherwise separate scenes

Motion should not be added merely because an element entered the viewport.

Avoid:

- universal fade-up behavior
- constant animation
- unnecessary springs
- excessive parallax
- motion that obscures information
- scroll hijacking
- animation that exists only to demonstrate technical complexity

Every elaborate scene should have calmer neighboring moments.

---

## 3D Philosophy

3D may be a major visual tool but should never become the entire interface.

The portfolio should preserve normal HTML semantics for meaningful content.

3D should primarily provide:

- atmosphere
- spatial storytelling
- generated objects
- chapter transitions
- depth
- interactive visual identity

Important content must not exist only inside WebGL.

The page must remain usable if WebGL is unavailable.

---

## Responsive Experience

Mobile is not a smaller desktop version.

Each chapter should have a deliberate mobile composition.

Mobile requirements include:

- readable type
- touch-safe controls
- no hover dependency
- simplified motion where necessary
- reduced 3D complexity where appropriate
- no horizontal overflow
- preserved hierarchy
- concise content
- accessible chapter navigation

Some desktop visual effects may be reduced or replaced on mobile if doing so improves clarity or performance.

---

## Accessibility

Accessibility is a first-class product requirement.

The final experience must support:

- semantic DOM structure
- keyboard navigation
- visible focus states
- touch interaction
- meaningful heading hierarchy
- adequate contrast
- reduced-motion preferences
- WebGL-independent access to meaningful information
- accessible chapter navigation
- text alternatives for informative imagery
- browser zoom
- screen readers

Reduced motion should be designed intentionally rather than implemented only by changing animation durations to zero.

---

## Performance

The portfolio should feel immediate despite its visual complexity.

Requirements:

- meaningful text should render without waiting for 3D assets
- heavy assets should load only when needed
- one persistent WebGL canvas should be preferred over multiple canvases
- models and textures must be optimized
- unnecessary post-processing should be avoided
- mobile may use simplified visual assets
- static image fallbacks should exist where appropriate
- visual complexity must not compromise basic navigation or content access

Performance budgets will be defined in `docs/PERFORMANCE.md`.

---

## Content Management

All content is source controlled.

Portfolio content should be defined through local TypeScript data structures or similarly simple repository-owned files.

There is intentionally:

- no CMS
- no admin panel
- no authentication
- no database

Updating projects, experience, coursework, links, or other content is expected to be normal frontend development work committed through Git.

---

## Technical Direction

The confirmed foundation is:

- Next.js
- React
- TypeScript

The likely visual/motion stack includes:

- GSAP
- ScrollTrigger
- Lenis
- Three.js
- React Three Fiber
- Drei

These motion/3D dependencies should be validated through prototyping before becoming permanent architectural commitments.

The site will be deployed on Vercel.

---

## Route Strategy

### Primary

```text
/
```

The homepage is the portfolio.

### Likely utility route

```text
/resume
```

Additional routes should only exist when they provide clear user value.

The site should not return to a conventional architecture where visitors must navigate between many public portfolio pages to understand Matthew.

---

## Success Criteria

The portfolio succeeds if:

1. A visitor understands who Matthew is within seconds.
2. Rankle and Plannr are understandable without reading long case studies.
3. The site feels visually distinctive without becoming difficult to use.
4. The experience feels technically sophisticated without resembling a technology demo.
5. Motion and 3D strengthen the story rather than distract from it.
6. The site remains excellent when paused at arbitrary points in the scroll.
7. The site remains usable with reduced motion or without WebGL.
8. Recruiters can quickly find projects, experience, résumé, and contact information.
9. Graduate-school reviewers can quickly understand Matthew's academic and technical background.
10. The public experience contains substantially less visible prose than the previous portfolio direction.
11. The site feels like one authored journey rather than a collection of unrelated sections.
12. Matthew is excited to show the site to someone.

---

## Non-Goals

The following are explicitly outside the product vision unless reconsidered later.

### No CMS

Content does not require a database-backed editing experience.

### No admin panel

Matthew updates the portfolio through source control.

### No authentication

There is no public or private login requirement.

### No database

The portfolio should remain primarily static/source-driven.

### No conventional multi-page portfolio

The primary experience is one continuous homepage.

### No giant public case studies by default

Projects should be understood quickly.

### No generic portfolio-card grid

The project experience should be composed rather than templated.

### No résumé duplication

The website should summarize experience and education rather than reproduce every bullet.

### No generic developer aesthetic

Avoid:

- fake terminals
- Matrix imagery
- glowing gradients
- generic code wallpaper
- floating technology logos
- hacker motifs

### No generic trendy UI aesthetic

Avoid:

- glassmorphism
- repetitive rounded cards
- Bento grids used as default structure
- unnecessary pill interfaces
- decorative blobs
- template-like SaaS sections

### No purposeless 3D

Every significant visual object should serve atmosphere, identity, explanation, or transition.

### No animation everywhere

Calm scenes are necessary for animated scenes to feel valuable.

---

## Product Development Strategy

The portfolio should be developed through visual prototypes rather than fully implementing the entire journey before creative validation.

### Phase 0 — Documentation and Foundation

Define:

- product requirements
- references
- art direction
- UX architecture
- content strategy
- design system
- motion system
- software architecture
- asset workflow
- accessibility
- performance
- development practices

### Phase 1 — Creative Prototype

Build only:

- chapter navigator
- hero
- hero-to-work transition
- Rankle scene
- Rankle-to-Plannr transition
- Plannr scene
- initial mobile treatment
- reduced-motion treatment

Do not build the complete portfolio until this prototype is visually approved.

### Decision Gate

Ask:

> Does this experience make someone want to keep scrolling?

If not, change direction while the implementation is still small.

### Later Phases

After the visual language is approved:

- Experience
- Education
- Off the Clock
- Contact
- asset production
- motion refinement
- responsive hardening
- accessibility
- performance optimization
- production cutover

---

## Open Questions

These should remain open until prototype work provides enough evidence to decide.

- exact typography
- exact base color palette
- exact hero object
- exact 3D aesthetic
- exact camera behavior
- exact chapter-transition choreography
- whether Lenis materially improves the final experience
- whether Zustand is necessary
- whether every flagship project needs optional deeper detail
- whether secondary project content needs a separate route
- exact Off the Clock composition
- final asset budgets
- final mobile scene simplifications

These questions should be resolved through prototypes rather than prematurely fixed in documentation.
