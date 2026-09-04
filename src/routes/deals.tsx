import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowUpRight, Clock, Search, Tag } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { JsonLd, SITE_URL, breadcrumbs } from "@/components/structured-data";
import { Tile } from "@/components/brand";
import { useOffers, useVisitorKey } from "@/hooks/use-offer-data";
import {
  allCategories,
  categoryLabel,
  isExpired,
  rankOffers,
  registerClick,
  registerViews,
  timeLeft,
} from "@/lib/offers";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "all").default("all"),
  expiry: fallback(z.string(), "all").default("all"),
  code: fallback(z.string(), "all").default("all"),
});

const EXPIRY_OPTIONS = [
  { id: "all", label: "Any expiry" },
  { id: "48h", label: "Ends in 48 hours" },
  { id: "7d", label: "Ends in 7 days" },
  { id: "30d", label: "Ends in 30 days" },
  { id: "never", label: "Never expires" },
];

const CODE_OPTIONS = [
  { id: "all", label: "Codes & offers" },
  { id: "with", label: "With coupon code" },
  { id: "without", label: "No code needed" },
];

export const Route = createFileRoute("/deals")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "All deals feed — TOPOFFER" },
      {
        name: "description",
        content:
          "Search every live deal, coupon code and free offer on TOPOFFER and filter by category, coupon code or expiry date.",
      },
      { property: "og:title", content: "All deals feed — TOPOFFER" },
      {
        property: "og:description",
        content: "Search and filter every live coupon and offer by category and expiry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DealsFeed,
});

const withinHours = (iso: string | null, hours: number) => {
  if (!iso) return false;
  const ms = new Date(iso).getTime() - Date.now();
  return ms > 0 && ms <= hours * 3_600_000;
};

function DealsFeed() {
  const { data: offers = [], isLoading } = useOffers();
  const visitorKey = useVisitorKey();
  const navigate = useNavigate({ from: "/deals" });
  const { q, category, expiry, code } = Route.useSearch();

  const update = (patch: Record<string, string | undefined>) => {
    void navigate({
      search: (prev) => ({ ...prev, ...patch }),
      resetScroll: false,
    });
  };

  const live = useMemo(() => rankOffers(offers.filter((o) => !isExpired(o))), [offers]);
  const categoryOptions = useMemo(() => allCategories(offers), [offers]);

  const feed = useMemo(() => {
    const term = q.trim().toLowerCase().slice(0, 100);
    return live.filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (code === "with" && !o.coupon_code) return false;
      if (code === "without" && o.coupon_code) return false;
      if (expiry === "never" && o.expires_at) return false;
      if (expiry === "48h" && !withinHours(o.expires_at, 48)) return false;
      if (expiry === "7d" && !withinHours(o.expires_at, 24 * 7)) return false;
      if (expiry === "30d" && !withinHours(o.expires_at, 24 * 30)) return false;
      if (term === "") return true;
      return [o.title, o.description, o.merchant, o.coupon_code ?? "", categoryLabel(o.category)]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [live, q, category, expiry, code]);

  const visibleIds = feed.slice(0, 40).map((o) => o.id);
  const idKey = visibleIds.join(",");
  useEffect(() => {
    if (!visitorKey || visibleIds.length === 0) return;
    void registerViews(visibleIds, visitorKey).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorKey, idKey]);

  const filtersOn = q !== "" || category !== "all" || expiry !== "all" || code !== "all";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-5">
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Deals feed</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Every live deal and coupon in one list — discount, expiry and what you actually get.
        </p>

        <JsonLd
          data={breadcrumbs([
            { name: "TOPOFFER", path: "/" },
            { name: "Deals feed", path: "/deals" },
          ])}
        />
        {live.length > 0 ? (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Live deals on TOPOFFER",
              url: `${SITE_URL}/deals`,
              numberOfItems: live.length,
              itemListElement: live.slice(0, 100).map((offer, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "Offer",
                  name: offer.title,
                  description: offer.description,
                  url: offer.url,
                  category: categoryLabel(offer.category),
                  availability: "https://schema.org/InStock",
                  seller: { "@type": "Organization", name: offer.merchant },
                  ...(offer.coupon_code ? { couponCode: offer.coupon_code } : {}),
                  ...(offer.expires_at ? { validThrough: offer.expires_at } : {}),
                },
              })),
            }}
          />
        ) : null}

        <section aria-label="Search and filter deals" className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search the deals feed"
              value={q}
              onChange={(e) => update({ q: e.target.value || undefined })}
              placeholder="Search by title, merchant, code or description"
              className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="feed-category">
              Category
            </label>
            <select
              id="feed-category"
              value={category}
              onChange={(e) => update({ category: e.target.value })}
              className="h-10 rounded-full border border-border bg-card px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/40"
            >
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id === "all" ? "All categories" : c.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="feed-expiry">
              Expiry
            </label>
            <select
              id="feed-expiry"
              value={expiry}
              onChange={(e) => update({ expiry: e.target.value })}
              className="h-10 rounded-full border border-border bg-card px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/40"
            >
              {EXPIRY_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="feed-code">
              Coupon code
            </label>
            <select
              id="feed-code"
              value={code}
              onChange={(e) => update({ code: e.target.value })}
              className="h-10 rounded-full border border-border bg-card px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/40"
            >
              {CODE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>

            {filtersOn ? (
              <button
                type="button"
                onClick={() =>
                  update({ q: undefined, category: "all", expiry: "all", code: "all" })
                }
                className="h-10 rounded-full px-3 text-sm font-semibold text-primary hover:underline"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Showing {feed.length} of {live.length} live deals.
          </p>
        </section>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading deals…</p>
        ) : feed.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            No deals match these filters yet.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {feed.map((offer) => (
              <li
                key={offer.id}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <Tile initials={offer.initials} tint={offer.tint} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-base font-semibold leading-snug">{offer.title}</h2>
                    <span className="ml-auto rounded-full bg-podium px-2.5 py-0.5 text-sm font-bold text-accent-foreground">
                      {offer.discount_label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {offer.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-medium text-accent-foreground">
                      {categoryLabel(offer.category)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{offer.merchant}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeLeft(offer.expires_at)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{offer.clicks.toLocaleString("en-US")} clicks</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {offer.coupon_code ? (
                      <button
                        onClick={() => {
                          void navigator.clipboard
                            .writeText(offer.coupon_code as string)
                            .then(() => toast.success(`Copied code ${offer.coupon_code}`))
                            .catch(() =>
                              toast.error("Couldn't copy — select the code manually."),
                            );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary bg-card px-3 py-1.5 text-xs font-bold tracking-wide text-primary"
                      >
                        <Tag className="h-3 w-3" />
                        {offer.coupon_code}
                        <span className="font-medium text-muted-foreground">copy</span>
                      </button>
                    ) : (
                      <span className="rounded-full bg-surface px-3 py-1.5 text-xs text-muted-foreground">
                        No code needed
                      </span>
                    )}
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="nofollow noopener"
                      onClick={() => {
                        void registerClick(offer, visitorKey).catch(() => undefined);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                    >
                      Get deal <ArrowUpRight className="h-3 w-3" />
                    </a>
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
