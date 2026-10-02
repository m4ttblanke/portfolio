/*
 * TEMPORARY — P0 calibration only. Remove in P1.
 *
 * Exists solely to validate rendering, camera, lighting, resize, layering,
 * and lifecycle of the persistent canvas. It is not art direction.
 */
export function CalibrationObject() {
  return (
    <mesh position={[1.6, -0.4, 0]} rotation={[0.4, 0.6, 0]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#c9c9c4" flatShading />
    </mesh>
  );
}
