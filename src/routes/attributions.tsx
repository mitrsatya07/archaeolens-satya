import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, ExternalLink, BookOpen, Landmark, Pickaxe, Globe, Mail, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/attributions")({
  head: () => ({
    meta: [
      { title: "Attributions & Credits — ArchaeoLens" },
      {
        name: "description",
        content:
          "Full attributions, data sources, licenses, and fair-use disclaimers for content referenced in ArchaeoLens.",
      },
    ],
  }),
  component: AttributionsPage,
});

function AttributionsPage() {
  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground">
      <div className="pointer-events-none fixed inset-0 field-grid opacity-25" />
      <div className="relative mx-auto max-w-3xl animate-fade-in space-y-8">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Attributions &amp; Credits</h1>
              <p className="text-sm text-muted-foreground">Full disclosure of every reference source used by ArchaeoLens</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Last updated: May 8, 2026</p>
        </header>

        {/* Fair Use Notice */}
        <section className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-bold text-foreground">Fair Use &amp; Educational Purpose Notice</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ArchaeoLens is a <strong>non-commercial, educational, and research-oriented</strong> application. All third-party
            information (museum directories, archaeological references, stone tool descriptions, 3D model embeds, and
            publicly available data) is reproduced under principles of <strong>fair use, fair dealing</strong> (Section 52 of
            the Indian Copyright Act, 1957), and <strong>educational citation</strong>. We do <strong>not</strong> claim
            ownership of any source material listed below. All rights and credits remain with the respective original
            owners, institutions, and authors.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We do not redistribute, resell, or rehost copyrighted media. External 3D models are loaded directly from the
            original publisher's servers via official embed mechanisms. If any rights holder believes their work has been
            misrepresented or wishes content to be removed, please contact us — we will respond promptly (see Takedown
            Policy below).
          </p>
        </section>

        {/* Primary Data Sources */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Primary Data Sources
          </h2>

          <SourceCard
            icon={<Landmark className="h-5 w-5 text-primary" />}
            title="Archaeological Survey of India (ASI)"
            url="https://asi.nic.in"
            usage="Museum directory listings, site information, and verification of the 52 ASI site museums."
            license="Government of India Open Data License (GODL) — public domain for non-commercial educational use under the National Data Sharing and Accessibility Policy (NDSAP)."
            owner="Ministry of Culture, Government of India"
          />

          <SourceCard
            icon={<Globe className="h-5 w-5 text-primary" />}
            title="Press Information Bureau (PIB)"
            url="https://pib.gov.in"
            usage="Verification of museum lists, government announcements about heritage and archaeology."
            license="Government of India press releases — freely reproducible with attribution."
            owner="Press Information Bureau, Government of India"
          />

          <SourceCard
            icon={<Pickaxe className="h-5 w-5 text-primary" />}
            title="Museum of Stone Tools (MoST)"
            url="https://stonetoolsmuseum.com"
            usage="Reference data and descriptions for the 69+ prehistoric stone tools shown in the 3D Stone Tools gallery. We do NOT redistribute MoST's images or 3D models — we link/embed directly to their hosted content."
            license="Used under fair use for educational reference. All copyrights and intellectual property of stone tool descriptions, images, and 3D scans remain with the Museum of Stone Tools and its contributors."
            owner="Museum of Stone Tools, IIT Kanpur (Prof. Parth R. Chauhan and team)"
          />

          <SourceCard
            icon={<Globe className="h-5 w-5 text-primary" />}
            title="Pedestal3D"
            url="https://pedestal3d.com"
            usage="Interactive 3D model viewer embeds. Models are streamed from Pedestal3D's servers via official iframe embeds; ArchaeoLens does not host or download any 3D model files."
            license="Embedded under Pedestal3D's standard public sharing terms. All 3D model copyrights belong to the original uploaders (museums and institutions)."
            owner="Pedestal3D and respective model creators"
          />

          <SourceCard
            icon={<Landmark className="h-5 w-5 text-primary" />}
            title="State Department of Archaeology &amp; Museums (various Indian states)"
            url="https://asi.nic.in/state-archaeology-departments/"
            usage="State-wise museum directory entries and addresses."
            license="Public information published by respective State Government departments."
            owner="State Governments of India"
          />

          <SourceCard
            icon={<Globe className="h-5 w-5 text-primary" />}
            title="International Museums (British Museum, Met, Louvre, etc.)"
            url="https://www.britishmuseum.org"
            usage="Listings of museums holding significant Indian/South Asian collections, with links to their official collection pages."
            license="Only public-facing institution names, addresses, and official URLs are referenced. No copyrighted images or descriptions are reproduced."
            owner="Respective museum institutions"
          />
        </section>

        {/* Technology & Open Source */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Technology &amp; Open Source
          </h2>
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">AI Analysis:</strong> Powered by Lovable AI Gateway using Google Gemini and OpenAI GPT models. Image processing is performed in real-time and not retained.</p>
            <p><strong className="text-foreground">Icons:</strong> <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-primary underline">Lucide Icons</a> (ISC License)</p>
            <p><strong className="text-foreground">UI Components:</strong> <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">shadcn/ui</a> (MIT License), <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">Tailwind CSS</a> (MIT License)</p>
            <p><strong className="text-foreground">Framework:</strong> React, TanStack Start, Vite — all under MIT License</p>
            <p><strong className="text-foreground">Backend:</strong> Lovable Cloud (managed Supabase infrastructure)</p>
          </div>
        </section>

        {/* What we do NOT claim */}
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-2">What ArchaeoLens Does NOT Claim</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
            <li>We do <strong>not</strong> claim ownership of any museum's collection data, photographs, or descriptions.</li>
            <li>We do <strong>not</strong> claim ownership of any 3D model shown in the Stone Tools gallery — these are embedded from their original hosts.</li>
            <li>We do <strong>not</strong> claim that AI observations are authoritative authentication, dating, or appraisal.</li>
            <li>We do <strong>not</strong> claim affiliation, endorsement, or partnership with ASI, MoST, Pedestal3D, or any museum unless explicitly stated.</li>
            <li>We do <strong>not</strong> resell, sublicense, or commercially exploit referenced content.</li>
          </ul>
        </section>

        {/* Takedown Policy */}
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" /> Takedown &amp; Correction Policy (DMCA / Indian Copyright Act)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If you are a rights holder and believe any content in ArchaeoLens infringes your copyright, misrepresents
            your institution, or should be corrected/removed, please email us with: (1) a description of the work,
            (2) the specific location in the app, (3) proof of ownership, and (4) your contact details.
          </p>
          <p className="mt-2 text-sm">
            Contact: <a href="mailto:support@archaeolens.app" className="text-primary underline">support@archaeolens.app</a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            We commit to reviewing every request within <strong>7 business days</strong> and removing or correcting
            content promptly where the claim is valid.
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground space-y-1">
          <p>© 2026 ArchaeoLens. Educational use only. All third-party trademarks and copyrights are the property of their respective owners.</p>
        </footer>
      </div>
    </main>
  );
}

function SourceCard({
  icon,
  title,
  url,
  usage,
  license,
  owner,
}: {
  icon: React.ReactNode;
  title: string;
  url: string;
  usage: string;
  license: string;
  owner: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          Visit <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p><strong className="text-foreground">Owner:</strong> {owner}</p>
        <p><strong className="text-foreground">Usage in ArchaeoLens:</strong> {usage}</p>
        <p><strong className="text-foreground">License / Basis:</strong> {license}</p>
      </div>
    </div>
  );
}
