/*
 * The wheel-smoothing layer's handle (decisions/005), kept free of the Lenis
 * import so navigation can use it without loading Lenis. SmoothScroll
 * registers its instance's reset while it exists (fine pointers, motion
 * allowed, not compact); everywhere else this is a no-op.
 */
let reset = () => {};

export function registerSmoothScroll(fn: () => void) {
  reset = fn;
  return () => {
    reset = () => {};
  };
}

/**
 * Drops any smoothing still in flight and syncs to the current position.
 * Called before code that writes the scroll itself (navigator travel), so
 * the two never contend for it.
 */
export function settleSmoothScroll() {
  reset();
}
