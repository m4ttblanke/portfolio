import { REDUCED_MOTION } from "./presentation";

/*
 * Choreographed navigation travel (decisions/004). A deliberate navigator
 * activation moves the real document scroll to its destination over a
 * distance-aware duration, so every chapter in between plays as it passes:
 * ScrollTrigger and the canvas see ordinary native scroll. Only the
 * navigator travels; Back/Forward, hash loads and the skip link stay native.
 *
 * One frame loop, no React: nothing here renders.
 */

/** Duration bounds, s, and the curve's distance scale (viewport heights). */
const MIN_DURATION = 0.8;
const MAX_DURATION = 2.4;

/*
 * Short trips are all ramp (accelerate, then decelerate); long trips reach a
 * cruise. The ramp share of each end falls from SHORT_RAMP at 1 viewport to
 * LONG_RAMP at 8, so a long trip's peak speed stays ~1.4× its average
 * instead of the ~3× of a cubic in-out, which would read as a cut.
 */
const SHORT_RAMP = 0.5;
const LONG_RAMP = 0.28;

/** Movement the trip did not write, px, that counts as the visitor's. */
const DRIFT = 3;

/** Keys that never scroll the page on their own. */
const MODIFIERS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Distance (viewport heights) → duration, s. */
export function travelDuration(viewports: number) {
  return clamp(0.6 + 0.5 * Math.sqrt(viewports), MIN_DURATION, MAX_DURATION);
}

/** Distance (viewport heights) → ramp share of each end of the trip. */
function rampFor(viewports: number) {
  const t = clamp((viewports - 1) / 7, 0, 1);
  return SHORT_RAMP + (LONG_RAMP - SHORT_RAMP) * t;
}

/*
 * Travel curve: the position for a smoothed trapezoid velocity profile.
 * Velocity rises from rest along a smoothstep over the first `ramp` of the
 * trip, cruises, and falls along a mirrored smoothstep to rest, so speed and
 * acceleration are both zero at each end (no jolt leaving, a settled stop).
 * S is the integral of smoothstep (3u² − 2u³); the profile's area is
 * 1 − ramp, which normalizes the position to 0 → 1.
 */
export function travelEase(t: number, ramp: number) {
  const S = (u: number) => u * u * u - (u * u * u * u) / 2;
  const area = 1 - ramp;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < ramp) return (ramp * S(t / ramp)) / area;
  if (t > 1 - ramp) return 1 - (ramp * S((1 - t) / ramp)) / area;
  return (ramp / 2 + (t - ramp)) / area;
}

/**
 * The document scroll position a destination lands at, re-read every frame.
 *
 * - The element's top, less its `scroll-margin-top` (so native hash loads
 *   and travel agree).
 * - A choreography block (`data-nav-hold`, a fraction) lands that far
 *   through its hold, the scroll while its sticky frame stays put, so a
 *   project lands on its composed scene. Where the runway collapses
 *   (static presentation) the hold is zero and it lands at its top.
 */
export function destinationOf(element: HTMLElement) {
  let y =
    element.getBoundingClientRect().top +
    window.scrollY -
    (parseFloat(getComputedStyle(element).scrollMarginTop) || 0);
  const hold = Number(element.dataset.navHold);
  if (hold) {
    const frame = element.querySelector<HTMLElement>("[data-sticky]");
    const run = element.offsetHeight - (frame?.offsetHeight ?? 0);
    y += hold * Math.max(run, 0);
  }
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return clamp(Math.round(y), 0, Math.max(max, 0));
}

/**
 * Focus a destination without scrolling: itself if focusable (a contact
 * link), else the heading it names (`aria-labelledby` or `data-nav-focus`),
 * else its first heading. Headings get `tabindex="-1"` on first use so they
 * take programmatic focus without entering the tab order. The target is
 * marked `data-arrived` until it loses focus, so a chapter can engage on
 * arrival without also engaging on an ordinary click or tap (a contact
 * link focused by a tap must not stay engaged).
 */
export function focusDestination(element: HTMLElement) {
  const named =
    element.getAttribute("aria-labelledby") ?? element.dataset.navFocus;
  const target = element.matches("a[href], button, [tabindex]")
    ? element
    : ((named && document.getElementById(named)) ??
      element.querySelector<HTMLElement>("h1, h2, h3"));
  if (!target) return;
  if (!target.matches("a[href], button, [tabindex]")) {
    target.setAttribute("tabindex", "-1");
  }
  target.dataset.arrived = "";
  target.addEventListener("blur", () => delete target.dataset.arrived, {
    once: true,
  });
  target.focus({ preventScroll: true });
}

