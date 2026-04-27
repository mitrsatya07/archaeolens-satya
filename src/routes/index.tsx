import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CameraCapture } from "@/components/CameraCapture";
import { IdentifyResultCard } from "@/components/IdentifyResultCard";
import { identifyImage, type IdentifyResult } from "@/server/identify.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArchaeoLens — Archaeological photo observation" },
      {
        name: "description",
        content:
          "Create cautious archaeological photo observations for artifacts, ceramics, lithics, inscriptions, coins, and fragments with evidence-based field notes.",
      },
      { property: "og:title", content: "ArchaeoLens — Archaeological field observation" },
      {
        property: "og:description",
        content:
          "Record visible archaeological features, possible material, condition, documentation advice, and research references from a photo.",
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const [busy, setBusy] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyResult | null>(null);

  const handleCapture = async (dataUrl: string) => {
    setBusy(true);
    setImageUrl(dataUrl);
    try {
      const res = await identifyImage({ data: { imageBase64: dataUrl, mode: "archaeology" } });
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
      <main className="min-h-screen field-shell px-4 py-6 text-foreground">
        <IdentifyResultCard result={result} imageUrl={imageUrl} onAgain={reset} />
      </main>
    );
  }

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden field-shell text-foreground">
      <CameraCapture busy={busy} onCapture={handleCapture} />
      {busy && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-md border border-primary/20 bg-card/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
            Preparing field observation…
          </div>
        </div>
      )}
    </main>
  );
}
