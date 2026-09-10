/* ─── Artifacts for the virtual museum hall (condensed from the site's reference data) ─── */

export type MuseumArtifact = {
  id: string;
  name: string;
  type: string;
  age: string;
  location: string;
  material: string;
  description: string;
  /** wall side: -1 = left wall, +1 = right wall */
  side: -1 | 1;
  z: number;
  color: string;
  roughness: number;
  geometry: ArtifactGeometry;
};

export const MUSEUM_ARTIFACTS: MuseumArtifact[] = [
  {
    id: "olduvai-handaxe",
    name: "Acheulean Handaxe",
    type: "Handaxe",
    age: "Middle Pleistocene (400,000–600,000 BP)",
    location: "Olduvai Gorge, Tanzania",
    material: "Quartzite",
    description:
      "Excavated by Louis Leakey from Bed IV of Olduvai Gorge. Made by Homo erectus using bold percussion — one of the most iconic stone tools in human prehistory, carried out of Africa across a million years.",
    side: -1,
    z: -24,
    color: "#b9a58c",
    roughness: 0.9,
    geometry: "handaxe",
  },
  {
    id: "langhnaj-triangle",
    name: "Microlithic Triangle",
    type: "Microliths",
    age: "Mesolithic (~4,000 BCE)",
    location: "Langhnaj, Gujarat, India",
    material: "Agate",
    description:
      "Langhnaj near Ahmedabad yielded one of the largest microlithic assemblages in western India along with human burials. Triangular microliths in agate served as arrow-tips and barbs.",
    side: 1,
    z: -24,
    color: "#a9748c",
    roughness: 0.35,
    geometry: "arrowhead",
  },
  {
    id: "bagor-lunate",
    name: "Microlithic Lunate",
    type: "Microliths",
    age: "Mesolithic (~5,000 BCE)",
    location: "Bagor, Rajasthan, India",
    material: "Chert",
    description:
      "Bagor is one of the largest and best-documented Mesolithic sites in India. Lunate microliths were hafted as arrowheads and sickle teeth; the site also shows early animal domestication.",
    side: -1,
    z: -12,
    color: "#8a7a6a",
    roughness: 0.8,
    geometry: "blade",
  },
  {
    id: "nbpw-pot",
    name: "NBPW Painted Bowl",
    type: "Pottery",
    age: "Northern Black Polished Ware (700–200 BCE)",
    location: "Gangetic Plain, India",
    material: "Slipware",
    description:
      "The lustrous Northern Black Polished Ware signals the second urbanisation of the Ganges valley — thin-walled, mirror-polished bowls associated with early states, coinage, and trade.",
    side: 1,
    z: -12,
    color: "#2b2b30",
    roughness: 0.25,
    geometry: "pot",
  },
  {
    id: "levallois-core",
    name: "Levallois Core",
    type: "Cores & Flakes",
    age: "Middle Paleolithic (~100,000 BP)",
    location: "Shivalik Foothills, India",
    material: "Flint",
    description:
      "A prepared-core technology: the surface was shaped so a single predesigned flake could be struck off like a stamp. A hallmark of Neanderthal-era ingenuity across the Old World.",
    side: -1,
    z: 0,
    color: "#4a4a52",
    roughness: 0.85,
    geometry: "core",
  },
  {
    id: "soan-chopper",
    name: "Soan Pebble Chopper",
    type: "Cores & Flakes",
    age: "Lower Paleolithic (~500,000 BP)",
    location: "Soan Valley, Pakistan / NW India",
    material: "Quartzite",
    description:
      "The earliest stone-tool industry of the Indian subcontinent: river pebbles flaked on one edge to produce a chopping or hammering tool, first described by de Terra and Paterson.",
    side: 1,
    z: 0,
    color: "#a3937e",
    roughness: 0.95,
    geometry: "core",
  },
  {
    id: "neolithic-quern",
    name: "Neolithic Quern & Muller",
    type: "Grinding Stones",
    age: "Neolithic (~3,000 BCE)",
    location: "Mehrgarh, Balochistan",
    material: "Sandstone",
    description:
      "Saddle querns like this ground the wheat and barley of South Asia's first farming village. Mehrgarh precedes Harappa by millennia — agriculture before the Indus cities.",
    side: -1,
    z: 12,
    color: "#9c8a6e",
    roughness: 1,
    geometry: "grinding",
  },
  {
    id: "celt-adze",
    name: "Polished Celt Adze",
    type: "Axes & Adzes",
    age: "Neolithic (~2,500 BCE)",
    location: "Chalcolithic Deccan, India",
    material: "Dolerite",
    description:
      "Ground and polished to a mirror edge, celts felled the trees of the first clearances. Their polish — unlike any flake tool — marks the Neolithic revolution in stone.",
    side: 1,
    z: 12,
    color: "#5d6b62",
    roughness: 0.4,
    geometry: "handaxe",
  },
  {
    id: "indus-seal-blade",
    name: "Harappan Blade Segment",
    type: "Blades & Blade Cores",
    age: "Harappan (2600–1900 BCE)",
    location: "Dholavira, Gujarat, India",
    material: "Chalcedony",
    description:
      "Standardised long parallel-sided blades struck from cylindrical cores — the factory product of Harappan craft specialists, used for sickles and fine cutting work.",
    side: -1,
    z: 24,
    color: "#cfc3ad",
    roughness: 0.3,
    geometry: "blade",
  },
  {
    id: "cupmark",
    name: "Cupmarked Slab Fragment",
    type: "Symbolic Stones",
    age: "Neolithic–Early Historic",
    location: "Kupgal Hill, Karnataka, India",
    material: "Granite",
    description:
      "Dolmen sites of the Deccan carry deliberately pecked cupules — some of the oldest surviving human marks on the Indian landscape, possibly musical 'ringing stones'.",
    side: 1,
    z: 24,
    color: "#7e746c",
    roughness: 1,
    geometry: "grinding",
  },
];

/* Where the visitor camera starts and how tall the eyes are */
export const START_POSITION: [number, number, number] = [0, 1.7, 30];
export const EYE_HEIGHT = 1.7;
/* Y offset for all pedestals (floor level) */
export const MUSEUM_PLINTH_Y = 0;

export type ArtifactGeometry = "handaxe" | "arrowhead" | "pot" | "core" | "grinding" | "blade";
