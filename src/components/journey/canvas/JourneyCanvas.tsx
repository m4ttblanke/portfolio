"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import styles from "./JourneyCanvas.module.css";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

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

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The single persistent, decorative WebGL layer for the journey. */
export function JourneyCanvas() {
  return (
    <div aria-hidden="true" className={styles.layer}>
      <CanvasErrorBoundary>
        <JourneyScene />
      </CanvasErrorBoundary>
    </div>
  );
}
