"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { isStatic, PRESENTATION_CONDITIONS } from "@/lib/motion/presentation";
import { registerSmoothScroll } from "@/lib/motion/smooth-scroll";

/**
 * Wheel smoothing (decisions/005). Lenis eases wheel and trackpad input on
 * the main thread, inside the GSAP ticker and ahead of every timeline and
 * the canvas frame, so the page and the 3D scene it carries move in the same
 * frame. It still writes the real document scroll, so ScrollTrigger, sticky
 * frames, anchors, Find in Page and assistive technology see ordinary
 * scrolling.
 *
 * Created only for fine pointers with motion allowed and outside compact
 * presentation. Touch, keyboard, scrollbar drags and navigator travel stay
 * native; Lenis follows them. Reduced motion creates nothing.
 */
export function SmoothScroll() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        ...PRESENTATION_CONDITIONS,
        finePointer: "(hover: hover) and (pointer: fine)",
      },
      ({ conditions }) => {
        if (isStatic(conditions) || !conditions?.finePointer) return;
        const lenis = new Lenis({ autoRaf: false });
        // Triggers update inside the same tick, before the timelines render.
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf, false, true);
        // Retarget to where the page already is: stops any easing in place.
        const unregister = registerSmoothScroll(() =>
          lenis.scrollTo(window.scrollY, { immediate: true, force: true }),
        );
        return () => {
          unregister();
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      },
    );
    return () => mm.revert();
  }, []);

  return null;
}
