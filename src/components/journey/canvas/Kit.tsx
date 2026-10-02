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
  DISSOLVE_DEPTH,
  DISSOLVE_TURN,
  EXIT_KEYS,
  EXIT_STAGGER,
  EXPLODE_SPREAD,
  MB_HEIGHT,
  MB_WIDTH,
  PLATE_THICKNESS,
} from "../scenes/hero/heroPose";
import { RANKLE_TURN, rankleArrival } from "../scenes/rankle/ranklePose";

/*
 * The kit: one set of machined plates that every P1 scene arranges.
 * At rest the plates assemble into the MB identity relief inside the hero's
 * reserved DOM stage; as the hero exits they turn over and land in the Rankle
 * stage. Every pose is a pure function of scroll-derived progress.
 *
 * The back-face colors are exploratory art direction, not Rankle branding.
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
/** How much of the page scroll the relief follows as it comes apart. */
const SCROLL_FOLLOW = 0.4;
/** Pointer tilt, radians. */
const TILT_YAW = MathUtils.degToRad(5);
const TILT_PITCH = MathUtils.degToRad(3.5);

type Anchors = {
  /** Hero stage, document coordinates (px). */
  hero: { x: number; bottom: number; width: number };
  /** Rankle stage while its sticky frame is held, viewport coordinates (px). */
  rankle: { x: number; y: number; width: number; height: number } | null;
};

