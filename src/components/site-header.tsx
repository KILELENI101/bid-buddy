import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { CategoryBar } from "./category-bar";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ scope = "board" }: { scope?: "board" | "dashboard" }) {
  void scope;
  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Logo />
          <div className="hidden min-w-0 flex-1 lg:block">
            <CategoryBar />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
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
              to="/about"
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              About
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
      <div className="mt-4 lg:hidden">
        <CategoryBar />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground">
        <Logo />
        <p className="max-w-sm">
          Community-ranked offers, deals and coupon codes. Votes decide the podium.
        </p>
        <nav className="flex items-center gap-4">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
