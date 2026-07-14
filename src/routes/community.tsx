import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Plus, ArrowLeft, Send, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthHeader } from "@/components/AuthHeader";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Forum — ArchaeoLens" },
      { name: "description", content: "Ask questions, share finds, and get expert peer review from other archaeology enthusiasts." },
      { property: "og:title", content: "ArchaeoLens Community" },
      { property: "og:description", content: "Peer discussion for archaeological identification and heritage." },
    ],
  }),
  component: CommunityPage,
});

type Thread = {
  id: string;
  title: string;
  body: string;
  category: string;
  author_id: string;
  created_at: string;
};
type Reply = {
  id: string;
  thread_id: string;
  body: string;
  author_id: string;
  created_at: string;
};

const CATEGORIES = ["general", "identification", "site-report", "reading-help", "ethics"] as const;

function CommunityPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadThreads = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("forum_threads").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) toast.error(error.message);
    else setThreads((data as Thread[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { loadThreads(); }, []);

  if (activeThread) {
    return <ThreadView thread={activeThread} userId={userId} onBack={() => { setActiveThread(null); loadThreads(); }} />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link to="/" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground">← ArchaeoLens</Link>
          <AuthHeader />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><Users className="h-4 w-4" /> Community Forum</div>
            <h1 className="mt-2 font-serif text-4xl">Peer discussion & expert review</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Share finds, ask for identification help, and discuss archaeological ethics. Please respect the ASI heritage code — never disclose exact coordinates of unprotected finds.</p>
          </div>
          {userId ? (
            <Button onClick={() => setShowComposer((v) => !v)} className="shrink-0"><Plus className="h-4 w-4" /> New thread</Button>
          ) : (
            <Link to="/auth" className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-card">Sign in to post</Link>
          )}
        </div>

        {showComposer && userId && (
          <ThreadComposer userId={userId} onDone={() => { setShowComposer(false); loadThreads(); }} />
        )}

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>
        ) : threads.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No discussions yet — be the first to start one.
          </div>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setActiveThread(t)}
                  className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-background"
                >
                  <MessageSquare className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">{t.category}</span>
                      <span>{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="mt-1 truncate font-serif text-lg">{t.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.body}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function ThreadComposer({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (title.trim().length < 5) return toast.error("Title too short (min 5 characters).");
    if (body.trim().length < 10) return toast.error("Description too short (min 10 characters).");
    setBusy(true);
    const { error } = await supabase.from("forum_threads").insert({ title: title.trim(), body: body.trim(), category, author_id: userId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Thread posted");
    setTitle(""); setBody("");
    onDone();
  };

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex gap-2">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{c}</button>
        ))}
      </div>
      <Input placeholder="Title (e.g. Help identify this microlith)" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} />
      <Textarea placeholder="Describe context, find spot region (do NOT post exact GPS), material, dimensions…" value={body} onChange={(e) => setBody(e.target.value)} maxLength={5000} className="mt-2 min-h-32" />
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onDone} disabled={busy}>Cancel</Button>
        <Button onClick={submit} disabled={busy}><Send className="h-4 w-4" /> Post</Button>
      </div>
    </div>
  );
}

function ThreadView({ thread, userId, onBack }: { thread: Thread; userId: string | null; onBack: () => void }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("forum_replies").select("*").eq("thread_id", thread.id).order("created_at", { ascending: true });
    if (error) toast.error(error.message);
    else setReplies((data as Reply[]) ?? []);
  };
  useEffect(() => { load(); }, [thread.id]);

  const post = async () => {
    if (!userId) return;
    if (body.trim().length < 2) return;
    setBusy(true);
    const { error } = await supabase.from("forum_replies").insert({ thread_id: thread.id, author_id: userId, body: body.trim() });
    setBusy(false);
    if (error) return toast.error(error.message);
    setBody(""); load();
  };

  const deleteThread = async () => {
    if (!confirm("Delete this thread and all replies?")) return;
    const { error } = await supabase.from("forum_threads").delete().eq("id", thread.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); onBack();
  };

  const deleteReply = async (id: string) => {
    const { error } = await supabase.from("forum_replies").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to forum</button>
          <AuthHeader />
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">{thread.category}</span>
          <span>{new Date(thread.created_at).toLocaleString()}</span>
          {userId === thread.author_id && (
            <button onClick={deleteThread} className="ml-auto inline-flex items-center gap-1 text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
          )}
        </div>
        <h1 className="font-serif text-3xl">{thread.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">{thread.body}</p>

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">{replies.length} {replies.length === 1 ? "reply" : "replies"}</h2>
          <ul className="space-y-3">
            {replies.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>{new Date(r.created_at).toLocaleString()}</span>
                  {userId === r.author_id && (
                    <button onClick={() => deleteReply(r.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-foreground/90">{r.body}</p>
              </li>
            ))}
          </ul>

          {userId ? (
            <div className="mt-4">
              <Textarea placeholder="Add a reply…" value={body} onChange={(e) => setBody(e.target.value)} maxLength={3000} className="min-h-24" />
              <div className="mt-2 flex justify-end"><Button onClick={post} disabled={busy}><Send className="h-4 w-4" /> Reply</Button></div>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground"><Link to="/auth" className="font-semibold text-primary underline">Sign in</Link> to reply.</p>
          )}
        </section>
      </article>
    </main>
  );
}
