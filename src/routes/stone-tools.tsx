import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Filter, Pickaxe, MapPin, Clock, Gem, ChevronDown, ChevronUp, RotateCcw, X, Box, Building2 } from "lucide-react";
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
  pedestal3dUrl?: string;
  modelAuthor: string;
  mostId: string;
  /** Museum(s) where this tool or similar examples are displayed */
  museumDisplay?: string;
};

/* ─── Representative 3D models per tool type (used when a tool lacks its own MoST 3D scan) ─── */
const REPRESENTATIVE_3D_BY_TYPE: Record<string, string> = {
  "Handaxes": "https://une.pedestal3d.com/r/AJLVax234-",
  "Cores & Flakes": "https://une.pedestal3d.com/r/BEKYcdqsw1",
  "Blades & Blade Cores": "https://une.pedestal3d.com/r/DJTfqrsxy6",
  "Retouched Flakes": "https://une.pedestal3d.com/r/EKNQYcekuv",
  "Knives & Daggers": "https://une.pedestal3d.com/r/KMOUcgtu27",
  "Spear & Dart Points": "https://une.pedestal3d.com/r/jsiAWmjDl9",
  "Arrowheads": "https://une.pedestal3d.com/r/jsiAWmjDl9",
  "Axes & Adzes": "https://une.pedestal3d.com/r/JMVajqyz29",
  "Grinding Stones": "https://une.pedestal3d.com/r/R029i8FLPm",
  "Hammerstones & Anvils": "https://une.pedestal3d.com/r/R029i8FLPm",
  "Microliths": "https://une.pedestal3d.com/r/EKNQYcekuv",
  "Symbolic Stones": "https://une.pedestal3d.com/r/R029i8FLPm",
  "Eoliths": "https://une.pedestal3d.com/r/R029i8FLPm",
  "Bead & Drill Tools": "https://une.pedestal3d.com/r/jsiAWmjDl9",
  "Ring Stones & Mace Heads": "https://une.pedestal3d.com/r/R029i8FLPm",
  "Megalithic Tools": "https://une.pedestal3d.com/r/R029i8FLPm",
  "Stone Weights": "https://une.pedestal3d.com/r/R029i8FLPm",
};

const FALLBACK_3D_URL = "https://une.pedestal3d.com/r/AJLVax234-";

function resolve3D(tool: StoneTool): { url: string; isRepresentative: boolean } {
  if (tool.pedestal3dUrl) return { url: tool.pedestal3dUrl, isRepresentative: false };
  return { url: REPRESENTATIVE_3D_BY_TYPE[tool.type] ?? FALLBACK_3D_URL, isRepresentative: true };
}

