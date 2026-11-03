"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { chapters, type ChapterId } from "@/content/navigation";
import {
  cancelTravel,
  focusDestination,
  settleInitialHash,
  travelTo,
} from "@/lib/motion/travel";
import styles from "./ChapterNavigator.module.css";

const LIST_ID = "chapter-index";
const HOVER_CLOSE_DELAY = 250;

/*
 * Pause on another chapter before its rail replaces the open one, so a
 * pointer crossing a row on its way into the open rail never switches it.
 */
const SWITCH_DWELL = 100;

/*
 * Where subsections hang on a rail beside their chapter (hover or keyboard
 * focus reveals them). Elsewhere (touch, narrow, compact) each chapter has a
 * disclosure button and its subsections open inline. Mirrors the CSS.
 */
const RAIL = "(hover: hover) and (pointer: fine) and (min-width: 48rem)";

/* Below the field breakpoint, "stacked" chapters' subjects stand apart. */
const STACKED = "(max-width: 60rem)";

const midline = { rootMargin: "-49% 0px -50% 0px" };

/*
 * Subsections are tracked higher up, where the navigator lands them (near
 * the top, at most a quarter of the way down): a band at the midline would
 * already be in the next entry when one is short.
 */
const upperBand = { rootMargin: "-30% 0px -69% 0px" };

const sectionsId = (id: string) => `${id}-sections`;

/**
 * Compact corner index with subsections. Real hash links are always in the
 * DOM; without JS the whole tree renders expanded. With JS it collapses to
 * the current number and opens on hover (fine pointers), keyboard focus, or
 * tap. Activating a destination travels to it (lib/motion/travel.ts) and
 * focuses it on arrival.
 */
