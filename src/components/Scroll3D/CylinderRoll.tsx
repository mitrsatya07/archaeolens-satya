/* CylinderRoll — ArchaeoLens as a cylindrical 3D page-roll.
   Six chapters sit on a cylinder around the camera; scrolling rotates the
   cylinder (100vh per chapter), Lenis smooths the wheel, GSAP ScrollTrigger
   stays in sync. Paper-editorial palette, mobile/reduced-motion fallback
   falls back to the existing ScrollScene backdrop. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useScrollProgress } from "./useScrollProgress";
import ScrollBackdrop from "./ScrollScene";

gsap.registerPlugin(ScrollTrigger);

/* ── Mode decision: roll on capable desktops, flat elsewhere ──────── */

const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmall = typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches;
const hasWebGL = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
})();
const MODE_ROLL = hasWebGL && !isSmall && !prefersReduced;

/* ── Chapters (content mirrors the existing homepage sections) ────── */

const CHAPTERS = [
  { label: "Hero", draw: drawHero },
  { label: "The Index", draw: drawIndex },
  { label: "Museum", draw: drawMuseum },
  { label: "Field Method", draw: drawMethod },
  { label: "Careers", draw: drawCareers },
  { label: "Colophon", draw: drawColophon },
];
const N = CHAPTERS.length;
const STEP = (Math.PI * 2) / N;
const RADIUS = 9.4;
const PLANE_W = 12.8;
const PLANE_H = 7.5;
const PAPER = "#f6f0e3";
const INK = "#2b2418";
const TERRA = "#a85b3c";
const COPPER = "#c87a52";
const MUTED = "#6f6350";

