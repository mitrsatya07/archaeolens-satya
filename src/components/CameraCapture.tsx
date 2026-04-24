import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, RefreshCw, Loader2, X } from "lucide-react";
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
        className="absolute inset-0 h-full w-full bg-black object-cover"
      />

      {/* Top gradient & header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),0.75rem)]">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-white">LensID</h1>
          <p className="text-[11px] text-white/70">Plants · Animals · Minerals</p>
        </div>
        <a
          href="/about"
          className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm hover:bg-black/50"
        >
          About
        </a>
      </div>

      {/* Framing reticle */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-64 w-64 max-h-[60vw] max-w-[60vw] rounded-3xl border-2 border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" />
      </div>

      {/* Bottom controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around px-6 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label="Upload photo"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 disabled:opacity-50"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleShutter}
          disabled={busy || !ready}
          aria-label="Capture and identify"
          className="group relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-white/40 transition-transform active:scale-95 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-7 w-7 animate-spin text-foreground" />
          ) : (
            <Camera className="h-7 w-7 text-foreground" />
          )}
        </button>

        <div className="flex h-12 w-12 items-center justify-center text-white/70">
          <RefreshCw className="h-5 w-5 opacity-0" />
        </div>
      </div>

      {!ready && !error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 text-sm text-white">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting camera…
        </div>
      )}

      {error && (
        <div className="absolute inset-x-4 top-20 z-30 rounded-xl border border-white/20 bg-black/70 p-4 text-sm text-white backdrop-blur-md">
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
