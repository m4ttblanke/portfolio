/*
 * Off the Clock content. Three subjects and their facts, approved by Matthew.
 * The facts are his; the still-life images beside them are generated
 * references that represent each interest, not his own objects, so they stay
 * decorative and the copy makes no claim about them.
 */

/** A completed game: its title and how fully (shown in caps). */
export type GameRecord = {
  readonly title: string;
  readonly result: string;
};

export type PersonalObject = {
  readonly id: "baseball" | "vinyl" | "games";
  readonly label: string;
} & (
  | { readonly fact: string }
  /* Games carries a short record list instead of one fact (approved by
     Matthew, 2026-11-03). Titles are exact; "×3" uses the multiplication
     sign. */
  | { readonly records: readonly GameRecord[] }
);

export const personal = [
  { id: "baseball", label: "Baseball", fact: "Former pitcher" },
  { id: "vinyl", label: "Vinyl", fact: "100+ records" },
  {
    id: "games",
    label: "Games",
    records: [
      { title: "Elden Ring", result: "100% ×3" },
      { title: "Hollow Knight", result: "100%" },
      { title: "Clair Obscur: Expedition 33", result: "100%" },
      { title: "Dark Souls III", result: "100%" },
      { title: "Sekiro: Shadows Die Twice", result: "100%" },
    ],
  },
] as const satisfies readonly PersonalObject[];
