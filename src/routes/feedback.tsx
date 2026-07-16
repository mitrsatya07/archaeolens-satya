import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Send, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Rate ArchaeoLens — Feedback" },
      { name: "description", content: "Rate and review the ArchaeoLens archaeological photo observation app." },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    // In a real app this would save to the database
    setSubmitted(true);
    toast.success("Thank you for your feedback!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="max-w-sm text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Star className="h-8 w-8 text-primary fill-primary" />
          </div>
          <h1 className="text-2xl font-bold">Thank You!</h1>
          <p className="text-muted-foreground">Your {rating}-star review helps us improve ArchaeoLens for the archaeology community.</p>
          <div className="flex gap-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-6 w-6 ${s <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          {review && <p className="text-sm italic text-muted-foreground">"{review}"</p>}
          <Link to="/" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
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
          <Link to="/" className="text-primary hover:underline text-sm flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Home</Link>
          <h1 className="text-lg font-bold">Rate ArchaeoLens</h1>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">How would you rate your experience?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={`h-10 w-10 transition-colors ${
                    s <= (hover || rating)
                      ? "text-primary fill-primary"
                      : "text-muted-foreground/30"
                  }`} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-primary font-medium">
                {rating === 5 ? "Excellent!" : rating === 4 ? "Great!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Name (optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Review */}
          <div className="space-y-1.5">
            <label htmlFor="review" className="text-sm font-medium text-foreground">Your review</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us what you think about ArchaeoLens — what works well, what could improve..."
              rows={4}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <Button type="submit" className="w-full gap-2">
            <Send className="h-4 w-4" /> Submit Review
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your feedback helps improve ArchaeoLens. If you enjoy the app, please also rate us on the Play Store!
          </p>

          <div className="rounded-lg border border-border bg-card p-4 text-center space-y-2">
            <p className="text-sm font-medium text-foreground">Have a query or need help?</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline"
            >
              <Mail className="h-4 w-4" />
              Contact us privately
            </Link>
          </div>

        </form>
      </main>
    </div>
  );
}
