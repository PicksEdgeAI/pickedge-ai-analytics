import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, Pill, Sparkline } from "@/components/ui-bits";
import { mockProps } from "@/lib/mock-data";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "Player Research · PickEdge AI" }] }),
  component: Research,
});

function Research() {
  const [sel, setSel] = useState(mockProps[0]);

  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Player Research" subtitle="Deep splits, matchups, and trend models for any player." />

      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search players…" className="w-full h-10 pl-9 pr-3 rounded-md bg-secondary border border-border text-sm" />
          </div>
          <div className="space-y-1">
            {mockProps.map((p) => (
              <button key={p.id} onClick={() => setSel(p)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${sel.id === p.id ? "bg-primary/15 text-primary" : "hover:bg-secondary"}`}>
                <div className="font-semibold">{p.player}</div>
                <div className="text-xs text-muted-foreground">{p.team} · {p.league}</div>
              </button>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{sel.player}</h2>
                <div className="text-sm text-muted-foreground">{sel.team} vs {sel.opponent} · <Pill tone="accent">{sel.league}</Pill></div>
              </div>
              <Pill tone={sel.recommendation === "OVER" ? "success" : sel.recommendation === "UNDER" ? "danger" : "warn"}>{sel.recommendation}</Pill>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { k: "Season avg", v: String(sel.projection - 1.5) },
                { k: "Last 5", v: String((sel.hitRate.l5 * 100).toFixed(0)) + "%" },
                { k: "Home", v: "65%" }, { k: "Away", v: "55%" },
              ].map((s) => (
                <div key={s.k} className="rounded-md bg-secondary/60 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                  <div className="font-bold text-lg">{s.v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-2">Recent trend — {sel.market}</h3>
            <div className="h-32"><Sparkline data={sel.trend} /></div>
            <div className="text-xs text-muted-foreground">Line: {sel.line} · Projection: <span className="text-primary font-bold">{sel.projection}</span></div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">Matchup history vs {sel.opponent}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="p-2">Date</th><th className="p-2">Result</th><th className="p-2">{sel.market}</th><th className="p-2">Line</th><th className="p-2">Hit</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map((i) => {
                    const val = Math.round((sel.projection + (Math.random() - 0.5) * 6) * 10) / 10;
                    const hit = val > sel.line;
                    return (
                      <tr key={i} className="border-t border-border">
                        <td className="p-2">{new Date(Date.now() - i * 7 * 86400000).toLocaleDateString()}</td>
                        <td className="p-2">W 112-108</td>
                        <td className="p-2 font-mono">{val}</td>
                        <td className="p-2 font-mono">{sel.line}</td>
                        <td className="p-2"><Pill tone={hit ? "success" : "danger"}>{hit ? "OVER" : "UNDER"}</Pill></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}