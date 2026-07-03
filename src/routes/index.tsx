import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Camera, Landmark, Library, ShieldCheck, Gem, Briefcase, ExternalLink,
  Building2, Pickaxe, MapPin, Clock, BookOpen, NotebookPen, Scale, ArrowUpRight,
} from "lucide-react";
import { CameraCapture } from "@/components/CameraCapture";
import { IdentifyResultCard } from "@/components/IdentifyResultCard";
import { identifyImage, type IdentifyResult, type ScanMode } from "@/lib/identify.functions";
import { AuthHeader } from "@/components/AuthHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ArchaeoLens — Archaeological & mineral photo observation" },
      {
        name: "description",
        content:
          "Editorial-grade archaeological photo observations for artifacts, ceramics, lithics, inscriptions, coins, gems, and minerals.",
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

const sections = [
  { to: "/sites", n: "01", kicker: "Directory", title: "Archaeological Sites", desc: "42+ ASI & UNESCO sites across India — search by state, period, culture.", Icon: MapPin },
  { to: "/timeline", n: "02", kicker: "Chronology", title: "Cultural Periods Timeline", desc: "Paleolithic to Modern — characteristic artifacts and key sites.", Icon: Clock },
  { to: "/typology", n: "03", kicker: "Reference", title: "Pottery & Script Typology", desc: "NBPW, PGW, BRW, Brahmi, Kharosthi, Indus script & more.", Icon: BookOpen },
  { to: "/stone-tools", n: "04", kicker: "Collection", title: "Stone Tools — 3D", desc: "Interactive prehistoric stone-tool models across regions.", Icon: Pickaxe },
  { to: "/museums", n: "05", kicker: "Index", title: "Museum Directory", desc: "ASI site museums, state museums, and international Indian collections.", Icon: Building2 },
  { to: "/heritage-laws", n: "06", kicker: "Statute", title: "Heritage Laws & Reporting", desc: "AMASR Act, Antiquities Act, and chance-find protocol with ASI.", Icon: Scale },
  { to: "/field-notes", n: "07", kicker: "Notebook", title: "My Field Notes", desc: "Save observations with photo, GPS, and notes — synced to your account.", Icon: NotebookPen },
  { to: "/references", n: "08", kicker: "Bibliography", title: "References & Citations", desc: "40+ authoritative sources — ASI reports, monographs, statutes.", Icon: Library },
] as const;

const careerOpportunities = [
  { title: "PhD Scholarships in Archaeology", url: "https://higherjobz.com/category/scholarships/phd-scholarships/?s=archaeology", description: "Fully funded PhD positions worldwide." },
  { title: "Postdoc Fellowships", url: "https://higherjobz.com/category/postdoc-fellowships/?s=archaeology", description: "Postdoctoral research fellowships in archaeological sciences." },
  { title: "Faculty & Professor Positions", url: "https://higherjobz.com/category/faculty-positions/?s=archaeology", description: "Lecturer to Associate Professor roles in archaeology departments." },
  { title: "Research Careers", url: "https://higherjobz.com/category/research-jobs/?s=archaeology", description: "Research assistant, associate, and senior researcher positions." },
  { title: "Research Grants & Funding", url: "https://higherjobz.com/category/grants-funding/research-grants/?s=archaeology", description: "Grants for archaeological research projects." },
  { title: "Master's Scholarships", url: "https://higherjobz.com/category/scholarships/masters-scholarships/?s=archaeology", description: "Funded Master's programs in archaeology and heritage." },
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
      if (!res.ok) { toast.error(res.error); setImageUrl(null); return; }
      setResult(res.result);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setImageUrl(null);
    } finally { setBusy(false); }
  };

  const reset = () => { setResult(null); setImageUrl(null); setCameraOpen(false); };

  if (result && imageUrl) {
    return (
      <main className="min-h-screen magazine-shell px-4 py-6 text-foreground">
        <IdentifyResultCard result={result} imageUrl={imageUrl} onAgain={reset} />
      </main>
    );
  }

  if (cameraOpen) {
    return (
      <main className="relative h-[100dvh] w-screen overflow-hidden magazine-shell text-foreground">
        <CameraCapture busy={busy} onCapture={handleCapture} onClose={() => setCameraOpen(false)} />
        {busy && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-foreground/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground backdrop-blur-sm">
              {scanMode === "archaeology" ? "Preparing evidence-backed observation…" : "Identifying mineral specimen…"}
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] magazine-shell text-foreground">
      {/* Masthead */}
      <header className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-background">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-none">
              <p className="small-caps text-muted-foreground">Est. MMXXVI · Vol. I</p>
              <h1 className="font-display text-2xl text-foreground sm:text-3xl">ArchaeoLens</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AuthHeader />
            <Link to="/about" className="hidden rounded-full border border-foreground/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition sm:inline-block">
              About
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        {/* Editorial hero */}
        <section className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <p className="small-caps text-primary reveal-up">The Field Edition · Issue 01</p>
            <h2 className="mt-5 font-display text-5xl leading-[0.95] text-foreground sm:text-7xl lg:text-[5.5rem] reveal-up reveal-d1">
              Record the <em className="not-italic text-primary">visible</em>,<br/>
              before the <em className="italic">interpretation.</em>
            </h2>
            <div className="editorial-rule my-7 max-w-md reveal-up reveal-d2" />
            <p className="drop-cap max-w-xl font-serif text-lg leading-relaxed text-foreground/85 sm:text-xl reveal-up reveal-d2">
              ArchaeoLens is a careful, citation-backed companion for fieldwork. Photograph an
              artefact, sherd, lithic, coin, inscription, mineral, or gem and receive a measured
              record — diagnostic features, confidence, and references separated from speculation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 reveal-up reveal-d3">
              <button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-editorial)] transition hover:bg-primary hover:-translate-y-0.5"
              >
                <Camera className="h-4 w-4" />
                {scanMode === "archaeology" ? "Scan an artefact" : "Identify a mineral"}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <Link to="/sites" className="inline-flex items-center gap-2 rounded-full border border-foreground/25 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background">
                Browse the directory
              </Link>
            </div>

            {/* Mode selector — editorial pills */}
            <div className="mt-8 inline-flex rounded-full border border-foreground/20 bg-card/60 p-1 backdrop-blur reveal-up reveal-d4">
              <ModePill active={scanMode === "archaeology"} onClick={() => setScanMode("archaeology")} icon={<Landmark className="h-3.5 w-3.5" />} label="Archaeology" />
              <ModePill active={scanMode === "nature"} onClick={() => setScanMode("nature")} icon={<Gem className="h-3.5 w-3.5" />} label="Mineral / Gem" />
            </div>
          </div>

          {/* Sidebar — masthead stats / pull-quote */}
          <aside className="lg:col-span-4 lg:border-l lg:border-foreground/15 lg:pl-10 reveal-up reveal-d3">
            <div className="plate-frame">
              <p className="small-caps text-muted-foreground">In this volume</p>
              <dl className="mt-5 space-y-5">
                <Stat n="42+" label="ASI & UNESCO sites catalogued" />
                <Stat n="40+" label="Authoritative citations" />
                <Stat n="08" label="Reference directories" />
              </dl>
            </div>
            <div className="editorial-rule my-7" />
            <figure className="relative">
              <span className="font-display text-6xl leading-none text-primary/40">“</span>
              <blockquote className="-mt-6 font-serif text-lg italic leading-snug text-foreground/85">
                The record of what is seen must precede the claim of what is known.
              </blockquote>
              <figcaption className="mt-3 small-caps text-muted-foreground">Field method · §1</figcaption>
            </figure>
          </aside>
        </section>


        {/* Signature quote — ASI lore */}
        <section className="mt-16">
          <figure className="relative overflow-hidden rounded-2xl border border-foreground/15 bg-card/60 px-6 py-10 sm:px-12 sm:py-14">
            <span aria-hidden className="pointer-events-none absolute -top-6 left-4 font-display text-[9rem] leading-none text-primary/20 sm:text-[12rem]">“</span>
            <span aria-hidden className="pointer-events-none absolute -bottom-20 right-4 font-display text-[9rem] leading-none text-primary/20 sm:text-[12rem]">”</span>
            <blockquote className="relative mx-auto max-w-3xl text-center font-serif text-lg italic leading-relaxed text-foreground sm:text-xl">
              यहाँ भी खुदा है, वहाँ भी खुदा है… जहाँ नहीं खुदा, हमें बताओ… हम खोद देंगे।
            </blockquote>
            <figcaption className="relative mt-6 text-center">
              <span className="small-caps text-muted-foreground">An archaeologist&rsquo;s creed · भारतीय पुरातत्व</span>
            </figcaption>
          </figure>
        </section>

        {/* Promise strip */}
        <section className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-foreground/15 bg-foreground/10 sm:grid-cols-3">
          <Promise icon={<ShieldCheck className="h-4 w-4" />} title="Authentic wording" text="Visible evidence is held apart from dating, provenance, and final authentication." />
          <Promise icon={<Library className="h-4 w-4" />} title="Reference-backed" text="Links to museum, heritage, IGS, and typology comparison resources." />
          <Promise icon={<NotebookPen className="h-4 w-4" />} title="Your field record" text="Save observations with photo, GPS, and notes — privately, with cloud sync." />
        </section>

        {/* Index / Table of contents */}
        <section className="mt-20">
          <div className="flex items-end justify-between gap-6 border-b border-foreground/20 pb-4">
            <h3 className="font-display text-3xl text-foreground sm:text-4xl">The Index</h3>
            <p className="small-caps hidden text-muted-foreground sm:block">Eight departments</p>
          </div>

          <div className="grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-4 mt-px">
            {sections.map(({ to, n, kicker, title, desc, Icon }, i) => (
              <Link
                key={to}
                to={to}
                className={`index-card group relative flex flex-col justify-between gap-6 bg-background p-6 hover:bg-card reveal-up ${["reveal-d1","reveal-d2","reveal-d3","reveal-d4","reveal-d5","reveal-d6","reveal-d6","reveal-d6"][i]}`}
              >
                <div className="flex items-start justify-between">
                  <span className="index-number font-display text-3xl text-primary/70">{n}</span>
                  <Icon className="h-5 w-5 text-foreground/50 transition group-hover:text-primary" />
                </div>
                <div>
                  <p className="small-caps text-muted-foreground">{kicker}</p>
                  <h4 className="mt-1 font-display text-xl leading-tight text-foreground">
                    <span className="index-title">{title}</span>
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0">
                    Read <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </section>

        {/* Careers — editorial feature */}
        <section className="mt-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="small-caps text-primary">Department · Careers</p>
            <h3 className="mt-3 font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Opportunities in the discipline.
            </h3>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Curated academic posts, PhD positions, postdoctoral fellowships, faculty roles, and
              grants in archaeology and heritage studies, worldwide.
            </p>
            <a
              href="https://www.higherjobz.com/?s=archaeology"
              target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/25 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground hover:text-background"
            >
              Browse all openings <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <ul className="lg:col-span-8 divide-y divide-foreground/15 border-y border-foreground/15">
            {careerOpportunities.map((opp) => (
              <li key={opp.title}>
                <a
                  href={opp.url} target="_blank" rel="noopener noreferrer"
                  className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 py-5"
                >
                  <Briefcase className="h-5 w-5 text-primary/70" />
                  <div className="min-w-0">
                    <p className="font-display text-xl leading-tight text-foreground transition group-hover:text-primary">{opp.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{opp.description}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-foreground/40 transition group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Colophon / Footer */}
        <footer className="mt-24 border-t border-foreground/20 pt-10 pb-12">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="small-caps text-muted-foreground">Colophon</p>
              <p className="mt-3 max-w-md font-serif text-base leading-relaxed text-foreground/80">
                Set in <em>DM Serif Display</em> and <em>Fira Sans</em>. For educational and
                research use only. Not a certified authentication service — consult qualified
                archaeologists for professional assessment.
              </p>
            </div>
            <div className="sm:text-right">
              <p className="small-caps text-muted-foreground">Index</p>
              <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-2 sm:justify-end text-sm">
                <Link to="/about" className="hover:text-primary">About</Link>
                <Link to="/references" className="hover:text-primary">References</Link>
                <Link to="/contact" className="hover:text-primary">Contact</Link>
                <Link to="/feedback" className="hover:text-primary">Feedback</Link>
                <Link to="/privacy-policy" className="hover:text-primary">Privacy</Link>
                <Link to="/terms" className="hover:text-primary">Terms</Link>
                <Link to="/attributions" className="hover:text-primary">Attributions</Link>
              </nav>
            </div>
          </div>
          <div className="editorial-rule my-8" />
          <p className="text-center text-xs text-muted-foreground">© 2026 ArchaeoLens · The Field Edition</p>
        </footer>

        <div className="pb-[max(env(safe-area-inset-bottom),0.5rem)]" />
      </div>
    </main>
  );
}

function ModePill({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button" onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
        active ? "bg-foreground text-background shadow-sm" : "text-foreground/70 hover:text-foreground"
      }`}
    >
      {icon}{label}
    </button>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <dt className="font-display text-4xl text-primary">{n}</dt>
      <dd className="text-sm leading-snug text-muted-foreground">{label}</dd>
    </div>
  );
}

function Promise({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-background p-6">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="small-caps">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{text}</p>
    </div>
  );
}
