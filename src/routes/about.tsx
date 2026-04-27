import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf, PawPrint, Gem, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LensID — How identification works" },
      {
        name: "description",
        content:
          "LensID uses AI vision to identify plants, animals, and minerals, then links you to authoritative scientific databases like GBIF, IUCN, Mindat, and the Geological Survey of India.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="dark min-h-screen cyber-shell px-5 py-8 text-foreground"><div className="pointer-events-none fixed inset-0 cyber-grid opacity-35" /><div className="relative mx-auto max-w-2xl animate-fade-in">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded-md border border-cyber/20 bg-background/45 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-cyber hover:bg-cyber/10"
      >
        <ArrowLeft className="h-4 w-4" /> Back to scan
      </Link>

      <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-cyber-muted">System brief</p>
      <h1 className="mt-2 font-mono text-4xl font-black uppercase tracking-tight text-cyber cyber-text-glow">LensID Intel</h1>
      <p className="mt-3 rounded-xl border border-cyber/15 bg-background/45 p-4 text-muted-foreground backdrop-blur">
        Point your phone or laptop camera at any plant, animal, or mineral on Earth. LensID will identify it
        and show you its scientific name, common name, names in major Indian languages, and links to
        authoritative scientific databases.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card icon={<Leaf className="h-5 w-5 text-leaf" />} title="Plants">
          Trees, flowers, herbs, ferns and more — identified with their botanical name and family.
        </Card>
        <Card icon={<PawPrint className="h-5 w-5 text-fauna" />} title="Animals">
          Birds, mammals, reptiles, insects — with conservation status from the IUCN Red List.
        </Card>
        <Card icon={<Gem className="h-5 w-5 text-mineral" />} title="Minerals">
          Rocks and minerals identified with links to Mindat and the Geological Survey of India.
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">How it works</h2>
        <ol className="space-y-3 text-sm text-foreground/90">
          <li>
            <span className="font-semibold">1. Capture.</span> The browser uses your device camera (or you can
            upload a photo). The image is downscaled before being sent — no original-resolution photos leave
            your device.
          </li>
          <li>
            <span className="font-semibold">2. Identify.</span> An AI vision model analyses the image and
            returns the most likely species or mineral, plus a confidence level.
          </li>
          <li>
            <span className="font-semibold">3. Verify.</span> Every result links out to authoritative
            scientific sources — Wikipedia, GBIF, POWO, iNaturalist, IUCN, Mindat, and GSI — so you can
            cross-check before relying on the answer.
          </li>
        </ol>
      </section>

      <section className="mt-10 rounded-xl border border-cyber/20 bg-background/45 p-5 backdrop-blur cyber-glow">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-foreground" />
          <h2 className="text-base font-semibold text-foreground">Honest limits</h2>
        </div>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>AI can be wrong, especially with partial views, poor light, or rare species.</li>
          <li>Confidence is shown on every result — treat low-confidence guesses with care.</li>
          <li>
            LensID never tells you whether something is safe to eat, touch, or use medicinally. Always consult
            an expert for those decisions.
          </li>
          <li>No images, results, or accounts are stored. v1 is intentionally minimal.</li>
        </ul>
      </section>
    </div></main>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-cyber/20 bg-card/70 p-4 backdrop-blur hover-scale">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
