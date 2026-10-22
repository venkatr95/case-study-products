/**
 * MoneyMind forecast engine.
 *
 * Rules, all deterministic:
 * - The window is 30 calendar days including the balance date.
 * - Starting balance is cash at the start of that date, before that day's items.
 * - On a single day, expenses are applied before income.
 * - The low point is the lowest intra-day balance in the window. Ties use the earliest date.
 * - Safe to spend = low point − set-aside. It can be negative; the UI also shows a floor of zero.
 * - Occurrences before the balance date are not applied.
 * - Monthly repeats use the anchor calendar day, clamped to the last day of shorter months.
 *   The next month returns to the anchor day. Day 31 therefore lands on the last day of shorter months.
 *   Day 28 does not mean "end of every month."
 * - A scenario item is not written into the caller's item list.
 */

import { addDays, compareISO, daysBetween, daysInMonth, formatISO, parseISODate } from "./dates.ts";
import {
  CATEGORIES,
  RECURRENCES,
  isRecurrence,
  type Category,
  type ItemType,
  type PlanItem,
  type Recurrence,
} from "./model.ts";

export { CATEGORIES, RECURRENCES };
export type { Category, PlanItem, Recurrence };

export const HORIZON_DAYS = 30;
export const STALE_AFTER_DAYS = 7;

export interface ForecastInput {
  asOfDate: string;
  startingBalanceCents: number;
  setAsideCents: number;
  items?: PlanItem[];
  horizonDays?: number;
  scenarioItem?: PlanItem;
}

export interface LedgerEvent {
  itemId: string;
  name: string;
  type: ItemType;
  amountCents: number;
  category: Category | string;
  date: string;
  scenario: boolean;
  recurrence: Recurrence;
  countedInLow?: boolean;
}

export interface ForecastDay {
  date: string;
  startCents: number;
  incomeCents: number;
  expenseCents: number;
  intraDayLowCents: number;
  endCents: number;
  dayLowCents: number;
  timing: "before-income" | "end-of-day";
  events: LedgerEvent[];
}

export interface LowPoint {
  date: string;
  balanceCents: number;
  timing: "before-income" | "end-of-day";
  startOfDayCents: number;
  expenseCents: number;
  incomeCents: number;
}

export interface Forecast {
  asOfDate: string;
  endDate: string;
  horizonDays: number;
  startingBalanceCents: number;
  setAsideCents: number;
  days: ForecastDay[];
  lowest: LowPoint;
  counted: LedgerEvent[];
  laterEvents: LedgerEvent[];
  safeToSpendCents: number;
  spendableCents: number;
  shortfallCents: number;
  assumptions: string[];
  hasScenario: boolean;
}

export interface CategoryTotal {
  type: ItemType;
  category: Category | string;
  amountCents: number;
  count: number;
}

export interface WindowSummary {
  incomeCents: number;
  expenseCents: number;
  netCents: number;
  rows: CategoryTotal[];
}

export interface ScenarioComparison {
  baseline: Forecast;
  scenario: Forecast;
  safeDeltaCents: number;
  lowDeltaCents: number;
}

interface OccurrenceItem {
  date: string;
  recurrence: Recurrence | string;
}

