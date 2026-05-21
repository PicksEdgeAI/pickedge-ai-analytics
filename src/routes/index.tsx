import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Target, Layers, TrendingUp, Activity, Stethoscope, Shield, Zap } from "lucide-react";
import { Disclaimer } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PickEdge AI — Sports Picks Research & Parlay Builder" },
      { name: "description", content: "AI-powered sports analytics, player prop research, live odds movement, and parlay building. Research-only platform — not a sportsbook." },
      { property: "og:title", content: "PickEdge AI — Sports Picks Research" },
      { property: "og:description", content: "AI player props, live odds, and parlay grades. Research only." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <Showcase />
      <PricingTeaser />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md flex items-center justify-center font-black text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>P</div>
          <span className="font-bold tracking-tight">PickEdge<span className="text-primary"> AI</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <Link to="/leaderboard" className="hover:text-foreground">Leaderboard</Link>
          <Link to="/dashboard" className="hover:text-foreground">Demo</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
          <Link to="/dashboard"
            className="inline-flex items-center h-9 px-4 rounded-md text-primary-foreground text-sm font-semibold"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>
            Launch app
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40"
        style={{ background: "radial-gradient(800px 400px at 20% 0%, var(--primary), transparent), radial-gradient(700px 400px at 80% 20%, var(--accent), transparent)" }} />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-20 md:py-28">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold mb-6">
          <Sparkles className="h-3.5 w-3.5" /> AI-Powered Sports Research
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl leading-[1.05]">
          Find the <span className="text-primary">edge</span> before the line moves.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          AI-graded player props, live odds movement, and a parlay builder powered by real-time sports data across NBA, NFL, MLB, NHL, UFC, soccer & college.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard"
            className="inline-flex items-center h-12 px-7 rounded-md text-primary-foreground font-semibold"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>
            Try the live demo
          </Link>
          <Link to="/pricing" className="inline-flex items-center h-12 px-7 rounded-md border border-border bg-secondary/60 font-semibold">
            See pricing
          </Link>
        </div>
        <div className="mt-6 text-xs text-muted-foreground">
          Analytics & research only · Not a sportsbook · No wagers accepted · 21+
        </div>
      </div>
    </section>
  );
}

function Logos() {
  const items = ["NBA", "NFL", "MLB", "NHL", "UFC", "SOCCER", "WNBA", "NCAAF", "NCAAB"];
  return (
    <div className="border-y border-border bg-card/40">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground tracking-[0.2em] font-semibold">
        {items.map((i) => <span key={i}>{i}</span>)}
      </div>
    </div>
  );
}

function Features() {
  const features = [
    { icon: Target, title: "Today's Picks", desc: "Curated highest-confidence plays, refreshed throughout the day." },
    { icon: Sparkles, title: "AI Generator", desc: "Custom picks by sport, risk level, market and slip size with EV scoring." },
    { icon: Layers, title: "Parlay Builder", desc: "AI grade, correlation warnings, safer-swap suggestions and shareable cards." },
    { icon: TrendingUp, title: "Player Props", desc: "L5/L10/L20 hit rates, splits, matchup history, projected vs line." },
    { icon: Activity, title: "Live Movement", desc: "Steam & reverse line moves with money/bet % from sharp action." },
    { icon: Stethoscope, title: "Injury Impact", desc: "Auto-flag affected props the moment news drops." },
  ];
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything a sharp needs. Nothing they don't.</h2>
        <p className="mt-3 text-muted-foreground">PickEdge AI aggregates the same data the pros use — and runs it through models built for finding the soft side of the line.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border p-6 hover:border-primary/40 transition-colors"
            style={{ background: "var(--gradient-surface)" }}>
            <f.icon className="h-7 w-7 text-primary mb-4" />
            <h3 className="font-bold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
      <div className="rounded-2xl border border-border p-8 md:p-12"
        style={{ background: "linear-gradient(135deg, oklch(0.85 0.22 145 / 0.1), oklch(0.72 0.2 235 / 0.1))" }}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Zap className="h-8 w-8 text-primary mb-3" />
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Catch steam moves the moment they happen.</h3>
            <p className="mt-3 text-muted-foreground">Real-time line tracking across every major book. Get alerted when sharp money hits, when totals get hammered, or when reverse line movement signals smart action.</p>
            <div className="mt-6"><Link to="/movement" className="text-primary font-semibold hover:underline">Explore live movement →</Link></div>
          </div>
          <MoveCardDemo />
        </div>
      </div>
    </section>
  );
}

function MoveCardDemo() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      {[
        { g: "Lakers vs Celtics", m: "Spread LAL -2.5", o: "-1.5", c: "-2.5", t: "STEAM" },
        { g: "Chiefs vs Bills", m: "Total 49.5", o: "51", c: "49.5", t: "REVERSE" },
        { g: "Rangers vs Bruins", m: "ML BOS", o: "+175", c: "+155", t: "STEAM" },
      ].map((r) => (
        <div key={r.g} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
          <div className="min-w-0">
            <div className="font-semibold truncate">{r.g}</div>
            <div className="text-xs text-muted-foreground">{r.m}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground line-through">{r.o}</span>
            <span className="font-mono font-bold text-primary">{r.c}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.t === "STEAM" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>{r.t}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PricingTeaser() {
  const tiers = [
    { name: "Free", price: "$0", desc: "Get a taste", features: ["3 AI picks/day", "Basic dashboard", "Limited prop search"], cta: "Start free" },
    { name: "Pro", price: "$29", desc: "Most popular", featured: true, features: ["Unlimited AI picks", "Live odds movement", "Parlay builder", "Premium alerts"], cta: "Go Pro" },
    { name: "VIP", price: "$79", desc: "Built for sharps", features: ["Sharp movement alerts", "Best-bet dashboard", "Advanced analytics", "Early features"], cta: "Get VIP" },
  ];
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Plans for every player</h2>
        <p className="mt-3 text-muted-foreground">Upgrade anytime. Cancel anytime.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <div key={t.name}
            className={`rounded-xl border p-6 ${t.featured ? "border-primary" : "border-border"}`}
            style={{ background: t.featured ? "linear-gradient(180deg, oklch(0.85 0.22 145 / 0.08), var(--card))" : "var(--gradient-surface)",
              boxShadow: t.featured ? "var(--glow-primary)" : "none" }}>
            {t.featured && <div className="inline-block mb-3 text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-primary text-primary-foreground">MOST POPULAR</div>}
            <h3 className="text-lg font-bold">{t.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-black">{t.price}</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing"
              className={`mt-6 inline-flex w-full items-center justify-center h-11 rounded-md font-semibold ${t.featured ? "text-primary-foreground" : "border border-border bg-secondary/60"}`}
              style={t.featured ? { background: "var(--gradient-primary)" } : undefined}>
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 space-y-6">
        <Disclaimer />
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>© {new Date().getFullYear()} PickEdge AI · Research platform, not a sportsbook</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Responsible Play</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
