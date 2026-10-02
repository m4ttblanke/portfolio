import { fallbacks } from "@/lib/assets/fallbacks";
import { closingLine, contactLinks, resume } from "@/content/contact";
import { ChapterLabel } from "../ChapterLabel";
import styles from "./ContactChapter.module.css";

const email = contactLinks.find((link) => link.id === "email")!;
const { desktop, mobile } = fallbacks.hero;

/**
 * 06 — Contact. A still bookend to the hero: the links where the hero's
 * descriptor sits, and monumental type anchored to the bottom. The MB relief
 * returns at rest, standing on the closing line like its last glyph (the
 * hero's own static render, so it costs nothing to load). The closing line is
 * the email link. No motion, no canvas.
 */
export function ContactChapter() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className={styles.chapter}
    >
      <div className={styles.top}>
        <ChapterLabel id="contact" />
        <ul className={styles.links}>
          {contactLinks.map((link) => (
            <li key={link.id}>
              <a className={styles.link} href={link.href}>
                <span className={styles.name}>{link.label}</span>{" "}
                <span className={styles.value}>
                  {link.value}
                  {link.id !== "email" && <span aria-hidden="true"> ↗</span>}
                </span>
              </a>
            </li>
          ))}
          {resume && (
            <li>
              <a className={styles.link} href={resume.href}>
                <span className={styles.name}>Résumé</span>{" "}
                <span className={styles.value}>PDF</span>
              </a>
            </li>
          )}
        </ul>
      </div>

      <p className={styles.closing}>
        <a className={styles.closingLink} href={email.href}>
          <span className={styles.line}>
            {closingLine[0]}
            {/* Decorative: the link's text carries the meaning. */}
            <picture className={styles.mb}>
              <source
                media="(max-width: 40rem)"
                srcSet={mobile.src}
                width={mobile.width}
                height={mobile.height}
              />
              <img
                src={desktop.src}
                width={desktop.width}
                height={desktop.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </picture>
          </span>{" "}
          <span className={styles.line}>{closingLine[1]}</span>
          <span className="visually-hidden"> Email {email.value}</span>
        </a>
      </p>

      <p className={styles.colophon}>
        © {new Date().getFullYear()} Matthew Blanke
      </p>
    </section>
  );
}
