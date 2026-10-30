import { personal } from "@/content/personal";
import { srcSet, stillLife, type StillLifeId } from "@/lib/assets/still-life";
import { ChapterLabel } from "../ChapterLabel";
import { OffClockMotion } from "./OffClockMotion";
import styles from "./OffClockChapter.module.css";

/*
 * Rendered width of each image, per composition (see the CSS): desktop sizes
 * are fractions of the content width, mobile ones of the phone's width.
 * Phones get their own sources capped at 960px (2× density is plenty for a
 * still life), so a 3× phone never fetches the 1200px desktop file.
 */
const MOBILE = "(max-width: 60rem)";
const MOBILE_MAX = 960;

const sizes: Record<StillLifeId, { mobile: string; desktop: string }> = {
  baseball: { mobile: "60vw", desktop: "28vw" },
  vinyl: { mobile: "104vw", desktop: "36vw" },
  games: { mobile: "45vw", desktop: "18vw" },
};

/**
 * 05 — Off the Clock. A typeset still life: each subject's display word, and
 * its object in the space the word leaves, in a Z (glove upper right, record
 * middle left, controller lower right) at roughly real relative scale. The
 * images are generated references, decorative beside the words that name
 * them. On desktop the objects drift at different rates as the chapter
 * scrolls (OffClockMotion); the words never move.
 */
export function OffClockChapter() {
  return (
    <section
      id="off-clock"
      aria-labelledby="off-clock-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="off-clock" />
      {/* Display echo of the chapter label, which is the heading. */}
      <p aria-hidden="true" className={styles.title}>
        Off the Clock
      </p>

      <ul className={styles.stillLife}>
        {personal.map((subject, index) => {
          const image = stillLife[subject.id];
          return (
            <li
              key={subject.id}
              className={styles.subject}
              data-subject={subject.id}
            >
              <div className={styles.caption}>
                <h3 className={styles.word}>
                  <span aria-hidden="true" className={styles.index}>
                    {String(index + 1).padStart(2, "0")} —
                  </span>{" "}
                  {subject.label}
                </h3>
                <p className={styles.fact}>{subject.fact}</p>
              </div>
              <picture className={styles.object} data-off-clock-object>
                <source
                  media={MOBILE}
                  type="image/avif"
                  srcSet={srcSet(image, "avif", MOBILE_MAX)}
                  sizes={sizes[subject.id].mobile}
                />
                <source
                  media={MOBILE}
                  type="image/webp"
                  srcSet={srcSet(image, "webp", MOBILE_MAX)}
                  sizes={sizes[subject.id].mobile}
                />
                <source
                  type="image/avif"
                  srcSet={srcSet(image, "avif")}
                  sizes={sizes[subject.id].desktop}
                />
                <img
                  src={`${image.base}-720.webp`}
                  srcSet={srcSet(image, "webp")}
                  sizes={sizes[subject.id].desktop}
                  width={image.width}
                  height={image.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </li>
          );
        })}
      </ul>
      <OffClockMotion />
    </section>
  );
}
