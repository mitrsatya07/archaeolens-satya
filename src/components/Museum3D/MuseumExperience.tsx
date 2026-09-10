/* Full-screen immersive museum experience: 3D scene + overlays + controls */

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, X, MapPin, Clock, Gem } from "lucide-react";
import { createInputState, type InputState } from "./Player";
import { MUSEUM_ARTIFACTS } from "./artifacts";

const MuseumScene = lazy(() => import("./MuseumScene"));

const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

export const MuseumExperience: React.FC = () => {
  const inputRef = useRef<InputState | null>(null);
  if (!inputRef.current) inputRef.current = createInputState();
  const input = inputRef.current as InputState;

  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const joystickRef = useRef<HTMLDivElement>(null);

  const focused = MUSEUM_ARTIFACTS.find((a) => a.id === focusId) ?? null;
  const paused = !entered || focusId !== null;

  /* Pointer lock (desktop) */
  const requestLook = useCallback(() => {
    if (isTouch || focusId) return;
    containerRef.current?.requestPointerLock?.();
  }, [focusId]);

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement === containerRef.current) {
        input.lookDX += e.movementX;
        input.lookDY += e.movementY;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mousemove", onMove); };
  }, [entered, focusId, input]);

  /* Touch look (drag; joystick zone excluded) */
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (t.clientX < window.innerWidth * 0.35 && t.clientY > window.innerHeight * 0.5) return;
    dragRef.current = { id: t.identifier, x: t.clientX, y: t.clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier !== drag.id) continue;
      input.lookDX += (t.clientX - drag.x) * 1.6;
      input.lookDY += (t.clientY - drag.y) * 1.6;
      drag.x = t.clientX;
      drag.y = t.clientY;
    }
  };
  const onTouchEnd = () => { dragRef.current = null; };

  /* Virtual joystick */
  const onJoystickMove = (e: React.TouchEvent) => {
    const el = joystickRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const t = e.changedTouches[0];
    input.strafe = Math.max(-1, Math.min(1, (t.clientX - cx) / (rect.width / 2)));
    input.forward = -Math.max(-1, Math.min(1, (t.clientY - cy) / (rect.height / 2)));
  };
  const onJoystickEnd = () => { input.strafe = 0; input.forward = 0; };

  const enter = () => {
    setEntered(true);
    requestLook();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0b0906] text-foreground select-none"
      onClick={() => { if (entered && !focusId) requestLook(); }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <p className="small-caps animate-pulse text-muted-foreground">Preparing the galleries…</p>
          </div>
        }
      >
        <MuseumScene
          paused={paused}
          focus={focusId ? { id: focusId, side: focused?.side ?? 1, z: focused?.z ?? 0 } : null}
          onFocus={setFocusId}
          inputRef={inputRef as React.MutableRefObject<InputState>}
          onReady={() => setReady(true)}
        />
      </Suspense>

      <MuseumTopBar entered={entered} focusId={focusId} />

      {/* Enter overlay */}
      {!entered && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#0b0906]/95 via-[#0b0906]/80 to-[#0b0906]/95 px-6 text-center">
          <p className="small-caps text-primary">ArchaeoLens · The Field Edition</p>
          <h1 className="max-w-xl font-display text-4xl leading-tight text-foreground sm:text-6xl">
            The Virtual Museum
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Walk a gallery of ten prehistoric artefacts — from Olduvai handaxes to Harappan blades.
            {isTouch ? " Drag to look, joystick to walk." : " Click to enter, then WASD to walk and mouse to look."}
          </p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); enter(); }}
            disabled={!ready}
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition disabled:opacity-40"
          >
            {ready ? "Enter the gallery" : "Preparing…"}
          </button>
        </div>
      )}

      {/* Touch joystick */}
      {isTouch && entered && !focusId && (
        <div
          ref={joystickRef}
          className="absolute bottom-10 left-8 z-20 h-28 w-28 touch-none rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm"
          onTouchStart={onJoystickMove}
          onTouchMove={(e) => { e.stopPropagation(); onJoystickMove(e); }}
          onTouchEnd={onJoystickEnd}
        >
          <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/40" />
        </div>
      )}

      {focused && (
        <FocusPanel artifact={focused} onClose={() => { setFocusId(null); requestLook(); }} />
      )}
    </div>
  );
};

/* ─── Overlays ─── */

const MuseumTopBar: React.FC<{ entered: boolean; focusId: string | null }> = ({ entered, focusId }) => (
  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
    <Link
      to="/"
      className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-background/60 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition hover:bg-background/80"
      onClick={(e) => { e.stopPropagation(); }}
    >
      <ArrowLeft className="h-3.5 w-3.5" /> ArchaeoLens
    </Link>
    {!isTouch && entered && !focusId && (
      <p className="small-caps rounded-full bg-background/50 px-4 py-2 text-[11px] text-muted-foreground backdrop-blur-sm">
        WASD move · mouse look · click an artefact · Esc frees cursor
      </p>
    )}
  </div>
);

const FocusPanel: React.FC<{ artifact: (typeof MUSEUM_ARTIFACTS)[number]; onClose: () => void }> = ({ artifact, onClose }) => (
  <aside className="absolute inset-x-0 bottom-0 z-20 border-t border-primary/30 bg-background/85 p-6 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md sm:rounded-2xl sm:border">
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:text-foreground"
      aria-label="Back to gallery"
    >
      <X className="h-4 w-4" />
    </button>
    <p className="small-caps text-primary">{artifact.type}</p>
    <h2 className="mt-1 font-display text-2xl leading-tight text-foreground">{artifact.name}</h2>
    <dl className="mt-3 space-y-1.5 text-xs text-muted-foreground">
      <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary/70" /> {artifact.age}</div>
      <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary/70" /> {artifact.location}</div>
      <div className="flex items-center gap-2"><Gem className="h-3.5 w-3.5 text-primary/70" /> {artifact.material}</div>
    </dl>
    <p className="mt-4 text-sm leading-relaxed text-foreground/80">{artifact.description}</p>
  </aside>
);

export default MuseumExperience;
