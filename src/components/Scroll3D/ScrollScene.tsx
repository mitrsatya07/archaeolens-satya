/* Scroll-driven 3D: the camera journeys from an aerial archaeological
   landscape, down to survey-grid ground level, through an excavation
   trench, and rises back to the wide landscape. Editorial paper palette. */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "./useScrollProgress";

const FOG_COLOR = "#e9dfc9"; // matches the editorial paper background

type Key = { t: number; pos: [number, number, number]; look: [number, number, number] };

/* Master journey keyframes — terrain surface is y=0 */
const KEYS: Key[] = [
  { t: 0.0,  pos: [0, 20, 8],     look: [0, 0, -40] },   // aerial landscape
  { t: 0.18, pos: [3, 4.5, -10],  look: [0, 0.5, -30] }, // descending to the field
  { t: 0.34, pos: [1.5, 1.7, -22], look: [0, 0.5, -34] },// field-survey walk
  { t: 0.48, pos: [0.8, 1.2, -30], look: [0, 0.4, -38] },// approaching the trench
  { t: 0.58, pos: [0, 0.9, -36],  look: [0, 0.5, -40] }, // inside the trench
  { t: 0.68, pos: [0, 2.2, -32],  look: [0, 0.5, -42] }, // rising, looking back
  { t: 0.85, pos: [2, 8, -16],    look: [0, 0, -50] },   // climbing away
  { t: 1.0,  pos: [0, 20, 8],     look: [0, 0, -40] },   // wide landscape again
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function sampleCamera(p: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const c = Math.min(0.999, Math.max(0, p));
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1].t < c) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const local = smooth((c - a.t) / (b.t - a.t || 1));
  return {
    pos: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.pos), new THREE.Vector3(...b.pos), local),
    look: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.look), new THREE.Vector3(...b.look), local),
  };
}

/* ── Terrain: gently rolling sand ground that follows the camera ──── */

const terrainHeight = (x: number, z: number) =>
  Math.sin(x * 0.05) * Math.cos(z * 0.045) * 1.6 +
  Math.sin(x * 0.13 + z * 0.09) * 0.45 +
  Math.cos(z * 0.19) * 0.3;

const Terrain: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(160, 220, 90, 110);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // becomes -z after rotation
      pos.setZ(i, terrainHeight(x, -y));
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    m.position.z = Math.min(0, state.camera.position.z) - 60;
  });
  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -70]}>
      <meshStandardMaterial color="#cdbb98" roughness={1} flatShading />
    </mesh>
  );
};

/* ── Survey grid: long straight lines across the ground (always on) ── */

const SurveyGrid: React.FC = () => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.position.z = Math.round(state.camera.position.z / 10) * 10 - 30;
  });
  const lines = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let i = -8; i <= 8; i++) {
      const gv = new THREE.BufferGeometry();
      gv.setAttribute("position", new THREE.BufferAttribute(new Float32Array([i * 4, 0.06, 0, i * 4, 0.06, -30]), 3));
      const gh = new THREE.BufferGeometry();
      gh.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-32, 0.06, i * 4, 32, 0.06, i * 4]), 3));
      out.push(
        <lineSegments key={`v${i}`} geometry={gv}>
          <lineBasicMaterial color="#8a744f" transparent opacity={0.4} />
        </lineSegments>,
        <lineSegments key={`h${i}`} geometry={gh}>
          <lineBasicMaterial color="#8a744f" transparent opacity={0.4} />
        </lineSegments>,
      );
    }
    return out;
  }, []);
  return (
    <group ref={ref}>
      {lines}
    </group>
  );
};

/* ── Excavation trench at the journey focus point ──────────────────── */