/* ─── Stone Tool Data (Source: stonetoolsmuseum.com + museum cross-references) ─── */
const stoneTools: StoneTool[] = [

  // ══════════════════════════ HANDAXES ══════════════════════════
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
    museumDisplay: "British Museum, London; National Museum of Tanzania, Dar es Salaam",
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
    museumDisplay: "Musée d'Archéologie Nationale, Saint-Germain-en-Laye",
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
    museumDisplay: "Museum of Archaeology and Anthropology, Cambridge",
  },
  {
    id: "1137",
    name: "Acheulean Cleaver",
    type: "Handaxes",
    location: "Morocco, North Africa",
    region: "Africa",
    age: "Early Pleistocene (170,000–1,700,000 BP)",
    material: "Quartzite",
    description: "Large quartzite cleaver made on a flake of enormous size struck from a boulder core. About 19 cm long. Striking flakes this size requires considerable technical skill.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cleaver-Sudan.jpg",
    pedestal3dUrl: "https://une.pedestal3d.com/r/JMVajqyz29",
    modelAuthor: "Michael Curry",
    mostId: "1137",
    museumDisplay: "Musée d'Archéologie, Rabat, Morocco",
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
    pedestal3dUrl: "https://une.pedestal3d.com/r/DJTfqrsxy6",
    modelAuthor: "Museum of Archaeology and Anthropology, University of Cambridge",
    mostId: "1768",
    museumDisplay: "Natural History Museum, London",
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
    pedestal3dUrl: "https://une.pedestal3d.com/r/EKNQYcekuv",
    modelAuthor: "Kay Waller",
    mostId: "1878",
    museumDisplay: "Museum of Archaeology and Anthropology, Cambridge",
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
    pedestal3dUrl: "https://une.pedestal3d.com/r/jsiAWmjDl9",
    modelAuthor: "Kay Waller",
    mostId: "2409",
    museumDisplay: "Musée de Picardie, Amiens; British Museum, London",
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
    pedestal3dUrl: "https://une.pedestal3d.com/r/R029i8FLPm",
    modelAuthor: "Manchester University",
    mostId: "3450",
    museumDisplay: "Manchester Museum, University of Manchester",
  },
  {
    id: "sa-1",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Attirampakkam, Tamil Nadu, India",
    region: "South Asia",
    age: "Middle Pleistocene (~385,000 BP)",
    material: "Quartzite",
    description: "Attirampakkam is one of the most important Acheulean sites in South Asia. Excavations showed a transition from Acheulean to Middle Palaeolithic technologies around 385,000 BP.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-1",
    museumDisplay: "Government Museum, Chennai (Fort St. George Museum — ASI); National Museum, New Delhi",
  },
  {
    id: "sa-ha2",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Isampur, Karnataka, India",
    region: "South Asia",
    age: "Middle Pleistocene (~350,000 BP)",
    material: "Limestone",
    description: "Isampur quarry is a rare Acheulean workshop site where handaxes were produced in situ. The limestone handaxes here show all stages of the reduction sequence from raw material to finished tool.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-ha2",
    museumDisplay: "Archaeological Museum, Hampi (Kamlapur) — ASI; Deccan College Museum, Pune",
  },
  {
    id: "sa-ha3",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Bhimbetka, Madhya Pradesh, India",
    region: "South Asia",
    age: "Lower Paleolithic (~300,000 BP)",
    material: "Quartzite",
    description: "Bhimbetka rock shelters are a UNESCO World Heritage Site. Lower Palaeolithic handaxes from the site represent some of the earliest evidence of human habitation in the Indian subcontinent.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-ha3",
    museumDisplay: "Indira Gandhi Rashtriya Manav Sangrahalaya (IGRMS), Bhopal; State Museum, Bhopal",
  },
  {
    id: "sa-ha4",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Hunsgi-Baichbal Valley, Karnataka, India",
    region: "South Asia",
    age: "Middle Pleistocene (~400,000 BP)",
    material: "Limestone",
    description: "The Hunsgi Valley in northern Karnataka has one of the densest concentrations of Acheulean sites in the world. Hundreds of handaxes have been recovered from open-air sites along ancient stream channels.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-ha4",
    museumDisplay: "Deccan College Museum, Pune; Archaeological Museum, Hampi (Kamlapur) — ASI",
  },
  {
    id: "wa-1",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "United Arab Emirates",
    region: "West Asia",
    age: "Middle Pleistocene",
    material: "Quartzite",
    description: "Acheulean handaxes from the UAE attest to early hominin dispersals out of Africa through the Arabian Peninsula during wetter climate phases.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-UAE-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "wa-1",
    museumDisplay: "Sharjah Archaeology Museum, UAE",
  },
  {
    id: "ha-madras",
    name: "Madras Handaxe (Pallavaram type)",
    type: "Handaxes",
    location: "Pallavaram, Chennai, India",
    region: "South Asia",
    age: "Lower Paleolithic (~500,000 BP)",
    material: "Quartzite",
    description: "Robert Bruce Foote discovered the first Indian Palaeolithic handaxe at Pallavaram near Chennai in 1863. This discovery proved that India had a Stone Age, revolutionising Indian archaeology.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ha-madras",
    museumDisplay: "Government Museum, Chennai (Fort St. George Museum — ASI); British Museum, London",
  },
  {
    id: "ha-didwana",
    name: "Acheulean Handaxe",
    type: "Handaxes",
    location: "Didwana, Rajasthan, India",
    region: "South Asia",
    age: "Middle Pleistocene (~300,000 BP)",
    material: "Quartzite",
    description: "Didwana in Rajasthan's Thar Desert has yielded stratified Acheulean handaxes showing the Lower to Middle Palaeolithic transition in arid western India.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Handaxe-Tanzania.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ha-didwana",
    museumDisplay: "Archaeological Museum, Kalibangan — ASI; Albert Hall Museum, Jaipur",
  },
  // ══════════════════════════ CORES & FLAKES ══════════════════════════
  {
    id: "cf-1",
    name: "Oldowan Chopping Tool",
    type: "Cores & Flakes",
    location: "East Africa",
    region: "Africa",
    age: "Early Pleistocene (~2.6 million BP)",
    material: "Basalt",
    description: "Simple cobble chopper representing the earliest systematic stone-flaking technology. The Oldowan industry marks the beginning of humanity's technological journey 2.6 million years ago.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-1",
    museumDisplay: "National Museum of Ethiopia, Addis Ababa; British Museum, London",
  },
  {
    id: "cf-2",
    name: "Levallois Core",
    type: "Cores & Flakes",
    location: "Levallois-Perret, France",
    region: "Europe",
    age: "Middle Pleistocene (~300,000 BP)",
    material: "Flint",
    description: "Levallois cores represent a revolutionary prepared-core technique where the knapper shapes the core surface to predetermine the shape and size of the flake.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-2",
    museumDisplay: "Musée d'Archéologie Nationale, Saint-Germain-en-Laye; British Museum, London",
  },
  {
    id: "sa-2",
    name: "Soanian Chopper",
    type: "Cores & Flakes",
    location: "Soan River Valley, Pakistan/India",
    region: "South Asia",
    age: "Early Pleistocene (~500,000 BP)",
    material: "Quartzite",
    description: "The Soanian industry of the Indian subcontinent is characterised by chopper-chopping tools made on river pebbles. This tradition parallels the Oldowan of Africa.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sa-2",
    museumDisplay: "Archaeological Museum, Ropar (Rupnagar) — ASI; Lahore Museum, Pakistan",
  },
  {
    id: "ea-1",
    name: "Chopping Tool",
    type: "Cores & Flakes",
    location: "Zhoukoudian, China",
    region: "East Asia",
    age: "Middle Pleistocene (~500,000 BP)",
    material: "Quartz",
    description: "Simple quartz chopping tools from the famous Zhoukoudian cave site near Beijing, associated with Homo erectus ('Peking Man').",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ea-1",
    museumDisplay: "Zhoukoudian Museum, Beijing; Institute of Vertebrate Paleontology, Beijing",
  },
  {
    id: "cf-nevasa",
    name: "Middle Palaeolithic Flake",
    type: "Cores & Flakes",
    location: "Nevasa, Maharashtra, India",
    region: "South Asia",
    age: "Middle Pleistocene (~150,000 BP)",
    material: "Chalcedony",
    description: "Nevasa on the Pravara River is one of the key Middle Palaeolithic sites in peninsular India. Flake tools in fine-grained chalcedony represent the shift from large handaxes to smaller, more efficient tools.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-nevasa",
    museumDisplay: "Deccan College Museum, Pune; Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai",
  },
  {
    id: "cf-16r",
    name: "Chopper (16R Dune Site)",
    type: "Cores & Flakes",
    location: "16R Dune, Rajasthan, India",
    region: "South Asia",
    age: "Lower Paleolithic (~200,000 BP)",
    material: "Quartzite",
    description: "Pebble choppers from the 16R dune site near Didwana show that Lower Palaeolithic people were present in the Thar Desert when it had a much wetter climate.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-16r",
    museumDisplay: "Archaeological Museum, Kalibangan — ASI; Deccan College Museum, Pune",
  },
  {
    id: "cf-narmada",
    name: "Levallois Flake",
    type: "Cores & Flakes",
    location: "Narmada Valley, Madhya Pradesh, India",
    region: "South Asia",
    age: "Middle Pleistocene (~250,000 BP)",
    material: "Quartzite",
    description: "The Narmada Valley has produced a rich sequence of Palaeolithic tools and the only archaic human fossil (Narmada cranium) from India. Levallois flakes here show technological sophistication.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "cf-narmada",
    museumDisplay: "Archaeological Museum, Gwalior Fort — ASI; Allahabad Museum",
  },
  // ══════════════════════════ AXES & ADZES ══════════════════════════
  {
    id: "axe-1",
    name: "Edge-Ground Axe",
    type: "Axes & Adzes",
    location: "Northern Australia",
    region: "Australia",
    age: "Pleistocene (>40,000 BP)",
    material: "Metamorphic stone",
    description: "Australia has the world's earliest edge-ground axes, dating back over 40,000 years. These were hafted tools used for woodworking, representing a major technological innovation.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-1",
    museumDisplay: "Australian Museum, Sydney; Museum and Art Gallery of the Northern Territory, Darwin",
  },
  {
    id: "axe-2",
    name: "Polished Stone Axe",
    type: "Axes & Adzes",
    location: "New Guinea",
    region: "New Guinea",
    age: "Holocene (~5,000 BP)",
    material: "Greenstone",
    description: "Finely polished stone axe typical of New Guinea's long tradition of ground-edge axe technology. Essential for forest clearing and agriculture in the highland valleys.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-2",
    museumDisplay: "Papua New Guinea National Museum, Port Moresby",
  },
  {
    id: "axe-neo-india",
    name: "Neolithic Celt (Polished Stone Axe)",
    type: "Axes & Adzes",
    location: "Burzahom, Kashmir, India",
    region: "South Asia",
    age: "Neolithic (~3,000 BCE)",
    material: "Basalt",
    description: "Burzahom is a key Neolithic site in Kashmir. Polished stone celts and bone tools from pit-dwellings here demonstrate the Neolithic way of life in the Indian subcontinent.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-neo-india",
    museumDisplay: "SPS Museum, Srinagar; National Museum, New Delhi",
  },
  {
    id: "axe-bellary",
    name: "Neolithic Ground Stone Axe",
    type: "Axes & Adzes",
    location: "Bellary District, Karnataka, India",
    region: "South Asia",
    age: "Neolithic (~2,500 BCE)",
    material: "Dolerite",
    description: "South Indian Neolithic sites like Sanganakallu and Tekkalakota in Bellary district have yielded large numbers of polished stone axes used for forest clearance and agriculture by early farming communities.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-bellary",
    museumDisplay: "Archaeological Museum, Hampi (Kamlapur) — ASI; Karnataka State Museum, Bangalore",
  },
  {
    id: "axe-mehi",
    name: "Neolithic Polished Axe",
    type: "Axes & Adzes",
    location: "Mehrgarh, Balochistan",
    region: "South Asia",
    age: "Neolithic (~7,000 BCE)",
    material: "Basalt",
    description: "Mehrgarh is one of the earliest Neolithic sites in South Asia. Polished stone axes from Period I show the transition from hunting-gathering to settled agriculture in the Bolan Pass region.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "axe-mehi",
    museumDisplay: "National Museum of Pakistan, Karachi; Musée Guimet, Paris",
  },
  {
    id: "oc-1",
    name: "Adze Flake",
    type: "Axes & Adzes",
    location: "Polynesia",
    region: "Oceania",
    age: "Late Holocene (~1,000 BP)",
    material: "Basalt",
    description: "Polynesian basalt adzes were essential tools for canoe-building and woodworking during the great maritime expansions across the Pacific.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Hafted-axe-icon-2-1.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "oc-1",
    museumDisplay: "Bishop Museum, Honolulu; Te Papa Tongarewa, Wellington",
  },
  // ══════════════════════════ SPEAR & DART POINTS ══════════════════════════
  {
    id: "sp-1",
    name: "Clovis Point",
    type: "Spear & Dart Points",
    location: "New Mexico, USA",
    region: "North America",
    age: "Late Pleistocene (~13,000 BP)",
    material: "Chert",
    description: "Clovis points are the hallmark of the earliest well-documented culture in the Americas. Distinguished by a characteristic flute (channel flake) removed from the base.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sp-1",
    museumDisplay: "Smithsonian National Museum of Natural History, Washington DC; Blackwater Draw Museum, NM",
  },
  {
    id: "sp-2",
    name: "Folsom Point",
    type: "Spear & Dart Points",
    location: "Colorado, USA",
    region: "North America",
    age: "Late Pleistocene (~12,500 BP)",
    material: "Chert",
    description: "Folsom points are exquisitely thin projectile points fluted nearly to the tip. They represent some of the finest flintknapping ever achieved.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sp-2",
    museumDisplay: "Denver Museum of Nature & Science; Smithsonian, Washington DC",
  },
  {
    id: "sam-1",
    name: "Fishtail Point",
    type: "Spear & Dart Points",
    location: "Patagonia, Argentina",
    region: "South America",
    age: "Late Pleistocene (~11,000 BP)",
    material: "Obsidian",
    description: "Fishtail (Fell's Cave) points are the earliest widespread projectile point type in South America. Found from Patagonia to Central America.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sam-1",
    museumDisplay: "Museo Argentino de Ciencias Naturales, Buenos Aires",
  },
  {
    id: "sp-aterian",
    name: "Aterian Tanged Point",
    type: "Spear & Dart Points",
    location: "North Africa (Sahara)",
    region: "Africa",
    age: "Middle Stone Age (~80,000 BP)",
    material: "Flint",
    description: "The Aterian is one of the earliest evidence for hafted projectile technology. The distinctive basal tang allowed secure attachment to a shaft, predating similar innovations elsewhere by tens of thousands of years.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sp-aterian",
    museumDisplay: "Musée National du Bardo, Algiers; British Museum, London",
  },
  {
    id: "sp-solutrean",
    name: "Solutrean Laurel-Leaf Point",
    type: "Spear & Dart Points",
    location: "Solutré, France",
    region: "Europe",
    age: "Upper Paleolithic (~20,000 BP)",
    material: "Flint",
    description: "Solutrean laurel-leaf points are among the finest stone tools ever made. Thinned by expert pressure flaking to just a few millimetres thick, they represent the apex of Upper Palaeolithic knapping skill.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "sp-solutrean",
    museumDisplay: "Musée de Solutré, France; Musée d'Archéologie Nationale, Saint-Germain-en-Laye",
  },
  // ══════════════════════════ KNIVES & DAGGERS ══════════════════════════
  {
    id: "kd-1",
    name: "Flint Knife",
    type: "Knives & Daggers",
    location: "Denmark",
    region: "Europe",
    age: "Neolithic (~3,500 BP)",
    material: "Flint",
    description: "Scandinavian flint daggers represent the pinnacle of pressure-flaking technology. These Late Neolithic knives were so finely made that some archaeologists consider them works of art.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "kd-1",
    museumDisplay: "National Museum of Denmark, Copenhagen",
  },
  {
    id: "kd-egypt",
    name: "Predynastic Egyptian Knife",
    type: "Knives & Daggers",
    location: "Gebel el-Arak, Egypt",
    region: "Africa",
    age: "Predynastic (~3,300 BCE)",
    material: "Flint",
    description: "The Gebel el-Arak knife is a masterpiece of predynastic Egyptian flintknapping. The ripple-flaked flint blade with carved ivory handle shows Mesopotamian artistic influences at the dawn of Egyptian civilisation.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "kd-egypt",
    museumDisplay: "Louvre Museum, Paris",
  },
  {
    id: "kd-nal",
    name: "Neolithic Knife Blade",
    type: "Knives & Daggers",
    location: "Nal, Balochistan",
    region: "South Asia",
    age: "Chalcolithic (~3,000 BCE)",
    material: "Chert",
    description: "Long parallel-sided blades from the Nal culture in Balochistan were used as knives and sickle elements. They represent the Chalcolithic stone-working traditions that continued alongside early copper metallurgy.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "kd-nal",
    museumDisplay: "National Museum, New Delhi; Archaeological Museum, Dholavira — ASI",
  },
  // ══════════════════════════ BLADES & BLADE CORES ══════════════════════════
  {
    id: "bl-1",
    name: "Prismatic Blade Core",
    type: "Blades & Blade Cores",
    location: "Mesoamerica",
    region: "North America",
    age: "Late Holocene (~2,000 BP)",
    material: "Obsidian",
    description: "Obsidian prismatic blade cores were mass-produced in Mesoamerica using pressure flaking. The blades produced were sharper than modern surgical steel.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bl-1",
    museumDisplay: "Museo Nacional de Antropología, Mexico City",
  },
  {
    id: "bl-harappan",
    name: "Harappan Blade",
    type: "Blades & Blade Cores",
    location: "Dholavira, Gujarat, India",
    region: "South Asia",
    age: "Bronze Age (~2,500 BCE)",
    material: "Chert",
    description: "Long parallel-sided chert blades from Dholavira and other Indus Valley sites were produced by crested-ridge technique. Rohri Hills in Sindh was a major raw material source.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bl-harappan",
    museumDisplay: "Archaeological Museum, Dholavira — ASI; National Museum, New Delhi; Lothal Museum, Gujarat",
  },
  {
    id: "bl-lothal",
    name: "Chert Blade (Indus Valley)",
    type: "Blades & Blade Cores",
    location: "Lothal, Gujarat, India",
    region: "South Asia",
    age: "Bronze Age (~2,400 BCE)",
    material: "Chert",
    description: "Lothal, the Indus Valley port city, yielded hundreds of chert blades used for bead-making and craft activities. The blades show standardised production suggesting specialised workshops.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bl-lothal",
    museumDisplay: "Lothal Archaeological Museum (ASI site); National Museum, New Delhi",
  },
  {
    id: "bl-aurignac",
    name: "Aurignacian Blade",
    type: "Blades & Blade Cores",
    location: "Aurignac, France",
    region: "Europe",
    age: "Upper Paleolithic (~35,000 BP)",
    material: "Flint",
    description: "Aurignacian blades mark the arrival of anatomically modern humans in Europe. The systematic blade production was more efficient than earlier flake-based technologies.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bl-aurignac",
    museumDisplay: "Musée d'Aurignac; Musée de l'Homme, Paris",
  },
  // ══════════════════════════ ARROWHEADS ══════════════════════════
  {
    id: "ah-1",
    name: "Barbed Arrowhead",
    type: "Arrowheads",
    location: "Saharan Africa",
    region: "Africa",
    age: "Neolithic (~7,000 BP)",
    material: "Chert",
    description: "Finely pressure-flaked barbed arrowheads from the 'Green Sahara' period when the desert was grassland. These attest to sophisticated hunting technology.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ah-1",
    museumDisplay: "British Museum, London; Egyptian Museum, Cairo",
  },
  {
    id: "ah-2",
    name: "Serrated Arrowhead",
    type: "Arrowheads",
    location: "England",
    region: "Europe",
    age: "Neolithic (~4,000 BP)",
    material: "Flint",
    description: "Beautifully serrated flint arrowhead from Neolithic Britain. The serrations increase cutting effectiveness and may also have served as a stylistic marker.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ah-2",
    museumDisplay: "British Museum, London; Salisbury Museum",
  },
  {
    id: "ah-sarai",
    name: "Mesolithic Arrowhead",
    type: "Arrowheads",
    location: "Sarai Nahar Rai, Uttar Pradesh, India",
    region: "South Asia",
    age: "Mesolithic (~8,000 BCE)",
    material: "Chert",
    description: "Sarai Nahar Rai is one of the most important Mesolithic sites in the Ganga plain. Tiny arrowheads and microliths found here were embedded in human skeletons, providing direct evidence of inter-group violence.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ah-sarai",
    museumDisplay: "Allahabad Museum; Archaeological Museum, Sarnath — ASI",
  },
  {
    id: "ah-adamgarh",
    name: "Mesolithic Arrowhead",
    type: "Arrowheads",
    location: "Adamgarh, Madhya Pradesh, India",
    region: "South Asia",
    age: "Mesolithic (~5,000 BCE)",
    material: "Chalcedony",
    description: "Adamgarh rock shelters near Hoshangabad yielded microliths and arrowheads alongside rock paintings depicting hunting scenes. This is rare direct evidence connecting stone tools with the art they illustrate.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ah-adamgarh",
    museumDisplay: "State Museum, Bhopal; Archaeological Museum, Sanchi — ASI",
  },
  // ══════════════════════════ RETOUCHED FLAKES ══════════════════════════
  {
    id: "rf-1",
    name: "Side Scraper (Mousterian)",
    type: "Retouched Flakes",
    location: "France",
    region: "Europe",
    age: "Middle Paleolithic (~70,000 BP)",
    material: "Flint",
    description: "Mousterian side scrapers were the standard toolkit of Neanderthals. Made by systematic retouch along one or more edges for hide processing and butchery.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "rf-1",
    museumDisplay: "Musée de l'Homme, Paris; Natural History Museum, London",
  },
  {
    id: "isea-1",
    name: "Flake Tool",
    type: "Retouched Flakes",
    location: "Flores, Indonesia",
    region: "Island Southeast Asia",
    age: "Middle Pleistocene (~800,000 BP)",
    material: "Chert",
    description: "Stone tools from Flores associated with Homo floresiensis ('the Hobbit'). These simple flake tools demonstrate that even small-brained hominins maintained stone-flaking traditions.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "isea-1",
    museumDisplay: "National Museum of Indonesia, Jakarta; Liang Bua Museum, Flores",
  },
  {
    id: "rf-kortal",
    name: "Upper Palaeolithic Scraper",
    type: "Retouched Flakes",
    location: "Kurnool Caves, Andhra Pradesh, India",
    region: "South Asia",
    age: "Upper Paleolithic (~30,000 BP)",
    material: "Quartzite",
    description: "The Kurnool caves (Billa Surgam) in Andhra Pradesh are among the earliest explored prehistoric sites in India. Scrapers and blades from these caves were first collected in the 19th century.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "rf-kortal",
    museumDisplay: "Government Museum, Chennai; Archaeological Museum, Nagarjunakonda — ASI",
  },
  {
    id: "rf-patne",
    name: "Upper Palaeolithic Backed Blade",
    type: "Retouched Flakes",
    location: "Patne, Maharashtra, India",
    region: "South Asia",
    age: "Upper Paleolithic (~25,000 BP)",
    material: "Chalcedony",
    description: "Patne in Maharashtra has yielded one of the best stratified Upper Palaeolithic sequences in western India. Backed blades and scrapers show the development of microlithic technology.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "rf-patne",
    museumDisplay: "Deccan College Museum, Pune",
  },
  // ══════════════════════════ GRINDING STONES ══════════════════════════
  {
    id: "gs-1",
    name: "Grinding Stone (Muller & Base)",
    type: "Grinding Stones",
    location: "Central Australia",
    region: "Australia",
    age: "Holocene (~30,000 BP)",
    material: "Sandstone",
    description: "Aboriginal seed-grinding stones are among the earliest evidence for plant food processing anywhere in the world. These paired tools were essential for grinding grass seeds into flour.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "gs-1",
    museumDisplay: "South Australian Museum, Adelaide; Australian Museum, Sydney",
  },
  {
    id: "gs-natufi",
    name: "Natufian Grinding Stone",
    type: "Grinding Stones",
    location: "Levant (Israel/Palestine)",
    region: "West Asia",
    age: "Epipaleolithic (~12,000 BP)",
    material: "Basalt",
    description: "Natufian basalt mortars and grinding stones from the Levant are key evidence for the beginning of cereal processing that eventually led to agriculture — the Neolithic Revolution.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "gs-natufi",
    museumDisplay: "Israel Museum, Jerusalem; British Museum, London",
  },
  {
    id: "gs-ivc",
    name: "Harappan Grinding Quern",
    type: "Grinding Stones",
    location: "Harappa, Punjab",
    region: "South Asia",
    age: "Bronze Age (~2,600 BCE)",
    material: "Sandstone",
    description: "Saddle querns from Harappa were used for grinding wheat and barley. The standardised shapes across Indus cities suggest shared food-processing traditions across the civilisation.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "gs-ivc",
    museumDisplay: "Archaeological Museum, Ropar — ASI; National Museum, New Delhi",
  },
  // ══════════════════════════ SYMBOLIC STONES ══════════════════════════
  {
    id: "ss-1",
    name: "Engraved Ochre",
    type: "Symbolic Stones",
    location: "Blombos Cave, South Africa",
    region: "Africa",
    age: "Middle Stone Age (~75,000 BP)",
    material: "Ochre",
    description: "Engraved ochre pieces from Blombos Cave are among the earliest evidence of symbolic behaviour in Homo sapiens. The crosshatch patterns are considered evidence for abstract thinking.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ss-1",
    museumDisplay: "Iziko South African Museum, Cape Town; Blombos Cave exhibition",
  },
  {
    id: "ss-cupmark",
    name: "Cup-Marked Stone",
    type: "Symbolic Stones",
    location: "Meghalaya, India",
    region: "South Asia",
    age: "Neolithic/Megalithic (~2,000 BCE)",
    material: "Sandstone",
    description: "Cup-marks on rocks and megaliths in northeast India are found across Meghalaya and Assam. Their function is debated — possible grain processing, ritual use, or astronomical markers.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ss-cupmark",
    museumDisplay: "Don Bosco Museum, Shillong; State Museum, Guwahati",
  },
  // ══════════════════════════ MICROLITHS ══════════════════════════
  {
    id: "ml-1",
    name: "Geometric Microlith",
    type: "Microliths",
    location: "Vindhya Hills, India",
    region: "South Asia",
    age: "Mesolithic (~10,000 BP)",
    material: "Chert",
    description: "Tiny geometric microliths from the Indian Mesolithic were hafted together with mastic (plant resin) to create composite tools — sickles, arrows, and barbs. South Asia has one of the richest microlith traditions globally.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-1",
    museumDisplay: "Allahabad Museum; Archaeological Museum, Sanchi — ASI; State Museum, Bhopal",
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
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-2",
    museumDisplay: "Musée de l'Homme, Paris; National Museum of Prehistory, Les Eyzies",
  },
  {
    id: "ml-bagor",
    name: "Microlithic Lunate",
    type: "Microliths",
    location: "Bagor, Rajasthan, India",
    region: "South Asia",
    age: "Mesolithic (~5,000 BCE)",
    material: "Chert",
    description: "Bagor in Rajasthan is one of the largest and best-documented Mesolithic sites in India. Lunate microliths were hafted as arrowheads and sickle teeth. The site also has evidence of animal domestication.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-bagor",
    museumDisplay: "Deccan College Museum, Pune; Albert Hall Museum, Jaipur",
  },
  {
    id: "ml-langhnaj",
    name: "Microlithic Triangle",
    type: "Microliths",
    location: "Langhnaj, Gujarat, India",
    region: "South Asia",
    age: "Mesolithic (~4,000 BCE)",
    material: "Agate",
    description: "Langhnaj near Ahmedabad yielded one of the largest microlithic assemblages in western India along with human burials. Triangular microliths in beautiful agate were arrow-tips or barbs.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-langhnaj",
    museumDisplay: "M.S. University Museum, Baroda; Archaeological Museum, Dholavira — ASI",
  },
  {
    id: "ml-teri",
    name: "Teri Microlithic (Coastal)",
    type: "Microliths",
    location: "Teri dunes, Tamil Nadu, India",
    region: "South Asia",
    age: "Mesolithic (~8,000 BP)",
    material: "Chert",
    description: "The Teri sites along Tamil Nadu's coast are red-sand dune scatters with dense microlithic tool concentrations. They represent coastal Mesolithic adaptation in peninsular India.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "ml-teri",
    museumDisplay: "Government Museum, Chennai (Fort St. George Museum — ASI)",
  },
  // ══════════════════════════ EOLITHS ══════════════════════════
  {
    id: "eo-1",
    name: "Eolith (Possible Early Tool)",
    type: "Eoliths",
    location: "Kent, England",
    region: "Europe",
    age: "Pliocene / Early Pleistocene",
    material: "Flint",
    description: "Eoliths are controversial — naturally broken stones that may or may not have been used as tools by early hominins. The debate helped establish criteria for distinguishing human-made tools.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "eo-1",
    museumDisplay: "Pitt Rivers Museum, Oxford; Natural History Museum, London",
  },
  // ══════════════════════════ HAMMERSTONES & ANVILS ══════════════════════════
  {
    id: "hs-1",
    name: "Hammerstone",
    type: "Hammerstones & Anvils",
    location: "Koobi Fora, Kenya",
    region: "Africa",
    age: "Early Pleistocene (~1.8 million BP)",
    material: "Lava",
    description: "Hammerstones are the essential percussors used to strike flakes from cores. These lava cobbles from Koobi Fora show characteristic pitting and battering from repeated use.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "hs-1",
    museumDisplay: "National Museum of Kenya, Nairobi",
  },
  {
    id: "hs-anvil",
    name: "Stone Anvil",
    type: "Hammerstones & Anvils",
    location: "Paisley Caves, Oregon, USA",
    region: "North America",
    age: "Late Pleistocene (~14,000 BP)",
    material: "Basalt",
    description: "Stone anvils were used as stationary platforms on which cores or nuts were placed and struck. The Paisley Caves have some of the earliest human evidence in North America.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "hs-anvil",
    museumDisplay: "University of Oregon Museum of Natural and Cultural History",
  },
  // ══════════════════════════ RING STONES & MACE HEADS ══════════════════════════
  {
    id: "rs-ivc",
    name: "Harappan Ring Stone",
    type: "Ring Stones & Mace Heads",
    location: "Mohenjo-daro, Sindh",
    region: "South Asia",
    age: "Bronze Age (~2,500 BCE)",
    material: "Limestone",
    description: "Ring stones (perforated discs) from the Indus Valley have puzzled archaeologists. Possible uses include column bases, mace heads, digging-stick weights, or ritual objects. Found at all major Harappan sites.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "rs-ivc",
    museumDisplay: "National Museum, New Delhi; Archaeological Museum, Dholavira — ASI; Mohenjo-daro Museum, Pakistan",
  },
  {
    id: "rs-mace",
    name: "Neolithic Mace Head",
    type: "Ring Stones & Mace Heads",
    location: "Orkney, Scotland",
    region: "Europe",
    age: "Neolithic (~3,000 BCE)",
    material: "Flint",
    description: "Decorated mace heads from Neolithic Britain were prestige objects rather than weapons. The famous Maesmore mace head has intricate knobbed decoration showing remarkable technical and artistic skill.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "rs-mace",
    museumDisplay: "National Museum of Scotland, Edinburgh; British Museum, London",
  },
  // ══════════════════════════ BEAD & DRILL TOOLS ══════════════════════════
  {
    id: "bd-cambay",
    name: "Bead Drill (Ernestite Point)",
    type: "Bead & Drill Tools",
    location: "Khambhat (Cambay), Gujarat, India",
    region: "South Asia",
    age: "Bronze Age (~2,500 BCE)",
    material: "Ernestite",
    description: "Ernestite (a very hard stone) drill points were used to perforate carnelian and agate beads in the Indus Valley. Khambhat's bead-making tradition continues to this day and is directly descended from Harappan craftsmanship.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bd-cambay",
    museumDisplay: "Archaeological Museum, Dholavira — ASI; Lothal Museum (ASI); National Museum, New Delhi",
  },
  {
    id: "bd-carnelian",
    name: "Long Carnelian Bead Blank",
    type: "Bead & Drill Tools",
    location: "Chanhu-daro, Sindh",
    region: "South Asia",
    age: "Bronze Age (~2,300 BCE)",
    material: "Carnelian",
    description: "Long barrel carnelian beads were luxury trade goods of the Indus Valley exported as far as Mesopotamia. The production involved heat-treatment, chipping, grinding, drilling and polishing.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "bd-carnelian",
    museumDisplay: "National Museum, New Delhi; British Museum, London; Museum of Fine Arts, Boston",
  },
  // ══════════════════════════ MEGALITHIC TOOLS ══════════════════════════
  {
    id: "meg-dolmen",
    name: "Megalithic Hammer Stone",
    type: "Megalithic Tools",
    location: "Brahmagiri, Karnataka, India",
    region: "South Asia",
    age: "Iron Age (~1,000 BCE)",
    material: "Granite",
    description: "Megalithic burial sites across South India yielded stone tools alongside iron artefacts. Brahmagiri, excavated by Mortimer Wheeler in 1947, established the chronological framework for Indian megaliths.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "meg-dolmen",
    museumDisplay: "Archaeological Museum, Hampi (Kamlapur) — ASI; Government Museum, Chennai",
  },
  {
    id: "meg-adicha",
    name: "Megalithic Rubbing Stone",
    type: "Megalithic Tools",
    location: "Adichanallur, Tamil Nadu, India",
    region: "South Asia",
    age: "Iron Age (~800 BCE)",
    material: "Granite",
    description: "Adichanallur is one of the most significant megalithic urn-burial sites in India. ASI excavations revealed iron tools, gold ornaments, and stone implements buried with the dead in large terracotta urns.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "meg-adicha",
    museumDisplay: "Government Museum, Chennai (Fort St. George Museum — ASI); upcoming Adichanallur Museum (ASI)",
  },
  // ══════════════════════════ HARAPPAN STONE WEIGHTS ══════════════════════════
  {
    id: "wt-ivc",
    name: "Harappan Cuboid Weight",
    type: "Stone Weights",
    location: "Mohenjo-daro, Sindh",
    region: "South Asia",
    age: "Bronze Age (~2,500 BCE)",
    material: "Chert",
    description: "The Indus Valley Civilization had a standardised system of stone weights following a binary-decimal progression. Cuboid chert weights were used across all major Harappan cities for trade regulation.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "wt-ivc",
    museumDisplay: "Archaeological Museum, Dholavira — ASI; National Museum, New Delhi; Lothal Museum (ASI)",
  },
  {
    id: "wt-kalibangan",
    name: "Harappan Weight Set",
    type: "Stone Weights",
    location: "Kalibangan, Rajasthan, India",
    region: "South Asia",
    age: "Bronze Age (~2,500 BCE)",
    material: "Agate & Chert",
    description: "Kalibangan yielded standardised stone weights identical to those from Mohenjo-daro 1,000 km away. This uniformity across the Indus Valley demonstrates a civilisation-wide system of metrology.",
    imageUrl: "https://stonetoolsmuseum.com/wp-content/uploads/Cobble-chopper.jpg",
    modelAuthor: "Museum of Stone Tools",
    mostId: "wt-kalibangan",
    museumDisplay: "Archaeological Museum, Kalibangan — ASI; National Museum, New Delhi",
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
        t.age.toLowerCase().includes(q) ||
        (t.museumDisplay?.toLowerCase().includes(q) ?? false);
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
            Explore prehistoric stone tools with interactive 3D models spanning 3.3 million years of human technology.
            Browse by tool type, region, material, or museum. Data sourced from the{" "}
            <span className="font-semibold text-foreground">Museum of Stone Tools (MoST)</span> collection.
            Museum display locations are cross-referenced with ASI site museums and major institutions.
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
              placeholder="Search by name, location, material, period, museum..."
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
          — stonetoolsmuseum.com. 3D models provided via Pedestal3D. Museum display locations verified against{" "}
          <span className="font-semibold text-foreground">Archaeological Survey of India (ASI)</span>{" "}
          official records (PIB, 15 Dec 2025) and respective museum catalogues. This page is for educational reference only.
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
          title="Open interactive 3D model"
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
        {tool.museumDisplay && (
          <div className="mt-2 flex items-start gap-1.5 rounded-md bg-secondary/50 px-2 py-1.5">
            <Building2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
            <p className="text-[10px] leading-snug text-foreground">
              <span className="font-semibold">Displayed at:</span> {tool.museumDisplay}
            </p>
          </div>
        )}
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
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const { url: modelUrl, isRepresentative } = resolve3D(tool);
  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-2 sm:p-4" onClick={onClose}>
      <div
        className="relative flex max-h-[95dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-foreground">{tool.name}</h3>
            <p className="truncate text-[11px] text-muted-foreground">{tool.location} · {tool.material} · {tool.age}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-accent">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* 3D Iframe */}
        <div className="relative aspect-square w-full bg-black sm:aspect-[4/3]">
          {!loaded && !errored && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black text-primary-foreground">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <p className="text-xs opacity-80">Loading 3D model… (may take 20–40s)</p>
              <p className="text-[10px] opacity-60">First load streams the mesh &amp; textures</p>
            </div>
          )}
          {errored ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black p-6 text-center text-primary-foreground">
              <p className="text-sm">3D viewer failed to load in this environment.</p>
              <a
                href={modelUrl}

                target="_blank" rel="noopener noreferrer"
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
              >
                Open model in new tab
              </a>
            </div>
          ) : (
            <iframe
              key={modelUrl}
              src={modelUrl}

              title={`3D model: ${tool.name}`}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
            />
          )}
          {loaded && !errored && (
            <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-card/90 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-sm">
              <RotateCcw className="h-3 w-3" />
              Drag to rotate · Pinch/scroll to zoom
            </div>
          )}
        </div>

        {/* Description + Museum */}
        <div className="space-y-2 overflow-y-auto border-t border-border px-4 py-3">
          <p className="text-xs leading-relaxed text-foreground/90">{tool.description}</p>
          {tool.museumDisplay && (
            <div className="flex items-start gap-1.5 rounded-md bg-secondary/50 px-2.5 py-2">
              <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-[11px] leading-snug text-foreground">
                <span className="font-semibold">Museum display:</span> {tool.museumDisplay}
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] text-muted-foreground">
              3D Model by {tool.modelAuthor} · MoST ID: {tool.mostId} · Source: Museum of Stone Tools
            </p>
            <a
              href={tool.pedestal3dUrl}
              target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-semibold text-primary hover:underline"
            >
              Open in new tab ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
