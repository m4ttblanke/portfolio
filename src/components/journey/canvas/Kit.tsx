import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  Euler,
  ExtrudeGeometry,
  MathUtils,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import { scene } from "@/lib/motion/scene-progress";
import {
  CANONICAL_TURN,
  createPlates,
  MB_HEIGHT,
  MB_WIDTH,
  PLATE_THICKNESS,
} from "../scenes/hero/heroPose";

/*
 * The kit: one set of machined plates that every P1 scene arranges.
 * At rest the plates assemble into the MB identity relief inside the hero's
 * reserved DOM stage. Exploratory back-face colors are revealed later when
 * plates turn over; they are art direction, not Rankle branding.
 */

const BACK_COLORS = [
  "#e5402b",
  "#f2c12e",
  "#2d5bc4",
  "#f4f2ee",
  "#151513",
  "#e5402b",
  "#2d5bc4",
];

/** Projected MB width as a fraction of the hero stage width. */
const STAGE_FILL = 1.2;
const STAGE_FILL_NARROW = 1;
/** Pointer tilt, radians. */
const TILT_YAW = MathUtils.degToRad(5);
const TILT_PITCH = MathUtils.degToRad(3.5);

type Anchor = { x: number; bottom: number; width: number };

function useHeroAnchor() {
  const anchor = useRef<Anchor | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const element = document.querySelector<HTMLElement>(
      '[data-scene-anchor="hero"]',
    );
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      anchor.current = {
        x: rect.left + rect.width / 2,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
      };
      invalidate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    // The relief follows its stage while the page scrolls.
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [invalidate]);

  return anchor;
}

function usePointer() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      scene.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scene.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [invalidate]);
}

export function Kit({ onFirstFrame }: { onFirstFrame: () => void }) {
  const plates = useMemo(() => createPlates(), []);
  const meshes = useRef<(Mesh | null)[]>([]);
  const group = useRef<Group>(null);
  const anchor = useHeroAnchor();
  const tilt = useRef({ yaw: 0, pitch: 0 });
  const firstFrame = useRef(false);
  usePointer();

  const geometries = useMemo(
    () =>
      plates.map((plate) => {
        const geometry = new ExtrudeGeometry(plate.shape, {
          depth: PLATE_THICKNESS,
          bevelEnabled: true,
          bevelThickness: 0.025,
          bevelSize: 0.022,
          bevelSegments: 2,
          curveSegments: 28,
        });
        // Center on the plate's own origin so it can rotate in place.
        geometry.translate(
          -plate.center[0],
          -plate.center[1],
          -PLATE_THICKNESS / 2,
        );
        // Caps share group 0: back lid first, front lid second. Split them so
        // the back face can carry its own (revealed later) color.
        const [caps, sides] = geometry.groups;
        const half = caps.count / 2;
        geometry.clearGroups();
        geometry.addGroup(caps.start, half, 2);
        geometry.addGroup(caps.start + half, half, 0);
        geometry.addGroup(sides.start, sides.count, 1);
        return geometry;
      }),
    [plates],
  );

  const materials = useMemo(() => {
    const graphite = new MeshStandardMaterial({
      color: new Color("#77736b"),
      metalness: 0.6,
      roughness: 0.38,
    });
    const alloy = new MeshStandardMaterial({
      color: new Color("#b3aea4"),
      metalness: 0.6,
      roughness: 0.34,
    });
    const edge = new MeshStandardMaterial({
      color: new Color("#cfcac0"),
      metalness: 0.6,
      roughness: 0.25,
    });
    const backs = BACK_COLORS.map(
      (color) =>
        new MeshStandardMaterial({ color: new Color(color), roughness: 0.5 }),
    );
    return { graphite, alloy, edge, backs };
  }, []);

  useEffect(
    () => () => {
      geometries.forEach((geometry) => geometry.dispose());
      [
        materials.graphite,
        materials.alloy,
        materials.edge,
        ...materials.backs,
      ].forEach((material) => material.dispose());
    },
    [geometries, materials],
  );

  const scratch = useMemo(
    () => ({
      center: new Vector3(),
      position: new Vector3(),
      tilt: new Quaternion(),
      turn: new Quaternion().setFromEuler(
        new Euler(CANONICAL_TURN.pitch, CANONICAL_TURN.yaw, 0),
      ),
      rotation: new Quaternion(),
      euler: new Euler(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const a = anchor.current;
    if (!a) return;
    const { size, viewport, camera, invalidate } = state;
    const camZ = camera.position.z;

    // Pointer tilt, damped so it can come to rest under demand rendering.
    const t = tilt.current;
    const step = Math.min(delta, 0.1);
    t.yaw = MathUtils.damp(t.yaw, scene.pointerX * TILT_YAW, 5, step);
    t.pitch = MathUtils.damp(t.pitch, scene.pointerY * TILT_PITCH, 5, step);
    const settled =
      Math.abs(t.yaw - scene.pointerX * TILT_YAW) < 1e-4 &&
      Math.abs(t.pitch - scene.pointerY * TILT_PITCH) < 1e-4;
    if (!settled) invalidate();

    // Stage placement in world units (plane z = 0): the MB sits on the
    // stage's bottom edge, centered horizontally.
    const toWorld = viewport.width / size.width;
    const stageBottom = a.bottom - window.scrollY;
    const fill = size.width <= 640 ? STAGE_FILL_NARROW : STAGE_FILL;
    const foreX = Math.cos(CANONICAL_TURN.yaw);
    const foreY = Math.cos(CANONICAL_TURN.pitch);
    const s = (a.width * toWorld * fill) / (MB_WIDTH * foreX);
    const cx = (a.x - size.width / 2) * toWorld;
    const cy =
      (size.height / 2 - stageBottom) * toWorld + (MB_HEIGHT / 2) * s * foreY;
    scratch.center.set(cx, cy, 0);
    scratch.tilt.setFromEuler(scratch.euler.set(t.pitch, t.yaw, 0));
    scratch.rotation.multiplyQuaternions(scratch.tilt, scratch.turn);

    plates.forEach((plate, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      // Point on the (foreshortened) flat MB, then slide it along the camera
      // ray to its depth plane, shrinking it so its projection is unchanged.
      const px = cx + (plate.center[0] - MB_WIDTH / 2) * s * foreX;
      const py = cy + (plate.center[1] - MB_HEIGHT / 2) * s * foreY;
      const dz = plate.depth * s;
      const k = (camZ - dz) / camZ;
      scratch.position
        .set(px * k, py * k, dz)
        .sub(scratch.center)
        .applyQuaternion(scratch.tilt)
        .add(scratch.center);
      mesh.position.copy(scratch.position);
      mesh.quaternion.copy(scratch.rotation);
      mesh.scale.setScalar(s * k);
    });

    if (group.current) {
      group.current.visible =
        stageBottom > -size.height && stageBottom < size.height * 2;
    }

    if (!firstFrame.current) {
      firstFrame.current = true;
      // The frame being prepared now renders after this callback.
      requestAnimationFrame(onFirstFrame);
    }
  });

  return (
    <group ref={group}>
      {plates.map((plate, i) => (
        <mesh
          key={plate.id}
          ref={(mesh) => {
            meshes.current[i] = mesh;
          }}
          geometry={geometries[i]}
          material={[
            plate.tone === "dark" ? materials.graphite : materials.alloy,
            materials.edge,
            materials.backs[i],
          ]}
        />
      ))}
    </group>
  );
}
