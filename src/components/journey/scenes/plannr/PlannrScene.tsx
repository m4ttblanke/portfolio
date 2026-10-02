import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  Color,
  Euler,
  InstancedMesh,
  MathUtils,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
  type Group,
  type Mesh,
} from "three";
import { scene } from "@/lib/motion/scene-progress";
import { frameTop, type Anchors } from "../../canvas/anchors";
import {
  CALENDAR,
  HANDOFF_KEYS,
  highlight,
  ITEM_LINE,
  line,
  LINE_COUNT,
  LINE_SURFACE,
  pageAt,
  PLANNR_COLORS,
  PLANNR_KEYS,
  PLANNR_TURN,
  plannrPivot,
  ROW_LINE,
} from "./plannrPose";

/*
 * Plannr's own objects: the syllabus page, the lines Rankle didn't provide,
 * the highlighted dates, and the calendar sheet. (Rankle's rows become the
 * date lines and its cards the date chips — see Kit and RankleScene.)
 * Sheets share Rankle's outlined-card language: paper over an ink backing.
 */

const EXTRA_LINES = Array.from({ length: LINE_COUNT }, (_, i) => i).filter(
  (i) => !ROW_LINE.includes(i),
);
const GRID_LINES = CALENDAR.columns - 1 + CALENDAR.rows;
const OUTLINE_PX = 2.5;
const SHEET_DEPTH_PX = 6;

const smooth = (edge0: number, edge1: number, x: number) =>
  MathUtils.smoothstep(x, edge0, edge1);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function stagger(
  range: readonly [number, number],
  n: number,
  count: number,
  progress: number,
) {
  const [from, to] = range;
  const length = (to - from) * 0.5;
  const step = count > 1 ? (to - from - length) / (count - 1) : 0;
  return easeOut(MathUtils.clamp((progress - from - n * step) / length, 0, 1));
}

