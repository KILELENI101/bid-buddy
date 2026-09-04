import { Link } from "@tanstack/react-router";
import markAsset from "@/assets/topoffer-mark.png.asset.json";

export function Logo() {
  return (
    <Link
      to="/"
      search={{ category: "all" }}
      className="flex shrink-0 items-center gap-2"
      aria-label="TOPOFFER home"
    >
      <img
        src={markAsset.url}
        alt=""
        width={1024}
        height={1024}
        loading="lazy"
        className="h-8 w-8"
      />
      <span className="text-xl font-bold tracking-tight">
        TOP<span className="text-muted-foreground">OFFER</span>
      </span>
    </Link>
  );
}


export function Tile({
  initials,
  tint,
  size = "md",
}: {
  initials: string;
  tint: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-6 w-6 text-[10px] rounded-md" : "h-11 w-11 text-sm rounded-xl";
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-bold text-white/95 ${dim}`}
      style={{ backgroundColor: tint }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
