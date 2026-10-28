import type { Evidence, Preferences } from "./types.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Format an ISO timestamp in America/Los_Angeles, independent of the host zone. */
export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const monthIndex = Number(pick("month")) - 1;
  const month = MONTHS[monthIndex] ?? pick("month");
  const dayPeriod = pick("dayPeriod").toLowerCase().replace(".", "");
  const period = dayPeriod.startsWith("a") ? "a.m." : "p.m.";
  return `${pick("day")} ${month} ${pick("year")}, ${pick("hour")}:${pick("minute")} ${period}`;
}

export function formatDistance(meters: number): string {
  const miles = meters / 1609.344;
  const rounded = miles >= 10 ? miles.toFixed(0) : miles.toFixed(1);
  return `About ${rounded} mi`;
}

export function formatMinutes(minutes: number): string {
  return `About ${minutes} min`;
}

export function evidenceWord(evidence: Evidence): string {
  if (evidence === "confirmed") return "Confirmed";
  if (evidence === "community") return "Community-reported";
  return "Unknown";
}

export function preferenceSummary(prefs: Preferences): string {
  const parts: string[] = [];
  if (prefs.avoidStairs) parts.push("Avoid stairs");
  if (prefs.requireCurbRamps) parts.push("Prefer curb ramps");
  if (prefs.maxGradePercent === null) parts.push("No steepness limit");
  else parts.push(`Grades under ${prefs.maxGradePercent}%`);
  if (parts.length === 0) return "No access preferences selected";
  return parts.join(" · ");
}

export function presetName(preset: Preferences["preset"]): string {
  if (preset === "step-free") return "Step-free";
  if (preset === "gentle") return "Gentle grades";
  if (preset === "stroller") return "Stroller or luggage";
  return "Custom";
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
