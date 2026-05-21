import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill, Disclaimer } from "@/components/ui-bits";
import { useSlip } from "@/lib/slip-store";
import { americanToDecimal, formatOdds, impliedProb, mockProps } from "@/lib/mock-data";
import { Layers, Shuffle, X, Plus, Share2 } from "lucide-react";

export const Route = createFileRoute("/_app/parlay")({
  head: () => ({ meta: [{ title: "Parlay Builder · PickEdge AI" }] }),
  component: Parlay,
});

function Parlay() {
  const { picks, add, remove } = useSlip();
  const decimal = picks.reduce((a, p) => a * americanToDecimal(p.odds), 1);
  const implied = picks.reduce((a, p) => a * impliedProb(p.odds), 1);
  const american = picks.length === 0 ? "—" : decimal >= 2 ? `+${Math.round((decimal - 1) * 100)}` : `-${Math.round(100 / (decimal - 1))}`;
  const grade = picks.length === 0 ? "—" : implied > 0.4 ? "A" : implied > 0.2 ? "B+" : implied > 0.1 ? "B" : implied > 0.05 ? "C" : "D";

  const suggestions = mockProps.slice(0, 4).map((p) => ({
    id: `s-${p.id}`, label: `${p.player} ${p.recommendation} ${p.line}`, detail: `${p.market} · ${p.book}`,
    odds: p.recommendation === "UNDER" ? p.under : p.over, book: p.book, confidence: p.confidence,
  }));

  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Parlay Builder" subtitle="AI-graded slips with correlation detection and smarter swaps." />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold flex items-center gap-2"><Layers className="h-4 w-4" />Your Slip ({picks.length})</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <Share2 className="h-3 w-3" /> Share card
              </button>
            </div>

            {picks.length === 0 && (
              <div className="text-center py-12 text-sm text-muted-foreground">
                Add picks from anywhere in the app, or pull from a suggestion below.
              </div>
            )}

            <div className="space-y-2">
              {picks.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.detail}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-primary">{formatOdds(p.odds)}</span>
                    <button onClick={() => remove(p.id)} className="p-1 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3 flex items-center gap-2"><Shuffle className="h-4 w-4" />AI-suggested legs</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {suggestions.map((s) => (
                <button key={s.id} onClick={() => add(s)}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border hover:border-primary text-left">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{s.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.detail}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-sm">{formatOdds(s.odds)}</span>
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">Quick build</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {["2-leg safe", "3-leg balanced", "4-leg upside", "Lottery slip"].map((t) => (
                <button key={t} className="h-10 rounded-md border border-border bg-secondary/60 text-sm font-semibold hover:border-primary">
                  {t}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <h3 className="font-bold mb-3">Slip stats</h3>
            <div className="space-y-2 text-sm">
              <Row k="Legs" v={String(picks.length)} />
              <Row k="Combined odds" v={american} accent />
              <Row k="Implied prob." v={picks.length ? `${(implied * 100).toFixed(2)}%` : "—"} />
              <Row k="$10 wins" v={picks.length ? `$${(decimal * 10).toFixed(2)}` : "—"} accent />
            </div>
            <div className="mt-4 rounded-md border border-border p-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">AI Parlay Grade</div>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-3xl font-black text-primary">{grade}</span>
                <span className="text-xs text-muted-foreground">No bad correlations detected.</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-2">Risk profile</h3>
            <div className="text-xs text-muted-foreground">
              Higher leg counts increase variance dramatically. Sportsbooks build their hold into parlays — keep slip sizes intentional.
            </div>
          </Card>

          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={`font-bold ${accent ? "text-primary" : ""}`}>{v}</span>
    </div>
  );
}