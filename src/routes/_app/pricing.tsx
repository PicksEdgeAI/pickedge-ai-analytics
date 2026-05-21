import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Disclaimer } from "@/components/ui-bits";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/_app/pricing")({
  head: () => ({ meta: [{ title: "Pricing · PickEdge AI" }] }),
  component: Pricing,
});

type Tier = { name: string; price: number; desc: string; featured?: boolean; features: Record<string, boolean> };
const tiers: Tier[] = [
  { name: "Free", price: 0, desc: "Get started", features: { "3 AI picks/day": true, "Basic dashboard": true, "Limited prop search": true, "Live odds movement": false, "Parlay builder": false, "Sharp alerts": false, "Best-bet dashboard": false } },
  { name: "Pro", price: 29, desc: "Most popular", featured: true, features: { "Unlimited AI picks": true, "Full prop research": true, "Live odds movement": true, "Parlay builder": true, "Email & in-app alerts": true, "Sharp alerts": false, "Best-bet dashboard": false } },
  { name: "VIP", price: 79, desc: "Built for sharps", features: { "Everything in Pro": true, "Sharp movement alerts": true, "Best-bet dashboard": true, "Advanced analytics": true, "Early access features": true, "Priority support": true, "Custom AI models": true } },
];

function Pricing() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <PageHeader title="Pricing" subtitle="Upgrade anytime. Cancel anytime. Powered by Stripe." />

      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((t) => (
          <Card key={t.name} className={t.featured ? "border-primary" : ""}>
            {t.featured && <div className="inline-block mb-3 text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-primary text-primary-foreground">MOST POPULAR</div>}
            <h3 className="text-xl font-bold">{t.name}</h3>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black">${t.price}</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {Object.entries(t.features).map(([f, on]) => (
                <li key={f} className="flex items-center gap-2">
                  {on ? <Check className="h-4 w-4 text-primary" /> : <X className="h-4 w-4 text-muted-foreground" />}
                  <span className={on ? "" : "text-muted-foreground line-through"}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full h-11 rounded-md font-semibold ${t.featured ? "text-primary-foreground" : "border border-border bg-secondary/60"}`}
              style={t.featured ? { background: "var(--gradient-primary)" } : undefined}>
              {t.price === 0 ? "Start free" : `Subscribe — $${t.price}/mo`}
            </button>
          </Card>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}