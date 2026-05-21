import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, Pill, OddsButton, Disclaimer } from "@/components/ui-bits";
import { mockGames, type League } from "@/lib/mock-data";
import { useSlip } from "@/lib/slip-store";
import { Calendar } from "lucide-react";

const LEAGUES: ("ALL" | League)[] = ["ALL", "NBA", "NFL", "MLB", "NHL", "UFC", "Soccer", "WNBA", "NCAAF", "NCAAB"];

export const Route = createFileRoute("/_app/picks")({
  head: () => ({ meta: [{ title: "Today's Picks · PickEdge AI" }] }),
  component: Picks,
});

function Picks() {
  const [lg, setLg] = useState<"ALL" | League>("ALL");
  const { add } = useSlip();
  const games = mockGames.filter((g) => lg === "ALL" || g.league === lg);

  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader
        title="Today's Picks"
        subtitle="All games across every major league, auto-refreshed."
        actions={<div className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {LEAGUES.map((l) => (
          <button
            key={l}
            onClick={() => setLg(l)}
            className={`px-3 h-9 rounded-md text-sm font-semibold whitespace-nowrap border transition-colors ${
              lg === l ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/60 border-border hover:bg-secondary"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {games.map((g) => (
          <Card key={g.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Pill tone="accent">{g.league}</Pill>
                {g.status === "live" && <Pill tone="danger">● LIVE</Pill>}
                <div>
                  <div className="font-bold">{g.away} @ {g.home}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(g.startTime).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })} · {g.venue}
                  </div>
                </div>
                {g.scores && (
                  <div className="ml-3 font-mono text-lg font-bold">
                    {g.scores.away} — {g.scores.home}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <Market title="Spread">
                <OddsButton label={`${g.away} ${g.spread.away > 0 ? "+" : ""}${g.spread.away}`} odds={-110}
                  onClick={() => add({ id: `${g.id}-sa`, label: `${g.away} ${g.spread.away > 0 ? "+" : ""}${g.spread.away}`, detail: `${g.away} @ ${g.home}`, odds: -110 })} />
                <OddsButton label={`${g.home} ${g.spread.home > 0 ? "+" : ""}${g.spread.home}`} odds={-110}
                  onClick={() => add({ id: `${g.id}-sh`, label: `${g.home} ${g.spread.home > 0 ? "+" : ""}${g.spread.home}`, detail: `${g.away} @ ${g.home}`, odds: -110 })} />
              </Market>
              <Market title="Moneyline">
                <OddsButton label={g.away} odds={g.moneyline.away}
                  onClick={() => add({ id: `${g.id}-mla`, label: `${g.away} ML`, detail: `${g.away} @ ${g.home}`, odds: g.moneyline.away })} />
                <OddsButton label={g.home} odds={g.moneyline.home}
                  onClick={() => add({ id: `${g.id}-mlh`, label: `${g.home} ML`, detail: `${g.away} @ ${g.home}`, odds: g.moneyline.home })} />
              </Market>
              <Market title="Total">
                <OddsButton label={`O ${g.total.line}`} odds={g.total.over}
                  onClick={() => add({ id: `${g.id}-to`, label: `Over ${g.total.line}`, detail: `${g.away} @ ${g.home}`, odds: g.total.over })} />
                <OddsButton label={`U ${g.total.line}`} odds={g.total.under}
                  onClick={() => add({ id: `${g.id}-tu`, label: `Under ${g.total.line}`, detail: `${g.away} @ ${g.home}`, odds: g.total.under })} />
              </Market>
            </div>
          </Card>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}

function Market({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}