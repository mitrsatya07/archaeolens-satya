import { createServerFn } from "@tanstack/react-start";

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

export interface NatureResult {
  mode: "nature";
  category: Category;
  scientificName: string;
  englishName: string;
  family?: string;
  localNames: LocalNames;
  summary: string;
  confidence: Confidence;
  alternatives: string[];
  sources: { label: string; url: string }[];
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
  condition: string;
  manufacturingTechnique?: string;
  documentationAdvice: string[];
  fieldNote: string;
  confidence: Confidence;
  alternatives: string[];
  sources: { label: string; url: string }[];
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
  .inputValidator((data: { imageBase64: string; mode?: ScanMode }) => {
    if (!data?.imageBase64 || typeof data.imageBase64 !== "string") {
      throw new Error("imageBase64 is required");
    }
    if (data.imageBase64.length > 8_000_000) {
      throw new Error("Image too large");
    }
    return { ...data, mode: (data.mode ?? "archaeology") as ScanMode };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error: "AI is not configured. LOVABLE_API_KEY missing on server.",
      };
    }

    const dataUrl = data.imageBase64.startsWith("data:")
      ? data.imageBase64
      : `data:image/jpeg;base64,${data.imageBase64}`;

    const isArchaeology = data.mode === "archaeology";
    const systemPrompt = isArchaeology
      ? `You are an archaeological field documentation assistant for professional photo observation. Analyze only visible evidence in photos of artifacts, pottery, lithics, coins, inscriptions, rock art, terracotta, bricks, sculpture, bone, or metal objects. Always call the report_identification tool. Be decisive about visible object class, material, condition, and manufacturing traces when the photo supports it, but never claim final authentication, exact dating, legality, market value, provenance, or ownership from an image. Use professional calibrated wording: "consistent with", "probable", "possible", "not determinable from photograph", and "requires stratigraphic/site context". Prioritize diagnostic details: fabric, inclusions, rim/base/profile, flake scars, retouch, casting/striking marks, tool marks, inscriptions, iconography, patina/weathering, breakage, wear, scale needs, and photo limitations. Confidence must be evidence-based: use high when several clear diagnostic features support the same interpretation, medium when object class/material are clear but chronology/culture need context, and low only for unclear, partial, modern-looking, or non-archaeological images. If it is not clearly an archaeological object, report unknown with low confidence.`
      : `You are an expert naturalist and mineralogist. You identify a single subject in a photo: a plant, an animal, or a mineral/rock. You always respond by calling the report_identification tool. Be honest about uncertainty. Never give medicinal, edibility, or toxicity advice. Local names should be the most widely used common name in that language; only include languages where you are confident a real local name exists. Keep the summary factual: family/group, where it's typically found, and 1-2 distinguishing features. 3-5 sentences max.`;

    const natureProperties = {
      category: {
        type: "string",
        enum: ["plant", "animal", "mineral", "unknown"],
        description: "What kind of subject is in the image.",
      },
      scientificName: {
        type: "string",
        description: "Binomial scientific name (Latin) or mineral species name. Empty if unknown.",
      },
      englishName: {
        type: "string",
        description: "Common English name. Empty if unknown.",
      },
      family: {
        type: "string",
        description: "Taxonomic family or mineral group, if relevant.",
      },
      localNames: {
        type: "object",
        description: "Common name in major Indian languages, by ISO code.",
        properties: {
          hi: { type: "string", description: "Hindi" },
          ta: { type: "string", description: "Tamil" },
          te: { type: "string", description: "Telugu" },
          bn: { type: "string", description: "Bengali" },
          mr: { type: "string", description: "Marathi" },
          kn: { type: "string", description: "Kannada" },
          ml: { type: "string", description: "Malayalam" },
          gu: { type: "string", description: "Gujarati" },
        },
        additionalProperties: false,
      },
      summary: {
        type: "string",
        description: "3-5 sentence factual description.",
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
      },
      alternatives: {
        type: "array",
        items: { type: "string" },
        description: "Up to 3 alternative scientific names if uncertain.",
      },
      notes: {
        type: "string",
        description: "Optional caveat for the user (e.g., poor lighting, partial view).",
      },
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
      alternatives: {
        type: "array",
        items: { type: "string" },
        description: "Up to 3 alternative interpretations.",
      },
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
                    ? "Create an evidence-backed archaeological field observation for the main object in this photo. Give the strongest supportable interpretation from visible diagnostic details, with calibrated confidence and clear reference-search terms. Respond by calling the report_identification tool."
                    : "Identify the main subject in this photo. Respond by calling the report_identification tool.",
                },
                { type: "image_url", image_url: { url: dataUrl } },
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

    const result: IdentifyResult = isArchaeology
      ? {
          mode: "archaeology",
          archaeologyCategory: (parsed.archaeologyCategory as ArchaeologyCategory) ?? "unknown",
          objectType,
          material,
          possiblePeriod,
          culturalContext: asString(parsed.culturalContext) || undefined,
          visibleFeatures: asStringArray(parsed.visibleFeatures, 8),
          condition: asString(parsed.condition, "Not determined from image"),
          manufacturingTechnique: asString(parsed.manufacturingTechnique) || undefined,
          documentationAdvice: asStringArray(parsed.documentationAdvice, 6),
          fieldNote:
            asString(parsed.fieldNote) ||
            "Preliminary observation requires clearer photographs and archaeological context.",
          confidence: (parsed.confidence as Confidence) ?? "low",
          alternatives: asStringArray(parsed.alternatives, 3),
          notes: asString(parsed.notes) || undefined,
          sources: buildArchaeologySources(`${objectType} ${material} ${possiblePeriod}`),
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
          alternatives: asStringArray(parsed.alternatives, 3),
          notes: asString(parsed.notes) || undefined,
          sources: buildNatureSources(
            (parsed.category as Category) ?? "unknown",
            asString(parsed.scientificName) || asString(parsed.englishName),
          ),
        };

    return { ok: true as const, result };
  });
