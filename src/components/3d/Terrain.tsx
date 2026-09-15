/* Terrain + atmospheric dust — the continuous archaeological landscape. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, terrainHeight } from "./util";

/** Static rolling ground spanning the whole journey corridor. */
export function Terrain({ segments = 110 }: { segments?: number }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(240, 320, segments, Math.round(segments * 1.2));
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const worldZ = -pos.getY(i) - 70;
      pos.setZ(i, terrainHeight(x, worldZ));
    }
    g.computeVertexNormals();
    return g;
  }, [segments]);

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -70]} receiveShadow>
      <meshStandardMaterial color={PALETTE.sand} roughness={1} flatShading />
    </mesh>
  );
}

/** Fine airborne dust — restrained, never sparkly. */
export function Particles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 18;
      pos[i * 3 + 2] = -Math.random() * 190 + 15;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.07} color="#a08b60" transparent opacity={0.42} sizeAttenuation depthWrite={false} />
    </points>
  );
}
