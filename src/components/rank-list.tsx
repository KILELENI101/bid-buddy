import { ArrowUpRight } from "lucide-react";
import { Tile } from "./brand";
import { categories, formatMoney, type Listing } from "@/lib/rankings";

const label = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export function RankRow({ item }: { item: Listing }) {
  const podium = item.rank <= 3;
  return (
    <article
      className={`rank-row group flex items-start gap-4 px-4 py-4 ${
        podium ? "rank-row-podium" : "hover:bg-surface"
      }`}
    >
      <span
        className={`mt-0.5 w-11 shrink-0 text-center text-sm font-bold ${
          podium
            ? "rounded-lg bg-primary py-1 text-primary-foreground"
            : "py-1 text-muted-foreground"
        }`}
      >
        #{item.rank}
      </span>
      <Tile initials={item.initials} tint={item.tint} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold leading-snug">{item.name}</h3>
          <span className="ml-auto text-base font-bold text-primary">{formatMoney(item.amount)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.tagline}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="font-medium text-accent-foreground">{label(item.category)}</span>
          <span aria-hidden="true">·</span>
          <span>{item.posted}</span>
          <span aria-hidden="true">·</span>
          <span>{item.domain}</span>
          <span aria-hidden="true">·</span>
          <span>{item.clicks.toLocaleString("en-US")} clicks</span>
          <span aria-hidden="true">·</span>
          <a
            href={`https://${item.domain}`}
            rel="nofollow noopener"
            className="inline-flex items-center gap-0.5 font-medium text-foreground underline-offset-4 hover:underline"
          >
            visit <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        {podium ? (
          <button className="mt-3 text-xs font-semibold text-primary underline-offset-4 hover:underline">
            claim this rank for {formatMoney(item.amount + item.rank + 1)}
          </button>
        ) : null}
      </div>
    </article>
  );
}
