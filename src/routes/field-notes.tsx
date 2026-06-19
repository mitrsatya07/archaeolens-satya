import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, NotebookPen, Plus, Trash2, MapPin, Camera, Cloud, CloudOff, UploadCloud, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { listFieldNotes, saveFieldNote, deleteFieldNote } from "@/lib/field-notes.functions";
import { fieldNoteSchema } from "@/lib/validation";

export const Route = createFileRoute("/field-notes")({
  head: () => ({
    meta: [
      { title: "Field Notes — ArchaeoLens" },
      { name: "description", content: "Save and review your archaeological field observations. Cloud-synced when signed in, otherwise stored locally on your device." },
    ],
  }),
  component: FieldNotesPage,
});

type Note = {
  id: string;
  title: string;
  notes?: string | null;
  category?: string | null;
  photo_data_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
};

const STORAGE_KEY = "archaeolens.field-notes.v1";
const CATEGORIES = ["Ceramic / Sherd", "Lithic / Stone tool", "Coin / Metal", "Inscription / Script", "Sculpture / Fragment", "Site / Structure", "Other"];

function loadLocal(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    // migrate older shape (description/imageDataUrl/createdAt)
    return raw.map((n: any) => ({
      id: n.id,
      title: n.title,
      notes: n.notes ?? n.description ?? null,
      category: n.category ?? null,
      photo_data_url: n.photo_data_url ?? n.imageDataUrl ?? null,
      latitude: n.latitude ?? null,
      longitude: n.longitude ?? null,
      created_at: n.created_at ?? n.createdAt ?? new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

function saveLocal(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function FieldNotesPage() {
  const { user, loading: authLoading } = useAuth();
  const list = useServerFn(listFieldNotes);
  const save = useServerFn(saveFieldNote);
  const remove = useServerFn(deleteFieldNote);

  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [notesText, setNotesText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [gpsBusy, setGpsBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load notes from cloud (signed in) or local (signed out)
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setSyncing(true);
      list()
        .then((rows) => setNotes(rows as Note[]))
        .catch((e) => toast.error(e instanceof Error ? e.message : "Failed to load cloud notes"))
        .finally(() => setSyncing(false));
    } else {
      setNotes(loadLocal());
    }
  }, [user, authLoading, list]);

  const captureGPS = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setGpsBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); toast.success("Location captured"); setGpsBusy(false); },
      (err) => { toast.error(err.message || "Could not get location"); setGpsBusy(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { toast.error("Image too large (max 4 MB)"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please pick an image file"); return; }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setTitle(""); setNotesText(""); setCategory(CATEGORIES[0]);
    setImageDataUrl(undefined); setCoords({}); setShowForm(false);
  };

  const addNote = async () => {
    const payload = {
      title: title.trim(),
      notes: notesText.trim() || undefined,
      category,
      latitude: coords.lat,
      longitude: coords.lng,
      photo_data_url: imageDataUrl,
    };
    const parsed = fieldNoteSchema.safeParse(payload);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

    setSaving(true);
    try {
      if (user) {
        const row = await save({ data: parsed.data });
        setNotes((prev) => [row as Note, ...prev]);
        toast.success("Saved to cloud");
      } else {
        const local: Note = {
          id: crypto.randomUUID(),
          ...parsed.data,
          created_at: new Date().toISOString(),
        };
        const next = [local, ...notes];
        setNotes(next); saveLocal(next);
        toast.success("Saved on this device");
      }
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Delete this field note?")) return;
    try {
      if (user) {
        await remove({ data: { id } });
      }
      const next = notes.filter((n) => n.id !== id);
      setNotes(next);
      if (!user) saveLocal(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const uploadLocalToCloud = async () => {
    if (!user) return;
    const local = loadLocal();
    if (local.length === 0) { toast.info("No local notes to upload"); return; }
    setSyncing(true);
    let ok = 0;
    for (const n of local) {
      const parsed = fieldNoteSchema.safeParse({
        title: n.title,
        notes: n.notes ?? undefined,
        category: n.category ?? undefined,
        latitude: n.latitude ?? undefined,
        longitude: n.longitude ?? undefined,
        photo_data_url: n.photo_data_url ?? undefined,
      });
      if (!parsed.success) continue;
      try { await save({ data: parsed.data }); ok++; } catch {}
    }
    localStorage.removeItem(STORAGE_KEY);
    const rows = await list();
    setNotes(rows as Note[]);
    setSyncing(false);
    toast.success(`Uploaded ${ok} of ${local.length} notes to cloud`);
  };

  const hasLocal = typeof window !== "undefined" && loadLocal().length > 0;

  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground">
      <div className="pointer-events-none fixed inset-0 field-grid opacity-25" />
      <div className="relative mx-auto max-w-2xl space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          {user ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Cloud className="h-3.5 w-3.5" /> Synced
            </span>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
              <LogIn className="h-3.5 w-3.5" /> Sign in to sync
            </Link>
          )}
        </div>

        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <NotebookPen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Field Notes</h1>
              <p className="text-sm text-muted-foreground">
                {user ? "Cloud-synced observation log" : "Local-only — sign in to sync across devices"}
              </p>
            </div>
          </div>
        </header>

        {!user && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground font-semibold mb-0.5">
              <CloudOff className="h-3.5 w-3.5" /> Privacy
            </div>
            Notes are saved only in this browser. Clearing site data erases them. Sign in for private cloud sync (RLS-protected).
          </div>
        )}

        {user && hasLocal && (
          <button
            onClick={uploadLocalToCloud}
            disabled={syncing}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            <UploadCloud className="h-4 w-4" /> Upload local notes to cloud
          </button>
        )}

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]">
            <Plus className="h-5 w-5" /> New Field Note
          </button>
        ) : (
          <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="font-bold text-foreground">New Observation</h2>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="e.g. Red sherd near east wall" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</label>
              <textarea value={notesText} onChange={(e) => setNotesText(e.target.value)} rows={3} maxLength={5000} placeholder="Visible features, fabric, condition, context, scale..." className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Photo (optional, max 4 MB)</label>
              <input type="file" accept="image/*" onChange={onPickImage} className="mt-1 block w-full text-xs" />
              {imageDataUrl && <img src={imageDataUrl} alt="Preview" className="mt-2 max-h-40 rounded-lg border border-border" />}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location (optional)</label>
              <button onClick={captureGPS} disabled={gpsBusy} className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent disabled:opacity-50">
                <MapPin className="h-4 w-4" /> {gpsBusy ? "Getting GPS…" : coords.lat ? `Captured: ${coords.lat?.toFixed(5)}, ${coords.lng?.toFixed(5)}` : "Capture GPS"}
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={addNote} disabled={saving} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50">{saving ? "Saving…" : "Save Note"}</button>
              <button onClick={reset} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold">Cancel</button>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {syncing ? "Loading…" : `${notes.length} saved ${notes.length === 1 ? "note" : "notes"}`}
          </p>
          {!syncing && notes.length === 0 && (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No field notes yet. Tap "New Field Note" to start.
            </p>
          )}
          {notes.map((n) => (
            <article key={n.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}{n.category ? ` · ${n.category}` : ""}
                  </p>
                </div>
                <button onClick={() => deleteNote(n.id)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {n.photo_data_url && (
                <img src={n.photo_data_url} alt={n.title} className="mt-2 max-h-48 w-full object-cover rounded-lg border border-border" />
              )}
              {n.notes && <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{n.notes}</p>}
              {n.latitude != null && n.longitude != null && (
                <a href={`https://www.google.com/maps?q=${n.latitude},${n.longitude}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <MapPin className="h-3 w-3" /> {n.latitude.toFixed(5)}, {n.longitude.toFixed(5)}
                </a>
              )}
            </article>
          ))}
        </section>

        <footer className="border-t border-border pt-6 pb-8 text-center text-xs text-muted-foreground space-y-1">
          <p className="flex items-center justify-center gap-1"><Camera className="h-3 w-3" /> Tip: include a scale (coin or ruler) in every artifact photo.</p>
          <p>Always follow heritage laws — see <Link to="/heritage-laws" className="text-primary underline">Heritage Laws</Link> before recording or removing anything.</p>
        </footer>
      </div>
    </main>
  );
}
