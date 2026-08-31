import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Globe, Minus, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { RankRow } from "@/components/rank-list";
import { Tile } from "@/components/brand";
import { activity, categories, formatMoney, listings, todaysTop } from "@/lib/rankings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "bidrank.lol — pay to hold the #1 spot" },
      {
        name: "description",
        content:
          "A live leaderboard where the highest bid holds rank #1. Claim a slot, get clicks, get outbid.",
      },
      { property: "og:title", content: "bidrank.lol — pay to hold the #1 spot" },
      {
        property: "og:description",
        content: "A live leaderboard where the highest bid holds rank #1. Claim a slot and get clicks.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { category: string } => ({
    category: typeof search['category'] === "string" ? (search['category'] as string) : "all",
  }),
  component: Home,
});

function Home() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const [bid, setBid] = useState(18405);
  const [url, setUrl] = useState("");
  const [pick, setPick] = useState("");
  const active = category && categories.some((c) => c.id === category) ? category : "all";
  const setActive = (id: string) =>
    navigate({ search: { category: id }, resetScroll: false });

  const rows = useMemo(
    () => (active === "all" ? listings : listings.filter((l) => l.category === active)),
    [active],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader scope="all" />

      <main className="mx-auto w-full max-w-6xl px-5">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-live live-dot" />
            <span className="font-semibold text-foreground">183 online</span>
            <span aria-hidden="true">·</span>
            <span>1,429,192 visitors</span>
          </div>
        </div>

        <h1 className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center text-4xl font-bold tracking-tight sm:text-5xl">
          Claim #1 for
          <span className="flex items-center gap-2">
            <button
              onClick={() => setBid((v) => Math.max(1, v - 5))}
              aria-label="Lower bid"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-primary">{formatMoney(bid)}</span>
            <button
              onClick={() => setBid((v) => v + 5)}
              aria-label="Raise bid"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </span>
        </h1>

        <form
          className="mt-8 flex flex-wrap items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!url.trim()) {
              toast.error("Add a product URL or @handle first.");
              return;
            }
            if (!pick) {
              toast.error("Pick a category for your slot.");
              return;
            }
            const label = categories.find((c) => c.id === pick)?.label ?? pick;
            const beats = listings.filter((l) => l.amount < bid).length;
            toast.success(`Bid of ${formatMoney(bid)} placed on ${label}`, {
              description: `${url.trim()} would sit above ${beats} ${beats === 1 ? "listing" : "listings"}. Demo board — no payment taken.`,
            });
            setUrl("");
            setPick("");
          }}
        >
          <div className="relative flex-1 min-w-[260px]">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Your product URL or @handle"
              className="h-13 w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-4 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select
              className="h-13 w-full appearance-none rounded-full border border-border bg-card py-3.5 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              value={pick}
              onChange={(e) => setPick(e.target.value)}
            >
              <option value="" disabled>
                Choose a category
              </option>
              {categories
                .filter((c) => c.id !== "all")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <button className="h-13 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5">
            Claim rank
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {c.label}
            </button>
          ))}
          <Link
            to="/categories"
            className="ml-auto flex items-center gap-1 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card transition-colors hover:bg-secondary"
          >
            Explore <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <section className="mt-6 space-y-2" aria-label="Leaderboard">
          {rows.slice(0, 3).map((item) => (
            <RankRow key={item.rank} item={item} />
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold">Today's top ranking</h2>
            <Link to="/today" className="text-sm text-muted-foreground hover:text-foreground">
              See all
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {todaysTop.map((t) => (
              <div key={t.rank} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
                <span className="text-xs font-bold text-muted-foreground">#{t.rank}</span>
                <Tile initials={t.initials} tint={t.tint} size="sm" />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{t.name}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{t.tagline}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{formatMoney(t.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-primary live-dot" />
            Latest activity
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activity.map((a) => (
              <div key={a.name} className="flex items-center gap-3 rounded-xl bg-surface p-3">
                <Tile initials={a.initials} tint={a.tint} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    at #{a.rank} · {formatMoney(a.amount)} · {a.when}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 space-y-2">
          {rows.slice(3).map((item) => (
            <RankRow key={item.rank} item={item} />
          ))}
          {rows.length === 0 ? (
            <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted-foreground">
              Nothing claimed in this category yet — the #1 slot is cheap today.
            </p>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
