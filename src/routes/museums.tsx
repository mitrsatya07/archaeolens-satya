import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Landmark, MapPin, ExternalLink, Globe } from "lucide-react";

export const Route = createFileRoute("/museums")({
  head: () => ({
    meta: [
      { title: "Archaeological Museums — ArchaeoLens" },
      {
        name: "description",
        content:
          "Comprehensive directory of ASI site museums, state archaeological museums, and international museums housing Indian archaeological collections.",
      },
      { property: "og:title", content: "Archaeological Museums — ArchaeoLens" },
      {
        property: "og:description",
        content:
          "Explore ASI site museums, state museums, and foreign museums with Indian archaeological objects.",
      },
    ],
  }),
  component: MuseumsPage,
});

type Museum = {
  name: string;
  location: string;
  url: string;
  highlights: string;
};

/* ─── ASI Site Museums ─── */
const asiMuseums: Museum[] = [
  {
    name: "Archaeological Museum, Sarnath",
    location: "Sarnath, Uttar Pradesh",
    url: "https://asi.nic.in/museum-sarnath/",
    highlights: "Ashoka Lion Capital, Buddhist sculptures, Gupta-period art, Mauryan polished stone.",
  },
  {
    name: "Archaeological Museum, Red Fort",
    location: "New Delhi",
    url: "https://asi.nic.in/museum-red-fort/",
    highlights: "Mughal-period artifacts, arms, textiles, manuscripts, calligraphy.",
  },
  {
    name: "Archaeological Museum, Nalanda",
    location: "Nalanda, Bihar",
    url: "https://asi.nic.in/museum-nalanda/",
    highlights: "Buddhist bronzes, terracottas, inscribed seals from Nalanda Mahavihara.",
  },
  {
    name: "Archaeological Museum, Hampi",
    location: "Hampi, Karnataka",
    url: "https://asi.nic.in/museum-hampi/",
    highlights: "Vijayanagara-period sculptures, hero stones, Hoysala and Chalukya antiquities.",
  },
  {
    name: "Archaeological Museum, Konark",
    location: "Konark, Odisha",
    url: "https://asi.nic.in/museum-konark/",
    highlights: "Stone sculptures from the Sun Temple, architectural fragments, inscriptions.",
  },
  {
    name: "Archaeological Museum, Sanchi",
    location: "Sanchi, Madhya Pradesh",
    url: "https://asi.nic.in/museum-sanchi/",
    highlights: "Buddhist relics, Ashokan inscriptions, stupa railing sculptures, terracotta.",
  },
  {
    name: "Archaeological Museum, Amaravati",
    location: "Amaravati, Andhra Pradesh",
    url: "https://asi.nic.in/museum-amaravathi/",
    highlights: "Limestone narrative panels from the Great Stupa, Satavahana-period Buddhist art.",
  },
  {
    name: "Archaeological Museum, Khajuraho",
    location: "Khajuraho, Madhya Pradesh",
    url: "https://asi.nic.in/museum-khajuraho/",
    highlights: "Chandela-period sculptures, Jain bronzes, temple architectural fragments.",
  },
  {
    name: "Archaeological Museum, Lothal",
    location: "Lothal, Gujarat",
    url: "https://asi.nic.in/museum-lothal/",
    highlights: "Indus Valley Civilization: seals, beads, weights, terracotta, dockyard remains.",
  },
  {
    name: "Archaeological Museum, Goa",
    location: "Old Goa, Goa",
    url: "https://asi.nic.in/museum-goa/",
    highlights: "Portuguese-period antiquities, hero stones, sati stones, Hindu and Jain sculptures.",
  },
  {
    name: "Archaeological Museum, Aihole",
    location: "Aihole, Karnataka",
    url: "https://asi.nic.in/museum-aihole/",
    highlights: "Early Chalukya sculptures, inscriptions, architectural members.",
  },
  {
    name: "Archaeological Museum, Velha Goa (Portrait Gallery)",
    location: "Old Goa, Goa",
    url: "https://asi.nic.in/museum-goa/",
    highlights: "Viceregal portraits, colonial-period paintings and artifacts.",
  },
  {
    name: "Archaeological Museum, Bodhgaya",
    location: "Bodhgaya, Bihar",
    url: "https://asi.nic.in/museum-bodhgaya/",
    highlights: "Buddhist sculptures, votive stupas, Hindu and Jain images from Mahabodhi complex.",
  },
  {
    name: "Archaeological Museum, Halebidu",
    location: "Halebidu, Karnataka",
    url: "https://asi.nic.in/museum-halebidu/",
    highlights: "Hoysala-period sculptures, temple carvings, inscriptions.",
  },
  {
    name: "Archaeological Museum, Ratnagiri",
    location: "Ratnagiri, Odisha",
    url: "https://asi.nic.in/museum-ratnagiri/",
    highlights: "Buddhist monastic art, carved door jambs, votive stupas, inscriptions.",
  },
  {
    name: "Archaeological Museum, Vaishali",
    location: "Vaishali, Bihar",
    url: "https://asi.nic.in/museum-vaishali/",
    highlights: "Terracottas, pottery, punch-marked coins, antiquities from Kolhua excavations.",
  },
  {
    name: "Archaeological Museum, Chandragiri Fort",
    location: "Chandragiri, Andhra Pradesh",
    url: "https://asi.nic.in/museum-chandragiri/",
    highlights: "Vijayanagara bronze images, weapons, sculptures from the fort complex.",
  },
  {
    name: "Fort Museum, Chennai",
    location: "Fort St. George, Chennai",
    url: "https://asi.nic.in/museum-fort-st-george/",
    highlights: "Colonial-era portraits, arms, coins, uniforms, East India Company memorabilia.",
  },
];

