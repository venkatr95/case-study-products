export const RECURRENCES = ["once", "weekly", "biweekly", "monthly"] as const;
export type Recurrence = (typeof RECURRENCES)[number];

export const CATEGORIES = [
  "Housing",
  "Bills",
  "Food",
  "Transport",
  "Health",
  "Subscriptions",
  "Personal",
  "Income",
  "Other",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type ItemType = "income" | "expense";
export type CurrencyCode = "USD" | "CAD" | "GBP" | "EUR" | "AUD";

export interface PlanItem {
  id: string;
  name: string;
  type: ItemType;
  amountCents: number;
  date: string;
  recurrence: Recurrence;
  category: Category;
  notes: string;
  scenario?: boolean;
}

export interface Reminder {
  enabled: boolean;
  thresholdCents: number | null;
}

export interface ForecastSnapshot {
  generatedAt: string;
  asOfDate: string;
  endDate: string;
  lowestDate: string;
  lowestCents: number;
  safeToSpendCents: number;
  setAsideCents: number;
  label: string;
}

export interface PlanProfile {
  currency: CurrencyCode;
  startingBalanceCents: number;
  asOfDate: string;
  setAsideCents: number;
  onboardingComplete: boolean;
  demo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanState {
  version: 1;
  profile: PlanProfile;
  items: PlanItem[];
  reminder: Reminder;
  forecastSnapshot: ForecastSnapshot | null;
}

export function isRecurrence(value: string): value is Recurrence {
  return (RECURRENCES as readonly string[]).includes(value);
}

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function isItemType(value: string): value is ItemType {
  return value === "income" || value === "expense";
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value === "USD" || value === "CAD" || value === "GBP" || value === "EUR" || value === "AUD";
}
