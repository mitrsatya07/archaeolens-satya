import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Loader2, LogIn, Save, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { profileSchema } from "@/lib/validation";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — ArchaeoLens" },
      { name: "description", content: "Edit your ArchaeoLens profile photo and display name. Changes sync securely to your account." },
      { property: "og:title", content: "My Account — ArchaeoLens" },
      { property: "og:description", content: "Manage your ArchaeoLens profile photo and display name." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 512;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const load = useServerFn(getMyProfile);
  const save = useServerFn(updateMyProfile);
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    load()
      .then((p: any) => {
        if (cancelled) return;
        setDisplayName(p?.display_name ?? (user.user_metadata?.full_name as string) ?? user.email?.split("@")[0] ?? "");
        setAvatar(p?.avatar_url ?? (user.user_metadata?.avatar_url as string) ?? undefined);
      })
      .catch(() => toast.error("Profile load nahi ho paya"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, load]);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    try {
      setAvatar(await fileToCompressedDataUrl(file));
    } catch {
      toast.error("Image process nahi ho payi");
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse({ display_name: displayName, avatar_url: avatar });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    try {
      const row: any = await save({ data: parsed.data });
      setDisplayName(row?.display_name ?? "");
      setAvatar(row?.avatar_url ?? undefined);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground">
        <div className="mx-auto flex max-w-md items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your account…
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background px-5 py-10 text-foreground">
        <div className="mx-auto max-w-md space-y-4">
          <h1 className="text-3xl font-black tracking-tight text-primary">My Account</h1>
          <p className="text-sm text-muted-foreground">Sign in to edit your profile photo and name.</p>
          <button
            onClick={() => navigate({ to: "/auth" })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 pb-28 text-foreground">
      <div className="mx-auto max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>

        <header className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-primary">My Account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </header>

        <form onSubmit={onSave} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
              {avatar ? (
                <img src={avatar} alt="Your profile photo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <UserIcon className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent"
              >
                <Camera className="h-4 w-4" /> {avatar ? "Change photo" : "Upload photo"}
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar(undefined)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
            </div>
          </div>

          <div>
            <label htmlFor="display-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Display name
            </label>
            <input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              required
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Ye naam community forum me aapke posts par dikhega.</p>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
