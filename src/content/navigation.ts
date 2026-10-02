export type Chapter = {
  readonly id: string;
  readonly label: string;
  readonly number: string;
  readonly href: `#${string}`;
};

function chapter<const Id extends string>(
  id: Id,
  label: string,
  number: string,
) {
  return { id, label, number, href: `#${id}` } as const satisfies Chapter;
}

/** Single source of truth for chapter order, IDs, labels, and anchors. */
export const chapters = [
  chapter("name", "Name", "01"),
  chapter("projects", "Projects", "02"),
  chapter("experience", "Experience", "03"),
  chapter("education", "Education", "04"),
  chapter("off-clock", "Off the Clock", "05"),
  chapter("contact", "Contact", "06"),
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