const Trench: React.FC = () => {
  const strata = [
    { y: -0.2, h: 0.24, c: "#a58f68" },
    { y: -0.44, h: 0.24, c: "#8f7a54" },
    { y: -0.68, h: 0.24, c: "#79653f" },
  ];
  return (
    <group position={[0, 0, -38]}>
      {/* strata walls left and right */}
      {[-2, 2].map((x) =>
        strata.map((s, i) => (
          <mesh key={`${x}-${i}`} position={[x, s.y, 0]}>
            <boxGeometry args={[2, s.h, 8]} />
            <meshStandardMaterial color={s.c} roughness={1} />
          </mesh>
        )),
      )}
      {/* trench floor */}
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[2, 0.12, 8]} />
        <meshStandardMaterial color="#6b5a38" roughness={1} />
      </mesh>
      {/* the revealed pot, half-buried */}
      <mesh position={[0, -0.62, -1]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.32, 0.2, 0.55, 16, 1, true]} />
        <meshStandardMaterial color="#9a5b3c" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* string grid over the trench */}
      {[0, 2, 4, 6, 8].map((i) => (
        <mesh key={i} position={[0, 0.35, -4 + i * 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 4, 4]} />
          <meshStandardMaterial color="#f2e7cd" />
        </mesh>
      ))}
      {[-2, 0, 2].map((x) => (
        <mesh key={`x${x}`} position={[x, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 8, 4]} />
          <meshStandardMaterial color="#f2e7cd" />
        </mesh>
      ))}
    </group>
  );
};

/* ── Floating artefact field: meshes the camera passes on its journey ─ */

const FloatingArtifacts: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    // deterministic pseudo-random scatter along the trench corridor
    let s = 7;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const kinds: Array<"sherd" | "blade" | "stone"> = ["sherd", "blade", "stone"];
    return Array.from({ length: 14 }, (_, i) => ({
      kind: kinds[i % 3],
      pos: [(rnd() - 0.5) * 16, 0.6 + rnd() * 5, -14 - rnd() * 30] as [number, number, number],
      rot: [rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI] as [number, number, number],
      scale: 0.35 + rnd() * 0.5,
      speed: 0.1 + rnd() * 0.25,
    }));
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((c, i) => {
      c.rotation.x += dt * items[i].speed;
      c.rotation.y += dt * items[i].speed * 0.7;
      c.position.y += Math.sin(state.clock.elapsedTime * 0.6 + i) * dt * 0.12;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={it.rot} scale={it.scale}>
          {it.kind === "sherd" ? (
            <cylinderGeometry args={[0.5, 0.38, 0.16, 9, 1]} />
          ) : it.kind === "blade" ? (
            <coneGeometry args={[0.22, 0.9, 5]} />
          ) : (
            <dodecahedronGeometry args={[0.42, 0]} />
          )}
          <meshStandardMaterial
            color={it.kind === "sherd" ? "#9a5b3c" : it.kind === "blade" ? "#7d7469" : "#5f5341"}
            roughness={0.9}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
};

/* ── Scene rig: scroll → camera + subtle mouse parallax ────────────── */

const DUST_COUNT = 260;

const SceneRig: React.FC<{ progress: React.MutableRefObject<number> }> = ({ progress }) => {
  const cur = useRef({ pos: new THREE.Vector3(...KEYS[0].pos), look: new THREE.Vector3(...KEYS[0].look) });
  const dustRef = useRef<THREE.Points>(null);

  const dust = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = -Math.random() * 80 + 8;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state, dt) => {
    const target = sampleCamera(progress.current);
    // eased follow so the journey feels cinematic, not snappy
    cur.current.pos.lerp(target.pos, Math.min(1, dt * 3.2));
    cur.current.look.lerp(target.look, Math.min(1, dt * 3.2));
    // gentle mouse parallax on top of the journey
    const mx = state.pointer.x * 0.6;
    const my = state.pointer.y * 0.35;
    state.camera.position.set(
      cur.current.pos.x + mx,
      cur.current.pos.y + my * 0.5,
      cur.current.pos.z,
    );
    state.camera.lookAt(cur.current.look);
    if (dustRef.current) dustRef.current.rotation.y += dt * 0.02;
  });

  return (
    <>
      <fog attach="fog" args={[FOG_COLOR, 24, 110]} />
      <ambientLight intensity={0.75} color="#fff4dd" />
      <directionalLight position={[12, 20, 6]} intensity={1.6} color="#ffe9c4" />
      <directionalLight position={[-10, 6, -30]} intensity={0.5} color="#d8c8a0" />
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial size={0.07} color="#a08b60" transparent opacity={0.5} sizeAttenuation />
      </points>
      <Terrain />
      <SurveyGrid />
      <Trench />
      <FloatingArtifacts />
    </>
  );
};

export const ScrollBackdrop: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="scroll3d-canvas" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [...KEYS[0].pos], fov: 58, near: 0.1, far: 260 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <SceneRig progress={progress} />
      </Canvas>
    </div>
  );
};

export default ScrollBackdrop;
