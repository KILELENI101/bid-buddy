import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of use — TOPOFFER" },
      {
        name: "description",
        content:
          "The rules for posting offers, voting and using the TOPOFFER community deals board.",
      },
      { property: "og:title", content: "Terms of use — TOPOFFER" },
      {
        property: "og:description",
        content: "Rules for posting deals, voting and using the TOPOFFER board.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "Posting deals",
    body: "Anyone can post an offer without an account. Post only offers you believe are genuine and currently available, with a working link. Spam, misleading discounts, adult content, illegal goods and affiliate link stuffing are removed.",
  },
  {
    title: "Voting",
    body: "Each browser gets a limited number of votes per day. Manipulating the ranking with repeat votes, scripts or multiple browsers is not allowed and may cost you your posts.",
  },
  {
    title: "No paid placement",
    body: "Ranking is decided by community votes only. Nobody can buy a position on the podium.",
  },
  {
    title: "Third-party offers",
    body: "Deals link to merchants we do not control. Prices, coupon codes and availability can change at any time. Check the details on the merchant's own site before you buy.",
  },
  {
    title: "Liability",
    body: "The board is provided as-is, without warranty. We are not responsible for purchases made through posted links, expired coupon codes or losses arising from using the site.",
  },
  {
    title: "Changes",
    body: "These terms may be updated as the site grows. Continued use of the board means you accept the current version.",
  },
];

function Terms() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5">
        <h1 className="text-4xl font-bold tracking-tight">Terms of use</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Plain-language rules for everyone who posts and votes on TOPOFFER.
        </p>
        <div className="mt-8 space-y-3">
          {sections.map((s) => (
            <section key={s.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-bold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
