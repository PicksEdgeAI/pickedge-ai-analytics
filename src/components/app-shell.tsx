import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  LayoutDashboard, Target, Users, TrendingUp, Layers, Activity, Sparkles,
  Search, Stethoscope, Trophy, Bookmark, CreditCard, Shield, Menu, X, Bell,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { SlipDrawer } from "./slip-drawer";
import { SlipProvider } from "@/lib/slip-store";

const nav: { to: LinkProps["to"]; label: string; icon: typeof Target; tier?: string }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/picks", label: "Today's Picks", icon: Target },
  { to: "/props", label: "Player Props", icon: Users },
  { to: "/lines", label: "Game Lines", icon: TrendingUp },
  { to: "/parlay", label: "Parlay Builder", icon: Layers },
  { to: "/movement", label: "Live Movement", icon: Activity, tier: "PRO" },
  { to: "/ai", label: "AI Generator", icon: Sparkles },
  { to: "/research", label: "Research", icon: Search },
  { to: "/injuries", label: "Injuries & News", icon: Stethoscope },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/saved", label: "My Picks", icon: Bookmark },
  { to: "/pricing", label: "Pricing", icon: CreditCard },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <SlipProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-sidebar-border bg-sidebar sticky top-0 h-screen">
          <Brand />
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
            {nav.map((n) => <NavItem key={n.to} {...n} active={path === n.to} />)}
          </nav>
          <div className="p-3 border-t border-sidebar-border text-xs text-muted-foreground">
            For entertainment & research only. No wagers accepted.
          </div>
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setOpen(false)} />
            <aside className="relative w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
              <Brand onClose={() => setOpen(false)} />
              <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
                {nav.map((n) => (
                  <div key={n.to} onClick={() => setOpen(false)}>
                    <NavItem {...n} active={path === n.to} />
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 h-14 border-b border-border bg-background/80 backdrop-blur">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 rounded-md hover:bg-secondary">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1 flex items-center gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search players, teams, games…"
                  className="w-full h-9 pl-9 pr-3 rounded-md bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <button className="relative p-2 rounded-md hover:bg-secondary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
            >
              Sign in
            </Link>
          </header>

          <main className="flex-1 p-4 lg:p-6 pb-32 lg:pb-6">{children}</main>
        </div>

        <SlipDrawer />
      </div>
    </SlipProvider>
  );
}

function Brand({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-md flex items-center justify-center font-black text-primary-foreground"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>
          P
        </div>
        <div className="leading-tight">
          <div className="font-bold tracking-tight">PickEdge<span className="text-primary"> AI</span></div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Research • Picks • Parlays</div>
        </div>
      </Link>
      {onClose && (
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function NavItem({ to, label, icon: Icon, tier, active }: { to: LinkProps["to"]; label: string; icon: typeof Target; tier?: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
      <span className="flex-1">{label}</span>
      {tier && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
          {tier}
        </span>
      )}
    </Link>
  );
}