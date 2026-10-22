import { addDays } from "./dates.ts";
import type { Category, ItemType, PlanItem, PlanState, Recurrence } from "./model.ts";

/**
 * Illustrative sample plan, dated relative to "today" so a demo does not open already stale.
 * These are not a real person's finances. The story is: rent lands before the next payday,
 * so the lowest estimate is before that income.
 */
export function buildSample(today: string): PlanState {
  const now = new Date().toISOString();
  return {
    version: 1,
    profile: {
      currency: "USD",
      startingBalanceCents: 184000,
      asOfDate: today,
      setAsideCents: 10000,
      onboardingComplete: true,
      demo: true,
      createdAt: now,
      updatedAt: now,
    },
    items: [
      item("sample-transit", "Transit pass", "expense", 4000, addDays(today, 1), "weekly", "Transport"),
      item("sample-groceries", "Groceries", "expense", 12000, addDays(today, 2), "once", "Food"),
      item("sample-rent", "Rent", "expense", 145000, addDays(today, 4), "monthly", "Housing"),
      item("sample-payday", "Payday", "income", 168000, addDays(today, 10), "biweekly", "Income"),
      item("sample-phone", "Phone bill", "expense", 6500, addDays(today, 12), "monthly", "Bills"),
    ],
    reminder: { enabled: true, thresholdCents: 25000 },
    forecastSnapshot: null,
  };
}

function item(
  id: string,
  name: string,
  type: ItemType,
  amountCents: number,
  date: string,
  recurrence: Recurrence,
  category: Category,
): PlanItem {
  return { id, name, type, amountCents, date, recurrence, category, notes: "" };
}
