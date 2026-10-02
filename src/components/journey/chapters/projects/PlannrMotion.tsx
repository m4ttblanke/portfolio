"use client";

import { useLayoutEffect } from "react";
import { gsap } from "@/lib/motion/gsap";
import { ANIMATED_PRESENTATION } from "@/lib/motion/presentation";
import { setScene } from "@/lib/motion/scene-progress";
import { plannrStep } from "../../scenes/plannr/plannrPose";

/**
 * Plannr choreography. While the frame rises, the hand-off from Rankle is
 * scrubbed into `scene.handoff`; while it is held, the workflow is scrubbed
 * into `scene.plannr`, and the DOM step list marks the current step.
 */
export function PlannrMotion() {
  useLayoutEffect(() => {
    const block = document.querySelector<HTMLElement>("[data-scene='plannr']");
    const title = block?.querySelector("[data-plannr-title]");
    const steps = block?.querySelectorAll<HTMLElement>("[data-plannr-step]");
    if (!block || !title || !steps) return;

    let current = -1;
    const mark = (step: number) => {
      if (step === current) return;
      current = step;
      steps.forEach((element, index) => {
        if (index === step) element.dataset.current = "";
        else delete element.dataset.current;
      });
    };

    const mm = gsap.matchMedia();
    mm.add(ANIMATED_PRESENTATION, () => {
      const handoff = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: block,
          start: "top bottom",
          end: "top top",
          scrub: 0.6,
        },
        onUpdate: () => setScene("handoff", handoff.progress()),
      });
      handoff.to({}, { duration: 1 }, 0);
      handoff.fromTo(
        title,
        { yPercent: 110 },
        { yPercent: 0, ease: "power3.out", duration: 0.45 },
        0.55,
      );

      const workflow = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: block,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
        onUpdate: () => {
          setScene("plannr", workflow.progress());
          mark(plannrStep(workflow.progress()));
        },
      });
      workflow.to({}, { duration: 1 }, 0);
      mark(0);

      return () => {
        setScene("handoff", 0);
        setScene("plannr", 0);
        mark(-1);
      };
    });
    return () => mm.revert();
  }, []);

  return null;
}
