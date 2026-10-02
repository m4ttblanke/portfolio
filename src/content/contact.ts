/*
 * Canonical contact points (verified in the previous portfolio's
 * lib/site.ts). The résumé link stays absent until a corrected PDF exists;
 * the closing line is not yet chosen.
 */

export type ContactLink = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly href: string;
};

export const contactLinks = [
  {
    id: "email",
    label: "Email",
    value: "mattheweblanke@gmail.com",
    href: "mailto:mattheweblanke@gmail.com",
  },
  {
    id: "github",
    label: "GitHub",
    value: "@m4ttblanke",
    href: "https://github.com/m4ttblanke",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "in/m4ttblanke",
    href: "https://www.linkedin.com/in/m4ttblanke",
  },
] as const satisfies readonly ContactLink[];

/** Set to the PDF path once the corrected résumé is in `public/`. */
export const resume: { readonly href: string } | null = null;

/** The closing line, set in two lines (approved at Gate 3). */
export const closingLine = ["Your", "move."] as const;
