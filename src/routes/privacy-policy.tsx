import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ArchaeoLens" },
      { name: "description", content: "Privacy policy for the ArchaeoLens archaeological photo observation app." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-primary hover:underline text-sm">← Home</Link>
          <h1 className="text-lg font-bold">Privacy Policy</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground font-semibold">Last updated: May 7, 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Information We Collect</h2>
          <p>ArchaeoLens processes photos you capture or upload <strong>solely for the purpose of generating archaeological observations</strong>. Images are sent to our AI analysis service and are <strong>not stored permanently</strong> on our servers after processing.</p>
          <p>We do not collect personal information such as name, email, or phone number unless you create an account.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Camera &amp; Photo Access</h2>
          <p>The app requests camera permission to capture photos of artifacts for analysis. Photos are processed in real-time and are not saved to our servers beyond the analysis session. You may also upload images from your device gallery.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. How We Use Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide AI-powered archaeological photo observations</li>
            <li>To display museum databases, stone tool collections, and reference data</li>
            <li>To improve the accuracy and quality of our analysis service</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Data Sharing</h2>
          <p>We do <strong>not sell, trade, or share</strong> your personal data or images with third parties, except as required to provide the AI analysis service or as required by law.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">5. Data Security</h2>
          <p>We use industry-standard encryption (HTTPS/TLS) for all data transmission. Images are processed in memory and are not retained after analysis is complete.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">6. Children's Privacy</h2>
          <p>ArchaeoLens is an educational tool suitable for all ages. We do not knowingly collect personal information from children under 13. The app can be used without creating an account.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">7. Your Rights</h2>
          <p>You may request deletion of any data associated with your account by contacting us. You can revoke camera permissions at any time through your device settings.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">9. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please reach out through the app's About page or contact us at our support channels.</p>
        </section>

        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">© 2026 ArchaeoLens. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
