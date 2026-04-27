import {
  ExternalLink,
  Leaf,
  PawPrint,
  Gem,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Landmark,
  Pickaxe,
  ScrollText,
  Ruler,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArchaeologyResult, Confidence, IdentifyResult, NatureResult } from "@/server/identify.functions";


function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function archaeologyReport(result: ArchaeologyResult) {
  return [
    "ArchaeoLens Archaeological Photo Observation",
    "",
    `Object type: ${result.objectType}`,
    `Category: ${result.archaeologyCategory}`,
    `Material: ${result.material}`,
    `Possible period: ${result.possiblePeriod}`,
    result.culturalContext ? `Cultural context: ${result.culturalContext}` : "",
    `Condition: ${result.condition}`,
    result.manufacturingTechnique ? `Technique: ${result.manufacturingTechnique}` : "",
    `Confidence: ${result.confidence}`,
    "",
    "Field note:",
    result.fieldNote,
    "",
    "Visible features:",
    ...result.visibleFeatures.map((x) => `- ${x}`),
    "",
    "Documentation advice:",
    ...result.documentationAdvice.map((x) => `- ${x}`),
    "",
    "Sources:",
    ...result.sources.map((s) => `- ${s.label}: ${s.url}`),
    "",
    "Authenticity note: Photo observation is not authentication. Reliable attribution requires context, stratigraphy, measurements, provenance, comparative typology, and expert review.",
  ].filter(Boolean).join("\n");
}

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

