/* The R3F scene: hall, lit pedestals, player camera */

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Hall } from "./Hall";
import { Artifact3D } from "./Artifact3D";
import { Player, type InputState } from "./Player";
import { MUSEUM_ARTIFACTS } from "./artifacts";
import { START_POSITION } from "./layout";
import * as THREE from "three";

export type MuseumSceneProps = {
  paused: boolean;
  focus: { id: string; side: number; z: number } | null;
  onFocus: (id: string | null) => void;
  inputRef: React.MutableRefObject<InputState>;
  onReady: () => void;
};

export const MuseumScene: React.FC<MuseumSceneProps> = ({ paused, focus, onFocus, inputRef, onReady }) => {
  const found = focus ? MUSEUM_ARTIFACTS.find((a) => a.id === focus.id) ?? null : null;
  const focusArtifact = found ? { x: found.side * 6, z: found.z, side: found.side } : null;

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: START_POSITION, fov: 68, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color("#0b0906"));
        scene.fog = new THREE.Fog("#0b0906", 22, 60);
        onReady();
      }}
      onPointerMissed={() => onFocus(null)}
    >
      <ambientLight intensity={0.32} color="#e8dcc0" />
      <hemisphereLight intensity={0.25} groundColor="#1a1410" color="#f0e4c8" />
      {MUSEUM_ARTIFACTS.map((a) => (
        <pointLight
          key={a.id}
          position={[a.side * 6, 5.4, a.z]}
          intensity={14}
          distance={11}
          color="#ffdfae"
          castShadow
        />
      ))}
      <Suspense fallback={null}>
        <Hall />
        <Artifact3D onFocus={onFocus} />
      </Suspense>
      <Player input={inputRef} paused={paused} focus={focusArtifact} />
    </Canvas>
  );
};

export default MuseumScene;
