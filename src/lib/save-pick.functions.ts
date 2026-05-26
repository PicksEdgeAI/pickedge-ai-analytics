import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SavePickSchema = z.object({
  pick_type: z.string().min(1).max(50),
  pick_label: z.string().min(1).max(200),
  sport: z.string().min(1).max(20).optional(),
  odds: z.number().optional(),
  confidence: z.number().min(0).max(100).optional(),
  grade: z.string().max(5).optional(),
  reasoning: z.string().max(2000).optional(),
});

export const savePick = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SavePickSchema.parse(input))
  .handler(async ({ data, context }) => {
    // Insert into ai_picks using admin (RLS = admin-only write)
    const { data: picked, error: pickErr } = await supabaseAdmin
      .from("ai_picks")
      .insert({
        pick_type: data.pick_type,
        pick_label: data.pick_label,
        sport: data.sport ?? null,
        odds: data.odds ?? null,
        confidence: data.confidence ?? null,
        grade: data.grade ?? null,
        reasoning: data.reasoning ?? null,
      })
      .select("id")
      .single();
    if (pickErr || !picked) throw new Error(pickErr?.message ?? "Failed to create pick");

    // Insert saved_pick as the user (RLS enforces auth.uid = user_id)
    const { error: saveErr } = await context.supabase
      .from("saved_picks")
      .insert({ user_id: context.userId, ai_pick_id: picked.id });
    if (saveErr) throw new Error(saveErr.message);

    return { ok: true, ai_pick_id: picked.id };
  });