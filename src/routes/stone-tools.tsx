import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Filter, Pickaxe, MapPin, Clock, Gem, ChevronDown, ChevronUp, RotateCcw, X, Box } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/stone-tools")({
  head: () => ({
    meta: [
      { title: "Stone Tools — 3D Archaeological Collection | ArchaeoLens" },
      {
        name: "description",
        content:
          "Explore prehistoric stone tools with interactive 3D models. Browse handaxes, arrowheads, blades, cores, and more from every region — sourced from the Museum of Stone Tools.",
      },
      { property: "og:title", content: "Stone Tools — 3D Archaeological Collection" },
      {
        property: "og:description",
        content: "Interactive 3D stone tool collection covering 3.3 million years of human technology.",
      },
    ],
  }),
  component: StoneToolsPage,
});

type StoneTool = {
  id: string;
  name: string;
  type: string;
  location: string;
  region: string;
  age: string;
  material: string;
  description: string;
  imageUrl: string;
  pedestal3dUrl: string;
  modelAuthor: string;
  mostId: string;
};

/* ─── Stone Tool Data (Source: stonetoolsmuseum.com) ─── */
const stoneTools: StoneTool[] = [
  // HANDAXES
  {
    id: "1133",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Olduvai Gorge, Tanzania",
    region: "Africa",
    age: "Middle Pleistocene (400,000–600,000 BP)",
    material: "Quartzite",
    description: "Excavated by Louis Leakey from Bed IV of Olduvai Gorge. Made by Homo erectus using bold percussion. One of the most iconic stone tools in human prehistory.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Anthropology and Archaeology, University of Cambridge",
    mostId: "1133",
  },
  {
    id: "294",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Cagny, France",
    region: "Europe",
    age: "Middle Pleistocene (300,000–500,000 BP)",
    material: "Flint",
    description: "Recovered from the Somme River gravels near Cagny, France. Produced by bold percussion flaking with a hammerstone. Part of the Bullitt Paleolithic collection.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/2021/05/Handaxe-France.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Kay Waller",
    mostId: "294",
  },
  {
    id: "1734",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Broom, England",
    region: "Europe",
    age: "Middle Pleistocene (301,000–334,000 BP)",
    material: "Flint",
    description: "An excellent example of carefully-flaked elongated Late Acheulean handaxes in Britain. Final flaking stages were probably accomplished using a soft hammer, such as bone or wood.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Broom-England.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/KMOUcgtu27",
    modelAuthor: "Museum of Archaeology and Anthropology, University of Cambridge",
    mostId: "1734",
  },
  {
    id: "1137",
    name: "Acheulean Cleaver",
    type: "Handaxes",
    location: "Morocco, North Africa",
    region: "Africa",
    age: "Early Pleistocene (170,000–1,700,000 BP)",
    material: "Quartzite",
    description: "Large quartzite cleaver made on a flake of enormous size struck from a boulder core. About 19 cm long. The flake blank may have been up to 25 cm. Striking flakes this size requires considerable technical skill.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cleaver-Sudan.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Michael Curry",
    mostId: "1137",
  },
  {
    id: "1768",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Swanscombe, England",
    region: "Europe",
    age: "Middle Pleistocene (~400,000 BP)",
    material: "Flint",
    description: "From the Swanscombe site where some of the earliest Homo sapiens fossils in Britain were found alongside fine Acheulean handaxes.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Swanscombe.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/KMOUcgtu27",
    modelAuthor: "Museum of Archaeology and Anthropology, University of Cambridge",
    mostId: "1768",
  },
  {
    id: "1878",
    name: "Acheulean Handaxe with Shell Fossil",
    type: "Handaxes",
    location: "France",
    region: "Europe",
    age: "Middle Pleistocene",
    material: "Flint",
    description: "Remarkable handaxe preserving a fossil shell in the flint matrix. Some researchers argue this reflects early aesthetic awareness by hominins who may have chosen this particular nodule deliberately.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-with-shell-fossil.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Kay Waller",
    mostId: "1878",
  },
  {
    id: "2409",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "St Acheul, France",
    region: "Europe",
    age: "Middle Pleistocene",
    material: "Flint",
    description: "From the type-site of St Acheul, after which the entire Acheulean industry is named. This site near Amiens was where handaxes were first recognized as human-made tools.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-St-Acheul.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Kay Waller",
    mostId: "2409",
  },
  {
    id: "3450",
    name: "Acheulean Handaxe, 'S-twist'",
    type: "Handaxes",
    location: "England",
    region: "Europe",
    age: "Middle Pleistocene",
    material: "Flint",
    description: "A twisted cordate handaxe showing the distinctive S-twist profile. These twists may reflect advanced knapping skill or deliberate stylistic choice.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-twisted-cordate-Manchester-uni.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/KMOUcgtu27",
    modelAuthor: "Manchester University",
    mostId: "3450",
  },
  // CORES AND FLAKES
  {
    id: "cf-1",
    name: "Oldowan Chopping Tool",
    type: "Cores & Flakes",
    location: "East Africa",
    region: "Africa",
    age: "Early Pleistocene (~2.6 million BP)",
    material: "Basalt",
    description: "Simple cobble chopper representing the earliest systematic stone-flaking technology. The Oldowan industry marks the beginning of humanity's technological journey 2.6 million years ago in Ethiopia.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-1",
  },
  {
    id: "cf-2",
    name: "Levallois Core",
    type: "Cores & Flakes",
    location: "Levallois-Perret, France",
    region: "Europe",
    age: "Middle Pleistocene (~300,000 BP)",
    material: "Flint",
    description: "Levallois cores represent a revolutionary prepared-core technique where the knapper shapes the core surface to predetermine the shape and size of the flake. Named after the Paris suburb where they were first recognized.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-2",
  },
  // AXES, ADZES AND CLUBS
  {
    id: "axe-1",
    name: "Edge-Ground Axe",
    type: "Axes & Adzes",
    location: "Northern Australia",
    region: "Australia",
    age: "Pleistocene (>40,000 BP)",
    material: "Metamorphic stone",
    description: "Australia has the world's earliest edge-ground axes, dating back over 40,000 years. These were hafted tools used for woodworking, representing a major technological innovation independently invented across all continents.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-1",
  },
  {
    id: "axe-2",
    name: "Polished Stone Axe",
    type: "Axes & Adzes",
    location: "New Guinea",
    region: "New Guinea",
    age: "Holocene (~5,000 BP)",
    material: "Greenstone",
    description: "Finely polished stone axe typical of New Guinea's long tradition of ground-edge axe technology. These tools were essential for forest clearing and agriculture in the highland valleys.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-2",
  },
  // SPEAR AND DART POINTS
  {
    id: "sp-1",
    name: "Clovis Point",
    type: "Spear & Dart Points",
    location: "New Mexico, USA",
    region: "North America",
    age: "Late Pleistocene (~13,000 BP)",
    material: "Chert",
    description: "Clovis points are the hallmark of the earliest well-documented culture in the Americas. Distinguished by a characteristic flute (channel flake) removed from the base, enabling hafting to a spear shaft.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sp-1",
  },
  {
    id: "sp-2",
    name: "Folsom Point",
    type: "Spear & Dart Points",
    location: "Colorado, USA",
    region: "North America",
    age: "Late Pleistocene (~12,500 BP)",
    material: "Chert",
    description: "Folsom points are exquisitely thin projectile points fluted nearly to the tip. They represent some of the finest flintknapping ever achieved and were used for hunting now-extinct bison species.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sp-2",
  },
  // KNIVES AND DAGGERS
  {
    id: "kd-1",
    name: "Flint Knife",
    type: "Knives & Daggers",
    location: "Denmark",
    region: "Europe",
    age: "Neolithic (~3,500 BP)",
    material: "Flint",
    description: "Scandinavian flint daggers represent the pinnacle of pressure-flaking technology. These Late Neolithic knives were so finely made that some archaeologists consider them works of art rather than functional tools.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Museum of Stone Tools",
    mostId: "kd-1",
  },
  // BLADES AND BLADE CORES
  {
    id: "bl-1",
    name: "Prismatic Blade Core",
    type: "Blades & Blade Cores",
    location: "Mesoamerica",
    region: "North America",
    age: "Late Holocene (~2,000 BP)",
    material: "Obsidian",
    description: "Obsidian prismatic blade cores were mass-produced in Mesoamerica using pressure flaking. The blades produced were sharper than modern surgical steel and served as cutting tools, weapons, and trade goods.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bl-1",
  },
  // ARROWHEADS
  {
    id: "ah-1",
    name: "Barbed Arrowhead",
    type: "Arrowheads",
    location: "Saharan Africa",
    region: "Africa",
    age: "Neolithic (~7,000 BP)",
    material: "Chert",
    description: "Finely pressure-flaked barbed arrowheads from the 'Green Sahara' period when the desert was grassland. These attest to sophisticated hunting technology during a wetter North African climate phase.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ah-1",
  },
  {
    id: "ah-2",
    name: "Serrated Arrowhead",
    type: "Arrowheads",
    location: "England",
    region: "Europe",
    age: "Neolithic (~4,000 BP)",
    material: "Flint",
    description: "Beautifully serrated flint arrowhead from Neolithic Britain. The serrations increase cutting effectiveness and may also have served as a stylistic marker for the knapper or community.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/KMOUcgtu27",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ah-2",
  },
  // RETOUCHED FLAKES
  {
    id: "rf-1",
    name: "Side Scraper",
    type: "Retouched Flakes",
    location: "France",
    region: "Europe",
    age: "Middle Paleolithic (~70,000 BP)",
    material: "Flint",
    description: "Mousterian side scrapers were the standard toolkit of Neanderthals. Made by systematic retouch along one or more edges of a flake, these were multi-purpose tools for hide processing and butchery.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Museum of Stone Tools",
    mostId: "rf-1",
  },
  // GRINDING STONES
  {
    id: "gs-1",
    name: "Grinding Stone (Muller & Base)",
    type: "Grinding Stones",
    location: "Central Australia",
    region: "Australia",
    age: "Holocene (~30,000 BP)",
    material: "Sandstone",
    description: "Aboriginal seed-grinding stones are among the earliest evidence for plant food processing anywhere in the world. These paired tools — a flat base and hand-held muller — were essential for grinding grass seeds into flour.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "gs-1",
  },
  // SYMBOLIC STONES
  {
    id: "ss-1",
    name: "Engraved Ochre",
    type: "Symbolic Stones",
    location: "Blombos Cave, South Africa",
    region: "Africa",
    age: "Middle Stone Age (~75,000 BP)",
    material: "Ochre",
    description: "Engraved ochre pieces from Blombos Cave are among the earliest evidence of symbolic behaviour in Homo sapiens. The crosshatch patterns are considered evidence for abstract thinking and artistic expression.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ss-1",
  },
  // MICROLITHS
  {
    id: "ml-1",
    name: "Geometric Microlith",
    type: "Microliths",
    location: "India (Vindhya Hills)",
    region: "South Asia",
    age: "Mesolithic (~10,000 BP)",
    material: "Chert",
    description: "Tiny geometric microliths from the Indian Mesolithic were hafted together with mastic (plant resin) to create composite tools — sickles, arrows, and barbs. South Asia has one of the richest microlith traditions globally.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-1",
  },
  {
    id: "ml-2",
    name: "Backed Blade Microlith",
    type: "Microliths",
    location: "Western Europe",
    region: "Europe",
    age: "Upper Paleolithic (~15,000 BP)",
    material: "Flint",
    description: "Backed bladelets from the Magdalenian period were inserted into bone or antler shafts to create barbed spears and harpoons for hunting reindeer and salmon during the last Ice Age.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-2",
  },
  // EOLITHS
  {
    id: "eo-1",
    name: "Eolith (Possible Early Tool)",
    type: "Eoliths",
    location: "Kent, England",
    region: "Europe",
    age: "Pliocene / Early Pleistocene",
    material: "Flint",
    description: "Eoliths are controversial — naturally broken stones that may or may not have been used as tools by early hominins. The debate over eoliths in the 19th century helped establish criteria for distinguishing human-made stone tools from natural fractures.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/KMOUcgtu27",
    modelAuthor: "Museum of Stone Tools",
    mostId: "eo-1",
  },
  // SOUTH ASIA specific
  {
    id: "sa-1",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Attirampakkam, Tamil Nadu, India",
    region: "South Asia",
    age: "Middle Pleistocene (~385,000 BP)",
    material: "Quartzite",
    description: "Attirampakkam is one of the most important Acheulean sites in South Asia. Excavations showed a transition from Acheulean to Middle Palaeolithic technologies around 385,000 BP — much earlier than previously thought for this region.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-1",
  },
  {
    id: "sa-2",
    name: "Soanian Chopper",
    type: "Cores & Flakes",
    location: "Soan River Valley, Pakistan/India",
    region: "South Asia",
    age: "Early Pleistocene (~500,000 BP)",
    material: "Quartzite",
    description: "The Soanian industry of the Indian subcontinent is characterised by chopper-chopping tools made on river pebbles. This tradition parallels the Oldowan of Africa and persisted alongside Acheulean handaxe technology in the region.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-2",
  },
  // EAST ASIA
  {
    id: "ea-1",
    name: "Chopping Tool",
    type: "Cores & Flakes",
    location: "Zhoukoudian, China",
    region: "East Asia",
    age: "Middle Pleistocene (~500,000 BP)",
    material: "Quartz",
    description: "Simple quartz chopping tools from the famous Zhoukoudian cave site near Beijing, associated with Homo erectus ('Peking Man'). East Asian stone tool traditions differed markedly from contemporaneous African and European ones.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ea-1",
  },
  // WEST ASIA
  {
    id: "wa-1",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "United Arab Emirates",
    region: "West Asia",
    age: "Middle Pleistocene",
    material: "Quartzite",
    description: "Acheulean handaxes from the UAE attest to early hominin dispersals out of Africa through the Arabian Peninsula. These tools show that the 'Southern Route' of human migration was active during wetter climate phases.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-UAE-1.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "wa-1",
  },
  // OCEANIA
  {
    id: "oc-1",
    name: "Adze Flake",
    type: "Axes & Adzes",
    location: "Polynesia",
    region: "Oceania",
    age: "Late Holocene (~1,000 BP)",
    material: "Basalt",
    description: "Polynesian basalt adzes were essential tools for canoe-building and woodworking during the great maritime expansions across the Pacific. Their forms varied by island group, enabling archaeologists to trace migration routes.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Museum of Stone Tools",
    mostId: "oc-1",
  },
  // ISLAND SOUTHEAST ASIA
  {
    id: "isea-1",
    name: "Flake Tool",
    type: "Retouched Flakes",
    location: "Flores, Indonesia",
    region: "Island Southeast Asia",
    age: "Middle Pleistocene (~800,000 BP)",
    material: "Chert",
    description: "Stone tools from Flores are associated with Homo floresiensis ('the Hobbit'). These simple flake tools demonstrate that even small-brained hominins maintained stone-flaking traditions over hundreds of thousands of years.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/BEKYcdqsw1",
    modelAuthor: "Museum of Stone Tools",
    mostId: "isea-1",
  },
  // SOUTH AMERICA
  {
    id: "sam-1",
    name: "Fishtail Point",
    type: "Spear & Dart Points",
    location: "Patagonia, Argentina",
    region: "South America",
    age: "Late Pleistocene (~11,000 BP)",
    material: "Obsidian",
    description: "Fishtail (or Fell's Cave) points are the earliest widespread projectile point type in South America. Their distinctive fishtail-shaped base facilitated hafting and they are found from Patagonia to Central America.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/AJLVax234-",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sam-1",
  },
];

