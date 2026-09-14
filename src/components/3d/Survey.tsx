/* Field survey + archaeological site: survey grid, scattered sherds,
   GPS / datum markers and surface features. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, band, terrainLift } from "./util";

/** Long survey transect lines that follow the camera down the field. */
export function SurveyGrid({ progress }: { progress: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let i = -8; i <= 8; i++) {
      const gv = new THREE.BufferGeometry();
      gv.setAttribute("position", new THREE.BufferAttribute(new Float32Array([i * 4, 0.06, 0, i * 4, 0.06, -34]), 3));
      const gh = new THREE.BufferGeometry();
      gh.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-32, 0.06, i * 4, 32, 0.06, i * 4]), 3));
      out.push(
        <lineSegments key={`v${i}`} geometry={gv}>
          <lineBasicMaterial color={PALETTE.line} transparent opacity={0.4} />
        </lineSegments>,
        <lineSegments key={`h${i}`} geometry={gh}>
          <lineBasicMaterial color={PALETTE.line} transparent opacity={0.4} />
        </lineSegments>,
      );
    }
    return out;
  }, []);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.position.z = Math.round(state.camera.position.z / 10) * 10 - 28;
    const v = band(progress.current, 0.08, 0.46, 0.06);
    g.visible = v > 0.02;
    g.scale.setScalar(0.94 + v * 0.06);
  });

  return <group ref={ref}>{lines}</group>;
}

/** Surface finds: pottery fragments, lithic debris and datum pegs. */
export function SurveyFinds({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const finds = useMemo(() => {
    let s = 13;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    return Array.from({ length: 26 }, (_, i) => {
      const x = (rnd() - 0.5) * 26;
      const z = -8 - rnd() * 30;
      return {
        kind: (["sherd", "flake", "cobble"] as const)[i % 3],
        pos: [x, terrainLift(x, z) + 0.08, z] as [number, number, number],
        rot: [Math.PI / 2 + (rnd() - 0.5) * 0.5, rnd() * Math.PI, rnd() * Math.PI] as [number, number, number],
        scale: 0.22 + rnd() * 0.3,
      };
    });
  }, []);

  const pegs = useMemo(
    () => Array.from({ length: 8 }, (_, i) => {
      const x = ((i % 4) - 1.5) * 7;
      const z = -10 - Math.floor(i / 4) * 16;
      return [x, terrainLift(x, z), z] as [number, number, number];
    }),
    [],
  );

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const v = band(progress.current, 0.1, 0.44, 0.06);
    g.visible = v > 0.02;
  });

  return (
    <group ref={group}>
      {finds.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale}>
          {f.kind === "sherd" ? (
            <cylinderGeometry args={[0.5, 0.42, 0.1, 9, 1]} />
          ) : f.kind === "flake" ? (
            <coneGeometry args={[0.3, 0.6, 5]} />
          ) : (
            <dodecahedronGeometry args={[0.36, 0]} />
          )}
          <meshStandardMaterial
            color={f.kind === "sherd" ? PALETTE.terracotta : f.kind === "flake" ? "#7d7469" : "#5f5341"}
            roughness={0.95}
            flatShading
          />
        </mesh>
      ))}

      {/* survey / GPS datum pegs */}
      {pegs.map((p, i) => (
        <group key={`p${i}`} position={p}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 6]} />
            <meshStandardMaterial color="#4c4335" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.95, 0]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[0.28, 0.18, 0.01]} />
            <meshStandardMaterial color={PALETTE.chalk} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Low structural remains — wall stubs at the archaeological site. */
export function SiteFeatures({ progress }: { progress: React.MutableRefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => {
    if (g.current) g.current.visible = band(progress.current, 0.2, 0.48, 0.06) > 0.02;
  });
  const walls = useMemo(
    () => [
      { pos: [-6, 0.2, -26] as [number, number, number], size: [5.5, 0.42, 0.7] as [number, number, number], rot: 0.1 },
      { pos: [-8.6, 0.2, -29] as [number, number, number], size: [0.7, 0.42, 5.2] as [number, number, number], rot: 0.1 },
      { pos: [6.4, 0.18, -30] as [number, number, number], size: [4.4, 0.36, 0.65] as [number, number, number], rot: -0.22 },
      { pos: [4.2, 0.16, -21] as [number, number, number], size: [3.2, 0.3, 0.6] as [number, number, number], rot: 0.35 },
    ],
    [],
  );
  return (
    <group ref={g}>
      {walls.map((w, i) => (
        <mesh key={i} position={w.pos} rotation={[0, w.rot, 0]}>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color="#9c8c6d" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}
