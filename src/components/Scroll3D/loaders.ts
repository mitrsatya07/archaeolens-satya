/* Loaders: GLTF models, image textures, HDR environments — all graceful.
   Missing assets never crash the scene; the procedural fallback stays. */

import { useEffect, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/** GLTFLoader — returns the gltf.scene, or null while loading / on failure */
export function useGLTFModel(url: string): THREE.Group | null {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  useEffect(() => {
    let alive = true;
    new GLTFLoader().load(
      url,
      (gltf) => { if (alive) setScene(gltf.scene); },
      undefined,
      () => { /* asset missing — silent, fallback stays */ },
    );
    return () => { alive = false; };
  }, [url]);
  return scene;
}

/** TextureLoader — returns an sRGB THREE.Texture, or null */
export function useLoadedTexture(url: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        if (alive) setTex(t);
      },
      undefined,
      () => { /* silent */ },
    );
    return () => { alive = false; };
  }, [url]);
  return tex;
}

/** RGBELoader (optional) — applies an HDR equirect as scene.environment
    via PMREM. Silent no-op if the .hdr file is absent. */
export function useHDREnvironment(url: string): void {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const [hdr, setHdr] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    new RGBELoader().load(
      url,
      (t) => { if (alive) setHdr(t); },
      undefined,
      () => { /* optional asset — silent */ },
    );
    return () => { alive = false; };
  }, [url]);

  useEffect(() => {
    if (!hdr) return;
    const pmrem = new THREE.PMREMGenerator(gl);
    const envMap = pmrem.fromEquirectangular(hdr).texture;
    scene.environment = envMap;
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [hdr, gl, scene]);
}
