import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Landmark, Pickaxe, Coins, ScrollText, ShieldCheck, Star, Mail, Globe, Smartphone, Camera, Search, BookOpen, Building2, Info } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ArchaeoLens — Archaeological Observation App" },
      {
        name: "description",
        content:
          "ArchaeoLens is an AI-powered archaeological photo observation app. Learn about features, version, permissions, and the team behind it.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground">
      <div className="pointer-events-none fixed inset-0 field-grid opacity-25" />
      <div className="relative mx-auto max-w-2xl animate-fade-in space-y-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        {/* App Identity */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Landmark className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">ArchaeoLens</h1>
              <p className="text-sm text-muted-foreground">Archaeological Photo Observation Tool</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">Version 1.0.0</span>
            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">Education</span>
            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-foreground">Free</span>
          </div>
        </div>

        {/* Description */}
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> About the App
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ArchaeoLens is an AI-powered educational tool for archaeological field observation. Photograph artifacts, ceramics, lithics, coins, inscriptions, minerals, gems, or stone tools — and receive a cautious evidence-based analysis with diagnostic features, confidence levels, and research references.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The app also includes a comprehensive directory of <strong>52 ASI site museums</strong>, state-wise museums across India, international museums with Indian collections, and an interactive <strong>3D stone tools gallery</strong> with 69+ prehistoric tools sourced from the Museum of Stone Tools (MoST).
          </p>
        </section>

        {/* Key Features */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Key Features</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <FeatureCard icon={<Camera className="h-5 w-5 text-primary" />} title="AI Photo Analysis">
              Capture or upload artifact photos for evidence-based archaeological observation.
            </FeatureCard>
            <FeatureCard icon={<Building2 className="h-5 w-5 text-primary" />} title="Museum Directory">
              Complete directory of 52 ASI museums, state museums, and international collections.
            </FeatureCard>
            <FeatureCard icon={<Pickaxe className="h-5 w-5 text-primary" />} title="3D Stone Tools">
              69+ prehistoric tools with interactive 3D models and museum cross-references.
            </FeatureCard>
            <FeatureCard icon={<Search className="h-5 w-5 text-primary" />} title="Smart Search">
              Filter by name, region, material, tool type, state, or museum display location.
            </FeatureCard>
            <FeatureCard icon={<BookOpen className="h-5 w-5 text-primary" />} title="Research References">
              Links to heritage databases, typology resources, and museum collections.
            </FeatureCard>
            <FeatureCard icon={<ShieldCheck className="h-5 w-5 text-primary" />} title="Ethical Approach">
              Clear disclaimers — AI observation is not authentication, dating, or valuation.
            </FeatureCard>
          </div>
        </section>

        {/* Archaeology Categories */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Observation Categories</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card icon={<Landmark className="h-5 w-5 text-primary" />} title="Ceramics">
              Sherds, rims, bases, slips, fabrics, firing traces, and surface treatment.
            </Card>
            <Card icon={<Pickaxe className="h-5 w-5 text-primary" />} title="Lithics">
              Flakes, blades, cores, retouch, percussion marks, and raw material.
            </Card>
            <Card icon={<Coins className="h-5 w-5 text-primary" />} title="Metals">
              Coins, tools, fittings, corrosion, patina, and manufacturing traces.
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">How It Works</h2>
          <ol className="space-y-3 text-sm text-foreground/90">
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
              <div><span className="font-semibold">Photograph.</span> Capture the object with a stable view. A scale, north arrow, and context photo make the observation stronger.</div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              <div><span className="font-semibold">Observe.</span> The AI describes visible archaeological evidence and avoids claims that cannot be supported by the image.</div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              <div><span className="font-semibold">Compare.</span> Research references help compare typologies and collections; they are not proof of authentication or dating.</div>
            </li>
          </ol>
        </section>

        {/* Permissions */}
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" /> App Permissions
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Camera className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <div><strong className="text-foreground">Camera</strong> — Required to capture photos of artifacts for AI analysis. Photos are processed in real-time and not stored on our servers.</div>
            </li>
            <li className="flex items-start gap-2">
              <Globe className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <div><strong className="text-foreground">Internet</strong> — Required to send images to the AI analysis service and load 3D stone tool models.</div>
            </li>
            <li className="flex items-start gap-2">
              <ScrollText className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <div><strong className="text-foreground">Storage (read)</strong> — Optional, for uploading photos from your device gallery.</div>
            </li>
          </ul>
        </section>

        {/* Ethics */}
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-foreground" />
            <h2 className="text-base font-semibold text-foreground">Authenticity &amp; Ethics</h2>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Photo observation is not authentication, provenance, valuation, or final dating.</li>
            <li>Do not disturb sites or remove objects; follow local heritage laws and reporting procedures.</li>
            <li>Record context, scale, measurements, layer/trench data, and findspot notes whenever permitted.</li>
            <li>Consult qualified archaeologists, conservators, or heritage authorities for decisions.</li>
            <li>Comply with the Antiquities and Art Treasures Act (India), UNESCO conventions, and local regulations.</li>
          </ul>
        </section>

        {/* Data Sources */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Data Sources</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
            <li>Archaeological Survey of India (ASI) — <a href="https://asi.nic.in" target="_blank" rel="noopener noreferrer" className="text-primary underline">asi.nic.in</a></li>
            <li>Press Information Bureau (PIB), Govt. of India — museum directory verification</li>
            <li>Museum of Stone Tools (MoST) — <a href="https://stonetoolsmuseum.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">stonetoolsmuseum.com</a></li>
            <li>Pedestal3D — Interactive 3D model hosting</li>
          </ul>
        </section>

        {/* Links */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Links</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link to="/privacy-policy" className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent">
              <ScrollText className="h-4 w-4 text-primary" /> Privacy Policy
            </Link>
            <Link to="/terms" className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent">
              <ShieldCheck className="h-4 w-4 text-primary" /> Terms of Service
            </Link>
            <Link to="/feedback" className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent">
              <Star className="h-4 w-4 text-primary" /> Rate This App
            </Link>
            <a href="mailto:support@archaeolens.app" className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent">
              <Mail className="h-4 w-4 text-primary" /> Contact Support
            </a>
            <Link to="/attributions" className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium hover:bg-accent sm:col-span-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Attributions &amp; Credits (Data Sources &amp; Licenses)
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">ArchaeoLens v1.0.0</p>
          <p>© 2026 ArchaeoLens. All rights reserved.</p>
          <p>For educational and research purposes only.</p>
        </footer>
      </div>
    </main>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">{icon}<h3 className="font-semibold text-foreground">{title}</h3></div>
      <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function FeatureCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
