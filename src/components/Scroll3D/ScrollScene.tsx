/* The R3F scroll-driven scene: camera dollies through floating artefacts as the page scrolls */

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ArtifactMesh } from "@/components/Museum3D/ArtifactMesh";
import type { ArtifactGeometry } from "@/components/Museum3D/artifacts";
import { useScrollProgress } from "./useScrollProgress";

type Floater = {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  spin: number;
  color: string;
  roughness: number;
  geometry: ArtifactGeometry;
};

/* Deterministic scatter of artefacts along the scroll depth (-190 .. +4) */
const GEOMS: ArtifactGeometry[] = ["handaxe", "arrowhead", "pot", "core", "grinding", "blade"];
const COLORS = ["#b9a58c", "#a9748c", "#8a7a6a", "#4a4a52", "#9c8a6e", "#cfc3ad"];

const FLOATERS: Floater[] = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => {
    const s = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  return {
    x: (r(1) - 0.5) * 22,
    y: (r(2) - 0.5) * 12,
    z: -r(3) * 190 + 2,
    scale: 0.9 + r(4) * 1.6,
    speed: 0.2 + r(5) * 0.5,
    spin: (r(6) - 0.5) * 0.6,
    color: COLORS[i % COLORS.length],
    roughness: 0.3 + r(7) * 0.6,
    geometry: GEOMS[i % GEOMS.length],
  };
});

const DUST_COUNT = 220;

const FloaterMesh: React.FC<{ f: Floater; index: number }> = ({ f }) => {
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
      <mesh castShadow>
        <ArtifactMesh geometry={f.geometry} />
        <meshStandardMaterial color={f.color} roughness={f.roughness} metalness={0.08} />
      </mesh>
    </group>
  );
};

const SceneRig: React.FC<{ progress: React.MutableRefObject<number> }> = ({ progress }) => {
  const cameraZ = useRef(4);
  const dustRef = useRef<THREE.Points>(null);

  const dust = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 2] = -Math.random() * 190;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    // Smooth camera dolly along the scroll path
    const targetZ = 4 - progress.current * 190;
    cameraZ.current += (targetZ - cameraZ.current) * Math.min(1, dt * 4.5);
    state.camera.position.z = cameraZ.current;
    // subtle parallax with mouse position
    state.camera.position.x += (state.pointer.x * 1.2 - state.camera.position.x) * Math.min(1, dt * 2);
    state.camera.position.y += (state.pointer.y * 0.8 - state.camera.position.y) * Math.min(1, dt * 2);
    // drifting dust
    if (dustRef.current) {
      dustRef.current.rotation.z += dt * 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color="#e8dcc0" />
      <directionalLight position={[6, 8, 10]} intensity={1.1} color="#ffe9c4" />
      <directionalLight position={[-8, -4, -40]} intensity={0.5} color="#c98a5a" />
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial size={0.06} color="#d8c8a0" transparent opacity={0.55} sizeAttenuation />
      </points>
      {FLOATERS.map((f, i) => (
        <FloaterMesh key={i} f={f} index={i} />
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
        <fog attach="fog" args={["#141017", 14, 90]} />
        <SceneRig progress={progress} />
      </Canvas>
    </div>
  );
};

export default ScrollBackdrop;

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  const cameraZ = useRef(4);
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const dustRef = useRef<THREE.Points>(null);

  const dust = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = -Math.random() * 190;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    // Smooth camera dolly along the scroll path
    const targetZ = 4 - progress.current * 190;
    cameraZ.current += (targetZ - cameraZ.current) * Math.min(1, dt * 4.5);
    state.camera.position.z = cameraZ.current answered;
  });

  return null;
}
