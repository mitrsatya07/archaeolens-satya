/* First-person controller: WASD + pointer-lock look (desktop), drag-look + joystick (touch) */

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EYE_HEIGHT, HALL_HALF } from "./layout";

export type InputState = {
  yaw: number;
  pitch: number;
  forward: number; // -1..1
  strafe: number; // -1..1
  lookDX: number; // pending look deltas consumed each frame
  lookDY: number;
};

export const createInputState = (): InputState => ({
  yaw: 0, // camera faces -z (down the hall) at identity rotation
  pitch: 0,
  forward: 0,
  strafe: 0,
  lookDX: 0,
  lookDY: 0,
});

const PLAYER_RADIUS = 0.9;

/** Distance keep-out zones around each pedestal (x, z, r) */
const PEDESTAL_ZONES = [
  { x: -6, z: -24 }, { x: 6, z: -24 }, { x: -6, z: -12 }, { x: 6, z: -12 },
  { x: -6, z: 0 }, { x: 6, z: 0 }, { x: -6, z: 12 }, { x: 6, z: 12 },
  { x: -6, z: 24 }, { x: 6, z: 24 },
];

export const Player: React.FC<{
  input: React.MutableRefObject<InputState>;
  paused: boolean;
  focus: { x: number; z: number; side: number } | null;
}> = ({ input, paused, focus }) => {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);

    if (focus) {
      // Glide to the viewing spot in front of the pedestal
      const target = new THREE.Vector3(focus.side * 3.4, EYE_HEIGHT, focus.z);
      camera.position.lerp(target, 1 - Math.exp(-4 * dt));
      const look = new THREE.Vector3(focus.side * 6, 1.9, focus.z);
      const m = new THREE.Matrix4().lookAt(camera.position, look, new THREE.Vector3(0, 1, 0));
      const q = new THREE.Quaternion().setFromRotationMatrix(m);
      camera.quaternion.slerp(q, 1 - Math.exp(-5 * dt));
      // keep euler in sync for when we resume walking
      euler.current.setFromQuaternion(camera.quaternion, "YXZ");
      input.current.yaw = euler.current.y;
      input.current.pitch = euler.current.x;
      return;
    }

    if (paused) return;

    // Consume look deltas
    euler.current.y -= input.current.lookDX * 0.0026;
    euler.current.x -= input.current.lookDY * 0.0026;
    euler.current.x = THREE.MathUtils.clamp(euler.current.x, -Math.PI / 2.2, Math.PI / 2.2);
    input.current.lookDX = 0;
    input.current.lookDY = 0;

    // Keyboard move
    let f = input.current.forward;
    let s = input.current.strafe;
    if (keys.current["KeyW"] || keys.current["ArrowUp"]) f += 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) f -= 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) s -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) s += 1;
    f = THREE.MathUtils.clamp(f, -1, 1);
    s = THREE.MathUtils.clamp(s, -1, 1);

    const speed = 4.2;
    const sinY = Math.sin(euler.current.y);
    const cosY = Math.cos(euler.current.y);
    const dx = (-sinY * f + cosY * s) * speed * dt;
    const dz = (-cosY * f - sinY * s) * speed * dt;

    let nx = camera.position.x + dx;
    let nz = camera.position.z + dz;
    nx = THREE.MathUtils.clamp(nx, -HALL_HALF + PLAYER_RADIUS, HALL_HALF - PLAYER_RADIUS);
    nz = THREE.MathUtils.clamp(nz, -34 + PLAYER_RADIUS, 34 - PLAYER_RADIUS);
    // simple pedestal keep-out
    for (const p of PEDESTAL_ZONES) {
      const ddx = nx - p.x, ddz = nz - p.z;
      const d2 = ddx * ddx + ddz * ddz;
      if (d2 < 1.7 * 1.7) {
        const d = Math.sqrt(d2) || 0.001;
        nx = p.x + (ddx / d) * 1.7;
        nz = p.z + (ddz / d) * 1.7;
      }
    }
    camera.position.set(nx, EYE_HEIGHT, nz);
    camera.quaternion.setFromEuler(euler.current);
  });

  return null;
};
