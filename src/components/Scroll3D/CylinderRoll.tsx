/* CylinderRoll — ArchaeoLens cylindrical 3D page-roll journey.
   Five 100vh phases over 500vh of scroll:
     0–100vh   cards drift scattered in 3D space
     100–200vh cards assemble onto a cylinder at z:-10 (stagger 0.2s, 1.2s each)
     200–300vh carousel recedes (panels staggered z -5…-15), rotates to 270°,
               camera pans laterally 3 units
     300–400vh carousel reaches z:-40, rotation → 315° (45° per increment)
     400–500vh rotation completes 360° back to start; contact-form fields rise
               (Y -5 → 0); camera settles at (0, 2, 10) looking at the center
   Lenis smooth scroll + GSAP ScrollTrigger. Paper-editorial palette.
   Mobile / reduced motion → flat ScrollScene fallback. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useScrollProgress } from "./useScrollProgress";
import ScrollBackdrop from "./ScrollScene";
import { PostFX } from "./PostFX";
import { EnvWall, GLTFArtifact, HDREnv } from "./SceneAddons";
import { Html } from "@react-three/drei";
import { toast } from "sonner";
import { contactSchema } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

/* mode decision: roll on capable desktops, flat elsewhere */
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

/* palette (mirrors ArchaeoLens tokens) */
const PAPER = "#f6f0e3";
const INK = "#2b2418";
const TERRA = "#a85b3c";
const MUTED = "#6f6350";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Segoe UI', system-ui, sans-serif";

/* carousel constants */
const N = 8;                        // planes (spec: 8–12)
const STEP = (Math.PI * 2) / N;     // 45° apart
const RADIUS = 8;                   // carousel radius (spec: 8)
const PLANE_W = 12.8;
const PLANE_H = 7.5;

/* journey keyframes sampled by scroll progress T (1 = 500vh scrolled) */
const CAROUSEL_Z: Array<[number, number]> = [
  [0.2, -10], [0.4, -20], [0.6, -30], [0.8, -40], [1.0, -40],
];
const CAROUSEL_ROT: Array<[number, number]> = [
  [0.2, 90], [0.4, 180], [0.6, 270], [0.8, 315], [1.0, 360],
];
const CAM_KEYS: Array<{ t: number; pos: [number, number, number]; look: [number, number, number] }> = [
  { t: 0.0, pos: [0, 0, 10], look: [0, 0, -10] },
  { t: 0.2, pos: [0, 0, 8], look: [0, 0, -10] },
  { t: 0.4, pos: [3, 0.5, 2], look: [0, 0, -20] },   // lateral pan +3 units
  { t: 0.5, pos: [-3, 0.5, 0], look: [0, 0, -26] },  // lateral pan −3 units
  { t: 0.6, pos: [0, 1, -2], look: [0, 0, -30] },
  { t: 0.8, pos: [0, 1.5, 2], look: [0, 0, -40] },
  { t: 1.0, pos: [0, 2, 10], look: [0, 0, -20] },    // final (0, 2, 10) → center
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function sampleNum(keys: Array<[number, number]>, t: number): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * smooth((t - t0) / (t1 - t0 || 1));
  }
  return keys[keys.length - 1][1];
}

function sampleCam(t: number): { pos: THREE.Vector3; look: THREE.Vector3 } {
  const c = Math.min(0.999, Math.max(0, t));
  let i = 0;
  while (i < CAM_KEYS.length - 2 && CAM_KEYS[i + 1].t < c) i++;
  const a = CAM_KEYS[i];
  const b = CAM_KEYS[i + 1];
  const k = smooth((c - a.t) / (b.t - a.t || 1));
  return {
    pos: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.pos), new THREE.Vector3(...b.pos), k),
    look: new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.look), new THREE.Vector3(...b.look), k),
  };
}
/* ── Root: Lenis + body class + HUD ───────────────────────────────── */

export default function CylinderRoll() {
  const progress = useScrollProgress();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!MODE_ROLL) return;
    document.body.classList.add("roll-3d");
    return () => document.body.classList.remove("roll-3d");
  }, []);

  /* Lenis smooth scroll, GSAP ticker driven, ScrollTrigger synced */
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

  if (!MODE_ROLL) return <ScrollBackdrop />; // flat fallback

  return (
    <>
      <div className="roll-canvas" aria-hidden>
        <Canvas
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 160 }}
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

/* ── RollRig: planes + journey choreography ───────────────────────── */

