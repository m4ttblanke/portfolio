"use client";

import {
  Component,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useStaticPresentation } from "@/lib/motion/use-static-presentation";
import styles from "./JourneyCanvas.module.css";

const JourneyScene = dynamic(() => import("./JourneyScene"), { ssr: false });

let webglSupport: boolean | undefined;

/** Whether a WebGL context can be created (checked once, then released). */
function supportsWebGL() {
  if (webglSupport === undefined) {
    try {
      const gl =
        document.createElement("canvas").getContext("webgl2") ??
        document.createElement("canvas").getContext("webgl");
      webglSupport = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const noSubscription = () => () => {};

/** False during server render; the canvas mounts only on capable clients. */
function useWebGLSupport() {
  return useSyncExternalStore(noSubscription, supportsWebGL, () => false);
}

/*
 * `<html data-webgl>` states:
 * - absent: pending (or reduced motion, where the canvas never mounts)
 * - "live": the scene has rendered its first usable frame; static fallbacks
 *   may hide only now
 * - "off": WebGL is unavailable or the scene failed; static fallbacks stay
 *   and choreography-only runways collapse (see the chapter styles)
 *
 * A lost context is not "off": browsers lose contexts transiently (GPU
 * process restarts, sleep, memory pressure, too many contexts) and restore
 * them. While lost the state returns to pending, so the fallbacks show in
 * place without the layout jumping; when the context is restored the scene
 * rebuilds and goes live again after its next frame (JourneyScene).
 */
function setWebGL(state: "live" | "off" | null) {
  const root = document.documentElement;
  if (state) root.dataset.webgl = state;
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
    setWebGL("off");
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The single persistent, decorative WebGL layer for the journey. Not mounted
 * under static presentation (reduced motion or a compact viewport: those get
 * the static compositions) or where
 * WebGL is unavailable — which also skips downloading the 3D runtime.
 */
export function JourneyCanvas() {
  const staticPresentation = useStaticPresentation();
  const webgl = useWebGLSupport();
  const enabled = webgl && !staticPresentation;
  const onReady = useCallback(() => setWebGL("live"), []);
  const onLost = useCallback(() => setWebGL(null), []);

  // Checked directly (not via the hook) so the hydration render, which
  // reports no support, never marks WebGL off.
  useEffect(() => {
    if (!supportsWebGL()) setWebGL("off");
  }, []);

  // Leaving the enabled state (reduced motion, compact) returns to pending.
  useEffect(() => {
    if (!enabled) return;
    return () => setWebGL(null);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className={styles.layer}>
      <CanvasErrorBoundary>
        <JourneyScene onReady={onReady} onLost={onLost} />
      </CanvasErrorBoundary>
    </div>
  );
}
