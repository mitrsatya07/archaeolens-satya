/* A legible archaeological point-cloud volume for the Index → Careers passage.
   It evokes a surveyed ruin without claiming a real site's measurements. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, band } from "./util";

const CENTRE_Z = -98;

function seededPoints(count: number) {
  let seed = 1937;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const values = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 2.8 + random() * 4.5;
    const wallBias = i % 4;
    const x = wallBias < 2 ? (random() - 0.5) * 13 : Math.cos(angle) * radius;
    const z = wallBias >= 2 ? (random() - 0.5) * 9 : Math.sin(angle) * radius;
    const brokenTop = 2.1 + Math.sin(x * 0.65) * 0.7 + random() * 1.8;
    const y = random() * Math.max(0.35, brokenTop);

    values[i * 3] = x;
    values[i * 3 + 1] = y;
    values[i * 3 + 2] = z;
  }
  return values;
}

export function SpatialArchive({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Points>(null);
  const positions = useMemo(() => seededPoints(qualityPointCount()), []);

  useFrame((state) => {
    const root = group.current;
    if (!root) return;
    const visibility = band(progress.current, 0.76, 0.965, 0.055);
    root.visible = visibility > 0.02;
    if (!root.visible) return;
    root.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.035;
    const material = cloud.current?.material as THREE.PointsMaterial | undefined;
    if (material) material.opacity = visibility * 0.82;
  });

  return (
    <group ref={group} position={[0, 0.15, CENTRE_Z]}>
      <points ref={cloud}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={PALETTE.ink}
          size={0.105}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <mesh position={[0, 2.35, 0]}>
        <boxGeometry args={[15, 5, 10, 6, 3, 5]} />
        <meshBasicMaterial
          color={PALETTE.line}
          wireframe
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <planeGeometry args={[20, 14, 10, 7]} />
        <meshBasicMaterial
          color={PALETTE.line}
          wireframe
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function qualityPointCount() {
  if (typeof window === "undefined") return 1150;
  return window.matchMedia("(max-width: 900px)").matches ? 600 : 1500;
}