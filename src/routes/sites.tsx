import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, Search, Landmark, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/sites")({
  head: () => ({
    meta: [
      { title: "Archaeological Sites of India — ArchaeoLens" },
      { name: "description", content: "Directory of major ASI-protected archaeological sites in India with state, period, and cultural context filters." },
    ],
  }),
  component: SitesPage,
});

type Site = {
  name: string;
  state: string;
  period: string;
  culture: string;
  type: string;
  unesco?: boolean;
  summary: string;
  url: string;
};

const SITES: Site[] = [
  { name: "Harappa", state: "Punjab (Pakistan)", period: "c. 2600–1900 BCE", culture: "Harappan", type: "Urban settlement", summary: "Type-site of the Indus Valley Civilization; planned streets, drainage, granaries.", url: "https://asi.nic.in/harappa-civilization/" },
  { name: "Mohenjo-daro", state: "Sindh (Pakistan)", period: "c. 2500–1900 BCE", culture: "Harappan", type: "Urban settlement", unesco: true, summary: "Great Bath, citadel, standardized bricks; UNESCO World Heritage.", url: "https://whc.unesco.org/en/list/138/" },
  { name: "Dholavira", state: "Gujarat", period: "c. 3000–1500 BCE", culture: "Harappan", type: "Urban settlement", unesco: true, summary: "Three-part walled city with stone architecture and water reservoirs; UNESCO 2021.", url: "https://whc.unesco.org/en/list/1645/" },
  { name: "Lothal", state: "Gujarat", period: "c. 2400–1900 BCE", culture: "Harappan", type: "Port / dockyard", summary: "World's earliest known dockyard; bead workshop and warehouse.", url: "https://asi.nic.in/lothal/" },
  { name: "Rakhigarhi", state: "Haryana", period: "c. 2600–1900 BCE", culture: "Harappan", type: "Urban settlement", summary: "Largest Harappan site in India; recent aDNA studies of skeletal remains.", url: "https://asi.nic.in/" },
  { name: "Kalibangan", state: "Rajasthan", period: "c. 3500–1750 BCE", culture: "Pre-Harappan / Harappan", type: "Settlement", summary: "Earliest evidence of ploughed field; fire altars.", url: "https://asi.nic.in/kalibangan/" },
  { name: "Mehrgarh", state: "Balochistan (Pakistan)", period: "c. 7000–2500 BCE", culture: "Neolithic", type: "Early farming village", summary: "One of the earliest Neolithic sites in South Asia.", url: "https://en.unesco.org/" },
  { name: "Bhimbetka Rock Shelters", state: "Madhya Pradesh", period: "c. 30,000 BCE – Medieval", culture: "Paleolithic–Mesolithic", type: "Rock shelters / rock art", unesco: true, summary: "Prehistoric rock paintings spanning multiple periods; UNESCO World Heritage.", url: "https://whc.unesco.org/en/list/925/" },
  { name: "Sanchi Stupa", state: "Madhya Pradesh", period: "c. 3rd century BCE – 12th CE", culture: "Buddhist (Mauryan onwards)", type: "Stupa complex", unesco: true, summary: "Great Stupa of Sanchi commissioned by Ashoka; carved toranas.", url: "https://whc.unesco.org/en/list/524/" },
  { name: "Sarnath", state: "Uttar Pradesh", period: "c. 3rd century BCE onwards", culture: "Buddhist", type: "Monastic site", summary: "Site of Buddha's first sermon; Ashoka's Lion Capital found here.", url: "https://asi.nic.in/sarnath/" },
  { name: "Nalanda Mahavihara", state: "Bihar", period: "c. 5th–12th century CE", culture: "Buddhist (Gupta–Pala)", type: "Monastic university", unesco: true, summary: "Ancient monastic university; UNESCO World Heritage.", url: "https://whc.unesco.org/en/list/1502/" },
  { name: "Vikramshila", state: "Bihar", period: "c. 8th–12th century CE", culture: "Buddhist (Pala)", type: "Monastic university", summary: "Major Pala-period Buddhist university; cruciform stupa.", url: "https://asi.nic.in/" },
  { name: "Bodh Gaya — Mahabodhi Temple", state: "Bihar", period: "c. 3rd century BCE – present", culture: "Buddhist", type: "Temple", unesco: true, summary: "Site of Buddha's enlightenment; Mahabodhi Temple complex.", url: "https://whc.unesco.org/en/list/1056/" },
  { name: "Ajanta Caves", state: "Maharashtra", period: "c. 2nd century BCE – 6th CE", culture: "Buddhist", type: "Rock-cut caves", unesco: true, summary: "30 rock-cut caves with painted murals and sculpture.", url: "https://whc.unesco.org/en/list/242/" },
  { name: "Ellora Caves", state: "Maharashtra", period: "c. 6th–10th century CE", culture: "Buddhist, Hindu, Jain", type: "Rock-cut caves", unesco: true, summary: "34 caves including the monolithic Kailasa Temple.", url: "https://whc.unesco.org/en/list/243/" },
  { name: "Elephanta Caves", state: "Maharashtra", period: "c. 5th–8th century CE", culture: "Hindu (Shaiva)", type: "Rock-cut caves", unesco: true, summary: "Cave temples to Shiva; famous Trimurti sculpture.", url: "https://whc.unesco.org/en/list/244/" },
  { name: "Hampi (Vijayanagara)", state: "Karnataka", period: "c. 14th–16th century CE", culture: "Vijayanagara Empire", type: "Royal city", unesco: true, summary: "Ruins of the Vijayanagara capital; temples, bazaars, palaces.", url: "https://whc.unesco.org/en/list/241/" },
  { name: "Pattadakal", state: "Karnataka", period: "c. 7th–8th century CE", culture: "Chalukya", type: "Temple complex", unesco: true, summary: "Group of Hindu and Jain temples; Dravida and Nagara styles.", url: "https://whc.unesco.org/en/list/239/" },
  { name: "Badami Cave Temples", state: "Karnataka", period: "c. 6th century CE", culture: "Chalukya", type: "Rock-cut caves", summary: "Early Chalukyan rock-cut temples to Vishnu, Shiva, and Jain tirthankaras.", url: "https://asi.nic.in/" },
  { name: "Mahabalipuram", state: "Tamil Nadu", period: "c. 7th–8th century CE", culture: "Pallava", type: "Monuments / shore temple", unesco: true, summary: "Shore Temple, rathas, and Descent of the Ganges relief.", url: "https://whc.unesco.org/en/list/249/" },
  { name: "Brihadeeswarar Temple, Thanjavur", state: "Tamil Nadu", period: "c. 11th century CE", culture: "Chola", type: "Temple", unesco: true, summary: "Great Living Chola Temple commissioned by Rajaraja I.", url: "https://whc.unesco.org/en/list/250/" },
  { name: "Konark Sun Temple", state: "Odisha", period: "c. 13th century CE", culture: "Eastern Ganga", type: "Temple", unesco: true, summary: "Sun Temple in chariot form; intricate stone carvings.", url: "https://whc.unesco.org/en/list/246/" },
  { name: "Khajuraho Group of Monuments", state: "Madhya Pradesh", period: "c. 10th–12th century CE", culture: "Chandela", type: "Temple complex", unesco: true, summary: "Hindu and Jain temples famous for sculpture.", url: "https://whc.unesco.org/en/list/240/" },
  { name: "Qutb Complex (Delhi)", state: "Delhi", period: "c. 12th–13th century CE", culture: "Delhi Sultanate", type: "Monument complex", unesco: true, summary: "Qutb Minar, Quwwat-ul-Islam Mosque, Iron Pillar.", url: "https://whc.unesco.org/en/list/233/" },
  { name: "Humayun's Tomb (Delhi)", state: "Delhi", period: "c. 1565–72 CE", culture: "Mughal", type: "Tomb", unesco: true, summary: "First garden-tomb in the Indian subcontinent; precursor to Taj Mahal.", url: "https://whc.unesco.org/en/list/232/" },
  { name: "Red Fort (Delhi)", state: "Delhi", period: "c. 17th century CE", culture: "Mughal (Shah Jahan)", type: "Fort", unesco: true, summary: "Lal Qila — main residence of Mughal emperors for ~200 years.", url: "https://whc.unesco.org/en/list/231/" },
  { name: "Fatehpur Sikri", state: "Uttar Pradesh", period: "c. 16th century CE", culture: "Mughal (Akbar)", type: "Royal city", unesco: true, summary: "Mughal capital under Akbar; Buland Darwaza, Jama Masjid.", url: "https://whc.unesco.org/en/list/255/" },
  { name: "Taj Mahal", state: "Uttar Pradesh", period: "c. 1632–53 CE", culture: "Mughal (Shah Jahan)", type: "Mausoleum", unesco: true, summary: "Marble mausoleum for Mumtaz Mahal; Mughal architectural masterpiece.", url: "https://whc.unesco.org/en/list/252/" },
  { name: "Agra Fort", state: "Uttar Pradesh", period: "c. 16th century CE", culture: "Mughal", type: "Fort", unesco: true, summary: "Walled Mughal city / fort built by Akbar.", url: "https://whc.unesco.org/en/list/251/" },
  { name: "Hampi — Vitthala Temple", state: "Karnataka", period: "c. 15th–16th century CE", culture: "Vijayanagara", type: "Temple", summary: "Famous stone chariot and musical pillars.", url: "https://asi.nic.in/" },
  { name: "Champaner-Pavagadh", state: "Gujarat", period: "c. 8th–16th century CE", culture: "Pre-Mughal Sultanate", type: "Archaeological park", unesco: true, summary: "Only complete and unchanged pre-Mughal Islamic city.", url: "https://whc.unesco.org/en/list/1101/" },
  { name: "Chandraketugarh", state: "West Bengal", period: "c. 4th BCE – 12th CE", culture: "Maurya–Sunga–Pala", type: "Settlement", summary: "Famous for terracotta figurines and seals.", url: "https://asi.nic.in/" },
  { name: "Sisupalgarh", state: "Odisha", period: "c. 5th BCE – 4th CE", culture: "Early Historic", type: "Fortified city", summary: "Massive fortified urban center near Bhubaneswar.", url: "https://asi.nic.in/" },
  { name: "Hastinapura", state: "Uttar Pradesh", period: "c. 1100 BCE – Medieval", culture: "PGW / Mahabharata tradition", type: "Settlement mound", summary: "Excavated mounds; Painted Grey Ware horizon.", url: "https://asi.nic.in/" },
  { name: "Atranjikhera", state: "Uttar Pradesh", period: "c. 2000 BCE – 300 BCE", culture: "OCP–PGW–NBPW sequence", type: "Multi-period mound", summary: "Important type-site for Ganga valley ceramic sequence.", url: "https://asi.nic.in/" },
  { name: "Daimabad", state: "Maharashtra", period: "c. 2200–700 BCE", culture: "Late Harappan / Jorwe", type: "Settlement", summary: "Bronze chariot and figurines; southernmost Harappan site.", url: "https://asi.nic.in/" },
  { name: "Inamgaon", state: "Maharashtra", period: "c. 1600–700 BCE", culture: "Chalcolithic (Jorwe)", type: "Settlement", summary: "Well-studied Chalcolithic farming village.", url: "https://asi.nic.in/" },
  { name: "Adichanallur", state: "Tamil Nadu", period: "c. 1000–600 BCE", culture: "Iron Age / Megalithic", type: "Urn-burial site", summary: "Iron Age urn burials with grave goods; Tamil-Brahmi finds.", url: "https://asi.nic.in/" },
  { name: "Keeladi", state: "Tamil Nadu", period: "c. 6th century BCE onwards", culture: "Sangam Age", type: "Urban settlement", summary: "Ongoing excavation; literacy and urbanism in early Tamil culture.", url: "https://asi.nic.in/" },
  { name: "Arikamedu", state: "Puducherry", period: "c. 2nd BCE – 8th CE", culture: "Indo-Roman trade", type: "Port", summary: "Roman amphorae and rouletted ware; Indo-Roman trade evidence.", url: "https://asi.nic.in/" },
  { name: "Sanghol", state: "Punjab", period: "c. 2nd BCE – 6th CE", culture: "Kushan", type: "Settlement / stupa", summary: "Kushan-period stupa railings with Mathura-style sculpture.", url: "https://asi.nic.in/" },
  { name: "Taxila", state: "Punjab (Pakistan)", period: "c. 6th BCE – 5th CE", culture: "Gandhara", type: "Urban / monastic", unesco: true, summary: "Ancient Gandharan city — Bhir, Sirkap, Sirsukh; major learning center.", url: "https://whc.unesco.org/en/list/139/" },
];

