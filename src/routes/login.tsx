import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · PickEdge AI" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border p-8" style={{ background: "var(--gradient-surface)" }}>
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-md flex items-center justify-center font-black text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>P</div>
          <span className="font-bold tracking-tight text-lg">PickEdge<span className="text-primary"> AI</span></span>
        </Link>
        <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "signin" ? "Sign in to track picks and unlock AI insights." : "Free to start. No credit card required."}
        </p>

        <form className="space-y-3 mt-6" onSubmit={handleSubmit}>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-11 px-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full h-11 px-3 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {err && <div className="text-sm text-destructive">{err}</div>}
          <button
            type="submit" disabled={loading}
            className="w-full inline-flex items-center justify-center h-11 rounded-md text-primary-foreground font-semibold disabled:opacity-60"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => { setErr(null); setMode(mode === "signin" ? "signup" : "signin"); }}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By continuing you agree to our terms. Research only. Not a sportsbook.
        </p>
      </div>
    </div>
  );
}