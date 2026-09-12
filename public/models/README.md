# 3D asset folders

- `public/models/artifact.glb` — drop a Draco/GLB artefact model here; the
  scene's GLTFLoader picks it up automatically (procedural fallback until then)
- `public/env/studio.hdr` — optional equirectangular HDR; RGBELoader applies it
  as `scene.environment` (silent no-op when absent)
- `public/textures/feature-graphic.png` — archival print used as the
  environment-wall texture (already wired)