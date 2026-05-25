import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/ui-bits";
import { Bookmark, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/saved")({
  head: () => ({ meta: [{ title: "My Saved Picks · PickEdge AI" }] }),
  component: Saved,
});

type Row = {
  id: string;
  created_at: string;
  ai_picks: {
    pick_label: string;
    pick_type: string;
    odds: number | null;
    grade: string | null;
    result: "pending" | "won" | "lost" | "push" | "void";
  } | null;
};

function Saved() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["saved-picks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_picks")
        .select("id, created_at, ai_picks(pick_label, pick_type, odds, grade, result)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_picks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-picks"] }),
  });

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-[700px]">
        <PageHeader title="My Saved Picks" subtitle="Sign in to save and track your picks." />
        <Card className="text-center py-12">
          <Bookmark className="h-10 w-10 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-bold">Sign in to view your saved picks</h3>
          <p className="text-sm text-muted-foreground mt-1">It's free. Track every pick you save.</p>
          <Link to="/login" className="inline-flex mt-5 items-center h-10 px-5 rounded-md text-primary-foreground font-semibold"
            style={{ background: "var(--gradient-primary)" }}>
            Sign in / Sign up
          </Link>
        </Card>
      </div>
    );
  }

  const won = rows.filter((r) => r.ai_picks?.result === "won").length;
  const lost = rows.filter((r) => r.ai_picks?.result === "lost").length;
  const pending = rows.filter((r) => r.ai_picks?.result === "pending").length;

  return (
    <div className="space-y-5 max-w-[1100px]">
      <PageHeader title="My Saved Picks" subtitle="Track every pick you've saved." />

      <div className="grid grid-cols-3 gap-3">
        <Stat k="Pending" v={String(pending)} />
        <Stat k="Record" v={`${won}-${lost}`} accent />
        <Stat k="Total" v={String(rows.length)} accent />
      </div>

      <Card className="!p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <Bookmark className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No saved picks yet. Save AI picks from the AI Generator or Today's Picks pages.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Pick</th><th className="p-3">Type</th><th className="p-3">Odds</th><th className="p-3">Status</th><th className="p-3">Saved</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{r.ai_picks?.pick_label ?? "—"}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{r.ai_picks?.pick_type ?? "—"}</td>
                  <td className="p-3 font-mono">{r.ai_picks?.odds ?? "—"}</td>
                  <td className="p-3">
                    <Pill tone={r.ai_picks?.result === "won" ? "success" : r.ai_picks?.result === "lost" ? "danger" : "warn"}>
                      {r.ai_picks?.result ?? "pending"}
                    </Pill>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => del.mutate(r.id)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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