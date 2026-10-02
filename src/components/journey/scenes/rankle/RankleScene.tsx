import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  Color,
  Euler,
  ExtrudeGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  Shape,
  type Group,
  type Mesh,
} from "three";
import { scene } from "@/lib/motion/scene-progress";
import { rankleFrameTop, type Anchors } from "../../canvas/anchors";
import {
  cardCenter,
  cardSize,
  FRIEND,
  ITEM_COLORS,
  OUTLINE_COLOR,
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
 */

const CARD_THICKNESS = 0.16;
const THREAD_COLORS = ITEM_COLORS.map((color, item) =>
  item === ITEM_COLORS.length - 1 ? "#9c978d" : color,
);
const THREAD_WIDTH = 3;
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

    // Composed once the plates have arrived (choreography: checkpoint G).
    g.visible = scene.hero > 0.98 && frameTop > -r.frameHeight;
    if (!g.visible) return;

    const items = ITEM_COLORS.length;
    const boards = [
      { board: r.you, placement: YOU },
      { board: r.friend, placement: FRIEND },
    ];

    boards.forEach(({ board, placement }, b) => {
      const size = cardSize(board) * toWorld;
      for (let item = 0; item < items; item++) {
        const index = b * items + item;
        const center = cardCenter(board, placement, item);
        const x = worldX(center.x);
        const y = worldY(frameTop + center.y);
        const card = cards.current[index];
        const outline = outlines.current[index];
        if (card) {
          card.position.set(x, y, 0.12 * size);
          card.quaternion.copy(turn);
          card.scale.setScalar(size);
        }
        if (outline) {
          outline.position.set(x, y, 0.12 * size - CARD_THICKNESS * size * 0.6);
          outline.quaternion.copy(turn);
          outline.scale.set(size * OUTLINE, size * OUTLINE, size);
        }
      }
    });

    // Bands: a friend's five rows, then your two supplementary rows.
    const bandRows = [
      ...TIERS.map((_, row) => ({ board: r.friend, row })),
      ...SUPPLEMENT_ROWS.map((row) => ({ board: r.you, row })),
    ];
    bandRows.forEach(({ board, row }, index) => {
      const band = rows.current[index];
      if (!band) return;
      const height = rowHeight(board) * 0.82 * toWorld;
      band.position.set(
        worldX(board.left + board.width / 2),
        worldY(frameTop + rowCenter(board, row)),
        -0.2 * height,
      );
      band.quaternion.copy(turn);
      band.scale.set(board.width * toWorld, height, height * 0.2);
    });

    // Threads cross the gutter: from the end of an item's row on your board
    // to its row on a friend's. Items sharing a row are offset slightly.
    const offset = (board: typeof r.you, placement: number[], item: number) => {
      const row = placement[item];
      const shared = placement.filter((p) => p === row).length;
      const index = placement.slice(0, item).filter((p) => p === row).length;
      return (index - (shared - 1) / 2) * rowHeight(board) * 0.22;
    };
    for (let item = 0; item < items; item++) {
      const thread = threads.current[item];
      if (!thread) continue;
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
      const length = Math.hypot(x1 - x0, y1 - y0);
      thread.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0);
      thread.rotation.set(0, 0, Math.atan2(y1 - y0, x1 - x0));
      thread.scale.set(length, THREAD_WIDTH * toWorld, THREAD_WIDTH * toWorld);
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
