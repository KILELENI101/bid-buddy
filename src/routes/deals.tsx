import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowUpRight, Clock, Tag } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Tile } from "@/components/brand";
import { useOffers, useVisitorKey } from "@/hooks/use-offer-data";
import {
  categoryLabel,
  isExpired,
  rankOffers,
  registerClick,
  timeLeft,
} from "@/lib/offers";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "All deals feed — TOPOFFER" },
      {
        name: "description",
        content:
          "Every live deal, coupon code and free offer on TOPOFFER with its discount, expiry date and a short description.",
      },
      { property: "og:title", content: "All deals feed — TOPOFFER" },
      {
        property: "og:description",
        content: "Browse every live coupon and offer with discount, expiry and description.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DealsFeed,
});

function DealsFeed() {
  const { data: offers = [], isLoading } = useOffers();
  const visitorKey = useVisitorKey();

  const feed = useMemo(
    () => rankOffers(offers.filter((o) => !isExpired(o))),
    [offers],
  );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-5">
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Deals feed</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Every live deal and coupon in one list — discount, expiry and what you actually get.
        </p>

        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading deals…</p>
        ) : feed.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No live deals yet.</p>
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
