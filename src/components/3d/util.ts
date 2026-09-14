/* Shared scene helpers */

export { PALETTE, band, within, smoothstep, sampleCamera } from "./journey";
import { terrainHeight } from "./Terrain";

/** Ground height used to sit small objects on the terrain surface. */
export const terrainLift = (x: number, z: number) => terrainHeight(x, z) * 0.0 + 0.0;