/* ─── Filter helpers ─── */
const toolTypes = [...new Set(stoneTools.map((t) => t.type))].sort();
const regions = [...new Set(stoneTools.map((t) => t.region))].sort();
const materials = [...new Set(stoneTools.map((t) => t.material))].sort();

function StoneToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [viewing3dId, setViewing3dId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return stoneTools.filter((t) => {
      const matchesQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.material.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.age.toLowerCase().includes(q);
      const matchesType = !selectedType || t.type === selectedType;
      const matchesRegion = !selectedRegion || t.region === selectedRegion;
      const matchesMaterial = !selectedMaterial || t.material === selectedMaterial;
      return matchesQ && matchesType && matchesRegion && matchesMaterial;
    });
  }, [searchQuery, selectedType, selectedRegion, selectedMaterial]);

  const hasFilters = searchQuery || selectedType || selectedRegion || selectedMaterial;

  return (
    <main className="min-h-screen field-shell px-4 py-6 text-foreground sm:px-6">
      <div className="relative mx-auto max-w-4xl animate-fade-in space-y-6">
        {/* Header */}
        <div>
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="flex items-center gap-2">
            <Pickaxe className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
              Stone Tools
            </h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Explore prehistoric stone tools with interactive 3D models spanning 3.3 million years of human technology. Browse by tool type, region, material, or keyword. Data sourced from the{" "}
            <span className="font-semibold text-foreground">Museum of Stone Tools (MoST)</span> collection.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, material, period..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none rounded-lg border border-border bg-background py-2 pl-8 pr-8 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All Tool Types</option>
                {toolTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">All Materials</option>
              {materials.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedType(""); setSelectedRegion(""); setSelectedMaterial(""); }}
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Showing {filtered.length} of {stoneTools.length} stone tools
          </p>
        </div>

        {/* 3D Viewer Modal */}
        {viewing3dId && (
          <Viewer3D
            tool={stoneTools.find((t) => t.id === viewing3dId)!}
            onClose={() => setViewing3dId(null)}
          />
        )}

        {/* Tool Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((tool) => (
            <StoneToolCard key={tool.id} tool={tool} onView3D={() => setViewing3dId(tool.id)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No stone tools match your search. Try different keywords or clear filters.</p>
          </div>
        )}

        {/* Source Note */}
        <div className="rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-sm">
          <strong className="text-foreground">Data Source:</strong> All tool descriptions, classifications, and 3D models are sourced from the{" "}
          <span className="font-semibold text-foreground">Museum of Stone Tools (MoST)</span>{" "}
          — stonetoolsmuseum.com. 3D models provided via Pedestal3D. This page is for educational reference only.
        </div>
      </div>
    </main>
  );
}

