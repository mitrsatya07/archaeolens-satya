/* The central artifact and its digital documentation.

   Replace the placeholder with your own model by dropping a Draco/GLB file at
   public/models/artifact.glb — it is picked up automatically and the
   procedural pottery vessel below is used only while that file is absent.

   Documentation sequence (driven by scroll):
     physical → textured → wireframe → point cloud → digital model
*/

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTE, band, within } from "./util";
import { useGLTFModel } from "./loaders";

const ARTIFACT_POS: [number, number, number] = [0, 0.1, -52];

/** Procedural pottery vessel — stand-in until a GLB is supplied. */
function useVesselGeometry() {
  return useMemo(() => {
    const profile: THREE.Vector2[] = [];
    for (let i = 0; i <= 18; i++) {
      const v = i / 18;
      const r = 0.12 + Math.sin(v * Math.PI * 0.92) * 0.46 + v * 0.06;
      profile.push(new THREE.Vector2(r, v * 1.1));
    }
    const g = new THREE.LatheGeometry(profile, 36);
    g.computeVertexNormals();
    return g;
  }, []);
}

export function Artifact({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const solid = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.LineSegments>(null);
  const cloud = useRef<THREE.Points>(null);
  const scanner = useRef<THREE.Mesh>(null);
  const gltf = useGLTFModel("/models/artifact.glb");

  const vessel = useVesselGeometry();
  const wireGeo = useMemo(() => new THREE.WireframeGeometry(vessel), [vessel]);
  const cloudGeo = useMemo(() => {
    const src = vessel.attributes.position as THREE.BufferAttribute;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(src.array.slice() as Float32Array, 3));
    return g;
  }, [vessel]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = progress.current;
    const vis = band(t, 0.4, 0.76, 0.06);
    g.visible = vis > 0.02;
    if (!g.visible) return;

    // rises subtly out of its context, then becomes isolated
    const rise = within(t, 0.42, 0.52);
    g.position.set(ARTIFACT_POS[0], ARTIFACT_POS[1] - 0.9 + rise * 2.0, ARTIFACT_POS[2]);
    g.rotation.y += dt * 0.12; // slow, never spinning

    // documentation states
    const textured = 1 - within(t, 0.57, 0.6);
    const wireOn = within(t, 0.575, 0.605) * (1 - within(t, 0.625, 0.65));
    const cloudOn = within(t, 0.63, 0.66) * (1 - within(t, 0.70, 0.735));
    const digital = within(t, 0.70, 0.735);

    if (solid.current) {
      const m = solid.current.material as THREE.MeshStandardMaterial;
      m.opacity = Math.max(textured, digital * 0.55);
      m.transparent = true;
      solid.current.visible = m.opacity > 0.02;
    }
    if (wire.current) {
      const m = wire.current.material as THREE.LineBasicMaterial;
      m.opacity = Math.max(wireOn, digital * 0.8) * 0.9;
      wire.current.visible = m.opacity > 0.02;
    }
    if (cloud.current) {
      const m = cloud.current.material as THREE.PointsMaterial;
      m.opacity = Math.max(cloudOn, digital * 0.5);
      cloud.current.visible = m.opacity > 0.02;
    }
    // photogrammetry scanning sweep
    if (scanner.current) {
      const scanning = within(t, 0.56, 0.68) * (1 - within(t, 0.68, 0.72));
      scanner.current.visible = scanning > 0.05;
      const sweep = (state.clock.elapsedTime * 0.5) % 1;
      scanner.current.position.y = sweep * 1.3;
      (scanner.current.material as THREE.MeshBasicMaterial).opacity = scanning * 0.5;
    }
  });

  return (
    <group ref={group} position={ARTIFACT_POS}>
      {gltf ? (
        <primitive object={gltf} />
      ) : (
        <mesh ref={solid} geometry={vessel} castShadow>
          <meshStandardMaterial color={PALETTE.terracotta} roughness={0.88} side={THREE.DoubleSide} transparent />
        </mesh>
      )}

      <lineSegments ref={wire} geometry={wireGeo}>
        <lineBasicMaterial color="#4b6d63" transparent opacity={0} />
      </lineSegments>

      <points ref={cloud} geometry={cloudGeo}>
        <pointsMaterial size={0.028} color={PALETTE.ink} transparent opacity={0} sizeAttenuation />
      </points>

      {/* scanning plane */}
      <mesh ref={scanner} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.72, 40]} />
        <meshBasicMaterial color="#5e8377" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* pedestal shadow-catcher disc */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshBasicMaterial color="#8a7550" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/** Measurement lines, reference points and a coordinate grid around the model.
    Labels are placeholders — no archaeological data is invented here. */
export function AnalysisOverlay({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const axes = useMemo(() => {
    const mk = (a: number[], b: number[]) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([...a, ...b]), 3));
      return g;
    };
    return [
      mk([-0.85, 0, 0], [0.85, 0, 0]),
      mk([0, 0, 0], [0, 1.35, 0]),
      mk([0, 0, -0.85], [0, 0, 0.85]),
    ];
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const v = band(progress.current, 0.63, 0.76, 0.04);
    g.visible = v > 0.03;
    g.children.forEach((c) => {
      const m = (c as THREE.Mesh).material as THREE.Material & { opacity?: number };
      if (m && "opacity" in m) m.opacity = v * 0.75;
    });
  });

  return (
    <group ref={group} position={[0, 1.2, -52]}>
      {axes.map((g, i) => (
        <lineSegments key={i} geometry={g}>
          <lineBasicMaterial color="#4b6d63" transparent opacity={0} />
        </lineSegments>
      ))}
      {/* reference points */}
      {[[0.8, 0, 0], [0, 1.3, 0], [0, 0, 0.8], [-0.8, 0.6, 0]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={PALETTE.terracotta} transparent opacity={0} />
        </mesh>
      ))}
      {/* classification grid plane behind the object */}
      <mesh position={[0, 0.1, -1.4]}>
        <planeGeometry args={[3.2, 2.4, 8, 6]} />
        <meshBasicMaterial color="#6f6350" wireframe transparent opacity={0} />
      </mesh>
    </group>
  );
}
