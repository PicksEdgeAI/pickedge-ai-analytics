import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · PickEdge AI" }] }),
  component: Login,
});

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border border-border p-8" style={{ background: "var(--gradient-surface)" }}>
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-md flex items-center justify-center font-black text-primary-foreground"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--glow-primary)" }}>P</div>
          <span className="font-bold tracking-tight text-lg">PickEdge<span className="text-primary"> AI</span></span>
        </Link>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to track your picks and unlock AI insights.</p>

        <button className="mt-6 w-full h-11 rounded-md border border-border bg-secondary/60 font-semibold flex items-center justify-center gap-2 hover:bg-secondary">
          <span>Continue with Google</span>
        </button>
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" /> OR <div className="flex-1 h-px bg-border" />
        </div>
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email" className="w-full h-11 px-3 rounded-md bg-secondary border border-border text-sm" />
          <input type="password" placeholder="Password" className="w-full h-11 px-3 rounded-md bg-secondary border border-border text-sm" />
          <Link to="/dashboard" className="w-full inline-flex items-center justify-center h-11 rounded-md text-primary-foreground font-semibold"
            style={{ background: "var(--gradient-primary)" }}>
            Sign in
          </Link>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          By continuing you agree to our terms. Research only. Not a sportsbook.
        </p>
      </div>
    </div>
  );
}