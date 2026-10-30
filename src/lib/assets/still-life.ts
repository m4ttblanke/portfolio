/*
 * Off the Clock still life: generated reference images (not photographs of
 * Matthew's own objects), flattened onto white and multiplied onto the page
 * bone so their original soft shadows survive. See docs/ASSETS.md for the
 * processing recipe. Each is served as AVIF with a WebP fallback at the
 * listed widths; `width`/`height` are the master's, for the aspect ratio.
 */

type StillLifeImage = {
  readonly base: string;
  readonly width: number;
  readonly height: number;
  readonly widths: readonly number[];
};

const WIDTHS = [360, 540, 720, 960, 1200] as const;

export const stillLife = {
  baseball: {
    base: "/off-clock/baseball",
    width: 1232,
    height: 1412,
    widths: WIDTHS,
  },
  vinyl: {
    base: "/off-clock/vinyl",
    width: 1355,
    height: 1395,
    widths: WIDTHS,
  },
  games: {
    base: "/off-clock/games",
    width: 1225,
    height: 1197,
    widths: WIDTHS,
  },
} as const satisfies Record<string, StillLifeImage>;

export type StillLifeId = keyof typeof stillLife;

/** `srcset` for one format, optionally capped at a width. */
export const srcSet = (
  image: StillLifeImage,
  format: "avif" | "webp",
  max = Infinity,
) =>
  image.widths
    .filter((w) => w <= max)
    .map((w) => `${image.base}-${w}.${format} ${w}w`)
    .join(", ");
