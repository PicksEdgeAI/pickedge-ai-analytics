import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/ui-bits";
import { mockInjuries } from "@/lib/mock-data";
import { Stethoscope, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/injuries")({
  head: () => ({ meta: [{ title: "Injuries & News · PickEdge AI" }] }),
  component: Injuries,
});

function Injuries() {
  return (
    <div className="space-y-5 max-w-[1400px]">
      <PageHeader title="Injuries & News" subtitle="Real-time updates with AI impact analysis on affected props." />

      <div className="grid lg:grid-cols-2 gap-4">
        {mockInjuries.map((i) => (
          <Card key={i.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 rounded-md flex items-center justify-center ${i.status === "Out" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"}`}>
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold">{i.player}</div>
                  <div className="text-xs text-muted-foreground">{i.team} · <Pill tone="accent">{i.league}</Pill></div>
                </div>
              </div>
              <div className="text-right">
                <Pill tone={i.status === "Out" ? "danger" : "warn"}>{i.status}</Pill>
                <div className="text-[10px] text-muted-foreground mt-1">Updated {i.updatedAt}</div>
              </div>
            </div>
            <p className="text-sm mt-3">{i.detail}</p>
            <div className="mt-3 rounded-md border border-warning/30 bg-warning/5 px-3 py-2 text-xs flex gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5" />
              <span>
                <strong>AI impact:</strong> 4 affected props flagged. Usage redistributes to backup unit — fade overs on bench scoring.
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}