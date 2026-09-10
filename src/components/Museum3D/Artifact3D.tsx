/* Single artifact: pedestal + procedurally modelled stone mesh + DOM label */

import { MUSEUM_ARTIFACTS, MUSEUM_PLINTH_Y, MuseumArtifact } from "./artifacts";
import { ArtifactMesh } from "./ArtifactMesh";
import { Html } from "@react-three/drei";

const Plinth: React.FC<{ artifact: MuseumArtifact; onFocus: (id: string) => void }> = ({ artifact, onFocus }) => (
  <group position={[artifact.side * 6, MUSEUM_PLINTH_Y, artifact.z]}>
    {/* pedestal */}
    <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
      <cylinderGeometry args={[0.62, 0.78, 1.2, 24]} />
      <meshStandardMaterial color="#201d1a" roughness={0.85} />
    </mesh>
    <mesh receiveShadow position={[0, 1.22, 0]}>
      <cylinderGeometry args={[0.8, 0.8, 0.06, 24]} />
      <meshStandardMaterial color="#2b2620" roughness={0.7} />
    </mesh>
    {/* stone tool */}
    <mesh
      castShadow
      position={[0, 1.62, 0]}
      rotation={[0, artifact.side * Math.PI * 0.25, 0]}
      onClick={(e) => { e.stopPropagation(); onFocus(artifact.id); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      <ArtifactMesh geometry={artifact.geometry} />
      <meshStandardMaterial color={artifact.color} roughness={artifact.roughness} />
    </mesh>
    {/* label */}
    <group position={[0, 2.9, 0]}>
      <Html center distanceFactor={9} position={[artifact.side * 0.4, 0, 0]} zIndexRange={[10, 0]}>
        <div className="museum-label">
          <span className="museum-label-name">{artifact.name}</span>
          <span className="museum-label-sub">{artifact.material} · {artifact.location}</span>
        </div>
      </Html>
    </group>
  </group>
);

export const Artifact3D: React.FC<{ onFocus: (id: string) => void }> = ({ onFocus }) => (
  <>
    {MUSEUM_ARTIFACTS.map((artifact) => (
      <Plinth key={artifact.id} artifact={artifact} onFocus={onFocus} />
    ))}
  </>
);
