import { useLayoutEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

/*
 * DOM-owned layout for the canvas. Scenes never hard-code positions: they read
 * the rectangles of empty, aria-hidden stage elements that CSS lays out, so
 * type and objects stay registered at every breakpoint.
 */

export type Rect = { left: number; top: number; width: number; height: number };

/** A tall scene block with a sticky frame; rects are frame-relative (px). */
type Held = {
  blockTop: number;
  blockBottom: number;
  frameHeight: number;
};

export type Anchors = {
  /** Hero stage, document coordinates (px). */
  hero: { x: number; bottom: number; width: number };
  rankle: (Held & { stage: Rect; you: Rect; friend: Rect }) | null;
  plannr:
    (Held & { page: Rect; pageEnd: Rect; review: Rect; calendar: Rect }) | null;
};

/** Viewport top of a scene's sticky frame at a given scroll position. */
export function frameTop(held: Held, scrollY: number) {
  return Math.min(
    Math.max(held.blockTop - scrollY, 0),
    held.blockBottom - scrollY - held.frameHeight,
  );
}

function relative(element: Element, frame: DOMRect): Rect {
  const r = element.getBoundingClientRect();
  return {
    left: r.left - frame.left,
    top: r.top - frame.top,
    width: r.width,
    height: r.height,
  };
}

function measureHeld(block: Element) {
  const frame = block.querySelector("[data-sticky]");
  if (!frame) return null;
  const b = block.getBoundingClientRect();
  const f = frame.getBoundingClientRect();
  return {
    held: {
      blockTop: b.top + window.scrollY,
      blockBottom: b.bottom + window.scrollY,
      frameHeight: f.height,
    },
    rect: (selector: string) => {
      const element = block.querySelector(selector);
      return element ? relative(element, f) : null;
    },
  };
}

export function useAnchors() {
  const anchors = useRef<Anchors | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const hero = document.querySelector('[data-scene-anchor="hero"]');
    const rankleBlock = document.querySelector('[data-scene="rankle"]');
    const plannrBlock = document.querySelector('[data-scene="plannr"]');
    if (!hero) return;

    const measure = () => {
      const h = hero.getBoundingClientRect();

      let rankle: Anchors["rankle"] = null;
      const rm = rankleBlock && measureHeld(rankleBlock);
      if (rm) {
        const stage = rm.rect('[data-scene-anchor="rankle"]');
        const you = rm.rect('[data-rankle-board="you"]');
        const friend = rm.rect('[data-rankle-board="friend"]');
        if (stage && you && friend) rankle = { ...rm.held, stage, you, friend };
      }

      let plannr: Anchors["plannr"] = null;
      const pm = plannrBlock && measureHeld(plannrBlock);
      if (pm) {
        const page = pm.rect('[data-plannr-zone="page"]');
        const pageEnd = pm.rect('[data-plannr-zone="page-end"]');
        const review = pm.rect('[data-plannr-zone="review"]');
        const calendar = pm.rect('[data-plannr-zone="calendar"]');
        if (page && pageEnd && review && calendar) {
          plannr = { ...pm.held, page, pageEnd, review, calendar };
        }
      }

      anchors.current = {
        hero: {
          x: h.left + h.width / 2,
          bottom: h.bottom + window.scrollY,
          width: h.width,
        },
        rankle,
        plannr,
      };
      invalidate();
    };

    measure();
    const observer = new ResizeObserver(measure);
    const observed = [
      // Chapters move when type above them resizes (fonts, measured units).
      document.querySelector("main"),
      hero,
      rankleBlock,
      rankleBlock?.querySelector('[data-scene-anchor="rankle"]'),
      plannrBlock,
      plannrBlock?.querySelector('[data-scene-anchor="plannr"]'),
    ];
    for (const element of observed) {
      if (element) observer.observe(element);
    }
    // Scene poses depend on raw scroll position as well as progress.
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [invalidate]);

  return anchors;
}
