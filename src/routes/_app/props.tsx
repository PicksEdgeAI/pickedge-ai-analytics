import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, Pill, Sparkline } from "@/components/ui-bits";
import { mockProps } from "@/lib/mock-data";
import { useSlip } from "@/lib/slip-store";
import { Search, Filter } from "lucide-react";

export const Route = createFileRoute("/_app/props")({
  head: () => ({ meta: [{ title: "Player Props · PickEdge AI" }] }),
  component: Props,
});

function Props() {
  const [q, setQ] = useState("");
  const [rec, setRec] = useState<"ALL" | "OVER" | "UNDER" | "NO PLAY">("ALL");
  const { add } = useSlip();

  const list = mockProps.filter((p) =>
    (rec === "ALL" || p.recommendation === rec) &&
    (p.player.toLowerCase().includes(q.toLowerCase()) || p.market.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Player Props" subtitle="Hit rates, splits, AI projections & recommendations across every market." />

      <Card className="!p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search player or market…"
              className="w-full h-10 pl-9 pr-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Filter className="h-4 w-4" />Rec:</div>
          {(["ALL", "OVER", "UNDER", "NO PLAY"] as const).map((r) => (
            <button key={r} onClick={() => setRec(r)}
              className={`px-3 h-9 rounded-md text-xs font-semibold border ${
                rec === r ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/60 border-border"
              }`}>{r}</button>
          ))}
        </div>
      </Card>

      <Card className="!p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <Th>Player</Th><Th>Market</Th><Th>Line</Th><Th>O / U</Th><Th>Proj</Th>
              <Th>L5</Th><Th>L10</Th><Th>L20</Th><Th>Trend</Th><Th>AI</Th><Th> </Th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-secondary/30">
                <td className="p-3">
                  <div className="font-semibold">{p.player}</div>
                  <div className="text-xs text-muted-foreground">{p.team} vs {p.opponent} · <Pill tone="accent">{p.league}</Pill></div>
                </td>
                <td className="p-3">{p.market}</td>
                <td className="p-3 font-mono font-bold">{p.line}</td>
                <td className="p-3 font-mono text-xs">
                  <div>O {p.over > 0 ? "+" : ""}{p.over}</div>
                  <div>U {p.under > 0 ? "+" : ""}{p.under}</div>
                </td>
                <td className="p-3 font-mono text-primary font-bold">{p.projection}</td>
                <td className="p-3"><HitCell v={p.hitRate.l5} /></td>
                <td className="p-3"><HitCell v={p.hitRate.l10} /></td>
                <td className="p-3"><HitCell v={p.hitRate.l20} /></td>
                <td className="p-3 w-24"><Sparkline data={p.trend} /></td>
                <td className="p-3">
                  <div className="flex flex-col items-start gap-1">
                    <Pill tone={p.recommendation === "OVER" ? "success" : p.recommendation === "UNDER" ? "danger" : "warn"}>{p.recommendation}</Pill>
                    <span className="text-[10px] text-muted-foreground">{p.confidence}% conf</span>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => add({ id: p.id, label: `${p.player} ${p.recommendation} ${p.line}`, detail: `${p.market} · ${p.book}`, odds: p.recommendation === "UNDER" ? p.under : p.over, book: p.book, confidence: p.confidence })}
                    className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold whitespace-nowrap">
                    + Slip
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="p-3 font-semibold">{children}</th>;
}

function HitCell({ v }: { v: number }) {
  const pct = Math.round(v * 100);
  const tone = pct >= 65 ? "text-success" : pct >= 50 ? "text-foreground" : "text-destructive";
  return <span className={`font-bold ${tone}`}>{pct}%</span>;
}