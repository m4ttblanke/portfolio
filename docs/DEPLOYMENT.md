# Deployment

## Purpose

This document defines the deployment strategy for Matthew Blanke's portfolio.

The deployment model should remain intentionally simple.

The portfolio is:

- a Next.js application
- primarily static/source-driven
- hosted on Vercel
- publicly served from Matthew's portfolio domain
- not dependent on a database
- not dependent on authentication
- not dependent on an admin backend

The central principle is:

> **Deployment should be boring.**

The portfolio may be visually ambitious, but shipping it should remain straightforward and low-risk.

---

# Hosting

Primary hosting platform:

```text
Vercel
```

Reasons:

- first-class Next.js support
- preview deployments
- simple production deployment
- straightforward domain management
- useful performance tooling
- minimal operational overhead

Do not introduce an additional hosting layer unless a clear technical requirement appears.

---

# Production Domain

Intended production domain:

```text
matthewblanke.com
```

The existing portfolio should remain live until the new portfolio is ready for cutover.

Do not move the production domain early.

---

# Preview Deployment

Every meaningful pull request should receive a preview deployment where practical.

Preview deployments are used to review:

- visual composition
- motion
- mobile layout
- reduced-motion behavior
- real asset loading
- browser behavior
- performance outside localhost

Visual approval should happen on an actual preview URL, not only from local screenshots.

---

# Production Branch

Recommended production branch:

```text
main
```

`main` should remain deployable.

Production should deploy automatically from `main` once Vercel is connected.

Do not use a complicated release-branch strategy for a personal portfolio.

---

# Deployment Flow

Expected workflow:

```text
feature/prototype branch
↓
pull request
↓
Vercel preview
↓
review
↓
CI passes
↓
merge to main
↓
production deployment
```

For experimental visual branches, the work may be discarded without merge.

---

# Pre-Launch Environment

Before production cutover, the new repository may deploy to a Vercel-generated URL such as:

```text
portfolio-*.vercel.app
```

The exact preview hostname is not important.

The production domain should not point to the new site until:

- creative direction is approved
- major chapters are complete
- mobile is complete
- accessibility is reviewed
- performance is reviewed
- redirects are ready
- critical links are verified

---

# Production Cutover

The new site should replace the previous portfolio only after final QA.

Recommended cutover sequence:

1. verify current production domain behavior
2. inventory routes that must be preserved
3. verify DNS/domain ownership
4. configure redirects in the new app
5. deploy final preview
6. test preview thoroughly
7. attach `matthewblanke.com` to the new Vercel project
8. verify HTTPS
9. verify redirects
10. verify metadata/social cards
11. verify analytics if enabled
12. monitor for errors after cutover

The previous portfolio should remain available in its own repository and/or previous Vercel project as an archive until the new deployment is proven stable.

---

# Legacy Route Preservation

Before cutover, audit the old production domain for routes that must continue to work.

Known candidates include Plannr-related routes such as:

```text
/plannr/
/plannr/privacy
/plannr/terms
```

The exact list must be verified before launch.

Do not assume these are the only legacy routes.

Any externally linked route that still matters should be redirected deliberately.

---

# Redirect Strategy

Use Next.js/Vercel-supported redirects.

Potential locations:

- `next.config.*`
- application route handlers where truly necessary
- Vercel configuration only if there is a specific reason

Prefer the simplest centralized solution.

Example conceptual redirect:

```js
{
  source: "/plannr/privacy",
  destination: "https://...",
  permanent: true
}
```

Exact destinations must be verified before implementation.

Do not create redirects based on memory alone.

---

# Redirect Semantics

Use permanent redirects only when the destination is genuinely intended to remain stable.

Use temporary redirects during transitional testing where appropriate.

Avoid redirect chains.

Preferred:

```text
old route
→ final route
```

Not:

```text
old route
→ intermediate route
→ new route
```

---

# 404 Behavior

The site should have a deliberate 404 experience.

Requirements:

- simple
- lightweight
- consistent with visual system
- clear way back to homepage

Do not create an elaborate WebGL-only 404.

---

# Environment Variables

The portfolio should require minimal environment configuration.

Initial expectation:

```text
none or very few
```

Potential later variables may support:

- analytics
- monitoring
- external service configuration

Do not create environment variables for information that is not secret and can safely live in source control.

---

# Secrets

Never commit:

- access tokens
- private API keys
- service credentials
- signing secrets

