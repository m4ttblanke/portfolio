/**
 * Transient scene values shared between DOM motion and the persistent canvas.
 *
 * A plain mutable object, never React state: scroll timelines write progress,
 * pointer listeners write the pointer, and the canvas reads both inside its
 * frame loop. The canvas registers its invalidate function so writes wake the
 * demand-driven render loop without importing the 3D runtime here.
 */
export const scene = {
  /** Hero exit, 0 (composed hero) → 1 (pieces arrived at Rankle). */
  hero: 0,
  /** Rankle scene while its frame is held, 0 (arrived) → 1 (composed). */
  rankle: 0,
  /** Rankle → Plannr hand-off while Plannr's frame rises, 0 → 1. */
  handoff: 0,
  /** Plannr workflow while its frame is held, 0 (syllabus) → 1 (calendar). */
  plannr: 0,
  /** Fine-pointer position, -1…1 on each axis (0 when no mouse). */
  pointerX: 0,
  pointerY: 0,
};

type SceneKey = keyof typeof scene;

let invalidate = () => {};

export function registerInvalidate(fn: () => void) {
  invalidate = fn;
  return () => {
    invalidate = () => {};
  };
}

export function setScene(key: SceneKey, value: number) {
  if (scene[key] === value) return;
  scene[key] = value;
  invalidate();
}
