import { fallbacks } from "@/lib/assets/fallbacks";
import { closingLine, contactLinks, type ContactLink } from "@/content/contact";
import { ChapterLabel } from "../ChapterLabel";
import { ContactMotion } from "./ContactMotion";
import styles from "./ContactChapter.module.css";

const email = contactLinks.find((link) => link.id === "email")!;
const { desktop, mobile } = fallbacks.hero;

/**
 * 06 — Contact. A still bookend to the hero: the links where the hero's
 * descriptor sits, and monumental type anchored to the bottom. The MB relief
 * returns at rest, standing on the closing line like its last glyph (the
 * hero's own static render, so it costs nothing to load). The closing line is
 * the email link, and its rule is the last mark on the page. Nothing moves
 * on its own: the visitor moves it. Rows answer hover and focus; the closing
 * line stretches, its rule runs out to the margin and the MB replies (CSS).
 * On fine pointers the nearest row and the closing line begin to answer as
 * the pointer approaches (ContactMotion). No canvas.
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
          {contactLinks.map((link: ContactLink) => (
            <li key={link.id}>
              <a
                id={`contact-${link.id}`}
                className={styles.link}
                href={link.href}
                {...(link.newTab && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                <span className={styles.name}>
                  <span>{link.label}</span>
                  {/* The engaged row's tie, from the label to its value. */}
                  <span aria-hidden="true" className={styles.tie} />
                </span>{" "}
                <span className={styles.value}>
                  {link.value}
                  {link.id !== "email" && (
                    <>
                      {" "}
                      <span aria-hidden="true" className={styles.arrow}>
                        ↗
                      </span>
                    </>
                  )}
                </span>
                {link.srHint && (
                  <span className="visually-hidden"> {link.srHint}</span>
                )}
              </a>
            </li>
          ))}
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
      <ContactMotion />
    </section>
  );
}
