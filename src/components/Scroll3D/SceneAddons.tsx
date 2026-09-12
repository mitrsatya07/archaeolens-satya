/* SceneAddons — texture-mapped environment wall, GLTF artifact
   (with procedural fallback), and the optional HDR environment. */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTFModel, useLoadedTexture, useHDREnvironment } from "./loaders";

/** Inner cylinder wall around the scene, textured with the site's
    archival feature graphic — reads as prints on a curved gallery wall. */
export function EnvWall() {
  const tex = useLoadedTexture("/textures/feature-graphic.png");
  const map = useMemo(() => {
    if (!tex) return null;
    const t = tex.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 2);
    t.needsUpdate = true;
    return t;
  }, [tex]);

  return (
    <mesh position={[0, 0, 0]}>
      <cylinderGeometry args={[30, 30, 26, 48, 1, true]} />
      {map ? (
        <meshBasicMaterial map={map} transparent opacity={0.16} side={THREE.BackSide} toneMapped={false} />
      ) : (
        <meshBasicMaterial color="#efe7d5" transparent opacity={0.12} side={THREE.BackSide} toneMapped={false} />
      )}
    </mesh>
  );
}

/** Floating showcase artefact. Uses GLTFLoader for /models/artifact.glb;
    while missing, a procedural knapped-stone fallback keeps the scene alive. */
export function GLTFArtifact() {
  const gltfScene = useGLTFModel("/models/artifact.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y += dt * 0.4;
    g.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });

  return (
    <group ref={ref} position={[-2.6, 0.5, -5]} scale={1.15}>
      {gltfScene ? (
        <primitive object={gltfScene} />
      ) : (
        <mesh castShadow>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#5f5341" roughness={0.9} flatShading />
        </mesh>
      )}
    </group>
  );
}

/** Optional HDR environment (RGBELoader) — silent no-op without the file. */
export function HDREnv() {
  useHDREnvironment("/env/studio.hdr");
  return null;
}
