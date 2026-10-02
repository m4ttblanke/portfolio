"use client";

import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/motion/gsap";
import styles from "./MeasuredUnits.module.css";

/**
 * Measured length units for display type.
 *
 * Display type is sized from the chapter content width (`cqi`) and viewport
 * height (`svh`). Under browser page zoom, WebKit resolves those units inside
 * `font-size` against the unzoomed viewport, so the type grows with the zoom
 * and overflows. The same units resolve correctly in layout properties, so a
 * hidden probe laid out like a chapter's content box measures them, and the
 * results are published on `<html>` as px: `--cq` (1cqi of a full-width
 * chapter) and `--svh`. Type uses `var(--cq, 1cqi)` / `var(--svh, 1svh)`:
 * without JavaScript it keeps the native units, and wherever browsers resolve
 * them correctly the measured values are identical.
 */
export function MeasuredUnits() {
  const probe = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = probe.current;
    if (!element) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      root.style.setProperty("--cq", `${width / 100}px`);
      root.style.setProperty("--svh", `${height / 100}px`);
      // Type size moves the chapters below it; re-measure scroll triggers.
      ScrollTrigger.refresh();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--cq");
      root.style.removeProperty("--svh");
    };
  }, []);

  return <div ref={probe} aria-hidden="true" className={styles.probe} />;
}
