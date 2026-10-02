import { personal } from "@/content/personal";
import { ChapterLabel } from "../ChapterLabel";
import styles from "./OffClockChapter.module.css";

/**
 * 05 — Off the Clock. Gate 0 skeleton: the three subjects and their approved
 * facts. Photographs of Matthew's own objects arrive in Gate 4.
 */
export function OffClockChapter() {
  return (
    <section
      id="off-clock"
      aria-labelledby="off-clock-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="off-clock" />
      <ul className={styles.objects}>
        {personal.map((object) => (
          <li key={object.id}>
            <h3 className={styles.label}>{object.label}</h3>
            {"fact" in object && <p>{object.fact}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
