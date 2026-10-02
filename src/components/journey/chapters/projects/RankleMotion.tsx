"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";
import { setScene } from "@/lib/motion/scene-progress";

/**
 * Rankle choreography: the title rises out of a mask as the scene comes up;
 * while the frame is held, scroll drives `scene.rankle` for the canvas. The
 * frame's release needs no trigger — the canvas tracks it from scroll.
 */
export function RankleMotion() {
  useLayoutEffect(() => {
    const block = document.querySelector<HTMLElement>("[data-scene='rankle']");
    const title = block?.querySelector("[data-rankle-title]");
    if (!block || !title) return;

    const mm = gsap.matchMedia();
    mm.add(PRESENTATION_CONDITIONS, ({ conditions }) => {
      if (isStatic(conditions)) return;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: block,
            start: "top bottom",
            end: "top top",
            scrub: 0.6,
          },
        })
        .fromTo(
          title,
          { yPercent: 110 },
          { yPercent: 0, ease: "power3.out", duration: 0.55 },
          0.45,
        );

      // The scene composes while the frame is held.
      const scene = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: block,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
        onUpdate: () => setScene("rankle", scene.progress()),
      });
      scene.to({}, { duration: 1 }, 0);

      return () => setScene("rankle", 0);
    });
    return () => mm.revert();
  }, []);

  return null;
}
