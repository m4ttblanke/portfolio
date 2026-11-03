"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/**
 * Education: the three lines enter at one shared Archivo width and resolve
 * together to their own calibrated widths, which bring them to one measure.
 * Only the real width axis moves (`--resolve`, read by the CSS), from the
 * block entering the viewport until its top reaches 40% of the height.
 * Below the field breakpoint (phones, 200% zoom) the lines stand up to a
 * screen apart, so a shared range would resolve the lower ones out of sight:
 * each line resolves as it enters instead, done before it rises into the
 * reading area.
 * Scrubbed, so scrolling back unresolves it and a fast scroll or direct load
 * lands resolved. Static presentation, or a browser that cannot interpolate
 * the width, creates nothing: the lines are simply set at their widths.
 */
export function EducationMotion() {
  useLayoutEffect(() => {
    const block = document.querySelector<HTMLElement>(
      "#education [data-education-block]",
    );
    if (!block || !CSS.supports("font-stretch", "calc(50% + 1%)")) return;
    const titles = block.querySelectorAll("[data-education-title]");

    const resolve = (
      targets: Element | NodeListOf<Element>,
      trigger: Element,
      end: string,
    ) =>
      gsap.fromTo(
        targets,
        { "--resolve": 0 },
        {
          "--resolve": 1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end,
            scrub: 0.6,
          },
        },
      );

    const mm = gsap.matchMedia();
    mm.add(
      { ...PRESENTATION_CONDITIONS, stacked: "(max-width: 60rem)" },
      ({ conditions }) => {
        if (isStatic(conditions)) return;
        if (conditions?.stacked) {
          titles.forEach((title) => resolve(title, title, "bottom 85%"));
        } else {
          resolve(titles, block, "top 40%");
        }
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
