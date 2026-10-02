import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  Color,
  Euler,
  ExtrudeGeometry,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  Shape,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import { scene } from "@/lib/motion/scene-progress";
import { frameTop, type Anchors, type Rect } from "../../canvas/anchors";
import {
  APPROVED,
  calendarCell,
  chipOnLine,
  HANDOFF_KEYS,
  ITEM_CELL,
  line,
  PLANNR_COLORS,
  PLANNR_KEYS,
  LINE_SURFACE,
  pageAt,
  PLANNR_TURN,
  plannrPivot,
  reviewSlot,
  ROW_LINE,
} from "../plannr/plannrPose";
import {
  cardCenter,
  cardSize,
  FRIEND,
  ITEM_COLORS,
  OUTLINE_COLOR,
  RANKLE_KEYS,
  RANKLE_TURN,
  rowCenter,
  rowHeight,
  SUPPLEMENT_ROWS,
  TIERS,
  YOU,
} from "./ranklePose";

/*
 * Rankle's own objects: item cards on both boards, a friend's tier rows, the
 * two rows that complete your board, and the threads joining each item across
 * the boards. (Your other rows are the kit's stems — see Kit.)
 *
 * Into Plannr: a friend's board and the threads retract; your cards turn over
 * to their paper side and become the syllabus's date chips, which are then
 * lifted, reviewed (accepted or declined) and settled into the calendar.
 */

const CARD_THICKNESS = 0.16;
const THREAD_COLORS = ITEM_COLORS.map((color, item) =>
  item === ITEM_COLORS.length - 1 ? "#9c978d" : color,
);
const THREAD_WIDTH = 3;
const OUTLINE = 0.14;

const smooth = (edge0: number, edge1: number, x: number) =>
  MathUtils.smoothstep(x, edge0, edge1);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Eased 0 → 1 for the n-th of `count` elements sharing a progress range;
 * each takes half the range, starts staggered evenly across the rest.
 */
function stagger(
  range: readonly [number, number],
  n: number,
  count: number,
  progress: number,
) {
  const [from, to] = range;
  const length = (to - from) * 0.5;
  const step = count > 1 ? (to - from - length) / (count - 1) : 0;
  const start = from + n * step;
  return easeOut(MathUtils.clamp((progress - start) / length, 0, 1));
}

/** Items in the order they are placed: best tier first, then board order. */
function rankOrder(placement: number[]) {
  const sorted = placement
    .map((row, item) => ({ row, item }))
    .sort((a, b) => a.row - b.row || a.item - b.item);
  const order: number[] = [];
  sorted.forEach(({ item }, rank) => (order[item] = rank));
  return order;
}

function roundedSquare(radius: number) {
  const h = 0.5;
  const shape = new Shape();
  shape.moveTo(-h + radius, -h);
  shape.lineTo(h - radius, -h);
  shape.quadraticCurveTo(h, -h, h, -h + radius);
  shape.lineTo(h, h - radius);
  shape.quadraticCurveTo(h, h, h - radius, h);
  shape.lineTo(-h + radius, h);
  shape.quadraticCurveTo(-h, h, -h, h - radius);
  shape.lineTo(-h, -h + radius);
  shape.quadraticCurveTo(-h, -h, -h + radius, -h);
  return shape;
}

/** A frame-relative px pose: center, size, depth offset. */
type Pose = { x: number; y: number; z: number; width: number; height: number };
const mix = (a: Pose, b: Pose, t: number): Pose => ({
  x: MathUtils.lerp(a.x, b.x, t),
  y: MathUtils.lerp(a.y, b.y, t),
  z: MathUtils.lerp(a.z, b.z, t),
  width: MathUtils.lerp(a.width, b.width, t),
  height: MathUtils.lerp(a.height, b.height, t),
});

