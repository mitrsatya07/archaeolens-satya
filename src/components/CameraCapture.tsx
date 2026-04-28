import { useEffect, useRef, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Layers,
  Loader2,
  X,
  ScanLine,
  Landmark,
  Crosshair,
  Ruler,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  busy: boolean;
  onCapture: (dataUrl: string | string[]) => void;
  onClose?: () => void;
}

const MAX_DIM = 1024;

function downscaleToJpeg(
  source: HTMLImageElement | HTMLVideoElement,
  sw: number,
  sh: number,
): string {
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

export function CameraCapture({ busy, onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const videoFileRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [scaleVisible, setScaleVisible] = useState(false);
  const [angles, setAngles] = useState<string[]>([]);

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
      setAngles((current) => [...current, dataUrl].slice(0, 6));
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
          setAngles((current) => [...current, dataUrl].slice(0, 6));
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

  const handleVideoFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const clip = document.createElement("video");
    clip.preload = "metadata";
    clip.muted = true;
    clip.playsInline = true;

    clip.onloadedmetadata = async () => {
      const duration = Number.isFinite(clip.duration) && clip.duration > 0 ? clip.duration : 1;
      const seekPoints = [0.1, 0.35, 0.6, 0.85].map((p) => Math.min(duration * p, duration - 0.05));
      const frames: string[] = [];

      try {
        for (const point of seekPoints) {
          await new Promise<void>((resolve, reject) => {
            clip.onseeked = () => resolve();
            clip.onerror = () => reject(new Error("Video seek failed"));
            clip.currentTime = Math.max(0, point);
          });
          frames.push(downscaleToJpeg(clip, clip.videoWidth, clip.videoHeight));
        }
        onCapture(frames);
      } catch (e) {
        console.error(e);
        setError("Could not analyze that video. Try a shorter, clearer clip.");
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    clip.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Could not load that video file.");
    };
    clip.src = url;
  };

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full bg-background object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-foreground/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),0.75rem)]">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close camera"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/30 bg-foreground/30 text-primary-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground/45 disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}
        <div className="rounded-full border border-primary-foreground/25 bg-foreground/25 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-primary-foreground" />
            <h1 className="text-xs font-bold uppercase tracking-wide text-primary-foreground">
              Field Camera
            </h1>
          </div>
        </div>
        <a
          href="/about"
          className="rounded-full border border-primary-foreground/25 bg-foreground/25 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground/45"
        >
          method
        </a>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="relative h-[62vmin] w-[62vmin] min-h-60 min-w-60 max-h-[430px] max-w-[430px]">
          <div className="absolute inset-0 rounded-[2rem] border border-primary-foreground/45" />
          <div className="absolute -left-1 -top-1 h-12 w-12 rounded-tl-[2rem] border-l-4 border-t-4 border-primary-foreground" />
          <div className="absolute -right-1 -top-1 h-12 w-12 rounded-tr-[2rem] border-r-4 border-t-4 border-primary-foreground" />
          <div className="absolute -bottom-1 -left-1 h-12 w-12 rounded-bl-[2rem] border-b-4 border-l-4 border-primary-foreground" />
          <div className="absolute -bottom-1 -right-1 h-12 w-12 rounded-br-[2rem] border-b-4 border-r-4 border-primary-foreground" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/60" />
          <Crosshair className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 text-primary-foreground" />
        </div>
      </div>

      {scaleVisible && (
        <div className="pointer-events-none absolute bottom-36 left-1/2 z-20 w-48 -translate-x-1/2 text-primary-foreground">
          <div className="h-3 border-x-2 border-b-2 border-primary-foreground" />
          <div className="mt-1 flex justify-between text-[10px] font-bold uppercase tracking-wide drop-shadow">
            <span>0</span>
            <span>Scale reference</span>
            <span>10 cm</span>
          </div>
        </div>
      )}

      {angles.length > 0 && (
        <div className="absolute inset-x-4 bottom-32 z-20 rounded-xl border border-primary-foreground/20 bg-foreground/30 p-2 text-primary-foreground shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> {angles.length} angle{angles.length > 1 ? "s" : ""}{" "}
              saved
            </span>
            <button
              type="button"
              onClick={() => setAngles([])}
              disabled={busy}
              className="opacity-90"
            >
              Clear
            </button>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => onCapture(angles)}
            disabled={busy}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-4 w-4" /> Analyze same antiquity
          </Button>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-foreground/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around px-6 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label="Upload photo"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/25 bg-foreground/25 text-primary-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground/45 disabled:opacity-50"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => videoFileRef.current?.click()}
          disabled={busy}
          aria-label="Upload video"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/25 bg-foreground/25 text-primary-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground/45 disabled:opacity-50"
        >
          <Video className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={handleShutter}
          disabled={busy || !ready || angles.length >= 6}
          aria-label="Capture angle"
          className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary-foreground bg-primary text-primary-foreground shadow-md transition-transform active:scale-95 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-7 w-7 animate-spin text-primary-foreground" />
          ) : (
            <ScanLine className="h-7 w-7 text-primary-foreground" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setScaleVisible((value) => !value)}
          disabled={busy}
          aria-label="Toggle scale guide"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20 bg-foreground/20 text-primary-foreground/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-foreground/40 disabled:opacity-50"
        >
          <Ruler className="h-4 w-4" />
        </button>
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
      <input
        ref={videoFileRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleVideoFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
