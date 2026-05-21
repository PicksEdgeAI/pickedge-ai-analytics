import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin · PickEdge AI" }] }),
  component: Admin,
});

function Admin() {
  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Admin Dashboard" subtitle="Users, subscriptions, API sync, and feature flags." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: "Users", v: "2,431" }, { k: "Active subs", v: "684" },
          { k: "MRR", v: "$22.4k" }, { k: "API errors (24h)", v: "3" },
        ].map((s) => (
          <Card key={s.k} className="!p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.k}</div>
            <div className="text-2xl font-bold mt-1 text-primary">{s.v}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-bold mb-3">API Sync Status</h2>
        <div className="space-y-2 text-sm">
          {[
            { k: "Game schedules", t: "6h", s: "ok" }, { k: "Odds feed", t: "2m", s: "ok" },
            { k: "Player props", t: "5m", s: "ok" }, { k: "Injuries", t: "12m", s: "warn" },
            { k: "Final stats", t: "—", s: "ok" },
          ].map((r) => (
            <div key={r.k} className="flex items-center justify-between border-t border-border first:border-0 pt-2 first:pt-0">
              <span>{r.k}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">last: {r.t} ago</span>
                <Pill tone={r.s === "ok" ? "success" : "warn"}>{r.s === "ok" ? "Healthy" : "Delayed"}</Pill>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold mb-3">Feature flags</h2>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          {["AI Generator v2", "Sharp Alerts", "Lottery Parlays", "SMS notifications"].map((f) => (
            <label key={f} className="flex items-center justify-between p-3 rounded-md bg-secondary/40 border border-border">
              <span>{f}</span>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4" />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}