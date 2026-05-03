import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Landmark, MapPin, ExternalLink, Globe, Search, Filter, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/museums")({
  head: () => ({
    meta: [
      { title: "Archaeological Museums — ArchaeoLens" },
      {
        name: "description",
        content:
          "Comprehensive directory of all 52 ASI site museums, state archaeological museums across India, and international museums housing Indian archaeological collections.",
      },
      { property: "og:title", content: "Archaeological Museums — ArchaeoLens" },
      {
        property: "og:description",
        content:
          "Explore all 52 ASI site museums, state-wise museums, and foreign museums with Indian archaeological objects.",
      },
    ],
  }),
  component: MuseumsPage,
});

type Museum = {
  name: string;
  location: string;
  state: string;
  url: string;
  highlights: string;
  keyObjects: string;
  focus: string;
};

/* ─── All 52 ASI Site Museums (Source: PIB, Ministry of Culture, 15 Dec 2025) ─── */
const asiMuseums: Museum[] = [
  // Andhra Pradesh
  {
    name: "Archaeological Museum, Amaravati",
    location: "Amaravati, Andhra Pradesh",
    state: "Andhra Pradesh",
    url: "https://asi.nic.in/museum-amaravathi/",
    highlights: "Limestone narrative panels from the Great Stupa, Satavahana-period Buddhist art.",
    keyObjects: "Amaravati Marbles, Dharmachakra panels, Buddhist narrative reliefs, Satavahana inscriptions",
    focus: "Buddhist Art",
  },
  {
    name: "Archaeological Museum, Chandragiri",
    location: "Chandragiri, Andhra Pradesh",
    state: "Andhra Pradesh",
    url: "https://asi.nic.in/museum-chandragiri/",
    highlights: "Vijayanagara bronze images, weapons, sculptures from the fort complex.",
    keyObjects: "Vijayanagara bronzes, royal weapons, stone sculptures, Chandragiri Fort artifacts",
    focus: "Vijayanagara Period",
  },
  {
    name: "Archaeological Museum, Nagarjunakonda",
    location: "Nagarjunakonda, Andhra Pradesh",
    state: "Andhra Pradesh",
    url: "https://asi.nic.in/museum-nagarjunakonda/",
    highlights: "Ikshvaku-period Buddhist sculptures, inscriptions, and prehistoric tools from the Krishna Valley.",
    keyObjects: "Standing Buddha (3rd century CE), Ikshvaku inscriptions, megalithic iron tools, Roman coins",
    focus: "Buddhist & Ikshvaku",
  },
  // Assam
  {
    name: "Sri Surya Pahar Museum",
    location: "Goalpara, Assam",
    state: "Assam",
    url: "https://asi.nic.in/",
    highlights: "Rock-cut Shiva lingas, Buddhist and Jain remains from the tri-religious site.",
    keyObjects: "Rock-cut Shiva lingas (99,999 claimed), Buddhist stupas, Jain carvings, stone sculptures",
    focus: "Multi-faith Heritage",
  },
  // Bihar
  {
    name: "Archaeological Museum, Bodhgaya",
    location: "Bodhgaya, Bihar",
    state: "Bihar",
    url: "https://asi.nic.in/museum-bodhgaya/",
    highlights: "Buddhist sculptures, votive stupas, Hindu and Jain images from Mahabodhi complex.",
    keyObjects: "Pala-period Buddha images, votive stupas, Brahmi inscriptions, terracotta plaques",
    focus: "Buddhist Heritage",
  },
  {
    name: "Archaeological Museum, Nalanda",
    location: "Nalanda, Bihar",
    state: "Bihar",
    url: "https://asi.nic.in/museum-nalanda/",
    highlights: "Buddhist bronzes, terracottas, inscribed seals from Nalanda Mahavihara.",
    keyObjects: "Bronze Tara, inscribed copper-plate seals, stucco heads, terracotta plaques, manuscripts",
    focus: "Buddhist Monastic",
  },
  {
    name: "Archaeological Museum, Vaishali",
    location: "Vaishali, Bihar",
    state: "Bihar",
    url: "https://asi.nic.in/museum-vaishali/",
    highlights: "Terracottas, pottery, punch-marked coins, antiquities from Kolhua excavations.",
    keyObjects: "Ashokan relic casket, terracotta figurines, NBPW pottery, punch-marked coins",
    focus: "Mauryan Period",
  },
  {
    name: "Archaeological Museum, Vikramshila",
    location: "Antichak, Bihar",
    state: "Bihar",
    url: "https://asi.nic.in/",
    highlights: "Pala-period Buddhist monastery antiquities, bronze images, terracotta plaques.",
    keyObjects: "Pala bronze Buddhas, terracotta plaques, stone sculptures, inscribed seals, votive stupas",
    focus: "Pala Buddhist",
  },
  // Delhi
  {
    name: "Archaeological Museum, Purana Qila",
    location: "New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/museum-puranaqila/",
    highlights: "Painted Grey Ware, Maurya-Shunga terracottas, and medieval antiquities from the Purana Qila site.",
    keyObjects: "Painted Grey Ware (1000 BCE), Mauryan terracottas, Shunga figurines, medieval pottery",
    focus: "Painted Grey Ware Culture",
  },
  {
    name: "Gallery of Confiscated & Retrieved Antiquities, Purana Qila",
    location: "New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "Seized smuggled antiquities returned to India — sculptures, coins, manuscripts.",
    keyObjects: "Recovered stolen sculptures, seized terracottas, confiscated bronze images, repatriated artifacts",
    focus: "Heritage Repatriation",
  },
  {
    name: "1857 — India's First War of Independence Museum",
    location: "Red Fort, New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "Weapons, documents, paintings depicting the 1857 uprising.",
    keyObjects: "Rebel weapons, lithographs of 1857, Mughal court documents, battle paintings",
    focus: "1857 Revolt",
  },
  {
    name: "Yaad-e-Jallian Museum",
    location: "Red Fort, New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "Memorial museum dedicated to the Jallianwala Bagh massacre of 1919.",
    keyObjects: "Photographic records, massacre eyewitness testimonials, colonial-era documents",
    focus: "Freedom Struggle",
  },
  {
    name: "Netaji Subhas Chandra Bose & INA Museum",
    location: "Red Fort, New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "INA memorabilia, Netaji's personal effects, World War II-era artifacts.",
    keyObjects: "Netaji's uniform, INA flags, war medals, photographs, personal letters",
    focus: "INA & Freedom Movement",
  },
  {
    name: "Azaadi-ke-Diwane Museum",
    location: "Red Fort, New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "Tribute to unsung freedom fighters of India's independence movement.",
    keyObjects: "Freedom fighter portraits, revolutionary weapons, historical documents, personal artifacts",
    focus: "Freedom Struggle",
  },
  {
    name: "Humayun's Tomb World Heritage Site Museum",
    location: "New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "Mughal-period artifacts from the Humayun's Tomb complex restoration.",
    keyObjects: "Mughal tiles, carved sandstone fragments, period ceramics, calligraphic panels",
    focus: "Mughal Architecture",
  },
  {
    name: "Archaeological Site Museum, Red Fort",
    location: "Red Fort, New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/museum-red-fort/",
    highlights: "Mughal-period artifacts, arms, textiles, manuscripts, calligraphy.",
    keyObjects: "Mughal arms & armour, royal textiles, farmans (edicts), calligraphy panels, court costumes",
    focus: "Mughal Period",
  },
  {
    name: "Indian War Memorial Museum, Red Fort",
    location: "Red Fort, New Delhi",
    state: "Delhi",
    url: "https://asi.nic.in/",
    highlights: "Arms, armour, and military history from medieval to modern India.",
    keyObjects: "Medieval swords, Mughal daggers, cannon balls, war drums, military paintings",
    focus: "Military History",
  },
  // Goa
  {
    name: "Archaeological Museum, Velha Goa",
    location: "Old Goa, Goa",
    state: "Goa",
    url: "https://asi.nic.in/museum-goa/",
    highlights: "Portuguese-period antiquities, hero stones, sati stones, Hindu and Jain sculptures.",
    keyObjects: "Portuguese-era portraits, hero stones, sati stones, Hindu-Jain sculptures, colonial woodwork",
    focus: "Portuguese Colonial",
  },
  // Gujarat
  {
    name: "Archaeological Museum, Dholavira",
    location: "Dholavira, Gujarat",
    state: "Gujarat",
    url: "https://asi.nic.in/",
    highlights: "Indus Valley Civilization — Dholavira Signboard, seals, beads, water-harvesting system artifacts.",
    keyObjects: "Dholavira Signboard (10 large Harappan signs), seals, bead workshop remains, polished stone",
    focus: "Indus Valley Civilization",
  },
  // Haryana
  {
    name: "Archaeological Museum, Sheikh Chilli's Tomb",
    location: "Thanesar, Haryana",
    state: "Haryana",
    url: "https://asi.nic.in/",
    highlights: "Sculptures, inscriptions, and antiquities from the Kurukshetra region.",
    keyObjects: "Kushan sculptures, Gupta terracottas, medieval inscriptions, Mughal-period ceramics",
    focus: "Kushan-Gupta Heritage",
  },
  // Himachal Pradesh
  {
    name: "Archaeological Museum, Kangra Fort",
    location: "Kangra, Himachal Pradesh",
    state: "Himachal Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Kangra miniature paintings, sculptures, and antiquities from one of India's oldest forts.",
    keyObjects: "Kangra miniature paintings, Guler school art, stone sculptures, medieval coins, arms",
    focus: "Kangra Art & Fort Heritage",
  },
  // Karnataka
  {
    name: "Archaeological Museum, Halebidu",
    location: "Halebidu, Karnataka",
    state: "Karnataka",
    url: "https://asi.nic.in/museum-halebidu/",
    highlights: "Hoysala-period sculptures, temple carvings, inscriptions.",
    keyObjects: "Hoysala Nandi, bracket figures, soapstone carvings, Jain images, hero stones",
    focus: "Hoysala Sculpture",
  },
  {
    name: "Tipu Sultan Museum, Srirangapatnam",
    location: "Srirangapatnam, Karnataka",
    state: "Karnataka",
    url: "https://asi.nic.in/",
    highlights: "Tipu Sultan's personal effects, weapons, coins, paintings from the Daria Daulat Bagh.",
    keyObjects: "Tipu's sword, gold coins, murals of Mysore wars, French-made muskets, royal costumes",
    focus: "Tipu Sultan Period",
  },
  {
    name: "Archaeological Museum, Hampi (Kamlapur)",
    location: "Hampi, Karnataka",
    state: "Karnataka",
    url: "https://asi.nic.in/museum-hampi/",
    highlights: "Vijayanagara-period sculptures, hero stones, Hoysala and Chalukya antiquities.",
    keyObjects: "Vijayanagara stone sculptures, hero stones, Yali figures, Nandi statues, Chalukya inscriptions",
    focus: "Vijayanagara Empire",
  },
  {
    name: "Archaeological Museum, Aihole",
    location: "Aihole, Karnataka",
    state: "Karnataka",
    url: "https://asi.nic.in/museum-aihole/",
    highlights: "Early Chalukya sculptures, inscriptions, architectural members.",
    keyObjects: "Chalukya Vishnu panels, Ravana Phadi carvings, architectural fragments, Chalukya inscriptions",
    focus: "Early Chalukya",
  },
  {
    name: "Archaeological Museum, Badami",
    location: "Badami, Karnataka",
    state: "Karnataka",
    url: "https://asi.nic.in/",
    highlights: "Chalukya cave-temple sculptures, inscriptions, and hero stones.",
    keyObjects: "Chalukya Nataraja, Varaha panel, hero stones, Badami Chalukya inscriptions, Lajja Gauri",
    focus: "Chalukya Cave Art",
  },
  {
    name: "Archaeological Museum, Bijapur",
    location: "Bijapur (Vijayapura), Karnataka",
    state: "Karnataka",
    url: "https://asi.nic.in/",
    highlights: "Adil Shahi dynasty artifacts, weapons, carpets, manuscripts, Deccani paintings.",
    keyObjects: "Adil Shahi arms, Deccani miniatures, Persian manuscripts, medieval carpets, coins",
    focus: "Deccan Sultanate",
  },
  // Kerala
  {
    name: "Mattancherry Palace Museum (Dutch Palace)",
    location: "Kochi, Kerala",
    state: "Kerala",
    url: "https://asi.nic.in/",
    highlights: "Kerala murals depicting Ramayana and Puranic scenes, royal regalia of Cochin Rajas.",
    keyObjects: "Ramayana murals, Palanquin of Cochin Rajas, royal costumes, Vishnu murals, Shiva panels",
    focus: "Kerala Murals",
  },
  // Madhya Pradesh
  {
    name: "Archaeological Museum, Chanderi",
    location: "Chanderi, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Jain and Hindu sculptures, Bundela-period artifacts, medieval inscriptions.",
    keyObjects: "Jain Tirthankaras, Hindu Devi sculptures, Bundela coins, medieval inscriptions, terracottas",
    focus: "Jain Heritage",
  },
  {
    name: "Archaeological Museum, Gwalior Fort",
    location: "Gwalior, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Sculptures from 1st century BCE to 17th century CE, including the famous Shalabhanjika.",
    keyObjects: "Shalabhanjika (Gyaraspur), Yakshi, Vishnu sculptures, Gupta-period inscriptions, Jain images",
    focus: "Classical Indian Sculpture",
  },
  {
    name: "Archaeological Museum, Sanchi",
    location: "Sanchi, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "https://asi.nic.in/museum-sanchi/",
    highlights: "Buddhist relics, Ashokan inscriptions, stupa railing sculptures, terracotta.",
    keyObjects: "Ashoka Lion Capital, stupa railing panels, Buddhist reliquaries, terracotta figures, yakshi",
    focus: "Buddhist Stupa Art",
  },
  {
    name: "Archaeological Museum, Shivpuri",
    location: "Shivpuri, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Stone sculptures, inscriptions, and coins from the Gwalior-Chambal region.",
    keyObjects: "Stone sculptures, Scindian-period artifacts, regional inscriptions, medieval coins",
    focus: "Regional Heritage",
  },
  {
    name: "Archaeological Museum, Khajuraho",
    location: "Khajuraho, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "https://asi.nic.in/museum-khajuraho/",
    highlights: "Chandela-period sculptures, Jain bronzes, temple architectural fragments.",
    keyObjects: "Dancing Ganesha, Chandela erotic sculptures, Jain Tirthankaras, Vishnu Chaturbhuja, apsaras",
    focus: "Chandela Temple Art",
  },
  // Maharashtra
  {
    name: "Museum on Mahatma Gandhi, Aga Khan Palace",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    url: "https://asi.nic.in/",
    highlights: "Gandhiji's personal effects, photographs, and memorabilia from his detention at Aga Khan Palace.",
    keyObjects: "Gandhi's spinning wheel (charkha), personal letters, Kasturba Gandhi's saree, photographs",
    focus: "Freedom Movement",
  },
  // Odisha
  {
    name: "Archaeological Museum, Konark",
    location: "Konark, Odisha",
    state: "Odisha",
    url: "https://asi.nic.in/museum-konark/",
    highlights: "Stone sculptures from the Sun Temple, architectural fragments, inscriptions.",
    keyObjects: "Surya images, erotic panels, Gajasimha, war-horse sculptures, Navagraha panels",
    focus: "Sun Temple Sculpture",
  },
  {
    name: "Archaeological Museum, Ratnagiri",
    location: "Ratnagiri, Odisha",
    state: "Odisha",
    url: "https://asi.nic.in/museum-ratnagiri/",
    highlights: "Buddhist monastic art, carved door jambs, votive stupas, inscriptions.",
    keyObjects: "Ornate doorjambs with Tara & Avalokiteshvara, votive stupas, Pala bronzes, terracotta seals",
    focus: "Esoteric Buddhism",
  },
  {
    name: "Archaeological Museum, Lalitagiri",
    location: "Lalitagiri, Odisha",
    state: "Odisha",
    url: "https://asi.nic.in/",
    highlights: "Earliest Buddhist relics in Odisha — caskets, sculptures, and monastic remains.",
    keyObjects: "Stone relic casket with bone fragments, steatite casket, Buddha images, Bodhisattva sculptures",
    focus: "Early Buddhism",
  },
  // Punjab
  {
    name: "Archaeological Museum, Ropar (Rupnagar)",
    location: "Rupnagar, Punjab",
    state: "Punjab",
    url: "https://asi.nic.in/",
    highlights: "Indus Valley & post-Harappan antiquities from one of the first IVC sites excavated after 1947.",
    keyObjects: "Harappan terracotta cakes, beads, PGW pottery, human-dog burial remains, copper tools",
    focus: "Indus Valley Civilization",
  },
  // Rajasthan
  {
    name: "Archaeological Museum, Kalibangan",
    location: "Kalibangan, Rajasthan",
    state: "Rajasthan",
    url: "https://asi.nic.in/",
    highlights: "Pre-Harappan and Harappan civilization artifacts from the Kalibangan excavations.",
    keyObjects: "World's earliest ploughed field evidence, fire altars, Harappan seals, terracotta cakes, pottery",
    focus: "Pre-Harappan & Harappan",
  },
  {
    name: "Deeg Palace Museum",
    location: "Deeg, Rajasthan",
    state: "Rajasthan",
    url: "https://asi.nic.in/",
    highlights: "Jat ruler Suraj Mal's palace with period furniture, paintings, and water-garden artifacts.",
    keyObjects: "Mughal chandeliers, marble furniture, period paintings, fountains, royal armoury",
    focus: "Jat Dynasty",
  },
  // Tamil Nadu
  {
    name: "Fort St. George Museum",
    location: "Fort St. George, Chennai",
    state: "Tamil Nadu",
    url: "https://asi.nic.in/museum-fort-st-george/",
    highlights: "Colonial-era portraits, arms, coins, uniforms, East India Company memorabilia.",
    keyObjects: "Cornwallis sword, EIC charters, colonial uniforms, French & British cannons, period portraits",
    focus: "Colonial Heritage",
  },
  // Telangana
  {
    name: "Archaeological Museum, Kondapur",
    location: "Kondapur, Telangana",
    state: "Telangana",
    url: "https://asi.nic.in/",
    highlights: "Satavahana-period beads, coins, terracotta, and Roman trade artifacts.",
    keyObjects: "Satavahana coins, Roman amphorae fragments, bead-polishing tools, terracotta figurines",
    focus: "Satavahana Trade",
  },
  // Uttar Pradesh
  {
    name: "Archaeological Museum, Taj Mahal",
    location: "Agra, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Mughal miniature paintings, plans of the Taj, Shah Jahan-era coins, calligraphic panels.",
    keyObjects: "Mughal miniature paintings, Taj architectural plans, Shah Jahan gold coins, jade artifacts",
    focus: "Mughal Architecture",
  },
  {
    name: "Archaeological Museum, Fatehpur Sikri",
    location: "Fatehpur Sikri, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Akbar-period stone carvings, coins, pottery, and architectural fragments.",
    keyObjects: "Akbar-period pillars, Mughal coins, carved jharokhas, glazed tiles, sandstone brackets",
    focus: "Akbar Period",
  },
  {
    name: "Archaeological Museum, Sarnath",
    location: "Sarnath, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://asi.nic.in/museum-sarnath/",
    highlights: "Ashoka Lion Capital (national emblem), Buddhist sculptures, Gupta-period art, Mauryan polished stone.",
    keyObjects: "Ashoka Lion Capital (national emblem), Dharmarajika stupa railing, Gupta Buddha, Bodhisattva heads",
    focus: "Buddhist Art & Mauryan",
  },
  {
    name: "Virtual Experiential Museum (VEM), Man Mahal, Varanasi",
    location: "Varanasi, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Immersive digital museum showcasing Varanasi's heritage through AR/VR technology.",
    keyObjects: "Digital 3D models, AR reconstructions, interactive ghat timeline, virtual artifact displays",
    focus: "Digital Heritage",
  },
  {
    name: "1857 Residency Museum",
    location: "Lucknow, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Artifacts from the Siege of Lucknow during the 1857 revolt.",
    keyObjects: "Cannonballs, muskets, soldier's personal effects, battle maps, lithographs",
    focus: "1857 Revolt",
  },
  {
    name: "Archaeological Museum, Piprahwa (Kapilavastu)",
    location: "Piprahwa, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://asi.nic.in/",
    highlights: "Buddhist relic caskets excavated from Piprahwa stupa — believed to be ancient Kapilavastu.",
    keyObjects: "Buddha relic casket (soapstone), Brahmi-inscribed casket, terracotta seals, NBPW pottery",
    focus: "Buddhist Relics",
  },
  // Uttarakhand
  {
    name: "Archaeological Museum, Jageshwar",
    location: "Jageshwar, Uttarakhand",
    state: "Uttarakhand",
    url: "https://asi.nic.in/",
    highlights: "Stone sculptures, Katyuri-period antiquities from the Jageshwar temple cluster.",
    keyObjects: "Katyuri-period Shiva sculptures, Uma-Maheshwara panels, inscribed stone slabs, bronze bells",
    focus: "Katyuri Dynasty",
  },
  // West Bengal
  {
    name: "Koch Bihar Palace Museum",
    location: "Cooch Behar, West Bengal",
    state: "West Bengal",
    url: "https://asi.nic.in/",
    highlights: "Koch dynasty royal artifacts in the Italianate-style palace designed after Buckingham Palace.",
    keyObjects: "Royal portraits, Koch dynasty silver coins, period furniture, European porcelain, hunting trophies",
    focus: "Koch Dynasty",
  },
  {
    name: "Hazarduari Palace Museum",
    location: "Murshidabad, West Bengal",
    state: "West Bengal",
    url: "https://asi.nic.in/",
    highlights: "1,000-door palace with Nawabi armour, paintings, and the largest portrait gallery in India.",
    keyObjects: "Siraj ud-Daulah's sword, Nawabi armoury, Murshidabad ivory, Dutch-English period paintings",
    focus: "Nawabi Heritage",
  },
  {
    name: "Archaeological Museum, Tamluk",
    location: "Tamluk, West Bengal",
    state: "West Bengal",
    url: "https://asi.nic.in/",
    highlights: "Terracotta art, coins, and antiquities from ancient Tamralipta — a major Mauryan-Gupta port city.",
    keyObjects: "Sunga terracotta plaques, Gupta coins, NBPW pottery, Buddhist terracotta heads",
    focus: "Ancient Port City",
  },
];

