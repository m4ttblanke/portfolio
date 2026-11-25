/*
 * Experience content. Trader Joe’s and the Physics Learning Center come from
 * the résumé/CV evidence audited for the previous portfolio (M7/M8,
 * 2026-09-24). Trader Joe's carries one metric, approved by Matthew on
 * 2026-11-02: 10% year-over-year grocery sales growth, stated as a
 * contribution (not sole credit, and grocery sales only, not the store's).
 *
 * SpaceComputer × UCSB is a sponsored senior project, not employment. Its
 * signal is verified against the 4Orbit repository (main, 2026-10-29): the
 * Cedar-gated Orbitport KMS flow with audit logging is Matthew's commit
 * 5e5c382, verified live against SpaceComputer KMS on 2026-10-07. The repo is
 * private, so the entry carries no link. "Team lead" is confirmed by Matthew.
 * Courses Search (Fall 2025) was replaced by this entry; it lives in git
 * history.
 */

export type ExperienceKind = "work" | "teaching" | "sponsored-project";

/** ISO year-month (for `<time>` and the time field), plus the visible label. */
type DatePoint = {
  readonly iso: `${number}-${number}`;
  readonly label: string;
};

export type ExperienceEntry = {
  readonly id: string;
  readonly kind: ExperienceKind;
  /**
   * Visible kind label: entries are different kinds of experience (it keeps
   * the sponsored project from reading as employment). Shown in the dates
   * row.
   */
  readonly kindLabel: string;
  readonly organization: string;
  /** A second organization the work is shared with, shown as "A × B". */
  readonly partner?: string;
  /** Where the organization sits, set apart from its name. */
  readonly place?: string;
  readonly role: string;
  readonly start: DatePoint;
  /** A date, or "present" while ongoing. */
  readonly end: DatePoint | "present";
  readonly signal: string;
};

/** Rendered by chapter 03, in this order. */
export const experience = [
  {
    id: "trader-joes",
    kind: "work",
    kindLabel: "Work",
    organization: "Trader Joe’s",
    role: "Crew member, grocery section lead",
    start: { iso: "2022-06", label: "June 2022" },
    end: "present",
    signal:
      "Led grocery ordering, inventory planning and merchandising, contributing to 10% year-over-year grocery sales growth.",
  },
  {
    id: "physics-learning-center",
    kind: "teaching",
    kindLabel: "Teaching",
    organization: "Physics Learning Center",
    place: "Cabrillo College",
    role: "Math and physics tutor",
    start: { iso: "2024-08", label: "August 2024" },
    end: { iso: "2025-05", label: "May 2025" },
    // The role says "tutor"; the signal names the subjects.
    signal: "Mathematics, mechanics and introductory physics.",
  },
  {
    id: "spacecomputer-ucsb",
    kind: "sponsored-project",
    kindLabel: "Sponsored senior project",
    organization: "SpaceComputer",
    partner: "UCSB",
    role: "Team lead, 4Orbit",
    // Only the quarter is verified. UCSB's fall quarter starts in late
    // September; the label stays at that precision.
    start: { iso: "2026-09", label: "Fall 2026" },
    end: "present",
    // The scanning layer (approved at Gate C); Orbitport and the
    // architecture are deliberately left out of it.
    signal:
      "Built Cedar-gated KMS access for AI agents, auditing every allow/deny decision.",
  },
] as const satisfies readonly ExperienceEntry[];
