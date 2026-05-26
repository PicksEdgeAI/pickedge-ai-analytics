import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SPORTS: Array<{ key: string; sport: string; markets: string[] }> = [
  { key: "baseball_mlb", sport: "MLB", markets: ["batter_home_runs", "batter_hits", "pitcher_strikeouts"] },
  { key: "basketball_nba", sport: "NBA", markets: ["player_points", "player_rebounds", "player_assists"] },
  { key: "americanfootball_nfl", sport: "NFL", markets: ["player_pass_yds", "player_rush_yds", "player_receptions"] },
  { key: "icehockey_nhl", sport: "NHL", markets: ["player_points", "player_shots_on_goal"] },
];

type EventProps = {
  id: string;
  bookmakers?: Array<{
    markets: Array<{
      key: string;
      outcomes: Array<{ name: string; description?: string; price: number; point?: number }>;
    }>;
  }>;
};

export const Route = createFileRoute("/api/public/cron/sync-props")({
  server: {
    handlers: {
      POST: async () => {
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) return new Response("Missing ODDS_API_KEY", { status: 500 });

        const summary: Record<string, { events: number; props: number; error?: string }> = {};

        for (const s of SPORTS) {
          try {
            // Get upcoming events for this sport from our DB (cheaper than calling events API)
            const { data: games } = await supabaseAdmin
              .from("games")
              .select("id, odds_api_id, home_team, away_team")
              .eq("sport", s.sport)
              .gte("commence_time", new Date().toISOString())
              .lte("commence_time", new Date(Date.now() + 36 * 3600_000).toISOString())
              .limit(8); // cap API calls per sport

            if (!games?.length) {
              summary[s.sport] = { events: 0, props: 0 };
              continue;
            }

            let total = 0;
            for (const g of games) {
              if (!g.odds_api_id) continue;
              const url = `https://api.the-odds-api.com/v4/sports/${s.key}/events/${g.odds_api_id}/odds/?apiKey=${apiKey}&regions=us&markets=${s.markets.join(",")}&oddsFormat=american`;
              const res = await fetch(url);
              if (!res.ok) continue;
              const event = (await res.json()) as EventProps;

              // Clear existing props for this game
              await supabaseAdmin.from("player_props").delete().eq("game_id", g.id);

              // Build over/under pairs keyed by player+prop
              const map = new Map<string, { player_name: string; prop_type: string; line: number; over?: number; under?: number }>();
              for (const bk of event.bookmakers ?? []) {
                for (const m of bk.markets) {
                  for (const o of m.outcomes) {
                    const player = o.description || o.name;
                    if (!player || o.point == null) continue;
                    const key = `${player}::${m.key}::${o.point}`;
                    if (!map.has(key)) map.set(key, { player_name: player, prop_type: m.key, line: o.point });
                    const entry = map.get(key)!;
                    if (o.name.toLowerCase() === "over") entry.over = o.price;
                    else if (o.name.toLowerCase() === "under") entry.under = o.price;
                  }
                }
              }

              const rows = Array.from(map.values()).map((v) => ({
                game_id: g.id,
                player_name: v.player_name,
                prop_type: v.prop_type,
                line: v.line,
                over_price: v.over ?? null,
                under_price: v.under ?? null,
              }));
              if (rows.length) {
                await supabaseAdmin.from("player_props").insert(rows);
                total += rows.length;
              }
            }
            summary[s.sport] = { events: games.length, props: total };
          } catch (err) {
            summary[s.sport] = { events: 0, props: 0, error: String(err) };
          }
        }

        return new Response(JSON.stringify({ ok: true, summary }), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});