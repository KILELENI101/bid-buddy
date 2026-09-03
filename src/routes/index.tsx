import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Globe, CalendarClock } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { OfferRow } from "@/components/offer-row";
import { Tile } from "@/components/brand";
import { useMyVotes, useOffers, useToggleVote, useVisitorKey } from "@/hooks/use-offer-data";
import {
  categories,
  isLive,
  isUpcoming,
  rankOffers,
  submitOffer,
  timeLeft,
  type NewOffer,
} from "@/lib/offers";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOPOFFER — the community-ranked deals board" },
      {
        name: "description",
        content:
          "Submit offers, deals and coupon codes. Votes decide the ranking, so the best discount holds #1.",
      },
      { property: "og:title", content: "TOPOFFER — the community-ranked deals board" },
      {
        property: "og:description",
        content: "Submit deals and coupon codes. Votes decide the ranking — the best offer holds #1.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { category?: string | undefined } => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  component: Home,
});

const emptyForm = {
  title: "",
  merchant: "",
  url: "",
  discount_label: "",
  coupon_code: "",
  description: "",
  category: "",
  expires_at: "",
};

function Home() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const visitorKey = useVisitorKey();
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading, error } = useOffers();
  const { data: myVotes = [] } = useMyVotes(visitorKey);
  const vote = useToggleVote(visitorKey);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const active = category && categories.some((c) => c.id === category) ? category : "all";
  const setActive = (id: string) => navigate({ search: { category: id }, resetScroll: false });

  const votedIds = useMemo(() => new Set(myVotes.map((v) => v.offer_id)), [myVotes]);

  const board = useMemo(() => {
    const live = offers.filter((o) => isLive(o));
    const scoped = active === "all" ? live : live.filter((o) => o.category === active);
    return rankOffers(scoped);
  }, [offers, active]);

  const upcoming = useMemo(
    () =>
      offers
        .filter((o) => isUpcoming(o))
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
        .slice(0, 3),
    [offers],
  );

  const totalVotes = offers.reduce((sum, o) => sum + o.vote_count, 0);
  const liveCount = offers.filter((o) => isLive(o)).length;

  const onVote = (id: string) => {
    if (!visitorKey) return;
    vote.mutate(id, {
      onSuccess: (result) =>
        toast.success(result === "added" ? "Vote counted" : "Vote removed"),
      onError: () => toast.error("Couldn't save your vote. Try again."),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) {
      toast.error("A deal needs a title and a link.");
      return;
    }
    if (!form.discount_label.trim()) {
      toast.error("Add the discount, e.g. “30% off”.");
      return;
    }
    if (!form.category) {
      toast.error("Pick a category for your deal.");
      return;
    }
    const url = form.url.trim().startsWith("http") ? form.url.trim() : `https://${form.url.trim()}`;
    const payload: NewOffer = {
      title: form.title.trim(),
      merchant: form.merchant.trim() || new URL(url).hostname.replace(/^www\./, ""),
      url,
      coupon_code: form.coupon_code.trim() ? form.coupon_code.trim().toUpperCase() : null,
      discount_label: form.discount_label.trim(),
      description: form.description.trim() || "Submitted by a member of the community.",
      category: form.category,
      starts_at: new Date().toISOString(),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    setSaving(true);
    try {
      await submitOffer(payload, visitorKey);
      await queryClient.invalidateQueries({ queryKey: ["offers"] });
      setForm(emptyForm);
      toast.success("Deal published", {
        description: "It's live on the board — votes decide how high it climbs.",
      });
    } catch {
      toast.error("Couldn't publish that deal. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader scope="board" />

      <main className="mx-auto w-full max-w-6xl px-5">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-live live-dot" />
            <span className="font-semibold text-foreground">{liveCount} live deals</span>
            <span aria-hidden="true">·</span>
            <span>{totalVotes.toLocaleString("en-US")} votes cast</span>
          </div>
        </div>

        <h1 className="mt-8 text-center text-4xl font-bold tracking-tight sm:text-5xl">
          The best offer wins <span className="text-primary">#1</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm text-muted-foreground">
          Post an offer, deal or coupon code. Every vote moves it up the board — no bidding, no
          paid placement.
        </p>

        <form className="mt-8 grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Deal title — e.g. “Acme Pro — 40% off annual”"
            className="h-13 rounded-full border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40 sm:col-span-2"
          />
          <div className="relative">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="Link to the offer"
              className="h-13 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <input
            value={form.discount_label}
            onChange={(e) => setForm({ ...form, discount_label: e.target.value })}
            placeholder="Discount — 30% off, BOGO, free trial…"
            className="h-13 rounded-full border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
          <input
            value={form.coupon_code}
            onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
            placeholder="Coupon code (optional)"
            className="h-13 rounded-full border border-border bg-card px-4 text-sm uppercase outline-none placeholder:normal-case placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
          <div className="relative">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="h-13 w-full appearance-none rounded-full border border-border bg-card pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring/40"
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
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="One line on what you get"
            className="h-13 rounded-full border border-border bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
          <label className="flex h-13 items-center gap-3 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground">
            Expires
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="flex-1 bg-transparent text-foreground outline-none"
            />
          </label>
          <button
            disabled={saving}
            className="h-13 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:col-span-2"
          >
            {saving ? "Publishing…" : "Post this deal"}
          </button>
        </form>

        <div className="mt-10 flex flex-wrap items-center gap-2">
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

        {error ? (
          <p className="mt-6 rounded-xl bg-surface p-6 text-center text-sm text-muted-foreground">
            Couldn't load the board. Refresh to try again.
          </p>
        ) : null}

        <section className="mt-6 space-y-2" aria-label="Podium">
          {isLoading
            ? [0, 1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-xl bg-surface" />
              ))
            : board.slice(0, 3).map((offer) => (
                <OfferRow
                  key={offer.id}
                  offer={offer}
                  voted={votedIds.has(offer.id)}
                  pending={vote.isPending}
                  onVote={onVote}
                  mine={!!visitorKey && offer.owner_key === visitorKey}
                />
              ))}
        </section>

        {upcoming.length > 0 ? (
          <section className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <CalendarClock className="h-4 w-4 text-primary" />
                Starting soon
              </h2>
              <Link to="/today" className="text-sm text-muted-foreground hover:text-foreground">
                My dashboard
              </Link>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {upcoming.map((o) => (
                <div
                  key={o.id}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
                >
                  <Tile initials={o.initials} tint={o.tint} size="sm" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{o.title}</h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{o.description}</p>
                    <p className="mt-1 text-sm font-bold text-primary">{o.discount_label}</p>
                    <p className="text-xs text-muted-foreground">
                      opens {new Date(o.starts_at).toLocaleDateString()} · {timeLeft(o.expires_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 space-y-2">
          {board.slice(3).map((offer) => (
            <OfferRow
              key={offer.id}
              offer={offer}
              voted={votedIds.has(offer.id)}
              pending={vote.isPending}
              onVote={onVote}
              mine={!!visitorKey && offer.owner_key === visitorKey}
            />
          ))}
          {!isLoading && board.length === 0 ? (
            <p className="rounded-xl bg-surface p-8 text-center text-sm text-muted-foreground">
              No live deals in this category yet — post one and it starts at #1.
            </p>
          ) : null}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