/* ─── State Archaeological & Heritage Museums (State-Wise) ─── */
const stateMuseums: Museum[] = [
  // National
  {
    name: "National Museum",
    location: "New Delhi",
    state: "Delhi",
    url: "https://www.nationalmuseumindia.gov.in/",
    highlights: "India's premier museum — Harappan gallery, Maurya to Mughal art, bronzes, textiles.",
    keyObjects: "Dancing Girl (Mohenjo-daro replica), Harappan seals, Chola bronzes, Tanjore paintings, Mughal jade",
    focus: "Pan-Indian Archaeology",
  },
  // Andhra Pradesh
  {
    name: "State Archaeological Museum, Hyderabad",
    location: "Hyderabad, Andhra Pradesh / Telangana",
    state: "Andhra Pradesh",
    url: "https://museumstateap.in/",
    highlights: "Buddhist antiquities, Ikshvaku sculptures, Satavahana coins, megalithic iron tools.",
    keyObjects: "Satavahana lead coins, Ikshvaku Buddha, megalithic urn burials, Kakatiya brackets",
    focus: "Deccan Archaeology",
  },
  // Assam
  {
    name: "Assam State Museum",
    location: "Guwahati, Assam",
    state: "Assam",
    url: "https://museums.assam.gov.in/",
    highlights: "Ahom-period antiquities, stone sculptures, folk art, epigraphic records.",
    keyObjects: "Ahom coins (octagonal), Kamakhya temple sculptures, Assamese manuscripts, tribal textiles",
    focus: "Ahom & Northeast Heritage",
  },
  // Bihar
  {
    name: "Bihar Museum",
    location: "Patna, Bihar",
    state: "Bihar",
    url: "https://biharmuseum.org/",
    highlights: "Didarganj Yakshi, Mauryan terracottas, Pala bronzes, Gandhara art.",
    keyObjects: "Didarganj Yakshi (polished sandstone), Mauryan ring-stone, Pala Vishnu, terracotta figurines",
    focus: "Mauryan & Pala Art",
  },
  // Chhattisgarh
  {
    name: "Mahant Ghasidas Memorial Museum",
    location: "Raipur, Chhattisgarh",
    state: "Chhattisgarh",
    url: "https://cgculture.in/museum",
    highlights: "Sirpur Buddhist sculptures, Kalachuri inscriptions, tribal art.",
    keyObjects: "Sirpur bronze Buddha, Kalachuri stone inscriptions, Bastar tribal art, Bhonsle-period arms",
    focus: "Chhattisgarh Heritage",
  },
  // Goa
  {
    name: "Goa State Museum",
    location: "Panaji, Goa",
    state: "Goa",
    url: "https://www.goamuseum.gov.in/",
    highlights: "Portuguese colonial heritage, Hindu temple art, Christian art, numismatics.",
    keyObjects: "Kadamba inscriptions, Portuguese Baroque altarpiece, numismatic collection, lottery table",
    focus: "Colonial & Hindu Heritage",
  },
  // Gujarat
  {
    name: "Gujarat State Museum (Sardar Patel Museum)",
    location: "Ahmedabad, Gujarat",
    state: "Gujarat",
    url: "https://www.gujaratmuseum.org/",
    highlights: "Harappan antiquities from Lothal and Rangpur, Solanki sculptures, Jain manuscripts.",
    keyObjects: "Lothal terracotta horse, Solanki Jain bronzes, Harappan bead collection, miniature paintings",
    focus: "Harappan & Medieval Gujarat",
  },
  {
    name: "Calico Museum of Textiles",
    location: "Ahmedabad, Gujarat",
    state: "Gujarat",
    url: "https://www.calicomuseum.org/",
    highlights: "Historical Indian textiles, Mughal court fabrics, resist-dyed and brocaded silks.",
    keyObjects: "Mughal pashmina, Patola double-ikat, kalamkari panels, embroidered temple hangings",
    focus: "Textile Heritage",
  },
  {
    name: "Archaeological Museum, Lothal",
    location: "Lothal, Gujarat",
    state: "Gujarat",
    url: "https://asi.nic.in/museum-lothal/",
    highlights: "Indus Valley Civilization: seals, beads, weights, terracotta, dockyard remains.",
    keyObjects: "Harappan dock model, unicorn seal, micro-beads, cubical weights, Persian Gulf seal",
    focus: "Indus Valley Civilization",
  },
  // Haryana
  {
    name: "Haryana State Archaeological Museum",
    location: "Panchkula, Haryana",
    state: "Haryana",
    url: "https://haryanatourism.gov.in/",
    highlights: "Kushan sculptures, Gupta terracottas, antiquities from Rakhigarhi and Bhagwanpura.",
    keyObjects: "Rakhigarhi Harappan pottery, Kushan Mathura-style heads, Gupta period coins, terracotta toys",
    focus: "Harappan & Kushan",
  },
  // Himachal Pradesh
  {
    name: "Himachal State Museum (Shimla)",
    location: "Shimla, Himachal Pradesh",
    state: "Himachal Pradesh",
    url: "https://hpstatemuseum.in/",
    highlights: "Pahari miniature paintings, bronze sculptures, Kangra school art.",
    keyObjects: "Pahari miniatures (Kangra, Basohli), Chamba Rumal embroidery, stone Vishnu, bronze Nandi",
    focus: "Pahari Art",
  },
  // Jharkhand
  {
    name: "Tribal Research Institute Museum",
    location: "Ranchi, Jharkhand",
    state: "Jharkhand",
    url: "https://jtrainstitute.in/",
    highlights: "Santal and Munda tribal art, iron smelting tools, Chota Nagpur antiquities.",
    keyObjects: "Tribal iron tools, Santal paintings, Munda ceremonial objects, megalithic finds",
    focus: "Tribal Heritage",
  },
  // Karnataka
  {
    name: "Government Museum, Bangalore",
    location: "Bengaluru, Karnataka",
    state: "Karnataka",
    url: "https://www.karnatakamuseum.gov.in/",
    highlights: "Oldest museum in Karnataka — Hoysala, Chalukya, and Vijayanagara sculptures.",
    keyObjects: "Hoysala stone brackets, Halal-era inscriptions, Vijayanagara bronzes, neolithic tools",
    focus: "Karnataka Archaeology",
  },
  // Kerala
  {
    name: "Napier Museum",
    location: "Thiruvananthapuram, Kerala",
    state: "Kerala",
    url: "https://museum.kerala.gov.in/",
    highlights: "Chola bronzes, ivory carvings, temple models, Japanese lacquerware, Kerala murals.",
    keyObjects: "Chola Nataraja bronze, ivory carvings, Japanese samurai armour, Kerala mural fragments",
    focus: "Chola Bronzes & Kerala Art",
  },
  // Madhya Pradesh
  {
    name: "Madhya Pradesh State Museum (Rani Durgavati)",
    location: "Jabalpur, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "http://www.mpculture.in/",
    highlights: "Paramara sculptures, tribal art, inscriptions, Gupta-period terracotta.",
    keyObjects: "Paramara stone carvings, Kalchuri inscriptions, Gond paintings, Gupta terracotta heads",
    focus: "Central Indian Archaeology",
  },
  {
    name: "Indira Gandhi Rashtriya Manav Sangrahalaya (IGRMS)",
    location: "Bhopal, Madhya Pradesh",
    state: "Madhya Pradesh",
    url: "https://igrms.com/",
    highlights: "Museum of Mankind — tribal habitats, rock art replicas, prehistoric tool galleries.",
    keyObjects: "Bhimbetka rock art replicas, tribal house models, prehistoric stone tools, ethnographic collections",
    focus: "Anthropology & Prehistory",
  },
  // Maharashtra
  {
    name: "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya",
    location: "Mumbai, Maharashtra",
    state: "Maharashtra",
    url: "https://www.csmvs.in/",
    highlights: "Indus Valley artifacts, miniature paintings, Gandhara sculptures, decorative arts.",
    keyObjects: "Gandhara Bodhisattva, Harappan pottery, Mughal miniatures, Tanjore paintings, Nepali bronzes",
    focus: "Pan-Indian Art & Archaeology",
  },
  // Manipur
  {
    name: "Manipur State Museum",
    location: "Imphal, Manipur",
    state: "Manipur",
    url: "https://manipurmuseum.gov.in/",
    highlights: "Meitei royal artifacts, INA relics, Manipuri textile traditions.",
    keyObjects: "Kangla Fort artifacts, Manipuri polo gear, INA memorabilia, Meitei manuscripts",
    focus: "Meitei & INA Heritage",
  },
  // Meghalaya
  {
    name: "Don Bosco Museum of Indigenous Cultures",
    location: "Shillong, Meghalaya",
    state: "Meghalaya",
    url: "https://www.dbcic.org/museum",
    highlights: "Seven-storey museum of Northeast India's indigenous cultures and traditions.",
    keyObjects: "Khasi monolith models, Naga warrior headgear, tribal textiles, bamboo craft, megalithic tools",
    focus: "Northeast Tribal Culture",
  },
  // Odisha
  {
    name: "Odisha State Museum",
    location: "Bhubaneswar, Odisha",
    state: "Odisha",
    url: "https://www.odishamuseum.nic.in/",
    highlights: "Odishan temple sculptures, Buddhist antiquities, palm-leaf manuscripts.",
    keyObjects: "Kalinga stone inscriptions, palm-leaf manuscripts, Konark fragments, Jain Tirthankaras",
    focus: "Odishan Temple Art",
  },
  // Punjab
  {
    name: "Punjab State Museum (Sheesh Mahal)",
    location: "Patiala, Punjab",
    state: "Punjab",
    url: "https://www.punjabtourism.gov.in/",
    highlights: "Sikh-period arms, Pahari miniatures, Gandhara sculptures, medals collection.",
    keyObjects: "Sikh swords (kirpans), Pahari miniatures, Gandhara stucco heads, British-era medals",
    focus: "Sikh & Gandhara Heritage",
  },
  // Rajasthan
  {
    name: "Albert Hall Museum",
    location: "Jaipur, Rajasthan",
    state: "Rajasthan",
    url: "https://www.alberthalljaipur.gov.in/",
    highlights: "Egyptian mummy, terracotta, coins, metal sculptures, folk art of Rajasthan.",
    keyObjects: "Egyptian mummy (Tutu), ivory miniatures, Mughal carpets, Jaipur school paintings, metalware",
    focus: "Decorative Arts",
  },
  {
    name: "Maharana Pratap Museum (City Palace)",
    location: "Udaipur, Rajasthan",
    state: "Rajasthan",
    url: "https://www.eternalmewar.in/",
    highlights: "Mewar royal collections — arms, armour, Rajput paintings, royal regalia.",
    keyObjects: "Maharana Pratap's sword & armour, Mewar miniatures, royal palanquins, Mughal-Rajput paintings",
    focus: "Rajput Heritage",
  },
  // Tamil Nadu
  {
    name: "Government Museum (Egmore)",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    url: "https://www.chennaimuseum.org/",
    highlights: "Chola bronzes, Amaravati marbles, numismatic gallery, Roman antiquities from Arikamedu.",
    keyObjects: "Chola Nataraja, Amaravati marble friezes, Roman gold coins (Arikamedu), Pallava sculptures",
    focus: "South Indian Bronzes",
  },
  // Telangana
  {
    name: "Salar Jung Museum",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    url: "https://www.salarjungmuseum.in/",
    highlights: "Veiled Rebecca, Indian bronzes, Far Eastern art, manuscripts, jade collection.",
    keyObjects: "Veiled Rebecca (marble), Mughal jade dagger, Aurangzeb's sword, Indian miniatures, clocks",
    focus: "Decorative & World Art",
  },
  // Tripura
  {
    name: "Tripura Government Museum",
    location: "Agartala, Tripura",
    state: "Tripura",
    url: "https://tripura.gov.in/museum",
    highlights: "Manikya dynasty artifacts, stone sculptures, tribal heritage, Unakoti reliefs.",
    keyObjects: "Manikya coins, Unakoti rock reliefs, tribal bamboo crafts, stone Vishnu images",
    focus: "Tripura Royal Heritage",
  },
  // Uttar Pradesh
  {
    name: "State Museum, Lucknow",
    location: "Lucknow, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://statemuseumlucknow.in/",
    highlights: "Kushana-Gupta sculptures, Jain bronzes, Egyptian mummy, terracotta collection.",
    keyObjects: "Kushan standing Buddha, Egyptian mummy, Gupta terracottas, Jain Tirthankaras, coins",
    focus: "Kushan-Gupta Period",
  },
  {
    name: "Allahabad Museum",
    location: "Prayagraj, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://www.allahabadmuseum.org/",
    highlights: "Kushana sculptures, terracotta figurines, Rajput paintings, freedom struggle gallery.",
    keyObjects: "Kushan Mathura heads, terracotta mother-goddess, Rajput miniatures, Nehru memorabilia",
    focus: "Mathura School Art",
  },
  {
    name: "Mathura Museum",
    location: "Mathura, Uttar Pradesh",
    state: "Uttar Pradesh",
    url: "https://mathuramuseum.up.gov.in/",
    highlights: "Premier collection of Mathura School sculptures — Kushan, Gupta, and Shunga periods.",
    keyObjects: "Headless Kanishka statue, Mathura Standing Buddha, Gupta-period Vishnu, yakshi bracket figures",
    focus: "Mathura School Sculpture",
  },
  // West Bengal
  {
    name: "Indian Museum",
    location: "Kolkata, West Bengal",
    state: "West Bengal",
    url: "https://indianmuseumkolkata.org/",
    highlights: "Oldest museum in Asia — Gandhara sculptures, Egyptian mummy, geological specimens, Bharhut railing.",
    keyObjects: "Bharhut Stupa railing, Gandhara Bodhisattva, Egyptian mummy, Ashoka pillar capital, meteorites",
    focus: "Oldest Museum in Asia",
  },
];

