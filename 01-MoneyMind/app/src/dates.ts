/** Calendar dates as YYYY-MM-DD. Math uses UTC so daylight-saving cannot shift a day. */

export interface DateParts {
  y: number;
  m: number;
  d: number;
}

export function parseISODate(iso: string): DateParts | null {
  if (typeof iso !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    return null;
  }
  return { y: year, m: month, d: day };
}

export function formatISO(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function addDays(iso: string, days: number): string {
  const parts = parseISODate(iso);
  if (!parts || !Number.isInteger(days)) {
    throw new Error("Invalid date arithmetic.");
  }
  const utc = new Date(Date.UTC(parts.y, parts.m - 1, parts.d + days));
  return formatISO(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate());
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  if (!from || !to) throw new Error("Invalid date.");
  const ms = Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d);
  return Math.round(ms / 86400000);
}

export function compareISO(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function todayISO(now: Date = new Date()): string {
  return formatISO(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function formatLong(iso: string): string {
  const parts = parseISODate(iso);
  if (!parts) return iso;
  const utc = new Date(Date.UTC(parts.y, parts.m - 1, parts.d));
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(utc);
}

export function formatRange(startISO: string, endISO: string): string {
  if (startISO === endISO) return formatLong(startISO);
  return `${formatLong(startISO)} – ${formatLong(endISO)}`;
}
