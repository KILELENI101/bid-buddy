import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/brand";
import { activity, formatMoney, todaysTop } from "@/lib/rankings";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today's board — bidrank.lol" },
      {
        name: "description",
        content: "The daily board resets every midnight UTC. Small bids, fast turnover, front-page clicks.",
      },
      { property: "og:title", content: "Today's board — bidrank.lol" },
      {
        property: "og:description",
        content: "The daily board resets every midnight UTC. Small bids, fast turnover, front-page clicks.",
      },
    ],
  }),
  component: Today,
});

function Today() {
  return (
    <div className="min-h-screen">
      <SiteHeader scope="today" />
      <main className="mx-auto w-full max-w-4xl px-5">
        <h1 className="text-4xl font-bold tracking-tight">Today's board</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Resets at midnight UTC. Bids start at $1, so the daily top three usually changes several
          times an hour.
        </p>

        <div className="mt-8 space-y-2">
          {todaysTop.map((t) => (
            <div
              key={t.rank}
              className="rank-row rank-row-podium flex items-center gap-4 px-4 py-4"
            >
              <span className="w-11 rounded-lg bg-primary py-1 text-center text-sm font-bold text-primary-foreground">
                #{t.rank}
              </span>
              <Tile initials={t.initials} tint={t.tint} />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold">{t.name}</h2>
                <p className="text-sm text-muted-foreground">{t.tagline}</p>
              </div>
              <span className="font-bold text-primary">{formatMoney(t.amount)}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-lg font-bold">Recent bids</h2>
        <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
          {activity.map((a) => (
            <div key={a.name} className="flex items-center gap-3 px-4 py-3">
              <Tile initials={a.initials} tint={a.tint} size="sm" />
              <p className="min-w-0 flex-1 truncate text-sm font-medium">{a.name}</p>
              <span className="text-xs text-muted-foreground">#{a.rank}</span>
              <span className="text-sm font-semibold text-primary">{formatMoney(a.amount)}</span>
              <span className="hidden text-xs text-muted-foreground sm:block">{a.when}</span>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
