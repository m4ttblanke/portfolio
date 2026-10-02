import { chapters } from "@/content/navigation";
import styles from "./ChapterNavigator.module.css";

/**
 * P0 foundation: static semantic chapter index with real hash links.
 * Compact/expanded states and active-chapter tracking arrive in P1.
 */
export function ChapterNavigator() {
  return (
    <nav aria-label="Chapters" className={styles.nav}>
      <ol className={styles.list}>
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a href={chapter.href} className={styles.link}>
              <span aria-hidden="true" className={styles.number}>
                {chapter.number}
              </span>
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
