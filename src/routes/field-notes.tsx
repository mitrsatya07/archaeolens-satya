import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, NotebookPen, Plus, Trash2, MapPin, Camera } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/field-notes")({
  head: () => ({
    meta: [
      { title: "Field Notes — ArchaeoLens" },
      { name: "description", content: "Save and review your archaeological field observations locally on your device. Photo, GPS, notes, and date for every record." },
    ],
  }),
  component: FieldNotesPage,
});

type Note = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageDataUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

const STORAGE_KEY = "archaeolens.field-notes.v1";
const CATEGORIES = ["Ceramic / Sherd", "Lithic / Stone tool", "Coin / Metal", "Inscription / Script", "Sculpture / Fragment", "Site / Structure", "Other"];

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function FieldNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});
  const [gpsBusy, setGpsBusy] = useState(false);

  useEffect(() => { setNotes(loadNotes()); }, []);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device");
      return;
    }
    setGpsBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success("Location captured");
        setGpsBusy(false);
      },
      (err) => {
        toast.error(err.message || "Could not get location");
        setGpsBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image too large (max 4 MB). Please pick a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setTitle(""); setDescription(""); setCategory(CATEGORIES[0]);
    setImageDataUrl(undefined); setCoords({}); setShowForm(false);
  };

  const addNote = () => {
    if (!title.trim()) { toast.error("Title required"); return; }
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      category,
      imageDataUrl,
      latitude: coords.lat,
      longitude: coords.lng,
      createdAt: new Date().toISOString(),
    };
    const next = [newNote, ...notes];
    setNotes(next); saveNotes(next);
    toast.success("Field note saved on this device");
    reset();
  };

  const deleteNote = (id: string) => {
    if (!confirm("Delete this field note?")) return;
    const next = notes.filter((n) => n.id !== id);
    setNotes(next); saveNotes(next);
  };

  return (
    <main className="min-h-screen field-shell px-5 py-8 text-foreground">
      <div className="pointer-events-none fixed inset-0 field-grid opacity-25" />
      <div className="relative mx-auto max-w-2xl space-y-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <NotebookPen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-primary">Field Notes</h1>
              <p className="text-sm text-muted-foreground">Personal observation log — stored only on this device</p>
            </div>
          </div>
        </header>

        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Privacy:</strong> Field notes are saved in your browser's local storage. They never leave your device. Clearing browser data will erase them.
        </div>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]">
            <Plus className="h-5 w-5" /> New Field Note
          </button>
        ) : (
          <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="font-bold text-foreground">New Observation</h2>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Red sherd near east wall" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Visible features, fabric, condition, context, scale..." className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Photo (optional)</label>
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
              <button onClick={addNote} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Save Note</button>
              <button onClick={reset} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold">Cancel</button>
            </div>
          </section>
        )}

        {/* Notes List */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{notes.length} saved {notes.length === 1 ? "note" : "notes"}</p>
          {notes.length === 0 && (
            <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No field notes yet. Tap "New Field Note" to start your observation log.
            </p>
          )}
          {notes.map((n) => (
            <article key={n.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()} · {n.category}
                  </p>
                </div>
                <button onClick={() => deleteNote(n.id)} className="text-muted-foreground hover:text-destructive p-1" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {n.imageDataUrl && (
                <img src={n.imageDataUrl} alt={n.title} className="mt-2 max-h-48 w-full object-cover rounded-lg border border-border" />
              )}
              {n.description && <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{n.description}</p>}
              {n.latitude !== undefined && (
                <a href={`https://www.google.com/maps?q=${n.latitude},${n.longitude}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  <MapPin className="h-3 w-3" /> {n.latitude.toFixed(5)}, {n.longitude!.toFixed(5)}
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
