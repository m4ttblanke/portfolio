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

/**
 * Whether any P1 scene can be on screen. Every scene group hides once
 * Plannr's frame has scrolled out above the viewport (Kit, RankleScene and
 * PlannrScene all test `frameTop(plannr) > -frameHeight`, which holds exactly
 * while `scrollY < blockBottom`). Past that point (Experience to Contact) a
 * frame would only clear an empty canvas, so scroll and pointer input stop
 * invalidating there. Unknown layout counts as in view.
 */
export function sceneInView(anchors: Anchors | null, scrollY: number) {
  const plannr = anchors?.plannr;
  return !plannr || scrollY < plannr.blockBottom;
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

    // Scene poses depend on raw scroll position and on layout. Past the P1
    // scenes nothing can draw, so a scroll or a layout change there wakes the
    // loop only once more, on the way out (that frame hides the last pose),
    // then not at all until a scene can be in view again. Starting true, the
    // first measure always draws one frame, wherever the page loads.
    let wasInView = true;
    const wake = () => {
      const inView = sceneInView(anchors.current, window.scrollY);
      if (inView || wasInView) invalidate();
      wasInView = inView;
    };

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
      // Layout below the scenes also changes past them (a lazy image
      // settling in Off the Clock); that must not wake the loop either.
      wake();
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
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", wake);
    };
  }, [invalidate]);

  return anchors;
}
