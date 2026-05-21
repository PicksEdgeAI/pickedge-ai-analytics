import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill, Sparkline } from "@/components/ui-bits";
import { formatOdds, mockLineMoves } from "@/lib/mock-data";
import { Activity, AlertTriangle, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_app/movement")({
  head: () => ({ meta: [{ title: "Live Line Movement · PickEdge AI" }] }),
  component: Movement,
});

function Movement() {
  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Live Line Movement" subtitle="Steam, reverse moves, and best-time-to-bet insights." />

      <Card className="border-primary/40" >
        <div className="flex items-center gap-2 mb-3"><Activity className="h-4 w-4 text-primary" /><h2 className="font-bold">Live alerts</h2></div>
        <div className="space-y-3">
          {mockLineMoves.map((m) => (
            <div key={m.id} className="grid md:grid-cols-12 gap-3 items-center p-3 rounded-lg bg-secondary/40 border border-border">
              <div className="md:col-span-3">
                <div className="font-bold">{m.game}</div>
                <div className="text-xs text-muted-foreground">{m.book} · {m.time}</div>
              </div>
              <div className="md:col-span-3 text-sm">{m.market}</div>
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-muted-foreground line-through text-xs">{formatOdds(m.open)}</span>
                <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono font-bold text-primary">{formatOdds(m.current)}</span>
              </div>
              <div className="md:col-span-2 text-xs">
                <div>{m.pctMoney}% money</div>
                <div className="text-muted-foreground">{m.pctBets}% bets</div>
              </div>
              <div className="md:col-span-1 flex justify-end">
                <Pill tone={m.movement === "steam" ? "primary" : m.movement === "reverse" ? "accent" : "default"}>{m.movement.toUpperCase()}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold mb-3">Reverse line movement</h3>
          <p className="text-xs text-muted-foreground mb-3">Line moves against the majority of public bets — a classic sharp signal.</p>
          <Sparkline data={[51, 50.5, 50, 49.5, 49.5, 49, 49.5]} color="var(--accent)" />
        </Card>
        <Card>
          <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" />Best time to bet</h3>
          <p className="text-xs text-muted-foreground">Most early-day NBA totals open soft and tighten 90 minutes before tipoff. Get in early on overs you like — get unders late.</p>
        </Card>
      </div>
    </div>
  );
}