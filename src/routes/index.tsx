import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CameraCapture } from "@/components/CameraCapture";
import { IdentifyResultCard } from "@/components/IdentifyResultCard";
import { identifyImage, type IdentifyResult, type ScanMode } from "@/server/identify.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LensID — Identify plants, animals & minerals with your camera" },
      {
        name: "description",
        content:
          "Point your camera at any plant, animal, or mineral and get its scientific name, local Indian-language names, and links to authoritative scientific sources.",
      },
      { property: "og:title", content: "LensID — Camera identifier for nature" },
      {
        property: "og:description",
        content:
          "Identify plants, animals, and minerals from your camera. Scientific names, local names, and trusted sources.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [mode, setMode] = useState<ScanMode>("nature");

  const handleCapture = async (dataUrl: string) => {
    setBusy(true);
    setImageUrl(dataUrl);
    try {
      const res = await identifyImage({ data: { imageBase64: dataUrl, mode } });
      if (!res.ok) {
        toast.error(res.error);
        setImageUrl(null);
        return;
      }
      setResult(res.result);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
      setImageUrl(null);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImageUrl(null);
  };

  if (result && imageUrl) {
    return (
      <main className="dark min-h-screen cyber-shell px-4 py-6 text-foreground">
        <IdentifyResultCard result={result} imageUrl={imageUrl} onAgain={reset} />
      </main>
    );
  }

  return (
    <main className="dark relative h-[100dvh] w-screen overflow-hidden cyber-shell text-foreground">
      <CameraCapture busy={busy} mode={mode} onModeChange={setMode} onCapture={handleCapture} />
      {busy && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-cyber/35 bg-background/75 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cyber backdrop-blur-md cyber-glow">
            Analyzing specimen…
          </div>
        </div>
      )}
    </main>
  );
}
