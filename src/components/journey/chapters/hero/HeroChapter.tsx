import { Fragment } from "react";
import { contactLinks, type ContactLink } from "@/content/contact";
import { profile } from "@/content/profile";
import { SceneFallback } from "../../fallback/SceneFallback";
import { HeroMotion } from "./HeroMotion";
import styles from "./HeroChapter.module.css";

/*
 * The hero's contact rail: the Contact chapter's own links (one source for
 * every URL), labels only. Email stays in this tab; the others open a new
 * one. Hidden hints name each destination for assistive technology.
 */
const rail = contactLinks.map((link: ContactLink) => {
  const newTab = link.id !== "email";
  const hint =
    link.id === "email"
      ? link.value
      : (link.srHint ?? (newTab ? "(opens in a new tab)" : ""));
  return { link, newTab, hint };
});

/**
 * 01 — Name. Server-rendered identity composition. The context group (school
 * line and contact rail) follows the name in reading order but sits in the
 * empty field above it, a caption to the name.
 */
export function HeroChapter() {
  return (
    <section id="name" aria-labelledby="name-heading" className={styles.hero}>
      <p className={styles.descriptor}>
        {profile.descriptor.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      {/* Stage for the identity relief, rendered by the persistent canvas. */}
      <div
        aria-hidden="true"
        className={styles.object}
        data-scene-anchor="hero"
      >
        <SceneFallback scene="hero" priority />
      </div>

      <h1 id="name-heading" className={styles.name}>
        <span className={styles.first} data-name-line="first">
          {profile.firstName}
        </span>{" "}
        <span className={styles.last} data-name-line="last">
          {profile.lastName}
        </span>
      </h1>

      <div className={styles.context}>
        <p className={styles.contextLine}>
          {profile.context.map((part, index) => (
            <Fragment key={part}>
              {index > 0 && (
                <>
                  {/* The first separator becomes a line break on phones. */}
                  <span
                    aria-hidden="true"
                    className={styles.separator}
                    data-break={index === 1 || undefined}
                  >
                    {" · "}
                  </span>
                  <span className="visually-hidden">, </span>
                </>
              )}
              <span className={styles.part}>{part}</span>
            </Fragment>
          ))}
        </p>
        {/* Immediate access; the Contact chapter stays the full ending. */}
        <ul className={styles.rail} aria-label="Contact">
          {rail.map(({ link, newTab, hint }, index) => (
            <li key={link.id} className={styles.railItem}>
              {index > 0 && (
                <span aria-hidden="true" className={styles.railSeparator}>
                  ·
                </span>
              )}
              <a
                className={styles.railLink}
                href={link.href}
                {...(newTab && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
              >
                {link.label}
                {link.id === "resume" && (
                  <span aria-hidden="true" className={styles.railArrow}>
                    ↗
                  </span>
                )}
                <span className="visually-hidden"> {hint}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <HeroMotion />
    </section>
  );
}
