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
  readonly credentials: readonly Credential[];
  readonly areas: readonly string[];
  /** One compressed academic annotation, where the evidence supports it. */
  readonly note?: string;
};

export const education = [
  {
    id: "computer-science",
    title: "Computer Science",
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
      "Computer networks",
      "Machine learning",
      "Computer vision",
      "Randomized algorithms",
      "Automata and formal languages",
      "Advanced applications programming",
    ],
  },
  {
    id: "mathematics-physics",
    title: "Mathematics + Physics",
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
    areas: [
      "Linear algebra and discrete mathematics, West Valley College, 2024–25",
    ],
    note: "Honors modeling: charged particles in crossed electric and magnetic fields; wave–particle duality, modeled and tested with a laser and double slit.",
  },
  {
    id: "technology-management",
    title: "Technology Management",
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
