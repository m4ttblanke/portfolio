import { useEffect, useMemo, useRef, type RefObject } from "react";
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
import { frameTop as heldFrameTop, type Anchors } from "./anchors";
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
import {
  ITEM_COLORS,
  PLATE_ROW,
  RANKLE_KEYS,
  RANKLE_TURN,
  rankleArrival,
  rowCenter,
  rowHeight,
} from "../scenes/rankle/ranklePose";
import {
  HANDOFF_KEYS,
  line,
  PLANNR_TURN,
  plannrPivot,
  ROW_LINE,
} from "../scenes/plannr/plannrPose";

/*
 * The kit: one set of machined plates that every P1 scene arranges.
 * At rest the plates assemble into the MB identity relief inside the hero's
 * reserved DOM stage; as the hero exits they turn over and land in the Rankle
 * stage, where the long plates become your board's tier rows. Every pose is a
 * pure function of scroll position and scroll-derived progress.
 */

/** Back faces: Rankle's item colors (exploratory scene palette). */
const BACK_COLORS = [0, 1, 2, 3, 4, 0, 2].map((i) => ITEM_COLORS[i]);

/** Projected MB width as a fraction of the hero stage width. */
const STAGE_FILL = 1.1;
const STAGE_FILL_NARROW = 0.95;
/** Lift above the stage's bottom edge, as a fraction of MB height. */
const STAGE_LIFT = 0.12;
/**
 * How much of the page scroll the relief follows as it comes apart. Narrow
 * screens follow more closely so it stays above the copy rising beneath it.
 */
const SCROLL_FOLLOW = 0.4;
const SCROLL_FOLLOW_NARROW = 0.85;
/** Pointer tilt, radians. */
const TILT_YAW = MathUtils.degToRad(5);
const TILT_PITCH = MathUtils.degToRad(3.5);
/** Below this width, plates travel through a corridor clear of the copy. */
const NARROW = 640;

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