export function occurrencesForItem(item: OccurrenceItem, rangeStart: string, rangeEnd: string): string[] {
  if (!parseISODate(item.date) || !parseISODate(rangeStart) || !parseISODate(rangeEnd)) {
    throw new Error("Invalid occurrence date.");
  }
  if (!isRecurrence(item.recurrence)) throw new Error("Invalid recurrence.");
  if (compareISO(rangeEnd, rangeStart) < 0) return [];
  if (item.recurrence === "once") {
    return compareISO(item.date, rangeStart) >= 0 && compareISO(item.date, rangeEnd) <= 0 ? [item.date] : [];
  }
  if (item.recurrence === "weekly" || item.recurrence === "biweekly") {
    const step = item.recurrence === "weekly" ? 7 : 14;
    let cursor = item.date;
    if (compareISO(cursor, rangeStart) < 0) {
      const jumped = Math.floor(daysBetween(item.date, rangeStart) / step);
      cursor = addDays(item.date, jumped * step);
      if (compareISO(cursor, rangeStart) < 0) cursor = addDays(cursor, step);
    }
    const dates: string[] = [];
    for (let guard = 0; guard < 400; guard += 1) {
      if (compareISO(cursor, rangeEnd) > 0) break;
      if (compareISO(cursor, item.date) >= 0) dates.push(cursor);
      cursor = addDays(cursor, step);
    }
    if (compareISO(cursor, rangeEnd) <= 0) {
      throw new Error("Recurrence range is too long.");
    }
    return dates;
  }
  const anchor = parseISODate(item.date);
  if (!anchor) throw new Error("Invalid occurrence date.");
  let year = anchor.y;
  let month = anchor.m;
  const dates: string[] = [];
  for (let guard = 0; guard < 480; guard += 1) {
    const iso = formatISO(year, month, Math.min(anchor.d, daysInMonth(year, month)));
    if (compareISO(iso, rangeEnd) > 0) return dates;
    if (compareISO(iso, item.date) >= 0 && compareISO(iso, rangeStart) >= 0) dates.push(iso);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  throw new Error("Recurrence range is too long.");
}

function assertItem(item: PlanItem): void {
  if (!item || typeof item.id !== "string" || !item.id) throw new Error("Invalid item id.");
  if (typeof item.name !== "string" || !item.name.trim()) throw new Error("Invalid item name.");
  if (item.type !== "income" && item.type !== "expense") throw new Error("Invalid item type.");
  if (!Number.isInteger(item.amountCents) || item.amountCents <= 0) {
    throw new Error("Invalid item amount.");
  }
  if (!parseISODate(item.date)) throw new Error("Invalid item date.");
  if (!isRecurrence(item.recurrence)) throw new Error("Invalid recurrence.");
}

export function buildForecast(input: ForecastInput): Forecast {
  const horizon = input.horizonDays ?? HORIZON_DAYS;
  if (!Number.isInteger(horizon) || horizon < 1 || horizon > 366) {
    throw new Error("Invalid horizon.");
  }
  if (!parseISODate(input.asOfDate)) throw new Error("Invalid balance date.");
  if (!Number.isInteger(input.startingBalanceCents)) {
    throw new Error("Starting balance must be integer cents.");
  }
  if (!Number.isInteger(input.setAsideCents) || input.setAsideCents < 0) {
    throw new Error("Set-aside must be zero or a positive integer cents value.");
  }

  const items: PlanItem[] = [...(input.items ?? [])];
  if (input.scenarioItem) {
    items.push({
      ...input.scenarioItem,
      id: input.scenarioItem.id || "scenario",
      scenario: true,
    });
  }
  for (const item of items) assertItem(item);

  const endDate = addDays(input.asOfDate, horizon - 1);
  const byDate = new Map<string, LedgerEvent[]>();
  for (const item of items) {
    for (const date of occurrencesForItem(item, input.asOfDate, endDate)) {
      const bucket = byDate.get(date) ?? [];
      bucket.push({
        itemId: item.id,
        name: item.name,
        type: item.type,
        amountCents: item.amountCents,
        category: item.category || "Other",
        date,
        scenario: Boolean(item.scenario),
        recurrence: item.recurrence,
      });
      byDate.set(date, bucket);
    }
  }
  for (const events of byDate.values()) {
    events.sort((a, b) => {
      if (a.type !== b.type) return a.type === "expense" ? -1 : 1;
      if (a.name !== b.name) return a.name < b.name ? -1 : 1;
      return a.itemId < b.itemId ? -1 : 1;
    });
  }

  const days: ForecastDay[] = [];
  let startCents = input.startingBalanceCents;
  for (let index = 0; index < horizon; index += 1) {
    const date = addDays(input.asOfDate, index);
    const events = byDate.get(date) ?? [];
    let expenseCents = 0;
    let incomeCents = 0;
    for (const event of events) {
      if (event.type === "expense") expenseCents += event.amountCents;
      else incomeCents += event.amountCents;
    }
    const intraDayLowCents = startCents - expenseCents;
    const endCents = intraDayLowCents + incomeCents;
    const timing = incomeCents > 0 && intraDayLowCents < endCents ? "before-income" : "end-of-day";
    days.push({
      date,
      startCents,
      incomeCents,
      expenseCents,
      intraDayLowCents,
      endCents,
      dayLowCents: Math.min(intraDayLowCents, endCents),
      timing,
      events,
    });
    startCents = endCents;
  }

  let lowest: LowPoint | null = null;
  for (const day of days) {
    if (!lowest || day.dayLowCents < lowest.balanceCents) {
      lowest = {
        date: day.date,
        balanceCents: day.dayLowCents,
        timing: day.timing,
        startOfDayCents: day.startCents,
        expenseCents: day.expenseCents,
        incomeCents: day.incomeCents,
      };
    }
  }
  if (!lowest) throw new Error("Forecast window is empty.");

  const counted: LedgerEvent[] = [];
  const laterEvents: LedgerEvent[] = [];
  for (const day of days) {
    for (const event of day.events) {
      if (day.date > lowest.date) {
        laterEvents.push(event);
        continue;
      }
      const countedInLow = !(day.date === lowest.date && event.type === "income" && lowest.timing === "before-income");
      counted.push({ ...event, countedInLow });
    }
  }

  const safeToSpendCents = lowest.balanceCents - input.setAsideCents;
  return {
    asOfDate: input.asOfDate,
    endDate,
    horizonDays: horizon,
    startingBalanceCents: input.startingBalanceCents,
    setAsideCents: input.setAsideCents,
    days,
    lowest,
    counted,
    laterEvents,
    safeToSpendCents,
    spendableCents: Math.max(0, safeToSpendCents),
    shortfallCents: Math.max(0, -safeToSpendCents),
    assumptions: assumptionCopy(horizon, input.asOfDate),
    hasScenario: items.some((item) => item.scenario),
  };
}

function assumptionCopy(horizon: number, asOfDate: string): string[] {
  return [
    `The window is ${horizon} calendar days, including ${asOfDate}.`,
    "Bills on the same day as income are counted before that income.",
    "Items dated before the balance date are not applied. They are treated as already included in the starting balance.",
    "The set-aside is an amount you chose. MoneyMind does not recommend a cushion.",
    "Only items you entered are included. Spending you have not added is missing from the estimate.",
    "This is an estimate, not a guarantee, a current bank balance, or financial advice.",
  ];
}

export function lowPointIdentityHolds(forecast: Forecast): boolean {
  let income = 0;
  let expense = 0;
  for (const event of forecast.counted) {
    if (!event.countedInLow) continue;
    if (event.type === "income") income += event.amountCents;
    else expense += event.amountCents;
  }
  return forecast.startingBalanceCents + income - expense === forecast.lowest.balanceCents;
}

export function daysBelowThreshold(forecast: Forecast, thresholdCents: number): string[] {
  if (!Number.isInteger(thresholdCents)) return [];
  return forecast.days.filter((day) => day.dayLowCents < thresholdCents).map((day) => day.date);
}

export function staleness(asOfDate: string, today: string, staleAfterDays: number = STALE_AFTER_DAYS): {
  ageDays: number;
  stale: boolean;
  future: boolean;
} {
  const ageDays = daysBetween(asOfDate, today);
  return {
    ageDays,
    stale: ageDays > staleAfterDays,
    future: ageDays < 0,
  };
}

export function coverageNotes(forecast: Forecast): string[] {
  const notes: string[] = [];
  if (!forecast.days.some((day) => day.incomeCents > 0)) {
    notes.push("No income is entered in this 30-day window.");
  }
  if (!forecast.days.some((day) => day.expenseCents > 0)) {
    notes.push("No bills or expenses are entered in this 30-day window.");
  }
  return notes;
}

export function summarizeWindow(forecast: Forecast): WindowSummary {
  const byCategory = new Map<string, CategoryTotal>();
  let incomeCents = 0;
  let expenseCents = 0;
  for (const day of forecast.days) {
    for (const event of day.events) {
      const key = `${event.type}:${event.category}`;
      const existing = byCategory.get(key);
      const row = existing ?? {
        type: event.type,
        category: event.category,
        amountCents: 0,
        count: 0,
      };
      row.amountCents += event.amountCents;
      row.count += 1;
      byCategory.set(key, row);
      if (event.type === "income") incomeCents += event.amountCents;
      else expenseCents += event.amountCents;
    }
  }
  return {
    incomeCents,
    expenseCents,
    netCents: incomeCents - expenseCents,
    rows: [...byCategory.values()].sort(
      (a, b) => b.amountCents - a.amountCents || String(a.category).localeCompare(String(b.category)),
    ),
  };
}

export function compareScenario(input: ForecastInput, scenarioItem: PlanItem): ScenarioComparison {
  const baseline = buildForecast({ ...input, scenarioItem: undefined });
  const scenario = buildForecast({ ...input, scenarioItem });
  return {
    baseline,
    scenario,
    safeDeltaCents: scenario.safeToSpendCents - baseline.safeToSpendCents,
    lowDeltaCents: scenario.lowest.balanceCents - baseline.lowest.balanceCents,
  };
}

export function monthlyClampNote(iso: string): string {
  const parts = parseISODate(iso);
  if (!parts || parts.d < 29) return "";
  return `In shorter months, a day-${parts.d} repeat lands on the last day of that month, then returns to day ${parts.d}.`;
}
