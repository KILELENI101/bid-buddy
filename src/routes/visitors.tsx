import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Repeat, MousePointerClick, Users, Eye } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/brand";
import { useOffers, useVisitorStats } from "@/hooks/use-offer-data";
import {
  CLICK_TRACKING_ENABLED,
  categoryLabel,
  conversionRate,
  formatPercent,
} from "@/lib/offers";

export const Route = createFileRoute("/visitors")({
  head: () => ({
    meta: [
      { title: "Visitors dashboard — TOPOFFER" },
      {
        name: "description",
        content:
          "See how many people reach TOPOFFER, how many click through to each deal and how many keep coming back.",
      },
      { property: "og:title", content: "Visitors dashboard — TOPOFFER" },
      {
        property: "og:description",
        content: "Traffic, click-throughs and returning visitors for the TOPOFFER deals board.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Visitors,
});

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Visitors() {
  const { data: stats, isLoading: statsLoading } = useVisitorStats();
  const { data: offers = [] } = useOffers();

  const rows = useMemo(
    () => [...offers].sort((a, b) => b.clicks - a.clicks).slice(0, 25),
    [offers],
  );

  const totals = useMemo(() => {
    const clicks = offers.reduce((sum, o) => sum + o.clicks, 0);
    const views = offers.reduce((sum, o) => sum + o.views, 0);
    return { clicks, views };
  }, [offers]);

  const num = (n: number) => n.toLocaleString("en-US");
  const returnRate =
    stats && stats.visitors > 0 ? stats.returning / stats.visitors : 0;

  return (
    <div className="min-h-screen">
      <SiteHeader scope="dashboard" />
      <main className="mx-auto w-full max-w-5xl px-5">
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Visitors</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Every browser that opens the site counts once per session. A returning visitor is
          someone who came back at least half an hour later. Nothing personal is stored — only
          an anonymous id kept in the browser.
        </p>

        {!CLICK_TRACKING_ENABLED ? (
          <p className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
            Click tracking is switched off, so click numbers will stay at zero.
          </p>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={<Users className="h-4 w-4" />}
            label="People reached"
            value={statsLoading ? "…" : num(stats?.visitors ?? 0)}
            hint={`${num(stats?.visits ?? 0)} visits in total`}
          />
          <Stat
            icon={<Repeat className="h-4 w-4" />}
            label="Returning"
            value={statsLoading ? "…" : num(stats?.returning ?? 0)}
            hint={`${formatPercent(returnRate)} come back`}
          />
          <Stat
            icon={<Eye className="h-4 w-4" />}
            label="Deal views"
            value={num(totals.views)}
            hint={`${num(stats?.today ?? 0)} visitors today`}
          />
          <Stat
            icon={<MousePointerClick className="h-4 w-4" />}
            label="Click-throughs"
            value={num(totals.clicks)}
            hint={`${num(stats?.week ?? 0)} visitors this week`}
          />
        </div>

        <h2 className="mt-10 text-lg font-bold">Most clicked deals</h2>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No deals to measure yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
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
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-5 text-right text-sm tabular-nums">
                  <div>
                    <p className="font-semibold">{num(offer.views)}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                  <div>
                    <p className="font-semibold">{num(offer.clicks)}</p>
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
