import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — TOPOFFER" },
      {
        name: "description",
        content:
          "How TOPOFFER handles data: no accounts, no tracking profiles, just an anonymous key in your own browser.",
      },
      { property: "og:title", content: "Privacy policy — TOPOFFER" },
      {
        property: "og:description",
        content: "No accounts, no tracking profiles — only an anonymous key stored in your browser.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "No accounts, no personal details",
    body: "You do not sign up and we never ask for your name, email or payment details. Your browser stores a random anonymous key, and that key is what owns your posts, votes and rank goals.",
  },
  {
    title: "What we store",
    body: "The deals you post (title, link, discount, coupon code, description, category, dates), your votes, your optional rank goals, and short-lived records used to stop spam and abuse.",
  },
  {
    title: "Anti-abuse records",
    body: "To keep the board usable we log the action type and your anonymous key when you post, vote or set a goal. These records are deleted after seven days.",
  },
  {
    title: "Browser storage",
    body: "Your anonymous key and your light/dark preference live in your browser's local storage. Clearing your browser data resets them, which also means you lose access to your dashboard history.",
  },
  {
    title: "Third parties",
    body: "Clicking a deal takes you to the merchant's own website, where their privacy policy applies. Our hosting and database providers process the data above on our behalf.",
  },
  {
    title: "Removing a deal",
    body: "Ask us to take down a deal you posted from the same browser that created it and we will remove it.",
  },
];

function Privacy() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5">
        <h1 className="text-4xl font-bold tracking-tight">Privacy policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          TOPOFFER runs without accounts. Here is exactly what is stored.
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
