import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card, PageHeader, Pill, Disclaimer } from "@/components/ui-bits";
import { useSlip } from "@/lib/slip-store";
import { useAuth } from "@/hooks/use-auth";
import { generateAiPicks, type GeneratedPick } from "@/lib/ai-generator.functions";
import { savePick } from "@/lib/save-pick.functions";
import { Sparkles, TrendingUp, AlertTriangle, Plus, Bookmark, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/ai")({
  head: () => ({ meta: [{ title: "AI Pick Generator · PickEdge AI" }] }),
  component: AI,
});

function AI() {
  const [sport, setSport] = useState("NBA");
  const [risk, setRisk] = useState<"Safe" | "Balanced" | "Lottery">("Balanced");
  const [market, setMarket] = useState("Player Props");
  const [count, setCount] = useState(3);
  const [generated, setGenerated] = useState<GeneratedPick[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const { add } = useSlip();
  const { user } = useAuth();
  const navigate = useNavigate();

  const genFn = useServerFn(generateAiPicks);
  const saveFn = useServerFn(savePick);

  const genMut = useMutation({
    mutationFn: () => genFn({ data: { sport, risk, market, count } }),
    onSuccess: (res) => {
      setGenerated(res.picks);
      setNotice(res.hasLiveData ? null : "No live data yet — showing illustrative picks. Cron will populate live data shortly.");
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to generate picks"),
  });

  const saveMut = useMutation({
    mutationFn: (p: GeneratedPick) => saveFn({ data: p }),
    onSuccess: () => toast.success("Saved to your picks"),
    onError: (e: Error) => toast.error(e.message ?? "Failed to save"),
  });

  const handleSave = (p: GeneratedPick) => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    saveMut.mutate(p);
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
        <button onClick={() => genMut.mutate()} disabled={genMut.isPending}
          className="mt-4 inline-flex items-center gap-2 h-11 px-6 rounded-md text-primary-foreground font-semibold disabled:opacity-60"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>
          {genMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {genMut.isPending ? "Analyzing live data…" : "Generate picks"}
        </button>
        {!user && (
          <p className="text-xs text-muted-foreground mt-3">
            <Link to="/login" className="text-primary underline">Sign in</Link> to save picks to your account.
          </p>
        )}
        {notice && <p className="text-xs text-warning mt-3">{notice}</p>}
      </Card>

      {generated.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {generated.map((p, i) => (
            <Card key={`${p.pick_label}-${i}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-bold text-lg">{p.pick_label}</div>
                  <div className="text-sm text-muted-foreground mt-1"><Pill tone="accent">{p.sport}</Pill> <Pill tone="primary">{p.pick_type}</Pill></div>
                </div>
                <Pill tone={p.grade === "A" ? "success" : p.grade === "B" ? "primary" : "warn"}>Grade {p.grade}</Pill>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <Stat k="Confidence" v={`${p.confidence}%`} />
                <Stat k="Odds" v={p.odds != null ? (p.odds > 0 ? `+${p.odds}` : `${p.odds}`) : "—"} accent />
                <Stat k="Grade" v={p.grade} />
              </div>

              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                <TrendingUp className="inline h-3.5 w-3.5 text-primary mr-1" />
                {p.reasoning}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-warning">
                <AlertTriangle className="h-3 w-3" /> Monitor injury report 90 min before tip.
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => add({ id: `${p.pick_label}-${i}`, label: p.pick_label, detail: `${p.sport} · ${p.pick_type}`, odds: p.odds ?? -110, confidence: p.confidence })}
                  className="inline-flex items-center justify-center gap-2 h-10 rounded-md bg-primary text-primary-foreground font-semibold">
                  <Plus className="h-4 w-4" /> Add to slip
                </button>
                <button onClick={() => handleSave(p)} disabled={saveMut.isPending}
                  className="inline-flex items-center justify-center gap-2 h-10 rounded-md border border-border bg-secondary/60 font-semibold hover:bg-secondary disabled:opacity-60">
                  <Bookmark className="h-4 w-4" /> {user ? "Save" : "Sign in to save"}
                </button>
              </div>
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