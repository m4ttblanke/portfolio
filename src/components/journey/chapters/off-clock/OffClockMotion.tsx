"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/*
 * Total drift as a fraction of each object's own height: the glove most, the
 * record less, the controller least, so they read at different depths.
 */
const DRIFT = { baseball: 0.07, vinyl: 0.05, games: 0.03 } as const;

/**
 * Off the Clock, desktop only: as the chapter crosses the viewport each
 * object drifts upward through its settled position (reached mid-pass) at its
 * own rate. Scrubbed, so scrolling back reverses it. The words never move.
 * Phones and static presentation create nothing: the still life is simply
 * set.
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
        section
          .querySelectorAll<HTMLElement>("[data-off-clock-object]")
          .forEach((object) => {
            const id = object.closest<HTMLElement>("[data-subject]")?.dataset
              .subject as keyof typeof DRIFT | undefined;
            if (!id) return;
            const travel = () => DRIFT[id] * object.offsetHeight;
            gsap.fromTo(
              object,
              { y: () => travel() / 2 },
              {
                y: () => -travel() / 2,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
