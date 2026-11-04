/*
 * Canonical contact points (verified in the previous portfolio's
 * lib/site.ts), plus the résumé PDF served from `public/resume.pdf`
 * (`/resume` redirects to it; see next.config.ts).
 */

export type ContactLink = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly href: string;
  /** Opens in a new tab (the résumé PDF). */
  readonly newTab?: boolean;
  /** Appended to the accessible name only, e.g. what opening it does. */
  readonly srHint?: string;
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
  {
    id: "resume",
    label: "Résumé",
    value: "View résumé",
    href: "/resume.pdf",
    newTab: true,
    srHint: "(PDF, opens in a new tab)",
  },
] as const satisfies readonly ContactLink[];

/** The closing line, set in two lines (approved at Gate 3). */
export const closingLine = ["Your", "move."] as const;
