import { Shape } from "three";

/*
 * The MB identity relief: seven plates, each on its own depth plane. Plates are placed along rays from the canonical camera, so from that
 * camera they align into a flat MB; any other viewpoint separates them.
 *
 * Letter space: cap height 2, baseline 0, x from 0 to MB_WIDTH.
 */

const STROKE = 0.4;
const M_WIDTH = 2.75;
const B_X = M_WIDTH + 0.42;
/* Lobes tuck under the stem so the B reads as one letter. */
const LOBE_X = B_X + STROKE / 2;
const LOBE_STROKE = 0.3;

export const MB_WIDTH = LOBE_X + 0.48 + 0.5;
export const MB_HEIGHT = 2;
export const PLATE_THICKNESS = 0.26;

export type PlateTone = "light" | "dark";

export type PlateDef = {
  id: string;
  shape: Shape;
  /** Center of the plate's bounding box in letter space. */
  center: [number, number];
  /** Depth plane in letter units; positive is toward the camera. */
  depth: number;
  /** Angle of the plate's long axis (radians), used to lay it flat later. */
  axis: number;
  tone: PlateTone;
};

function polygon(points: [number, number][]) {
  const shape = new Shape();
  shape.moveTo(...points[0]);
  for (const point of points.slice(1)) shape.lineTo(...point);
  shape.closePath();
  return shape;
}

/** A B lobe: a ⊃-shaped arch, open on the stem side. */
function lobe(x0: number, y0: number, height: number, straight: number) {
  const r = height / 2;
  const inner = r - LOBE_STROKE;
  const x1 = x0 + straight;
  const cy = y0 + r;
  const shape = new Shape();
  shape.moveTo(x0, y0 + height);
  shape.lineTo(x1, y0 + height);
  shape.absarc(x1, cy, r, Math.PI / 2, -Math.PI / 2, true);
  shape.lineTo(x0, y0);
  shape.lineTo(x0, y0 + LOBE_STROKE);
  shape.lineTo(x1, y0 + LOBE_STROKE);
  shape.absarc(x1, cy, inner, -Math.PI / 2, Math.PI / 2, false);
  shape.lineTo(x0, y0 + height - LOBE_STROKE);
  shape.closePath();
  return shape;
}

function plate(
  id: string,
  shape: Shape,
  bounds: [number, number, number, number],
  depth: number,
  axis: number,
  tone: PlateTone,
): PlateDef {
  const [x0, y0, x1, y1] = bounds;
  return {
    id,
    shape,
    center: [(x0 + x1) / 2, (y0 + y1) / 2],
    depth,
    axis,
    tone,
  };
}

const MID = M_WIDTH / 2;
/* Diagonals run from the stem tops to a baseline vertex, as in Archivo's M. */
const DIAG_TOP = 0.5;
const DIAG_FOOT = 0.48;
const diagAxis = Math.atan2(2, MID - DIAG_TOP / 2);

/*
 * The canonical view: the relief is turned off the camera axis so its plate
 * thickness reads, while plate positions stay on camera rays (pre-foreshortened
 * to match) so the MB still aligns.
 */
export const CANONICAL_TURN = { pitch: 0.1, yaw: -0.28 };

export function createPlates(): PlateDef[] {
  const footL = MID - DIAG_FOOT / 2;
  const footR = MID + DIAG_FOOT / 2;
  return [
    plate(
      "m-stem-left",
      polygon([
        [0, 0],
        [STROKE, 0],
        [STROKE, 2],
        [0, 2],
      ]),
      [0, 0, STROKE, 2],
      0.55,
      Math.PI / 2,
      "dark",
    ),
    plate(
      "m-diagonal-left",
      polygon([
        [0, 2],
        [DIAG_TOP, 2],
        [footR, 0],
        [footL, 0],
      ]),
      [0, 0, footR, 2],
      -0.25,
      -diagAxis,
      "light",
    ),
    plate(
      "m-diagonal-right",
      polygon([
        [M_WIDTH - DIAG_TOP, 2],
        [M_WIDTH, 2],
        [footR, 0],
        [footL, 0],
      ]),
      [footL, 0, M_WIDTH, 2],
      0.2,
      diagAxis,
      "light",
    ),
    plate(
      "m-stem-right",
      polygon([
        [M_WIDTH - STROKE, 0],
        [M_WIDTH, 0],
        [M_WIDTH, 2],
        [M_WIDTH - STROKE, 2],
      ]),
      [M_WIDTH - STROKE, 0, M_WIDTH, 2],
      -0.55,
      Math.PI / 2,
      "dark",
    ),
    plate(
      "b-stem",
      polygon([
        [B_X, 0],
        [B_X + STROKE, 0],
        [B_X + STROKE, 2],
        [B_X, 2],
      ]),
      [B_X, 0, B_X + STROKE, 2],
      0.35,
      Math.PI / 2,
      "dark",
    ),
    plate(
      "b-lobe-upper",
      lobe(LOBE_X, 1.04, 0.96, 0.38),
      [LOBE_X, 1.04, LOBE_X + 0.38 + 0.48, 2],
      -0.4,
      0,
      "light",
    ),
    plate(
      "b-lobe-lower",
      lobe(LOBE_X, 0, 1.0, 0.48),
      [LOBE_X, 0, MB_WIDTH, 1],
      0.05,
      0,
      "light",
    ),
  ];
}

/*
 * Hero exit (progress 0 → 1). Keyframes, as fractions of hero progress:
 * canonical MB → dissolved (turned off-axis, depth planes pulled apart) →
 * exploded and turning over → settled in the Rankle stage.
 */
export const EXIT_KEYS = [0, 0.3, 0.62, 1] as const;
/** Group turn at the dissolve key; the MB no longer aligns from here. */
export const DISSOLVE_TURN = { pitch: -0.18, yaw: 0.85 };
/** How far depth planes separate at the dissolve key. */
export const DISSOLVE_DEPTH = 2.4;
/** Outward spread of the exploded plates, relative to the relief. */
export const EXPLODE_SPREAD = 1.8;
/** Per-plate delay so the plates peel away in sequence. */
export const EXIT_STAGGER = 0.015;