export function PlannrScene({
  anchors,
}: {
  anchors: RefObject<Anchors | null>;
}) {
  const group = useRef<Group>(null);
  const page = useRef<Mesh>(null);
  const pageBack = useRef<Mesh>(null);
  const lines = useRef<(Mesh | null)[]>([]);
  const marks = useRef<(Mesh | null)[]>([]);
  const sheet = useRef<Mesh>(null);
  const sheetBack = useRef<Mesh>(null);
  const header = useRef<Mesh>(null);
  const grid = useRef<InstancedMesh>(null);

  const resources = useMemo(() => {
    const box = new BoxGeometry(1, 1, 1);
    const paper = new MeshStandardMaterial({
      color: new Color(PLANNR_COLORS.paper),
      roughness: 0.7,
    });
    const ink = new MeshStandardMaterial({
      color: new Color("#0e0e0c"),
      roughness: 0.6,
    });
    const lineMaterial = new MeshStandardMaterial({
      color: new Color(PLANNR_COLORS.line),
      ...LINE_SURFACE,
    });
    const gold = new MeshStandardMaterial({
      color: new Color(PLANNR_COLORS.gold),
      roughness: 0.55,
    });
    const navy = new MeshStandardMaterial({
      color: new Color(PLANNR_COLORS.navy),
      roughness: 0.5,
    });
    return { box, paper, ink, lineMaterial, gold, navy };
  }, []);

  useEffect(
    () => () => {
      const { box, ...materials } = resources;
      box.dispose();
      Object.values(materials).forEach((material) => material.dispose());
    },
    [resources],
  );

  const scratch = useMemo(
    () => ({
      turn: new Quaternion().setFromEuler(
        new Euler(PLANNR_TURN.pitch, PLANNR_TURN.yaw, 0),
      ),
      dummy: new Object3D(),
      pivot: new Vector3(),
    }),
    [],
  );

  useFrame((state) => {
    const p = anchors.current?.plannr;
    const g = group.current;
    if (!p || !g) return;
    const { size, viewport } = state;
    const toWorld = viewport.width / size.width;
    const top = frameTop(p, window.scrollY);
    const worldX = (px: number) => (px - size.width / 2) * toWorld;
    const worldY = (py: number) => (size.height / 2 - py) * toWorld;
    const handoff = scene.handoff;
    // Everything here lies on one plane, turned rigidly about the stage
    // center, so small depth offsets between sheet, lines and marks hold.
    const pv = plannrPivot(p);
    scratch.pivot.set(worldX(pv.x), worldY(top + pv.y), 0);
    const onPlane = (out: Vector3, x: number, y: number, z: number) =>
      out
        .set(worldX(x), worldY(top + y), z * toWorld)
        .sub(scratch.pivot)
        .applyQuaternion(scratch.turn)
        .add(scratch.pivot);
    const progress = scene.plannr;

    g.visible = handoff > 0.001 && top > -p.frameHeight;
    if (!g.visible) return;

    /** Place a flat slab from a frame-relative px rect (center + size). */
    const place = (
      mesh: Mesh | null,
      x: number,
      y: number,
      width: number,
      height: number,
      depth: number,
      z: number,
    ) => {
      if (!mesh) return;
      mesh.visible = width > 0.5 && height > 0.5;
      onPlane(mesh.position, x, y, z);
      mesh.quaternion.copy(scratch.turn);
      mesh.scale.set(
        Math.max(width, 1e-3) * toWorld,
        Math.max(height, 1e-3) * toWorld,
        depth * toWorld,
      );
    };

    // The page unrolls downward beneath Rankle's arriving rows.
    const pageGrow = easeOut(smooth(...HANDOFF_KEYS.page, handoff));
    const pageRect = pageAt(p, progress);
    const pageHeight = pageRect.height * pageGrow;
    const pageY = pageRect.top + pageHeight / 2;
    const pageX = pageRect.left + pageRect.width / 2;
    place(
      page.current,
      pageX,
      pageY,
      pageRect.width,
      pageHeight,
      SHEET_DEPTH_PX,
      -12,
    );
    place(
      pageBack.current,
      pageX,
      pageY,
      pageRect.width + OUTLINE_PX * 2,
      pageHeight + OUTLINE_PX * 2 * pageGrow,
      SHEET_DEPTH_PX,
      -16,
    );

    // The rest of the syllabus lines draw in, top to bottom.
    EXTRA_LINES.forEach((index, n) => {
      const l = line(pageRect, index);
      const w = stagger(HANDOFF_KEYS.lines, n, EXTRA_LINES.length, handoff);
      const width = l.width * w;
      place(lines.current[n], l.left + width / 2, l.y, width, l.height, 2, -4);
    });

    // Dates: each date's span on its line is marked, like a highlighter.
    ITEM_LINE.forEach((_, item) => {
      const h = highlight(pageRect, item);
      const w = stagger(PLANNR_KEYS.dates, item, ITEM_LINE.length, progress);
      const width = h.width * w;
      place(
        marks.current[item],
        h.x - h.width / 2 + width / 2,
        h.y,
        width,
        h.height,
        2,
        -6,
      );
    });

    // Calendar: the sheet unrolls, its header band and grid draw in.
    const cal = p.calendar;
    const calGrow = easeOut(smooth(...PLANNR_KEYS.calendar, progress));
    const calHeight = cal.height * calGrow;
    const calX = cal.left + cal.width / 2;
    const calY = cal.top + calHeight / 2;
    place(sheet.current, calX, calY, cal.width, calHeight, SHEET_DEPTH_PX, -12);
    place(
      sheetBack.current,
      calX,
      calY,
      cal.width + OUTLINE_PX * 2,
      calHeight + OUTLINE_PX * 2 * calGrow,
      SHEET_DEPTH_PX,
      -16,
    );
    const headerHeight = Math.min(cal.height * CALENDAR.header, calHeight);
    place(
      header.current,
      calX,
      cal.top + headerHeight / 2,
      cal.width,
      headerHeight,
      SHEET_DEPTH_PX,
      -10,
    );

    const gridMesh = grid.current;
    if (gridMesh) {
      const gridDraw = easeOut(
        smooth(
          PLANNR_KEYS.calendar[0] + 0.04,
          PLANNR_KEYS.calendar[1] + 0.04,
          progress,
        ),
      );
      gridMesh.visible = gridDraw > 0.001;
      const bodyTop = cal.top + cal.height * CALENDAR.header;
      const bodyHeight = cal.height * (1 - CALENDAR.header);
      const { dummy } = scratch;
      let i = 0;
      // Column rules grow down; row rules grow across.
      for (let c = 1; c < CALENDAR.columns; c++, i++) {
        const length = bodyHeight * gridDraw;
        const x = cal.left + (c * cal.width) / CALENDAR.columns;
        setRule(dummy, x, bodyTop + length / 2, 1.5, length);
        gridMesh.setMatrixAt(i, dummy.matrix);
      }
      for (let r = 0; r < CALENDAR.rows; r++, i++) {
        const length = cal.width * gridDraw;
        const y = bodyTop + (r * bodyHeight) / CALENDAR.rows;
        setRule(dummy, cal.left + length / 2, y, length, 1.5);
        gridMesh.setMatrixAt(i, dummy.matrix);
      }
      gridMesh.instanceMatrix.needsUpdate = true;
    }

    function setRule(
      dummy: Object3D,
      x: number,
      y: number,
      width: number,
      height: number,
    ) {
      onPlane(dummy.position, x, y, -9);
      dummy.quaternion.copy(scratch.turn);
      dummy.scale.set(
        Math.max(width, 1e-3) * toWorld,
        Math.max(height, 1e-3) * toWorld,
        toWorld,
      );
      dummy.updateMatrix();
    }
  });

  const { box, paper, ink, lineMaterial, gold, navy } = resources;
  return (
    <group ref={group} visible={false}>
      <mesh ref={page} geometry={box} material={paper} />
      <mesh ref={pageBack} geometry={box} material={ink} />
      {EXTRA_LINES.map((index, n) => (
        <mesh
          key={index}
          ref={(mesh) => {
            lines.current[n] = mesh;
          }}
          geometry={box}
          material={lineMaterial}
        />
      ))}
      {ITEM_LINE.map((index, item) => (
        <mesh
          key={index}
          ref={(mesh) => {
            marks.current[item] = mesh;
          }}
          geometry={box}
          material={gold}
        />
      ))}
      <mesh ref={sheet} geometry={box} material={paper} />
      <mesh ref={sheetBack} geometry={box} material={ink} />
      <mesh ref={header} geometry={box} material={navy} />
      <instancedMesh
        ref={grid}
        args={[box, navy, GRID_LINES]}
        frustumCulled={false}
      />
    </group>
  );
}
