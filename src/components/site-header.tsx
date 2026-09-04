import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Logo } from "./brand";
import { CategoryBar } from "./category-bar";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelect } from "./language-select";
import { RANGES, isRangeId } from "@/lib/ranges";

const navLink =
  "rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

export function SiteHeader({ scope = "board" }: { scope?: "board" | "dashboard" }) {
  void scope;
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { range?: string; q?: string; category?: string };
  const range = isRangeId(search.range) ? search.range : "all";
  const query = search.q ?? "";

  const update = (patch: Record<string, string | undefined>) => {
    navigate({
      to: "/",
      search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }),
      resetScroll: false,
    });
  };

  return (
    <header className="w-full">
      <div className="mx-auto w-full max-w-6xl px-5 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <Logo />
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => update({ range: r.id })}
                aria-pressed={range === r.id}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  range === r.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <nav className="hidden shrink-0 items-center gap-1 text-sm font-medium sm:flex">
            <Link
              to="/"
              search={{ category: "all" }}
              className={navLink}
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: true }}
            >
              Deals
            </Link>
            <Link to="/deals" className={navLink} activeProps={{ className: "text-foreground" }}>
              Feed
            </Link>
            <Link to="/today" className={navLink} activeProps={{ className: "text-foreground" }}>
              Dashboard
            </Link>

            <Link to="/ranking" className={navLink} activeProps={{ className: "text-foreground" }}>
              Ranking
            </Link>
            <Link to="/calendar" className={navLink} activeProps={{ className: "text-foreground" }}>
              Calendar
            </Link>
            <Link to="/about" className={navLink} activeProps={{ className: "text-foreground" }}>
              About
            </Link>
          </nav>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <LanguageSelect />
          <ThemeToggle />
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            aria-label="Search deals"
            value={query}
            onChange={(e) => update({ q: e.target.value || undefined })}
            placeholder="Search deals, codes, or merchants"
            className="h-13 w-full rounded-full border border-border bg-card pl-12 pr-5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      <div className="mt-4 border-y border-border bg-secondary/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-2">
          <CategoryBar />
        </div>
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