const STATES = ["All", ...Array.from(new Set(SITES.map((s) => s.state))).sort()];
const PERIODS = ["All", "Prehistoric", "Harappan / Bronze Age", "Iron Age / Megalithic", "Early Historic", "Medieval", "Mughal / Sultanate"];

function matchPeriod(site: Site, bucket: string) {
  if (bucket === "All") return true;
  const p = site.period.toLowerCase();
  const c = site.culture.toLowerCase();
  if (bucket === "Prehistoric") return /paleolithic|mesolithic|neolithic|30,000|7000/.test(p) || /paleolithic|mesolithic|neolithic/.test(c);
  if (bucket === "Harappan / Bronze Age") return /harappan|chalcolithic|bce.*1[5-9]00|2[0-9]{3}|3[0-9]{3}/.test(p) || /harappan|chalcolithic|jorwe/.test(c);
  if (bucket === "Iron Age / Megalithic") return /iron age|megalithic|pgw|painted grey/.test(c.toLowerCase()) || /iron age|megalithic/.test(p);
  if (bucket === "Early Historic") return /maurya|sunga|kushan|gupta|sangam|gandhara|buddhist|early historic/.test(c.toLowerCase());
  if (bucket === "Medieval") return /chola|chalukya|pallava|chandela|pala|vijayanagara|ganga|hindu|jain/.test(c.toLowerCase()) && !/mughal|sultanate/.test(c.toLowerCase());
  if (bucket === "Mughal / Sultanate") return /mughal|sultanate/.test(c.toLowerCase());
  return true;
}

