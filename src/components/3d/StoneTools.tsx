/* Stone tools chapter — a sequence of lithic forms the camera travels past.
   The tool nearest the camera lifts and highlights as you scroll through. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { band, terrainHeight, within } from "./util";

type Kind = "handaxe" | "blade" | "core" | "scraper" | "point" | "microlith";

const TOOLS: { kind: Kind; x: number; z: number }[] = [
  { kind: "handaxe", x: -3.4, z: -92 },
  { kind: "blade", x: 3.2, z: -95 },
  { kind: "core", x: -3.0, z: -98 },
  { kind: "scraper", x: 3.4, z: -101 },
  { kind: "point", x: -3.2, z: -104 },
  { kind: "microlith", x: 3.0, z: -107 },
];

function ToolGeometry({ kind }: { kind: Kind }) {
  switch (kind) {
    case "handaxe":
      return <coneGeometry args={[0.34, 0.86, 6]} />;
    case "blade":
      return <boxGeometry args={[0.12, 0.72, 0.26]} />;
    case "core":
      return <dodecahedronGeometry args={[0.36, 0]} />;
    case "scraper":
      return <cylinderGeometry args={[0.36, 0.3, 0.12, 7]} />;
    case "point":
      return <coneGeometry args={[0.2, 0.62, 5]} />;
    default:
      return <tetrahedronGeometry args={[0.22, 0]} />;
  }
}

export function StoneTools({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);

  const plinths = useMemo(
    () => TOOLS.map((t) => ({ ...t, y: terrainHeight(t.x, t.z) })),
    [],
  );

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = progress.current;
    g.visible = band(t, 0.78, 0.92, 0.05) > 0.02;
    if (!g.visible) return;

    const camZ = state.camera.position.z;
    refs.current.forEach((node, i) => {
      if (!node) return;
      node.rotation.y += dt * 0.25;
      const near = THREE.MathUtils.clamp(1 - Math.abs(camZ - plinths[i].z) / 9, 0, 1);
      const lift = 0.9 + near * 0.35;
      node.position.y = plinths[i].y + lift + Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.03;
      node.scale.setScalar(0.9 + near * 0.35);
      const mesh = node.children[0] as THREE.Mesh | undefined;
      const mat = mesh?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.emissiveIntensity = near * 0.25;
    });
  });

  return (
    <group ref={group}>
      {plinths.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          {/* low field plinth */}
          <mesh position={[0, p.y + 0.45, 0]} receiveShadow>
            <cylinderGeometry args={[0.4, 0.5, 0.9, 20]} />
            <meshStandardMaterial color="#b6a781" roughness={0.95} />
          </mesh>
          <group ref={(n) => { refs.current[i] = n; }} position={[0, p.y + 1.1, 0]}>
            <mesh castShadow rotation={[0.2, 0, 0.1]}>
              <ToolGeometry kind={p.kind} />
              <meshStandardMaterial
                color={i % 2 ? "#7d7469" : "#5f5341"}
                roughness={0.9}
                flatShading
                emissive="#a85b3c"
                emissiveIntensity={0}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/** Field Notes chapter — calm recording props: notebook, scale bar, frames. */
export function FieldRecording({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = band(progress.current, 0.86, 0.95, 0.04) > 0.02;
  });
  const y = terrainHeight(0, -112);
  return (
    <group ref={group} position={[0, y, -112]}>
      {/* open field notebook */}
      <mesh position={[-0.9, 0.9, 0]} rotation={[-Math.PI / 2.2, 0, 0.1]}>
        <boxGeometry args={[1.3, 0.9, 0.04]} />
        <meshStandardMaterial color="#f2e7cd" roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.88, 0]} rotation={[-Math.PI / 2.2, 0, -0.08]}>
        <boxGeometry args={[1.3, 0.9, 0.04]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.9} />
      </mesh>
      {/* 10 cm scale bar */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-0.6 + i * 0.4, 0.42, 1.2]}>
          <boxGeometry args={[0.4, 0.06, 0.1]} />
          <meshStandardMaterial color={i % 2 ? "#2b2418" : "#f2e7cd"} roughness={0.8} />
        </mesh>
      ))}
      {/* photograph frames */}
      {[-2.6, 2.6].map((x, i) => (
        <mesh key={x} position={[x, 1.3, -0.6 - i]} rotation={[0, x > 0 ? -0.4 : 0.4, 0]}>
          <planeGeometry args={[1.5, 1.05]} />
          <meshBasicMaterial color="#efe7d5" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* coordinate markers */}
      {[[-2, 0, 2], [2, 0, 2], [-2, 0, -2], [2, 0, -2]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.25, p[2]]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
          <meshStandardMaterial color="#4c4335" />
        </mesh>
      ))}
    </group>
  );
}

/** Index chapter — spatial markers for the site's departments, seen from above. */
export function IndexMarkers({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const marks = useMemo(
    () => Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2;
      const x = Math.cos(a) * 12;
      const z = -116 + Math.sin(a) * 9;
      return { x, z, y: terrainHeight(x, z) };
    }),
    [],
  );
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const v = band(progress.current, 0.9, 0.97, 0.03);
    g.visible = v > 0.02;
    g.children.forEach((c, i) => {
      c.position.y = marks[i].y + 0.6 + Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.08;
    });
  });
  return (
    <group ref={group}>
      {marks.map((m, i) => (
        <mesh key={i} position={[m.x, m.y + 0.6, m.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.5, 24]} />
          <meshBasicMaterial color="#a85b3c" transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/** Bibliography chapter — quiet archival fragments and a reference grid. */
export function ArchiveFragments({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const sheets = useMemo(() => {
    let s = 41;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    return Array.from({ length: 10 }, () => ({
      pos: [(rnd() - 0.5) * 14, 1 + rnd() * 5, -124 - rnd() * 12] as [number, number, number],
      rot: [(rnd() - 0.5) * 0.5, (rnd() - 0.5) * 1.6, (rnd() - 0.5) * 0.3] as [number, number, number],
      scale: 0.7 + rnd() * 0.6,
    }));
  }, []);
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.visible = band(progress.current, 0.93, 1.0, 0.03) > 0.02;
    g.children.forEach((c, i) => {
      c.rotation.y += dt * 0.03;
      c.position.y = sheets[i].pos[1] + Math.sin(state.clock.elapsedTime * 0.35 + i) * 0.12;
    });
  });
  return (
    <group ref={group}>
      {sheets.map((sh, i) => (
        <mesh key={i} position={sh.pos} rotation={sh.rot} scale={sh.scale}>
          <planeGeometry args={[1.4, 1.9]} />
          <meshBasicMaterial color="#f4ecdb" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export const phaseWithin = within;
