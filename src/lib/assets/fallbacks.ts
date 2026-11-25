/*
 * Static scene renders, captured from the live WebGL scenes at their
 * canonical poses (hero at rest, Rankle comparison hold, Plannr calendar
 * hold) on a transparent background. `inset` is how far each image extends
 * past its stage, as [top, right, bottom, left] fractions of the stage.
 * Regenerate when a scene's canonical composition changes.
 */

type Fallback = {
  src: string;
  width: number;
  height: number;
  inset: readonly [number, number, number, number];
};

export const fallbacks = {
  hero: {
    desktop: {
      src: "/fallbacks/hero-desktop.webp",
      width: 953,
      height: 459,
      inset: [-0.4051, 0.0778, -0.0406, 0.0732],
    },
    mobile: {
      src: "/fallbacks/hero-mobile.webp",
      width: 557,
      height: 273,
      inset: [-0.4794, -0.0003, -0.0303, 0.0007],
    },
  },
  rankle: {
    desktop: {
      src: "/fallbacks/rankle-desktop.webp",
      width: 1293,
      height: 1120,
      inset: [-0.1172, 0.005, -0.0078, -0.0328],
    },
    mobile: {
      src: "/fallbacks/rankle-mobile.webp",
      width: 673,
      height: 861,
      inset: [-0.1442, 0.0001, -0.0099, -0.0573],
    },
  },
  plannr: {
    desktop: {
      src: "/fallbacks/plannr-desktop.webp",
      width: 1306,
      height: 834,
      inset: [0.018, 0.0057, -0.2515, -0.0237],
    },
    mobile: {
      src: "/fallbacks/plannr-mobile.webp",
      width: 713,
      height: 981,
      inset: [0.02, 0.0008, 0.0124, -0.002],
    },
  },
} as const satisfies Record<string, { desktop: Fallback; mobile: Fallback }>;

export type FallbackScene = keyof typeof fallbacks;