export function ChapterNavigator() {
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const switchTimer = useRef<number | undefined>(undefined);
  /* Set while the navigator moves focus to its own toggle for a trip. */
  const parking = useRef(false);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [activeId, setActiveId] = useState<ChapterId>("name");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ChapterId | null>(null);

  const active = chapters.find((chapter) => chapter.id === activeId)!;

  function show() {
    window.clearTimeout(closeTimer.current);
    if (!open) setExpanded(activeId);
    setOpen(true);
  }

  function close() {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(switchTimer.current);
    setOpen(false);
    setPinned(false);
  }

  function railMode() {
    return window.matchMedia(RAIL).matches;
  }

  /*
   * A deliberate activation: unmodified primary clicks (and Enter) travel;
   * anything else (new tab, new window, download) stays native.
   */
  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
    close();
    // While travelling, focus rests on the navigator's own toggle (the link
    // is about to hide); it moves to the destination only on arrival.
    parking.current = true;
    toggleRef.current?.focus({ preventScroll: true });
    parking.current = false;
    travelTo(target, { onArrive: () => focusDestination(target) });
  }

  // Active chapter: whichever section crosses a thin band at the viewport
  // midline (a zero-height band never reports an intersection).
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveId(entry.target.id as ChapterId);
      }
    }, midline);
    for (const chapter of chapters) {
      const section = document.getElementById(chapter.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // Active subsection, on its own band, only where subsections stand apart
  // at the current size. Shared compositions are never given a current one.
  useEffect(() => {
    const stacked = window.matchMedia(STACKED);
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      setActiveSection(null);
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) setActiveSection(id);
          else setActiveSection((current) => (current === id ? null : current));
        }
      }, upperBand);
      for (const chapter of chapters) {
        const tracked =
          chapter.tracking === "always" ||
          (chapter.tracking === "stacked" && stacked.matches);
        if (!tracked) continue;
        for (const section of chapter.sections) {
          const element = document.getElementById(section.id);
          if (element) observer.observe(element);
        }
      }
    };
    observe();
    stacked.addEventListener("change", observe);
    return () => {
      stacked.removeEventListener("change", observe);
      observer?.disconnect();
    };
  }, []);

  // Back/Forward restore the browser's own position, instantly: a trip in
  // progress gives way to it and nothing travels.
  useEffect(() => {
    window.addEventListener("popstate", cancelTravel);
    const unsettle = settleInitialHash();
    return () => {
      window.removeEventListener("popstate", cancelTravel);
      unsettle();
    };
  }, []);

  // While open: Escape steps out (subsection → its chapter → closed) and
  // outside presses close.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const focused = document.activeElement as HTMLElement | null;
      const parent = focused?.closest<HTMLElement>("[data-sections]");
      if (parent) {
        parent.parentElement
          ?.querySelector<HTMLElement>("[data-chapter-link]")
          ?.focus();
        return;
      }
      const focusInside = navRef.current?.contains(focused);
      close();
      if (focusInside) toggleRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(switchTimer.current);
    },
    [],
  );

  // Rail: entering a chapter row (or its rail) shows its subsections; a
  // switch away from the open rail waits out the dwell.
  function onRowEnter(id: ChapterId, pointerType: string) {
    if (pointerType !== "mouse" || !railMode()) return;
    window.clearTimeout(switchTimer.current);
    if (id === expanded) return;
    switchTimer.current = window.setTimeout(
      () => setExpanded(id),
      expanded ? SWITCH_DWELL : 0,
    );
  }

  // Rail: keyboard focus in a chapter or its subsections shows that rail.
  function onRowFocus(id: ChapterId) {
    if (!railMode()) return;
    window.clearTimeout(switchTimer.current);
    setExpanded(id);
  }

  return (
    <nav
      ref={navRef}
      aria-label="Chapters"
      className={styles.nav}
      data-open={open || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        show();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse" || pinned) return;
        window.clearTimeout(switchTimer.current);
        closeTimer.current = window.setTimeout(
          () => setOpen(false),
          HOVER_CLOSE_DELAY,
        );
      }}
      onFocus={(event: FocusEvent<HTMLElement>) => {
        // Keyboard focus arriving from outside opens the index (never the
        // navigator parking focus on its toggle for a trip).
        if (parking.current) return;
        const fromOutside = !navRef.current?.contains(
          event.relatedTarget as Node | null,
        );
        if (fromOutside && event.target.matches(":focus-visible")) show();
      }}
      onBlur={(event) => {
        if (!navRef.current?.contains(event.relatedTarget as Node | null)) {
          close();
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={LIST_ID}
        onClick={() => {
          if (open) {
            close();
          } else {
            show();
            setPinned(true);
          }
        }}
      >
        <span className="visually-hidden">
          Chapters, current: {active.label}
        </span>
        <span aria-hidden="true" className={styles.current}>
          {active.number}
        </span>
        <span aria-hidden="true" className={styles.ticks}>
          {chapters.map((chapter) => (
            <span
              key={chapter.id}
              className={styles.tick}
              data-active={chapter.id === activeId || undefined}
            />
          ))}
        </span>
      </button>

      <ol id={LIST_ID} className={styles.list}>
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeId;
          const isExpanded = expanded === chapter.id;
          const hasSections = chapter.sections.length > 0;
          return (
            <li
              key={chapter.id}
              className={styles.item}
              data-expanded={(hasSections && isExpanded) || undefined}
              onPointerEnter={(event) =>
                onRowEnter(chapter.id, event.pointerType)
              }
              onFocus={() => onRowFocus(chapter.id)}
            >
              <div className={styles.row}>
                <a
                  href={chapter.href}
                  className={styles.link}
                  aria-current={isActive ? "location" : undefined}
                  data-chapter-link
                  onClick={(event) => navigate(event, chapter.href)}
                >
                  <span aria-hidden="true" className={styles.number}>
                    {chapter.number}
                  </span>
                  <span className={styles.label}>{chapter.label}</span>
                </a>
                {hasSections && (
                  <button
                    type="button"
                    className={styles.disclosure}
                    aria-expanded={isExpanded}
                    aria-controls={sectionsId(chapter.id)}
                    onClick={() => setExpanded(isExpanded ? null : chapter.id)}
                  >
                    <span className="visually-hidden">
                      {chapter.label} sections
                    </span>
                    <span aria-hidden="true" className={styles.branch} />
                  </button>
                )}
              </div>

              {hasSections && (
                <ol
                  id={sectionsId(chapter.id)}
                  className={styles.sections}
                  aria-label={`${chapter.label} sections`}
                  data-sections
                >
                  {chapter.sections.map((section, index) => (
                    <li
                      key={section.id}
                      style={{ "--i": index } as CSSProperties}
                    >
                      <a
                        href={section.href}
                        className={styles.section}
                        aria-current={
                          isActive && activeSection === section.id
                            ? "location"
                            : undefined
                        }
                        onClick={(event) => navigate(event, section.href)}
                      >
                        <span aria-hidden="true" className={styles.number}>
                          {chapter.number}.{index + 1}
                        </span>
                        <span className={styles.label}>{section.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