export function RankleScene({
  anchors,
}: {
  anchors: RefObject<Anchors | null>;
}) {
  const group = useRef<Group>(null);
  const cards = useRef<(Mesh | null)[]>([]);
  const outlines = useRef<(Mesh | null)[]>([]);
  const rows = useRef<(Mesh | null)[]>([]);
  const threads = useRef<(Mesh | null)[]>([]);

  const resources = useMemo(() => {
    // Card silhouette after Rankle's mark: a rounded square (radius ≈ 0.26).
    const card = new ExtrudeGeometry(roundedSquare(0.26), {
      depth: CARD_THICKNESS,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 6,
    }).translate(0, 0, -CARD_THICKNESS / 2);
    // Front (color) and back (paper) carry separate materials.
    const [caps, sides] = card.groups;
    card.clearGroups();
    card.addGroup(caps.start, caps.count / 2, 2);
    card.addGroup(caps.start + caps.count / 2, caps.count / 2, 0);
    card.addGroup(sides.start, sides.count, 1);
    const box = new BoxGeometry(1, 1, 1);
    const faces = ITEM_COLORS.map(
      (color) =>
        new MeshStandardMaterial({ color: new Color(color), roughness: 0.45 }),
    );
    // Your cards' paper backs; tinted navy when a date is accepted.
    const backs = ITEM_COLORS.map(
      () =>
        new MeshStandardMaterial({
          color: new Color(PLANNR_COLORS.paper),
          roughness: 0.6,
        }),
    );
    const outline = new MeshStandardMaterial({
      color: new Color(OUTLINE_COLOR),
      roughness: 0.6,
    });
    // Your rows match the kit's light alloy; a friend's are quieter.
    const yourRow = new MeshStandardMaterial({
      color: new Color("#b3aea4"),
      metalness: 0.6,
      roughness: 0.34,
    });
    const row = new MeshStandardMaterial({
      color: new Color("#d3cdc1"),
      metalness: 0.3,
      roughness: 0.45,
    });
    // Threads take their item's color (paper reads as warm gray on bone).
    const threads = THREAD_COLORS.map(
      (color) =>
        new MeshBasicMaterial({ color: new Color(color), toneMapped: false }),
    );
    const alloyRow = {
      color: yourRow.color.clone(),
      metalness: 0.6,
      roughness: 0.34,
    };
    const lineColor = new Color(PLANNR_COLORS.line);
    return {
      card,
      box,
      faces,
      backs,
      outline,
      yourRow,
      alloyRow,
      lineColor,
      row,
      threads,
    };
  }, []);

  useEffect(
    () => () => {
      const { card, box, faces, backs, outline, yourRow, row, threads } =
        resources;
      [card, box].forEach((geometry) => geometry.dispose());
      [...faces, ...backs, outline, yourRow, row, ...threads].forEach(
        (material) => material.dispose(),
      );
    },
    [resources],
  );

  const fixed = useMemo(() => {
    const turn = new Quaternion().setFromEuler(
      new Euler(RANKLE_TURN.pitch, RANKLE_TURN.yaw, 0),
    );
    const plannrTurn = new Quaternion().setFromEuler(
      new Euler(PLANNR_TURN.pitch, PLANNR_TURN.yaw, 0),
    );
    const flipped = plannrTurn
      .clone()
      .multiply(
        new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI),
      );
    return {
      turn,
      plannrTurn,
      flipped,
      pivot: new Vector3(),
      onPlane: new Vector3(),
      paper: new Color(PLANNR_COLORS.paper),
      navy: new Color(PLANNR_COLORS.navy),
      quat: new Quaternion(),
    };
  }, []);

  useFrame((state) => {
    const a = anchors.current;
    const r = a?.rankle;
    const g = group.current;
    if (!r || !g) return;
    const pl = a?.plannr ?? null;
    const { size, viewport } = state;
    const toWorld = viewport.width / size.width;
    const top = frameTop(r, window.scrollY);
    const plannrTop = pl ? frameTop(pl, window.scrollY) : 0;
    const worldX = (px: number) => (px - size.width / 2) * toWorld;
    const worldY = (py: number) => (size.height / 2 - py) * toWorld;

    // Plannr's plane turns rigidly about the stage center; pieces arriving
    // there are projected onto it in proportion to how far they've traveled.
    if (pl) {
      const pv = plannrPivot(pl);
      fixed.pivot.set(worldX(pv.x), worldY(plannrTop + pv.y), 0);
    }
    const project = (out: Vector3, pose: Pose, plane: number) => {
      out.set(worldX(pose.x), worldY(pose.y), pose.z * toWorld);
      if (pl && plane > 0) {
        fixed.onPlane
          .copy(out)
          .sub(fixed.pivot)
          .applyQuaternion(fixed.plannrTurn)
          .add(fixed.pivot);
        out.lerp(fixed.onPlane, plane);
      }
      return out;
    };

    const handoff = pl ? scene.handoff : 0;
    const plannrVisible = !!pl && plannrTop > -pl.frameHeight;
    g.visible = top > -r.frameHeight || (handoff > 0 && plannrVisible);
    if (!g.visible) return;

    const progress = scene.rankle;

    // Your bands turn from alloy to matte ink as they become syllabus lines.
    const ink = MathUtils.smoothstep(handoff, 0.4, 0.9);
    resources.yourRow.color.lerpColors(
      resources.alloyRow.color,
      resources.lineColor,
      ink,
    );
    resources.yourRow.setValues({
      metalness: MathUtils.lerp(0.6, LINE_SURFACE.metalness, ink),
      roughness: MathUtils.lerp(0.34, LINE_SURFACE.roughness, ink),
    });
    const plannr = scene.plannr;
    const items = ITEM_COLORS.length;

    // A friend's board and the threads retract first.
    const retract = (n: number, count: number) =>
      1 - stagger(HANDOFF_KEYS.retract, n, count, handoff);

    // Supplementary bands for your rows A and C: grow in with the stems,
    // then flatten into their syllabus lines.
    const [rowsFrom, rowsTo] = RANKLE_KEYS.rows;
    SUPPLEMENT_ROWS.forEach((row, i) => {
      const band = rows.current[TIERS.length + i];
      if (!band) return;
      const w = easeOut(
        smooth(rowsFrom + row * 0.025, rowsTo + row * 0.025, progress),
      );
      const from = bandPose(r.you, row, w, top);
      let pose = from;
      let h = 0;
      if (pl) {
        const [hFrom, hTo] = HANDOFF_KEYS.travel;
        h = MathUtils.smootherstep(
          handoff,
          hFrom + row * 0.03,
          hTo - (4 - row) * 0.03,
        );
        const l = line(pageAt(pl, plannr), ROW_LINE[row]);
        const to: Pose = {
          x: l.left + l.width / 2,
          y: plannrTop + l.y,
          z: -4,
          width: l.width,
          height: l.height,
        };
        pose = mix(from, to, h);
      }
      fixed.quat.slerpQuaternions(fixed.turn, fixed.plannrTurn, h);
      placeBox(band, pose, fixed.quat, 0.3, h);
    });

    // A friend's rows: extend in, top to bottom; retract on the hand-off.
    TIERS.forEach((_, row) => {
      const band = rows.current[row];
      if (!band) return;
      const w = Math.min(
        stagger(RANKLE_KEYS.friendRows, row, TIERS.length, progress),
        retract(TIERS.length - 1 - row, TIERS.length),
      );
      placeBox(band, bandPose(r.friend, row, w, top), fixed.turn, 0.2, 0);
    });

    // Cards. A friend's arrive from the right and leave the same way. Yours
    // are placed out of the gutter, then carry on into Plannr.
    const gutter =
      r.you.left + r.you.width + (r.friend.left - r.you.left - r.you.width) / 2;
    for (let b = 0; b < 2; b++) {
      const board = b === 0 ? r.you : r.friend;
      const placement = b === 0 ? YOU : FRIEND;
      const range = b === 0 ? RANKLE_KEYS.you : RANKLE_KEYS.friend;
      const fromX = b === 0 ? gutter : r.friend.left + r.friend.width * 1.25;
      const cardPx = cardSize(board);
      const order = rankOrder(placement);
      for (let item = 0; item < items; item++) {
        const index = b * items + item;
        const card = cards.current[index];
        const outline = outlines.current[index];
        if (!card || !outline) continue;

        let w = stagger(range, order[item], items, progress);
        if (b === 1) w = Math.min(w, retract(item, items));
        const center = cardCenter(board, placement, item);
        const rankle: Pose = {
          x: MathUtils.lerp(fromX, center.x, w),
          y: top + center.y,
          // Lifted while it travels, set down as it lands.
          z: 0.12 * cardPx + Math.sin(Math.PI * w) * cardPx * 0.9,
          width: cardPx * MathUtils.lerp(0.55, 1, w),
          height: cardPx * MathUtils.lerp(0.55, 1, w),
        };

        let pose = rankle;
        let flip = 0;
        let accepted = 0;
        let plane = 0;
        if (b === 0 && pl && handoff > 0) {
          // Turn over to the paper side, then travel to the date's line.
          flip = MathUtils.smootherstep(
            handoff,
            HANDOFF_KEYS.flip[0] + item * 0.03,
            HANDOFF_KEYS.flip[1] + item * 0.03,
          );
          const travel = MathUtils.smootherstep(
            handoff,
            HANDOFF_KEYS.travel[0] + item * 0.04,
            HANDOFF_KEYS.travel[1],
          );
          const plannrPose = workflowPose(pl, plannrTop, item, plannr);
          accepted = plannrPose.accepted;
          plane = travel;
          pose = mix(rankle, plannrPose.pose, travel);
          if (travel > 0) {
            // Lifted out of the board, set onto the page.
            pose.z += Math.sin(Math.PI * travel) * cardPx * 1.2;
          }
        }

        const shown = w > 0.001 || flip > 0;
        card.visible = shown;
        outline.visible = shown;
        fixed.quat.slerpQuaternions(fixed.turn, fixed.flipped, flip);
        project(card.position, pose, plane);
        card.quaternion.copy(fixed.quat);
        card.scale.set(
          pose.width * toWorld,
          pose.height * toWorld,
          Math.min(pose.width, pose.height) * toWorld,
        );
        const rim = Math.min(pose.width, pose.height) * OUTLINE;
        outline.position.set(
          card.position.x,
          card.position.y,
          card.position.z - Math.min(pose.width, pose.height) * 0.1 * toWorld,
        );
        outline.quaternion.copy(fixed.quat);
        outline.scale.set(
          (pose.width + rim) * toWorld,
          (pose.height + rim) * toWorld,
          Math.min(pose.width, pose.height) * toWorld,
        );
        if (b === 0) {
          resources.backs[item].color.lerpColors(
            fixed.paper,
            fixed.navy,
            accepted,
          );
        }
      }
    }

    // Threads: drawn from your board across the gutter, one per item — flat
    // where you agree, crossing where you don't. Retract first on hand-off.
    const offset = (board: Rect, placement: number[], item: number) => {
      const row = placement[item];
      const shared = placement.filter((p) => p === row).length;
      const index = placement.slice(0, item).filter((p) => p === row).length;
      return (index - (shared - 1) / 2) * rowHeight(board) * 0.22;
    };
    const threadsBack = 1 - smooth(0, HANDOFF_KEYS.retract[1] * 0.7, handoff);
    for (let item = 0; item < items; item++) {
      const thread = threads.current[item];
      if (!thread) continue;
      const w = Math.min(
        stagger(RANKLE_KEYS.threads, item, items, progress),
        threadsBack,
      );
      thread.visible = w > 0.001;
      const x0 = worldX(r.you.left + r.you.width);
      const y0 = worldY(
        top + rowCenter(r.you, YOU[item]) + offset(r.you, YOU, item),
      );
      const x1 = worldX(r.friend.left);
      const y1 = worldY(
        top +
          rowCenter(r.friend, FRIEND[item]) +
          offset(r.friend, FRIEND, item),
      );
      const length = Math.hypot(x1 - x0, y1 - y0) * w;
      const angle = Math.atan2(y1 - y0, x1 - x0);
      thread.position.set(
        x0 + (Math.cos(angle) * length) / 2,
        y0 + (Math.sin(angle) * length) / 2,
        0,
      );
      thread.rotation.set(0, 0, angle);
      thread.scale.set(
        Math.max(length, 1e-4),
        THREAD_WIDTH * toWorld,
        THREAD_WIDTH * toWorld,
      );
    }

    /** A tier band growing from its board's left edge. */
    function bandPose(
      board: Rect,
      row: number,
      w: number,
      frame: number,
    ): Pose {
      const width = board.width * Math.max(w, 1e-4);
      const height = rowHeight(board) * 0.82;
      return {
        x: board.left + width / 2,
        y: frame + rowCenter(board, row),
        z: -0.2 * height,
        width,
        height,
      };
    }

    function placeBox(
      mesh: Mesh,
      pose: Pose,
      rotation: Quaternion,
      depth: number,
      plane: number,
    ) {
      mesh.visible = pose.width > 0.5;
      project(mesh.position, pose, plane);
      mesh.quaternion.copy(rotation);
      mesh.scale.set(
        pose.width * toWorld,
        pose.height * toWorld,
        pose.height * depth * toWorld,
      );
    }
  });

  const items = ITEM_COLORS.length;
  return (
    <group ref={group} visible={false}>
      {Array.from({ length: items * 2 }, (_, index) => (
        <group key={index}>
          <mesh
            ref={(mesh) => {
              cards.current[index] = mesh;
            }}
            geometry={resources.card}
            material={[
              resources.faces[index % items],
              resources.outline,
              index < items
                ? resources.backs[index]
                : resources.faces[index % items],
            ]}
          />
          <mesh
            ref={(mesh) => {
              outlines.current[index] = mesh;
            }}
            geometry={resources.card}
            material={resources.outline}
          />
        </group>
      ))}
      {[...TIERS, ...SUPPLEMENT_ROWS].map((_, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            rows.current[index] = mesh;
          }}
          geometry={resources.box}
          material={index < TIERS.length ? resources.row : resources.yourRow}
        />
      ))}
      {ITEM_COLORS.map((color, item) => (
        <mesh
          key={color}
          ref={(mesh) => {
            threads.current[item] = mesh;
          }}
          geometry={resources.box}
          material={resources.threads[item]}
        />
      ))}
    </group>
  );
}