/* ─── State Archaeological & Heritage Museums ─── */
const stateMuseums: Museum[] = [
  {
    name: "National Museum",
    location: "New Delhi",
    url: "https://www.nationalmuseumindia.gov.in/",
    highlights: "Harappan gallery, Maurya to Mughal art, bronzes, manuscripts, numismatics, textiles.",
  },
  {
    name: "Indian Museum",
    location: "Kolkata, West Bengal",
    url: "https://indianmuseumkolkata.org/",
    highlights: "Oldest museum in Asia — Gandhara sculptures, Egyptian mummy, geological specimens, Bharhut railing.",
  },
  {
    name: "Government Museum (Egmore)",
    location: "Chennai, Tamil Nadu",
    url: "https://www.chennaimuseum.org/",
    highlights: "Chola bronzes, Amaravati marbles, numismatic gallery, Roman antiquities from Arikamedu.",
  },
  {
    name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    location: "Mumbai, Maharashtra",
    url: "https://www.csmvs.in/",
    highlights: "Indus Valley artifacts, miniature paintings, Gandhara sculptures, decorative arts.",
  },
  {
    name: "Salar Jung Museum",
    location: "Hyderabad, Telangana",
    url: "https://www.salarjungmuseum.in/",
    highlights: "Veiled Rebecca, Indian bronzes, Far Eastern art, manuscripts, jade collection.",
  },
  {
    name: "Albert Hall Museum",
    location: "Jaipur, Rajasthan",
    url: "https://www.alberthalljaipur.gov.in/",
    highlights: "Egyptian mummy, terracotta, coins, metal sculptures, folk art of Rajasthan.",
  },
  {
    name: "State Archaeological Museum, Hyderabad",
    location: "Hyderabad, Telangana",
    url: "https://museumstateap.in/",
    highlights: "Buddhist antiquities, Ikshvaku sculptures, Satavahana coins, megalithic iron tools.",
  },
  {
    name: "Patna Museum (Bihar Museum)",
    location: "Patna, Bihar",
    url: "https://biharmuseum.org/",
    highlights: "Didarganj Yakshi, Mauryan terracottas, Pala bronzes, Gandhara art.",
  },
  {
    name: "Karnataka State Archaeology Museum (Kittur Rani Chennamma)",
    location: "Mysuru, Karnataka",
    url: "https://www.mysorepalace.gov.in/",
    highlights: "Stone tools, megalithic pottery, Hoysala sculptures, Vijayanagara coins.",
  },
  {
    name: "Madhya Pradesh State Museum (Rani Durgavati)",
    location: "Jabalpur, Madhya Pradesh",
    url: "http://www.mpculture.in/",
    highlights: "Paramara sculptures, tribal art, inscriptions, Gupta-period terracotta.",
  },
  {
    name: "Calico Museum of Textiles",
    location: "Ahmedabad, Gujarat",
    url: "https://www.calicomuseum.org/",
    highlights: "Historical Indian textiles, Mughal court fabrics, resist-dyed and brocaded silks.",
  },
  {
    name: "Allahabad Museum",
    location: "Prayagraj, Uttar Pradesh",
    url: "https://www.allahabadmuseum.org/",
    highlights: "Kushana sculptures, terracotta figurines, Rajput paintings, freedom struggle gallery.",
  },
  {
    name: "Napier Museum",
    location: "Thiruvananthapuram, Kerala",
    url: "https://museum.kerala.gov.in/",
    highlights: "Chola bronzes, ivory carvings, temple models, Japanese lacquerware, Kerala murals.",
  },
  {
    name: "State Museum, Lucknow",
    location: "Lucknow, Uttar Pradesh",
    url: "https://statemuseumlucknow.in/",
    highlights: "Kushana-Gupta sculptures, Jain bronzes, Egyptian mummy, terracotta collection.",
  },
  {
    name: "Assam State Museum",
    location: "Guwahati, Assam",
    url: "https://museums.assam.gov.in/",
    highlights: "Ahom-period antiquities, stone sculptures, folk art, epigraphic records.",
  },
];