function RollRig({
  progress,
  onActiveChange,
}: {
  progress: React.MutableRefObject<number>;
  onActiveChange: (i: number) => void;
}) {
  const world = useRef<THREE.Group>(null);
  const planeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const fieldRefs = useRef<(THREE.Group | null)[]>([]);
  const activeRef = useRef(-1);
  const dustRef = useRef<THREE.Points>(null);

  /* 8 chapter planes: home slot on the radius-8 cylinder + scattered start.
     Staggered personal z-offset (-5…-15) is applied from the 200–300vh phase. */
  const planes = useMemo(
    () =>
      CHAPTERS.map((_, i) => {
        const a = i * STEP;
        const home: [number, number, number] = [Math.sin(a) * RADIUS, 0, -Math.cos(a) * RADIUS];
        const homeRotY = Math.PI - a; // outward-facing on the cylinder
        const s = (n: number) => {
          const x = Math.sin(i * 91.7 + n * 47.3) * 43758.5453;
          return x - Math.floor(x);
        };
        const pos: [number, number, number] = [(s(1) - 0.5) * 30, (s(2) - 0.5) * 12, -2 - s(3) * 26];
        const rot: [number, number, number] = [(s(4) - 0.5) * Math.PI, (s(5) - 0.5) * Math.PI * 1.6, (s(6) - 0.5) * Math.PI];
        const zOff = -(5 + s(7) * 10);
        return { pos, rot, tex: makeChapterTexture(i), home, homeRotY, zOff, proxy: { a: 0 } };
      }),
    [],
  );
  const dust = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  /* GSAP assembly: scattered → cylinder slots (100–200vh),
     stagger 0.2s, duration 1.2s each */
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-space",
        start: () => window.innerHeight, // 100vh
        end: () => window.innerHeight * 2, // 200vh
        scrub: 1.2,
      },
      defaults: { duration: 1.2, ease: "power3.out" },
    });
    planes.forEach((pl, i) => {
      const at = i * 0.2; // stagger
      tl.to(pl.proxy, { a: 1 }, at);
      const mesh = planeRefs.current[i];
      if (!mesh) return;
      tl.to(mesh.position, { x: pl.home[0], y: pl.home[1], z: pl.home[2] }, at);
      tl.to(mesh.rotation, { x: 0, y: pl.homeRotY, z: 0 }, at);
    });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [planes]);

  useFrame((state, dt) => {
    const w = world.current;
    if (!w) return;
    const T = progress.current;

    /* carousel journey: recede (z −10 → −40) + rotate (90° → 360°) */
    w.position.z = sampleNum(CAROUSEL_Z, T);
    w.rotation.y = THREE.MathUtils.degToRad(sampleNum(CAROUSEL_ROT, T));
    w.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    if (dustRef.current) dustRef.current.rotation.y += dt * 0.02;

    /* staggered panel z-depth (200–300vh): panels spread −5…−15 */
    const spread = THREE.MathUtils.clamp((T - 0.4) / 0.2, 0, 1);

    /* per-plane reveal — only once GSAP has assembled them */
    const camDir = new THREE.Vector3(0, 0, -1);
    let best = 0;
    let bestDot = -2;
    const v = new THREE.Vector3();
    planeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const pl = planes[i];
      const assembled = pl.proxy.a;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (assembled < 1) {
        mat.opacity = assembled;
        return;
      }
      mesh.position.z = pl.home[2] + pl.zOff * spread;
      v.copy(mesh.position).applyEuler(w.rotation).normalize();
      const d = v.dot(camDir);
      if (d > bestDot) { bestDot = d; best = i; }
      const delta = Math.acos(THREE.MathUtils.clamp(d, -1, 1));
      const t = THREE.MathUtils.clamp(delta / STEP, 0, 1);
      mat.opacity = (1 - t * 0.7) * assembled;
      const s = 1 - t * 0.12 + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.004;
      mesh.scale.setScalar(s);
      mesh.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.08;
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      onActiveChange(best);
    }

    /* camera keyframe journey, eased follow + mouse parallax.
       Final key settles at (0, 2, 10) looking at the center. */
    const cam = sampleCam(T);
    state.camera.position.lerp(
      new THREE.Vector3(
        cam.pos.x + state.pointer.x * 0.4,
        cam.pos.y + state.pointer.y * 0.25,
        cam.pos.z,
      ),
      Math.min(1, dt * 3),
    );
    state.camera.lookAt(cam.look);
  });

  return (
    <>
      <fog attach="fog" args={[PAPER, 30, 110]} />
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
            rotation={pl.rot}
          >
            <planeGeometry args={[PLANE_W, PLANE_H]} />
            <meshBasicMaterial map={pl.tex} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* final chapter — real contact form rising Y −5 → 0 (400–500vh) */}
      <ContactFormRise progress={progress} />

      <EnvWall />
      <GLTFArtifact />
      <HDREnv />
      <PostFX />
    </>
  );
}
/* ── Final chapter: real contact form, rises Y −5 → 0 (400–500vh) ──
   Rendered through drei <Html> so the inputs are real, keyboard
   accessible, and submissions go straight to Supabase. */

