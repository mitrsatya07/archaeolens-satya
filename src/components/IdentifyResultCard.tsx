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
    plant: { icon: Leaf, label: "PLANT", cls: "bg-leaf/15 text-leaf border-leaf/40" },
    animal: { icon: PawPrint, label: "ANIMAL", cls: "bg-fauna/15 text-fauna border-fauna/40" },
    mineral: { icon: Gem, label: "MINERAL", cls: "bg-mineral/15 text-mineral border-mineral/40" },
    unknown: { icon: HelpCircle, label: "UNKNOWN", cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const { icon: Icon, label, cls } = map[category];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function ConfidenceChip({ confidence }: { confidence: IdentifyResult["confidence"] }) {
  const map = {
    high: "bg-leaf/15 text-leaf border-leaf/30",
    medium: "bg-warn/20 text-warn-foreground border-warn/40",
    low: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${map[confidence]}`}>
      <Sparkles className="h-3 w-3" />
      {confidence} signal
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
    <div className="mx-auto w-full max-w-xl space-y-4 animate-fade-in">
      <div className="overflow-hidden rounded-2xl border border-cyber/25 bg-card/80 shadow-sm backdrop-blur cyber-glow">
        <div className="relative aspect-square w-full bg-muted sm:aspect-[4/3]">
          <img src={imageUrl} alt="Captured subject" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-background/25" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <CategoryBadge category={result.category} />
            <ConfidenceChip confidence={result.confidence} />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-cyber-muted">Identification lock</p>
            <h2 className="font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-cyber cyber-text-glow">
              {result.scientificName || "Unknown species"}
            </h2>
            {result.englishName && (
              <p className="mt-1 text-base font-medium text-foreground">{result.englishName}</p>
            )}
            {result.family && (
              <p className="mt-0.5 text-xs text-muted-foreground">Classification: {result.family}</p>
            )}
          </div>

          {result.summary && (
            <div className="rounded-xl border border-cyber/15 bg-background/45 p-4"><p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p></div>
          )}

          {localEntries.length > 0 && (
            <div className="rounded-xl border border-cyber/15 bg-background/45 p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Local aliases
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
                Alternate signatures
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.alternatives.map((alt) => (
                  <span
                    key={alt}
                    className="rounded-md border border-cyber/20 bg-background/60 px-2 py-0.5 font-mono text-xs italic text-foreground/80"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Verify sources
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-cyber/25 bg-background/55 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cyber transition-colors hover:bg-cyber/10"
                >
                  {s.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {(result.confidence === "low" || result.notes) && (
            <div className="flex items-start gap-2 rounded-lg border border-warn/40 bg-warn/15 p-3 text-xs text-warn-foreground">
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

      <Button onClick={onAgain} className="w-full border border-cyber bg-cyber font-mono uppercase tracking-[0.16em] text-cyber-foreground hover:bg-cyber/90" size="lg">
        Start new scan
      </Button>
    </div>
  );
}
