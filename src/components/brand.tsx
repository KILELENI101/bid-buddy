import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" search={{ category: "all" }} className="flex items-center gap-2.5">
      <span className="flex flex-col gap-[3px]">
        <span className="block h-[3px] w-6 rounded-full bg-primary" />
        <span className="block h-[3px] w-4 rounded-full bg-foreground/70" />
        <span className="block h-[3px] w-5 rounded-full bg-foreground/40" />
      </span>
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
