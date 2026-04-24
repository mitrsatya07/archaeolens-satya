import { ExternalLink, Leaf, PawPrint, Gem, HelpCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IdentifyResult } from "@/server/identify.functions";

const LANG_LABELS: Record<string, string> = {
  hi: "हिन्दी (Hindi)",
  ta: "தமிழ் (Tamil)",
  te: "తెలుగు (Telugu)",
  bn: "বাংলা (Bengali)",
  mr: "मराठी (Marathi)",
  kn: "ಕನ್ನಡ (Kannada)",
  ml: "മലയാളം (Malayalam)",
  gu: "ગુજરાતી (Gujarati)",
};

function CategoryBadge({ category }: { category: IdentifyResult["category"] }) {
  const map = {
    plant: { icon: Leaf, label: "Plant", cls: "bg-leaf/15 text-leaf border-leaf/30" },
    animal: { icon: PawPrint, label: "Animal", cls: "bg-fauna/15 text-fauna border-fauna/30" },
    mineral: { icon: Gem, label: "Mineral", cls: "bg-mineral/15 text-mineral border-mineral/30" },
    unknown: { icon: HelpCircle, label: "Unknown", cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const { icon: Icon, label, cls } = map[category];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function ConfidenceChip({ confidence }: { confidence: IdentifyResult["confidence"] }) {
  const map = {
    high: "bg-leaf/15 text-leaf border-leaf/30",
    medium: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
    low: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${map[confidence]}`}>
      <Sparkles className="h-3 w-3" />
      {confidence} confidence
    </span>
  );
}

export function IdentifyResultCard({
  result,
  imageUrl,
  onAgain,
}: {
  result: IdentifyResult;
  imageUrl: string;
  onAgain: () => void;
}) {
  const localEntries = Object.entries(result.localNames).filter(([, v]) => !!v);

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative aspect-square w-full bg-muted sm:aspect-[4/3]">
          <img src={imageUrl} alt="Captured subject" className="h-full w-full object-cover" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <CategoryBadge category={result.category} />
            <ConfidenceChip confidence={result.confidence} />
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <h2 className="font-serif text-2xl italic leading-tight text-foreground">
              {result.scientificName || "Unknown species"}
            </h2>
            {result.englishName && (
              <p className="mt-0.5 text-base font-medium text-foreground">{result.englishName}</p>
            )}
            {result.family && (
              <p className="mt-0.5 text-xs text-muted-foreground">Family: {result.family}</p>
            )}
          </div>

          {result.summary && (
            <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
          )}

          {localEntries.length > 0 && (
            <div className="rounded-xl bg-muted/60 p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Local names
              </h3>
              <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {localEntries.map(([code, name]) => (
                  <li key={code} className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="text-muted-foreground">{LANG_LABELS[code] ?? code}</span>
                    <span className="text-right font-medium text-foreground">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.alternatives.length > 0 && (
            <div>
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Could also be
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.alternatives.map((alt) => (
                  <span
                    key={alt}
                    className="rounded-full border border-border bg-background px-2 py-0.5 text-xs italic text-foreground/80"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Verify with authoritative sources
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {s.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {(result.confidence === "low" || result.notes) && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                {result.notes ??
                  "Low confidence — please verify with the linked scientific sources before relying on this."}
              </p>
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            AI-assisted identification. Not a substitute for expert advice. No information here is medicinal,
            edibility, or safety guidance.
          </p>
        </div>
      </div>

      <Button onClick={onAgain} className="w-full" size="lg">
        Identify another
      </Button>
    </div>
  );
}
