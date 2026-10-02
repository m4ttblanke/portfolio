import type { Rect } from "../../canvas/anchors";

/*
 * Plannr: syllabus → dates → review → calendar. Product behavior is verified
 * in the Plannr repository: extracted events are reviewed and individually
 * accepted, declined, or edited before syncing to Google Calendar.
 *
 * The same physical pieces carry over from Rankle: your tier rows flatten
 * into lines of the syllabus, and your item cards turn back over to become
 * the extracted date chips.
 */

/** Plannr's verified palette (tryplannr.app): navy, gold, paper. */
export const PLANNR_COLORS = {
  navy: "#002e61",
  gold: "#fdb814",
  paper: "#f7f2e7",
  line: "#b3aea4",
};

/** Turn of the Plannr objects: the scene sits left, turned toward center. */
export const PLANNR_TURN = { pitch: 0.05, yaw: 0.1 };

export const LINE_COUNT = 13;
/** Line lengths as a fraction of the page's inner width (line 0: title). */
export const LINE_WIDTHS = [
  0.55, 0.92, 0.84, 0.95, 0.7, 0.9, 0.88, 0.62, 0.94, 0.8, 0.9, 0.72, 0.5,
];
/** Tier row (S…F) → syllabus line it becomes. These lines hold the dates. */
export const ROW_LINE = [2, 4, 6, 8, 10];
/** Item (your card) → the date line it lands on as a chip. */
export const ITEM_LINE = [2, 4, 6, 8, 10];
/** Review verdicts: one extracted date is declined and stays on the page. */
export const APPROVED = [true, true, true, false, true];

export const CALENDAR = { columns: 7, rows: 5, header: 0.16 };
/** Calendar cell (row-major, after the header) for each approved item. */
export const ITEM_CELL = [8, 12, 17, -1, 30];

/** Hand-off from Rankle (fractions of scene.handoff). */
export const HANDOFF_KEYS = {
  retract: [0, 0.3],
  flip: [0.12, 0.45],
  travel: [0.18, 0.8],
  page: [0.32, 0.75],
  lines: [0.5, 0.95],
} as const;

/** Plannr stages (fractions of scene.plannr). */
export const PLANNR_KEYS = {
  dates: [0.04, 0.2],
  lift: [0.14, 0.28],
  review: [0.28, 0.44],
  verdict: [0.42, 0.56],
  calendar: [0.56, 0.68],
  settle: [0.62, 0.82],
} as const;

/** Workflow step shown in the DOM list for a given scene.plannr. */
export function plannrStep(progress: number) {
  if (progress < PLANNR_KEYS.dates[0] + 0.04) return 0;
  if (progress < PLANNR_KEYS.review[0]) return 1;
  if (progress < PLANNR_KEYS.calendar[0]) return 2;
  return 3;
}

function pad(page: Rect) {
  return Math.min(page.width, page.height) * 0.1;
}

/** A syllabus line, frame-relative px (left edge, vertical center). */
export function line(page: Rect, index: number) {
  const inset = pad(page);
  const gap = (page.height - inset * 2) / LINE_COUNT;
  const inner = page.width - inset * 2;
  return {
    left: page.left + inset,
    y: page.top + inset + (index + 0.5) * gap,
    width: inner * LINE_WIDTHS[index],
    height: gap * (index === 0 ? 0.55 : 0.3),
    gap,
  };
}

/** A date chip on its syllabus line, frame-relative px (center + size). */
export function chipOnLine(page: Rect, item: number) {
  const l = line(page, ITEM_LINE[item]);
  const height = l.gap * 0.62;
  const width = height * 2.4;
  return { x: l.left + l.width - width / 2, y: l.y, width, height };
}

/** The highlighted span under a date on its line. */
export function highlight(page: Rect, item: number) {
  const chip = chipOnLine(page, item);
  return { ...chip, width: chip.width * 1.12, height: chip.height * 0.82 };
}

/** A chip queued for review, frame-relative px. */
export function reviewSlot(review: Rect, page: Rect, item: number) {
  const chip = chipOnLine(page, item);
  const scale = Math.min(1.3, (review.width * 0.8) / chip.width);
  const slot = review.height / APPROVED.length;
  return {
    x: review.left + review.width / 2,
    y: review.top + (item + 0.5) * slot,
    width: chip.width * scale,
    height: chip.height * scale,
  };
}

/** A calendar cell's event chip, frame-relative px. */
export function calendarCell(calendar: Rect, cell: number) {
  const top = calendar.top + calendar.height * CALENDAR.header;
  const cellWidth = calendar.width / CALENDAR.columns;
  const cellHeight = (calendar.height * (1 - CALENDAR.header)) / CALENDAR.rows;
  const column = cell % CALENDAR.columns;
  const row = Math.floor(cell / CALENDAR.columns);
  return {
    x: calendar.left + (column + 0.5) * cellWidth,
    y: top + (row + 0.62) * cellHeight,
    width: cellWidth * 0.78,
    height: cellHeight * 0.36,
    cellWidth,
    cellHeight,
  };
}

/**
 * Pivot of the Plannr plane, frame-relative px: the stage's center. Plannr
 * objects turn rigidly about it so their small depth offsets always hold.
 */
export function plannrPivot(pl: { page: Rect; calendar: Rect }) {
  const left = pl.page.left;
  const right = pl.calendar.left + pl.calendar.width;
  return { x: (left + right) / 2, y: pl.page.top + pl.page.height / 2 };
}
