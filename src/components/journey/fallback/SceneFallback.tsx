import type { CSSProperties } from "react";
import { fallbacks, type FallbackScene } from "@/lib/assets/fallbacks";
import styles from "./SceneFallback.module.css";

/**
 * A static render of a scene's canonical composition, captured from the real
 * WebGL scene. Shown for reduced motion, no WebGL and scene failure; hidden
 * only once the live scene has rendered (`html[data-webgl="live"]`). It sits
 * in its stage at the same place the canvas draws, extending past the stage
 * by the measured insets.
 */
export function SceneFallback({
  scene,
  priority = false,
}: {
  scene: FallbackScene;
  priority?: boolean;
}) {
  const { desktop, mobile } = fallbacks[scene];
  const style = {
    "--d-inset": inset(desktop.inset),
    "--m-inset": inset(mobile.inset),
  } as CSSProperties;
  return (
    <picture className={styles.fallback} style={style}>
      <source
        media="(max-width: 40rem)"
        srcSet={mobile.src}
        width={mobile.width}
        height={mobile.height}
      />
      {/* Art-directed per breakpoint, so <picture>; decorative, so alt="". */}
      <img
        className={styles.image}
        src={desktop.src}
        width={desktop.width}
        height={desktop.height}
        alt=""
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}

/** [top, right, bottom, left] fractions of the stage → a CSS inset value. */
function inset([top, right, bottom, left]: readonly number[]) {
  const pct = (fraction: number) => `${(-fraction * 100).toFixed(2)}%`;
  return [top, right, bottom, left].map(pct).join(" ");
}
