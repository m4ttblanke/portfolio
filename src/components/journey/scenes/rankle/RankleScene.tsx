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
  type Group,
  type Mesh,
} from "three";
import { scene } from "@/lib/motion/scene-progress";
import { rankleFrameTop, type Anchors, type Rect } from "../../canvas/anchors";
import {
  cardCenter,
  cardSize,
  FRIEND,
  ITEM_COLORS,
  OUTLINE_COLOR,
  RANKLE_TURN,
  rowCenter,
  rowHeight,
  RANKLE_KEYS,
  SUPPLEMENT_ROWS,
  TIERS,
  YOU,
} from "./ranklePose";

/*
 * Rankle's own objects: item cards on both boards, a friend's tier rows, the
 * two rows that complete your board, and the threads joining each item across
 * the boards. (Your other rows are the kit's stems — see Kit.)
 */

const CARD_THICKNESS = 0.16;
const THREAD_COLORS = ITEM_COLORS.map((color, item) =>
  item === ITEM_COLORS.length - 1 ? "#9c978d" : color,
);
const THREAD_WIDTH = 3;

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
const OUTLINE = 1.14;

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
    const box = new BoxGeometry(1, 1, 1);
    const faces = ITEM_COLORS.map(
      (color) =>
        new MeshStandardMaterial({ color: new Color(color), roughness: 0.45 }),
    );
    const outline = new MeshStandardMaterial({
      color: new Color(OUTLINE_COLOR),
      roughness: 0.6,
    });
    // Your rows match the kit's light alloy; a friend's are paler.
    const yourRow = new MeshStandardMaterial({
      color: new Color("#b3aea4"),
      metalness: 0.6,
      roughness: 0.34,
    });
    const row = new MeshStandardMaterial({
      color: new Color("#dcd7cc"),
      metalness: 0.3,
      roughness: 0.45,
    });
    // Threads take their item's color (paper reads as warm gray on bone).
    const threads = THREAD_COLORS.map(
      (color) =>
        new MeshBasicMaterial({ color: new Color(color), toneMapped: false }),
    );
    return { card, box, faces, outline, yourRow, row, threads };
  }, []);

  useEffect(
    () => () => {
      const { card, box, faces, outline, yourRow, row, threads } = resources;
      [card, box].forEach((geometry) => geometry.dispose());
      [...faces, outline, yourRow, row, ...threads].forEach((material) =>
        material.dispose(),
      );
    },
    [resources],
  );

  const turn = useMemo(
    () =>
      new Quaternion().setFromEuler(
        new Euler(RANKLE_TURN.pitch, RANKLE_TURN.yaw, 0),
      ),
    [],
  );

  useFrame((state) => {
    const r = anchors.current?.rankle;
    const g = group.current;
    if (!r || !g) return;
    const { size, viewport } = state;
    const toWorld = viewport.width / size.width;
    const frameTop = rankleFrameTop(r, window.scrollY);
    const worldX = (px: number) => (px - size.width / 2) * toWorld;
    const worldY = (py: number) => (size.height / 2 - py) * toWorld;

    g.visible = frameTop > -r.frameHeight;
    if (!g.visible) return;

    const progress = scene.rankle;
    const items = ITEM_COLORS.length;

    // Supplementary bands for your rows A and C grow in with the stems.
    const [rowsFrom, rowsTo] = RANKLE_KEYS.rows;
    SUPPLEMENT_ROWS.forEach((row, i) => {
      const band = rows.current[TIERS.length + i];
      if (!band) return;
      const w = easeOut(
        smooth(rowsFrom + row * 0.025, rowsTo + row * 0.025, progress),
      );
      placeBand(band, r.you, row, w);
    });

    // A friend's board: its rows extend in, top to bottom.
    TIERS.forEach((_, row) => {
      const band = rows.current[row];
      if (band) {
        placeBand(
          band,
          r.friend,
          row,
          stagger(RANKLE_KEYS.friendRows, row, TIERS.length, progress),
        );
      }
    });

    // Cards are placed in rank order: yours slide out of the gutter into
    // their tiers, a friend's come in from the right.
    const boards = [
      {
        board: r.you,
        placement: YOU,
        range: RANKLE_KEYS.you,
        fromX:
          r.you.left +
          r.you.width +
          (r.friend.left - r.you.left - r.you.width) / 2,
      },
      {
        board: r.friend,
        placement: FRIEND,
        range: RANKLE_KEYS.friend,
        fromX: r.friend.left + r.friend.width * 1.25,
      },
    ];
    boards.forEach(({ board, placement, range, fromX }, b) => {
      const size = cardSize(board) * toWorld;
      const order = rankOrder(placement);
      for (let item = 0; item < items; item++) {
        const index = b * items + item;
        const w = stagger(range, order[item], items, progress);
        const center = cardCenter(board, placement, item);
        const x = worldX(MathUtils.lerp(fromX, center.x, w));
        const y = worldY(frameTop + center.y);
        // Lifted while it travels, set down as it lands.
        const lift = Math.sin(Math.PI * w) * size * 0.9;
        const scale = size * MathUtils.lerp(0.55, 1, w);
        const card = cards.current[index];
        const outline = outlines.current[index];
        const shown = w > 0.001;
        if (card) {
          card.visible = shown;
          card.position.set(x, y, 0.12 * size + lift);
          card.quaternion.copy(turn);
          card.scale.setScalar(scale);
        }
        if (outline) {
          outline.visible = shown;
          outline.position.set(
            x,
            y,
            0.12 * size + lift - CARD_THICKNESS * scale * 0.6,
          );
          outline.quaternion.copy(turn);
          outline.scale.set(scale * OUTLINE, scale * OUTLINE, scale);
        }
      }
    });

    // Threads draw from your board across the gutter to a friend's, one per
    // item: flat where you agree, crossing where you don't.
    const offset = (board: Rect, placement: number[], item: number) => {
      const row = placement[item];
      const shared = placement.filter((p) => p === row).length;
      const index = placement.slice(0, item).filter((p) => p === row).length;
      return (index - (shared - 1) / 2) * rowHeight(board) * 0.22;
    };
    for (let item = 0; item < items; item++) {
      const thread = threads.current[item];
      if (!thread) continue;
      const w = stagger(RANKLE_KEYS.threads, item, items, progress);
      thread.visible = w > 0.001;
      const x0 = worldX(r.you.left + r.you.width);
      const y0 = worldY(
        frameTop + rowCenter(r.you, YOU[item]) + offset(r.you, YOU, item),
      );
      const x1 = worldX(r.friend.left);
      const y1 = worldY(
        frameTop +
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

    function placeBand(band: Mesh, board: Rect, row: number, w: number) {
      band.visible = w > 0.001;
      const height = rowHeight(board) * 0.82 * toWorld;
      const width = board.width * toWorld * Math.max(w, 1e-4);
      // Grows from the board's left edge.
      band.position.set(
        worldX(board.left) + width / 2,
        worldY(frameTop + rowCenter(board, row)),
        -0.2 * height,
      );
      band.quaternion.copy(turn);
      band.scale.set(width, height, height * 0.2);
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
            material={resources.faces[index % items]}
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
