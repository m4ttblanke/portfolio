/*
 * Experience content. Dates, titles and duties come from the résumé/CV
 * evidence audited for the previous portfolio (M7/M8, 2026-09-24); Courses
 * Search is verified against the public repository and Matthew's merged PRs
 * (#23, #28, #38, #39); its Agile team practice is confirmed by Matthew. No
 * metrics are shown (the sales figure is omitted).
 */

export type ExperienceKind = "work" | "teaching" | "team-codebase";

/** ISO year-month (for `<time>` and the time field), plus the visible label. */
type DatePoint = {
  readonly iso: `${number}-${number}`;
  readonly label: string;
};

export type ExperienceEntry = {
  readonly id: string;
  readonly kind: ExperienceKind;
  /** Visible kind label: entries are different kinds of experience. */
  readonly kindLabel: string;
  readonly organization: string;
  /** Where the organization sits, set apart from its name. */
  readonly place?: string;
  readonly role: string;
  readonly start: DatePoint;
  /** A date, or "present" while ongoing. */
  readonly end: DatePoint | "present";
  /** Visible label for an entry that spans one academic term. */
  readonly term?: string;
  readonly signal: string;
  readonly link?: { readonly href: string; readonly label: string };
};

export const experience = [
  {
    id: "trader-joes",
    kind: "work",
    kindLabel: "Work",
    organization: "Trader Joe’s",
    role: "Crew member, grocery section lead",
    start: { iso: "2022-06", label: "June 2022" },
    end: "present",
    signal: "Led grocery ordering, inventory planning and merchandising.",
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
    signal: "Tutored mathematics, mechanics and introductory physics.",
  },
  {
    id: "courses-search",
    kind: "team-codebase",
    kindLabel: "Collaborative software · Course project",
    organization: "UCSB Courses Search",
    role: "Student developer, CMPSC 156 team",
    // UCSB's fall quarter: late September to mid December.
    start: { iso: "2025-09", label: "September 2025" },
    end: { iso: "2025-12", label: "December 2025" },
    term: "Fall 2025",
    signal:
      "Worked in an Agile team on an inherited codebase, shipping merged changes through code review and mutation-tested CI.",
    link: {
      href: "https://github.com/ucsb-cs156-f25/proj-courses-f25-02/pulls?q=is%3Apr+author%3Am4ttblanke+is%3Amerged",
      label: "Merged pull requests",
    },
  },
] as const satisfies readonly ExperienceEntry[];
