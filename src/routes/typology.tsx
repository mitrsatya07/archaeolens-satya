import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BookOpen, Pickaxe, ScrollText } from "lucide-react";

export const Route = createFileRoute("/typology")({
  head: () => ({
    meta: [
      { title: "Pottery & Inscription Typology — ArchaeoLens" },
      { name: "description", content: "Reference guide for Indian ceramic wares (NBPW, PGW, BRW, OCP) and ancient scripts (Brahmi, Kharosthi, Indus, Tamil-Brahmi)." },
    ],
  }),
  component: TypologyPage,
});

type Entry = {
  name: string;
  abbr?: string;
  period: string;
  region: string;
  features: string[];
  diagnostic: string;
  notes?: string;
};

const POTTERY: Entry[] = [
  { name: "Ochre Coloured Pottery", abbr: "OCP", period: "c. 2000–1500 BCE", region: "Upper Ganga–Yamuna doab",
    features: ["Wheel-made", "Reddish-orange slip", "Worn / friable surface (ochre rubs off)", "Bowls, basins, jars"],
    diagnostic: "Ochre-coloured rub-off on hands; often water-worn." },
  { name: "Black-and-Red Ware", abbr: "BRW", period: "c. 2000 BCE – 600 BCE", region: "Pan-Indian (Chalcolithic & Megalithic)",
    features: ["Black interior + upper exterior, red lower exterior", "Inverted-firing technique", "Bowls and dishes dominant"],
    diagnostic: "Distinctive bichrome surface from inverted firing in same vessel." },
  { name: "Painted Grey Ware", abbr: "PGW", period: "c. 1200 – 600 BCE", region: "Ganga–Yamuna doab; Punjab–Haryana",
    features: ["Fine grey fabric", "Wheel-made", "Black geometric paintings (dots, lines, swastikas)", "Thali-like dishes & bowls"],
    diagnostic: "Smooth grey surface with simple black painted designs; associated with Iron Age Vedic culture." },
  { name: "Northern Black Polished Ware", abbr: "NBPW", period: "c. 700 – 200 BCE", region: "North India; traded widely",
    features: ["Lustrous black/silvery surface", "Very fine fabric", "Mirror-like polish", "Bowls and dishes"],
    diagnostic: "Distinctive metallic shine — luxury ware of early historic urban centres; marker of 2nd urbanisation." },
  { name: "Rouletted Ware", abbr: "RW", period: "c. 2nd BCE – 2nd CE", region: "Coastal & Indo-Roman trade ports",
    features: ["Fine grey/black fabric", "Rouletted (impressed) patterns on base interior", "Shallow dishes"],
    diagnostic: "Concentric bands of small impressed dots on inside of base — Mediterranean trade marker." },
  { name: "Russet-Coated Painted Ware", abbr: "RCPW", period: "c. 200 BCE – 300 CE", region: "Megalithic South India",
    features: ["Red slip with russet-painted bands", "Wavy / linear motifs", "Associated with megalithic burials"],
    diagnostic: "Russet (rust-coloured) painted lines on red-slipped surface." },
  { name: "Red Polished Ware", abbr: "RPW", period: "c. 1st – 5th century CE", region: "Western India, Gujarat, Sindh",
    features: ["Bright red slip", "High polish", "Sprinklers, basins, jars"],
    diagnostic: "High-gloss red surface; spouted sprinkler vessels are typical." },
  { name: "Glazed Ware (Sultanate)", period: "c. 13th – 16th century CE", region: "North & Central India",
    features: ["Tin/lead glaze", "Blue and green decoration", "Indo-Islamic context"],
    diagnostic: "Vitreous glazed surface — first true glazed ceramics in India." },
];

