import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, AlertTriangle, Phone, FileText, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/heritage-laws")({
  head: () => ({
    meta: [
      { title: "Heritage Laws & Reporting — ArchaeoLens" },
      { name: "description", content: "Summary of Indian heritage laws (AMASR Act, Antiquities Act) and how to report a chance find of an antiquity to ASI." },
    ],
  }),
  component: HeritageLawsPage,
});

function HeritageLawsPage() {
  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground">
      <div className="pointer-events-none fixed inset-0 field-grid opacity-25" />
      <div className="relative mx-auto max-w-3xl space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Heritage Laws &amp; Reporting</h1>
              <p className="text-sm text-muted-foreground">Indian framework for protecting archaeology &amp; antiquities</p>
            </div>
          </div>
        </header>

        <section className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-bold text-foreground">Important — Do Not Disturb Finds</h2>
          </div>
          <p className="text-sm text-muted-foreground">If you encounter what looks like an antiquity, ancient structure, or site: <strong>do not dig, lift, or remove it.</strong> Photograph in situ, note GPS, and report to ASI or your State Archaeology Department. Removing or trading antiquities without registration is a criminal offence in India.</p>
        </section>

        {/* AMASR Act */}
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> AMASR Act, 1958</h2>
          <p className="text-xs font-mono text-muted-foreground">Ancient Monuments and Archaeological Sites and Remains Act</p>
          <p className="text-sm text-muted-foreground">Provides for the preservation of ancient and historical monuments and archaeological sites of national importance. Administered by the Archaeological Survey of India (ASI).</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Centrally protected monuments:</strong> ~3,693 monuments and sites under ASI.</li>
            <li><strong className="text-foreground">Prohibited area:</strong> 100 m radius around a centrally protected monument — no construction allowed.</li>
            <li><strong className="text-foreground">Regulated area:</strong> next 200 m — construction requires NOC from National Monuments Authority (NMA).</li>
            <li><strong className="text-foreground">2010 Amendment:</strong> introduced the prohibited/regulated zoning and the NMA.</li>
            <li><strong className="text-foreground">Penalties:</strong> imprisonment up to 2 years and/or fine for damage, defacement, or unauthorised construction.</li>
          </ul>
        </article>

        {/* Antiquities Act */}
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Antiquities and Art Treasures Act, 1972</h2>
          <p className="text-sm text-muted-foreground">Regulates the export, trade, and ownership of antiquities and art treasures.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li><strong className="text-foreground">Antiquity:</strong> any coin, sculpture, painting, epigraph, or article of historical interest existing for not less than <strong>100 years</strong> (75 years for manuscripts).</li>
            <li><strong className="text-foreground">Export ban:</strong> export of antiquities is prohibited except by Government of India or its authorised agency.</li>
            <li><strong className="text-foreground">Compulsory registration:</strong> private owners must register specified antiquities with the registering officer (ASI).</li>
            <li><strong className="text-foreground">Trade licensing:</strong> trading in antiquities requires a licence under the Act.</li>
            <li><strong className="text-foreground">Penalties:</strong> imprisonment up to 3 years and/or fine for illegal export or non-registration.</li>
          </ul>
        </article>

        {/* Treasure Trove */}
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Indian Treasure Trove Act, 1878</h2>
          <p className="text-sm text-muted-foreground">Regulates accidental discovery (chance finds) of buried treasure valued above ₹10.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Finder must <strong className="text-foreground">notify the District Collector immediately</strong> with description, place, and value.</li>
            <li>Collector publishes notice; rightful claimant (or Government) takes custody.</li>
            <li>Failure to report can result in forfeiture and penalties.</li>
          </ul>
        </article>

        {/* International */}
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-foreground">UNESCO 1970 Convention</h2>
          <p className="text-sm text-muted-foreground">India is a signatory to the UNESCO Convention on the Means of Prohibiting and Preventing the Illicit Import, Export and Transfer of Ownership of Cultural Property (1970). It supports international restitution of stolen antiquities.</p>
        </article>

        {/* Reporting Steps */}
        <article className="rounded-xl border-2 border-primary/40 bg-primary/5 p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> How to Report a Chance Find</h2>
          <ol className="space-y-2 text-sm text-foreground/90">
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span><div><strong>Do not move or clean the object.</strong> Avoid further digging.</div></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span><div><strong>Photograph in situ</strong> with a scale (coin / ruler) and a north arrow if possible. Note GPS coordinates.</div></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span><div><strong>Inform local authorities</strong> — District Collector, nearest Police Station, and ASI Circle Office.</div></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">4</span><div><strong>Contact ASI</strong> at the regional Circle (24 Circles cover India) or the headquarters in Delhi.</div></li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">5</span><div><strong>Cooperate</strong> with the documentation process; the find may be recorded, registered, or excavated formally.</div></li>
          </ol>
        </article>

        {/* Contacts */}
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-foreground">Official Contacts</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="https://asi.nic.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> Archaeological Survey of India (ASI) — asi.nic.in
              </a>
            </li>
            <li>
              <a href="https://nma.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> National Monuments Authority (NMA) — nma.gov.in
              </a>
            </li>
            <li>
              <a href="https://indiaculture.gov.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> Ministry of Culture, Government of India — indiaculture.gov.in
              </a>
            </li>
            <li>
              <a href="https://asi.nic.in/circles/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="h-4 w-4" /> Find your nearest ASI Circle Office
              </a>
            </li>
          </ul>
        </article>

        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground">
          <p>This is an educational summary, not legal advice. Always consult the official Acts and qualified legal/heritage professionals for specific cases.</p>
        </footer>
      </div>
    </main>
  );
}
