import { useLayoutEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

/*
 * DOM-owned layout for the canvas. Scenes never hard-code positions: they read
 * the rectangles of empty, aria-hidden stage elements that CSS lays out, so
 * type and objects stay registered at every breakpoint.
 */

export type Rect = { left: number; top: number; width: number; height: number };

export type Anchors = {
  /** Hero stage, document coordinates (px). */
  hero: { x: number; bottom: number; width: number };
  rankle: {
    /** The tall block, document coordinates (px). */
    blockTop: number;
    blockBottom: number;
    /** Height of the sticky frame. */
    frameHeight: number;
    /** Rects relative to the sticky frame's top-left corner (px). */
    stage: Rect;
    you: Rect;
    friend: Rect;
  } | null;
};

/** Viewport top of the Rankle sticky frame at a given scroll position. */
export function rankleFrameTop(
  rankle: NonNullable<Anchors["rankle"]>,
  scrollY: number,
) {
  return Math.min(
    Math.max(rankle.blockTop - scrollY, 0),
    rankle.blockBottom - scrollY - rankle.frameHeight,
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

export function useAnchors() {
  const anchors = useRef<Anchors | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const hero = document.querySelector('[data-scene-anchor="hero"]');
    const block = document.querySelector('[data-scene="rankle"]');
    const frame = block?.querySelector("[data-sticky]");
    const stage = block?.querySelector('[data-scene-anchor="rankle"]');
    const you = block?.querySelector('[data-rankle-board="you"]');
    const friend = block?.querySelector('[data-rankle-board="friend"]');
    if (!hero) return;

    const measure = () => {
      const h = hero.getBoundingClientRect();
      let rankle: Anchors["rankle"] = null;
      if (block && frame && stage && you && friend) {
        const b = block.getBoundingClientRect();
        const f = frame.getBoundingClientRect();
        rankle = {
          blockTop: b.top + window.scrollY,
          blockBottom: b.bottom + window.scrollY,
          frameHeight: f.height,
          stage: relative(stage, f),
          you: relative(you, f),
          friend: relative(friend, f),
        };
      }
      anchors.current = {
        hero: {
          x: h.left + h.width / 2,
          bottom: h.bottom + window.scrollY,
          width: h.width,
        },
        rankle,
      };
      invalidate();
    };

    measure();
    const observer = new ResizeObserver(measure);
    for (const element of [hero, block, stage]) {
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
