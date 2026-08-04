import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getAccountOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("id, display_name, avatar_url, created_at")
      .eq("id", context.userId)
      .maybeSingle();

    const [notes, threads, replies] = await Promise.all([
      context.supabase.from("field_notes").select("id", { count: "exact", head: true }),
      context.supabase
        .from("forum_threads")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId),
      context.supabase
        .from("forum_replies")
        .select("id", { count: "exact", head: true })
        .eq("user_id", context.userId),
    ]);

    return {
      profile: profile ?? null,
      stats: {
        notes: notes.count ?? 0,
        threads: threads.count ?? 0,
        replies: replies.count ?? 0,
      },
    };
  });

export const updateProfileName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ display_name: z.string().trim().min(2).max(60) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, display_name: data.display_name }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
