import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Loader2, X, ScanLine, Landmark, Crosshair, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  busy: boolean;
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

export function CameraCapture({ busy, onCapture }: Props) {
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

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),0.75rem)]">
        <div className="rounded-lg border border-primary/15 bg-card/90 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-primary" />
            <h1 className="text-sm font-bold uppercase tracking-wide text-primary">ArchaeoLens</h1>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Photo observation record</p>
        </div>
        <a
          href="/about"
          className="rounded-md border border-primary/15 bg-card/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-accent"
        >
          method
        </a>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative h-72 w-72 max-h-[68vw] max-w-[68vw] border border-primary/45 bg-background/5">
          <div className="absolute -left-1 -top-1 h-8 w-8 border-l-2 border-t-2 border-primary/70" />
          <div className="absolute -right-1 -top-1 h-8 w-8 border-r-2 border-t-2 border-primary/70" />
          <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-primary/70" />
          <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-2 border-r-2 border-primary/70" />
          <div className="absolute inset-x-6 top-1/2 h-px bg-primary/35" />
          <div className="absolute bottom-6 left-1/2 top-6 w-px bg-primary/35" />
          <Crosshair className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-primary/70" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around px-6 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label="Upload photo"
          className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/20 bg-card/90 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-accent disabled:opacity-50"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleShutter}
          disabled={busy || !ready}
          aria-label="Capture and identify"
          className="group relative flex h-20 w-20 items-center justify-center rounded-md border border-primary bg-primary text-primary-foreground shadow-md transition-transform active:scale-95 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary-foreground" />
          ) : (
            <ScanLine className="h-7 w-7 text-primary-foreground" />
          )}
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-md border border-primary/10 bg-card/70 text-primary/70 shadow-sm">
          <Ruler className="h-4 w-4" />
        </div>
      </div>

      {!ready && !error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/75 text-sm text-primary backdrop-blur-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting camera…
        </div>
      )}

      {error && (
        <div className="absolute inset-x-4 top-24 z-30 rounded-lg border border-destructive/30 bg-card/95 p-4 text-sm text-foreground shadow-sm backdrop-blur-sm">
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
