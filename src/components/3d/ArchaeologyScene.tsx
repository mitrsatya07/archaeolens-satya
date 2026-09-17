/* ArchaeologyScene — the single persistent 3D world.
   Chapter groups mount progressively as the journey approaches them. */

import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Terrain, Particles } from "./Terrain";
import { SurveyGrid, SurveyFinds, SiteFeatures } from "./Survey";
import { Excavation } from "./Excavation";
import { Artifact, AnalysisOverlay } from "./Artifact";
import { GISScene } from "./GISScene";
import { StoneTools, FieldRecording, IndexMarkers, ArchiveFragments } from "./StoneTools";
import { SpatialArchive } from "./SpatialArchive";
import { CameraController } from "./CameraController";
import { PALETTE } from "./util";
import type { Quality } from "./useJourney";

/** Mounts a chapter once the journey gets close to it (progressive loading). */
function useNear(progress: React.MutableRefObject<number>, from: number) {
  const [on, setOn] = useState(() => progress.current > from - 0.12);
  useEffect(() => {
    if (on) return;
    const id = window.setInterval(() => {
      if (progress.current > from - 0.12) setOn(true);
    }, 300);
    return () => window.clearInterval(id);
  }, [on, from, progress]);
  return on;
}

export function ArchaeologyScene({
  progress,
  target,
  quality,
}: {
  progress: React.MutableRefObject<number>;
  target: React.MutableRefObject<number>;
  quality: Quality;
}) {
  const survey = useNear(progress, 0.08);
  const dig = useNear(progress, 0.24);
  const artifact = useNear(progress, 0.4);
  const gis = useNear(progress, 0.7);
  const tools = useNear(progress, 0.78);
  const notes = useNear(progress, 0.86);
  const archive = useNear(progress, 0.9);

  return (
    <>
      <fog attach="fog" args={[PALETTE.paper, 26, 130]} />
      <ambientLight intensity={0.78} color="#fff4dd" />
      <directionalLight position={[14, 22, 8]} intensity={1.5} color="#ffe9c4" />
      <directionalLight position={[-12, 8, -40]} intensity={0.45} color="#d8c8a0" />

      <CameraController
        progress={progress}
        target={target}
        reduced={quality.reduced}
        mobile={quality.mobile}
      />

      <Suspense fallback={null}>
        <Terrain segments={quality.mobile ? 60 : 110} />
        <Particles count={quality.particles} />
        {survey && (
          <>
            <SurveyGrid progress={progress} />
            <SurveyFinds progress={progress} />
            <SiteFeatures progress={progress} />
          </>
        )}
        {dig && <Excavation progress={progress} />}
        {artifact && (
          <>
            <Artifact progress={progress} />
            <AnalysisOverlay progress={progress} />
          </>
        )}
        {gis && <GISScene progress={progress} />}
        {gis && <SpatialArchive progress={progress} />}
        {tools && <StoneTools progress={progress} />}
        {notes && (
          <>
            <FieldRecording progress={progress} />
            <IndexMarkers progress={progress} />
          </>
        )}
        {archive && <ArchiveFragments progress={progress} />}
      </Suspense>
    </>
  );
}

export const SCENE_BG = new THREE.Color(PALETTE.paper);
