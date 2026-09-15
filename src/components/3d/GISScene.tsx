/* GIS / spatial data: topographic contours, site points, survey routes,
   a river course and a coordinate grid. Object → spatial data → landscape. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, band, terrainHeight } from "./util";

const CENTER_Z = -86;

export function GISScene({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const contours = useMemo(() => {
    const out: THREE.BufferGeometry[] = [];
    for (let c = 0; c < 7; c++) {
      const pts: number[] = [];
      const rad = 6 + c * 3.2;
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        const wob = Math.sin(a * 3 + c) * 1.3 + Math.cos(a * 5 - c) * 0.7;
        const r = rad + wob;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r * 0.75;
        pts.push(x, 0.05 + c * 0.05, z);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
      out.push(g);
    }
    return out;
  }, []);

  const river = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 80; i++) {
      const z = -30 + (i / 80) * 60;
      const x = Math.sin(i * 0.12) * 7 - 4;
      pts.push(x, 0.12, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  const route = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 1.6;
      pts.push(Math.cos(a) * 14, 0.2, Math.sin(a) * 11);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, []);

  const sitePoints = useMemo(() => {
    let s = 29;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    return Array.from({ length: 12 }, () => {
      const x = (rnd() - 0.5) * 34;
      const z = (rnd() - 0.5) * 26;
      return [x, 0.4 + rnd() * 1.6, z] as [number, number, number];
    });
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const v = band(progress.current, 0.7, 0.86, 0.06);
    g.visible = v > 0.02;
    g.rotation.y += dt * 0.008;
    g.scale.setScalar(0.85 + v * 0.15);
  });

  return (
    <group ref={group} position={[0, terrainHeight(0, CENTER_Z) + 0.3, CENTER_Z]}>
      {contours.map((g, i) => (
        <line key={i}>
          <primitive object={g} attach="geometry" />
          <lineBasicMaterial color={PALETTE.line} transparent opacity={0.5} />
        </line>
      ))}

      <line>
        <primitive object={river} attach="geometry" />
        <lineBasicMaterial color="#5e7f8a" transparent opacity={0.8} />
      </line>

      <line>
        <primitive object={route} attach="geometry" />
        <lineBasicMaterial color={PALETTE.terracotta} transparent opacity={0.7} />
      </line>

      {/* coordinate grid */}
      <gridHelper args={[70, 28, PALETTE.line, "#b6a57f"]} position={[0, 0.02, 0]} />

      {/* archaeological site markers */}
      {sitePoints.map((p, i) => (
        <group key={i} position={[p[0], 0, p[2]]}>
          <mesh position={[0, p[1] / 2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, p[1], 6]} />
            <meshBasicMaterial color={PALETTE.terracotta} transparent opacity={0.65} />
          </mesh>
          <mesh position={[0, p[1], 0]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color={PALETTE.terracotta} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
