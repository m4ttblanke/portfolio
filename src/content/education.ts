/*
 * Education content: four academic areas (computer science, mathematics,
 * physics, technology management) organized into three lines. Degrees,
 * dates and areas come from the résumé/CV evidence audited for the previous
 * portfolio (M8 E1, E2, E5–E7, I3–I5). GPA, grades and honors lists stay in
 * the résumé. Areas are representative, not a course list.
 */

export type Credential = {
  readonly title: string;
  readonly institution: string;
  readonly date: { readonly iso?: string; readonly label: string };
};

export type EducationLine = {
  readonly id: string;
  readonly title: string;
  /** Intentional phrase breaks where the line must wrap (never mid-word). */
  readonly titleLines: readonly [string, string];
  readonly credentials: readonly Credential[];
  /** Visible areas: thematic, a few per line. */
  readonly areas: readonly string[];
  /** Where the areas were taken, when not at the line's institutions. */
  readonly areasSource?: string;
  /** One compressed margin annotation, where the evidence supports it. */
  readonly honors?: {
    readonly label: string;
    readonly items: readonly string[];
  };
};

export const education = [
  {
    id: "computer-science",
    title: "Computer Science",
    titleLines: ["Computer", "Science"],
    credentials: [
      {
        title: "B.S. Computer Science",
        institution: "UC Santa Barbara",
        date: { iso: "2027-06", label: "Expected June 2027" },
      },
      {
        title: "A.S. Computer Science",
        institution: "Cabrillo College",
        date: { iso: "2025-05", label: "May 2025" },
      },
    ],
    areas: [
      "Algorithms & theory",
      "Computer networks",
      "Machine learning & computer vision",
      "Software engineering",
    ],
    // Representative courses behind these areas: optimization foundations,
    // automata and formal languages, computer networks, machine learning,
    // computer vision, advanced applications programming.
  },
  {
    id: "mathematics-physics",
    title: "Mathematics + Physics",
    titleLines: ["Mathematics", "+ Physics"],
    credentials: [
      {
        title: "A.S.-T Mathematics",
        institution: "Cabrillo College",
        date: { iso: "2025-05", label: "May 2025" },
      },
      {
        title: "A.S.-T Physics",
        institution: "Cabrillo College",
        date: { iso: "2025-05", label: "May 2025" },
      },
    ],
    areas: ["Linear algebra", "Discrete mathematics"],
    // Taken at West Valley College, 2024–25, not Cabrillo: named beneath the
    // areas so the credential beside them does not claim them.
    areasSource: "West Valley College",
    // Cabrillo honors projects: a charged particle in crossed E and B fields
    // (Fall 2024); wave–particle duality, a Python interference model checked
    // against a laser and double slit (Spring 2025).
    honors: {
      label: "Honors modeling",
      items: ["Crossed E and B fields", "Wave–particle duality"],
    },
  },
  {
    id: "technology-management",
    title: "Technology Management",
    titleLines: ["Technology", "Management"],
    credentials: [
      {
        title: "Technology Management certificate",
        institution: "UC Santa Barbara",
        date: { label: "In progress" },
      },
    ],
    areas: ["Entrepreneurship", "Business strategy", "Marketing"],
  },
] as const satisfies readonly EducationLine[];

/** Credentials that belong to none of the three lines. */
export const otherCredentials = [
  {
    title: "A.A. Liberal Arts",
    institution: "Cabrillo College",
    date: { iso: "2025-05", label: "May 2025" },
  },
] as const satisfies readonly Credential[];
