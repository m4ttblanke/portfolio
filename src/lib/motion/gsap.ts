import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * Single registration point for GSAP plugins. Chapters own their timelines;
 * there is no global timeline. Native scrolling throughout (no smoothing
 * library); timelines smooth their own values with `scrub`.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browser chrome showing/hiding must not re-measure every trigger.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
