import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SPORTS: Array<{ key: string; sport: string; league: string }> = [
  { key: "baseball_mlb", sport: "MLB", league: "MLB" },
  { key: "basketball_nba", sport: "NBA", league: "NBA" },
  { key: "americanfootball_nfl", sport: "NFL", league: "NFL" },
  { key: "icehockey_nhl", sport: "NHL", league: "NHL" },
];

type ApiGame = {
  id: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers?: Array<{
    key: string;
    title: string;
    markets: Array<{
      key: string;
      outcomes: Array<{ name: string; price: number; point?: number }>;
    }>;
  }>;
};

export const Route = createFileRoute("/api/public/cron/sync-odds")({
  server: {
    handlers: {
      POST: async () => {
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) return new Response("Missing ODDS_API_KEY", { status: 500 });

        const summary: Record<string, { games: number; odds: number; error?: string }> = {};

        for (const s of SPORTS) {
          try {
            const url = `https://api.the-odds-api.com/v4/sports/${s.key}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
            const res = await fetch(url);
            if (!res.ok) {
              summary[s.sport] = { games: 0, odds: 0, error: `${res.status}` };
              continue;
            }
            const games = (await res.json()) as ApiGame[];

            // Upsert games (use odds_api_id as natural key)
            const gameRows = games.map((g) => ({
              odds_api_id: g.id,
              sport: s.sport,
              league: s.league,
              home_team: g.home_team,
              away_team: g.away_team,
              commence_time: g.commence_time,
              status: "scheduled",
            }));

            // Manual upsert by odds_api_id (no unique constraint guaranteed)
            const ids: Record<string, string> = {};
            for (const row of gameRows) {
              const { data: existing } = await supabaseAdmin
                .from("games")
                .select("id")
                .eq("odds_api_id", row.odds_api_id)
                .maybeSingle();
              if (existing) {
                ids[row.odds_api_id] = existing.id;
                await supabaseAdmin.from("games").update(row).eq("id", existing.id);
              } else {
                const { data: inserted } = await supabaseAdmin
                  .from("games")
                  .insert(row)
                  .select("id")
                  .single();
                if (inserted) ids[row.odds_api_id] = inserted.id;
              }
            }

            // Replace odds for these games
            const apiIds = games.map((g) => g.id);
            const gameIds = apiIds.map((a) => ids[a]).filter(Boolean);
            if (gameIds.length) {
              await supabaseAdmin.from("odds").delete().in("game_id", gameIds);
            }

            const oddsRows: Array<{
              game_id: string;
              bookmaker: string;
              market: string;
              outcome_name: string;
              price: number;
              point: number | null;
            }> = [];
            for (const g of games) {
              const gid = ids[g.id];
              if (!gid) continue;
              for (const bk of g.bookmakers ?? []) {
                for (const m of bk.markets) {
                  for (const o of m.outcomes) {
                    oddsRows.push({
                      game_id: gid,
                      bookmaker: bk.title,
                      market: m.key,
                      outcome_name: o.name,
                      price: o.price,
                      point: o.point ?? null,
                    });
                  }
                }
              }
            }

            if (oddsRows.length) {
              // chunk inserts
              for (let i = 0; i < oddsRows.length; i += 500) {
                await supabaseAdmin.from("odds").insert(oddsRows.slice(i, i + 500));
              }
            }

            summary[s.sport] = { games: gameRows.length, odds: oddsRows.length };
          } catch (err) {
            summary[s.sport] = { games: 0, odds: 0, error: String(err) };
          }
        }

        return new Response(JSON.stringify({ ok: true, summary }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});