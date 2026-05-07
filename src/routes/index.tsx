import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Landmark, Library, ShieldCheck, Gem, Briefcase, ExternalLink, Building2, Pickaxe } from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { IdentifyResultCard } from "@/components/IdentifyResultCard";
import { identifyImage, type IdentifyResult, type ScanMode } from "@/server/identify.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArchaeoLens — Archaeological & mineral photo observation" },
      {
        name: "description",
        content:
          "Create cautious archaeological photo observations and mineral identifications for artifacts, ceramics, lithics, inscriptions, coins, gems, and fragments.",
      },
      { property: "og:title", content: "ArchaeoLens — Archaeological & mineral field observation" },
      {
        property: "og:description",
        content:
          "Record visible archaeological features, mineral properties, confidence level, and research references from a photo.",
      },
    ],
  }),
  component: IndexPage,
});

const careerOpportunities = [
  {
    title: "PhD Scholarships in Archaeology",
    url: "https://higherjobz.com/category/scholarships/phd-scholarships/?s=archaeology",
    description: "Fully funded PhD positions in archaeology and heritage studies worldwide.",
  },
  {
    title: "Postdoc Fellowships",
    url: "https://higherjobz.com/category/postdoc-fellowships/?s=archaeology",
    description: "Postdoctoral research fellowships in archaeological sciences.",
  },
  {
    title: "Faculty & Professor Positions",
    url: "https://higherjobz.com/category/faculty-positions/?s=archaeology",
    description: "Lecturer, Assistant, and Associate Professor roles in archaeology departments.",
  },
  {
    title: "Research Careers",
    url: "https://higherjobz.com/category/research-jobs/?s=archaeology",
    description: "Research assistant, associate, and senior researcher positions.",
  },
  {
    title: "Research Grants & Funding",
    url: "https://higherjobz.com/category/grants-funding/research-grants/?s=archaeology",
    description: "Grants and funding opportunities for archaeological research projects.",
  },
  {
    title: "Master's Scholarships",
    url: "https://higherjobz.com/category/scholarships/masters-scholarships/?s=archaeology",
    description: "Funded Master's programs in archaeology, heritage, and museum studies.",
  },
];

function IndexPage() {
  const [busy, setBusy] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>("archaeology");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<IdentifyResult | null>(null);

  const handleCapture = async (dataUrl: string | string[]) => {
    const images = Array.isArray(dataUrl) ? dataUrl : [dataUrl];
    const primaryImage = images[0];
    setBusy(true);
    setImageUrl(primaryImage);
    try {
      const res = await identifyImage({ data: { imagesBase64: images, mode: scanMode } });
      if (!res.ok) {
        toast.error(res.error);
        setImageUrl(null);
        return;
      }
      setResult(res.result);
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      toast.error(message);
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
              {scanMode === "archaeology"
                ? "Preparing evidence-backed observation…"
                : "Identifying mineral specimen…"}
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] field-shell px-5 py-6 text-foreground">
      <div className="mx-auto max-w-md space-y-8">
        {/* Header */}
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
          <div className="flex gap-2">
            <Link
              to="/about"
              className="rounded-full border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm hover:bg-accent"
            >
              Method
            </Link>
            <Link
              to="/stone-tools"
              className="rounded-full border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm hover:bg-accent"
            >
              Tools
            </Link>
            <Link
              to="/museums"
              className="rounded-full border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm hover:bg-accent"
            >
              Museums
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Photo-based observation
          </p>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-foreground">
            Record visible evidence before interpretation.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Capture artifacts, ceramics, lithics, coins, inscriptions, minerals, gems, or fragments
            and receive a cautious field record with diagnostic features, confidence level, and
            research references.
          </p>
        </section>

        {/* Features */}
        <section className="grid gap-3">
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Authentic wording"
            text="Results separate visible evidence from dating, provenance, and final authentication."
          />
          <Feature
            icon={<Library className="h-5 w-5" />}
            title="Reference-backed"
            text="Links point to museum, heritage, IGS, and typology comparison resources."
          />
          <Link
            to="/museums"
            className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Museum directory</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Browse ASI site museums, state museums, and international collections with Indian objects.
              </p>
            </div>
          </Link>
          <Link
            to="/stone-tools"
            className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Pickaxe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Stone Tools — 3D Collection</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Explore prehistoric stone tools with interactive 3D models from every region and period.
              </p>
            </div>
          </Link>
        </section>

        {/* Scan Mode Selector */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Choose scan mode
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setScanMode("archaeology")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                scanMode === "archaeology"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Landmark className="h-7 w-7" />
              <span className="text-sm font-semibold">Archaeology</span>
              <span className="text-[11px] leading-snug">Artifacts, pottery, coins, lithics</span>
            </button>
            <button
              type="button"
              onClick={() => setScanMode("nature")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                scanMode === "nature"
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Gem className="h-7 w-7" />
              <span className="text-sm font-semibold">Mineral / Gem</span>
              <span className="text-[11px] leading-snug">Rocks, minerals, gemstones</span>
            </button>
          </div>
        </section>

        {/* Camera Button */}
        <button
          type="button"
          onClick={() => setCameraOpen(true)}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          <Camera className="h-5 w-5" />
          {scanMode === "archaeology" ? "Scan artifact" : "Identify mineral"}
        </button>

        {/* Archaeology Career Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Archaeology Career Opportunities</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore academic jobs, PhD positions, postdoctoral fellowships, faculty roles, and
            research funding in archaeology and heritage studies worldwide.
          </p>
          <div className="grid gap-2">
            {careerOpportunities.map((opp) => (
              <a
                key={opp.title}
                href={opp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{opp.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {opp.description}
                  </p>
                </div>
                <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
          <a
            href="https://www.higherjobz.com/?s=archaeology"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-card px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-accent"
          >
            Browse all archaeology opportunities on HigherJobz
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/privacy-policy" className="hover:text-primary underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary underline">Terms of Service</Link>
            <Link to="/feedback" className="hover:text-primary underline">Rate App</Link>
            <Link to="/about" className="hover:text-primary underline">About</Link>
          </div>
          <p>© 2026 ArchaeoLens. For educational and research purposes only.</p>
          <p>Not a certified authentication service. Consult qualified archaeologists for professional assessments.</p>
        </footer>

        <div className="pb-[max(env(safe-area-inset-bottom),0.5rem)]" />
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
