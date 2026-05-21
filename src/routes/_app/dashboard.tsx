import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, Pill, OddsButton, Sparkline, Disclaimer } from "@/components/ui-bits";
import { mockGames, mockProps, mockInjuries, mockLineMoves, formatOdds } from "@/lib/mock-data";
import { useSlip } from "@/lib/slip-store";
import { Activity, AlertTriangle, TrendingUp, Target, Layers, Sparkles, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · PickEdge AI" }, { name: "description", content: "Your daily sports research command center." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { add } = useSlip();
  const today = mockGames.slice(0, 4);
  const topPicks = mockProps.slice(0, 3);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Dashboard" subtitle="Today's edge across every market." />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="AI Picks Today" value="47" delta="+12" icon={Sparkles} />
        <Kpi label="Win Rate (L30)" value="58.4%" delta="+2.1%" icon={Target} />
        <Kpi label="Steam Moves" value="12" delta="live" icon={Activity} accent />
        <Kpi label="Saved Picks" value="9" delta="open" icon={Layers} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <SectionHeader title="Today's Games" link="/picks" />
          <div className="space-y-2">
            {today.map((g) => (
              <div key={g.id} className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border">
                <div className="flex items-center gap-2 min-w-[180px]">
                  <Pill tone="accent">{g.league}</Pill>
                  <div>
                    <div className="font-semibold text-sm">{g.away} @ {g.home}</div>
                    <div className="text-xs text-muted-foreground">{new Date(g.startTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {g.venue}</div>
                  </div>
                </div>
                <div className="flex gap-2 ml-auto">
                  <OddsButton label="Spread" odds={g.spread.home} onClick={() => add({ id: `${g.id}-sp`, label: `${g.home} ${g.spread.home > 0 ? "+" : ""}${g.spread.home}`, detail: `${g.away} @ ${g.home}`, odds: -110 })} />
                  <OddsButton label="ML" odds={g.moneyline.home} onClick={() => add({ id: `${g.id}-ml`, label: `${g.home} ML`, detail: `${g.away} @ ${g.home}`, odds: g.moneyline.home })} />
                  <OddsButton label={`O ${g.total.line}`} odds={g.total.over} onClick={() => add({ id: `${g.id}-o`, label: `Over ${g.total.line}`, detail: `${g.away} @ ${g.home}`, odds: g.total.over })} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Top AI Picks" link="/picks" />
          <div className="space-y-3">
            {topPicks.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm">{p.player}</div>
                  <Pill tone={p.recommendation === "OVER" ? "success" : p.recommendation === "UNDER" ? "danger" : "warn"}>{p.recommendation}</Pill>
                </div>
                <div className="text-xs text-muted-foreground">{p.market} {p.line} · {p.book}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-bold text-primary">{p.confidence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-1">
                  <div className="h-full bg-primary" style={{ width: `${p.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader title="Live Line Movement" link="/movement" />
          <div className="space-y-3">
            {mockLineMoves.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="font-medium truncate">{m.game}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.market} · {m.book} · {m.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">{formatOdds(m.open)}</span>
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                  <span className="font-mono font-bold text-primary">{formatOdds(m.current)}</span>
                  <Pill tone={m.movement === "steam" ? "primary" : m.movement === "reverse" ? "accent" : "default"}>
                    {m.movement.toUpperCase()}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader title="Injury Watch" link="/injuries" />
          <div className="space-y-3">
            {mockInjuries.slice(0, 4).map((i) => (
              <div key={i.id} className="flex items-start gap-3 text-sm">
                <AlertTriangle className={`h-4 w-4 mt-0.5 ${i.status === "Out" ? "text-destructive" : "text-warning"}`} />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{i.player} <span className="text-muted-foreground">({i.team})</span></div>
                  <div className="text-xs text-muted-foreground">{i.detail}</div>
                </div>
                <Pill tone={i.status === "Out" ? "danger" : "warn"}>{i.status}</Pill>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <SectionHeader title="Trending Props" link="/props" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mockProps.slice(0, 4).map((p) => (
            <div key={p.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{p.player}</div>
                <Pill tone="accent">{p.league}</Pill>
              </div>
              <div className="text-xs text-muted-foreground">{p.market} {p.line}</div>
              <Sparkline data={p.trend} />
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">L10 Hit</span>
                <span className="font-bold text-primary">{(p.hitRate.l10 * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Disclaimer />
    </div>
  );
}

function Kpi({ label, value, delta, icon: Icon, accent }: { label: string; value: string; delta: string; icon: typeof TrendingUp; accent?: boolean }) {
  return (
    <Card className="!p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
          <div className={`text-xs mt-1 ${accent ? "text-accent" : "text-primary"}`}>{delta}</div>
        </div>
        <Icon className={`h-5 w-5 ${accent ? "text-accent" : "text-primary"}`} />
      </div>
    </Card>
  );
}

function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold">{title}</h2>
      <Link to={link} className="text-xs text-primary hover:underline">View all →</Link>
    </div>
  );
}