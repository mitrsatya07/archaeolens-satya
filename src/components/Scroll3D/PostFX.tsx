/* PostFX — EffectComposer pipeline:
   RenderPass → paper-grain + vignette ShaderPass → OutputPass
   Priority-1 useFrame takes over rendering from R3F's default loop. */

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

/* archival print: soft vignette + animated film grain, very restrained */
const GrainVignetteShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uStrength: { value: 0.055 }, // grain intensity
    uVignette: { value: 0.28 }, // corner falloff
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uStrength;
    uniform float uVignette;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);

      // animated grain
      float g = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 100.0) - 0.5;
      col.rgb += g * uStrength;

      // soft vignette
      vec2 d = vUv - 0.5;
      float v = smoothstep(0.85, 0.35, length(d) * 1.4);
      col.rgb *= mix(1.0 - uVignette, 1.0, v);

      gl_FragColor = col;
    }
  `,
};

export function PostFX() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    const grainPass = new ShaderPass(GrainVignetteShader);
    grainPass.renderToScreen = false;
    c.addPass(grainPass);
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera]);

  /* keep the buffer sized to the viewport */
  useEffect(() => {
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  }, [composer, size]);

  /* priority 1 → R3F hands rendering to us */
  useFrame((state) => {
    const pass = composer.passes[1] as ShaderPass;
    pass.uniforms.uTime.value = state.clock.elapsedTime;
    composer.render();
  }, 1);

  return null;
}
