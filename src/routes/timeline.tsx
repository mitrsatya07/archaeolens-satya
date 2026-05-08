import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Cultural Periods Timeline — Indian Archaeology" },
      { name: "description", content: "Interactive timeline of Indian archaeological cultures from Paleolithic to Modern era with key sites and characteristic artifacts." },
    ],
  }),
  component: TimelinePage,
});

type Period = {
  name: string;
  range: string;
  color: string;
  artifacts: string[];
  sites: string[];
  notes: string;
};

const PERIODS: Period[] = [
  { name: "Lower Paleolithic", range: "c. 2.6 Mya – 100,000 BCE", color: "bg-stone-500/15 border-stone-500/40 text-stone-800",
    artifacts: ["Acheulean handaxes", "Cleavers", "Choppers", "Flake tools"],
    sites: ["Attirampakkam (TN)", "Isampur (KA)", "Bhimbetka (MP)", "Hunsgi (KA)"],
    notes: "Hominin tool-making in the Indian subcontinent; large bifacial tools dominate." },
  { name: "Middle Paleolithic", range: "c. 100,000 – 40,000 BCE", color: "bg-stone-500/15 border-stone-500/40 text-stone-800",
    artifacts: ["Levallois flakes", "Scrapers", "Points", "Discoid cores"],
    sites: ["Nevasa (MH)", "Jwalapuram (AP)", "Bhimbetka"],
    notes: "Smaller flake-based tools; prepared-core technology." },
  { name: "Upper Paleolithic", range: "c. 40,000 – 10,000 BCE", color: "bg-stone-500/15 border-stone-500/40 text-stone-800",
    artifacts: ["Blades", "Burins", "Bone tools", "Ostrich-egg-shell beads"],
    sites: ["Patne (MH)", "Belan Valley (UP)", "Kurnool caves (AP)"],
    notes: "Blade industries and earliest evidence of personal ornaments." },
  { name: "Mesolithic", range: "c. 10,000 – 4000 BCE", color: "bg-amber-500/15 border-amber-500/40 text-amber-800",
    artifacts: ["Microliths (geometric)", "Composite tools", "Rock paintings"],
    sites: ["Bhimbetka", "Bagor (RJ)", "Sarai Nahar Rai (UP)", "Damdama (UP)"],
    notes: "Hunter-gatherer-fishers; rich rock art tradition; early plant management." },
  { name: "Neolithic", range: "c. 7000 – 2500 BCE", color: "bg-amber-500/15 border-amber-500/40 text-amber-800",
    artifacts: ["Polished stone axes", "Handmade pottery", "Querns", "Bone tools"],
    sites: ["Mehrgarh (Balochistan)", "Burzahom (J&K)", "Chirand (Bihar)", "Koldihwa (UP)"],
    notes: "Beginning of farming, domestication, sedentary villages, pottery." },
  { name: "Chalcolithic", range: "c. 3500 – 1000 BCE", color: "bg-orange-500/15 border-orange-500/40 text-orange-800",
    artifacts: ["Black-and-Red Ware (BRW)", "Copper tools", "Painted pottery", "Terracotta figurines"],
    sites: ["Ahar-Banas (RJ)", "Kayatha (MP)", "Malwa", "Jorwe (MH)", "Inamgaon (MH)"],
    notes: "Copper-stone using farming cultures; regional ceramic traditions." },
  { name: "Harappan / Indus Valley", range: "c. 3300 – 1300 BCE", color: "bg-orange-500/15 border-orange-500/40 text-orange-800",
    artifacts: ["Standardized bricks", "Steatite seals", "Indus script", "Beads (carnelian, faience)", "Bronze figurines"],
    sites: ["Harappa", "Mohenjo-daro", "Dholavira", "Lothal", "Rakhigarhi", "Kalibangan"],
    notes: "Bronze Age urban civilization; planned cities, drainage, undeciphered script." },
  { name: "Vedic / Iron Age", range: "c. 1500 – 600 BCE", color: "bg-yellow-500/15 border-yellow-500/40 text-yellow-800",
    artifacts: ["Painted Grey Ware (PGW)", "Iron tools", "Copper hoards", "OCP (Ochre Coloured Pottery)"],
    sites: ["Hastinapura (UP)", "Atranjikhera (UP)", "Ahichhatra (UP)", "Bhagwanpura (HR)"],
    notes: "Iron-using agricultural societies in Ganga valley; PGW culture." },
  { name: "Megalithic (South India)", range: "c. 1500 – 200 BCE", color: "bg-yellow-500/15 border-yellow-500/40 text-yellow-800",
    artifacts: ["Black-and-Red Ware", "Iron weapons", "Russet-Coated Painted Ware", "Megaliths (cists, dolmens, urns)"],
    sites: ["Adichanallur (TN)", "Brahmagiri (KA)", "Maski (KA)", "Hallur (KA)"],
    notes: "Iron Age burial monuments and grave goods across peninsular India." },
  { name: "Mauryan", range: "c. 322 – 185 BCE", color: "bg-red-500/15 border-red-500/40 text-red-800",
    artifacts: ["Northern Black Polished Ware (NBPW)", "Punch-marked coins", "Ashokan pillars & edicts (Brahmi)", "Polished stone sculpture"],
    sites: ["Pataliputra (Kumrahar)", "Sanchi", "Sarnath", "Lauriya Nandangarh"],
    notes: "First pan-Indian empire; monumental stone architecture and Brahmi inscriptions." },
  { name: "Sunga–Satavahana", range: "c. 185 BCE – 250 CE", color: "bg-red-500/15 border-red-500/40 text-red-800",
    artifacts: ["Bharhut railings", "Stupa toranas", "Terracotta plaques", "Cast coins"],
    sites: ["Bharhut (MP)", "Sanchi (II)", "Amaravati (AP)", "Nasik caves (MH)"],
    notes: "Post-Mauryan regional powers; flourishing Buddhist art and rock-cut caves." },
  { name: "Kushan / Indo-Roman", range: "c. 1st – 3rd century CE", color: "bg-red-500/15 border-red-500/40 text-red-800",
    artifacts: ["Gandhara sculpture", "Mathura red sandstone images", "Roman amphorae", "Rouletted Ware"],
    sites: ["Taxila", "Sanghol (PB)", "Mathura", "Arikamedu (PY)"],
    notes: "Indo-Greek and Roman trade contact; Gandhara and Mathura schools of art." },
  { name: "Gupta", range: "c. 320 – 550 CE", color: "bg-purple-500/15 border-purple-500/40 text-purple-800",
    artifacts: ["Gupta gold coins", "Iron Pillar (Delhi)", "Sarnath Buddha images", "Early temple architecture"],
    sites: ["Sarnath", "Udayagiri caves (MP)", "Nalanda (early)", "Deogarh (UP)"],
    notes: "Classical age of Indian art; early structural temples and free-standing sculpture." },
  { name: "Early Medieval", range: "c. 600 – 1200 CE", color: "bg-purple-500/15 border-purple-500/40 text-purple-800",
    artifacts: ["Pala bronzes", "Chola bronzes", "Stone temples (Nagara/Dravida/Vesara)", "Inscriptions in regional scripts"],
    sites: ["Khajuraho", "Konark", "Thanjavur", "Pattadakal", "Mahabalipuram", "Nalanda", "Vikramshila"],
    notes: "Regional kingdoms — Cholas, Chalukyas, Pallavas, Palas, Pratiharas; mature temple architecture." },
  { name: "Sultanate", range: "c. 1206 – 1526 CE", color: "bg-blue-500/15 border-blue-500/40 text-blue-800",
    artifacts: ["Glazed tiles", "Indo-Islamic architecture", "Coins of Sultans", "Persian inscriptions"],
    sites: ["Qutb Complex (Delhi)", "Tughlaqabad", "Champaner", "Mandu (MP)", "Bidar (KA)"],
    notes: "Indo-Islamic synthesis in architecture; arches, domes, calligraphy." },
  { name: "Vijayanagara", range: "c. 1336 – 1646 CE", color: "bg-blue-500/15 border-blue-500/40 text-blue-800",
    artifacts: ["Stone chariots", "Temple gopurams", "Pagoda gold coins", "Mandapa pillars"],
    sites: ["Hampi", "Lepakshi (AP)", "Anegundi (KA)"],
    notes: "South Indian empire; massive temple complexes and bazaars." },
  { name: "Mughal", range: "c. 1526 – 1857 CE", color: "bg-blue-500/15 border-blue-500/40 text-blue-800",
    artifacts: ["Marble inlay (pietra dura)", "Charbagh gardens", "Mughal coins", "Miniature paintings"],
    sites: ["Taj Mahal", "Humayun's Tomb", "Red Fort", "Fatehpur Sikri", "Agra Fort"],
    notes: "Imperial Mughal architecture; tombs, mosques, fortified cities." },
  { name: "Colonial / Modern", range: "c. 1757 – present", color: "bg-slate-500/15 border-slate-500/40 text-slate-800",
    artifacts: ["European-style architecture", "Industrial-era artefacts", "Photographic records"],
    sites: ["Victoria Memorial (KOL)", "Gateway of India (MUM)", "ASI excavated sites"],
    notes: "Birth of archaeology as a discipline in India (ASI founded 1861 by Cunningham)." },
];

function TimelinePage() {
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
              <Clock className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Cultural Periods Timeline</h1>
              <p className="text-sm text-muted-foreground">Indian archaeology from Paleolithic to Modern</p>
            </div>
          </div>
        </header>

        <div className="relative pl-6 border-l-2 border-primary/30 space-y-5">
          {PERIODS.map((p) => (
            <article key={p.name} className={`relative rounded-xl border p-4 shadow-sm ${p.color}`}>
              <span className="absolute -left-[31px] top-5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-xs font-mono opacity-70">{p.range}</p>
              <p className="mt-2 text-sm leading-relaxed">{p.notes}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
                <div>
                  <p className="font-semibold mb-1">Characteristic artifacts</p>
                  <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                    {p.artifacts.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">Key sites</p>
                  <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                    {p.sites.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground">
          <p>Date ranges are approximate and reflect mainstream archaeological consensus. Regional variations apply.</p>
        </footer>
      </div>
    </main>
  );
}
