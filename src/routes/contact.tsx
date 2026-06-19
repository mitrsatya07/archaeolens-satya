import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, MessageSquare, Send, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Queries — ArchaeoLens" },
      { name: "description", content: "Get in touch with ArchaeoLens for feedback, queries, bug reports, or collaboration." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write a message.");
      return;
    }
    setSubmitted(true);
    toast.success("Message prepared! Opening your email app…");
    // Open mailto with pre-filled subject and body
    const subject = encodeURIComponent(`ArchaeoLens — ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    const body = encodeURIComponent(`Name: ${name || "Not provided"}\nEmail: ${email || "Not provided"}\nCategory: ${category}\n\nMessage:\n${message}`);
    window.location.href = `mailto:satyaprakashkumawat07@gmail.com?subject=${subject}&body=${body}`;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Message Ready!</h1>
          <p className="text-muted-foreground">
            Your email draft has been prepared. If it didn’t open automatically, you can manually email us at:
          </p>
          <a
            href="mailto:satyaprakashkumawat07@gmail.com"
            className="inline-block text-primary font-semibold underline break-all"
          >
            satyaprakashkumawat07@gmail.com
          </a>
          <p className="text-xs text-muted-foreground">
            We usually respond within 24–48 hours.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-primary hover:underline text-sm flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <h1 className="text-lg font-bold">Contact & Queries</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Email banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Mail className="h-5 w-5" />
            <span className="font-semibold text-sm">Direct Email</span>
          </div>
          <a
            href="mailto:satyaprakashkumawat07@gmail.com"
            className="text-base font-bold text-primary underline break-all"
          >
            satyaprakashkumawat07@gmail.com
          </a>
          <p className="text-xs text-muted-foreground">
            For feedback, queries, bug reports, collaborations, or takedown requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Query type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "general", label: "General Query", icon: HelpCircle },
                { id: "feedback", label: "Feedback", icon: MessageSquare },
                { id: "bug", label: "Bug Report", icon: MessageSquare },
                { id: "collab", label: "Collaboration", icon: MessageSquare },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                    category === c.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <c.icon className="h-4 w-4" />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="c-name" className="text-sm font-medium text-foreground">Name (optional)</label>
            <input
              id="c-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="c-email" className="text-sm font-medium text-foreground">Your email (optional)</label>
            <input
              id="c-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="c-message" className="text-sm font-medium text-foreground">Your message</label>
            <textarea
              id="c-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your query, feedback, or bug in detail..."
              rows={5}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Send className="h-4 w-4" /> Send via Email
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            This opens your default email app with a pre-filled message to{" "}
            <span className="text-foreground font-medium">satyaprakashkumawat07@gmail.com</span>.
          </p>
        </form>
      </main>
    </div>
  );
}
