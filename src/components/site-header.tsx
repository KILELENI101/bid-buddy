import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { Trophy } from "lucide-react";

const nav = [
  { to: "/", label: "Leaderboard" },
  { to: "/today", label: "Daily" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader({ scope = "all" }: { scope?: "all" | "today" }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-5 py-6">
      <Logo />
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm font-medium shadow-card">
        <Link
          to="/"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
            scope === "all" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="h-3.5 w-3.5" />
          All-time
        </Link>
        <Link
          to="/today"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
            scope === "today" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
          Today
        </Link>
      </div>
      <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
            activeOptions={{ exact: true }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <Logo />
        <p>Rank is rented, never owned. Highest standing bid holds the slot.</p>
      </div>
    </footer>
  );
}
