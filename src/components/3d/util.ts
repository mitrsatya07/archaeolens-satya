/* Shared terrain maths + re-exported journey helpers. */

export { PALETTE, band, within, smoothstep, sampleCamera } from "./journey";

/** Flattening factor: the excavation corridor is a levelled working area. */
function flatten(x: number, z: number) {
  const inCorridor =
    Math.max(0, 1 - Math.abs(x) / 18) * Math.max(0, 1 - Math.abs(z + 36) / 46);
  return 1 - inCorridor * 0.92;
}

/** Rolling archaeological ground surface, y at (x, z). */
export function terrainHeight(x: number, z: number) {
  const base =
    Math.sin(x * 0.05) * Math.cos(z * 0.045) * 1.7 +
    Math.sin(x * 0.13 + z * 0.09) * 0.45 +
    Math.cos(z * 0.19) * 0.28;
  return base * flatten(x, z);
}

/** Ground height used to sit small objects on the surface. */
export const terrainLift = (x: number, z: number) => terrainHeight(x, z);