export default function CylinderRoll() {
  const progress = useScrollProgress();
  const [active, setActive] = useState(0);

  /* body class switches the page into roll layout (content off-screen,
     scroll space on) */
  useEffect(() => {
    if (!MODE_ROLL) return;
    document.body.classList.add("roll-3d");
    return () => document.body.classList.remove("roll-3d");
  }, []);

  /* Lenis smooth scroll, driven by GSAP's ticker, kept in sync with
     ScrollTrigger (which the journey samples through useScrollProgress) */
  useEffect(() => {
    if (!MODE_ROLL) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  if (!MODE_ROLL) return <ScrollBackdrop />; // flat fallback = existing behaviour

  return (
    <>
      <div className="roll-canvas" aria-hidden>
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 0], fov: 50, near: 0.1, far: 120 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <RollRig progress={progress} onActiveChange={setActive} />
        </Canvas>
      </div>

      {/* HUD */}
      <div className="roll-hud roll-rail">
        <span style={{ top: `${(active / (N - 1)) * 100}%` }} />
      </div>
      <div className="roll-hud roll-label">
        <span className="k">{`0${active} — 0${N - 1}`}</span>
        <b>{CHAPTERS[active].label}</b>
      </div>
      <div className="roll-hud roll-hint">
        <span>Scroll</span>
        <i />
      </div>
    </>
  );
}

/* ── RollRig: the cylinder of chapter planes + camera choreography ── */

function RollRig({
  progress,
  onActiveChange,
}: {
  progress: React.MutableRefObject<number>;
  onActiveChange: (i: number) => void;
}) {
  const world = useRef<THREE.Group>(null);
  const planeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const activeRef = useRef(-1);
  const dustRef = useRef<THREE.Points>(null);

  /* planes: chapter i at angle θi = -i·STEP; rotation.y = i·STEP so each
     plane's face points at the cylinder centre (the camera) */
  const planes = useMemo(
    () =>
      CHAPTERS.map((_, i) => {
        const theta = -i * STEP;
        const pos: [number, number, number] = [
          Math.sin(theta) * RADIUS,
          0,
          -Math.cos(theta) * RADIUS,
        ];
        return { pos, tex: makeChapterTexture(i), rotY: i * STEP };
      }),
    [],
  );

  const dust = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state, dt) => {
    const w = world.current;
    if (!w) return;
    const p = progress.current;

    /* the roll: 100vh of scroll = one chapter = STEP radians */
    w.rotation.y = -p * (N - 1) * STEP;
    w.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    if (dustRef.current) dustRef.current.rotation.y += dt * 0.02;

    /* per-plane reveal: angular distance from "facing the camera" drives
       opacity (depth layering), scale and a slight y-settle */
    const camDir = new THREE.Vector3(0, 0, -1);
    let best = 0;
    let bestDot = -2;
    const v = new THREE.Vector3();
    planeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      v.copy(mesh.position).applyEuler(w.rotation).normalize();
      const d = v.dot(camDir);
      if (d > bestDot) { bestDot = d; best = i; }
      const delta = Math.acos(THREE.MathUtils.clamp(d, -1, 1));
      const t = THREE.MathUtils.clamp(delta / STEP, 0, 1);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 1 - t * 0.75;
      const s = 1 - t * 0.14 + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.004;
      mesh.scale.setScalar(s);
      mesh.position.y = -t * 0.35;
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      onActiveChange(best);
    }

    /* camera: cylinder centre + gentle sway + mouse parallax */
    const sway = Math.sin(p * Math.PI * 2) * 0.7;
    state.camera.position.set(sway + state.pointer.x * 0.5, state.pointer.y * 0.35, 0);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={[PAPER, 18, 60]} />
      <ambientLight intensity={0.9} color="#fff6e6" />
      <directionalLight position={[8, 10, 5]} intensity={1.2} color="#ffe9c4" />
      <points ref={dustRef} geometry={dust}>
        <pointsMaterial size={0.05} color="#a85b3c" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
      </points>
      <group ref={world}>
        {planes.map((pl, i) => (
          <mesh
            key={i}
            ref={(m) => { if (m) planeRefs.current[i] = m; }}
            position={pl.pos}
            rotation={[0, pl.rotY, 0]}
          >
            <planeGeometry args={[PLANE_W, PLANE_H]} />
            <meshBasicMaterial map={pl.tex} transparent toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   CHAPTER TEXTURES — painted to canvas, used as plane textures.
   Palette mirrors ArchaeoLens tokens: paper, ink, terracotta, copper.
   ═══════════════════════════════════════════════════════════════════ */

const TEX_W = 1600;
const TEX_H = 940;

function makeChapterTexture(i: number): THREE.CanvasTexture {
  const cv = document.createElement("canvas");
  cv.width = TEX_W;
  cv.height = TEX_H;
  const ctx = cv.getContext("2d")!;
  paintPaperPanel(ctx);
  CHAPTERS[i].draw(ctx);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function paintPaperPanel(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, TEX_W, TEX_H);
  const g = ctx.createLinearGradient(0, 0, 0, TEX_H);
  g.addColorStop(0, "#faf6ec");
  g.addColorStop(1, "#efe7d5");
  rr(ctx, 22, 22, TEX_W - 44, TEX_H - 44, 40);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(43,36,24,0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();
  /* corner ticks — museum-plate feel */
  ctx.strokeStyle = "rgba(168,91,60,0.85)";
  ctx.lineWidth = 3;
  const L = 34, o = 48;
  [[o, o], [TEX_W - o, o], [o, TEX_H - o], [TEX_W - o, TEX_H - o]].forEach(([x, y], k) => {
    const sx = k % 2 === 0 ? 1 : -1;
    const sy = k < 2 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x + sx * L, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * L);
    ctx.stroke();
  });
}

function kick(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillStyle = TERRA;
  ctx.font = "600 26px 'Segoe UI', system-ui, sans-serif";
  ctx.letterSpacing = "12px";
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.letterSpacing = "0px";
}
function rule(ctx: CanvasRenderingContext2D, x: number, y: number, w = 130) {
  ctx.strokeStyle = "rgba(168,91,60,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}
function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const wd of words) {
    const test = line ? line + " " + wd : wd;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = wd;
      yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, sans-serif";

/* ── 0 · Hero ──────────────────────────────────────────────────────── */
function drawHero(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "The Field Edition · Issue 01", cx, 180);
  ctx.fillStyle = INK;
  ctx.font = `400 96px ${SERIF}`;
  ctx.fillText("Record the", cx, 330);
  ctx.save();
  ctx.fillStyle = TERRA;
  ctx.fillText("visible", cx, 455);
  const w = ctx.measureText("visible").width;
  ctx.restore();
  ctx.fillStyle = INK;
  ctx.fillText(", before the", cx + w, 455);
  ctx.save();
  ctx.font = `italic 400 96px ${SERIF}`;
  ctx.fillText("interpretation.", cx, 580);
  ctx.restore();
  rule(ctx, cx, 665, 170);
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${SANS}`;
  wrap(ctx, "Photograph an artefact, sherd, lithic, coin or gem — receive a measured, citation-backed record.", cx, 740, 1180, 46);
  rr(ctx, cx, 820, 420, 84, 42);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.fillStyle = PAPER;
  ctx.font = "600 24px 'Segoe UI', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("SCAN AN ARTEFACT", cx + 56, 872);
  ctx.letterSpacing = "0px";
}

/* ── 1 · The Index ─────────────────────────────────────────────────── */
function drawIndex(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "The Index · Ten departments", cx, 170);
  ctx.fillStyle = INK;
  ctx.font = `400 84px ${SERIF}`;
  ctx.fillText("Every directory,", cx, 300);
  ctx.fillText("one volume.", cx, 410);
  const depts = [
    ["01", "Archaeological Sites"], ["06", "Museum Directory"],
    ["02", "Cultural Periods"], ["07", "Heritage Laws"],
    ["03", "Pottery & Script Typology"], ["08", "My Field Notes"],
    ["04", "Stone Tools — 3D"], ["09", "References"],
    ["05", "The Virtual Museum"], ["10", "Community Forum"],
  ];
  depts.forEach(([n, t], i) => {
    const x = cx + (i % 2) * 700;
    const y = 500 + Math.floor(i / 2) * 66;
    ctx.fillStyle = TERRA;
    ctx.font = "600 22px 'Segoe UI', sans-serif";
    ctx.fillText(n, x, y);
    ctx.fillStyle = INK;
    ctx.font = "400 30px 'Segoe UI', sans-serif";
    ctx.fillText(t, x + 60, y);
  });
}

/* ── 2 · Museum ────────────────────────────────────────────────────── */
function drawMuseum(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "New · WebGL Experience", cx, 180);
  ctx.fillStyle = INK;
  ctx.font = `400 88px ${SERIF}`;
  ctx.fillText("Enter the", cx, 320);
  ctx.save();
  ctx.font = `italic 400 88px ${SERIF}`;
  ctx.fillStyle = TERRA;
  ctx.fillText("Virtual Museum.", cx, 440);
  ctx.restore();
  rule(ctx, cx, 530);
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${SANS}`;
  wrap(ctx, "Walk a lit gallery of ten prehistoric artefacts — Olduvai handaxes, microliths, querns and Harappan blades. Click any piece to step closer and read its record.", cx, 610, 1180, 46);
  rr(ctx, cx, 760, 430, 84, 42);
  ctx.strokeStyle = TERRA;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = TERRA;
  ctx.font = "600 24px 'Segoe UI', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("TAKE THE 3D TOUR", cx + 66, 812);
  ctx.letterSpacing = "0px";
}

/* ── 3 · Field method ──────────────────────────────────────────────── */
function drawMethod(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "Field Method · §1", cx, 170);
  ctx.fillStyle = INK;
  ctx.font = "400 54px 'Nirmala UI', 'Noto Sans Devanagari', sans-serif";
  ctx.fillText("यहाँ भी खुदा है, वहाँ भी खुदा है…", cx, 290);
  ctx.fillText("जहाँ नहीं खुदा, हमें बताओ…", cx, 370);
  ctx.fillStyle = MUTED;
  ctx.font = `italic 400 28px ${SERIF}`;
  ctx.fillText("An archaeologist's creed · भारतीय पुरातत्व", cx, 440);
  rule(ctx, cx, 510, 1240);
  const promises: Array<[string, string]> = [
    ["AUTHENTIC WORDING", "Visible evidence is held apart from dating, provenance and final authentication."],
    ["REFERENCE-BACKED", "Links to museum, heritage, IGS and typology comparison resources."],
    ["YOUR FIELD RECORD", "Observations saved privately with photo, GPS and notes — cloud synced."],
  ];
  promises.forEach(([t, b], i) => {
    const x = cx + i * 500;
    ctx.fillStyle = TERRA;
    ctx.font = "600 20px 'Segoe UI', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText(t, x, 590);
    ctx.letterSpacing = "0px";
    ctx.fillStyle = MUTED;
    ctx.font = "400 24px 'Segoe UI', sans-serif";
    wrap(ctx, b, x, 635, 440, 36);
  });
}

/* ── 4 · Careers ───────────────────────────────────────────────────── */
function drawCareers(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "Department · Careers", cx, 170);
  ctx.fillStyle = INK;
  ctx.font = `400 84px ${SERIF}`;
  ctx.fillText("Opportunities", cx, 300);
  ctx.fillText("in the discipline.", cx, 410);
  rule(ctx, cx, 500);
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${SANS}`;
  wrap(ctx, "Curated academic posts, PhD positions, postdoctoral fellowships, faculty roles and research grants — collected for fieldworkers.", cx, 580, 1200, 46);
  const roles = ["PhD Scholarships", "Postdoc Fellowships", "Faculty Positions", "Research Grants"];
  roles.forEach((r, i) => {
    const x = cx + (i % 2) * 640;
    const y = 730 + Math.floor(i / 2) * 80;
    ctx.fillStyle = TERRA;
    ctx.font = "600 22px 'Segoe UI', sans-serif";
    ctx.fillText("→", x, y);
    ctx.fillStyle = INK;
    ctx.font = "400 28px 'Segoe UI', sans-serif";
    ctx.fillText(r, x + 44, y);
  });
}

/* ── 5 · Colophon ──────────────────────────────────────────────────── */
function drawColophon(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "Colophon · Est. XXIV·IV·MMXXVI", cx, 180);
  ctx.fillStyle = INK;
  ctx.font = `400 110px ${SERIF}`;
  ctx.fillText("ArchaeoLens", cx, 340);
  rule(ctx, cx, 420);
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${SANS}`;
  wrap(ctx, "Set in DM Serif Display and Fira Sans. For educational and research use only — not a certified authentication service; consult qualified archaeologists for professional assessment.", cx, 500, 1200, 46);
  rr(ctx, cx, 660, 460, 84, 42);
  ctx.fillStyle = INK;
  ctx.fill();
  ctx.fillStyle = PAPER;
  ctx.font = "600 24px 'Segoe UI', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("CONTACT THE STUDIO", cx + 60, 712);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = MUTED;
  ctx.font = "600 20px 'Segoe UI', sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("© 2026 ARCHAEOLENS · THE FIELD EDITION", cx, 860);
  ctx.letterSpacing = "0px";
}




