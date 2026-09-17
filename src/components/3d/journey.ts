/* Master journey configuration — one continuous archaeological camera path.
   Journey parameter `t` runs 0 → 1 across the whole site:

   0.00–0.10  high-altitude archaeological landscape
   0.10–0.20  field survey
   0.20–0.30  archaeological site
   0.30–0.42  excavation trench
   0.42–0.56  artifact
   0.56–0.66  digital documentation (photogrammetry)
   0.66–0.74  analysis
   0.74–0.82  GIS / spatial data
   0.82–0.88  stone tools
   0.88–0.92  field notes
   0.92–0.95  index (aerial)
   0.95–0.97  bibliography
   0.97–0.99  forum / careers
   0.99–1.00  return to the wide landscape
*/

import * as THREE from "three";

export type CamKey = { t: number; pos: [number, number, number]; look: [number, number, number] };

export const CAM_KEYS: CamKey[] = [
  { t: 0.0,  pos: [0, 15, 14],     look: [0, -1.5, -34] },
  { t: 0.06, pos: [1.5, 9, 0],     look: [0, 0, -30] },
  { t: 0.12, pos: [2, 4.2, -12],   look: [0, 1, -24] },

  { t: 0.2,  pos: [1.2, 1.8, -18], look: [0, 1, -30] },
  { t: 0.28, pos: [0.7, 1.5, -28], look: [0, 0.8, -38] },
  { t: 0.36, pos: [0, 1.1, -34],   look: [0, 0.2, -41] },
  { t: 0.42, pos: [0, 0.6, -42],   look: [0, 0.7, -52] },
  { t: 0.48, pos: [2.4, 1.3, -47], look: [0, 1.2, -52] },
  { t: 0.54, pos: [-2.4, 1.5, -48],look: [0, 1.2, -52] },
  { t: 0.6,  pos: [0, 1.35, -46.5],look: [0, 1.2, -52] },
  { t: 0.68, pos: [1.8, 2.0, -47], look: [0, 1.2, -52] },
  { t: 0.76, pos: [0, 11, -64],    look: [0, 0, -82] },
  { t: 0.82, pos: [0, 6, -84],     look: [0, 0.5, -95] },
  { t: 0.86, pos: [0, 2.1, -91],   look: [0, 1, -97] },
  { t: 0.9,  pos: [0, 1.9, -104],  look: [0, 0.9, -112] },
  { t: 0.935,pos: [0, 17, -108],   look: [0, 0, -118] },
  { t: 0.96, pos: [0, 3, -119],    look: [0, 1, -127] },
  { t: 0.98, pos: [0, 5, -127],    look: [0, 1, -136] },
  { t: 1.0,  pos: [0, 24, -124],   look: [0, 0, -158] },
];

/** Each route occupies a band of the master journey; the page's own scroll
    sweeps the camera continuously through that band. */
export const ROUTE_BANDS: Record<string, [number, number]> = {
  "/": [0.0, 1.0],
  "/sites": [0.74, 0.8],
  "/timeline": [0.74, 0.8],
  "/typology": [0.75, 0.81],
  "/museums": [0.76, 0.82],
  "/heritage-laws": [0.76, 0.82],
  "/stone-tools": [0.82, 0.88],
  "/field-notes": [0.88, 0.92],
  "/references": [0.94, 0.97],
  "/community": [0.965, 0.985],
  "/contact": [0.97, 0.99],
  "/feedback": [0.97, 0.99],
  "/about": [0.97, 1.0],
  "/account": [0.97, 0.99],
  "/auth": [0.97, 0.99],
  "/attributions": [0.96, 0.99],
  "/privacy-policy": [0.97, 0.99],
  "/terms": [0.97, 0.99],
};

export const bandFor = (pathname: string): [number, number] =>
  ROUTE_BANDS[pathname] ?? [0.97, 1.0];

/** Routes where text density means the 3D must stay quiet. */
export const CALM_ROUTES = new Set([
  "/community", "/contact", "/feedback", "/references", "/terms",
  "/privacy-policy", "/attributions", "/auth", "/account",
]);

export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function sampleCamera(t: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const c = Math.min(0.9999, Math.max(0, t));
  let i = 0;
  while (i < CAM_KEYS.length - 2 && CAM_KEYS[i + 1].t < c) i++;
  const a = CAM_KEYS[i];
  const b = CAM_KEYS[i + 1];
  const k = smoothstep((c - a.t) / (b.t - a.t || 1));
  return {
    pos: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.pos), new THREE.Vector3(...b.pos), k),
    look: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.look), new THREE.Vector3(...b.look), k),
  };
}

/** 0→1 ramp for a phase, with soft fade-in / fade-out shoulders. */
export function band(t: number, start: number, end: number, fade = 0.05) {
  const up = THREE.MathUtils.clamp((t - (start - fade)) / fade, 0, 1);
  const down = 1 - THREE.MathUtils.clamp((t - end) / fade, 0, 1);
  return smoothstep(Math.min(up, down));
}

/** Linear 0→1 inside a phase (for progressive reveals). */
export const within = (t: number, start: number, end: number) =>
  THREE.MathUtils.clamp((t - start) / (end - start || 1), 0, 1);

export const PALETTE = {
  paper: "#e9dfc9",
  sand: "#cdbb98",
  soil: "#8f7a54",
  deepSoil: "#6b5a38",
  terracotta: "#9a5b3c",
  ink: "#2b2418",
  line: "#8a744f",
  chalk: "#f2e7cd",
};