function ContactFormRise({ progress }: { progress: React.MutableRefObject<number> }) {
  const box = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useFrame(() => {
    const el = box.current;
    if (!el) return;
    const T = progress.current;
    const r = smooth(THREE.MathUtils.clamp((T - 0.8) / 0.18, 0, 1));
    el.style.opacity = String(r);
    el.style.visibility = r > 0.02 ? "visible" : "hidden";
    /* spec: Y animation from −5 → 0 */
    el.style.transform = `translate3d(-50%, ${((r - 1) * 70).toFixed(1)}px, 0)`;
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse({
      name: name || undefined,
      email: email || undefined,
      category: "general",
      message,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      category: "general",
      message: parsed.data.message,
    });
    setSending(false);
    if (error) {
      toast.error("Could not send message. Please try again.");
      return;
    }
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <Html position={[0, 0.4, -20]} center wrapperClass="roll-form-wrap" style={{ pointerEvents: "auto" }}>
      <div ref={box} className="roll-form" style={{ opacity: 0, visibility: "hidden" }}>
        {sent ? (
          <div className="roll-form-inner" style={{ textAlign: "center" }}>
            <p className="rf-k">Message received</p>
            <h3 className="rf-title">धन्यवाद · Thank you</h3>
            <p className="rf-lead">Your record has been delivered privately to the ArchaeoLens team.</p>
          </div>
        ) : (
          <form className="roll-form-inner" onSubmit={submit}>
            <p className="rf-k">Final chapter · Contact</p>
            <h3 className="rf-title">Send a field record.</h3>
            <input
              className="rf-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="Name (optional)"
              aria-label="Name (optional)"
            />
            <input
              className="rf-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="Email (optional)"
              aria-label="Email (optional)"
            />
            <textarea
              className="rf-input rf-area"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={2000}
              required
              placeholder="Your message"
              aria-label="Your message"
            />
            <button className="rf-btn" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </Html>
  );
}
/* ═══════════════════════════════════════════════════════════════════
   CHAPTER TEXTURES — painted to canvas, used as plane textures.
   Palette mirrors ArchaeoLens tokens: paper, ink, terracotta.
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

/* 8 chapters (spec: image count 8–12) — labels drive the HUD */
const CHAPTERS = [
  { label: "Hero", draw: drawHero },
  { label: "The Index", draw: drawIndex },
  { label: "Virtual Museum", draw: drawMuseum },
  { label: "Field Method", draw: drawMethod },
  { label: "Timeline", draw: drawTimeline },
  { label: "Field Gallery", draw: drawGallery },
  { label: "Careers", draw: drawCareers },
  { label: "Colophon", draw: drawColophon },
];
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
  const depts: Array<[string, string]> = [
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

/* ── 2 · Virtual Museum ────────────────────────────────────────────── */
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

/* ── 4 · Timeline ──────────────────────────────────────────────────── */
function drawTimeline(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "05 · Chronology", cx, 180);
  ctx.fillStyle = INK;
  ctx.font = `400 84px ${SERIF}`;
  ctx.fillText("Two million years,", cx, 310);
  ctx.fillText("one line.", cx, 420);
  rule(ctx, cx, 500, 1380);
  const eras = ["Paleolithic", "Mesolithic", "Neolithic", "Harappan", "Historic", "Modern"];
  eras.forEach((e, i) => {
    const x = cx + 40 + i * 230;
    ctx.fillStyle = TERRA;
    ctx.beginPath();
    ctx.arc(x, 500, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = MUTED;
    ctx.font = "600 24px 'Segoe UI', sans-serif";
    ctx.fillText(e, x - 40, 560);
  });
  ctx.fillStyle = MUTED;
  ctx.font = `400 30px ${SANS}`;
  wrap(ctx, "Scroll the cultural periods timeline — characteristic artefacts and key sites for every era, Paleolithic to Modern.", cx, 660, 1200, 46);
}

/* ── 5 · Field gallery ─────────────────────────────────────────────── */
function drawGallery(ctx: CanvasRenderingContext2D) {
  const cx = 110;
  kick(ctx, "06 · Field Gallery", cx, 160);
  ctx.fillStyle = INK;
  ctx.font = `400 84px ${SERIF}`;
  ctx.fillText("Plates from the field.", cx, 290);
  const tiles: Array<[string, string, string]> = [
    ["Acheulean Handaxe", "OLDUVAI · QUARTZITE", "#c9a86a"],
    ["NBPW Bowl", "GANGETIC · SLIPWARE", "#2b2b30"],
    ["Microlithic Triangle", "LANGHNAJ · AGATE", "#a9748c"],
    ["Harappan Blade", "DHOLAVIRA · CHALCEDONY", "#cfc3ad"],
  ];
  const tw = 640, th = 380, gap = 40;
  tiles.forEach(([name, tag, from], i) => {
    const x = cx + (i % 2) * (tw + gap);
    const y = 340 + Math.floor(i / 2) * (th + gap);
    const g = ctx.createLinearGradient(x, y, x + tw, y + th);
    g.addColorStop(0, from);
    g.addColorStop(1, "#efe7d5");
    rr(ctx, x, y, tw, th, 24);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(43,36,24,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.font = `400 42px ${SERIF}`;
    ctx.fillText(name, x + 40, y + th - 66);
    ctx.fillStyle = TERRA;
    ctx.font = "600 20px 'Segoe UI', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText(tag, x + 40, y + th - 30);
    ctx.letterSpacing = "0px";
  });
}

/* ── 6 · Careers ───────────────────────────────────────────────────── */
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

/* ── 7 · Colophon ──────────────────────────────────────────────────── */
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

