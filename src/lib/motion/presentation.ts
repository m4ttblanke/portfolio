/*
 * When the journey is choreographed, and when it is static. The single source
 * of truth for the presentation thresholds.
 *
 * Static presentation replaces the scroll choreography with each scene's
 * captured composition in normal flow. It applies under reduced motion and on
 * a compact viewport: narrow AND short, where a held 100svh frame cannot fit
 * a scene and its copy (e.g. desktop browsers at 250%+ page zoom). Width alone
 * never triggers it, so phones keep the animated mobile composition.
 *
 * Plain module (no React) so the server layout can embed the boot script.
 */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const COMPACT_VIEWPORT = "(max-width: 40rem) and (max-height: 30rem)";
export const STATIC_PRESENTATION = `${REDUCED_MOTION}, ${COMPACT_VIEWPORT}`;

/**
 * Runs before first paint (in the layout's boot script) and on every change:
 * mirrors the compact viewport onto `<html data-presentation="compact">`,
 * which scene CSS responds to instead of repeating the media query.
 */
export const presentationScript = `(()=>{const r=document.documentElement,m=matchMedia(${JSON.stringify(COMPACT_VIEWPORT)}),s=()=>{if(m.matches)r.dataset.presentation="compact";else delete r.dataset.presentation};s();m.addEventListener("change",s)})();`;

/**
 * `gsap.matchMedia` conditions. GSAP runs a conditions callback only while at
 * least one condition matches, so `motion` (not `reduce`) is listed: the
 * callback runs whenever motion is allowed, and `isStatic` then rules out a
 * compact viewport.
 */
export const PRESENTATION_CONDITIONS = {
  motion: "(prefers-reduced-motion: no-preference)",
  compact: COMPACT_VIEWPORT,
};

export function isStatic(conditions?: Record<string, boolean>) {
  return !conditions?.motion || !!conditions.compact;
}