const SCRIPTS: Entry[] = [
  { name: "Indus Script", period: "c. 2600 – 1900 BCE", region: "Indus / Harappan civilization",
    features: ["~400 distinct signs", "Found on seals, sealings, pottery, copper tablets", "Short inscriptions (avg ~5 signs)", "Right-to-left dominant"],
    diagnostic: "Pictographic + abstract signs on steatite seals; UNDECIPHERED to date." },
  { name: "Brahmi", period: "c. 3rd century BCE onwards", region: "Pan-Indian (Mauryan)",
    features: ["Left-to-right", "Ashokan rock & pillar edicts", "Parent of most Indic scripts"],
    diagnostic: "Angular geometric letters; basis for Devanagari, Tamil, Sinhala, Tibetan etc.",
    notes: "Deciphered by James Prinsep in 1837." },
  { name: "Kharosthi", period: "c. 4th BCE – 3rd CE", region: "Gandhara (NW subcontinent)",
    features: ["Right-to-left (Aramaic-derived)", "Cursive", "Used on coins of Indo-Greeks, Sakas, Kushans"],
    diagnostic: "Flowing right-to-left script; co-existed with Brahmi in Gandhara region." },
  { name: "Tamil-Brahmi", period: "c. 3rd BCE – 4th CE", region: "Tamil Nadu, Kerala, Sri Lanka",
    features: ["Adapted Brahmi for Tamil phonemes", "Cave inscriptions, potsherds (Keeladi, Adichanallur)"],
    diagnostic: "Brahmi with additional letters for Tamil sounds (ḻ, ṟ, ṉ); evidence of early Tamil literacy." },
  { name: "Gupta Brahmi", period: "c. 4th – 6th century CE", region: "Gupta empire",
    features: ["Refined, ornamental Brahmi", "Iron Pillar inscription (Delhi)", "Allahabad Pillar of Samudragupta"],
    diagnostic: "Elegant flowing letterforms; transitional to early Nagari." },
  { name: "Shankha (Shell) Script", period: "c. 4th – 8th century CE", region: "North India",
    features: ["Ornamental conch-shell-like letters", "Found on temple walls, copper plates"],
    diagnostic: "Decorative undeciphered ornamental script of unknown function." },
  { name: "Grantha", period: "c. 6th century CE onwards", region: "Tamil Nadu",
    features: ["Used to write Sanskrit in Tamil region", "Pallava-period inscriptions"],
    diagnostic: "Curvy southern script — ancestor of Malayalam and modern Grantha." },
  { name: "Sharada", period: "c. 8th century CE onwards", region: "Kashmir, NW India",
    features: ["Northern Brahmi descendant", "Used for Sanskrit & Kashmiri"],
    diagnostic: "Angular northwestern script; Kashmiri Pandit manuscript tradition." },
  { name: "Persian / Nastaliq", period: "c. 13th century CE onwards", region: "Sultanate & Mughal India",
    features: ["Right-to-left Arabic-Persian script", "Cursive Nastaliq style", "Coins, monumental inscriptions"],
    diagnostic: "Flowing Persian calligraphy on Indo-Islamic monuments and coins." },
];

function TypologyPage() {
  const [tab, setTab] = useState<"pottery" | "scripts">("pottery");
  const data = tab === "pottery" ? POTTERY : SCRIPTS;

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
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Typology Reference</h1>
              <p className="text-sm text-muted-foreground">Diagnostic features of Indian ceramic wares & ancient scripts</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1 shadow-sm">
          <button onClick={() => setTab("pottery")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === "pottery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
            <Pickaxe className="h-4 w-4" /> Pottery / Ceramic Wares
          </button>
          <button onClick={() => setTab("scripts")} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === "scripts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
            <ScrollText className="h-4 w-4" /> Scripts / Inscriptions
          </button>
        </div>

        <section className="space-y-3">
          {data.map((e) => (
            <article key={e.name} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <h3 className="font-bold text-foreground">
                  {e.name} {e.abbr && <span className="text-xs font-mono text-primary">({e.abbr})</span>}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">{e.period}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{e.region}</p>
              <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-2.5">
                <p className="text-xs"><strong className="text-primary">Diagnostic:</strong> {e.diagnostic}</p>
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-0.5 text-xs text-muted-foreground">
                {e.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              {e.notes && <p className="mt-2 text-xs italic text-muted-foreground">{e.notes}</p>}
            </article>
          ))}
        </section>

        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground">
          <p>Reference summary for educational use. Always cross-check with published typological reports (IAR, Man and Environment, Puratattva).</p>
        </footer>
      </div>
    </main>
  );
}
