/* Persistent full-screen 3D canvas behind the whole ArchaeoLens site.
   Fixed while the page content scrolls; the journey continues across routes. */

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useRouterState } from "@tanstack/react-router";
import { CALM_ROUTES, sampleCamera } from "./journey";
import { detectQuality, useJourneyProgress } from "./useJourney";
import { ArchaeologyScene } from "./ArchaeologyScene";

export default function ArchaeoBackdrop() {
  const [mounted, setMounted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t, target } = useJourneyProgress();
  const quality = useMemo(() => detectQuality(), []);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("archaeo-3d");
    return () => document.body.classList.remove("archaeo-3d");
  }, []);

  if (!mounted) return null;

  const calm = CALM_ROUTES.has(pathname);
  const start = sampleCamera(t.current);

  return (
    <div
      className="archaeo-canvas"
      aria-hidden
      style={{ opacity: calm ? 0.3 : quality.mobile ? 0.78 : 0.92 }}
    >
      <Canvas
        dpr={quality.dpr}
        frameloop={quality.reduced ? "demand" : "always"}
        camera={{ position: start.pos.toArray(), fov: 58, near: 0.1, far: 300 }}
        gl={{ antialias: !quality.mobile, alpha: true, powerPreference: "high-performance" }}
      >
        <ArchaeologyScene progress={t} target={target} quality={quality} />
      </Canvas>
    </div>
  );
}
