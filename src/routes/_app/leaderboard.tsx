import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/ui-bits";
import { leaderboard } from "@/lib/mock-data";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/_app/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard · PickEdge AI" }] }),
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <div className="space-y-5 max-w-[1100px]">
      <PageHeader title="Leaderboard" subtitle="Top community researchers, ranked by ROI." />

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="p-3">Rank</th><th className="p-3">User</th><th className="p-3">Record</th><th className="p-3">ROI</th><th className="p-3">Units</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((r) => (
              <tr key={r.rank} className="border-t border-border hover:bg-secondary/30">
                <td className="p-3">
                  <div className={`flex items-center gap-2 font-bold ${r.rank === 1 ? "text-primary" : ""}`}>
                    {r.rank === 1 && <Trophy className="h-4 w-4" />}#{r.rank}
                  </div>
                </td>
                <td className="p-3 font-semibold">{r.user}</td>
                <td className="p-3 font-mono">{r.record}</td>
                <td className="p-3"><Pill tone="success">{r.roi}</Pill></td>
                <td className="p-3 font-mono text-primary font-bold">{r.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}