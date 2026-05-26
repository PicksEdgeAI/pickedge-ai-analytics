import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const InputSchema = z.object({
  sport: z.string().min(1).max(20),
  risk: z.enum(["Safe", "Balanced", "Lottery"]),
  market: z.string().min(1).max(40),
  count: z.number().int().min(1).max(8),
});

export type GeneratedPick = {
  pick_type: string;
  pick_label: string;
  sport: string;
  odds: number | null;
  confidence: number;
  grade: string;
  reasoning: string;
};

const PicksResponse = z.object({
  picks: z.array(
    z.object({
      pick_type: z.string(),
      pick_label: z.string(),
      odds: z.number().nullable().optional(),
      confidence: z.number().min(0).max(100),
      grade: z.string(),
      reasoning: z.string(),
    }),
  ),
});

export const generateAiPicks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

    // Load recent games + odds + props for the sport from Supabase
    const sportKey = data.sport.toLowerCase();
    const { data: games } = await supabaseAdmin
      .from("games")
      .select("id, home_team, away_team, commence_time, sport, league")
      .ilike("sport", `%${sportKey}%`)
      .gte("commence_time", new Date(Date.now() - 2 * 3600_000).toISOString())
      .lte("commence_time", new Date(Date.now() + 48 * 3600_000).toISOString())
      .order("commence_time", { ascending: true })
      .limit(20);

    const gameIds = (games ?? []).map((g) => g.id);
    const [oddsRes, propsRes] = await Promise.all([
      gameIds.length
        ? supabaseAdmin
            .from("odds")
            .select("game_id, bookmaker, market, outcome_name, price, point")
            .in("game_id", gameIds)
            .limit(200)
        : Promise.resolve({ data: [] as any[] }),
      gameIds.length
        ? supabaseAdmin
            .from("player_props")
            .select("game_id, player_name, team, prop_type, line, over_price, under_price")
            .in("game_id", gameIds)
            .limit(100)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const context = {
      sport: data.sport,
      risk: data.risk,
      market: data.market,
      count: data.count,
      games: (games ?? []).slice(0, 10),
      odds: (oddsRes.data ?? []).slice(0, 80),
      props: (propsRes.data ?? []).slice(0, 40),
    };

    const hasLiveData = context.games.length > 0;

    const systemPrompt = `You are a sports analytics engine for an ANALYTICS & RESEARCH platform (not a sportsbook). Generate ${data.count} ${data.market} pick recommendations for ${data.sport} at "${data.risk}" risk level. Risk: Safe=high confidence chalk, Balanced=value plays, Lottery=high variance longshots. Return STRICT JSON only matching: {"picks":[{"pick_type":"spread|moneyline|total|player_prop","pick_label":"Team X -2.5","odds":-110,"confidence":72,"grade":"A|B|C","reasoning":"2-3 sentence analysis citing matchup/trends"}]}. Use the live odds/props data provided. Include responsible-gaming framing in reasoning when relevant. Never claim guarantees.`;

    const userPrompt = hasLiveData
      ? `Here is the live market data from our database:\n\n${JSON.stringify(context, null, 2)}\n\nGenerate ${data.count} picks. Return ONLY raw JSON, no markdown fences.`
      : `No live ${data.sport} games are in our database right now (cron may not have synced yet). Generate ${data.count} illustrative ${data.market} picks for ${data.sport} using plausible matchups and odds, clearly labeled as analytical examples. Return ONLY raw JSON, no markdown fences.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Anthropic error:", res.status, text);
      throw new Error(`AI service error (${res.status})`);
    }

    const body = (await res.json()) as { content: Array<{ type: string; text: string }> };
    const raw = body.content?.find((c) => c.type === "text")?.text ?? "";
    const jsonText = raw.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();
    let parsed: z.infer<typeof PicksResponse>;
    try {
      parsed = PicksResponse.parse(JSON.parse(jsonText));
    } catch (e) {
      console.error("Parse error:", e, raw);
      throw new Error("AI returned malformed picks");
    }

    const picks: GeneratedPick[] = parsed.picks.map((p) => ({
      pick_type: p.pick_type,
      pick_label: p.pick_label,
      sport: data.sport,
      odds: p.odds ?? null,
      confidence: p.confidence,
      grade: p.grade,
      reasoning: p.reasoning,
    }));

    return { picks, hasLiveData };
  });