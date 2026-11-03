import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { NeutralToneMapping, PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { registerInvalidate } from "@/lib/motion/scene-progress";
import { PlannrScene } from "../scenes/plannr/PlannrScene";
import { RankleScene } from "../scenes/rankle/RankleScene";
import { useAnchors } from "./anchors";
import { Kit } from "./Kit";

/**
 * Image-based light generated locally; no network request. Regenerated when
 * the context is restored (`epoch`): its render target's contents are GPU
 * memory and do not survive a context loss.
 */
function Environment({ epoch }: { epoch: number }) {
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
  }, [get, epoch]);

  return null;
}

/**
 * Watches this canvas's own context (never other canvases on the page). A
 * loss sends the page back to its fallbacks; three.js keeps the context
 * restorable, and on restore the environment is rebuilt and one frame is
 * requested, after which the scene is live again.
 */
function ContextWatch({
  onLost,
  onRestored,
  onReady,
}: {
  onLost: () => void;
  onRestored: () => void;
  onReady: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const restoring = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = () => onLost();
    const restored = () => {
      restoring.current = true;
      onRestored();
      invalidate();
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [gl, invalidate, onLost, onRestored]);

  useFrame(() => {
    if (!restoring.current) return;
    restoring.current = false;
    // The frame being prepared now renders after this callback.
    requestAnimationFrame(onReady);
  });

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
export default function JourneyScene({
  onReady,
  onLost,
}: {
  onReady: () => void;
  onLost: () => void;
}) {
  const [epoch, setEpoch] = useState(0);
  const onRestored = useCallback(() => setEpoch((value) => value + 1), []);
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
      <ContextWatch onLost={onLost} onRestored={onRestored} onReady={onReady} />
      <Environment epoch={epoch} />
      <directionalLight position={[-4, 6, 8]} intensity={1.4} />
      <Scenes onReady={onReady} />
    </Canvas>
  );
}
