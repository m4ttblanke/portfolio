"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/*
 * Total drift as a fraction of each object's own height: the glove most, the
 * record less, the controller least, so they read at different depths.
 */
const DRIFT = { baseball: 0.07, vinyl: 0.05, games: 0.03 } as const;

/*
 * The record also turns, degrees either side of rest: a barely perceptible
 * physical turn, never a spin. Its baked sheen and shadow turn with it, so
 * this stays small.
 */
const TURN = 1.5;

/*
 * The display title's total lag, px: a slower plane behind the objects. It
 * moves in whole pixels (snapped), so the type is never re-rasterized at a
 * subpixel offset: it stays as sharp as at rest, and repaints only when the
 * offset changes rather than every frame.
 */
const LAG = 16;

/**
 * Off the Clock, desktop only: as the chapter crosses the viewport each
 * object drifts upward through its settled position (reached mid-pass) at its
 * own rate, the record turning slightly about its centre, and the display
 * title lags downward through its own, so three planes separate: title,
 * words, objects. Scrubbed, so scrolling back reverses it. The subject words
 * never move. Phones and static presentation create nothing: the still life
 * is simply set.
 */
export function OffClockMotion() {
  useLayoutEffect(() => {
    const section = document.getElementById("off-clock");
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add(
      { ...PRESENTATION_CONDITIONS, desktop: "(min-width: 60.001rem)" },
      ({ conditions }) => {
        if (isStatic(conditions) || !conditions?.desktop) return;
        const pass = () => ({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        });
        section
          .querySelectorAll<HTMLElement>("[data-off-clock-object]")
          .forEach((object) => {
            const id = object.closest<HTMLElement>("[data-subject]")?.dataset
              .subject as keyof typeof DRIFT | undefined;
            if (!id) return;
            const travel = () => DRIFT[id] * object.offsetHeight;
            const turn = id === "vinyl";
            gsap.fromTo(
              object,
              { y: () => travel() / 2, ...(turn && { rotation: -TURN }) },
              {
                y: () => -travel() / 2,
                ...(turn && { rotation: TURN }),
                ease: "none",
                scrollTrigger: pass(),
              },
            );
          });

        const title = section.querySelector("[data-off-clock-title]");
        if (title) {
          gsap.fromTo(
            title,
            { y: -LAG / 2 },
            { y: LAG / 2, snap: "y", ease: "none", scrollTrigger: pass() },
          );
        }
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