Use Vercel environment settings for secrets if any are introduced later.

At present, the architecture should avoid requiring secrets.

---

# Environment Separation

If environment variables become necessary, distinguish:

- local
- preview
- production

Only create differences that are actually needed.

Avoid configuration drift.

---

# Build Command

Use the normal Next.js production build.

Conceptually:

```text
pnpm build
```

The exact script will be defined in `package.json`.

Do not use a custom build pipeline unless required.

---

# Install Command

Preferred:

```text
pnpm install --frozen-lockfile
```

or Vercel's equivalent behavior for the selected package manager.

The lockfile must be committed.

---

# Node Version

Vercel should use the same documented Node major version expected locally.

Do not allow production and local development to silently use incompatible runtime versions.

Document the version in the repository.

---

# CI Requirements Before Production

At minimum, a production-bound change should pass:

- install
- lint
- typecheck
- production build

Add relevant tests once they exist.

Visual changes also require visual review.

CI success alone does not prove a scene is ready.

---

# Build Warnings

Treat unexplained build warnings seriously.

Before merge, investigate:

- React warnings
- Next.js warnings
- bundle warnings
- missing asset warnings
- hydration warnings
- unsupported configuration

Do not normalize a noisy build.

---

# Asset Deployment

Production assets should live in appropriate runtime locations.

Likely:

```text
public/models
public/images
public/textures
public/fallbacks
```

Do not deploy:

- high-poly source files
- unused generation exports
- raw work files
- temporary renders
- duplicate variants

Production should contain only assets actually needed by the site.

---

# Large Files

Avoid committing unnecessarily large binary assets.

If a runtime asset becomes very large, first ask:

- can it be compressed?
- can it be simplified?
- can it become a rendered image/video instead?
- can it be loaded later?
- does it belong on a CDN?

Do not add external asset infrastructure prematurely.

Vercel/public assets are preferred while the asset set remains manageable.

---

# Caching

Use platform defaults unless measurement shows a problem.

Static hashed assets should benefit from long-lived caching naturally.

Do not manually invent complex cache headers without a concrete need.

---

# Image Delivery

Use Next.js image optimization where appropriate.

For static decorative/generated imagery:

- ensure correct dimensions
- use responsive sizes
- prefer AVIF/WebP where appropriate

Do not send oversized assets to mobile.

---

# Model Delivery

GLB files should be:

- optimized
- compressed where beneficial
- cacheable
- loaded intentionally

Models should not block HTML rendering.

---

# Font Deployment

Prefer local/self-hosted or Next.js-managed fonts where licensing permits.

Benefits:

- predictable loading
- fewer external requests
- better privacy
- better control

Do not deploy font files that are not licensed for web use.

Only include the weights/styles actually needed.

---

# Content Security

The current site has a limited attack surface.

There is:

- no authentication
- no database
- no user-generated content
- no admin

Maintain that simplicity.

If future external scripts are added, review:

- security
- privacy
- performance
- content-security implications

before deployment.

---

# Third-Party Scripts

Default policy:

> Avoid them.

Potential exceptions:

- Vercel Analytics
- Speed Insights
- carefully selected monitoring

Do not add:

- chat widgets
- ad scripts
- trackers
- heatmaps
- social embeds

without a clear product reason.

---

# Analytics

Analytics are optional.

Preferred low-complexity option:

```text
Vercel Analytics
```

Potential goals:

- page visits
- project-link clicks
- resume clicks
- external contact actions

Do not instrument every interaction simply because it is possible.

Avoid collecting unnecessary personal information.

---

# Monitoring

A personal portfolio does not need enterprise observability by default.

Initial monitoring may consist of:

- Vercel deployment status
- browser console checks
- Web Vitals
- manual post-launch review

Introduce error monitoring only if production complexity justifies it.

---

# SEO Deployment Checks

Before production cutover, verify:

- title
- description
- canonical URL
- Open Graph image
- favicon
- robots behavior
- sitemap if used
- social preview

The production domain should be reflected correctly.

Do not leave Vercel preview URLs in canonical metadata.

---

# Preview SEO

Preview deployments should not accidentally become preferred search results.

Where appropriate, ensure preview environments are not treated as canonical production pages.

Production metadata should point to:

```text
https://matthewblanke.com
```

once live.

---

# Open Graph Assets

Create a deliberate social preview image.

It should be:

- lightweight
- legible
- consistent with portfolio identity
- usable without WebGL

Do not rely on a screenshot of an arbitrary animated state.

---

# Resume Deployment

The résumé route or file should have a stable URL.

Potential:

```text
/resume
```

and/or:

```text
/resume.pdf
```

Final structure remains open.

Any public résumé link should remain stable across redesigns where possible.

---

# Downloadable Files

If a PDF résumé is offered:

- use a clear filename
- keep file size reasonable
- verify the current version before launch

Example:

```text
Matthew-Blanke-Resume.pdf
```

Avoid stale versioned filenames in public links unless versioning serves a purpose.

---

# Domain Cutover QA

After attaching the production domain, verify:

## Homepage

```text
https://matthewblanke.com
```

## Hash Navigation

```text
/#projects
/#experience
/#education
/#contact
```

## Resume

Expected route/file.

## Legacy Redirects

All preserved legacy routes.

## Social Links

- GitHub
- LinkedIn
- email
- live projects

## Project Links

- Rankle
- Plannr/TestFlight or current equivalent
- source links where shown

---

# HTTPS

Production must serve over HTTPS.

Vercel should provision certificates automatically.

Verify there are no mixed-content requests from:

- models
- images
- video
- external resources

---

# WWW Behavior

Decide one canonical domain:

```text
matthewblanke.com
```

or:

```text
www.matthewblanke.com
```

The other should redirect cleanly.

Do not serve two independent canonical versions.

Preferred direction is likely the bare domain unless there is a reason otherwise.

---

# Rollback

Before domain cutover, know how to roll back.

Vercel makes previous deployments available.

If a production issue appears:

1. identify severity
2. restore a known-good deployment if needed
3. fix on a branch
4. redeploy

Do not attempt risky emergency edits directly in production.

---

# Old Portfolio Preservation

The previous portfolio should remain preserved independently.

Do not delete it when V2 launches.

Preserve:

- repository
- deployment if useful
- documentation
- verified project content

It serves as:

- historical archive
- rollback reference
- source of verified facts

The new `/portfolio` repository remains conceptually separate.

---

# Production Launch Checklist

## Code

- `main` clean
- lint passes
- typecheck passes
- build passes
- tests pass where present
- no console errors

## Content

- project facts verified
- links verified
- dates verified
- contact info verified
- résumé current

## Visual

- desktop approved
- laptop approved
- mobile approved
- reduced motion approved
- WebGL fallback approved

## Accessibility

- keyboard reviewed
- focus reviewed
- reduced motion reviewed
- headings reviewed
- contrast reviewed
- touch reviewed

## Performance

- major asset sizes reviewed
- Web Vitals reviewed
- mobile performance reviewed
- no unnecessary preloading

## SEO

- title
- description
- canonical
- OG
- favicon
- robots
- sitemap if applicable

## Domain

- DNS correct
- HTTPS correct
- redirects correct
- legacy routes correct

---

# Post-Launch Review

Immediately after cutover, test production from:

- desktop Chrome
- desktop Safari
- mobile Safari
- mobile Chrome if available

Check:

- load
- scroll
- chapter navigation
- project links
- contact links
- resume
- direct hashes
- legacy redirects

Then review again after caches/DNS settle.

---

# Deployment Anti-Patterns

Do not:

- point the production domain to an unfinished prototype
- deploy directly from random branches
- maintain multiple production branches
- require a database for static content
- add environment variables unnecessarily
- ship raw source assets
- deploy unverified redirects
- leave broken external links
- rely on preview URLs publicly
- introduce complex containers/server infrastructure
- add third-party scripts casually
- delete V1 immediately after launch

---

# Open Deployment Decisions

These should be finalized closer to launch:

- exact production Vercel project configuration
- exact Node version
- exact résumé URL strategy
- final legacy redirect list
- canonical www vs bare-domain behavior
- whether Vercel Analytics is enabled
- whether Speed Insights is enabled
- whether a sitemap is necessary
- final Open Graph generation strategy
- whether V1 remains deployed after the stabilization period

---

# Final Deployment Standard

The new portfolio should be easy to ship, easy to preview, and easy to roll back.

The deployment system is successful if:

- visual experimentation is safe
- every PR can be reviewed in context
- production remains stable
- no backend services are required
- domain cutover is low risk
- old routes do not unexpectedly break

The intended outcome is:

> **an experimental frontend with conventional, dependable deployment.**