/* ─── Foreign Museums with Indian Objects ─── */
const foreignMuseums: Museum[] = [
  {
    name: "British Museum — South Asia Collection",
    location: "London, United Kingdom",
    url: "https://www.britishmuseum.org/collection/search?place=South+Asia",
    highlights:
      "Amaravati marbles, Gandhara Buddhas, Mughal paintings, Harappan seals, Tipu Sultan artifacts.",
  },
  {
    name: "Victoria and Albert Museum — South Asia Gallery",
    location: "London, United Kingdom",
    url: "https://www.vam.ac.uk/collections/south-and-south-east-asia",
    highlights: "Tipu's Tiger, Mughal jade, Indian textiles, Chola bronzes, Gandhara reliefs.",
  },
  {
    name: "Metropolitan Museum of Art — South Asian Art",
    location: "New York, USA",
    url: "https://www.metmuseum.org/about-the-met/collection-areas/asian-art",
    highlights:
      "Kushan sculptures, Mughal miniatures, Chola Nataraja, Rajput paintings, Buddhist bronzes.",
  },
  {
    name: "Smithsonian — Freer & Sackler Galleries",
    location: "Washington, D.C., USA",
    url: "https://asia.si.edu/explore/south-asia/",
    highlights: "Indian sculpture, Mughal painting, Buddhist art, Gandhara stone reliefs.",
  },
  {
    name: "Musée Guimet (National Museum of Asian Arts)",
    location: "Paris, France",
    url: "https://www.guimet.fr/en/collections/india/",
    highlights: "Gandhara art, Mathura sculptures, Chola bronzes, Amaravati reliefs, Indian textiles.",
  },
  {
    name: "Museum für Asiatische Kunst (Asian Art Museum Berlin)",
    location: "Berlin, Germany",
    url: "https://www.smb.museum/en/museums-institutions/museum-fuer-asiatische-kunst/home/",
    highlights: "Gandhara collection, Indian miniatures, Buddhist sculptures, Central Asian murals.",
  },
  {
    name: "Royal Ontario Museum — South Asia Gallery",
    location: "Toronto, Canada",
    url: "https://www.rom.on.ca/en/south-asia",
    highlights: "Hindu and Buddhist sculptures, Mughal decorative arts, Indian arms and armour.",
  },
  {
    name: "Rijksmuseum — Asian Pavilion",
    location: "Amsterdam, Netherlands",
    url: "https://www.rijksmuseum.nl/en/rijksstudio?q=india",
    highlights: "Chola bronzes, Mughal paintings, VOC-period Indian trade objects, Gandhara reliefs.",
  },
  {
    name: "National Museum of Asian Art (Smithsonian)",
    location: "Washington, D.C., USA",
    url: "https://asia.si.edu/",
    highlights: "Buddhist reliquary, Mughal albums, stone and bronze sculptures from across India.",
  },
  {
    name: "Ashmolean Museum — Indian Art",
    location: "Oxford, United Kingdom",
    url: "https://www.ashmolean.org/eastern-art",
    highlights: "Tibetan and Indian Buddhist art, Mughal paintings, South Indian bronzes.",
  },
  {
    name: "Los Angeles County Museum of Art (LACMA) — South Asian Art",
    location: "Los Angeles, USA",
    url: "https://www.lacma.org/art/collection/south-and-southeast-asian-art",
    highlights: "Harappan antiquities, Chola bronzes, Rajput paintings, Mughal jades.",
  },
  {
    name: "Cleveland Museum of Art — Indian Art",
    location: "Cleveland, USA",
    url: "https://www.clevelandart.org/art/departments/indian-southeast-asian-and-korean-art",
    highlights: "Gupta-period sculptures, Pala bronzes, Jain manuscripts, Hindu temple art.",
  },
];

