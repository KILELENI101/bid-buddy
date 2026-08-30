export type Category = {
  id: string;
  label: string;
  icon: string;
};

export const categories: Category[] = [
  { id: "all", label: "All", icon: "grid" },
  { id: "agents", label: "Agents", icon: "bot" },
  { id: "seo", label: "SEO", icon: "search" },
  { id: "marketing", label: "Marketing", icon: "megaphone" },
  { id: "crypto", label: "Crypto", icon: "bitcoin" },
  { id: "developer", label: "Developer", icon: "code" },
  { id: "business", label: "Business", icon: "scale" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "health", label: "Health", icon: "heart" },
];

export type Listing = {
  rank: number;
  name: string;
  domain: string;
  tagline: string;
  amount: number;
  category: string;
  posted: string;
  clicks: number;
  tint: string;
  initials: string;
};

export const listings: Listing[] = [
  {
    rank: 1,
    name: "Loomframe · ship a site by describing it",
    domain: "loomframe.dev",
    tagline:
      "Type what you want and watch a live, hosted site assemble itself. Connect a domain the moment you're ready.",
    amount: 18400,
    category: "agents",
    posted: "4 days ago",
    clicks: 38214,
    tint: "oklch(0.62 0.17 275)",
    initials: "LF",
  },
  {
    rank: 2,
    name: "Palette — creator campaigns that pay on results",
    domain: "palette.market",
    tagline:
      "Brands post briefs, creators pick the ones they like, payouts track real engagement. No follower minimum.",
    amount: 15250,
    category: "marketing",
    posted: "5 days ago",
    clicks: 11902,
    tint: "oklch(0.6 0.14 175)",
    initials: "PL",
  },
  {
    rank: 3,
    name: "Northbeam AI — one desk, many agents",
    domain: "northbeam.ai",
    tagline:
      "Describe the outcome once. A crew of agents divides the work and picks the right model per step.",
    amount: 13980,
    category: "agents",
    posted: "6 days ago",
    clicks: 20455,
    tint: "oklch(0.35 0.03 260)",
    initials: "NB",
  },
  {
    rank: 4,
    name: "Rankwell — organic growth on a schedule",
    domain: "rankwell.so",
    tagline: "Publishes optimized pages and earns links while your team sleeps.",
    amount: 12310,
    category: "seo",
    posted: "last week",
    clicks: 17640,
    tint: "oklch(0.58 0.2 300)",
    initials: "RW",
  },
  {
    rank: 5,
    name: "Coinperch — back builders early",
    domain: "coinperch.xyz",
    tagline:
      "Find pre-launch products, follow the makers, and take a position in the ones you believe in.",
    amount: 11760,
    category: "crypto",
    posted: "last week",
    clicks: 14980,
    tint: "oklch(0.72 0.17 60)",
    initials: "CP",
  },
  {
    rank: 6,
    name: "CiteLoop — get quoted by AI answers",
    domain: "citeloop.io",
    tagline:
      "We pitch the pages assistants already cite. You approve placements and only pay on publish.",
    amount: 10420,
    category: "seo",
    posted: "last week",
    clicks: 8140,
    tint: "oklch(0.55 0.16 240)",
    initials: "CL",
  },
  {
    rank: 7,
    name: "Guardrail — compliance without the spreadsheet",
    domain: "guardrail.works",
    tagline: "SOC 2, ISO 27001, HIPAA and GDPR evidence collected automatically across 500+ tools.",
    amount: 9300,
    category: "security",
    posted: "last week",
    clicks: 13520,
    tint: "oklch(0.5 0.12 200)",
    initials: "GR",
  },
  {
    rank: 8,
    name: "Zeropoint — measure your AI search share",
    domain: "zeropoint.ai",
    tagline: "See where assistants mention you, where they don't, and what moves the needle.",
    amount: 4160,
    category: "seo",
    posted: "yesterday",
    clicks: 970,
    tint: "oklch(0.28 0.02 260)",
    initials: "ZP",
  },
  {
    rank: 9,
    name: "Flowtill — payment routing that stops leaks",
    domain: "flowtill.com",
    tagline:
      "One SDK that lifts authorization rates, retries smartly, and recovers revenue you already earned.",
    amount: 3705,
    category: "business",
    posted: "2 days ago",
    clicks: 1310,
    tint: "oklch(0.62 0.15 145)",
    initials: "FT",
  },
  {
    rank: 10,
    name: "Pulsechart — labs, trends, plain answers",
    domain: "pulsechart.health",
    tagline: "Upload bloodwork and get a readable timeline instead of a PDF you can't parse.",
    amount: 2480,
    category: "health",
    posted: "3 days ago",
    clicks: 2260,
    tint: "oklch(0.65 0.16 20)",
    initials: "PC",
  },
  {
    rank: 11,
    name: "Forkbench — review queues for small teams",
    domain: "forkbench.dev",
    tagline: "Stacked pull requests, one keyboard-first inbox, no ceremony.",
    amount: 1890,
    category: "developer",
    posted: "3 days ago",
    clicks: 3120,
    tint: "oklch(0.45 0.06 265)",
    initials: "FB",
  },
  {
    rank: 12,
    name: "Halftone — a portfolio you update by talking",
    domain: "halftone.studio",
    tagline: "Voice-note your latest project and the case study writes itself.",
    amount: 1220,
    category: "marketing",
    posted: "4 days ago",
    clicks: 1780,
    tint: "oklch(0.7 0.16 330)",
    initials: "HT",
  },
];

export const todaysTop: Pick<Listing, "rank" | "name" | "tagline" | "amount" | "tint" | "initials">[] =
  [
    {
      rank: 1,
      name: "Settlers Club — free online board gaming",
      tagline: "Play the classic trading-and-building game in the browser. No download, no signup.",
      amount: 448,
      tint: "oklch(0.62 0.16 235)",
      initials: "SC",
    },
    {
      rank: 2,
      name: "Veilnote — a browser that forgets on purpose",
      tagline: "See exactly what each page is learning about you, then cut it off.",
      amount: 182,
      tint: "oklch(0.55 0.13 300)",
      initials: "VN",
    },
    {
      rank: 3,
      name: "oneword.lol — own a single word",
      tagline: "Every word has exactly one holder. Outbid them or pick another.",
      amount: 165,
      tint: "oklch(0.3 0.02 60)",
      initials: "1W",
    },
  ];

export type Activity = {
  name: string;
  rank: number;
  amount: number;
  when: string;
  tint: string;
  initials: string;
};

export const activity: Activity[] = [
  { name: "worldatlas.lol — claim a country", rank: 362, amount: 35, when: "37 minutes ago", tint: "oklch(0.6 0.14 210)", initials: "WA" },
  { name: "Offhand — your second inbox", rank: 1873, amount: 5, when: "49 minutes ago", tint: "oklch(0.5 0.08 265)", initials: "OF" },
  { name: "Pensora — retirement math, simplified", rank: 475, amount: 25, when: "1 hour ago", tint: "oklch(0.58 0.12 160)", initials: "PS" },
  { name: "Vital Coeur — heart metrics at home", rank: 337, amount: 40, when: "1 hour ago", tint: "oklch(0.62 0.19 15)", initials: "VC" },
  { name: "siterank.world — country leaderboards", rank: 1063, amount: 6, when: "2 hours ago", tint: "oklch(0.55 0.1 250)", initials: "SR" },
  { name: "Codenest — snippets that stay organized", rank: 918, amount: 12, when: "3 hours ago", tint: "oklch(0.45 0.07 280)", initials: "CN" },
];

export const formatMoney = (n: number) => "$" + n.toLocaleString("en-US");
