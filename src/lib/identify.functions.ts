import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  MINERAL_REFERENCE_IDS,
  ARCHAEOLOGY_REFERENCE_IDS,
  REFERENCES,
} from "@/data/references";

export type ScanMode = "nature" | "archaeology";
export type Category = "plant" | "animal" | "mineral" | "unknown";
export type ArchaeologyCategory =
  | "pottery"
  | "lithic"
  | "coin"
  | "inscription"
  | "rock_art"
  | "bone"
  | "metal"
  | "terracotta"
  | "brick"
  | "sculpture"
  | "artifact"
  | "unknown";
export type Confidence = "high" | "medium" | "low";

export interface LocalNames {
  hi?: string;
  ta?: string;
  te?: string;
  bn?: string;
  mr?: string;
  kn?: string;
  ml?: string;
  gu?: string;
}

export interface MineralDetails {
  chemicalFormula?: string;
  crystalSystem?: string;
  mohsHardness?: string;
  specificGravity?: string;
  luster?: string;
  color?: string;
  streak?: string;
  cleavage?: string;
  fracture?: string;
  commonLocalities?: string[];
  archaeologicalUse?: string;
}

export interface NatureResult {
  mode: "nature";
  category: Category;
  scientificName: string;
  englishName: string;
  family?: string;
  localNames: LocalNames;
  summary: string;
  confidence: Confidence;
  confidenceScore?: number;
  alternatives: string[];
  sources: { label: string; url: string }[];
  referenceIds?: string[];
  mineralDetails?: MineralDetails;
  notes?: string;
}

export interface ArchaeologyResult {
  mode: "archaeology";
  archaeologyCategory: ArchaeologyCategory;
  objectType: string;
  material: string;
  possiblePeriod: string;
  culturalContext?: string;
  visibleFeatures: string[];
  angleObservations?: string[];
  condition: string;
  manufacturingTechnique?: string;
  documentationAdvice: string[];
  fieldNote: string;
  confidence: Confidence;
  confidenceScore?: number;
  alternatives: string[];
  sources: { label: string; url: string }[];
  referenceIds?: string[];
  notes?: string;
}

export type IdentifyResult = NatureResult | ArchaeologyResult;

type AiToolPayload = {
  choices?: Array<{
    message?: {
      tool_calls?: Array<{
        function?: { arguments?: unknown };
      }>;
    };
  }>;
};

type ParsedToolArgs = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, limit: number): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, limit)
    : [];
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.max(0, Math.min(100, Math.round(n)));
  }
  return undefined;
}

function filterReferenceIds(value: unknown, allowed: readonly string[]): string[] {
  const set = new Set(allowed);
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string" && set.has(item))
        .slice(0, 6)
    : [];
}


function buildNatureSources(
  category: Category,
  scientific: string,
): { label: string; url: string }[] {
  const q = encodeURIComponent(scientific);
  const wiki = `https://en.wikipedia.org/wiki/Special:Search?search=${q}`;
  const sources: { label: string; url: string }[] = [{ label: "Wikipedia", url: wiki }];

  if (category === "plant") {
    sources.push({ label: "GBIF", url: `https://www.gbif.org/species/search?q=${q}` });
    sources.push({ label: "POWO (Kew)", url: `https://powo.science.kew.org/?q=${q}` });
  } else if (category === "animal") {
    sources.push({ label: "GBIF", url: `https://www.gbif.org/species/search?q=${q}` });
    sources.push({ label: "iNaturalist", url: `https://www.inaturalist.org/search?q=${q}` });
    sources.push({ label: "IUCN Red List", url: `https://www.iucnredlist.org/search?query=${q}` });
  } else if (category === "mineral") {
    sources.push({
      label: "IGS (International Gem Society)",
      url: `https://www.gemsociety.org/article/gemstone-listing/?q=${q}`,
    });
    sources.push({ label: "Mindat", url: `https://www.mindat.org/search.php?search=${q}` });
    sources.push({
      label: "Geological Survey of India",
      url: `https://www.google.com/search?q=site:gsi.gov.in+${q}`,
    });
  }
  return sources;
}
function buildArchaeologySources(query: string): { label: string; url: string }[] {
  const q = encodeURIComponent(query || "archaeology artifact");
  return [
    {
      label: "Archaeological Survey of India",
      url: `https://www.google.com/search?q=site:asi.nic.in+${q}`,
    },
    { label: "Indian Culture Portal", url: `https://indianculture.gov.in/search/node/${q}` },
    {
      label: "National Museum India",
      url: `https://www.google.com/search?q=site:nationalmuseumindia.gov.in+${q}`,
    },
    { label: "Sahapedia", url: `https://www.google.com/search?q=site:sahapedia.org+${q}` },
    {
      label: "British Museum",
      url: `https://www.britishmuseum.org/collection/search?keyword=${q}`,
    },
    { label: "Met Museum", url: `https://www.metmuseum.org/art/collection/search?q=${q}` },
    { label: "Google Scholar", url: `https://scholar.google.com/scholar?q=${q}` },
    { label: "UNESCO World Heritage", url: `https://whc.unesco.org/en/search/?criteria=${q}` },
  ];
}

