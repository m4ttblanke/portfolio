# Architecture Decision Records

This folder records major, cross-cutting decisions that are expensive to reverse.

Write an ADR when a choice:

- shapes architecture across multiple chapters or subsystems
- adds or removes a significant dependency or capability
- changes a documented direction in `docs/`

Do not write ADRs for minor implementation details.

## Format

Name files `NNN-short-title.md`, numbered sequentially (`001-…`, `002-…`). Numbers are never reused.

```markdown
# NNN — Title

Status: Proposed | Accepted | Superseded by NNN
Date: YYYY-MM-DD

## Context

What problem or constraint forced a decision.

## Decision

What was decided, stated plainly.

## Why

The reasoning and the alternatives considered.

## Consequences

What becomes easier, what becomes harder, and what must now stay true.
```

When a decision changes, add a new ADR that supersedes the old one, and update the affected `docs/`.

## Index

No ADRs yet.