export function Kit({
  anchors,
  onFirstFrame,
}: {
  anchors: RefObject<Anchors | null>;
  onFirstFrame: () => void;
}) {
  const plates = useMemo(() => createPlates(), []);
  const meshes = useRef<(Mesh | null)[]>([]);
  const group = useRef<Group>(null);
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

  // Each plate's extent once laid horizontal (letter units), for tier rows.
  const laidExtents = useMemo(
    () =>
      plates.map((plate, i) => {
        const laid = geometries[i].clone().rotateZ(-plate.axis);
        laid.computeBoundingBox();
        const box = laid.boundingBox!;
        laid.dispose();
        return { width: box.max.x - box.min.x, height: box.max.y - box.min.y };
      }),
    [plates, geometries],
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

  // Constant rotations, allocated once.
  const fixed = useMemo(() => {
    const turn = quat(CANONICAL_TURN.pitch, CANONICAL_TURN.yaw);
    const dissolve = quat(DISSOLVE_TURN.pitch, DISSOLVE_TURN.yaw);
    const settledTurn = quat(RANKLE_TURN.pitch, RANKLE_TURN.yaw);
    const plannrTurn = quat(PLANNR_TURN.pitch, PLANNR_TURN.yaw);
    const flip = (angle: number) =>
      new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), angle);
    const roll = (angle: number) =>
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), angle);
    return {
      turn,
      plannrTurn,
      dissolveGroup: dissolve,
      dissolve: dissolve.clone().multiply(turn),
      perPlate: plates.map((plate, i) => {
        const arrival = rankleArrival(i, plates.length);
        const lie = -plate.axis + arrival.tilt;
        return {
          arrival,
          // Lay the long axis horizontal and turn the plate over (color up).
          exploded: settledTurn
            .clone()
            .multiply(flip(Math.PI * 0.55))
            .multiply(roll(lie / 2)),
          pooled: settledTurn
            .clone()
            .multiply(flip(Math.PI))
            .multiply(roll(lie)),
          // As a tier row: turned back over, exactly horizontal.
          row: settledTurn.clone().multiply(roll(-plate.axis)),
          // As a syllabus line: flat to Plannr's page, exactly horizontal.
          line: plannrTurn.clone().multiply(roll(-plate.axis)),
        };
      }),
    };
  }, [plates]);

  const scratch = useMemo(
    () => ({
      tilt: new Quaternion(),
      euler: new Euler(),
      heroCenter: new Vector3(),
      poolCenter: new Vector3(),
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
      rowPosition: new Vector3(),
      rowScale: new Vector3(),
      scale: new Vector3(),
      rotation: new Quaternion(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const a = anchors.current;
    if (!a) return;
    const { size, viewport, camera, invalidate } = state;
    const camZ = camera.position.z;
    const p = scene.hero;
    const narrow = size.width <= NARROW;
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

    // Hero relief: sits just above its stage's bottom edge; lags the page
    // scroll so it lingers (and reads as deeper) while the name scrolls away.
    const fill = narrow ? STAGE_FILL_NARROW : STAGE_FILL;
    const foreX = Math.cos(CANONICAL_TURN.yaw);
    const foreY = Math.cos(CANONICAL_TURN.pitch);
    const s = (a.hero.width * toWorld * fill) / (MB_WIDTH * foreX);
    const heroCenter = scratch.heroCenter.set(
      worldX(a.hero.x),
      worldY(
        a.hero.bottom -
          window.scrollY * (narrow ? SCROLL_FOLLOW_NARROW : SCROLL_FOLLOW),
      ) +
        MB_HEIGHT * s * foreY * (0.5 + STAGE_LIFT),
      0,
    );

    // Rankle stage, tracked live with its sticky frame (arriving, held,
    // released): plates always land where the stage actually is.
    const r = a.rankle;
    const frameTop = r ? heldFrameTop(r, window.scrollY) : 0;
    const poolCenter = scratch.poolCenter;
    let tileScale = s;
    let poolHeight = 0;
    let poolWidth = 0;
    if (r) {
      poolCenter.set(
        worldX(r.stage.left + r.stage.width / 2),
        worldY(frameTop + r.stage.top + r.stage.height / 2),
        0,
      );
      poolHeight = r.stage.height * toWorld * 0.9;
      poolWidth = r.stage.width * toWorld;
      const slot = poolHeight / plates.length;
      tileScale = Math.min((poolWidth * 0.5) / 2.3, slot * 1.05);
    } else {
      poolCenter.copy(heroCenter);
    }

    // Path of the kit's center: rides with the hero, then travels to Rankle.
    const centerAt = (out: Vector3, at: number) =>
      out.lerpVectors(heroCenter, poolCenter, smooth(0.25, 0.95, at));

    const count = plates.length;
    const span = 1 - EXIT_STAGGER * (count - 1);

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

      // 1 — dissolved: turned off-axis, depth planes pulled apart. Narrow
      // screens dissolve smaller while drifting toward the right corridor.
      centerAt(keys[1], EXIT_KEYS[1]);
      const dissolveScale = narrow ? 0.75 : 1;
      if (narrow) keys[1].x = worldX(size.width * 0.72);
      keys[1].add(
        scratch.local
          .set(localX, localY, dz * DISSOLVE_DEPTH)
          .multiplyScalar(dissolveScale)
          .applyQuaternion(fixed.dissolveGroup),
      );
      rotations[1].copy(fixed.dissolve);
      scales[1] = s * dissolveScale;

      // 3 — pooled in the Rankle stage, color side up, unordered.
      keys[3].set(
        poolCenter.x + per.arrival.x * poolWidth,
        poolCenter.y + per.arrival.y * poolHeight,
        0,
      );
      rotations[3].copy(per.pooled);
      scales[3] = tileScale;

      // 2 — exploded and half turned over. On narrow screens the plates run
      // down a right-hand corridor at their landing heights, clear of copy.
      if (narrow) {
        keys[2].set(
          worldX(size.width * (0.88 + 0.03 * (i % 3))),
          keys[3].y,
          (0.4 + 0.15 * (i % 3)) * s,
        );
        scales[2] = tileScale * 0.7;
      } else {
        centerAt(keys[2], EXIT_KEYS[2]).add(
          scratch.local.set(
            localX * EXPLODE_SPREAD,
            localY * EXPLODE_SPREAD,
            (0.8 + 0.35 * (i % 3)) * s,
          ),
        );
        scales[2] = (s + tileScale) / 2;
      }
      rotations[2].copy(per.exploded);

      // Staggered local progress through the hero exit.
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
      scratch.rotation.slerpQuaternions(
        rotations[seg],
        rotations[seg + 1],
        MathUtils.smootherstep(u, 0, 1),
      );
      const scale = MathUtils.lerp(scales[seg], scales[seg + 1], u);
      scratch.scale.setScalar(scale);

      // 4 — Rankle: the straight stems turn back over and stretch into your
      // board's full-width tier rows; the other plates are set aside.
      if (r) {
        const row = PLATE_ROW[i];
        const [from, to] = RANKLE_KEYS.rows;
        const stagger = row === null ? 0 : row * 0.025;
        const w = smooth(from + stagger, to + stagger, scene.rankle);
        if (w > 0) {
          if (row === null) {
            scratch.scale.multiplyScalar(1 - w);
          } else {
            // Stems lie with local y along the row and local x across it.
            const board = r.you;
            const extent = laidExtents[i];
            const across =
              ((rowHeight(board) * 0.82) / extent.height) * toWorld;
            const along = (board.width / extent.width) * toWorld;
            // Fly in at the row's height, then stretch along the row.
            const stretch = smooth(0.55, 1, w);
            scratch.rowScale.set(
              across,
              MathUtils.lerp(across, along, stretch),
              across * 0.5,
            );
            scratch.rowPosition.set(
              worldX(board.left + board.width / 2),
              worldY(frameTop + rowCenter(board, row)),
              -0.2 * across,
            );
            scratch.position.lerp(scratch.rowPosition, w);
            scratch.rotation.slerp(per.row, w);
            scratch.scale.lerp(scratch.rowScale, w);
          }
        }
      }

      // 5 — Plannr hand-off: your rows flatten and thin into the first lines
      // of the syllabus as the page resolves beneath them.
      const pl = a.plannr;
      const row = PLATE_ROW[i];
      if (pl && row !== null && scene.handoff > 0) {
        const [from, to] = HANDOFF_KEYS.travel;
        const h = MathUtils.smootherstep(
          scene.handoff,
          from + row * 0.03,
          to - (4 - row) * 0.03,
        );
        if (h > 0) {
          const l = line(pl.page, ROW_LINE[row]);
          const extent = laidExtents[i];
          const plannrTop = heldFrameTop(pl, window.scrollY);
          const across = (l.height / extent.height) * toWorld;
          const along = (l.width / extent.width) * toWorld;
          // On the Plannr plane, turned rigidly about the stage's center.
          const pivot = plannrPivot(pl);
          scratch.local.set(worldX(pivot.x), worldY(plannrTop + pivot.y), 0);
          scratch.rowPosition
            .set(
              worldX(l.left + l.width / 2),
              worldY(plannrTop + l.y),
              -4 * toWorld,
            )
            .sub(scratch.local)
            .applyQuaternion(fixed.plannrTurn)
            .add(scratch.local);
          scratch.rowScale.set(across, along, across * 0.5);
          scratch.position.lerp(scratch.rowPosition, h);
          scratch.rotation.slerp(per.line, h);
          scratch.scale.lerp(scratch.rowScale, h);
        }
      }

      mesh.position.copy(scratch.position);
      mesh.quaternion.copy(scratch.rotation);
      mesh.scale.copy(scratch.scale);
      mesh.visible = scratch.scale.x > 1e-4;
    });

    if (group.current) {
      const pl = a.plannr;
      const plannrVisible =
        !!pl && heldFrameTop(pl, window.scrollY) > -pl.frameHeight;
      group.current.visible =
        !r || frameTop > -r.frameHeight || (scene.handoff > 0 && plannrVisible);
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
