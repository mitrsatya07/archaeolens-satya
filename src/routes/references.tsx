import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";
import { REFERENCES } from "@/data/references";

export const Route = createFileRoute("/references")({
  head: () => ({
    meta: [
      { title: "References & Bibliography — ArchaeoLens" },
      { name: "description", content: "Full bibliography of authoritative sources cited across ArchaeoLens — site reports, monographs, heritage statutes, and primary excavation memoirs." },
      { property: "og:title", content: "References & Bibliography — ArchaeoLens" },
      { property: "og:description", content: "Author-year citations for every archaeological claim, with links to primary sources where available." },
      { property: "og:url", content: "https://archaeolens07.lovable.app/references" },
    ],
    links: [{ rel: "canonical", href: "https://archaeolens07.lovable.app/references" }],
  }),
  component: ReferencesPage,
});

const TYPE_LABEL: Record<string, string> = {
  book: "Book",
  article: "Journal Article",
  report: "Excavation Report",
  official: "Statute / Official",
  web: "Web Resource",
};

function ReferencesPage() {
  const grouped = REFERENCES.reduce<Record<string, typeof REFERENCES>>((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">References</h1>
              <p className="text-sm text-muted-foreground">
                Sources cited across the site directory, timeline, typology, and heritage-law pages.
              </p>
            </div>
          </div>
          <p className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            All factual claims in ArchaeoLens are drawn from these sources, the Archaeological Survey of India,
            UNESCO World Heritage Centre listings, IGNCA archives, and peer-reviewed publications. Identifications
            generated from photos remain interpretive and should be verified against primary literature before
            scholarly use.
          </p>
        </header>

        {Object.entries(grouped).map(([type, items]) => (
          <section key={type} className="space-y-3">
            <h2 className="border-b border-border pb-1 text-sm font-bold uppercase tracking-wide text-primary">
              {TYPE_LABEL[type] || type}
            </h2>
            <ol className="space-y-2">
              {items
                .sort((a, b) => a.author.localeCompare(b.author))
                .map((r) => (
                  <li key={r.id} className="text-sm leading-relaxed text-foreground/90">
                    <span className="font-semibold text-foreground">{r.author}</span> ({r.year}).{" "}
                    <em>{r.title}</em>
                    {r.publication ? `. ${r.publication}` : ""}
                    {r.publisher ? `. ${r.publisher}` : ""}.
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 inline-flex items-center gap-0.5 text-primary hover:underline"
                      >
                        link <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </li>
                ))}
            </ol>
          </section>
        ))}

        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>
            Citation issues or missing sources?{" "}
            <Link to="/contact" className="text-primary underline">Let us know</Link>.
          </p>
        </footer>
      </div>
    </main>
  );
}
