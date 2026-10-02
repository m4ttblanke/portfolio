/*
 * Off the Clock content. Three subjects approved for the first composition.
 * Only "former pitcher" is an approved fact; the others stay empty until
 * Matthew supplies and approves them. Images (photographs of Matthew's own
 * objects) arrive at Gate 4.
 */

export type PersonalObject = {
  readonly id: string;
  readonly label: string;
  /** One short, approved fact. Absent until approved. */
  readonly fact?: string;
};

export const personal = [
  { id: "baseball", label: "Baseball", fact: "Former pitcher" },
  { id: "vinyl", label: "Vinyl" },
  { id: "games", label: "Games" },
] as const satisfies readonly PersonalObject[];
