import assert from "node:assert/strict";
import test from "node:test";
import { addDays } from "../src/dates.ts";
import {
  buildForecast,
  type ForecastInput,
  compareScenario,
  coverageNotes,
  daysBelowThreshold,
  lowPointIdentityHolds,
  occurrencesForItem,
  staleness,
  summarizeWindow,
} from "../src/forecast.ts";
import { centsToInput, parseAmountToCents, type AmountOptions } from "../src/money.ts";
import { buildSample } from "../src/sample.ts";
import { createStore, type KeyValueStorage } from "../src/store.ts";

function centsOf(raw: string, options?: AmountOptions): number {
  const parsed = parseAmountToCents(raw, options);
  if (!parsed.ok) throw new Error(parsed.message);
  return parsed.cents;
}

const rentScenario: ForecastInput = {
  asOfDate: "2026-10-22",
  startingBalanceCents: 184000,
  setAsideCents: 10000,
  items: [
    { id: "transit", name: "Transit pass", type: "expense", amountCents: 4000, date: "2026-10-23", recurrence: "weekly", category: "Transport", notes: "" },
    { id: "groceries", name: "Groceries", type: "expense", amountCents: 12000, date: "2026-10-24", recurrence: "once", category: "Food", notes: "" },
    { id: "rent", name: "Rent", type: "expense", amountCents: 145000, date: "2026-10-26", recurrence: "monthly", category: "Housing", notes: "" },
    { id: "payday", name: "Payday", type: "income", amountCents: 168000, date: "2026-11-01", recurrence: "biweekly", category: "Income", notes: "" },
    { id: "phone", name: "Phone bill", type: "expense", amountCents: 6500, date: "2026-11-03", recurrence: "monthly", category: "Bills", notes: "" },
  ],
};

test("30-day rent-before-payday example matches the hand-checked ledger", () => {
  const forecast = buildForecast(rentScenario);
  assert.equal(forecast.days.length, 30);
  assert.equal(forecast.endDate, "2026-11-20");
  assert.equal(forecast.lowest.date, "2026-10-30");
  assert.equal(forecast.lowest.balanceCents, 19000);
  assert.equal(forecast.safeToSpendCents, 9000);
  assert.equal(forecast.spendableCents, 9000);
  assert.equal(forecast.shortfallCents, 0);
  assert.equal(lowPointIdentityHolds(forecast), true);
  const payday = forecast.laterEvents.find((event) => event.itemId === "payday");
  assert.ok(payday);
  assert.equal(payday.date, "2026-11-01");
  assert.equal(forecast.counted.some((event) => event.itemId === "payday"), false);
});

test("same-day expenses are counted before same-day income", () => {
  const forecast = buildForecast({
    asOfDate: "2026-01-15",
    startingBalanceCents: 10000,
    setAsideCents: 0,
    items: [
      { id: "bill", name: "Bill", type: "expense", amountCents: 5000, date: "2026-01-15", recurrence: "once", category: "Bills", notes: "" },
      { id: "pay", name: "Pay", type: "income", amountCents: 20000, date: "2026-01-15", recurrence: "once", category: "Income", notes: "" },
    ],
  });
  assert.equal(forecast.lowest.balanceCents, 5000);
  assert.equal(forecast.lowest.timing, "before-income");
  assert.equal(forecast.days[0].endCents, 25000);
  assert.equal(forecast.safeToSpendCents, 5000);
  assert.equal(lowPointIdentityHolds(forecast), true);
  const income = forecast.counted.find((event) => event.itemId === "pay");
  assert.ok(income);
  assert.equal(income.countedInLow, false);
});

test("safe to spend can show a shortfall without hiding it", () => {
  const forecast = buildForecast({
    asOfDate: "2026-05-01",
    startingBalanceCents: 5000,
    setAsideCents: 10000,
    items: [],
  });
  assert.equal(forecast.lowest.balanceCents, 5000);
  assert.equal(forecast.safeToSpendCents, -5000);
  assert.equal(forecast.spendableCents, 0);
  assert.equal(forecast.shortfallCents, 5000);
});

