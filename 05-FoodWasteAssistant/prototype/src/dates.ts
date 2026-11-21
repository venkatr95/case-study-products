import type { Attention, PantryItem } from "./types";

export function todayISO(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function diffDays(iso: string, today: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  const a = Date.UTC(year, month - 1, day);
  const b = Date.UTC(ty, tm - 1, td);
  return Math.round((a - b) / 86_400_000);
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const DATE_KIND_LABEL: Record<string, string> = {
  "best-before": "best-before",
  "use-by": "use-by",
};

/**
 * Classify a user-entered date. Opened-on is never treated as an expiry.
 * No shelf-life table is applied.
 */
export function classifyItem(item: PantryItem, today: string, leadDays: number): Attention {
  if (item.dateKind === "none" || !item.date) {
    return {
      kind: "no-date",
      label: "No date",
      detail: "No date entered. FreshLoop will not guess one.",
    };
  }

  if (item.dateKind === "opened-on") {
    return {
      kind: "opened",
      label: "Opened",
      detail: `You entered an opened-on date of ${formatDate(item.date)}. That is not an expiry date, and FreshLoop does not turn it into one.`,
    };
  }

  const kind = DATE_KIND_LABEL[item.dateKind] ?? "entered";
  const days = diffDays(item.date, today);
  if (days < 0) {
    return {
      kind: "date-passed",
      label: "Date passed",
      detail: `The ${kind} date you entered was ${formatDate(item.date)}. This is not a safety verdict. Check the food and local guidance.`,
    };
  }
  if (days <= leadDays) {
    return {
      kind: "use-soon",
      label: "Use soon",
      detail: `The ${kind} date you entered is ${formatDate(item.date)}. A date you type is a reminder, not a safety guarantee.`,
    };
  }
  return {
    kind: "later",
    label: item.dateKind === "use-by" ? "Use-by" : "Best-before",
    detail: `You entered ${formatDate(item.date)}. That is outside the ${leadDays}-day window you set.`,
  };
}

export function attentionRank(kind: Attention["kind"]): number {
  switch (kind) {
    case "date-passed":
      return 0;
    case "use-soon":
      return 1;
    case "opened":
      return 2;
    case "no-date":
      return 3;
    case "later":
      return 4;
    default:
      return 5;
  }
}
