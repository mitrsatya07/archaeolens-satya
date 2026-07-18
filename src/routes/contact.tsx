import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageSquare, Send, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { contactSchema } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

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
  const [category, setCategory] = useState<"general" | "feedback" | "bug" | "collab">("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — real users leave empty
  const mountedAt = useRef<number>(Date.now());
  useEffect(() => { mountedAt.current = Date.now(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: bots fill hidden fields
    if (website.trim() !== "") {
      setSubmitted(true); // silently accept
      return;
    }
    // Min-time: bots submit in <2s
    if (Date.now() - mountedAt.current < 2500) {
      toast.error("Please take a moment to review your message.");
      return;
    }
    // Simple client throttle: 1 submission / 30s per browser
    const last = Number(localStorage.getItem("contact:lastSubmit") || 0);
    if (Date.now() - last < 30_000) {
      toast.error("Please wait a moment before sending another message.");
      return;
    }
    const parsed = contactSchema.safeParse({ name, email, category, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name || null,
      email: parsed.data.email || null,
      category: parsed.data.category,
      message: parsed.data.message,
    });
    setSending(false);
    if (error) {
      toast.error("Could not send message. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Message Received!</h1>
          <p className="text-muted-foreground">
            Thanks for reaching out. Your message has been delivered privately to the ArchaeoLens team.
          </p>
          <p className="text-xs text-muted-foreground">
            If you shared your email, we usually respond within 24–48 hours.
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
        {/* Private inbox banner */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-semibold text-sm">Private & Secure</span>
          </div>
          <p className="text-sm text-foreground">
            Send us a message directly through this form.
          </p>
          <p className="text-xs text-muted-foreground">
            Your message is delivered privately to the ArchaeoLens team. Share your email only if you'd like a reply.
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
                  onClick={() => setCategory(c.id as typeof category)}
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
              maxLength={100}
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
              maxLength={255}
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
              maxLength={2000}
              placeholder="Describe your query, feedback, or bug in detail..."
              rows={5}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <Button type="submit" disabled={sending} className="w-full gap-2">
            <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Message"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your message is sent privately to the ArchaeoLens team. We don't share your details.
          </p>

        </form>
      </main>
    </div>
  );
}
