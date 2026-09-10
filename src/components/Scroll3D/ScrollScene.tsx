/* The R3F scroll-driven scene: an archaeological journey — aerial terrain,
   survey grid, excavation trench with strata, and floating artefacts.
   Fully self-contained (no external deps beyond three/R3F). */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollProgress } from "./useScrollProgress";

/* ── Stylised artefact geometries ─────────────────────────────────── */

type ArtifactGeometry = "handaxe" | "arrowhead" | "pot" | "core" | "grinding" | "blade";

const buildGeometry = (kind: ArtifactGeometry): THREE.BufferGeometry => {
  switch (kind) {
    case "handaxe": {
      const g = new THREE.SphereGeometry(0.55, 18, 14);
      g.scale(1.55, 0.9, 0.42);
      return g;
    }
    case "arrowhead": {
      const g = new THREE.ConeGeometry(0.3, 0.9, 4);
      g.scale(1, 1, 0.35);
      return g;
    }
    case "pot":
      return new THREE.CylinderGeometry(0.34, 0.22, 0.62, 16, 1, true);
    case "core": {
      const g = new THREE.DodecahedronGeometry(0.42, 0);
      g.scale(1.1, 0.85, 1.1);
      return g;
    }
    case "grinding":
      return new THREE.CylinderGeometry(0.5, 0.44, 0.18, 14);
    case "blade":
      return new THREE.BoxGeometry(1.3, 0.06, 0.2);
  }
};

const ArtifactMesh: React.FC<{ geometry: ArtifactGeometry }> = ({ geometry }) => {
  const g = useMemo(() => buildGeometry(geometry), [geometry]);
  return <primitive object={g} attach="geometry" />;
};

/* ── Terrain ──────────────────────────────────────────────────────── */

const Terrain: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(120, 260, 72, 96);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const h =
        Math.sin(x * 0.06) * Math.cos(y * 0.05) * 2.2 +
        Math.sin(x * 0.16 + y * 0.1) * 0.7 +
        Math.cos(y * 0.21) * 0.5;
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    // The camera flies low over the terrain — keep the plane centred ahead of it
    m.position.z = state.camera.position.z - 40;
  });
  return (
    <mesh ref={ref} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, -30]}>
      <meshStandardMaterial color="#4c4234" roughness={1} metalness={0} flatShading />
    </mesh>
  );
};

/* ── Survey grid (appears only when the camera is near) ───────────── */

const SurveyGrid: React.FC<{ z: number }> = ({ z }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.visible = state.camera.position.z < z + 26 && state.camera.position.z > z - 26;
  });
  const lines = useMemo(() => {
    const out: React.ReactNode[] = [];
    for (let i = -5; i <= 5; i++) {
      const gv = new THREE.BufferGeometry();
      gv.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-i * 2, -3.05, 0, -i * 2, -3.05, -24]), 3));
      const gh = new THREE.BufferGeometry();
      gh.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-10, -3.05, -i * 2.4, 10, -3.05, -i * 2.4]), 3));
      out.push(
        <lineSegments key={`v${i}`} geometry={gv}>
          <lineBasicMaterial color="#c9a86a" transparent opacity={0.3} />
        </lineSegments>,
        <lineSegments key={`h${i}`} geometry={gh}>
          <lineBasicMaterial color="#c9a86a" transparent opacity={0.3} />
        </lineSegments>,
      );
    }
    return out;
  }, []);
  return (
    <group ref={ref} position={[0, 0, z]} visible={false}>
      {lines}
    </group>
  );
};

/* ── Excavation trench with strata (appears only when near) ───────── */

const Trench: React.FC<{ z: number }> = ({ z }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.visible = Math.abs(state.camera.position.z - z) < 24;
  });
  const strata = [
    { y: -0.45, h: 0.3, c: "#6b5b40" },
    { y: -0.75, h: 0.3, c: "#59492f" },
    { y: -1.05, h: 0.3, c: "#4a3c26" },
    { y: -1.35, h: 0.3, c: "#3d3120" },
  ];
  return (
    <group ref={ref} position={[0, -2.2, z]} visible={false}>
      {/* trench walls: stacked strata slabs on both sides */}
      {[-2.2, 2.2].map((x) =>
        strata.map((s, i) => (
          <mesh key={`${x}-${i}`} position={[x, s.y, 0]}>
            <boxGeometry args={[2.2, s.h, 7]} />
            <meshStandardMaterial color={s.c} roughness={1} />
          </mesh>
        )),
      )}
      {/* trench floor */}
      <mesh position={[0, -1.55, 0]}>
        <boxGeometry args={[2.2, 0.12, 7]} />
        <meshStandardMaterial color="#33291a" roughness={1} />
      </mesh>
      {/* string grid across the trench */}
      {[0, 2, 4, 6].map((i) => (
        <mesh key={i} position={[0, 0.12, -3 + i * 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 4.4, 4]} />
          <meshStandardMaterial color="#d8c8a0" />
        </mesh>
      ))}
    </group>
  );
};

