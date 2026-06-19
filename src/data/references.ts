// Authoritative bibliography for content claims across ArchaeoLens.
// Format follows author-year style with full citation metadata.

export type Reference = {
  id: string;
  author: string;
  year: string;
  title: string;
  publication?: string;
  publisher?: string;
  url?: string;
  type: "book" | "article" | "report" | "official" | "web";
};

export const REFERENCES: Reference[] = [
  // Foundational South Asian archaeology
  { id: "allchin1982", author: "Allchin, B. & Allchin, R.", year: "1982", title: "The Rise of Civilization in India and Pakistan", publisher: "Cambridge University Press", type: "book" },
  { id: "chakrabarti1999", author: "Chakrabarti, D. K.", year: "1999", title: "India: An Archaeological History — Palaeolithic Beginnings to Early Historic Foundations", publisher: "Oxford University Press, New Delhi", type: "book" },
  { id: "coningham2015", author: "Coningham, R. & Young, R.", year: "2015", title: "The Archaeology of South Asia: From the Indus to Asoka, c. 6500 BCE–200 CE", publisher: "Cambridge University Press", type: "book" },
  { id: "kenoyer1998", author: "Kenoyer, J. M.", year: "1998", title: "Ancient Cities of the Indus Valley Civilization", publisher: "Oxford University Press, Karachi", type: "book" },
  { id: "possehl2002", author: "Possehl, G. L.", year: "2002", title: "The Indus Civilization: A Contemporary Perspective", publisher: "AltaMira Press", type: "book" },
  { id: "wright2010", author: "Wright, R. P.", year: "2010", title: "The Ancient Indus: Urbanism, Economy, and Society", publisher: "Cambridge University Press", type: "book" },

  // Site reports
  { id: "marshall1931", author: "Marshall, J.", year: "1931", title: "Mohenjo-daro and the Indus Civilization", publisher: "Arthur Probsthain, London", type: "report" },
  { id: "wheeler1947", author: "Wheeler, R. E. M.", year: "1947", title: "Harappa 1946: The Defences and Cemetery R-37", publication: "Ancient India 3, 58–130", type: "article" },
  { id: "lal1954", author: "Lal, B. B.", year: "1954–55", title: "Excavation at Hastinapura and other explorations in the Upper Ganga and Sutlej Basins 1950–52", publication: "Ancient India 10–11, 5–151", type: "article" },
  { id: "rao1979", author: "Rao, S. R.", year: "1979", title: "Lothal: A Harappan Port Town (1955–62)", publisher: "Archaeological Survey of India, Memoir 78", type: "report" },
  { id: "bisht2015", author: "Bisht, R. S.", year: "2015", title: "Excavations at Dholavira (1989–90 to 2004–05)", publisher: "Archaeological Survey of India, Memoir 98", type: "report" },

  // Scripts and inscriptions
  { id: "salomon1998", author: "Salomon, R.", year: "1998", title: "Indian Epigraphy: A Guide to the Study of Inscriptions in Sanskrit, Prakrit, and the Other Indo-Aryan Languages", publisher: "Oxford University Press", type: "book" },
  { id: "parpola1994", author: "Parpola, A.", year: "1994", title: "Deciphering the Indus Script", publisher: "Cambridge University Press", type: "book" },
  { id: "sircar1965", author: "Sircar, D. C.", year: "1965", title: "Indian Epigraphy", publisher: "Motilal Banarsidass", type: "book" },

  // Ceramics & material culture
  { id: "sinopoli1991", author: "Sinopoli, C. M.", year: "1991", title: "Approaches to Archaeological Ceramics", publisher: "Plenum Press", type: "book" },
  { id: "rice1987", author: "Rice, P. M.", year: "1987", title: "Pottery Analysis: A Sourcebook", publisher: "University of Chicago Press", type: "book" },

  // Heritage law & policy
  { id: "amasr1958", author: "Government of India", year: "1958 (amended 2010)", title: "The Ancient Monuments and Archaeological Sites and Remains Act, 1958", publisher: "Ministry of Culture", url: "https://asi.nic.in/wp-content/uploads/2015/05/amasr-act-1958.pdf", type: "official" },
  { id: "antiq1972", author: "Government of India", year: "1972", title: "The Antiquities and Art Treasures Act, 1972", publisher: "Ministry of Culture", url: "https://asi.nic.in/wp-content/uploads/2015/05/antiquities-and-art-treasures-act-1972.pdf", type: "official" },
  { id: "treasure1878", author: "Government of India", year: "1878", title: "Indian Treasure Trove Act, 1878", publisher: "Government of India", type: "official" },

  // Organizations / portals
  { id: "asi", author: "Archaeological Survey of India", year: "n.d.", title: "Official Portal", url: "https://asi.nic.in/", type: "web" },
  { id: "unesco-in", author: "UNESCO World Heritage Centre", year: "n.d.", title: "World Heritage List — India", url: "https://whc.unesco.org/en/statesparties/in", type: "web" },
  { id: "ignca", author: "Indira Gandhi National Centre for the Arts (IGNCA)", year: "n.d.", title: "Cultural Informatics Division", url: "https://ignca.gov.in/", type: "web" },
  { id: "nmma", author: "Archaeological Survey of India", year: "n.d.", title: "National Mission on Monuments and Antiquities (NMMA)", url: "https://asi.nic.in/national-mission-on-monuments-antiquities/", type: "web" },

  // Period-specific
  { id: "ray2003", author: "Ray, H. P.", year: "2003", title: "The Archaeology of Seafaring in Ancient South Asia", publisher: "Cambridge University Press", type: "book" },
  { id: "thapar2002", author: "Thapar, R.", year: "2002", title: "Early India: From the Origins to AD 1300", publisher: "Penguin/Allen Lane", type: "book" },
  { id: "singh2008", author: "Singh, U.", year: "2008", title: "A History of Ancient and Early Medieval India: From the Stone Age to the 12th Century", publisher: "Pearson Longman", type: "book" },
  { id: "misra2001", author: "Misra, V. N.", year: "2001", title: "Prehistoric human colonization of India", publication: "Journal of Biosciences 26(4): 491–531", type: "article", url: "https://doi.org/10.1007/BF02704749" },
  { id: "petraglia2007", author: "Petraglia, M. D. & Allchin, B. (eds.)", year: "2007", title: "The Evolution and History of Human Populations in South Asia", publisher: "Springer", type: "book" },

  // Rock art
  { id: "wakankar1975", author: "Wakankar, V. S.", year: "1975", title: "Bhimbetka — The Prehistoric Paradise", publication: "Prachya Pratibha 3(2): 7–29", type: "article" },

  // Numismatics
  { id: "gupta1969", author: "Gupta, P. L. & Hardaker, T. R.", year: "1985", title: "Indian Silver Punchmarked Coins: Magadha-Maurya Karshapana Series", publisher: "IIRNS, Nashik", type: "book" },
];

export function ref(id: string): Reference | undefined {
  return REFERENCES.find((r) => r.id === id);
}
