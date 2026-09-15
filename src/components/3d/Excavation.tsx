/* Excavation trench: stratigraphic walls, string grid, half-buried finds. */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, band, within } from "./util";

const STRATA = [
  { y: -0.22, h: 0.26, c: "#a58f68" },
  { y: -0.48, h: 0.26, c: "#8f7a54" },
  { y: -0.74, h: 0.26, c: "#79653f" },
  { y: -1.0, h: 0.26, c: PALETTE.deepSoil },
];

export function Excavation({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const strings = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const t = progress.current;
    const v = band(t, 0.24, 0.62, 0.07);
    g.visible = v > 0.02;
    // the trench "opens": strata sink into place as the surface is removed
    const open = within(t, 0.26, 0.42);
    g.scale.set(1, 0.4 + open * 0.6, 1);
    if (strings.current) strings.current.visible = open > 0.3;
  });

  return (
    <group ref={group} position={[0, 0, -42]}>
      {/* stratified trench walls */}
      {[-2.4, 2.4].map((x) =>
        STRATA.map((s, i) => (
          <mesh key={`${x}-${i}`} position={[x, s.y, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.2, s.h, 14]} />
            <meshStandardMaterial color={s.c} roughness={1} flatShading />
          </mesh>
        )),
      )}
      {/* end sections */}
      {[-7, 7].map((z) =>
        STRATA.map((s, i) => (
          <mesh key={`e${z}-${i}`} position={[0, s.y, z]}>
            <boxGeometry args={[2.6, s.h, 2.2]} />
            <meshStandardMaterial color={s.c} roughness={1} flatShading />
          </mesh>
        )),
      )}
      {/* trench floor */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.14, 14]} />
        <meshStandardMaterial color={PALETTE.deepSoil} roughness={1} />
      </mesh>

      {/* half-buried finds in section */}
      {[[-0.7, -1.02, 3.1], [0.6, -1.0, -2.2], [0.1, -1.05, -5.4]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0.3, i, 0.2]}>
          <cylinderGeometry args={[0.22, 0.16, 0.3, 10]} />
          <meshStandardMaterial color={PALETTE.terracotta} roughness={0.92} flatShading />
        </mesh>
      ))}

      {/* string grid over the trench */}
      <group ref={strings}>
        {[-6, -3, 0, 3, 6].map((z) => (
          <mesh key={z} position={[0, 0.34, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 5.4, 4]} />
            <meshStandardMaterial color={PALETTE.chalk} />
          </mesh>
        ))}
        {[-2.4, 0, 2.4].map((x) => (
          <mesh key={`x${x}`} position={[x, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 14, 4]} />
            <meshStandardMaterial color={PALETTE.chalk} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
