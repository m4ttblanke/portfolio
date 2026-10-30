import { chapters, type ChapterId } from "@/content/navigation";
import styles from "./ChapterLabel.module.css";

/**
 * A chapter's `h2`: its number and name. The section labels itself with
 * `aria-labelledby={`${id}-heading`}`.
 */
export function ChapterLabel({ id }: { id: ChapterId }) {
  const chapter = chapters.find((entry) => entry.id === id)!;
  return (
    <h2 id={`${id}-heading`} className={styles.label}>
      <span aria-hidden="true" className={styles.number}>
        {chapter.number}
      </span>
      {chapter.label}
    </h2>
  );
}
