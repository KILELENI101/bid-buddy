import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, MousePointerClick, Percent } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/brand";
import { useOffers, useVisitorKey } from "@/hooks/use-offer-data";
import {
  CLICK_TRACKING_ENABLED,
  categoryLabel,
  conversionRate,
  formatPercent,
  isExpired,
  type Offer,
} from "@/lib/offers";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Deal analytics — TOPOFFER" },
      {
        name: "description",
        content:
          "See views, outbound clicks and conversion rates for every deal on TOPOFFER, and compare how your own posted deals perform.",
      },
      { property: "og:title", content: "Deal analytics — TOPOFFER" },
      {
        property: "og:description",
        content: "Views, clicks and conversion rates for every deal on the board.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Analytics,
});

type Scope = "all" | "mine";
type SortKey = "clicks" | "views" | "rate";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function Analytics() {
  const { data: offers = [], isLoading } = useOffers();
  const visitorKey = useVisitorKey();
  const [scope, setScope] = useState<Scope>("all");
  const [sort, setSort] = useState<SortKey>("clicks");

  const rows = useMemo(() => {
    const base = offers.filter((o: Offer) =>
      scope === "mine" ? visitorKey !== "" && o.owner_key === visitorKey : true,
    );
    const sorted = [...base].sort((a, b) => {
      if (sort === "views") return b.views - a.views;
      if (sort === "rate") return conversionRate(b) - conversionRate(a);
      return b.clicks - a.clicks;
    });
    return sorted;
  }, [offers, scope, sort, visitorKey]);

  const totals = useMemo(() => {
    const views = rows.reduce((sum, o) => sum + o.views, 0);
    const clicks = rows.reduce((sum, o) => sum + o.clicks, 0);
    return { views, clicks, rate: views > 0 ? clicks / views : 0 };
  }, [rows]);

  return (
    <div className="min-h-screen">
      <SiteHeader scope="dashboard" />
      <main className="mx-auto w-full max-w-5xl px-5">
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Deal analytics</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Every time a deal is shown in the feed it counts as a view, and every “Get deal”
          click counts as a conversion. The conversion rate is clicks divided by views.
        </p>

        {!CLICK_TRACKING_ENABLED ? (
          <p className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
            Tracking is currently switched off, so these numbers will stay at zero.
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat
            icon={<Eye className="h-4 w-4" />}
            label="Views"
            value={totals.views.toLocaleString("en-US")}
          />
          <Stat
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Clicks"
            value={totals.clicks.toLocaleString("en-US")}
          />
          <Stat
            icon={<Percent className="h-4 w-4" />}
            label="Conversion rate"
            value={formatPercent(totals.rate)}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {(
            [
              { id: "all", label: "All deals" },
              { id: "mine", label: "My deals" },
            ] as { id: Scope; label: string }[]
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScope(s.id)}
              aria-pressed={scope === s.id}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                scope === s.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {s.label}
            </button>
          ))}

          <label className="sr-only" htmlFor="analytics-sort">
            Sort by
          </label>
          <select
            id="analytics-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="ml-auto h-10 rounded-full border border-border bg-card px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/40"
          >
            <option value="clicks">Most clicks</option>
            <option value="views">Most views</option>
            <option value="rate">Best conversion rate</option>
          </select>
        </div>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading numbers…</p>
        ) : rows.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            {scope === "mine"
              ? "You haven't posted a deal yet, so there is nothing to measure."
              : "No deals to measure yet."}
          </p>
        ) : (
          <ul className="mt-6 space-y-2">
            {rows.map((offer) => (
              <li
                key={offer.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
              >
                <Tile initials={offer.initials} tint={offer.tint} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{offer.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {offer.merchant} · {categoryLabel(offer.category)}
                    {isExpired(offer) ? " · expired" : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-5 text-right text-sm tabular-nums">
                  <div>
                    <p className="font-semibold">{offer.views.toLocaleString("en-US")}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                  <div>
                    <p className="font-semibold">{offer.clicks.toLocaleString("en-US")}</p>
                    <p className="text-xs text-muted-foreground">clicks</p>
                  </div>
                  <div className="w-16">
                    <p className="font-semibold text-primary">
                      {formatPercent(conversionRate(offer))}
                    </p>
                    <p className="text-xs text-muted-foreground">rate</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
