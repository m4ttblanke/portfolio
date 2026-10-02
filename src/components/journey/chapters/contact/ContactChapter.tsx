import { contactLinks, resume } from "@/content/contact";
import { ChapterLabel } from "../ChapterLabel";
import styles from "./ContactChapter.module.css";

/**
 * 06 — Contact. Gate 0 skeleton: the canonical links. The closing line and
 * the bookend composition arrive in Gate 3; the résumé link appears only once
 * a corrected PDF exists.
 */
export function ContactChapter() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={styles.chapter}
    >
      <ChapterLabel id="contact" />
      <ul className={styles.links}>
        {contactLinks.map((link) => (
          <li key={link.id}>
            <a className={styles.link} href={link.href}>
              <span className={styles.name}>{link.label}</span>{" "}
              <span>{link.value}</span>
              {link.id !== "email" && <span aria-hidden="true">↗</span>}
            </a>
          </li>
        ))}
        {resume && (
          <li>
            <a className={styles.link} href={resume.href}>
              <span className={styles.name}>Résumé</span> <span>PDF</span>
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
