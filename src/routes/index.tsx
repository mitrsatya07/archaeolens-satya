import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Landmark, Library, ShieldCheck } from "lucide-react";
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
  const [cameraOpen, setCameraOpen] = useState(false);
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
    setCameraOpen(false);
  };

  if (result && imageUrl) {
    return (
      <main className="min-h-screen field-shell px-4 py-6 text-foreground">
        <IdentifyResultCard result={result} imageUrl={imageUrl} onAgain={reset} />
      </main>
    );
  }

  if (cameraOpen) {
    return (
      <main className="relative h-[100dvh] w-screen overflow-hidden field-shell text-foreground">
        <CameraCapture busy={busy} onCapture={handleCapture} onClose={() => setCameraOpen(false)} />
        {busy && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-foreground/35 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground shadow-sm backdrop-blur-sm">
              Preparing evidence-backed observation…
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] field-shell px-5 py-6 text-foreground">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-md flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Landmark className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Archaeological field app
                </p>
                <h1 className="text-2xl font-black tracking-tight text-primary">ArchaeoLens</h1>
              </div>
            </div>
            <a
              href="/about"
              className="rounded-full border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm hover:bg-accent"
            >
              Method
            </a>
          </div>

          <section className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Photo-based artifact observation
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-foreground">
              Record visible evidence before interpretation.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Capture ceramics, lithics, coins, inscriptions, terracotta, metal, bone, or sculptural
              fragments and receive a cautious field record with diagnostic features, confidence
              level, and research references.
            </p>
          </section>

          <section className="mt-8 grid gap-3">
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Authentic wording"
              text="Results separate visible evidence from dating, provenance, and final authentication."
            />
            <Feature
              icon={<Library className="h-5 w-5" />}
              title="Reference-backed"
              text="Links point to museum, heritage, and typology comparison resources."
            />
          </section>
        </div>

        <div className="pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-8">
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
          >
            <Camera className="h-5 w-5" />
            Open full-screen camera
          </button>
        </div>
      </div>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
