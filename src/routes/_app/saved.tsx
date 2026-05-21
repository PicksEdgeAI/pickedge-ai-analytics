import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/ui-bits";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/_app/saved")({
  head: () => ({ meta: [{ title: "My Saved Picks · PickEdge AI" }] }),
  component: Saved,
});

const SAVED = [
  { id: "s1", label: "Luka Dončić OVER 32.5 Points", book: "DraftKings", odds: "-115", status: "Pending", date: "Today" },
  { id: "s2", label: "Chiefs ML", book: "FanDuel", odds: "-120", status: "Won", date: "Yesterday" },
  { id: "s3", label: "Dodgers vs Padres Over 8.5", book: "BetMGM", odds: "-110", status: "Lost", date: "2 days ago" },
  { id: "s4", label: "McDavid UNDER 4.5 SOG", book: "Caesars", odds: "-125", status: "Won", date: "3 days ago" },
];

function Saved() {
  const won = SAVED.filter((p) => p.status === "Won").length;
  const lost = SAVED.filter((p) => p.status === "Lost").length;
  return (
    <div className="space-y-5 max-w-[1100px]">
      <PageHeader title="My Saved Picks" subtitle="Track every pick and parlay you've saved." />

      <div className="grid grid-cols-3 gap-3">
        <Stat k="Pending" v={String(SAVED.filter((p) => p.status === "Pending").length)} />
        <Stat k="Record" v={`${won}-${lost}`} accent />
        <Stat k="ROI (30d)" v="+18.4%" accent />
      </div>

      <Card className="!p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="p-3">Pick</th><th className="p-3">Book</th><th className="p-3">Odds</th><th className="p-3">Status</th><th className="p-3">Saved</th>
            </tr>
          </thead>
          <tbody>
            {SAVED.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{s.label}</span>
                  </div>
                </td>
                <td className="p-3">{s.book}</td>
                <td className="p-3 font-mono">{s.odds}</td>
                <td className="p-3"><Pill tone={s.status === "Won" ? "success" : s.status === "Lost" ? "danger" : "warn"}>{s.status}</Pill></td>
                <td className="p-3 text-muted-foreground">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Stat({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <Card className="!p-4 text-center">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? "text-primary" : ""}`}>{v}</div>
    </Card>
  );
}