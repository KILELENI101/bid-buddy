import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How bidrank works — bidrank.lol" },
      {
        name: "description",
        content:
          "One rule: the highest standing bid holds the slot. Here's how claiming, outbidding and refunds work.",
      },
      { property: "og:title", content: "How bidrank works — bidrank.lol" },
      {
        property: "og:description",
        content: "One rule: the highest standing bid holds the slot. Claim it, hold it, or get outbid.",
      },
    ],
  }),
  component: About,
});

const steps = [
  {
    title: "Drop a link",
    body: "Paste your product URL, pick a category, and set what the slot is worth to you.",
  },
  {
    title: "Hold the slot",
    body: "Your bid stands until someone beats it. While it stands, you sit above everyone below you.",
  },
  {
    title: "Get outbid",
    body: "When a higher bid lands you slide down one rank. Raise it again any time from your listing page.",
  },
];

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5">
        <h1 className="text-4xl font-bold tracking-tight">One rule</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The highest standing bid holds the top slot. No algorithm, no votes to farm, no launch day
          to time. Rank is rented, and everyone can see the price.
        </p>

        <div className="mt-10 space-y-3">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="font-bold">{s.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-podium p-6 text-center">
          <p className="text-sm text-accent-foreground">
            Boards refresh live. The daily board resets every midnight UTC.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:-translate-y-0.5"
          >
            Claim a rank
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
