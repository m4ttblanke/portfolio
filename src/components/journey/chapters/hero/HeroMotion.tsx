"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { setScene } from "@/lib/motion/scene-progress";

/**
 * Hero exit choreography. Scrubs the hero's scroll-out into `scene.hero`
 * (read by the canvas) and, on wide screens, splits the name apart.
 * Reduced motion gets no timeline: the hero simply scrolls away.
 */
export function HeroMotion() {
  useLayoutEffect(() => {
    const section = document.getElementById("name");
    if (!section) return;
    const first = section.querySelector("[data-name-line='first']");
    const last = section.querySelector("[data-name-line='last']");

    const mm = gsap.matchMedia();
    mm.add(
      {
        wide: "(min-width: 40.0625rem)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { wide, motion } = context.conditions ?? {};
        if (!motion) return;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
          onUpdate: () => setScene("hero", timeline.progress()),
        });
        // Fixed 0 → 1 length so progress maps directly to the scroll range.
        timeline.to({}, { duration: 1 }, 0);

        if (wide && first && last) {
          // The name parts like curtains, cropping off opposite edges.
          timeline
            .to(first, { xPercent: -46, ease: "power2.in", duration: 0.8 }, 0.1)
            .to(last, { xPercent: 40, ease: "power2.in", duration: 0.8 }, 0.1);
        }

        return () => setScene("hero", 0);
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
