/*
 * Off the Clock content. Three subjects and their facts, approved by Matthew
 * as provisional. Gate 4 sets the caption treatment and adds photographs of
 * Matthew's own objects.
 */

export type PersonalObject = {
  readonly id: string;
  readonly label: string;
  /** One short, approved fact. Absent until approved. */
  readonly fact?: string;
};

export const personal = [
  { id: "baseball", label: "Baseball", fact: "Former pitcher" },
  { id: "vinyl", label: "Vinyl", fact: "100+ records" },
  { id: "games", label: "Games", fact: "Elden Ring ×3" },
] as const satisfies readonly PersonalObject[];
