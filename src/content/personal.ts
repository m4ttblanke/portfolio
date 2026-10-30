/*
 * Off the Clock content. Three subjects and their facts, approved by Matthew.
 * The facts are his; the still-life images beside them are generated
 * references that represent each interest, not his own objects, so they stay
 * decorative and the copy makes no claim about them.
 */

export type PersonalObject = {
  readonly id: "baseball" | "vinyl" | "games";
  readonly label: string;
  readonly fact: string;
};

export const personal = [
  { id: "baseball", label: "Baseball", fact: "Former pitcher" },
  { id: "vinyl", label: "Vinyl", fact: "100+ records" },
  { id: "games", label: "Games", fact: "Elden Ring ×3" },
] as const satisfies readonly PersonalObject[];
