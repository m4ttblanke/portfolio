"use client";

import { Component, useCallback, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/lib/motion/reduced-motion";
import styles from "./JourneyCanvas.module.css";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

/*
 * `<html data-webgl="live">` means the scene has rendered its first usable
 * frame. Static presentations may hide only while it is set; any failure
 * removes it so they return.
 */
function setLive(live: boolean) {
  const root = document.documentElement;
  if (live) root.dataset.webgl = "live";
  else delete root.dataset.webgl;
}

/**
 * Contains any canvas failure (no WebGL, scene error, chunk load failure)
 * so the server-rendered DOM journey is never replaced by an error page.
 */
class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    setLive(false);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The single persistent, decorative WebGL layer for the journey. Not mounted
 * under reduced motion: those visitors get the static compositions.
 */
export function JourneyCanvas() {
  const reducedMotion = useReducedMotion();
  const onReady = useCallback(() => setLive(true), []);

  useEffect(() => {
    if (reducedMotion) return;
    // A lost context leaves a blank canvas; fall back to static presentation.
    const onLost = (event: Event) => {
      if ((event.target as Element).tagName === "CANVAS") setLive(false);
    };
    document.addEventListener("webglcontextlost", onLost, true);
    return () => {
      document.removeEventListener("webglcontextlost", onLost, true);
      setLive(false);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className={styles.layer}>
      <CanvasErrorBoundary>
        <JourneyScene onReady={onReady} />
      </CanvasErrorBoundary>
    </div>
  );
}