/**
 * Where one of your cards is in Plannr's workflow, frame-relative px: a date
 * chip on its syllabus line → lifted → queued for review → accepted (navy,
 * nudged on) or declined (back to its line) → accepted dates settle into
 * the calendar.
 */
function workflowPose(
  pl: NonNullable<Anchors["plannr"]>,
  top: number,
  item: number,
  progress: number,
) {
  const count = APPROVED.length;
  const page = pageAt(pl, progress);
  const chip = chipOnLine(page, item);
  const onLine: Pose = {
    x: chip.x,
    y: top + chip.y,
    z: 3,
    width: chip.width,
    height: chip.height,
  };

  const lift = stagger(PLANNR_KEYS.lift, item, count, progress);
  const lifted: Pose = {
    ...onLine,
    z: onLine.z + chip.height * 1.6,
    width: chip.width * 1.08,
    height: chip.height * 1.08,
  };
  let pose = mix(onLine, lifted, lift);

  const slot = reviewSlot(pl.review, pl.page, item);
  const queued: Pose = {
    x: slot.x,
    y: top + slot.y,
    z: lifted.z * 0.5,
    width: slot.width,
    height: slot.height,
  };
  pose = mix(pose, queued, stagger(PLANNR_KEYS.review, item, count, progress));

  const verdict = stagger(PLANNR_KEYS.verdict, item, count, progress);
  let accepted = 0;
  if (APPROVED[item]) {
    accepted = verdict;
    pose = { ...pose, x: pose.x + slot.width * 0.12 * verdict };
    const cell = calendarCell(pl.calendar, ITEM_CELL[item]);
    const settled: Pose = {
      x: cell.x,
      y: top + cell.y,
      z: 3,
      width: cell.width,
      height: cell.height,
    };
    pose = mix(
      pose,
      settled,
      stagger(PLANNR_KEYS.settle, item, count, progress),
    );
  } else {
    // Declined: returns to its place on the syllabus; it is not synced.
    pose = mix(pose, onLine, verdict);
  }
  return { pose, accepted };
}
