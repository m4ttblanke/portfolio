"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

/*
 * How far the pointer's influence reaches, px. A row answers within ROW_Y of
 * its centre line (the rows are 44 px apart, so the nearest row leads and
 * its neighbours follow faintly) and fades over ROW_X past its value. The
 * closing line answers within REACH above it.
 */
const ROW_Y = 90;
const ROW_X = 480;
const REACH = 280;

/* Damped follow: no overshoot, no bounce. */
const FOLLOW = { duration: 0.5, ease: "power3.out" } as const;

const falloff = (distance: number, range: number) => {
  const t = gsap.utils.clamp(0, 1, 1 - distance / range);
  return t * t;
};

/**
 * Contact never moves on its own; the visitor's pointer moves it. On fine
 * pointers, while the chapter is on screen, the pointer's closeness eases
 * two custom properties the CSS composes with the hover and focus states:
 * --near on each row (its value starts to move out and its tie to draw before
 * it is touched, up to 60% of engagement) and --reach on the closing line
 * (its rule starts to run, MOVE. to stretch and the MB to lean as the
 * pointer approaches, up to 40%). Touch, reduced motion and compact
 * presentation create nothing; keyboard focus and hover still engage fully
 * in CSS.
 */
export function ContactMotion() {
  useLayoutEffect(() => {
    const section = document.getElementById("contact");
    const closing = section?.querySelector<HTMLElement>("p > a");
    if (!section || !closing) return;
    const rows = [...section.querySelectorAll<HTMLElement>("ul a")];

    const mm = gsap.matchMedia();
    mm.add(
      {
        ...PRESENTATION_CONDITIONS,
        finePointer: "(hover: hover) and (pointer: fine)",
      },
      ({ conditions }) => {
        if (isStatic(conditions) || !conditions?.finePointer) return;
        const near = rows.map((row) => gsap.quickTo(row, "--near", FOLLOW));
        const reach = gsap.quickTo(closing, "--reach", FOLLOW);

        const onMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const { clientX: x, clientY: y } = event;
          rows.forEach((row, index) => {
            const box = row.getBoundingClientRect();
            const dy = Math.abs(y - (box.top + box.height / 2));
            const dx = Math.max(0, x - box.right);
            near[index](falloff(dy, ROW_Y) * falloff(dx, ROW_X));
          });
          const box = closing.getBoundingClientRect();
          reach(falloff(Math.max(0, box.top - y), REACH));
        };
        const onLeave = () => {
          near.forEach((set) => set(0));
          reach(0);
        };

        // Listen on the chapter only while it is on screen.
        let listening = false;
        const listen = (on: boolean) => {
          if (on === listening) return;
          listening = on;
          const method = on ? "addEventListener" : "removeEventListener";
          section[method]("pointermove", onMove as EventListener);
          section[method]("pointerleave", onLeave);
          if (!on) onLeave();
        };
        const observer = new IntersectionObserver(([entry]) =>
          listen(entry.isIntersecting),
        );
        observer.observe(section);

        return () => {
          observer.disconnect();
          listen(false);
          for (const row of rows) row.style.removeProperty("--near");
          closing.style.removeProperty("--reach");
        };
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