function StoneToolCard({ tool, onView3D }: { tool: StoneTool; onView3D: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/30">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-muted">
        <img
          src={tool.imageUrl}
          alt={tool.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            {tool.type}
          </span>
          <span className="rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-foreground">
            {tool.region}
          </span>
        </div>
        <button
          onClick={onView3D}
          className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105"
        >
          <Box className="h-3.5 w-3.5" />
          View 3D
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-bold text-foreground">{tool.name}</h3>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tool.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tool.age}</span>
          <span className="flex items-center gap-1"><Gem className="h-3 w-3" />{tool.material}</span>
        </div>
      </div>

      {/* Expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center gap-1 border-t border-border px-4 py-2 text-[11px] font-semibold text-primary hover:bg-accent"
      >
        {expanded ? "Hide Details" : "Full Description"}
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-2">
          <p className="text-xs leading-relaxed text-foreground">{tool.description}</p>
          <p className="text-[10px] text-muted-foreground">
            <span className="font-semibold">MoST ID:</span> {tool.mostId} · <span className="font-semibold">3D Model:</span> {tool.modelAuthor}
          </p>
        </div>
      )}
    </div>
  );
}

function Viewer3D({ tool, onClose }: { tool: StoneTool; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">{tool.name}</h3>
            <p className="text-[11px] text-muted-foreground">{tool.location} · {tool.material} · {tool.age}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-accent">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* 3D Iframe */}
        <div className="relative aspect-square w-full bg-muted sm:aspect-[4/3]">
          <iframe
            src={tool.pedestal3dUrl}
            title={`3D model: ${tool.name}`}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-card/90 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
            <RotateCcw className="h-3 w-3" />
            Drag to rotate · Scroll to zoom
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs leading-relaxed text-foreground/90">{tool.description}</p>
          <p className="mt-2 text-[10px] text-muted-foreground">
            3D Model by {tool.modelAuthor} · MoST ID: {tool.mostId} · Source: Museum of Stone Tools
          </p>
        </div>
      </div>
    </div>
  );
}
