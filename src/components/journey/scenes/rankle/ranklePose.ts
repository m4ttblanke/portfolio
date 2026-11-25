import { rankle } from "@/content/projects";
import type { Rect } from "../../canvas/anchors";

/*
 * Rankle: a daily tier-list game (tiers S, A, B, C, F — verified in the Rankle
 * repository). The scene is two tier boards — yours and a friend's — holding
 * the same items in different tiers; threads between matching items make the
 * disagreement spatial. The items are a worked example (one per tier), named
 * on wide plates so the comparison reads without prose.
 *
 * Arrival: the kit's plates first land as a loose, unordered pool in the
 * stage. The MB's straight stems then settle as your board's tier rows; the
 * diagonals and B lobes are set aside.
 */

export const TIERS = ["S", "A", "B", "C", "F"] as const;

/*
 * Item colors start from Rankle's verified brand mark (#FF4D6D, #FFB020,
 * #3A6FF0, black outline) plus ink and paper. Exploratory scene palette —
 * not a claim about Rankle's product UI.
 */
export const ITEM_COLORS = [
  "#ff4d6d",
  "#ffb020",
  "#3a6ff0",
  "#1b1a17",
  "#f6f3ec",
];
export const OUTLINE_COLOR = "#0e0e0c";

/*
 * Item names (the example's prompt sits above the boards in the DOM), printed
 * on each plate's face. Item n wears ITEM_COLORS[n].
 */
export const ITEMS = rankle.example.items;

/** Tier index of each item on your board, and on a friend's. */
export const YOU = [0, 1, 2, 3, 4];
export const FRIEND = [1, 4, 0, 2, 3];

/** Label ink per item: dark on the light faces, paper on blue and ink. */
export const LABEL_INK = [
  "#0e0e0c",
  "#0e0e0c",
  "#f6f3ec",
  "#f6f3ec",
  "#0e0e0c",
];

/**
 * Plate proportions: width / height. Wide enough for the longest name at a
 * readable size, short enough to stay a machined slab rather than a strip.
 */
export const PLATE_ASPECT = 2.8;
/** Corner radius as a fraction of plate height. */
export const PLATE_RADIUS = 0.18;

/*
 * Kit plate → tier row it becomes on your board (null: set aside). The three
 * straight stems become rows S, B and F; matching bands fill rows A and C.
 */
export const PLATE_ROW: (number | null)[] = [0, null, null, 2, 4, null, null];
export const SUPPLEMENT_ROWS = [1, 3];

/** Turn of settled Rankle objects so their thickness reads. */
export const RANKLE_TURN = { pitch: 0.06, yaw: -0.2 };

/*
 * Rankle scene progress keys (fractions of scene.rankle). Your board forms,
 * your plates drop in, a friend's board and plates arrive, threads draw, hold.
 */
export const RANKLE_KEYS = {
  rows: [0.02, 0.24],
  you: [0.16, 0.42],
  friendRows: [0.38, 0.52],
  friend: [0.46, 0.66],
  threads: [0.62, 0.8],
} as const;

/** Slot (top to bottom) each plate lands in on arrival; deliberately unsorted. */
const ARRIVAL_SLOT = [4, 1, 6, 0, 3, 5, 2];
const SCATTER_X = [0.06, -0.08, 0.03, -0.04, 0.09, -0.06, 0.01];
const SCATTER_TILT = [0.08, -0.11, 0.05, -0.04, 0.12, -0.07, 0.03];

export function rankleArrival(index: number, count: number) {
  const slot = ARRIVAL_SLOT[index % ARRIVAL_SLOT.length];
  return {
    /** Vertical position, -0.5 (bottom) … 0.5 (top) of the pool. */
    y: 0.5 - (slot + 0.5) / count,
    x: SCATTER_X[index % SCATTER_X.length],
    tilt: SCATTER_TILT[index % SCATTER_TILT.length],
  };
}

export function rowHeight(board: Rect) {
  return board.height / TIERS.length;
}

/** Vertical center of a tier row, frame-relative px. */
export function rowCenter(board: Rect, row: number) {
  return board.top + (row + 0.5) * rowHeight(board);
}

/** Plate size, px, for a board: nearly the board's width, one per tier. */
export function plateSize(board: Rect) {
  const width = Math.min(
    board.width * 0.86,
    rowHeight(board) * 0.6 * PLATE_ASPECT,
  );
  return { width, height: width / PLATE_ASPECT };
}

/** Center of an item's plate on a board, frame-relative px. */
export function plateCenter(board: Rect, placement: number[], item: number) {
  return {
    x: board.left + board.width / 2,
    y: rowCenter(board, placement[item]),
  };
}
