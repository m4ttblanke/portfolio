"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/**
 * Experience: each duration rule extends from its start toward its end, from
 * the moment it enters the viewport until it reaches 60% of the height.
 * Scrubbed, so scrolling back retracts it and a fast scroll or direct load
 * lands fully drawn. Static presentation creates nothing: the rules are
 * simply drawn.
 */
export function ExperienceMotion() {
  useLayoutEffect(() => {
    const spans = document.querySelectorAll<HTMLElement>(
      "#experience [data-experience-span]",
    );
    if (!spans.length) return;

    const mm = gsap.matchMedia();
    mm.add(PRESENTATION_CONDITIONS, ({ conditions }) => {
      if (isStatic(conditions)) return;
      spans.forEach((span) => {
        gsap.fromTo(
          span,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: span,
              start: "top bottom",
              end: "top 60%",
              scrub: 0.6,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return null;
}