/* ─── Foreign Museums with Indian Objects ─── */
const foreignMuseums: Museum[] = [
  {
    name: "British Museum — South Asia Collection",
    location: "London, United Kingdom",
    state: "UK",
    url: "https://www.britishmuseum.org/collection/search?place=South+Asia",
    highlights: "Amaravati marbles, Gandhara Buddhas, Mughal paintings, Harappan seals, Tipu Sultan artifacts.",
    keyObjects: "Amaravati marble drum slabs, Harappan 'Priest-King' replica, Tipu's mechanical tiger parts, Mughal albums",
    focus: "South Asian Art",
  },
  {
    name: "Victoria and Albert Museum — South Asia Gallery",
    location: "London, United Kingdom",
    state: "UK",
    url: "https://www.vam.ac.uk/collections/south-and-south-east-asia",
    highlights: "Tipu's Tiger, Mughal jade, Indian textiles, Chola bronzes, Gandhara reliefs.",
    keyObjects: "Tipu's Tiger (automaton), Shah Jahan's wine cup (jade), Chola Shiva, Indian textiles",
    focus: "Indian Decorative Arts",
  },
  {
    name: "Metropolitan Museum of Art — South Asian Art",
    location: "New York, USA",
    state: "USA",
    url: "https://www.metmuseum.org/about-the-met/collection-areas/asian-art",
    highlights: "Kushan sculptures, Mughal miniatures, Chola Nataraja, Rajput paintings, Buddhist bronzes.",
    keyObjects: "Chola Nataraja, Kushan Standing Buddha, Mughal miniature albums, Rajput court scenes",
    focus: "South Asian Sculpture",
  },
  {
    name: "Smithsonian — Freer & Sackler Galleries",
    location: "Washington, D.C., USA",
    state: "USA",
    url: "https://asia.si.edu/explore/south-asia/",
    highlights: "Indian sculpture, Mughal painting, Buddhist art, Gandhara stone reliefs.",
    keyObjects: "Gandhara frieze panels, Mughal court paintings, Pala bronzes, Rajasthani miniatures",
    focus: "Asian Art",
  },
  {
    name: "Musée Guimet (National Museum of Asian Arts)",
    location: "Paris, France",
    state: "France",
    url: "https://www.guimet.fr/en/collections/india/",
    highlights: "Gandhara art, Mathura sculptures, Chola bronzes, Amaravati reliefs, Indian textiles.",
    keyObjects: "Gandhara Bodhisattva heads, Mathura Yakshi, Chola Shiva Nataraja, Amaravati medallions",
    focus: "Gandhara & Chola Art",
  },
  {
    name: "Museum für Asiatische Kunst (Asian Art Museum Berlin)",
    location: "Berlin, Germany",
    state: "Germany",
    url: "https://www.smb.museum/en/museums-institutions/museum-fuer-asiatische-kunst/home/",
    highlights: "Gandhara collection, Indian miniatures, Buddhist sculptures, Central Asian murals.",
    keyObjects: "Gandhara narrative panels, Mughal miniatures, Mathura red sandstone Buddhas",
    focus: "Gandhara Collection",
  },
  {
    name: "Royal Ontario Museum — South Asia Gallery",
    location: "Toronto, Canada",
    state: "Canada",
    url: "https://www.rom.on.ca/en/south-asia",
    highlights: "Hindu and Buddhist sculptures, Mughal decorative arts, Indian arms and armour.",
    keyObjects: "Chola bronze Parvati, Hindu temple door carvings, Mughal arms, Rajput paintings",
    focus: "Hindu-Buddhist Sculpture",
  },
  {
    name: "Rijksmuseum — Asian Pavilion",
    location: "Amsterdam, Netherlands",
    state: "Netherlands",
    url: "https://www.rijksmuseum.nl/en/rijksstudio?q=india",
    highlights: "Chola bronzes, Mughal paintings, VOC-period Indian trade objects, Gandhara reliefs.",
    keyObjects: "Chola Shiva bronze, VOC-era Indian cotton (chintz), Mughal dagger, Gandhara heads",
    focus: "Indo-Dutch Trade Art",
  },
  {
    name: "Ashmolean Museum — Eastern Art",
    location: "Oxford, United Kingdom",
    state: "UK",
    url: "https://www.ashmolean.org/eastern-art",
    highlights: "Tibetan and Indian Buddhist art, Mughal paintings, South Indian bronzes.",
    keyObjects: "Mughal Padshahnamah paintings, Chola processional bronzes, Rajput love scenes",
    focus: "Mughal Painting",
  },
  {
    name: "Los Angeles County Museum of Art (LACMA) — South Asian Art",
    location: "Los Angeles, USA",
    state: "USA",
    url: "https://www.lacma.org/art/collection/south-and-southeast-asian-art",
    highlights: "Harappan antiquities, Chola bronzes, Rajput paintings, Mughal jades.",
    keyObjects: "Chola Shiva Nataraja, Kushan Bodhisattva, Pahari miniatures, Mughal jade cup",
    focus: "Indian Bronzes & Painting",
  },
  {
    name: "Cleveland Museum of Art — Indian Art",
    location: "Cleveland, USA",
    state: "USA",
    url: "https://www.clevelandart.org/art/departments/indian-southeast-asian-and-korean-art",
    highlights: "Gupta-period sculptures, Pala bronzes, Jain manuscripts, Hindu temple art.",
    keyObjects: "Gupta Standing Vishnu, Pala Tara bronze, illuminated Jain Kalpasutras, Kushan Maitreya",
    focus: "Gupta & Pala Art",
  },
  {
    name: "National Museum of Asian Art (Smithsonian)",
    location: "Washington, D.C., USA",
    state: "USA",
    url: "https://asia.si.edu/",
    highlights: "Buddhist reliquary, Mughal albums, stone and bronze sculptures from across India.",
    keyObjects: "Gandhara reliquary, Mughal album leaves, South Indian stone carvings, Buddhist bronzes",
    focus: "Buddhist & Mughal",
  },
];

