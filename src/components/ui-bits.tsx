import type { ReactNode } from "react";
import { Link, type LinkProps } from "@tanstack/react-router";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className}`} style={{ background: "var(--gradient-surface)" }}>
      {children}
    </div>
  );
}

export function Pill({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "primary" | "accent" | "warn" | "danger" | "success" }) {
  const map: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/15 text-primary border-primary/30",
    accent: "bg-accent/15 text-accent border-accent/30",
    warn: "bg-warning/15 text-warning border-warning/30",
    danger: "bg-destructive/15 text-destructive border-destructive/30",
    success: "bg-success/15 text-success border-success/30",
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${map[tone]}`}>{children}</span>;
}

export function OddsButton({ label, odds, onClick, active }: { label: string; odds: number; onClick?: () => void; active?: boolean }) {
  const fmt = odds > 0 ? `+${odds}` : `${odds}`;
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center min-w-[72px] h-14 px-3 rounded-md border transition-all ${
        active
          ? "bg-primary/15 border-primary text-primary shadow-[0_0_0_2px_var(--primary)]"
          : "bg-secondary/60 border-border hover:border-primary/60 hover:bg-secondary"
      }`}
    >
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono font-bold text-sm">{fmt}</span>
    </button>
  );
}

export function CTA({ to, children, variant = "primary" }: { to: LinkProps["to"]; children: ReactNode; variant?: "primary" | "ghost" }) {
  if (variant === "ghost") {
    return (
      <Link to={to} className="inline-flex items-center h-10 px-5 rounded-md border border-border bg-secondary/60 text-sm font-semibold hover:bg-secondary">
        {children}
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className="inline-flex items-center h-10 px-5 rounded-md text-primary-foreground text-sm font-semibold"
      style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}
    >
      {children}
    </Link>
  );
}

export function Sparkline({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-10">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Disclaimer() {
  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-3 text-xs text-warning/90">
      <strong>Disclaimer:</strong> PickEdge AI is an analytics and research platform only. We do not accept wagers and do not guarantee outcomes. For entertainment purposes only. Must be 21+ in applicable jurisdictions. If you or someone you know has a gambling problem, call 1-800-GAMBLER.
    </div>
  );
}