function ConfidenceChip({ confidence }: { confidence: IdentifyResult["confidence"] }) {
  const map = {
    high: "bg-leaf/15 text-leaf border-leaf/40",
    medium: "bg-warn/20 text-warn-foreground border-warn/40",
    low: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[confidence]}`}>
      <Sparkles className="h-3 w-3" />
      {confidence} evidence
    </span>
  );
}

function NatureCategoryBadge({ category }: { category: NatureResult["category"] }) {
  const map = {
    plant: { icon: Leaf, label: "PLANT", cls: "bg-leaf/15 text-leaf border-leaf/40" },
    animal: { icon: PawPrint, label: "ANIMAL", cls: "bg-fauna/15 text-fauna border-fauna/40" },
    mineral: { icon: Gem, label: "MINERAL", cls: "bg-mineral/15 text-mineral border-mineral/40" },
    unknown: { icon: HelpCircle, label: "UNKNOWN", cls: "bg-muted text-muted-foreground border-border" },
  } as const;
  const { icon: Icon, label, cls } = map[category];
  return <Badge icon={<Icon className="h-3.5 w-3.5" />} label={label} cls={cls} />;
}

function ArchaeologyBadge({ category }: { category: ArchaeologyResult["archaeologyCategory"] }) {
  return <Badge icon={<Landmark className="h-3.5 w-3.5" />} label={category.replace("_", " ")} cls="bg-primary/10 text-primary border-primary/30" />;
}

function Badge({ icon, label, cls }: { icon: React.ReactNode; label: string; cls: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
      {icon}
      {label}
    </span>
  );
}

function SourceLinks({ sources }: { sources: { label: string; url: string }[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Research references</h3>
      <div className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-accent"
          >
            {s.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function IdentifyResultCard({ result, imageUrl, onAgain }: { result: IdentifyResult; imageUrl: string; onAgain: () => void }) {
  if (result.mode === "archaeology") {
    return <ArchaeologyResultCard result={result} imageUrl={imageUrl} onAgain={onAgain} />;
  }
  return <NatureResultCard result={result} imageUrl={imageUrl} onAgain={onAgain} />;
}

function Frame({ imageUrl, children }: { imageUrl: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyber/25 bg-card/80 shadow-sm backdrop-blur cyber-glow">
      <div className="relative aspect-square w-full bg-muted sm:aspect-[4/3]">
        <img src={imageUrl} alt="Captured subject" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-background/25" />
        {children}
      </div>
    </div>
  );
}

function NatureResultCard({ result, imageUrl, onAgain }: { result: NatureResult; imageUrl: string; onAgain: () => void }) {
  const localEntries = Object.entries(result.localNames).filter(([, v]) => !!v);

  return (
    <div className="mx-auto w-full max-w-xl space-y-4 animate-fade-in">
      <div className="overflow-hidden rounded-2xl border border-cyber/25 bg-card/80 shadow-sm backdrop-blur cyber-glow">
        <div className="relative aspect-square w-full bg-muted sm:aspect-[4/3]">
          <img src={imageUrl} alt="Captured subject" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-background/25" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <NatureCategoryBadge category={result.category} />
            <ConfidenceChip confidence={result.confidence} />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.28em] text-cyber-muted">Identification lock</p>
            <h2 className="font-mono text-2xl font-bold uppercase leading-tight tracking-tight text-cyber cyber-text-glow">
              {result.scientificName || "Unknown species"}
            </h2>
            {result.englishName && <p className="mt-1 text-base font-medium text-foreground">{result.englishName}</p>}
            {result.family && <p className="mt-0.5 text-xs text-muted-foreground">Classification: {result.family}</p>}
          </div>

          {result.summary && <div className="rounded-xl border border-cyber/15 bg-background/45 p-4"><p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p></div>}

          {localEntries.length > 0 && (
            <div className="rounded-xl border border-cyber/15 bg-background/45 p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Local aliases</h3>
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

          <Alternatives alternatives={result.alternatives} title="Alternate signatures" />
          <SourceLinks sources={result.sources} />
          <Caution confidence={result.confidence} notes={result.notes} archaeology={false} />
        </div>
      </div>
      <Button onClick={onAgain} className="w-full border border-cyber bg-cyber font-mono uppercase tracking-[0.16em] text-cyber-foreground hover:bg-cyber/90" size="lg">Start new scan</Button>
    </div>
  );
}

function ArchaeologyResultCard({ result, imageUrl, onAgain }: { result: ArchaeologyResult; imageUrl: string; onAgain: () => void }) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-4 animate-fade-in">
      <div className="field-paper overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="relative aspect-square w-full bg-muted sm:aspect-[4/3]">
          <img src={imageUrl} alt="Captured artifact" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 field-grid opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/15" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <ArchaeologyBadge category={result.archaeologyCategory} />
            <ConfidenceChip confidence={result.confidence} />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Archaeological photo observation</p>
            <h2 className="text-2xl font-bold leading-tight text-primary">{result.objectType}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{result.material} · {result.possiblePeriod}</p>
            {result.culturalContext && <p className="mt-0.5 text-xs text-muted-foreground">Context: {result.culturalContext}</p>}
          </div>

          <InfoGrid result={result} />

          <Panel icon={<ScrollText className="h-4 w-4 text-primary" />} title="Field note">
            <p className="text-sm leading-relaxed text-foreground/90">{result.fieldNote}</p>
          </Panel>

          <Panel icon={<Pickaxe className="h-4 w-4 text-primary" />} title="Observed diagnostic features">
            <BulletList items={result.visibleFeatures} />
          </Panel>

          {result.documentationAdvice.length > 0 && (
            <Panel icon={<Ruler className="h-4 w-4 text-primary" />} title="Next documentation steps">
              <BulletList items={result.documentationAdvice} />
            </Panel>
          )}

          <Panel icon={<ShieldCheck className="h-4 w-4 text-primary" />} title="Authenticity note">
            <p className="text-sm leading-relaxed text-foreground/90">
              This photo can support observation, not authentication. Reliable attribution needs measurements,
              stratigraphic or findspot context, provenance, comparative typology, and expert review.
            </p>
          </Panel>

          <Alternatives alternatives={result.alternatives} title="Alternate interpretations" />
          <SourceLinks sources={result.sources} />

          <Button
            type="button"
            variant="outline"
            className="w-full border-primary/25 bg-card text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent"
            onClick={() => downloadText(`lensid-${result.objectType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-field-record.txt`, archaeologyReport(result))}
          >
            <Download className="h-4 w-4" /> Export field record
          </Button>

          <Caution confidence={result.confidence} notes={result.notes} archaeology />
        </div>
      </div>
      <Button onClick={onAgain} className="w-full border border-primary bg-primary font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90" size="lg">Start new observation</Button>
    </div>
  );
}

function InfoGrid({ result }: { result: ArchaeologyResult }) {
  const rows = [
    ["Material", result.material],
    ["Period", result.possiblePeriod],
    ["Condition", result.condition],
    ["Technique", result.manufacturingTechnique ?? "Not visible"],
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg border border-border bg-background/55 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}

function Panel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background/55 p-4">
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">No reliable details visible.</p>;
  return (
    <ul className="space-y-1.5 text-sm text-foreground/90">
      {items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />{item}</li>)}
    </ul>
  );
}

function Alternatives({ alternatives, title }: { alternatives: string[]; title: string }) {
  if (!alternatives.length) return null;
  return (
    <div>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {alternatives.map((alt) => <span key={alt} className="rounded-md border border-border bg-background/70 px-2 py-0.5 text-xs italic text-foreground/80">{alt}</span>)}
      </div>
    </div>
  );
}

function Caution({ confidence, notes, archaeology }: { confidence: Confidence; notes?: string; archaeology: boolean }) {
  return (
    <>
      {(confidence === "low" || notes || archaeology) && (
        <div className="flex items-start gap-2 rounded-lg border border-warn/40 bg-warn/15 p-3 text-xs text-warn-foreground">
          {archaeology ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
          <p>{notes ?? (archaeology ? "Preliminary AI-assisted observation only. Final identification requires archaeological context, measurements, stratigraphy, and expert verification." : "Low confidence — please verify with the linked scientific sources before relying on this.")}</p>
        </div>
      )}
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {archaeology
          ? "AI-assisted archaeological observation. Not authentication, dating proof, legal advice, valuation, provenance, or final expert classification."
          : "AI-assisted identification. Not a substitute for expert advice. No information here is medicinal, edibility, or safety guidance."}
      </p>
    </>
  );
}
