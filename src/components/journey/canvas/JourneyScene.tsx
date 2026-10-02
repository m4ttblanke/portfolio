import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { NeutralToneMapping, PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { registerInvalidate } from "@/lib/motion/scene-progress";
import { PlannrScene } from "../scenes/plannr/PlannrScene";
import { RankleScene } from "../scenes/rankle/RankleScene";
import { useAnchors } from "./anchors";
import { Kit } from "./Kit";

/** Image-based light generated locally once; no network request. */
function Environment() {
  const get = useThree((state) => state.get);

  useEffect(() => {
    const { gl, scene, invalidate } = get();
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.85;
    invalidate();
    return () => {
      scene.environment = null;
      target.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [get]);

  return null;
}

/** Lets DOM motion wake the demand-driven render loop. */
function InvalidateBridge() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => registerInvalidate(invalidate), [invalidate]);
  return null;
}

/** Scenes share one reading of the DOM stage anchors. */
function Scenes({ onReady }: { onReady: () => void }) {
  const anchors = useAnchors();
  return (
    <>
      <Kit anchors={anchors} onFirstFrame={onReady} />
      <RankleScene anchors={anchors} />
      <PlannrScene anchors={anchors} />
    </>
  );
}

/**
 * The only module that imports three / R3F. Loaded client-side on demand by
 * JourneyCanvas so the 3D runtime stays out of the initial server render.
 */
export default function JourneyScene({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      // R3F sets pointer-events: auto on its wrapper; the canvas is decorative
      // and must never intercept page interaction.
      style={{ pointerEvents: "none" }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 30, position: [0, 0, 10] }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
      }}
      // Render only when scroll, pointer, resize, or damping asks for a frame.
      frameloop="demand"
    >
      <InvalidateBridge />
      <Environment />
      <directionalLight position={[-4, 6, 8]} intensity={1.4} />
      <Scenes onReady={onReady} />
    </Canvas>
  );
}
