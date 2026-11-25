import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { advance, Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  NeutralToneMapping,
  PMREMGenerator,
  type Mesh,
  type Texture,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap } from "@/lib/motion/gsap";
import { requestFrame, takeFrameRequest } from "@/lib/motion/scene-progress";
import { PlannrScene } from "../scenes/plannr/PlannrScene";
import { RankleScene } from "../scenes/rankle/RankleScene";
import { sceneInView, useAnchors, type Anchors } from "./anchors";
import { Kit } from "./Kit";

/**
 * Image-based light generated locally; no network request. Regenerated when
 * the context is restored (`epoch`): its render target's contents are GPU
 * memory and do not survive a context loss.
 */
function Environment({ epoch }: { epoch: number }) {
  const get = useThree((state) => state.get);

  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.85;
    requestFrame();
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
  const restoring = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = () => onLost();
    const restored = () => {
      restoring.current = true;
      onRestored();
      requestFrame();
    };
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [gl, onLost, onRestored]);

  useFrame(() => {
    if (!restoring.current) return;
    restoring.current = false;
    // This frame renders right after this callback; report it on the next.
    requestAnimationFrame(onReady);
  });

  return null;
}

/**
 * Prepares every scene's GPU work up front. Rankle's and Plannr's objects
 * stay hidden until scrolled to, so without this their shader programs
 * compile, and their label textures upload, mid-scroll on the first pass —
 * a visible hitch as each scene arrives. `compileAsync` builds programs for
 * every material in the tree (visible or not) in parallel where the browser
 * supports it; textures are uploaded once here. Mounted after Environment
 * and the scenes, so their effects (the environment map, which is part of
 * each program) have run first. Repeated when the context is restored.
 */
function Prewarm({ epoch }: { epoch: number }) {
  const get = useThree((state) => state.get);

  useEffect(() => {
    const { gl, scene, camera } = get();
    const textures = new Set<Texture>();
    scene.traverse((object) => {
      const material = (object as Mesh).material;
      if (!material) return;
      for (const m of Array.isArray(material) ? material : [material]) {
        for (const value of Object.values(m)) {
          if ((value as Texture | null)?.isTexture) textures.add(value);
        }
      }
    });
    textures.forEach((texture) => gl.initTexture(texture));
    gl.compileAsync(scene, camera).catch(() => {});
  }, [get, epoch]);

  return null;
}

/**
 * Drives the canvas from the GSAP ticker (decisions/005): at most one frame
 * per tick, only when something requested one (`requestFrame`). The listener
 * is added after Lenis (prioritized) and GSAP's own timeline update, so the
 * frame is drawn for this tick's smoothed scroll and progress, and reaches
 * the screen together with the page. A resize or DPR change requests one too
 * (R3F's own invalidation is off under `frameloop="never"`).
 *
 * Past the P1 scenes (decisions/003) the first frame clears the canvas and
 * the rest would only clear it again, so requests there (timelines still
 * catching up after the visitor has left Plannr) draw nothing. A restored
 * context (`epoch`) starts over, so its first frame always draws.
 */
function FrameDriver({
  anchors,
  epoch,
}: {
  anchors: RefObject<Anchors | null>;
  epoch: number;
}) {
  const get = useThree((state) => state.get);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);

  useEffect(() => {
    let cleared = false;
    const tick = (time: number) => {
      if (!takeFrameRequest()) return;
      const inView = sceneInView(anchors.current, window.scrollY);
      if (!inView && cleared) return;
      cleared = !inView;
      advance(time, true, get());
    };
    gsap.ticker.add(tick);
    requestFrame();
    return () => gsap.ticker.remove(tick);
  }, [get, anchors, epoch]);

  useEffect(() => requestFrame(), [size, dpr]);

  return null;
}

/** Scenes share one reading of the DOM stage anchors. */
function Scenes({ onReady, epoch }: { onReady: () => void; epoch: number }) {
  const anchors = useAnchors();
  return (
    <>
      <FrameDriver anchors={anchors} epoch={epoch} />
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
      // At 1.5x and up the canvas renders below the screen's density and is
      // upscaled, which softens edges anyway; MSAA there costs the most GPU
      // time (4 samples of the largest buffer) for the least visible gain.
      gl={{ alpha: true, antialias: window.devicePixelRatio < 1.5 }}
      camera={{ fov: 30, position: [0, 0, 10] }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
      }}
      // Frames are requested (scroll, pointer, layout, damping) and drawn by
      // FrameDriver on the GSAP ticker, never continuously.
      frameloop="never"
    >
      <ContextWatch onLost={onLost} onRestored={onRestored} onReady={onReady} />
      <Environment epoch={epoch} />
      <directionalLight position={[-4, 6, 8]} intensity={1.4} />
      <Scenes onReady={onReady} epoch={epoch} />
      <Prewarm epoch={epoch} />
    </Canvas>
  );
}
