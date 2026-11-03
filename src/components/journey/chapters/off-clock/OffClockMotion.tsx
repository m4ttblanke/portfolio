"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";

type Subject = "baseball" | "vinyl" | "games";

/*
 * Total scroll travel per plane, in content-width units (u, 1% of the
 * still life's width; 13.4 px at 1440): the glove is the front plane, the
 * controller the rear. At 1440 that is 90 / 60 / 38 px; at 1280, 80 / 54 /
 * 34. Each object travels over its own pass across the viewport, so the
 * planes visibly separate while the still life is on screen.
 */
const DEPTH: Record<Subject, number> = {
  baseball: 6.7,
  vinyl: 4.5,
  games: 2.8,
};

/* The display title, a slower back plane: total lag in u (50 px at 1440). */
const TITLE_DEPTH = 3.7;

/* Phones: total scroll travel in px. No pointer. */
const PHONE_DEPTH: Record<Subject, number> = {
  baseball: 46,
  vinyl: 36,
  games: 22,
};

/*
 * Pointer depth, px at the still life's edge (x, y). Objects lean with the
 * pointer, the title against it, so the scene has a back plane. The engaged
 * subject (its word focused on arrival from the navigator) leans further.
 */
const POINTER: Record<Subject, [number, number]> = {
  baseball: [16, 10],
  vinyl: [11, 7],
  games: [6, 4],
};
const TITLE_POINTER: [number, number] = [-6, -4];
const ENGAGED = 1.35;

/* Damped follow: no overshoot, no bounce. */
const FOLLOW = { duration: 0.9, ease: "power3.out" } as const;

/**
 * Off the Clock depth. Scrubbed scroll depth on desktop and phones (each
 * object over its own pass, the title lagging); pointer depth on desktop
 * with a fine pointer, listened for on the chapter only while it is in view.
 * Every offset is a custom property the CSS composes (see the module), so
 * scroll and pointer never write the same transform. Static presentation
 * creates nothing: the still life is simply set.
 */
export function OffClockMotion() {
  useLayoutEffect(() => {
    const section = document.getElementById("off-clock");
    const stage = section?.querySelector<HTMLElement>("ul");
    const title = section?.querySelector<HTMLElement>("[data-off-clock-title]");
    if (!section || !stage || !title) return;
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

        for (const { object, id } of objects) {
          const travel = () => (desktop ? DEPTH[id] * u() : PHONE_DEPTH[id]);
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

        if (!desktop) return;
        gsap.fromTo(
          title,
          { "--title-sy": () => (-TITLE_DEPTH * u()) / 2 },
          {
            "--title-sy": () => (TITLE_DEPTH * u()) / 2,
            ease: "none",
            scrollTrigger: {
              trigger: title,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        if (!conditions?.finePointer) return;
        const lean = objects.map(({ image, subject, id }) => ({
          subject,
          id,
          x: gsap.quickTo(image, "--px", FOLLOW),
          y: gsap.quickTo(image, "--py", FOLLOW),
        }));
        const titleX = gsap.quickTo(title, "--title-px", FOLLOW);
        const titleY = gsap.quickTo(title, "--title-py", FOLLOW);

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
          for (const { subject, id, x, y } of lean) {
            const k = subject === engaged ? ENGAGED : 1;
            x(nx * POINTER[id][0] * k);
            y(ny * POINTER[id][1] * k);
          }
          titleX(nx * TITLE_POINTER[0]);
          titleY(ny * TITLE_POINTER[1]);
        };
        const onLeave = () => {
          for (const { x, y } of lean) {
            x(0);
            y(0);
          }
          titleX(0);
          titleY(0);
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
          title.style.removeProperty("--title-px");
          title.style.removeProperty("--title-py");
        };
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
