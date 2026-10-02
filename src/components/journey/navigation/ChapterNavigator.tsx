"use client";

import { useEffect, useRef, useState } from "react";
import { chapters, type ChapterId } from "@/content/navigation";
import styles from "./ChapterNavigator.module.css";

const LIST_ID = "chapter-index";
const HOVER_CLOSE_DELAY = 250;

/**
 * Compact corner index. Real hash links are always in the DOM; without JS the
 * list renders expanded. With JS it collapses to the current number and opens
 * on hover (fine pointers), keyboard focus, or tap.
 */
export function ChapterNavigator() {
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [activeId, setActiveId] = useState<ChapterId>("name");

  const active = chapters.find((chapter) => chapter.id === activeId)!;

  function close() {
    window.clearTimeout(closeTimer.current);
    setOpen(false);
    setPinned(false);
  }

  // Active chapter: whichever section crosses a thin band at the viewport
  // midline (a zero-height band never reports an intersection).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id as ChapterId);
        }
      },
      { rootMargin: "-49% 0px -50% 0px" },
    );
    for (const chapter of chapters) {
      const section = document.getElementById(chapter.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  // While open: Escape and outside presses close.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const focusInside = navRef.current?.contains(document.activeElement);
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

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <nav
      ref={navRef}
      aria-label="Chapters"
      className={styles.nav}
      data-open={open || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        window.clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse" || pinned) return;
        closeTimer.current = window.setTimeout(
          () => setOpen(false),
          HOVER_CLOSE_DELAY,
        );
      }}
      onFocus={(event) => {
        // Keyboard focus arriving from outside opens the index.
        const fromOutside = !navRef.current?.contains(
          event.relatedTarget as Node | null,
        );
        if (fromOutside && event.target.matches(":focus-visible")) {
          setOpen(true);
        }
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
            setOpen(true);
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
          return (
            <li key={chapter.id}>
              <a
                href={chapter.href}
                className={styles.link}
                aria-current={isActive ? "location" : undefined}
                onClick={close}
              >
                <span aria-hidden="true" className={styles.number}>
                  {chapter.number}
                </span>
                <span className={styles.label}>{chapter.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
