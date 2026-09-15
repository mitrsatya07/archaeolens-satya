/* Cinematic camera: smooth interpolation along the master journey path,
   plus very subtle mouse parallax. Never jumps between sections. */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCamera } from "./util";

export function CameraController({
  progress,
  target,
  reduced,
  mobile,
}: {
  progress: React.MutableRefObject<number>;
  target: React.MutableRefObject<number>;
  reduced: boolean;
  mobile: boolean;
}) {
  const cur = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3() });
  const ready = useRef(false);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);

    // eased journey parameter — the source of all continuity
    progress.current += (target.current - progress.current) * Math.min(1, dt * (reduced ? 9 : 2.6));

    const key = sampleCamera(progress.current);
    if (!ready.current) {
      cur.current.pos.copy(key.pos);
      cur.current.look.copy(key.look);
      ready.current = true;
    }
    const k = 1 - Math.exp(-(reduced ? 12 : 3.4) * dt);
    cur.current.pos.lerp(key.pos, k);
    cur.current.look.lerp(key.look, k);

    const par = reduced ? 0 : mobile ? 0.15 : 0.5;
    state.camera.position.set(
      cur.current.pos.x + state.pointer.x * par,
      cur.current.pos.y + state.pointer.y * par * 0.5,
      cur.current.pos.z,
    );
    state.camera.lookAt(cur.current.look);
  });

  return null;
}
