import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill, OddsButton } from "@/components/ui-bits";
import { mockGames } from "@/lib/mock-data";
import { useSlip } from "@/lib/slip-store";

export const Route = createFileRoute("/_app/lines")({
  head: () => ({ meta: [{ title: "Game Lines · PickEdge AI" }] }),
  component: Lines,
});

const BOOKS = ["DraftKings", "FanDuel", "BetMGM", "Caesars"];

function Lines() {
  const { add } = useSlip();
  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Game Lines" subtitle="Best available odds across major sportsbooks." />

      {mockGames.map((g) => (
        <Card key={g.id}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill tone="accent">{g.league}</Pill>
              <span className="font-bold">{g.away} @ {g.home}</span>
              <span className="text-xs text-muted-foreground">{new Date(g.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground text-left">
                  <th className="p-2">Book</th>
                  <th className="p-2">Spread</th>
                  <th className="p-2">Moneyline</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {BOOKS.map((b, i) => {
                  const j = (n: number, k: number) => n + (i - 1) * k;
                  return (
                    <tr key={b} className="border-t border-border">
                      <td className="p-2 font-semibold">{b}</td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <OddsButton label={`${g.away} +${Math.abs(g.spread.away)}`} odds={j(-110, 2)} onClick={() => add({ id: `${g.id}-${b}-sa`, label: `${g.away} +${Math.abs(g.spread.away)}`, detail: `${b}`, odds: j(-110, 2), book: b })} />
                          <OddsButton label={`${g.home} ${g.spread.home}`} odds={j(-110, -2)} onClick={() => add({ id: `${g.id}-${b}-sh`, label: `${g.home} ${g.spread.home}`, detail: `${b}`, odds: j(-110, -2), book: b })} />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <OddsButton label={g.away} odds={j(g.moneyline.away, 5)} onClick={() => add({ id: `${g.id}-${b}-mla`, label: `${g.away} ML`, detail: b, odds: j(g.moneyline.away, 5), book: b })} />
                          <OddsButton label={g.home} odds={j(g.moneyline.home, -5)} onClick={() => add({ id: `${g.id}-${b}-mlh`, label: `${g.home} ML`, detail: b, odds: j(g.moneyline.home, -5), book: b })} />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <OddsButton label={`O ${g.total.line}`} odds={j(g.total.over, 2)} onClick={() => add({ id: `${g.id}-${b}-o`, label: `Over ${g.total.line}`, detail: b, odds: j(g.total.over, 2), book: b })} />
                          <OddsButton label={`U ${g.total.line}`} odds={j(g.total.under, -2)} onClick={() => add({ id: `${g.id}-${b}-u`, label: `Under ${g.total.line}`, detail: b, odds: j(g.total.under, -2), book: b })} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}