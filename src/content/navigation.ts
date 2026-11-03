import { contactLinks } from "./contact";
import { education } from "./education";
import { experience } from "./experience";
import { personal } from "./personal";
import { plannr, rankle } from "./projects";

/** A destination inside a chapter: a real element on the page, by id. */
export type Section = {
  readonly id: string;
  readonly label: string;
  readonly href: `#${string}`;
};

/*
 * Where subsection tracking (the navigator's current subsection) is
 * meaningful: "always" where the sections stand apart at every size;
 * "stacked" only below the field breakpoint, where a chapter's subjects
 * stack (on desktop they share one composition, so no one of them is
 * current); "never" where they always share one viewport.
 */
export type SectionTracking = "always" | "stacked" | "never";

export type Chapter = {
  readonly id: string;
  readonly label: string;
  readonly number: string;
  readonly href: `#${string}`;
  readonly sections: readonly Section[];
  readonly tracking: SectionTracking;
};

const section = (id: string, label: string): Section => ({
  id,
  label,
  href: `#${id}`,
});

function chapter<const Id extends string>(
  id: Id,
  label: string,
  number: string,
  sections: readonly Section[] = [],
  tracking: SectionTracking = "never",
) {
  return {
    id,
    label,
    number,
    href: `#${id}`,
    sections,
    tracking,
  } as const satisfies Chapter;
}

/*
 * Subsection ids are the content ids the chapters render (Contact's are
 * prefixed: a bare `#email` is ambiguous). Labels come from the same content,
 * so a renamed entry renames its menu item.
 */
const experienceLabel = (entry: (typeof experience)[number]) =>
  "partner" in entry
    ? `${entry.organization} × ${entry.partner}`
    : entry.organization;

/** Single source of truth for chapter order, IDs, labels, and anchors. */
export const chapters = [
  chapter("name", "Name", "01"),
  chapter(
    "projects",
    "Projects",
    "02",
    [section("rankle", rankle.title), section("plannr", plannr.title)],
    "always",
  ),
  chapter(
    "experience",
    "Experience",
    "03",
    experience.map((entry) => section(entry.id, experienceLabel(entry))),
    "stacked",
  ),
  chapter(
    "education",
    "Education",
    "04",
    education.map((line) => section(line.id, line.title)),
    "always",
  ),
  chapter(
    "off-clock",
    "Off the Clock",
    "05",
    personal.map((subject) => section(subject.id, subject.label)),
    "stacked",
  ),
  chapter(
    "contact",
    "Contact",
    "06",
    contactLinks.map((link) => section(`contact-${link.id}`, link.label)),
  ),
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