type Trip = { cancel: () => void };
let trip: Trip | null = null;

/** Stops the current trip where it is. No snap, no resume. */
export function cancelTravel() {
  trip?.cancel();
}

export function isTraveling() {
  return trip !== null;
}

/**
 * Travels to `element`. Reduced motion (or no distance) jumps instantly.
 * `onArrive` runs only after a trip completes; a cancelled trip (the
 * visitor's own input, a new trip, Back/Forward) calls nothing.
 */
export function travelTo(
  element: HTMLElement,
  { onArrive }: { onArrive?: () => void } = {},
) {
  cancelTravel();
  const from = window.scrollY;
  const viewports =
    Math.abs(destinationOf(element) - from) / window.innerHeight;

  if (window.matchMedia(REDUCED_MOTION).matches || viewports < 0.01) {
    window.scrollTo({ top: destinationOf(element), behavior: "instant" });
    onArrive?.();
    return;
  }

  const duration = travelDuration(viewports) * 1000;
  const ramp = rampFor(viewports);
  let start = -1;
  let written = from;
  let frame = 0;

  const stop = () => {
    window.cancelAnimationFrame(frame);
    for (const type of INPUT_EVENTS) {
      window.removeEventListener(type, onInput, true);
    }
    trip = null;
  };

  const onInput = (event: Event) => {
    if (event instanceof KeyboardEvent && MODIFIERS.has(event.key)) return;
    stop();
  };

  const step = (now: number) => {
    // Movement the trip did not write is the visitor's (scrollbar drag,
    // find in page, a gesture no listener saw): surrender to it.
    if (Math.abs(window.scrollY - written) > DRIFT) {
      stop();
      return;
    }
    if (start < 0) start = now;
    const t = Math.min((now - start) / duration, 1);
    // The destination is re-read every frame, so a layout change mid-trip
    // (fonts, measured units, a trigger refresh) never strands the stop.
    const to = destinationOf(element);
    window.scrollTo({
      top: from + (to - from) * travelEase(t, ramp),
      behavior: "instant",
    });
    written = window.scrollY;
    if (t < 1) {
      frame = window.requestAnimationFrame(step);
    } else {
      stop();
      onArrive?.();
    }
  };

  for (const type of INPUT_EVENTS) {
    window.addEventListener(type, onInput, { capture: true, passive: true });
  }
  trip = { cancel: stop };
  frame = window.requestAnimationFrame(step);
}

/** The visitor's own input, which always takes the scroll back at once. */
const INPUT_EVENTS = [
  "wheel",
  "touchstart",
  "touchmove",
  "pointerdown",
  "keydown",
] as const;

/**
 * A hash load lands natively before display type, measured units and the
 * choreography runways have settled, and a project lands at its block top
 * rather than its composed scene. Once fonts and the page have loaded, and
 * only if the visitor has not acted yet, correct to the destination
 * instantly. Never animated, never focuses.
 */
export function settleInitialHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const element = id ? document.getElementById(id) : null;
  if (!element) return () => {};

  let acted = false;
  let raf = 0;
  const onInput = () => {
    acted = true;
  };
  for (const type of INPUT_EVENTS) {
    window.addEventListener(type, onInput, { capture: true, passive: true });
  }
  const cleanup = () => {
    window.cancelAnimationFrame(raf);
    for (const type of INPUT_EVENTS) {
      window.removeEventListener(type, onInput, true);
    }
  };

  const loaded =
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise<void>((resolve) =>
          window.addEventListener("load", () => resolve(), { once: true }),
        );
  let live = true;
  Promise.all([document.fonts?.ready, loaded]).then(() => {
    if (!live) return;
    // Two frames: after the layout those settle has been applied.
    raf = window.requestAnimationFrame(() => {
      raf = window.requestAnimationFrame(() => {
        if (!acted && !trip) {
          const y = destinationOf(element);
          if (Math.abs(window.scrollY - y) > 2) {
            window.scrollTo({ top: y, behavior: "instant" });
          }
        }
        cleanup();
      });
    });
  });

  return () => {
    live = false;
    cleanup();
  };
}
