import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Landmark, Pickaxe, Coins, ScrollText, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ArchaeoLens — Archaeological observation method" },
      {
        name: "description",
        content:
          "ArchaeoLens supports cautious archaeological photo observation with visible evidence, field notes, documentation advice, and research references.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground"><div className="pointer-events-none fixed inset-0 field-grid opacity-25" /><div className="relative mx-auto max-w-2xl animate-fade-in">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Back to camera
      </Link>

      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Field method</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-primary">ArchaeoLens</h1>
      <p className="mt-3 rounded-lg border border-border bg-card p-4 text-muted-foreground shadow-sm">
        Photograph a possible artifact or fragment to create a cautious archaeological observation. The record
        focuses on visible evidence: material, form, condition, surface treatment, diagnostic features, and what
        still requires site context or expert comparison.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card icon={<Landmark className="h-5 w-5 text-primary" />} title="Ceramics">
          Sherds, rims, bases, slips, fabrics, firing traces, and surface treatment.
        </Card>
        <Card icon={<Pickaxe className="h-5 w-5 text-primary" />} title="Lithics">
          Flakes, blades, cores, retouch, percussion marks, and raw material observations.
        </Card>
        <Card icon={<Coins className="h-5 w-5 text-primary" />} title="Metals">
          Coins, tools, fittings, corrosion, patina, and visible manufacturing traces.
        </Card>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">How it works</h2>
        <ol className="space-y-3 text-sm text-foreground/90">
          <li>
            <span className="font-semibold">1. Photograph.</span> Capture the object with a stable view. A scale,
            north arrow, oblique angle, and context photo make the observation stronger.
          </li>
          <li>
            <span className="font-semibold">2. Observe.</span> The model describes visible archaeological evidence
            and avoids claims that cannot be supported by the image.
          </li>
          <li>
            <span className="font-semibold">3. Compare.</span> Research references help compare typologies and
            collections; they are not proof of authentication or dating.
          </li>
        </ol>
      </section>

      <section className="mt-10 rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-foreground" />
          <h2 className="text-base font-semibold text-foreground">Authenticity and ethics</h2>
        </div>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Photo observation is not authentication, provenance, valuation, or final dating.</li>
          <li>Do not disturb sites or remove objects; follow local heritage laws and reporting procedures.</li>
          <li>Record context, scale, measurements, layer/trench data, and findspot notes whenever permitted.</li>
          <li>Consult qualified archaeologists, conservators, or heritage authorities for decisions.</li>
        </ul>
      </section>
    </div></main>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm hover-scale">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}