test("a negative starting balance is preserved", () => {
  const forecast = buildForecast({
    asOfDate: "2026-05-01",
    startingBalanceCents: -2500,
    setAsideCents: 0,
    items: [],
  });
  assert.equal(forecast.lowest.balanceCents, -2500);
  assert.equal(forecast.spendableCents, 0);
  assert.equal(forecast.shortfallCents, 2500);
});

test("earliest low point wins a tie", () => {
  const forecast = buildForecast({
    asOfDate: "2026-05-01",
    startingBalanceCents: 10000,
    setAsideCents: 0,
    items: [
      { id: "a", name: "A", type: "expense", amountCents: 1000, date: "2026-05-02", recurrence: "once", category: "Bills", notes: "" },
      { id: "b", name: "B", type: "income", amountCents: 1000, date: "2026-05-03", recurrence: "once", category: "Income", notes: "" },
      { id: "c", name: "C", type: "expense", amountCents: 1000, date: "2026-05-04", recurrence: "once", category: "Bills", notes: "" },
    ],
  });
  assert.equal(forecast.lowest.date, "2026-05-02");
  assert.equal(forecast.lowest.balanceCents, 9000);
});

test("monthly recurrence clamps short months and returns to the anchor day", () => {
  assert.deepEqual(
    occurrencesForItem(
      { date: "2023-01-31", recurrence: "monthly" },
      "2023-01-01",
      "2023-04-30",
    ),
    ["2023-01-31", "2023-02-28", "2023-03-31", "2023-04-30"],
  );
  assert.deepEqual(
    occurrencesForItem(
      { date: "2024-01-31", recurrence: "monthly" },
      "2024-01-01",
      "2024-03-31",
    ),
    ["2024-01-31", "2024-02-29", "2024-03-31"],
  );
  assert.deepEqual(
    occurrencesForItem(
      { date: "2023-02-28", recurrence: "monthly" },
      "2023-02-01",
      "2023-04-30",
    ),
    ["2023-02-28", "2023-03-28", "2023-04-28"],
  );
});

test("weekly and biweekly dates before the window are not applied", () => {
  assert.deepEqual(
    occurrencesForItem(
      { date: "2026-10-01", recurrence: "weekly" },
      "2026-10-22",
      "2026-11-05",
    ),
    ["2026-10-22", "2026-10-29", "2026-11-05"],
  );
  assert.deepEqual(
    occurrencesForItem(
      { date: "2026-10-01", recurrence: "biweekly" },
      "2026-10-22",
      "2026-11-20",
    ),
    ["2026-10-29", "2026-11-12"],
  );
});

test("a one-time item outside the window has no effect", () => {
  const forecast = buildForecast({
    asOfDate: "2026-10-22",
    startingBalanceCents: 10000,
    setAsideCents: 0,
    items: [
      { id: "late", name: "Later", type: "expense", amountCents: 5000, date: "2026-12-01", recurrence: "once", category: "Bills", notes: "" },
    ],
  });
  assert.equal(forecast.lowest.balanceCents, 10000);
  assert.equal(forecast.days.every((day) => day.events.length === 0), true);
});

test("what-if does not mutate the saved items and stays distinct", () => {
  const items = (rentScenario.items ?? []).map((item) => ({ ...item }));
  const snapshot = structuredClone(items);
  const result = compareScenario({ ...rentScenario, items }, {
    id: "scenario",
    name: "Dinner out",
    type: "expense",
    amountCents: 15000,
    date: "2026-10-25",
    recurrence: "once",
    category: "Personal",
    notes: "",
  });
  assert.deepEqual(items, snapshot);
  assert.equal(result.baseline.lowest.balanceCents, 19000);
  assert.equal(result.scenario.lowest.balanceCents, 4000);
  assert.equal(result.scenario.safeToSpendCents, -6000);
  assert.equal(result.scenario.spendableCents, 0);
  assert.equal(result.scenario.shortfallCents, 6000);
  assert.equal(result.lowDeltaCents, -15000);
  assert.equal(result.scenario.hasScenario, true);
  assert.equal(result.baseline.hasScenario, false);
});

test("the same inputs always produce the same forecast", () => {
  const first = buildForecast(rentScenario);
  const second = buildForecast(structuredClone(rentScenario));
  assert.deepEqual(first, second);
});

