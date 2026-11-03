"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/*
 * The field's starting scale about its 2022 origin: every position starts
 * 25% further from 2022 than it settles. At 1440 that carries Trader Joe's
 * about 35 px, the Physics Learning Center about 160 px, SpaceComputer about
 * 260 px and PRESENT off the right edge.
 */
const STRETCH = 1.25;

/*
 * The entries' steps start this much wider (a share of one step per index),
 * so the field settles on a diagonal rather than only sideways.
 */
const SPREAD = 0.35;

/* Phones: each gauge starts compressed toward 2022 and opens to full. */
const GAUGE_FROM = 0.7;

/**
 * Experience, scrubbed (scrolling back reverses it; a fast scroll or direct
 * load lands settled):
 *
 * - Desktop: the whole time field compresses into its true scale as it
 *   rises from the bottom of the viewport to 30% of the height. `--f` (the
 *   field's scale, read by every position in the CSS) runs 1.25 → 1 and
 *   `--spread` closes the steps; the duration rules draw from their starts
 *   during the same pass, overlapping the compression.
 * - Below the field breakpoint: each gauge opens from 0.7 to its full width
 *   as its entry rises to mid-screen, and its rule draws as before.
 *
 * Static presentation creates no timelines: the field is simply settled.
 *
 * In every presentation, an engaged entry (its text pointed at, or its name
 * focused on arrival from the navigator) lights the years it spans. The CSS
 * owns the rest of the engaged state; this only marks the years, on the
 * pointer and focus events that can change it, never per frame.
 */
export function ExperienceMotion() {
  useLayoutEffect(() => {
    const field = document.querySelector<HTMLElement>(
      "#experience [data-experience-field]",
    );
    if (!field) return;
    const entries = [
      ...field.querySelectorAll<HTMLElement>("[data-experience-entry]"),
    ];
    const spans = field.querySelectorAll<HTMLElement>("[data-experience-span]");
    const years = [
      ...field.querySelectorAll<HTMLElement>("[data-experience-year]"),
    ];

    const mm = gsap.matchMedia();
    mm.add(
      { ...PRESENTATION_CONDITIONS, desktop: "(min-width: 60.001rem)" },
      ({ conditions }) => {
        if (isStatic(conditions)) return;
        if (conditions?.desktop) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: field,
              start: "top bottom",
              end: "top 30%",
              scrub: 0.6,
            },
          });
          timeline.fromTo(
            field,
            { "--f": STRETCH, "--spread": SPREAD },
            { "--f": 1, "--spread": 0, ease: "none", duration: 1 },
            0,
          );
          spans.forEach((span, index) => {
            timeline.fromTo(
              span,
              { "--draw": 0 },
              { "--draw": 1, ease: "power1.inOut", duration: 0.55 },
              0.15 + index * 0.12,
            );
          });
          return;
        }
        entries.forEach((entry) => {
          gsap.fromTo(
            entry,
            { "--f": GAUGE_FROM },
            {
              "--f": 1,
              ease: "power1.out",
              scrollTrigger: {
                trigger: entry,
                start: "top bottom",
                end: "top 50%",
                scrub: 0.6,
              },
            },
          );
        });
        spans.forEach((span) => {
          gsap.fromTo(
            span,
            { "--draw": 0 },
            {
              "--draw": 1,
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
      },
    );

    // Light the years the engaged entry spans.
    const hover = window.matchMedia("(hover: hover)");
    const engaged = () =>
      entries.find(
        (entry) =>
          entry.querySelector("[data-experience-org]")?.matches(":focus") ||
          (hover.matches &&
            entry.querySelector("[data-experience-text]")?.matches(":hover")),
      );
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const entry = engaged();
        const start = Number(entry?.dataset.start);
        const end = Number(entry?.dataset.end);
        for (const year of years) {
          const from = Number(year.dataset.from);
          const to = Number(year.dataset.to ?? from);
          const lit =
            !!entry && (to === from ? end >= 1 : from < end && to > start);
          if (lit) year.dataset.lit = "";
          else delete year.dataset.lit;
        }
      });
    };
    const events = ["pointerover", "pointerout", "focusin", "focusout"];
    for (const type of events) field.addEventListener(type, update);

    return () => {
      mm.revert();
      cancelAnimationFrame(frame);
      for (const type of events) field.removeEventListener(type, update);
    };
  }, []);

  return null;
}
