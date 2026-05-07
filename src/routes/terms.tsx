import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ArchaeoLens" },
      { name: "description", content: "Terms of service for the ArchaeoLens archaeological photo observation app." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-primary hover:underline text-sm">← Home</Link>
          <h1 className="text-lg font-bold">Terms of Service</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground font-semibold">Last updated: May 7, 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>By using ArchaeoLens, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Description of Service</h2>
          <p>ArchaeoLens is an educational tool that uses AI to provide preliminary archaeological photo observations. It includes museum databases, stone tool collections, and reference materials for archaeological study.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Disclaimer — Not Professional Authentication</h2>
          <p><strong>ArchaeoLens does NOT provide certified archaeological authentication, dating, valuation, or legal provenance determination.</strong> All observations are preliminary and AI-generated. True authentication requires physical examination, laboratory analysis, stratigraphic context, and expert review.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Heritage &amp; Legal Compliance</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Users must comply with all applicable heritage protection laws, including the Antiquities and Art Treasures Act (India), UNESCO conventions, and local regulations.</li>
            <li>Do not disturb, remove, or damage artifacts or archaeological sites.</li>
            <li>Report significant finds to local heritage authorities.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">5. User Conduct</h2>
          <p>You agree not to use ArchaeoLens for illegal activities including trafficking of antiquities, forgery assessment, or circumventing heritage protection laws.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">6. Intellectual Property</h2>
          <p>Museum data and stone tool references are sourced from publicly available information. All AI-generated observations are provided for educational purposes only.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">7. Limitation of Liability</h2>
          <p>ArchaeoLens is provided "as is" without warranties. We are not liable for any decisions made based on AI-generated observations. Always consult qualified archaeologists for professional assessments.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">8. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
        </section>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">© 2026 ArchaeoLens. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