function useAnchors() {
  const anchors = useRef<Anchors | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const hero = document.querySelector<HTMLElement>(
      '[data-scene-anchor="hero"]',
    );
    const rankle = document.querySelector<HTMLElement>(
      '[data-scene-anchor="rankle"]',
    );
    const sticky = rankle?.closest<HTMLElement>("[data-sticky]");
    if (!hero) return;
    const measure = () => {
      const h = hero.getBoundingClientRect();
      let held: Anchors["rankle"] = null;
      if (rankle && sticky) {
        const r = rankle.getBoundingClientRect();
        const offsetTop = r.top - sticky.getBoundingClientRect().top;
        held = {
          x: r.left + r.width / 2,
          y: offsetTop + r.height / 2,
          width: r.width,
          height: r.height,
        };
      }
      anchors.current = {
        hero: {
          x: h.left + h.width / 2,
          bottom: h.bottom + window.scrollY,
          width: h.width,
        },
        rankle: held,
      };
      invalidate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    if (rankle) observer.observe(rankle);
    // The relief follows the page scroll until it peels away.
    const onScroll = () => invalidate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [invalidate]);

  return anchors;
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

const smooth = (edge0: number, edge1: number, x: number) =>
  MathUtils.smoothstep(x, edge0, edge1);

/** Uniform Catmull-Rom between b and c. */
function catmull(
  out: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3,
  d: Vector3,
  t: number,
) {
  const t2 = t * t;
  const t3 = t2 * t;
  for (const axis of ["x", "y", "z"] as const) {
    out[axis] =
      0.5 *
      (2 * b[axis] +
        (-a[axis] + c[axis]) * t +
        (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * t2 +
        (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * t3);
  }
  return out;
}

const quat = (pitch: number, yaw: number, roll = 0) =>
  new Quaternion().setFromEuler(new Euler(pitch, yaw, roll));

export function Kit({ onFirstFrame }: { onFirstFrame: () => void }) {
  const plates = useMemo(() => createPlates(), []);
  const meshes = useRef<(Mesh | null)[]>([]);
  const group = useRef<Group>(null);
  const anchors = useAnchors();
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
        // the back face can carry its own color.
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
    const dark = new MeshStandardMaterial({
      color: new Color("#77736b"),
      metalness: 0.6,
      roughness: 0.38,
    });
    const light = new MeshStandardMaterial({
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
    return { dark, light, edge, backs };
  }, []);

  useEffect(
    () => () => {
      geometries.forEach((geometry) => geometry.dispose());
      [
        materials.dark,
        materials.light,
        materials.edge,
        ...materials.backs,
      ].forEach((material) => material.dispose());
    },
    [geometries, materials],
  );

  // Constant rotations and per-plate scratch, allocated once.
  const fixed = useMemo(() => {
    const turn = quat(CANONICAL_TURN.pitch, CANONICAL_TURN.yaw);
    const dissolve = quat(DISSOLVE_TURN.pitch, DISSOLVE_TURN.yaw);
    const settledTurn = quat(RANKLE_TURN.pitch, RANKLE_TURN.yaw);
    const flipped = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      Math.PI,
    );
    const halfFlipped = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      Math.PI * 0.55,
    );
    const roll = new Vector3(0, 0, 1);
    return {
      turn,
      dissolveGroup: dissolve,
      dissolve: dissolve.clone().multiply(turn),
      perPlate: plates.map((plate, i) => {
        const arrival = rankleArrival(i, plates.length);
        // Lay each plate's long axis horizontal, then turn it over.
        const lie = new Quaternion().setFromAxisAngle(
          roll,
          -plate.axis + arrival.tilt,
        );
        const halfLie = new Quaternion().setFromAxisAngle(
          roll,
          (-plate.axis + arrival.tilt) / 2,
        );
        return {
          arrival,
          exploded: settledTurn.clone().multiply(halfFlipped).multiply(halfLie),
          settled: settledTurn.clone().multiply(flipped).multiply(lie),
        };
      }),
    };
  }, [plates]);

  const scratch = useMemo(
    () => ({
      tilt: new Quaternion(),
      euler: new Euler(),
      heroCenter: new Vector3(),
      rankleCenter: new Vector3(),
      local: new Vector3(),
      keys: [new Vector3(), new Vector3(), new Vector3(), new Vector3()],
      rotations: [
        new Quaternion(),
        new Quaternion(),
        new Quaternion(),
        new Quaternion(),
      ],
      scales: [0, 0, 0, 0],
      position: new Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const a = anchors.current;
    if (!a) return;
    const { size, viewport, camera, invalidate } = state;
    const camZ = camera.position.z;
    const p = scene.hero;
    const toWorld = viewport.width / size.width;
    const worldX = (px: number) => (px - size.width / 2) * toWorld;
    const worldY = (py: number) => (size.height / 2 - py) * toWorld;

    // Pointer tilt, damped so it can come to rest under demand rendering, and
    // faded out as the relief starts to come apart.
    const t = tilt.current;
    const step = Math.min(delta, 0.1);
    const tiltWeight = 1 - smooth(0, 0.25, p);
    const targetYaw = scene.pointerX * TILT_YAW * tiltWeight;
    const targetPitch = scene.pointerY * TILT_PITCH * tiltWeight;
    t.yaw = MathUtils.damp(t.yaw, targetYaw, 5, step);
    t.pitch = MathUtils.damp(t.pitch, targetPitch, 5, step);
    if (
      Math.abs(t.yaw - targetYaw) > 1e-4 ||
      Math.abs(t.pitch - targetPitch) > 1e-4
    ) {
      invalidate();
    }
    scratch.tilt.setFromEuler(scratch.euler.set(t.pitch, t.yaw, 0));

    // Hero relief: sits on its stage's bottom edge; lags the page scroll so it
    // lingers (and reads as deeper) while the name scrolls away.
    const fill = size.width <= 640 ? STAGE_FILL_NARROW : STAGE_FILL;
    const foreX = Math.cos(CANONICAL_TURN.yaw);
    const foreY = Math.cos(CANONICAL_TURN.pitch);
    const s = (a.hero.width * toWorld * fill) / (MB_WIDTH * foreX);
    const heroCenter = scratch.heroCenter.set(
      worldX(a.hero.x),
      worldY(a.hero.bottom - window.scrollY * SCROLL_FOLLOW) +
        (MB_HEIGHT / 2) * s * foreY,
      0,
    );

    // Rankle stage: where the plates land; lifted away as it is released.
    const r = a.rankle;
    const rankleCenter = scratch.rankleCenter;
    let tileScale = s;
    let columnHeight = 0;
    let columnWidth = 0;
    if (r) {
      rankleCenter.set(
        worldX(r.x),
        worldY(r.y) + scene.rankleRelease * viewport.height,
        0,
      );
      columnHeight = r.height * toWorld;
      columnWidth = r.width * toWorld;
      const slot = columnHeight / plates.length;
      tileScale = Math.min((columnWidth * 0.62) / 2.3, slot * 1.05);
    } else {
      rankleCenter.copy(heroCenter);
    }

    // Path of the kit's center: rides with the hero, then travels to Rankle.
    const centerAt = (out: Vector3, at: number) =>
      out.lerpVectors(heroCenter, rankleCenter, smooth(0.25, 0.95, at));

    const count = plates.length;
    plates.forEach((plate, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      const localX = (plate.center[0] - MB_WIDTH / 2) * s * foreX;
      const localY = (plate.center[1] - MB_HEIGHT / 2) * s * foreY;
      const { keys, rotations, scales } = scratch;
      const per = fixed.perPlate[i];

      // 0 — canonical: on the camera ray at its depth plane (aligned MB).
      const dz = plate.depth * s;
      const k = (camZ - dz) / camZ;
      keys[0]
        .set((heroCenter.x + localX) * k, (heroCenter.y + localY) * k, dz)
        .sub(heroCenter)
        .applyQuaternion(scratch.tilt)
        .add(heroCenter);
      rotations[0].multiplyQuaternions(scratch.tilt, fixed.turn);
      scales[0] = s * k;

      // 1 — dissolved: turned off-axis, depth planes pulled apart.
      centerAt(keys[1], EXIT_KEYS[1]).add(
        scratch.local
          .set(localX, localY, dz * DISSOLVE_DEPTH)
          .applyQuaternion(fixed.dissolveGroup),
      );
      rotations[1].copy(fixed.dissolve);
      scales[1] = s;

      // 2 — exploded outward and toward the camera, half turned over.
      centerAt(keys[2], EXIT_KEYS[2]).add(
        scratch.local.set(
          localX * EXPLODE_SPREAD,
          localY * EXPLODE_SPREAD,
          (0.8 + 0.35 * (i % 3)) * s,
        ),
      );
      rotations[2].copy(per.exploded);
      scales[2] = (s + tileScale) / 2;

      // 3 — settled in the Rankle column, color side up.
      keys[3].set(
        rankleCenter.x + per.arrival.x * columnWidth,
        rankleCenter.y + per.arrival.y * columnHeight,
        0,
      );
      rotations[3].copy(per.settled);
      scales[3] = tileScale;

      // Staggered local progress, then interpolate within its segment.
      const span = 1 - EXIT_STAGGER * (count - 1);
      const pi = MathUtils.clamp((p - i * EXIT_STAGGER) / span, 0, 1);
      let seg = 0;
      while (seg < 2 && pi > EXIT_KEYS[seg + 1]) seg++;
      const u = (pi - EXIT_KEYS[seg]) / (EXIT_KEYS[seg + 1] - EXIT_KEYS[seg]);
      catmull(
        scratch.position,
        keys[Math.max(seg - 1, 0)],
        keys[seg],
        keys[seg + 1],
        keys[Math.min(seg + 2, 3)],
        u,
      );
      mesh.position.copy(scratch.position);
      mesh.quaternion.slerpQuaternions(
        rotations[seg],
        rotations[seg + 1],
        MathUtils.smootherstep(u, 0, 1),
      );
      mesh.scale.setScalar(MathUtils.lerp(scales[seg], scales[seg + 1], u));
    });

    if (group.current) {
      group.current.visible = scene.rankleRelease < 1;
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
            plate.tone === "dark" ? materials.dark : materials.light,
            materials.edge,
            materials.backs[i],
          ]}
        />
      ))}
    </group>
  );
}