export const identifyImage = createServerFn({ method: "POST" })
  .inputValidator((data: { imageBase64?: string; imagesBase64?: string[]; mode?: ScanMode }) => {
    const images = Array.isArray(data?.imagesBase64)
      ? data.imagesBase64.filter(
          (item): item is string => typeof item === "string" && item.length > 0,
        )
      : data?.imageBase64 && typeof data.imageBase64 === "string"
        ? [data.imageBase64]
        : [];

    if (!images.length) {
      throw new Error("At least one image is required");
    }
    if (images.length > 6) {
      throw new Error("Too many angles");
    }
    if (images.some((image) => image.length > 8_000_000) || images.join("").length > 18_000_000) {
      throw new Error("Images too large");
    }
    return { imagesBase64: images, mode: (data.mode ?? "archaeology") as ScanMode };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      console.error("AI identification unavailable: required AI secret is not configured.");
      return {
        ok: false as const,
        error: "AI is not configured. Please contact the administrator.",
      };
    }

    const dataUrls = data.imagesBase64.map((image) =>
      image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`,
    );

    const isArchaeology = data.mode === "archaeology";
    const allowedRefIds = isArchaeology ? ARCHAEOLOGY_REFERENCE_IDS : (MINERAL_REFERENCE_IDS as readonly string[]);
    const refCatalog = allowedRefIds
      .map((id) => {
        const r = REFERENCES.find((x) => x.id === id);
        if (!r) return null;
        return `- ${id} :: ${r.author} (${r.year}). ${r.title}`;
      })
      .filter(Boolean)
      .join("\n");

    const systemPrompt = isArchaeology
      ? `You are an archaeological field documentation assistant for professional photo observation. Analyze only visible evidence in photos of artifacts, pottery, lithics, coins, inscriptions, rock art, terracotta, bricks, sculpture, bone, or metal objects. Always call the report_identification tool. Be decisive about visible object class, material, condition, and manufacturing traces when the photo supports it, but never claim final authentication, exact dating, legality, market value, provenance, or ownership from an image. Use professional calibrated wording: "consistent with", "probable", "possible", "not determinable from photograph", and "requires stratigraphic/site context". Prioritize diagnostic details: fabric, inclusions, rim/base/profile, flake scars, retouch, casting/striking marks, tool marks, inscriptions, iconography, patina/weathering, breakage, wear, scale needs, and photo limitations. Confidence must be evidence-based: use high when several clear diagnostic features support the same interpretation, medium when object class/material are clear but chronology/culture need context, and low only for unclear, partial, modern-looking, or non-archaeological images. Also return confidenceScore as an integer 0–100 calibrated to the qualitative confidence (high≈75–95, medium≈45–74, low≈10–44). Pick up to 5 reference IDs from the catalog below that are genuinely relevant to your interpretation (return them in referenceIds; only use IDs that appear verbatim in the catalog).\n\nReference catalog (id :: citation):\n${refCatalog}`
      : `You are an expert mineralogist and gemologist focused on stones, minerals, gems, ores, and rocks. The subject in the photo is almost always a mineral or rock specimen — identify it precisely. You always respond by calling the report_identification tool. Set category to "mineral" unless the photo clearly shows a living plant or animal. When category is "mineral", you MUST fill mineralDetails with the standard diagnostic properties of that species (chemical formula, crystal system, Mohs hardness range, specific gravity, luster, color, streak, cleavage, fracture, common world localities including India where known, and archaeological/cultural use if any). Use textbook values from established mineralogy literature; never invent values you don't know — leave a field empty instead. Local names should be the most widely used common name in that language; only include languages where you are confident a real local name exists. Keep the summary factual: mineral group, where it's typically found, and 1-2 distinguishing field tests. 3-5 sentences. Also return confidenceScore as an integer 0–100 calibrated to the qualitative confidence (high≈75–95, medium≈45–74, low≈10–44). Pick up to 5 reference IDs from the catalog below that genuinely document this species (return them in referenceIds; only use IDs that appear verbatim in the catalog). Never give medicinal, edibility, healing, or metaphysical claims.\n\nReference catalog (id :: citation):\n${refCatalog}`;

    const natureProperties = {
      category: {
        type: "string",
        enum: ["plant", "animal", "mineral", "unknown"],
        description: "What kind of subject is in the image. Default to 'mineral' for stones, gems, rocks, ores.",
      },
      scientificName: {
        type: "string",
        description: "Mineral species name (e.g. 'Quartz', 'Corundum (var. Ruby)') or Latin binomial. Empty if unknown.",
      },
      englishName: { type: "string", description: "Common English name. Empty if unknown." },
      family: { type: "string", description: "Mineral group / family (e.g. silicates, carbonates) or taxonomic family." },
      localNames: {
        type: "object",
        description: "Common name in major Indian languages, by ISO code.",
        properties: {
          hi: { type: "string" }, ta: { type: "string" }, te: { type: "string" }, bn: { type: "string" },
          mr: { type: "string" }, kn: { type: "string" }, ml: { type: "string" }, gu: { type: "string" },
        },
        additionalProperties: false,
      },
      summary: { type: "string", description: "3-5 sentence factual description." },
      mineralDetails: {
        type: "object",
        description: "Standard mineralogical properties when the subject is a mineral / rock / gem.",
        properties: {
          chemicalFormula: { type: "string", description: "e.g. SiO2, Al2O3, CaCO3." },
          crystalSystem: { type: "string", description: "Cubic, tetragonal, hexagonal, trigonal, orthorhombic, monoclinic, triclinic, amorphous." },
          mohsHardness: { type: "string", description: "Mohs scale, e.g. '7' or '6.5–7'." },
          specificGravity: { type: "string", description: "Range, e.g. '2.65' or '3.95–4.10'." },
          luster: { type: "string", description: "Vitreous, adamantine, metallic, resinous, pearly, silky, dull, etc." },
          color: { type: "string", description: "Typical colors + observed color." },
          streak: { type: "string", description: "Powder color on unglazed porcelain." },
          cleavage: { type: "string", description: "Perfect / good / poor / none and directions." },
          fracture: { type: "string", description: "Conchoidal, uneven, hackly, etc." },
          commonLocalities: { type: "array", items: { type: "string" }, description: "Up to 6 well-known localities; prefer Indian sites where applicable." },
          archaeologicalUse: { type: "string", description: "Known cultural / archaeological use (e.g. carnelian for Harappan beads, lapis trade routes)." },
        },
        additionalProperties: false,
      },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
      confidenceScore: { type: "integer", description: "Integer 0–100 reflecting visible-evidence strength." },
      alternatives: { type: "array", items: { type: "string" }, description: "Up to 3 alternative species names." },
      referenceIds: { type: "array", items: { type: "string" }, description: "Up to 5 reference IDs from the supplied catalog." },
      notes: { type: "string", description: "Optional caveat (lighting, partial view, no streak test possible, etc.)." },
    };

    const archaeologyProperties = {
      archaeologyCategory: {
        type: "string",
        enum: [
          "pottery",
          "lithic",
          "coin",
          "inscription",
          "rock_art",
          "bone",
          "metal",
          "terracotta",
          "brick",
          "sculpture",
          "artifact",
          "unknown",
        ],
      },
      objectType: {
        type: "string",
        description:
          "Likely object type from visible evidence only, e.g. possible pottery sherd, blade, coin, brick fragment.",
      },
      material: {
        type: "string",
        description:
          "Visible material: ceramic, stone, copper alloy, iron, terracotta, bone, pigment, etc.",
      },
      possiblePeriod: {
        type: "string",
        description:
          "Possible broad chronology only if visible diagnostic evidence supports it; otherwise say not determinable from photograph.",
      },
      culturalContext: {
        type: "string",
        description:
          "Possible cultural context only if visible and cautiously inferable; otherwise leave empty.",
      },
      visibleFeatures: {
        type: "array",
        items: { type: "string" },
        description:
          "Visible diagnostic features, including form, surface, breakage, marks, inscription traces, wear, patina, or limitations.",
      },
      angleObservations: {
        type: "array",
        items: { type: "string" },
        description:
          "One concise observation per provided angle/frame, noting what that view contributes to the same-object analysis.",
      },
      condition: {
        type: "string",
        description: "Preservation, wear, breaks, patina, abrasion, weathering.",
      },
      manufacturingTechnique: {
        type: "string",
        description: "Wheel-made, handmade, cast, struck, flaked, carved, engraved, painted etc.",
      },
      documentationAdvice: {
        type: "array",
        items: { type: "string" },
        description: "Next steps: scale, context, measurements, angles, rim/base photos, etc.",
      },
      fieldNote: {
        type: "string",
        description:
          "Professional field observation paragraph, 3-5 sentences. Be realistic and cautious; state what cannot be determined from the photograph.",
      },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
      confidenceScore: { type: "integer", description: "Integer 0–100 calibrated to the qualitative confidence." },
      alternatives: {
        type: "array",
        items: { type: "string" },
        description: "Up to 3 alternative interpretations.",
      },
      referenceIds: { type: "array", items: { type: "string" }, description: "Up to 5 reference IDs from the supplied catalog." },
      notes: { type: "string", description: "Caveat about context/uncertainty." },
    };

    const tool = {
      type: "function" as const,
      function: {
        name: "report_identification",
        description: isArchaeology
          ? "Return a preliminary archaeological field observation."
          : "Return the identification of the subject in the image.",
        parameters: {
          type: "object",
          properties: isArchaeology ? archaeologyProperties : natureProperties,
          required: isArchaeology
            ? [
                "archaeologyCategory",
                "objectType",
                "material",
                "possiblePeriod",
                "visibleFeatures",
                "angleObservations",
                "condition",
                "documentationAdvice",
                "fieldNote",
                "confidence",
                "alternatives",
              ]
            : [
                "category",
                "scientificName",
                "englishName",
                "localNames",
                "summary",
                "confidence",
                "alternatives",
              ],
          additionalProperties: false,
        },
      },
    };

    let response: Response;
    try {
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-pro",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: isArchaeology
                    ? `Create an evidence-backed archaeological field observation for the same object from ${dataUrls.length} capture(s). Treat every image as a different angle or video frame of one antiquity, not separate objects. Analyze each angle, then synthesize a complete same-object interpretation. Include angleObservations with one note for each supplied image in order, explaining what that angle adds or what remains unclear. Combine only consistent visible details, mention contradictions or missing scale, and give the strongest supportable interpretation with calibrated confidence. Respond by calling the report_identification tool.`
                    : "Identify the main subject in these capture(s). Respond by calling the report_identification tool.",
                },
                ...dataUrls.map((url) => ({ type: "image_url" as const, image_url: { url } })),
              ],
            },
          ],
          tools: [tool],
          tool_choice: { type: "function", function: { name: "report_identification" } },
        }),
      });
    } catch (e) {
      console.error("AI gateway network error", e);
      return {
        ok: false as const,
        error: "Could not reach the AI service. Check your connection.",
      };
    }

    if (response.status === 429) {
      return {
        ok: false as const,
        error: "Too many requests right now. Please wait a moment and try again.",
      };
    }
    if (response.status === 402) {
      return {
        ok: false as const,
        error: "AI credits exhausted. Add credits in Settings → Workspace → Usage.",
      };
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return { ok: false as const, error: `Identification failed (${response.status}).` };
    }

    let payload: AiToolPayload;
    try {
      payload = await response.json();
    } catch (e) {
      console.error("Bad JSON from gateway", e);
      return { ok: false as const, error: "Got an unreadable response from AI." };
    }

    const toolCall = payload?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments;
    if (!argsStr) {
      console.error("No tool call returned", JSON.stringify(payload).slice(0, 500));
      return {
        ok: false as const,
        error: "AI did not return a structured identification. Try a clearer photo.",
      };
    }

    let parsed: ParsedToolArgs;
    try {
      parsed = (typeof argsStr === "string" ? JSON.parse(argsStr) : argsStr) as ParsedToolArgs;
    } catch (e) {
      console.error("Failed to parse tool args", e, argsStr);
      return { ok: false as const, error: "Could not parse the AI's identification." };
    }

    const objectType = asString(parsed.objectType, "Unidentified object");
    const material = asString(parsed.material, "Unknown");
    const possiblePeriod = asString(parsed.possiblePeriod, "Unknown / requires context");

    const md = (parsed.mineralDetails ?? {}) as Record<string, unknown>;
    const mineralDetails: MineralDetails | undefined =
      parsed.mineralDetails && typeof parsed.mineralDetails === "object"
        ? {
            chemicalFormula: asString(md.chemicalFormula) || undefined,
            crystalSystem: asString(md.crystalSystem) || undefined,
            mohsHardness: asString(md.mohsHardness) || undefined,
            specificGravity: asString(md.specificGravity) || undefined,
            luster: asString(md.luster) || undefined,
            color: asString(md.color) || undefined,
            streak: asString(md.streak) || undefined,
            cleavage: asString(md.cleavage) || undefined,
            fracture: asString(md.fracture) || undefined,
            commonLocalities: asStringArray(md.commonLocalities, 6),
            archaeologicalUse: asString(md.archaeologicalUse) || undefined,
          }
        : undefined;

    const result: IdentifyResult = isArchaeology
      ? {
          mode: "archaeology",
          archaeologyCategory: (parsed.archaeologyCategory as ArchaeologyCategory) ?? "unknown",
          objectType,
          material,
          possiblePeriod,
          culturalContext: asString(parsed.culturalContext) || undefined,
          visibleFeatures: asStringArray(parsed.visibleFeatures, 8),
          angleObservations: asStringArray(parsed.angleObservations, 6),
          condition: asString(parsed.condition, "Not determined from image"),
          manufacturingTechnique: asString(parsed.manufacturingTechnique) || undefined,
          documentationAdvice: asStringArray(parsed.documentationAdvice, 6),
          fieldNote:
            asString(parsed.fieldNote) ||
            "Preliminary observation requires clearer photographs and archaeological context.",
          confidence: (parsed.confidence as Confidence) ?? "low",
          confidenceScore: asNumber(parsed.confidenceScore),
          alternatives: asStringArray(parsed.alternatives, 3),
          notes: asString(parsed.notes) || undefined,
          sources: buildArchaeologySources(`${objectType} ${material} ${possiblePeriod}`),
          referenceIds: filterReferenceIds(parsed.referenceIds, ARCHAEOLOGY_REFERENCE_IDS),
        }
      : {
          mode: "nature",
          category: (parsed.category as Category) ?? "unknown",
          scientificName: asString(parsed.scientificName),
          englishName: asString(parsed.englishName),
          family: asString(parsed.family) || undefined,
          localNames: (parsed.localNames as LocalNames) ?? {},
          summary: asString(parsed.summary),
          confidence: (parsed.confidence as Confidence) ?? "low",
          confidenceScore: asNumber(parsed.confidenceScore),
          alternatives: asStringArray(parsed.alternatives, 3),
          notes: asString(parsed.notes) || undefined,
          sources: buildNatureSources(
            (parsed.category as Category) ?? "unknown",
            asString(parsed.scientificName) || asString(parsed.englishName),
          ),
          referenceIds: filterReferenceIds(parsed.referenceIds, MINERAL_REFERENCE_IDS as readonly string[]),
          mineralDetails,
        };

    return { ok: true as const, result };
  });
