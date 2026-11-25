/**
 * Transient scene values shared between DOM motion and the persistent canvas.
 *
 * A plain mutable object, never React state: scroll timelines write progress,
 * pointer listeners write the pointer, and the canvas reads both inside its
 * frame loop. Writes request a canvas frame through `requestFrame`, without
 * importing the 3D runtime here.
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

/*
 * Demand rendering on the GSAP ticker (decisions/005). Anything that changes
 * what the canvas shows (scroll, layout, pointer, progress, damping) asks for
 * a frame; the canvas draws at most one per tick, and only when asked. The
 * ticker runs Lenis first, then the GSAP timelines, then the canvas, so a
 * smoothed scroll position and the frame drawn for it reach the screen
 * together. A request made before the canvas registers is kept, so the first
 * frame is never lost.
 */
let pending = false;

export function requestFrame() {
  pending = true;
}

/** True once per requested frame: clears the request. */
export function takeFrameRequest() {
  const requested = pending;
  pending = false;
  return requested;
}

export function setScene(key: SceneKey, value: number) {
  if (scene[key] === value) return;
  scene[key] = value;
  requestFrame();
}