/* ── Floating artefacts along the path ────────────────────────────── */

const GEOMS: ArtifactGeometry[] = ["handaxe", "arrowhead", "pot", "core", "grinding", "blade"];
const COLORS = ["#b9a58c", "#a9748c", "#8a7a6a", "#4a4a52", "#9c8a6e", "#cfc3ad"];

type Floater = {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  spin: number;
  color: string;
  geometry: ArtifactGeometry;
};

const FLOATERS: Floater[] = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    x: (r(1) - 0.5) * 20,
    y: -0.5 + r(2) * 6,
    z: -r(3) * 120 + 2,
    scale: 0.7 + r(4) * 1.1,
    speed: 0.2 + r(5) * 0.5,
    spin: (r(6) - 0.5) * 0.6,
    color: COLORS[i % COLORS.length],
    geometry: GEOMS[i % GEOMS.length],
  };
});

const FloaterMesh: React.FC<{ f: Floater }> = ({ f }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = f.spin * t * f.speed;
    g.rotation.x = Math.sin(t * f.speed * 0.7) * 0.25;
    g.position.y = f.y + Math.sin(t * f.speed * 1.3) * 0.6;
  });
  return (
    <group ref={ref} position={[f.x, f.y, f.z]} scale={f.scale}>
      <mesh>
        <ArtifactMesh geometry={f.geometry} />
        <meshStandardMaterial color={f.color} roughness={0.85} metalness={0.05} />
      </mesh>
    </group>
  );
};

/* ── Scene rig ────────────────────────────────────────────────────── */

const DUST_COUNT = 220;
const PATH_LENGTH = 130;

const SceneRig: React.FC<{ progress: React.MutableRefObject<number> }> = ({ progress }) => {
  const cameraZ = useRef(4);
  const dustRef = useRef<THREE.Points>(null);

  const dust = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 2] = -Math.random() * PATH_LENGTH;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    // Smooth camera dolly along the scroll path
    const targetZ = 4 - progress.current * PATH_LENGTH;
    cameraZ.current += (targetZ - cameraZ.current) * Math.min(1, dt * 4.5);
    state.camera.position.z = cameraZ.current;
    // dive gently towards the trench mid-journey, rise again near the end
    const dip = Math.sin(Math.min(1, Math.max(0, progress.current)) * Math.PI) * 1.6;
    state.camera.position.y = -dip + state.pointer.y * 0.5;
    // subtle parallax with mouse position
    state.camera.position.x += (state.pointer.x * 1.2 - state.camera.position.x) * Math.min(1, dt * 2);
    // drifting dust
    if (dustRef.current) {
      dustRef.current.rotation.z += dt * 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#e8dcc0" />
      <directionalLight position={[6, 8, 10]} intensity={1.1} color="#ffe9c4" />
      <directionalLight position={[-8, -4, -40]} intensity={0.5} color="#c98a5a" />
      <hemisphereLight args={["#8a7a5a", "#2a221a", 0.5]} />
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial size={0.06} color="#d8c8a0" transparent opacity={0.5} sizeAttenuation />
      </points>
      <Terrain />
      <SurveyGrid z={-24} />
      <Trench z={-64} />
      {FLOATERS.map((f, i) => (
        <FloaterMesh key={i} f={f} />
      ))}
    </>
  );
};

export const ScrollBackdrop: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="scroll3d-canvas" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 62, near: 0.1, far: 260 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <color attach="background" args={["#141017"]} />
        <fog attach="fog" args={["#141017", 16, 95]} />
        <SceneRig progress={progress} />
      </Canvas>
    </div>
  );
};

export default ScrollBackdrop;

