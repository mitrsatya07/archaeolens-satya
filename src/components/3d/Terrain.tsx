/* Terrain + atmospheric dust — the continuous archaeological landscape. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE } from "./journey";

export const terrainHeight = (x: number, z: number) =>
  Math.sin(x * 0.05) * Math.cos(z * 0.045) * 1.6 +
  Math.sin(x * 0.13 + z * 0.09) * 0.45 +
  Math.cos(z * 0.19) * 0.3;

/** Rolling ground that re-centres under the camera so the field never ends. */
export function Terrain({ segments = 90 }: { segments?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(200, 260, segments, Math.round(segments * 1.2));
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, terrainHeight(pos.getX(i), -pos.getY(i)));
    }
    g.computeVertexNormals();
    return g;
  }, [segments]);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    m.position.z = Math.min(0, state.camera.position.z) - 60;
  });

  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -70]}>
      <meshStandardMaterial color={PALETTE.sand} roughness={1} flatShading />
    </mesh>
  );
}

/** Fine airborne dust — restrained, archaeological, never sparkly. */
export function Particles({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = Math.random() * 16;
      pos[i * 3 + 2] = -Math.random() * 170 + 10;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.015;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.07} color="#a08b60" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}
