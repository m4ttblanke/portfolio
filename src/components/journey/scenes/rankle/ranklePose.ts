/*
 * Rankle arrival: the kit's plates land as a loose, unordered column in the
 * Rankle stage. Ordering and comparison come in the Rankle checkpoints.
 */

/** Slot (top to bottom) each plate lands in; deliberately not sorted. */
const ARRIVAL_SLOT = [4, 1, 6, 0, 3, 5, 2];
/** Horizontal scatter as a fraction of stage width. */
const SCATTER_X = [0.06, -0.08, 0.03, -0.04, 0.09, -0.06, 0.01];
/** In-plane tilt (radians) layered on the horizontal lie. */
const SCATTER_TILT = [0.08, -0.11, 0.05, -0.04, 0.12, -0.07, 0.03];

/** Turn of the settled tiles, so their thickness and color read. */
export const RANKLE_TURN = { pitch: 0.16, yaw: -0.32 };

export function rankleArrival(index: number, count: number) {
  const slot = ARRIVAL_SLOT[index % ARRIVAL_SLOT.length];
  return {
    /** Vertical position, -0.5 (bottom) … 0.5 (top) of the column. */
    y: 0.5 - (slot + 0.5) / count,
    x: SCATTER_X[index % SCATTER_X.length],
    tilt: SCATTER_TILT[index % SCATTER_TILT.length],
  };
}
