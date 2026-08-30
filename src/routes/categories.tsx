import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { categories, formatMoney, listings } from "@/lib/rankings";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — bidrank.lol" },
      {
        name: "description",
        content: "Browse every board on bidrank.lol: agents, SEO, marketing, crypto, dev tools and more.",
      },
      { property: "og:title", content: "Categories — bidrank.lol" },
      {
        property: "og:description",
        content: "Browse every board: agents, SEO, marketing, crypto, dev tools, security and health.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  const boards = categories.filter((c) => c.id !== "all");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-5">
        <h1 className="text-4xl font-bold tracking-tight">Every board</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Each category keeps its own ranking, so a $40 bid can still hold #1 somewhere.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((c) => {
            const inBoard = listings.filter((l) => l.category === c.id);
            const top = inBoard[0];
            const entry = top ? top.amount + 1 : 1;
            return (
              <Link
                key={c.id}
                to="/"
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <h2 className="text-base font-bold">{c.label}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {inBoard.length} claimed {inBoard.length === 1 ? "slot" : "slots"}
                </p>
                <p className="mt-4 text-sm font-semibold text-primary">
                  #1 costs {formatMoney(entry)}
                </p>
                {top ? (
                  <p className="mt-1 truncate text-xs text-muted-foreground">held by {top.domain}</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">unclaimed</p>
                )}
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
