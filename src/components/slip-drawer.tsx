import { Link } from "@tanstack/react-router";
import { Layers, X, Share2 } from "lucide-react";
import { useState } from "react";
import { useSlip } from "@/lib/slip-store";
import { americanToDecimal, formatOdds, impliedProb } from "@/lib/mock-data";

export function SlipDrawer() {
  const { picks, remove, clear } = useSlip();
  const [open, setOpen] = useState(false);
  const count = picks.length;

  const decimal = picks.reduce((a, p) => a * americanToDecimal(p.odds), 1);
  const payout = (decimal * 10).toFixed(2);
  const american = decimal >= 2 ? `+${Math.round((decimal - 1) * 100)}` : `-${Math.round(100 / (decimal - 1))}`;
  const implied = picks.reduce((a, p) => a * impliedProb(p.odds), 1);

  return (
    <>
      {/* Floating bar (mobile sticky bottom) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2 h-12 px-5 rounded-full font-semibold text-primary-foreground shadow-2xl"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}
      >
        <Layers className="h-5 w-5" />
        Pick Slip
        <span className="ml-1 px-2 py-0.5 rounded-full bg-background/30 text-xs">{count}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <aside
            className="relative w-full sm:w-[420px] h-full bg-card border-l border-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">Pick Slip ({count})</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded hover:bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {count === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">
                  No picks added yet. Tap any odds line to add.
                </div>
              )}
              {picks.map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-secondary/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{p.detail}</div>
                      {p.book && <div className="text-[10px] text-muted-foreground mt-1">{p.book}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono font-bold text-primary">{formatOdds(p.odds)}</span>
                      <button onClick={() => remove(p.id)} className="text-xs text-muted-foreground hover:text-destructive">
                        Remove
                      </button>
                    </div>
                  </div>
                  {p.confidence && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">AI Confidence</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${p.confidence}%` }} />
                      </div>
                      <span className="font-semibold">{p.confidence}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {count > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Stat label="Odds" value={american} />
                  <Stat label="$10 wins" value={`$${payout}`} accent />
                  <Stat label="Implied" value={`${(implied * 100).toFixed(1)}%`} />
                </div>
                <div className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs">
                  AI Parlay Grade: <span className="font-bold text-warning">B+</span> · No bad correlations detected
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/parlay"
                    onClick={() => setOpen(false)}
                    className="flex-1 h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-sm"
                  >
                    Open Parlay Builder
                  </Link>
                  <button className="h-10 px-3 rounded-md border border-border hover:bg-secondary" title="Share">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-destructive">
                  Clear all
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md bg-secondary/60 px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-bold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}