test("editing an item changes the forecast", () => {
  const before = buildForecast(rentScenario);
  const items = (rentScenario.items ?? []).map((item) =>
    item.id === "rent" ? { ...item, amountCents: 100000 } : item,
  );
  const after = buildForecast({ ...rentScenario, items });
  assert.notEqual(after.lowest.balanceCents, before.lowest.balanceCents);
  assert.equal(after.lowest.balanceCents, 19000 + 45000);
});

test("threshold uses a strict below check", () => {
  const forecast = buildForecast(rentScenario);
  assert.deepEqual(daysBelowThreshold(forecast, 19000), []);
  const below = daysBelowThreshold(forecast, 19001);
  assert.equal(below[0], "2026-10-30");
});

test("stale and coverage helpers", () => {
  assert.equal(staleness("2026-10-01", "2026-10-22").stale, true);
  assert.equal(staleness("2026-10-20", "2026-10-22").stale, false);
  assert.equal(staleness("2026-10-22", "2026-10-22").ageDays, 0);
  assert.equal(staleness("2026-10-23", "2026-10-22").future, true);
  const empty = buildForecast({
    asOfDate: "2026-10-22",
    startingBalanceCents: 100,
    setAsideCents: 0,
    items: [],
  });
  assert.equal(coverageNotes(empty).length, 2);
});

test("category summary totals the window", () => {
  const summary = summarizeWindow(buildForecast(rentScenario));
  assert.equal(summary.incomeCents, 168000 * 2);
  assert.ok(summary.expenseCents > 145000);
  const housing = summary.rows.find((row) => row.category === "Housing");
  assert.ok(housing);
  assert.equal(housing.amountCents, 145000);
});

test("amount parsing rejects ambiguous values and keeps cents exact", () => {
  assert.equal(centsOf("1.15"), 115);
  assert.equal(centsOf("$1,840.00"), 184000);
  assert.equal(centsOf("0", { allowZero: true }), 0);
  assert.equal(centsOf("-40.50", { allowNegative: true }), -4050);
  assert.equal(parseAmountToCents("0").ok, false);
  assert.equal(parseAmountToCents("-5").ok, false);
  assert.equal(parseAmountToCents("1.115").ok, false);
  assert.equal(parseAmountToCents("abc").ok, false);
  assert.equal(parseAmountToCents("").ok, false);
  assert.equal(centsToInput(184000), "1840.00");
  assert.equal(centsToInput(-50), "-0.50");
});

test("sample data is labeled and produces a low point before payday", () => {
  const sample = buildSample("2026-10-22");
  assert.equal(sample.profile.demo, true);
  const forecast = buildForecast({
    asOfDate: sample.profile.asOfDate,
    startingBalanceCents: sample.profile.startingBalanceCents,
    setAsideCents: sample.profile.setAsideCents,
    items: sample.items,
  });
  assert.equal(forecast.lowest.balanceCents, 19000);
  assert.ok(forecast.lowest.date < "2026-11-01");
  assert.equal(lowPointIdentityHolds(forecast), true);
});

test("store round-trip and corrupt data", () => {
  const memory = new Map<string, string>();
  const storage: KeyValueStorage = {
    getItem: (key) => (memory.has(key) ? memory.get(key) ?? null : null),
    setItem: (key, value) => memory.set(key, String(value)),
    removeItem: (key) => {
      memory.delete(key);
    },
  };
  const store = createStore(storage);
  assert.equal(store.load().status, "empty");
  const sample = buildSample("2026-10-22");
  store.save(sample);
  const loaded = store.load();
  assert.equal(loaded.status, "ok");
  if (loaded.status === "ok") assert.equal(loaded.data.profile.startingBalanceCents, 184000);
  storage.setItem("moneymind.v1", "{");
  const broken = store.load();
  assert.equal(broken.status, "invalid");
  assert.equal(broken.raw, "{");
  store.clear();
  assert.equal(store.load().status, "empty");
});

test("rejected calendar dates do not roll over", () => {
  assert.throws(() => addDays("2026-02-31", 1));
});
