import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/brand";
import { useOffers } from "@/hooks/use-offer-data";
import { categoryLabel, isExpired, timeLeft, type Offer } from "@/lib/offers";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Deal calendar — TOPOFFER" },
      {
        name: "description",
        content:
          "See every posted deal by expiry date: what ends today, what is coming up, what never expires and what has already run out.",
      },
      { property: "og:title", content: "Deal calendar — TOPOFFER" },
      {
        property: "og:description",
        content: "Every deal by expiry date, with expired offers clearly marked.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DealCalendar,
});

const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

const prettyDay = (key: string) =>
  new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

function Group({
  title,
  hint,
  offers,
  expired,
}: {
  title: string;
  hint?: string;
  offers: Offer[];
  expired?: boolean;
}) {
  if (offers.length === 0) return null;
  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {hint ? <span className="text-sm text-muted-foreground">{hint}</span> : null}
        <span className="ml-auto text-sm text-muted-foreground">{offers.length} deals</span>
      </div>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {offers.map((o) => (
          <li
            key={o.id}
            className={`flex items-start gap-3 px-4 py-3 ${expired ? "opacity-60" : ""}`}
          >
            <Tile initials={o.initials} tint={o.tint} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="text-sm font-semibold leading-snug">{o.title}</h3>
                <span className="rounded-full bg-podium px-2 py-0.5 text-xs font-bold text-accent-foreground">
                  {o.discount_label}
                </span>
                {expired ? (
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    expired
                  </span>
                ) : null}
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span className="font-medium text-accent-foreground">
                  {categoryLabel(o.category)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{o.merchant}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeLeft(o.expires_at)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{o.vote_count} votes</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DealCalendar() {
  const { data: offers = [], isLoading } = useOffers();

  const { upcomingDays, evergreen, expired } = useMemo(() => {
    const live = offers.filter((o) => !isExpired(o));
    const evergreenList = live.filter((o) => o.expires_at == null);
    const dated = live.filter((o) => o.expires_at != null);
    const map = new Map<string, Offer[]>();
    for (const o of dated) {
      const key = dayKey(o.expires_at as string);
      map.set(key, [...(map.get(key) ?? []), o]);
    }
    const days = [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, list]) => ({
        key,
        list: [...list].sort((a, b) => b.vote_count - a.vote_count),
      }));
    const expiredList = offers
      .filter((o) => isExpired(o))
      .sort(
        (a, b) =>
          new Date(b.expires_at as string).getTime() - new Date(a.expires_at as string).getTime(),
      );
    return { upcomingDays: days, evergreen: evergreenList, expired: expiredList };
  }, [offers]);

  const today = dayKey(new Date().toISOString());

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-5 pb-16">
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-black tracking-tight">Deal calendar</h1>
          <Link
            to="/"
            search={{ category: "all" }}
            className="ml-auto rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold shadow-card hover:bg-secondary"
          >
            Back to the board
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Deals grouped by the day they end, so you can see what's about to run out. Expired offers
          are greyed out at the bottom.
        </p>

        {isLoading ? (
          <p className="mt-8 rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">
            Loading the calendar…
          </p>
        ) : offers.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-surface p-6 text-center text-sm text-muted-foreground">
            No deals posted yet. Post one on the board and it will show up here.
          </p>
        ) : null}

        {upcomingDays.map((d) => (
          <Group
            key={d.key}
            title={prettyDay(d.key)}
            hint={d.key === today ? "ends today" : undefined}
            offers={d.list}
          />
        ))}

        <Group title="Never expires" hint="no end date" offers={evergreen} />
        <Group title="Expired" offers={expired} expired />
      </main>
      <SiteFooter />
    </div>
  );
}