function MuseumsPage() {
  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground">
      <div className="relative mx-auto max-w-3xl animate-fade-in space-y-10">
        <div>
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to camera
          </Link>

          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Museum Directory
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-primary sm:text-4xl">
            Archaeological Museums
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            A comprehensive directory of museums relevant to Indian archaeology — ASI site museums,
            state heritage museums, and international institutions housing Indian archaeological
            collections. All links point to official museum websites.
          </p>
        </div>

        {/* ASI Site Museums */}
        <MuseumSection
          icon={<Landmark className="h-5 w-5 text-primary" />}
          title="ASI Site Museums"
          subtitle="Archaeological Survey of India"
          description="Museums maintained by ASI at excavated sites and protected monuments across India."
          museums={asiMuseums}
          sourceLabel="Archaeological Survey of India (asi.nic.in)"
          sourceUrl="https://asi.nic.in/site-museum/"
        />

        {/* State Museums */}
        <MuseumSection
          icon={<MapPin className="h-5 w-5 text-primary" />}
          title="State & National Museums"
          subtitle="Archaeological & heritage collections"
          description="Major state museums, national museums, and heritage institutions with significant archaeological galleries."
          museums={stateMuseums}
          sourceLabel="Ministry of Culture, Govt. of India"
          sourceUrl="https://www.indiaculture.gov.in/museums"
        />

        {/* Foreign Museums */}
        <MuseumSection
          icon={<Globe className="h-5 w-5 text-primary" />}
          title="International Museums with Indian Objects"
          subtitle="Global collections"
          description="Major foreign museums that house significant Indian archaeological and art-historical objects — useful for typological comparison and provenance research."
          museums={foreignMuseums}
          sourceLabel="Respective official museum websites"
          sourceUrl="https://en.wikipedia.org/wiki/Indian_art_in_foreign_museums"
        />

        <div className="rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-sm">
          <strong className="text-foreground">Note:</strong> All museum URLs link to official
          institutional websites. Visiting hours, collections on display, and gallery access may
          change — always verify on the museum's official site before visiting. This directory is
          maintained for research and educational reference.
        </div>
      </div>
    </main>
  );
}

function MuseumSection({
  icon,
  title,
  subtitle,
  description,
  museums,
  sourceLabel,
  sourceUrl,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  museums: Museum[];
  sourceLabel: string;
  sourceUrl: string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {subtitle}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {museums.map((m) => (
          <a
            key={m.name}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                {m.name}
              </h3>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </div>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {m.location}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.highlights}</p>
          </a>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Source:</span>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          {sourceLabel}
        </a>
      </div>
    </section>
  );
}
