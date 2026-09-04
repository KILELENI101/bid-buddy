import { Link, useSearch } from "@tanstack/react-router";
import {
  Bike,
  Bitcoin,
  Briefcase,
  Car,
  Code,
  Dog,
  Dumbbell,
  Gamepad2,
  Globe2,
  GraduationCap,
  Grid2X2,
  Heart,
  Home,
  Laptop,
  Megaphone,
  Palette,
  PartyPopper,
  PiggyBank,
  Plane,
  Search,
  Server,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  Ticket,
  Trophy,
  UtensilsCrossed,
  Baby,
  type LucideIcon,
} from "lucide-react";
import { categories } from "@/lib/offers";

const ICONS: Record<string, LucideIcon> = {
  all: Grid2X2,
  software: Laptop,
  "ai-tools": Sparkles,
  saas: Code,
  hosting: Server,
  marketing: Megaphone,
  seo: Search,
  design: Palette,
  courses: GraduationCap,
  finance: PiggyBank,
  crypto: Bitcoin,
  retail: ShoppingBag,
  fashion: Shirt,
  electronics: Smartphone,
  home: Home,
  food: UtensilsCrossed,
  travel: Plane,
  health: Dumbbell,
  beauty: Heart,
  pets: Dog,
  kids: Baby,
  sports: Bike,
  auto: Car,
  gaming: Gamepad2,
  entertainment: Trophy,
  mobile: Smartphone,
  business: Briefcase,
  freelance: Briefcase,
  events: Ticket,
  other: PartyPopper,
};

/** Scrollable pill rail of every deal board, with the active one highlighted. */
export function CategoryBar() {
  const search = useSearch({ strict: false }) as { category?: string };
  const active = search.category ?? "all";

  return (
    <div className="min-w-0 flex-1">
      <div className="relative flex items-center gap-1 overflow-hidden rounded-full border border-border bg-card px-2 py-1.5 shadow-card">
        <div className="flex flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => {
            const Icon = ICONS[c.id] ?? Tag;
            const isActive = active === c.id;
            return (
              <Link
                key={c.id}
                to="/"
                search={{ category: c.id }}
                resetScroll={false}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-pop"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </Link>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-[4.5rem] w-8 bg-gradient-to-l from-card to-transparent" />
        <Link
          to="/categories"
          className="sticky right-0 z-10 flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3 py-1.5 pl-4 text-sm font-semibold text-primary hover:text-primary/80"
        >
          <Globe2 className="h-3.5 w-3.5" />
          Explore
        </Link>
      </div>
    </div>
  );
}
