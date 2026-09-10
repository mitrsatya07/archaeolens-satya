/* Procedural stone-artifact geometries (no external model files needed) */

import { useMemo } from "react";
import * as THREE from "three";
import type { ArtifactGeometry } from "./artifacts";

function handaxeGeometry(): THREE.BufferGeometry {
  // Teardrop biface profile, squashed flat like a knapped handaxe
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20; // 0 = tip, 1 = butt
    const r = 0.34 * Math.sin(Math.PI * Math.pow(t, 0.72)) * (1.15 - 0.35 * t);
    points.push(new THREE.Vector2(Math.max(r, 0.015), t * 1.0));
  }
  const geo = new THREE.LatheGeometry(points, 24);
  geo.scale(0.55, 1.1, 1);
  geo.rotateX(Math.PI / 2); // lie flat, tip forward
  geo.computeVertexNormals();
  return geo;
}

function arrowheadGeometry(): THREE.BufferGeometry {
  const geo = new THREE.ConeGeometry(0.16, 0.5, 4);
  geo.scale(1, 1, 0.42);
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function potGeometry(): THREE.BufferGeometry {
  const points: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    // bowl silhouette: narrow foot, wide belly, slightly incurved rim
    const r = 0.18 + 0.46 * Math.sin(Math.PI * Math.pow(t, 0.85)) - 0.1 * Math.pow(t, 6);
    points.push(new THREE.Vector2(Math.max(r, 0.1), t * 0.5));
  }
  const geo = new THREE.LatheGeometry(points, 28);
  geo.computeVertexNormals();
  return geo;
}

function coreGeometry(): THREE.BufferGeometry {
  // Irregular knapped lump
  const geo = new THREE.IcosahedronGeometry(0.32, 1);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    const n = 1 + 0.28 * Math.sin(v.x * 9.1) * Math.cos(v.y * 7.3) * Math.sin(v.z * 8.7);
    v.multiplyScalar(n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

function grindingGeometry(): THREE.BufferGeometry {
  // Saddle quern: dished slab + muller
  const geo = new THREE.BoxGeometry(0.9, 0.12, 0.55, 8, 1, 4);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    if (v.y > 0) {
      const d = Math.max(0, 1 - (v.x * v.x) / 0.2 - (v.z * v.z) / 0.09);
      v.y -= d * 0.07; // dish the top
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

function bladeGeometry(): THREE.BufferGeometry {
  // Long parallel-sided prismatic blade, slightly curved
  const shape = new THREE.Shape();
  shape.moveTo(-0.28, -0.03);
  shape.quadraticCurveTo(0, 0.05, 0.28, -0.03);
  shape.quadraticCurveTo(0, -0.05, -0.28, -0.03);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
  geo.computeVertexNormals();
  return geo;
}

const BUILDERS: Record<ArtifactGeometry, () => THREE.BufferGeometry> = {
  handaxe: handaxeGeometry,
  arrowhead: arrowheadGeometry,
  pot: potGeometry,
  core: coreGeometry,
  grinding: grindingGeometry,
  blade: bladeGeometry,
};

export const ArtifactMesh: React.FC<{ geometry: ArtifactGeometry }> = ({ geometry }) => {
  const geo = useMemo(() => BUILDERS[geometry](), [geometry]);
  return <primitive object={geo} attach="geometry" />;
};
