import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, X, ScanLine, Terminal, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  busy: boolean;
  mode: "nature" | "archaeology";
  onModeChange: (mode: "nature" | "archaeology") => void;
  onCapture: (dataUrl: string) => void;
}

const MAX_DIM = 1024;

function downscaleToJpeg(source: HTMLImageElement | HTMLVideoElement, sw: number, sh: number): string {
  const scale = Math.min(1, MAX_DIM / Math.max(sw, sh));
  const w = Math.round(sw * scale);
  const h = Math.round(sh * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(source, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export function CameraCapture({ busy, mode, onModeChange, onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      setError(null);
      setReady(false);
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera not supported in this browser. Use the upload button below.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
          setReady(true);
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Camera unavailable";
        setError(`${msg}. You can upload a photo instead.`);
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const handleShutter = () => {
    const v = videoRef.current;
    if (!v || !ready) return;
    try {
      const dataUrl = downscaleToJpeg(v, v.videoWidth, v.videoHeight);
      onCapture(dataUrl);
    } catch (e) {
      console.error(e);
      setError("Could not capture frame. Try again.");
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const dataUrl = downscaleToJpeg(img, img.naturalWidth, img.naturalHeight);
          onCapture(dataUrl);
        } catch (e) {
          console.error(e);
          setError("Could not read the image.");
        }
      };
      img.onerror = () => setError("Could not load that image file.");
      img.src = reader.result as string;
    };
    reader.onerror = () => setError("Could not read the file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full bg-background object-cover"
      />

      <div className="pointer-events-none absolute inset-0 z-[5] cyber-grid opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-background via-background/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),0.75rem)]">
        <div className="rounded-xl border border-cyber/25 bg-background/55 px-3 py-2 backdrop-blur-md cyber-glow">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyber" />
            <h1 className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-cyber cyber-text-glow">LensID</h1>
          </div>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cyber-muted">{mode === "archaeology" ? "artifact · context · field note" : "bio · fauna · geo scan"}</p>
        </div>
        <a
          href="/about"
          className="rounded-md border border-cyber/30 bg-background/55 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-cyber backdrop-blur-md transition-colors hover:bg-cyber/10"
        >
          intel
        </a>
      </div>
      <div className="absolute left-4 right-4 top-28 z-20 grid grid-cols-2 gap-2 rounded-xl border border-cyber/20 bg-background/55 p-1 backdrop-blur-md cyber-glow">
        <button
          type="button"
          onClick={() => onModeChange("nature")}
          disabled={busy}
          className={`rounded-lg px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
            mode === "nature" ? "bg-cyber text-cyber-foreground" : "text-cyber-muted hover:bg-cyber/10"
          }`}
        >
          Nature scan
        </button>
        <button
          type="button"
          onClick={() => onModeChange("archaeology")}
          disabled={busy}
          className={`rounded-lg px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
            mode === "archaeology" ? "bg-cyber text-cyber-foreground" : "text-cyber-muted hover:bg-cyber/10"
          }`}
        >
          Archaeology
        </button>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative h-72 w-72 max-h-[68vw] max-w-[68vw] border border-cyber/55 cyber-glow">
          <div className="absolute -left-1 -top-1 h-8 w-8 border-l-2 border-t-2 border-cyber" />
          <div className="absolute -right-1 -top-1 h-8 w-8 border-r-2 border-t-2 border-cyber" />
          <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-cyber" />
          <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-2 border-r-2 border-cyber" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-cyber/45" />
          <div className="absolute bottom-0 left-1/2 top-0 w-px bg-cyber/45" />
          <div className="absolute inset-x-4 top-1/2 h-px cyber-scanline" />
          <Crosshair className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-cyber/80" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around px-6 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label="Upload photo"
          className="flex h-12 w-12 items-center justify-center rounded-md border border-cyber/30 bg-background/60 text-cyber backdrop-blur-md transition-colors hover:bg-cyber/10 disabled:opacity-50"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleShutter}
          disabled={busy || !ready}
          aria-label="Capture and identify"
          className="group relative flex h-20 w-20 items-center justify-center rounded-md border border-cyber bg-cyber text-cyber-foreground shadow-[0_0_34px_color-mix(in_oklab,var(--cyber)_40%,transparent)] transition-transform active:scale-95 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-7 w-7 animate-spin text-cyber-foreground" />
          ) : (
            <ScanLine className="h-7 w-7 text-cyber-foreground" />
          )}
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-cyber/10 bg-background/30 font-mono text-[10px] uppercase tracking-widest text-cyber-muted">
          {mode === "archaeology" ? "record" : "armed"}
        </div>
      </div>

      {!ready && !error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 font-mono text-sm text-cyber backdrop-blur-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting camera…
        </div>
      )}

      {error && (
        <div className="absolute inset-x-4 top-24 z-30 rounded-xl border border-destructive/30 bg-background/80 p-4 text-sm text-foreground backdrop-blur-md cyber-glow">
          <div className="mb-3 flex items-start gap-2">
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => fileRef.current?.click()}
            className="w-full"
          >
            <ImageIcon className="mr-2 h-4 w-4" /> Upload a photo
          </Button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
