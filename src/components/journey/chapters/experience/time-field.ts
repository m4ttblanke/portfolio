/*
 * The Experience time field: January 2022 at 0, the present (end of the
 * build's month) at 1. Positions are fractions of the field, applied in CSS.
 * The page is prerendered, so "present" is the build date.
 */

const ORIGIN_YEAR = 2022;

const monthIndex = (iso: string) => {
  const [year, month] = iso.split("-").map(Number);
  return year * 12 + (month - 1);
};

const now = new Date();
const origin = ORIGIN_YEAR * 12;
const present = now.getFullYear() * 12 + now.getMonth() + 1;

const at = (index: number) =>
  Math.min(Math.max((index - origin) / (present - origin), 0), 1);

/** Field position of the start of a month. */
export const startOf = (iso: string) => at(monthIndex(iso));

/** Field position of the end of a month. */
export const endOf = (iso: string) => at(monthIndex(iso) + 1);

/** Year boundaries from the origin up to the present. */
export const years = Array.from(
  { length: now.getFullYear() - ORIGIN_YEAR + 1 },
  (_, i) => ({ year: ORIGIN_YEAR + i, at: at((ORIGIN_YEAR + i) * 12) }),
);
