"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { setScene } from "@/lib/motion/scene-progress";

/**
 * Rankle arrival: the title rises out of a mask as the scene comes up, and
 * the stage's release (scrolling past the held frame) is reported so the
 * landed plates leave with it.
 */
export function RankleMotion() {
  useLayoutEffect(() => {
    const block = document.querySelector<HTMLElement>("[data-scene='rankle']");
    const title = block?.querySelector("[data-rankle-title]");
    if (!block || !title) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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

      ScrollTrigger.create({
        trigger: block,
        start: "bottom bottom",
        end: "bottom top",
        onUpdate: (self) => setScene("rankleRelease", self.progress),
      });

      return () => setScene("rankleRelease", 0);
    });
    return () => mm.revert();
  }, []);

  return null;
}
