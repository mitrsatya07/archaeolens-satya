import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { authSchema } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ArchaeoLens" },
      { name: "description", content: "Sign in or create an account to sync your archaeological field notes across devices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/field-notes" });
  }, [user, navigate]);

  const handleGoogle = async () => {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/field-notes" });
    if (res.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/field-notes` },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Welcome back");
      }
      navigate({ to: "/field-notes" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <header className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-primary">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Sync your field notes across devices. Your data stays private to you (RLS-protected).
          </p>
        </header>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-accent disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8L6.2 33C9.5 39.5 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.9 35.6 44 30.3 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <span className="relative mx-auto block w-fit bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">or email</span>
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
            <input
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            />
            {mode === "signup" && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Minimum 8 characters. Passwords are checked against the HaveIBeenPwned breach database.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {mode === "signin" ? <LogIn className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "signin" ? "No account?" : "Have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
