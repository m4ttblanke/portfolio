import { Canvas } from "@react-three/fiber";
import { CalibrationObject } from "./CalibrationObject";

/**
 * The only module that imports three / R3F. Loaded client-side on demand by
 * JourneyCanvas so the 3D runtime stays out of the initial server render.
 */
export default function JourneyScene() {
  return (
    <Canvas
      // R3F sets pointer-events: auto on its wrapper; the canvas is decorative
      // during P0 and must never intercept page interaction.
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 35, position: [0, 0, 6] }}
      // Static scene: render only on mount, resize, or explicit invalidation.
      frameloop="demand"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <CalibrationObject />
    </Canvas>
  );
}
