"use client";

import { useSyncExternalStore } from "react";
import { STATIC_PRESENTATION } from "./presentation";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(STATIC_PRESENTATION);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Live static-presentation state (reduced motion or a compact viewport).
 * Reports `true` during server render so nothing motion-dependent mounts
 * until the client knows.
 */
export function useStaticPresentation() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(STATIC_PRESENTATION).matches,
    () => true,
  );
}
