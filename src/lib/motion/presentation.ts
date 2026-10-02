"use client";

import { useSyncExternalStore } from "react";

/*
 * When the journey is choreographed, and when it is static.
 *
 * Static presentation replaces the scroll choreography with each scene's
 * captured composition in normal flow. It applies under reduced motion and on
 * a compact viewport: narrow AND short, where a held 100svh frame cannot fit
 * a scene and its copy (e.g. desktop browsers at 250%+ page zoom). Width alone
 * never triggers it, so phones keep the animated mobile composition.
 *
 * CSS Modules repeat COMPACT_VIEWPORT literally (custom media cannot be shared);
 * keep them in sync.
 */
export const COMPACT_VIEWPORT = "(max-width: 40rem) and (max-height: 30rem)";
export const STATIC_PRESENTATION = `(prefers-reduced-motion: reduce), ${COMPACT_VIEWPORT}`;
/** The complement of STATIC_PRESENTATION, for gsap.matchMedia. */
export const ANIMATED_PRESENTATION =
  "(prefers-reduced-motion: no-preference) and (min-width: 40.0625rem), (prefers-reduced-motion: no-preference) and (min-height: 30.0625rem)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(STATIC_PRESENTATION);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Live static-presentation state. Reports `true` during server render so
 * nothing motion-dependent mounts until the client knows.
 */
export function useStaticPresentation() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(STATIC_PRESENTATION).matches,
    () => true,
  );
}
