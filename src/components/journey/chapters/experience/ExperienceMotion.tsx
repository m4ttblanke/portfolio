"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/*
 * Numeral offset at the present end of the field, px. Each year's numeral
 * starts this far right times its field position (2022: none), as if the
 * scale were stretched about 1%.
 */
const CALIBRATION = 14;

/**
 * Experience: each duration rule extends from its start toward its end, from
 * the moment it enters the viewport until it reaches 60% of the height.
 * Scrubbed, so scrolling back retracts it and a fast scroll or direct load
 * lands fully drawn.
 *
 * On desktop the scale calibrates with them: the year numerals start
 * slightly right of their ticks and settle onto them as the rules draw,
 * from the scale entering until the last rule is drawn. Only the glyphs
 * move; the ticks, PRESENT and the rules' positions never do.
 *
 * Static presentation creates nothing: the rules are simply drawn and the
 * numerals sit on their ticks.
 */
export function ExperienceMotion() {
  useLayoutEffect(() => {
    const spans = document.querySelectorAll<HTMLElement>(
      "#experience [data-experience-span]",
    );
    if (!spans.length) return;
    const numerals = document.querySelectorAll<HTMLElement>(
      "#experience [data-experience-year]",
    );

    const mm = gsap.matchMedia();
    mm.add(
      { ...PRESENTATION_CONDITIONS, desktop: "(min-width: 60.001rem)" },
      ({ conditions }) => {
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

        // The scale is hidden below the field breakpoint.
        if (!conditions?.desktop || !numerals.length) return;
        gsap.fromTo(
          numerals,
          {
            x: (_, numeral: HTMLElement) =>
              CALIBRATION *
              Number(numeral.parentElement?.style.getPropertyValue("--at")),
          },
          {
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: numerals[0],
              start: "top bottom",
              endTrigger: spans[spans.length - 1],
              end: "top 60%",
              scrub: 0.6,
            },
          },
        );
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
