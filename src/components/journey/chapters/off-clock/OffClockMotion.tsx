"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

type Subject = "baseball" | "vinyl" | "games";

/*
 * Total scroll travel per plane, in content-width units (u, 1% of the
 * still life's width; 13.4 px at 1440): the glove is the front plane, the
 * controller the rear. At 1440 that is 120 / 78 / 44 px; at 1280, 107 / 70
 * / 40. The front gains most and the rear least, so the planes separate
 * clearly at normal scrolling speed while the controller stays quiet. Each
 * object travels over its own pass across the viewport, so the planes
 * visibly separate while the still life is on screen.
 */
const DEPTH: Record<Subject, number> = {
  baseball: 8.9,
  vinyl: 5.8,
  games: 3.3,
};

/* Phones: total scroll travel in px. No pointer. */
const PHONE_DEPTH: Record<Subject, number> = {
  baseball: 56,
  vinyl: 43,
  games: 25,
};

/*
 * Pointer depth, px at the still life's edge (x, y): the front plane leans
 * most, the rear least. The engaged subject (its word focused on arrival
 * from the navigator) leans further.
 */
const POINTER: Record<Subject, [number, number]> = {
  baseball: [21, 13],
  vinyl: [14, 9],
  games: [7, 5],
};
const ENGAGED = 1.35;

/* Damped follow: no overshoot, no bounce. */
const FOLLOW = { duration: 0.9, ease: "power3.out" } as const;

/**
 * Off the Clock depth. Scrubbed scroll depth on desktop and phones (each
 * object over its own pass); pointer depth on desktop
 * with a fine pointer, listened for on the chapter only while it is in view.
 * Every offset is a custom property the CSS composes (see the module), so
 * scroll and pointer never write the same transform. Static presentation
 * creates nothing: the still life is simply set.
 */
export function OffClockMotion() {
  useLayoutEffect(() => {
    const section = document.getElementById("off-clock");
    const stage = section?.querySelector<HTMLElement>("ul");
    if (!section || !stage) return;
    const objects = [
      ...section.querySelectorAll<HTMLElement>("[data-off-clock-object]"),
    ].map((object) => ({
      object,
      image: object.querySelector("img")!,
      subject: object.closest<HTMLElement>("[data-subject]")!,
      id: object.closest<HTMLElement>("[data-subject]")!.dataset
        .subject as Subject,
    }));

    const mm = gsap.matchMedia();
    mm.add(
      {
        ...PRESENTATION_CONDITIONS,
        desktop: "(min-width: 60.001rem)",
        finePointer: "(hover: hover) and (pointer: fine)",
      },
      ({ conditions }) => {
        if (isStatic(conditions)) return;
        const desktop = !!conditions?.desktop;
        const u = () => stage.offsetWidth / 100;
        // Below 1440 (u = 13.44 px) depth eases off faster than the stage:
        // the facts are fixed-size type, so the room around them shrinks
        // faster than the stage does.
        const depthU = () => u() * Math.min(u() / 13.44, 1);

        for (const { object, id } of objects) {
          const travel = () =>
            desktop ? DEPTH[id] * depthU() : PHONE_DEPTH[id];
          gsap.fromTo(
            object,
            { "--depth": () => travel() / 2 },
            {
              "--depth": () => -travel() / 2,
              ease: "none",
              scrollTrigger: {
                trigger: object,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (!desktop || !conditions?.finePointer) return;
        const lean = objects.map(({ image, subject, id }) => ({
          subject,
          id,
          x: gsap.quickTo(image, "--px", FOLLOW),
          y: gsap.quickTo(image, "--py", FOLLOW),
        }));

        const onMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const box = stage.getBoundingClientRect();
          const nx = gsap.utils.clamp(
            -1,
            1,
            (event.clientX - (box.left + box.width / 2)) / (box.width / 2),
          );
          const ny = gsap.utils.clamp(
            -1,
            1,
            (event.clientY - (box.top + box.height / 2)) / (box.height / 2),
          );
          const engaged = document.activeElement?.closest("[data-subject]");
          // Amplitudes are set at 1440 (u = 13.44 px) and scale with the
          // layout, so narrow desktops lean no further relative to it.
          const scale = Math.min(u() / 13.44, 1);
          for (const { subject, id, x, y } of lean) {
            const k = (subject === engaged ? ENGAGED : 1) * scale;
            x(nx * POINTER[id][0] * k);
            y(ny * POINTER[id][1] * k);
          }
        };
        const onLeave = () => {
          for (const { x, y } of lean) {
            x(0);
            y(0);
          }
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
          for (const { image } of objects) {
            image.style.removeProperty("--px");
            image.style.removeProperty("--py");
          }
        };
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
