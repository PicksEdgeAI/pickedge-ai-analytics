import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, PageHeader, Pill, Disclaimer } from "@/components/ui-bits";
import { mockProps } from "@/lib/mock-data";
import { useSlip } from "@/lib/slip-store";
import { Sparkles, TrendingUp, AlertTriangle, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/ai")({
  head: () => ({ meta: [{ title: "AI Pick Generator · PickEdge AI" }] }),
  component: AI,
});

function AI() {
  const [sport, setSport] = useState("NBA");
  const [risk, setRisk] = useState<"Safe" | "Balanced" | "Lottery">("Balanced");
  const [market, setMarket] = useState("Player Props");
  const [count, setCount] = useState(3);
  const [generated, setGenerated] = useState<typeof mockProps>([]);
  const { add } = useSlip();

  const generate = () => {
    const shuffled = [...mockProps].sort(() => Math.random() - 0.5);
    setGenerated(shuffled.slice(0, count));
  };

  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="AI Pick Generator" subtitle="Configure inputs — we model trends, matchups, injuries, splits and line movement." />

      <Card>
        <div className="grid md:grid-cols-4 gap-3">
          <Field label="Sport">
            <select value={sport} onChange={(e) => setSport(e.target.value)} className="select">
              {["NBA","NFL","MLB","NHL","UFC","Soccer","WNBA","NCAAF","NCAAB"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Risk level">
            <select value={risk} onChange={(e) => setRisk(e.target.value as typeof risk)} className="select">
              {["Safe","Balanced","Lottery"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Market">
            <select value={market} onChange={(e) => setMarket(e.target.value)} className="select">
              {["Player Props","Spreads","Moneylines","Totals","Mixed"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label={`Picks: ${count}`}>
            <input type="range" min={1} max={8} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-primary" />
          </Field>
        </div>
        <button onClick={generate}
          className="mt-4 inline-flex items-center gap-2 h-11 px-6 rounded-md text-primary-foreground font-semibold"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>
          <Sparkles className="h-4 w-4" /> Generate picks
        </button>
      </Card>

      {generated.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {generated.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-lg">{p.player}</div>
                  <div className="text-sm text-muted-foreground">{p.team} vs {p.opponent} · <Pill tone="accent">{p.league}</Pill></div>
                </div>
                <Pill tone={p.recommendation === "OVER" ? "success" : p.recommendation === "UNDER" ? "danger" : "warn"}>{p.recommendation}</Pill>
              </div>
              <div className="font-mono font-bold text-xl text-primary">{p.market} {p.line}</div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <Stat k="Confidence" v={`${p.confidence}%`} />
                <Stat k="EV" v="+4.2%" accent />
                <Stat k="L10 Hit" v={`${(p.hitRate.l10 * 100).toFixed(0)}%`} />
              </div>

              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                <TrendingUp className="inline h-3.5 w-3.5 text-primary mr-1" />
                {p.player} has cleared {p.line} {p.market.toLowerCase()} in {Math.round(p.hitRate.l10 * 10)}/10 recent outings. Matchup pace and usage rate favor the {p.recommendation.toLowerCase()}.
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-warning">
                <AlertTriangle className="h-3 w-3" /> Monitor injury report 90 min before tip.
              </div>

              <button onClick={() => add({ id: p.id, label: `${p.player} ${p.recommendation} ${p.line}`, detail: `${p.market} · ${p.book}`, odds: p.recommendation === "UNDER" ? p.under : p.over, book: p.book, confidence: p.confidence })}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 h-10 rounded-md bg-primary text-primary-foreground font-semibold">
                <Plus className="h-4 w-4" /> Add to slip
              </button>
            </Card>
          ))}
        </div>
      )}

      <Disclaimer />
      <style>{`.select{height:40px;width:100%;border-radius:6px;background:var(--secondary);border:1px solid var(--border);padding:0 .75rem;color:inherit;font-size:14px}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Stat({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="rounded-md bg-secondary/60 p-2 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`font-bold ${accent ? "text-primary" : ""}`}>{v}</div>
    </div>
  );
}