function SitesPage() {
  const [q, setQ] = useState("");
  const [state, setState] = useState("All");
  const [period, setPeriod] = useState("All");
  const [unescoOnly, setUnescoOnly] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return SITES.filter((s) => {
      if (state !== "All" && s.state !== state) return false;
      if (!matchPeriod(s, period)) return false;
      if (unescoOnly && !s.unesco) return false;
      if (term && !`${s.name} ${s.state} ${s.culture} ${s.period} ${s.type} ${s.summary}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [q, state, period, unescoOnly]);

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
              <Landmark className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Archaeological Sites</h1>
              <p className="text-sm text-muted-foreground">Major ASI-protected and UNESCO sites across South Asia</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of {SITES.length} sites</p>
        </header>

        {/* Filters */}
        <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name, culture, period, type…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select value={state} onChange={(e) => setState(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={unescoOnly} onChange={(e) => setUnescoOnly(e.target.checked)} />
            UNESCO World Heritage only
          </label>
        </section>

        {/* List */}
        <section className="space-y-3">
          {filtered.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-border bg-card p-4 shadow-sm hover:bg-accent transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground flex items-center gap-2 flex-wrap">
                    {s.name}
                    {s.unesco && <span className="rounded-full bg-amber-500/15 text-amber-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">UNESCO</span>}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{s.state}</p>
                  <p className="mt-2 text-sm text-foreground/90">{s.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{s.period}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{s.culture}</span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 font-medium">{s.type}</span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No sites match your filters.</p>
          )}
        </section>

        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground">
          <p>Data referenced from Archaeological Survey of India (ASI) and UNESCO World Heritage List.</p>
        </footer>
      </div>
    </main>
  );
}
