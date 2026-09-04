/** Time windows offered on the board, shared by the header chips and the board itself. */
export const RANGES = [
  { id: "all", label: "All-time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
] as const;

export type RangeId = (typeof RANGES)[number]["id"];

const DAY = 86_400_000;

/** True when a posting date falls inside the chosen window. */
export function inRange(postedAt: string, range: RangeId) {
  if (range === "all") return true;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const posted = new Date(postedAt).getTime();
  const todayStart = start.getTime();
  if (range === "today") return posted >= todayStart;
  if (range === "yesterday") return posted >= todayStart - DAY && posted < todayStart;
  if (range === "week") return posted >= todayStart - 6 * DAY;
  return posted >= todayStart - 29 * DAY;
}

export function isRangeId(value: unknown): value is RangeId {
  return typeof value === "string" && RANGES.some((r) => r.id === value);
}
