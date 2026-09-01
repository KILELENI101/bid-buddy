import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { Flame, LayoutDashboard } from "lucide-react";

export function SiteHeader({ scope = "board" }: { scope?: "board" | "dashboard" }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-5 py-6">
      <Logo />
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm font-medium shadow-card">
        <Link
          to="/"
          search={{ category: "all" }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
            scope === "board"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          Hot deals
        </Link>
        <Link
          to="/today"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
            scope === "dashboard"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          My dashboard
        </Link>
      </div>
      <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
        <Link
          to="/"
          search={{ category: "all" }}
          className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
          activeOptions={{ exact: true }}
        >
          Deals
        </Link>
        <Link
          to="/today"
          className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Dashboard
        </Link>
        <Link
          to="/ranking"
          className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Ranking
        </Link>
        <Link
          to="/categories"
          className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Categories
        </Link>
        <Link
          to="/about"
          className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          About
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <Logo />
        <p>Community-ranked offers, deals and coupon codes. Votes decide the podium.</p>
      </div>
    </footer>
  );
}