/* ─── All unique states for filter ─── */
function getUniqueStates(museums: Museum[]): string[] {
  const set = new Set(museums.map((m) => m.state));
  return Array.from(set).sort();
}

/* ─── Focus areas ─── */
function getUniqueFocusAreas(museums: Museum[]): string[] {
  const set = new Set(museums.map((m) => m.focus));
  return Array.from(set).sort();
}

function MuseumsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedFocus, setSelectedFocus] = useState("");
  const [activeSection, setActiveSection] = useState<"asi" | "state" | "foreign">("asi");

  const allMuseums = activeSection === "asi" ? asiMuseums : activeSection === "state" ? stateMuseums : foreignMuseums;

  const states = useMemo(() => getUniqueStates(allMuseums), [activeSection]);
  const focusAreas = useMemo(() => getUniqueFocusAreas(allMuseums), [activeSection]);

  const filteredMuseums = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allMuseums.filter((m) => {
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q) ||
        m.highlights.toLowerCase().includes(q) ||
        m.keyObjects.toLowerCase().includes(q) ||
        m.focus.toLowerCase().includes(q);
      const matchesState = !selectedState || m.state === selectedState;
      const matchesFocus = !selectedFocus || m.focus === selectedFocus;
      return matchesQuery && matchesState && matchesFocus;
    });
  }, [searchQuery, selectedState, selectedFocus, allMuseums]);

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

          <h1 className="mt-2 text-2xl font-black tracking-tight text-primary sm:text-3xl">
            Archaeological Museums
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Complete directory: all 52 ASI site museums, state-wise heritage museums, and international museums with Indian archaeological collections. Source: ASI (asi.nic.in), PIB Govt. of India.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {([
            { key: "asi" as const, label: "ASI Museums (52)", icon: Landmark },
            { key: "state" as const, label: "State Museums", icon: Building2 },
            { key: "foreign" as const, label: "International", icon: Globe },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveSection(key); setSelectedState(""); setSelectedFocus(""); }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                activeSection === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, state, or keyword..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="appearance-none rounded-lg border border-border bg-background py-2 pl-8 pr-8 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">All Focus Areas</option>
              {focusAreas.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {(searchQuery || selectedState || selectedFocus) && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedState(""); setSelectedFocus(""); }}
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20"
              >
                Clear filters
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Showing {filteredMuseums.length} of {allMuseums.length} museums
          </p>
        </div>

        {/* Museum Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredMuseums.map((m) => (
            <MuseumCard key={m.name} museum={m} />
          ))}
        </div>

        {filteredMuseums.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No museums match your search. Try different keywords or clear filters.</p>
          </div>
        )}

        {/* Source Note */}
        <div className="rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground shadow-sm">
          <strong className="text-foreground">Sources:</strong>{" "}
          <a href="https://asi.nic.in/pages/Museums" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Archaeological Survey of India (asi.nic.in)
          </a>
          {" • "}
          <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2204101" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            PIB, Ministry of Culture (15 Dec 2025)
          </a>
          {" • "}
          <a href="https://www.indiaculture.gov.in/museums" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            Ministry of Culture
          </a>
          {" • Respective official museum websites. Visiting hours may vary — verify before visiting."}
        </div>
      </div>
    </main>
  );
}

function MuseumCard({ museum }: { museum: Museum }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/30">
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <a
            href={museum.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-foreground group-hover:text-primary"
          >
            {museum.name}
            <ExternalLink className="ml-1 inline h-3 w-3 text-muted-foreground" />
          </a>
        </div>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {museum.location}
        </p>
        <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {museum.focus}
        </span>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{museum.highlights}</p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center gap-1 border-t border-border px-4 py-2 text-[11px] font-semibold text-primary hover:bg-accent"
      >
        {expanded ? "Hide" : "Key Objects"}
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/30 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Key Objects & Collections</p>
          <p className="mt-1 text-xs leading-relaxed text-foreground">{museum.keyObjects}</p>
        </div>
      )}
    </div>
  );
}
