import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, NotebookPen, MessageSquare, MessagesSquare, Save, User as UserIcon, Mail, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getAccountOverview, updateProfileName } from "@/lib/account.functions";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — ArchaeoLens" },
      { name: "description", content: "Manage your ArchaeoLens profile, display name, and see your field notes and community activity." },
      { property: "og:title", content: "My Account — ArchaeoLens" },
      { property: "og:description", content: "Your ArchaeoLens profile, saved field notes, and community activity in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

type Overview = {
  profile: { id: string; display_name: string | null; avatar_url: string | null; created_at: string } | null;
  stats: { notes: number; threads: number; replies: number };
};

function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchOverview = useServerFn(getAccountOverview);
  const saveName = useServerFn(updateProfileName);

  const [data, setData] = useState<Overview | null>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchOverview({})
      .then((d) => {
        setData(d as Overview);
        setName(
          (d as Overview).profile?.display_name ||
            (user.user_metadata?.full_name as string) ||
            "",
        );
      })
      .catch(() => toast.error("Account details load nahi ho paaye"));
  }, [user, fetchOverview]);

  const handleSave = async () => {
    if (name.trim().length < 2) {
      toast.error("Naam kam se kam 2 characters ka ho");
      return;
    }
    setBusy(true);
    try {
      await saveName({ data: { display_name: name.trim() } });
      toast.success("Profile updated");
    } catch {
      toast.error("Profile save nahi hua");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  if (loading || !user) return null;

  const joined = new Date(data?.profile?.created_at ?? user.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const initial = (name || user.email || "A").trim().charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-background px-5 py-8 pb-28 text-foreground">
      <div className="mx-auto max-w-2xl space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <header className="flex items-center gap-4 border-b border-foreground/15 pb-6">
          {data?.profile?.avatar_url || user.user_metadata?.avatar_url ? (
            <img
              src={(data?.profile?.avatar_url as string) || (user.user_metadata?.avatar_url as string)}
              alt="Profile photo"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-2xl font-black text-primary">
              {initial}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-black tracking-tight text-primary">
              {name || "My Account"}
            </h1>
            <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" /> {user.email}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Member since {joined}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "Field Notes", value: data?.stats.notes ?? 0, Icon: NotebookPen, to: "/field-notes" as const },
            { label: "Threads", value: data?.stats.threads ?? 0, Icon: MessagesSquare, to: "/community" as const },
            { label: "Replies", value: data?.stats.replies ?? 0, Icon: MessageSquare, to: "/community" as const },
          ].map(({ label, value, Icon, to }) => (
            <Link
              key={label}
              to={to}
              className="rounded-lg border border-foreground/15 bg-card p-4 text-center transition hover:border-primary/40"
            >
              <Icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-2 text-2xl font-black">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
            </Link>
          ))}
        </section>

        <section className="space-y-3 rounded-lg border border-foreground/15 bg-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <UserIcon className="h-4 w-4 text-primary" /> Profile details
          </h2>
          <div>
            <label htmlFor="display_name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Display name
            </label>
            <input
              id="display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              placeholder="Aapka naam"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Community forum me yahi naam dikhega. Email kabhi public nahi hota.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {busy ? "Saving…" : "Save changes"}
          </button>
        </section>

        <section className="space-y-3 rounded-lg border border-foreground/15 bg-card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide">Quick links</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/field-notes" className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-accent">
              My field notes
            </Link>
            <Link to="/community" className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-accent">
              Community
            </Link>
            <Link to="/privacy-policy" className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-accent">
              Privacy policy
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </section>
      </div>
    </main>
  );
}
