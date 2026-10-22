import { addDays, formatLong, formatRange, parseISODate, todayISO } from "./dates.ts";
import {
  CATEGORIES,
  buildForecast,
  compareScenario,
  coverageNotes,
  daysBelowThreshold,
  monthlyClampNote,
  staleness,
  summarizeWindow,
  type Forecast,
  type LedgerEvent,
  type PlanItem,
  type ScenarioComparison,
} from "./forecast.ts";
import { CURRENCIES, centsToInput, formatMoney, parseAmountToCents } from "./money.ts";
import {
  isCategory,
  isCurrencyCode,
  isItemType,
  isRecurrence,
  type Category,
  type CurrencyCode,
  type ItemType,
  type PlanState,
  type Recurrence,
} from "./model.ts";
import { buildSample } from "./sample.ts";
import { createStore, emptyReminder, type LoadResult } from "./store.ts";

const store = createStore(window.localStorage);
const appRoot = document.getElementById("app");
const liveRoot = document.getElementById("live");
if (!appRoot || !liveRoot) throw new Error("MoneyMind root is missing.");
const app: HTMLElement = appRoot;
const live: HTMLElement = liveRoot;

interface Route {
  name: string;
  id?: string | null;
  panel?: string;
}

interface DialogState {
  title: string;
  body: string;
  confirm: string;
  confirmAction: string;
  danger?: boolean;
  cancel?: string;
  id?: string;
}

interface ToastState {
  text: string;
  undo?: boolean;
}

interface FormDraft {
  route: string;
  form: string;
  data: Record<string, string>;
}

interface FieldValues {
  name: string;
  type: string;
  amount: string;
  date: string;
  recurrence: string;
  category: string;
  notes: string;
}

interface WhatIfDraft {
  name: string;
  amount: string;
  date: string;
  type: ItemType;
  category: Category;
}

type Child = Node | string | number | null | false | undefined;
type Attrs = Record<string, string | number | boolean | null | undefined>;

let model: PlanState | null = null;
let loadProblem: Extract<LoadResult, { status: "invalid" }> | null = null;
let dialog: DialogState | null = null;
let toast: ToastState | null = null;
let formDraft: FormDraft | null = null;
let formErrors: Record<string, string> = {};
let whatIfDraft: WhatIfDraft = {
  name: "Optional purchase",
  amount: "",
  date: "",
  type: "expense",
  category: "Personal",
};
let undoItem: PlanItem | null = null;
let notifiedKey = "";
let online = navigator.onLine;
let route: Route = { name: "welcome" };
let pageTitle = "MoneyMind";

const SVG = "http://www.w3.org/2000/svg";
const SVG_TAGS = new Set(["svg", "polyline", "line", "circle", "title"]);

function el(tag: string, attrs: Attrs = {}, children: Child[] = []): HTMLElement {
  const node = (SVG_TAGS.has(tag) ? document.createElementNS(SVG, tag) : document.createElement(tag)) as HTMLElement;
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.setAttribute("class", String(value));
    else if (key === "text") node.textContent = String(value);
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

function requireModel(): PlanState {
  if (!model) throw new Error("MoneyMind has no saved plan on this screen.");
  return model;
}

function money(cents: number, currency: CurrencyCode | string = model?.profile.currency || "USD"): string {
  return formatMoney(cents, currency);
}

function say(message: string): void {
  live.textContent = "";
  window.setTimeout(() => {
    live.textContent = message;
  }, 30);
}

function parseRoute() {
  const raw = (location.hash || "#/welcome").replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  const parts = path.split("/").filter(Boolean).map((part) => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });
  const head = parts[0] || "welcome";
  if (head === "items" && parts[1] === "new") return { name: "item-form", id: null };
  if (head === "items" && parts[2] === "edit") return { name: "item-form", id: parts[1] };
  if (head === "items" && parts[1]) return { name: "item", id: parts[1] };
  if (head === "preview") return { name: "preview", panel: parts[1] || "loading" };
  return { name: head };
}

function realInput() {
  const plan = requireModel();
  return {
    startingBalanceCents: plan.profile.startingBalanceCents,
    asOfDate: plan.profile.asOfDate,
    setAsideCents: plan.profile.setAsideCents,
    items: plan.items,
  };
}

function viewInput() {
  if (route.name === "preview" && route.panel === "empty") {
    return { ...realInput(), items: [] };
  }
  return realInput();
}

function currentForecast() {
  return buildForecast(viewInput());
}

function snapshotOf(forecast: Forecast) {
  return {
    generatedAt: new Date().toISOString(),
    asOfDate: forecast.asOfDate,
    endDate: forecast.endDate,
    lowestDate: forecast.lowest.date,
    lowestCents: forecast.lowest.balanceCents,
    safeToSpendCents: forecast.safeToSpendCents,
    setAsideCents: forecast.setAsideCents,
    label: "Derived estimate. Not a guarantee.",
  };
}

function persist(): void {
  const plan = requireModel();
  plan.profile.updatedAt = new Date().toISOString();
  plan.forecastSnapshot = snapshotOf(buildForecast(realInput()));
  store.save(plan);
}

function go(hash: string): void {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function readFields(form: HTMLFormElement): Record<string, string> {
  const data: Record<string, string> = {};
  for (const field of form.elements) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) continue;
    if (!field.name) continue;
    if (field instanceof HTMLInputElement && field.type === "radio") {
      if (field.checked) data[field.name] = field.value;
    } else if (field instanceof HTMLInputElement && field.type === "checkbox") {
      data[field.name] = field.checked ? "on" : "";
    } else data[field.name] = field.value;
  }
  return data;
}

function capture(form: HTMLFormElement): void {
  formDraft = { route: form.dataset.route ?? "", form: form.dataset.form ?? "", data: readFields(form) };
}

function draftFor(formName: string): Record<string, string> | null {
  if (!formDraft || formDraft.route !== location.hash || formDraft.form !== formName) return null;
  return formDraft.data;
}

interface FieldOptions {
  id: string;
  name: string;
  label: string;
  value?: string;
  kind?: "select" | "textarea";
  type?: string;
  inputmode?: string;
  help?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

function field(options: FieldOptions): HTMLElement {
  const id = options.id;
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const described = [options.help ? helpId : null, options.error ? errorId : null].filter(Boolean).join(" ");
  const control = options.kind === "select"
    ? el("select", { id, name: options.name, "aria-invalid": options.error ? "true" : "false", "aria-describedby": described || null },
      (options.options ?? []).map((entry) => el("option", { value: entry.value, selected: entry.value === options.value ? true : null, text: entry.label })))
    : options.kind === "textarea"
      ? el("textarea", { id, name: options.name, "aria-invalid": options.error ? "true" : "false", "aria-describedby": described || null, text: options.value ?? "" })
      : el("input", {
        id,
        name: options.name,
        type: options.type || "text",
        value: options.value ?? "",
        inputmode: options.inputmode || null,
        autocomplete: "off",
        "aria-invalid": options.error ? "true" : "false",
        "aria-describedby": described || null,
      });
  if (options.kind === "select" && control instanceof HTMLSelectElement) control.value = options.value ?? "";
  return el("div", { class: options.error ? "field has-error" : "field" }, [
    el("label", { for: id, text: options.label }),
    control,
    options.help ? el("p", { id: helpId, class: "help", text: options.help }) : null,
    options.error ? el("p", { id: errorId, class: "error", role: "alert", text: options.error }) : null,
  ]);
}

function disclaimer() {
  return el("p", { class: "disclaimer", text: "Estimate only. Not a guarantee, a bank balance, or financial advice." });
}

function banners(forecast: Forecast): HTMLElement[] {
  const nodes = [];
  if (route.name === "preview") {
    nodes.push(el("p", { class: "banner", text: "Prototype preview. Saved entries were not changed." }));
  }
  if (route.name === "preview" && route.panel === "offline") {
    nodes.push(el("p", { class: "banner", text: "Preview of the offline message. Your connection was not changed. Entries stay in this browser either way." }));
  } else if (!online) {
    nodes.push(el("p", { class: "banner", text: "You appear to be offline. Entries stay in this browser." }));
  }
  if (model?.profile.demo) {
    nodes.push(el("div", { class: "banner demo" }, [
      el("p", { text: "Sample data. These figures are not your finances." }),
      el("button", { class: "button secondary", type: "button", "data-action": "clear-sample", text: "Remove sample data" }),
    ]));
  }
  if (model) {
    const age = staleness(model.profile.asOfDate, todayISO());
    if (age.future) {
      nodes.push(el("p", { class: "banner bad", text: "The balance date is in the future. Update it to today or a past date before relying on the estimate." }));
    } else if (age.stale) {
      nodes.push(el("p", { class: "banner stale", text: `Balance date is ${formatLong(model.profile.asOfDate)}, ${age.ageDays} days ago. Spending since then is not in this estimate. Update the balance before you rely on it.` }));
    }
    for (const note of coverageNotes(forecast)) nodes.push(el("p", { class: "banner", text: note }));
    if (model.reminder.enabled && model.reminder.thresholdCents != null) {
      const dates = daysBelowThreshold(forecast, model.reminder.thresholdCents);
      if (dates.length) {
        nodes.push(el("p", { class: "banner warn", text: `The estimate goes below ${money(model.reminder.thresholdCents)} on ${formatLong(dates[0])}. This is an in-app alert, not a prediction of a bank balance.` }));
      }
    }
  }
  return nodes;
}

function heroFigure(forecast: Forecast): HTMLElement {
  const short = forecast.shortfallCents > 0;
  const sentence = short
    ? `No spend keeps the lowest point at or above the ${money(forecast.setAsideCents)} set-aside. The estimate is short by ${money(forecast.shortfallCents)} on ${formatLong(forecast.lowest.date)}.`
    : forecast.setAsideCents === 0
      ? `This is the lowest estimated balance in the next 30 days, on ${formatLong(forecast.lowest.date)}. You have not set any money aside.`
      : `You could spend this today and still be at the ${money(forecast.setAsideCents)} set-aside when the estimate is lowest, on ${formatLong(forecast.lowest.date)}.`;
  return el("section", { class: "card hero", "aria-labelledby": "safe-heading" }, [
    el("p", { class: "kicker", id: "safe-heading", text: "Safe to spend" }),
    el("p", { class: short ? "figure short" : "figure", text: money(forecast.spendableCents) }),
    el("p", { text: sentence }),
    el("div", { class: "row" }, [
      el("a", { class: "button primary", href: "#/explain", text: "See the calculation" }),
      el("a", { class: "button secondary", href: "#/what-if", text: "Try a purchase" }),
    ]),
  ]);
}

function eventLine(event: LedgerEvent): HTMLElement {
  const sign = event.type === "income" ? "+" : "−";
  const href = event.scenario ? "#/what-if" : `#/items/${encodeURIComponent(event.itemId)}`;
  return el("li", { class: event.scenario ? "event is-scenario" : "event" }, [
    el("a", { href }, [
      el("span", { class: "event-name", text: event.name }),
      document.createTextNode(" "),
      event.scenario ? el("span", { class: "tag", text: "Scenario · not saved" }) : el("span", { class: "event-meta", text: event.category }),
    ]),
    el("span", { class: "amount", text: `${sign}${money(event.amountCents)}` }),
  ]);
}

function ledger(forecast: Forecast, { onlyEvents = false } = {}): HTMLElement {
  const rows: HTMLElement[] = [];
  let quiet: Forecast["days"] = [];
  const flush = () => {
    if (!quiet.length || onlyEvents) {
      quiet = [];
      return;
    }
    const last = quiet[quiet.length - 1];
    const includesLow = quiet.some((day) => day.date === forecast.lowest.date);
    rows.push(el("li", { class: includesLow ? "day quiet is-low" : "day quiet" }, [
      el("p", { text: `${formatRange(quiet[0].date, last.date)}. No planned items. Estimate stays ${money(last.endCents)}.` }),
      includesLow ? el("p", { class: "marker", text: `Lowest estimate · ${formatLong(forecast.lowest.date)}` }) : null,
    ]));
    quiet = [];
  };
  for (const day of forecast.days) {
    if (!day.events.length) {
      quiet.push(day);
      continue;
    }
    flush();
    const isLow = day.date === forecast.lowest.date;
    rows.push(el("li", { class: isLow ? "day is-low" : "day" }, [
      el("div", { class: "day-head" }, [
        el("h3", { text: formatLong(day.date) }),
        el("p", { class: "num", text: `Low ${money(day.dayLowCents)} · End ${money(day.endCents)}` }),
      ]),
      isLow ? el("p", { class: "marker", text: "Lowest estimate" }) : null,
      el("ul", { class: "event-list" }, day.events.map(eventLine)),
    ]));
  }
  flush();
  if (!rows.length) {
    rows.push(el("li", { class: "day quiet" }, [
      el("p", { text: "No income or bills in this 30-day window. The estimate stays at the starting balance." }),
    ]));
  }
  return el("ol", { class: "ledger" }, rows);
}

function sparkline(forecast: Forecast): HTMLElement {
  const values = forecast.days.map((day) => day.dayLowCents);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const span = Math.max(1, max - min);
  const width = 640;
  const height = 160;
  const pad = 10;
  const coords = values.map((value: number, index: number) => {
    const x = pad + (index / (values.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (value - min) / span) * (height - pad * 2);
    return [x, y];
  });
  const lowIndex = forecast.days.findIndex((day) => day.date === forecast.lowest.date);
  const [dotX, dotY] = coords[lowIndex];
  return el("svg", {
    class: "spark",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": `Line of the estimated low balance each day. The lowest point is ${money(forecast.lowest.balanceCents)} on ${formatLong(forecast.lowest.date)}. A full table follows.`,
  }, [
    el("title", { text: "Estimated low balance for each of the next 30 days" }),
    el("polyline", { class: "spark-line", points: coords.map((pair) => pair.join(",")).join(" ") }),
    el("circle", { class: "spark-dot", cx: dotX, cy: dotY, r: 5 }),
  ]);
}

function dayTable(forecast: Forecast): HTMLElement {
  return el("div", { class: "table-wrap" }, [
    el("table", {}, [
      el("caption", { text: "Estimated balance for each day. Expenses are counted before income on the same day." }),
      el("thead", {}, [
        el("tr", {}, ["Date", "Income", "Expenses", "Low point", "End of day"].map((label) => el("th", { scope: "col", text: label }))),
      ]),
      el("tbody", {}, forecast.days.map((day) => el("tr", {}, [
        el("th", { scope: "row", text: formatLong(day.date) }),
        el("td", { class: "num", text: money(day.incomeCents) }),
        el("td", { class: "num", text: money(day.expenseCents) }),
        el("td", { class: "num", text: money(day.dayLowCents) }),
        el("td", { class: "num", text: money(day.endCents) }),
      ]))),
    ]),
  ]);
}

function countedTotals(forecast: Forecast): { income: number; expense: number } {
  let income = 0;
  let expense = 0;
  for (const event of forecast.counted) {
    if (!event.countedInLow) continue;
    if (event.type === "income") income += event.amountCents;
    else expense += event.amountCents;
  }
  return { income, expense };
}

function viewWelcome() {
  pageTitle = "How estimates work";
  return el("article", { class: "sheet narrow" }, [
    el("p", { class: "kicker", text: "Step 1 of 2" }),
    el("h1", { text: "Estimates, not promises" }),
    el("p", { class: "lede", text: "MoneyMind shows whether the cash you enter is likely to cover the bills you enter over the next 30 days." }),
    el("ul", { class: "plain-list" }, [
      "You type a balance, income, and bills. Nothing connects to a bank.",
      "The result is an estimate. It is not a guarantee or financial advice.",
      "Spending you do not enter is missing until you add it.",
      "Same-day bills are counted before same-day income.",
      "Safe to spend is the lowest estimated balance minus a set-aside you choose.",
      "This portfolio prototype stores entries in this browser without encryption. Use approximate amounts. Do not enter bank passwords or full account numbers.",
    ].map((text) => el("li", { text }))),
    el("div", { class: "formula", "aria-label": "Safe to spend in words" }, [
      el("div", {}, [el("span", { text: "Lowest estimated balance" }), el("span", { text: "next 30 days" })]),
      el("div", {}, [el("span", { text: "Minus set-aside" }), el("span", { text: "optional, your choice" })]),
      el("div", {}, [el("strong", { text: "Safe to spend" }), el("span", { text: "what you could spend today" })]),
    ]),
    el("div", { class: "stack" }, [
      el("a", { class: "button primary full", href: "#/start", text: "Enter what I have now" }),
      el("button", { class: "button secondary full", type: "button", "data-action": "use-sample", text: "Explore with sample data" }),
    ]),
    disclaimer(),
  ]);
}

function balanceValues() {
  const draft = draftFor("balance");
  if (draft) return draft;
  if (model && route.name === "balance") {
    return {
      currency: model.profile.currency,
      balance: centsToInput(model.profile.startingBalanceCents),
      asOf: model.profile.asOfDate,
      setAside: centsToInput(model.profile.setAsideCents),
    };
  }
  return { currency: "USD", balance: "", asOf: todayISO(), setAside: "0.00" };
}

function viewBalance() {
  const editing = route.name === "balance" && model;
  pageTitle = editing ? "Update balance" : "Starting balance";
  const values = balanceValues();
  return el("article", { class: "sheet narrow" }, [
    el("p", { class: "kicker", text: editing ? "Starting point" : "Step 2 of 2" }),
    el("p", {}, [el("a", { href: editing ? "#/home" : "#/welcome", text: editing ? "Back to home" : "Back" })]),
    el("h1", { text: editing ? "Update the starting balance" : "What cash is available now?" }),
    el("p", { text: "Use the money you could spend from one pool, such as a checking balance. The estimate starts here, before today’s bills and income." }),
    model?.profile.demo ? el("p", { class: "banner demo", text: "You are looking at sample data. Saving a new balance keeps the sample label until you remove the sample." }) : null,
    el("form", { class: "stack", "data-form": "balance", "data-route": location.hash, novalidate: true }, [
      field({
        id: "currency",
        name: "currency",
        label: "Currency symbol",
        kind: "select",
        value: values.currency,
        help: "Symbols only. MoneyMind does not convert currencies.",
        options: CURRENCIES.map((entry) => ({ value: entry.code, label: entry.label })),
      }),
      field({
        id: "balance",
        name: "balance",
        label: "Current balance",
        value: values.balance,
        inputmode: "decimal",
        error: formErrors.balance,
        help: "A negative amount is allowed if the account is already short. Example: 1840.00",
      }),
      field({
        id: "asOf",
        name: "asOf",
        label: "Balance date",
        type: "date",
        value: values.asOf,
        error: formErrors.asOf,
        help: "Use today or a past date. The 30-day window starts on this date.",
      }),
      field({
        id: "setAside",
        name: "setAside",
        label: "Set-aside",
        value: values.setAside,
        inputmode: "decimal",
        error: formErrors.setAside,
        help: "Optional cash you want left at the lowest point. Use 0 if you do not want a cushion. This is your choice, not a recommendation.",
      }),
      el("button", { class: "button primary", type: "submit", text: editing ? "Save balance" : "Create my estimate" }),
    ]),
    disclaimer(),
  ]);
}

function viewHome() {
  pageTitle = "Home";
  const forecast = currentForecast();
  const upcoming = forecast.days.filter((day) => day.events.length).slice(0, 4);
  const empty = forecast.days.every((day) => day.events.length === 0);
  return el("div", { class: "main-inner sheet" }, [
    el("h1", { class: "visually-hidden", text: "Your next 30 days" }),
    ...banners(forecast),
    el("div", { class: "home-grid" }, [
      el("div", { class: "sheet" }, [
        heroFigure(forecast),
        el("section", { class: "card" }, [
          el("h2", { text: "Lowest estimate" }),
          el("p", { class: "lede", text: `${money(forecast.lowest.balanceCents)} on ${formatLong(forecast.lowest.date)}` }),
          el("p", { text: forecast.lowest.timing === "before-income"
            ? "Income scheduled that day is not included in the low point, because bills are counted first."
            : "This is the lowest point after that day’s entered items." }),
          el("a", { href: "#/timeline", text: "Open the 30-day timeline" }),
        ]),
      ]),
      el("section", { class: "sheet", "aria-labelledby": "next-heading" }, [
        el("div", { class: "row" }, [
          el("h2", { id: "next-heading", text: empty ? "Nothing planned yet" : "Next planned items" }),
          el("a", { class: "button secondary", href: "#/items/new", text: "Add an item" }),
        ]),
        empty
          ? el("div", { class: "card stack" }, [
            el("p", { text: "Add the next payday and the bills due before it. Until then, safe to spend is the starting balance minus any set-aside." }),
            el("button", { class: "button secondary", type: "button", "data-action": "use-sample", text: "Explore with sample data" }),
          ])
          : ledger({ ...forecast, days: upcoming.length ? forecast.days.filter((day) => upcoming.includes(day)) : forecast.days }, { onlyEvents: true }),
        el("a", { href: "#/balance", text: "Update balance" }),
      ]),
    ]),
    disclaimer(),
  ]);
}

function viewTimeline() {
  pageTitle = "30-day timeline";
  const forecast = currentForecast();
  return el("div", { class: "main-inner sheet" }, [
    ...banners(forecast),
    el("p", { class: "kicker", text: `${formatLong(forecast.asOfDate)} – ${formatLong(forecast.endDate)}` }),
    el("h1", { text: "30-day timeline" }),
    el("p", { class: "lede", text: "Each day shows the estimated low point and the end-of-day balance from the items you entered." }),
    el("div", { class: "card" }, [sparkline(forecast)]),
    el("p", { class: "help", text: "The marked point is the lowest estimate. Days with no items are grouped." }),
    ledger(forecast),
    el("details", { open: true }, [
      el("summary", { text: "Show the 30-day table" }),
      dayTable(forecast),
    ]),
    disclaimer(),
  ]);
}

function viewExplain() {
  pageTitle = "Safe to spend";
  const forecast = currentForecast();
  const totals = countedTotals(forecast);
  const steps = [
    ["Starting balance", money(forecast.startingBalanceCents)],
    ["Income counted before the low point", `+ ${money(totals.income)}`],
    ["Expenses counted before the low point", `− ${money(totals.expense)}`],
    [`Lowest estimate on ${formatLong(forecast.lowest.date)}`, money(forecast.lowest.balanceCents)],
    ["Set-aside you chose", `− ${money(forecast.setAsideCents)}`],
    ["Safe to spend", money(forecast.safeToSpendCents)],
  ];
  return el("article", { class: "main-inner sheet narrow" }, [
    ...banners(forecast),
    el("p", { class: "kicker", text: "Why this number" }),
    el("h1", { text: "Safe to spend" }),
    el("p", { class: "lede", text: "Safe to spend is how much you could spend today without pushing the lowest estimated point under the set-aside." }),
    el("div", { class: "formula" }, steps.map(([label, value], index) => el("div", {}, [
      index === steps.length - 1 ? el("strong", { text: label }) : el("span", { text: label }),
      index === steps.length - 1 ? el("strong", { class: "num", text: value }) : el("span", { class: "num", text: value }),
    ]))),
    forecast.shortfallCents > 0
      ? el("p", { text: `Shown on Home as ${money(forecast.spendableCents)}, with the ${money(forecast.shortfallCents)} shortfall stated beside it. The negative result is not hidden.` })
      : null,
    el("h2", { text: "Items in the low point" }),
    forecast.counted.length
      ? el("ul", { class: "event-list" }, forecast.counted.map((event) => el("li", { class: "event" }, [
        el("span", { text: `${formatLong(event.date)} · ${event.name}${event.countedInLow ? "" : " · not counted in the low point"}` }),
        el("span", { class: "num", text: `${event.type === "income" ? "+" : "−"}${money(event.amountCents)}` }),
      ])))
      : el("p", { text: "No items fall on or before the low point." }),
    el("h2", { text: "After the low point" }),
    el("p", { text: "Income that arrives later does not increase safe to spend, because the low point comes first. It still appears on the timeline." }),
    forecast.laterEvents.length
      ? el("ul", { class: "event-list" }, forecast.laterEvents.map((event) => el("li", { class: "event" }, [
        el("span", { text: `${formatLong(event.date)} · ${event.name}` }),
        el("span", { class: "num", text: `${event.type === "income" ? "+" : "−"}${money(event.amountCents)}` }),
      ])))
      : el("p", { text: "No entered items are dated after the low point." }),
    el("h2", { text: "Assumptions" }),
    el("ul", { class: "assumption-list" }, forecast.assumptions.map((text) => el("li", { text }))),
    disclaimer(),
  ]);
}

function itemValues(existing: PlanItem | null): Record<string, string> {
  const draft = draftFor("item");
  if (draft) return draft;
  if (existing) {
    return {
      name: existing.name,
      type: existing.type,
      amount: centsToInput(existing.amountCents),
      date: existing.date,
      recurrence: existing.recurrence,
      category: existing.category,
      notes: existing.notes,
    };
  }
  return {
    name: "",
    type: "expense",
    amount: "",
    date: model?.profile.asOfDate || todayISO(),
    recurrence: "once",
    category: "Bills",
    notes: "",
  };
}

function previewItem(values: Record<string, string>): HTMLElement[] {
  const errors = validateItemFields(values);
  if (Object.keys(errors).length) {
    return [el("p", { class: "help", text: "Enter a name, an amount greater than 0, and a date to preview the estimate." })];
  }
  const candidate = itemFromValues(values, "preview");
  const items = requireModel().items.filter((item) => item.id !== route.id);
  const next = buildForecast({ ...realInput(), items: [...items, candidate] });
  const current = buildForecast(realInput());
  return [el("div", { class: "card stack" }, [
    el("h2", { text: "If you save" }),
    el("p", { text: `The lowest estimate would be ${money(next.lowest.balanceCents)} on ${formatLong(next.lowest.date)}.` }),
    el("p", { text: `It is ${money(current.lowest.balanceCents)} on ${formatLong(current.lowest.date)} now.` }),
    el("p", { class: "help", text: "This preview is not saved until you use the save button." }),
  ])];
}

function viewItemForm() {
  const plan = requireModel();
  const existing = route.id ? plan.items.find((item) => item.id === route.id) ?? null : null;
  if (route.id && !existing) return missingItem();
  pageTitle = existing ? `Edit ${existing.name}` : "Add an item";
  const values = itemValues(existing);
  const note = monthlyClampNote(values.date || plan.profile.asOfDate);
  return el("article", { class: "sheet narrow" }, [
    el("p", { class: "kicker", text: existing ? "Edit item" : "Add item" }),
    el("h1", { text: existing ? `Edit ${existing.name}` : "Add income or a bill" }),
    el("form", { class: "stack", "data-form": "item", "data-live": "item", "data-route": location.hash, novalidate: true }, [
      field({ id: "name", name: "name", label: "Name", value: values.name, error: formErrors.name, help: "A short name, such as Rent or Payday." }),
      el("fieldset", {}, [
        el("legend", { text: "Type" }),
        ...["expense", "income"].map((type) => el("label", { class: "choice" }, [
          el("input", { type: "radio", name: "type", value: type, checked: values.type === type ? true : null }),
          type === "expense" ? "Expense" : "Income",
        ])),
        formErrors.type ? el("p", { class: "error", role: "alert", text: formErrors.type }) : null,
      ]),
      field({ id: "amount", name: "amount", label: "Amount", value: values.amount, inputmode: "decimal", error: formErrors.amount, help: "Greater than 0. The type sets whether it adds or subtracts." }),
      field({ id: "date", name: "date", label: "First date", type: "date", value: values.date, error: formErrors.date, help: "Dates before the balance date are not added again. They are treated as already in the balance." }),
      note ? el("p", { class: "help", text: note }) : null,
      field({
        id: "recurrence",
        name: "recurrence",
        label: "Repeats",
        kind: "select",
        value: values.recurrence,
        options: [
          ["once", "Once"],
          ["weekly", "Every week"],
          ["biweekly", "Every two weeks"],
          ["monthly", "Every month"],
        ].map(([value, label]) => ({ value, label })),
      }),
      field({
        id: "category",
        name: "category",
        label: "Category",
        kind: "select",
        value: values.category,
        help: "Used only for the summary. It does not change safe to spend.",
        options: CATEGORIES.map((category) => ({ value: category, label: category })),
      }),
      field({ id: "notes", name: "notes", label: "Note", kind: "textarea", value: values.notes, error: formErrors.notes, help: "Optional. Up to 280 characters." }),
      el("div", { id: "live-preview" }, previewItem(values)),
      el("div", { class: "row" }, [
        el("button", { class: "button primary", type: "submit", text: existing ? "Save changes" : "Save item" }),
        el("a", { class: "button secondary", href: existing ? `#/items/${encodeURIComponent(existing.id)}` : "#/plan", text: "Cancel" }),
      ]),
      existing ? el("button", { class: "button danger", type: "button", "data-action": "delete-item", "data-id": existing.id, text: "Delete item" }) : null,
    ]),
  ]);
}

function viewItem() {
  const item = requireModel().items.find((entry) => entry.id === route.id);
  if (!item) return missingItem();
  pageTitle = item.name;
  const forecast = buildForecast(realInput());
  const hits = forecast.days.flatMap((day) => day.events.filter((event) => event.itemId === item.id));
  return el("article", { class: "sheet narrow" }, [
    el("p", { class: "kicker", text: item.type === "income" ? "Income" : "Expense" }),
    el("h1", { text: item.name }),
    el("p", { class: "figure", text: `${item.type === "income" ? "+" : "−"}${money(item.amountCents)}` }),
    el("div", { class: "card" }, [
      kv("First date", formatLong(item.date)),
      kv("Repeats", labelRecurrence(item.recurrence)),
      kv("Category", item.category),
      item.notes ? kv("Note", item.notes) : null,
    ]),
    monthlyClampNote(item.date) ? el("p", { class: "help", text: monthlyClampNote(item.date) }) : null,
    el("h2", { text: "In this 30-day window" }),
    hits.length
      ? el("ul", { class: "plain-list" }, hits.map((hit) => el("li", { text: formatLong(hit.date) })))
      : el("p", { text: "No occurrence falls in the current 30-day window. The item is saved and will matter if the window moves onto one of its dates." }),
    el("div", { class: "row" }, [
      el("a", { class: "button primary", href: `#/items/${encodeURIComponent(item.id)}/edit`, text: "Edit" }),
      el("button", { class: "button danger", type: "button", "data-action": "delete-item", "data-id": item.id, text: "Delete" }),
    ]),
  ]);
}

function missingItem() {
  pageTitle = "Item not found";
  return el("article", { class: "sheet narrow" }, [
    el("h1", { text: "That item is not in this plan" }),
    el("p", { text: "It may have been deleted. The estimate uses only the items still saved on this device." }),
    el("a", { class: "button primary", href: "#/plan", text: "Back to the plan" }),
  ]);
}

function kv(label: string, value: string): HTMLElement {
  return el("div", { class: "kv" }, [el("span", { text: label }), el("span", { text: value })]);
}

function labelRecurrence(value: string): string {
  const labels: Record<Recurrence, string> = {
    once: "Once",
    weekly: "Every week",
    biweekly: "Every two weeks",
    monthly: "Every month",
  };
  return isRecurrence(value) ? labels[value] : value;
}

function viewPlan() {
  pageTitle = "Plan";
  const plan = requireModel();
  const income = plan.items.filter((item) => item.type === "income");
  const expenses = plan.items.filter((item) => item.type === "expense");
  return el("div", { class: "main-inner sheet" }, [
    el("div", { class: "row" }, [
      el("h1", { text: "Plan" }),
      el("a", { class: "button primary", href: "#/items/new", text: "Add an item" }),
    ]),
    el("p", { text: "These are the income and expense items saved on this device. Deleting or editing one updates the 30-day estimate." }),
    sectionList("Income", income),
    sectionList("Expenses", expenses),
    !plan.items.length ? el("p", { class: "card", text: "No items yet. Add a payday and the bills due before it." }) : null,
  ]);
}

function sectionList(title: string, items: PlanItem[]): HTMLElement {
  return el("section", { class: "sheet" }, [
    el("h2", { text: title }),
    items.length
      ? el("ul", { class: "ledger" }, items.map((item) => el("li", { class: "day" }, [
        el("div", { class: "item-row" }, [
          el("a", { href: `#/items/${encodeURIComponent(item.id)}` }, [
            el("span", { class: "event-name", text: item.name }),
            el("span", { class: "event-meta", text: ` ${labelRecurrence(item.recurrence)} · next anchor ${formatLong(item.date)}` }),
          ]),
          el("span", { class: "amount", text: `${item.type === "income" ? "+" : "−"}${money(item.amountCents)}` }),
        ]),
      ])))
      : el("p", { class: "help", text: `No ${title.toLowerCase()} items.` }),
  ]);
}

function whatIfValues() {
  const draft = draftFor("what-if");
  if (draft) return draft;
  const plan = requireModel();
  return {
    name: whatIfDraft.name,
    amount: whatIfDraft.amount,
    date: whatIfDraft.date || plan.profile.asOfDate,
    type: whatIfDraft.type,
    category: whatIfDraft.category,
  };
}

function whatIfResult(values: Record<string, string>): {
  errors: Record<string, string>;
  result: ScenarioComparison | null;
  scenarioItem?: PlanItem;
} {
  const errors = validateWhatIf(values);
  const type = values.type ?? "";
  const category = values.category ?? "";
  if (Object.keys(errors).length || !isItemType(type) || !isCategory(category)) {
    return { errors, result: null };
  }
  const scenarioItem: PlanItem = {
    id: "scenario",
    name: (values.name ?? "").trim(),
    type,
    amountCents: requiredCents(values.amount ?? ""),
    date: values.date ?? "",
    recurrence: "once",
    category,
    notes: "",
    scenario: true,
  };
  return { errors, result: compareScenario(realInput(), scenarioItem), scenarioItem };
}

function viewWhatIf() {
  pageTitle = "What-if";
  const values = whatIfValues();
  const outcome = whatIfResult(values);
  const outside = Boolean(outcome.result && (values.date < outcome.result.baseline.asOfDate || values.date > outcome.result.baseline.endDate));
  return el("article", { class: "main-inner sheet" }, [
    el("p", { class: "kicker", text: "Not saved" }),
    el("h1", { text: "Try a purchase" }),
    el("p", { class: "lede", text: "See how an optional amount would change the lowest estimate. The scenario stays separate from the saved plan until you add it." }),
    el("form", { class: "stack narrow", "data-form": "what-if", "data-live": "what-if", "data-route": location.hash, novalidate: true }, [
      field({ id: "scenario-name", name: "name", label: "Name", value: values.name, error: formErrors.name }),
      field({ id: "scenario-amount", name: "amount", label: "Amount", value: values.amount, inputmode: "decimal", error: formErrors.amount, help: "Greater than 0." }),
      field({ id: "scenario-date", name: "date", label: "Date", type: "date", value: values.date, error: formErrors.date }),
      el("fieldset", {}, [
        el("legend", { text: "Type" }),
        ...["expense", "income"].map((type) => el("label", { class: "choice" }, [
          el("input", { type: "radio", name: "type", value: type, checked: values.type === type ? true : null }),
          type === "expense" ? "Expense" : "Income",
        ])),
      ]),
      field({
        id: "scenario-category",
        name: "category",
        label: "Category",
        kind: "select",
        value: values.category,
        options: CATEGORIES.map((category) => ({ value: category, label: category })),
      }),
      el("div", { class: "row" }, [
        el("button", { class: "button secondary", type: "button", "data-action": "discard-what-if", text: "Discard scenario" }),
        el("button", { class: "button primary", type: "button", "data-action": "save-scenario", text: "Add to plan", disabled: outcome.result ? null : true }),
      ]),
    ]),
    el("div", { id: "live-preview" }, renderWhatIfPreview(outcome, outside)),
    disclaimer(),
  ]);
}

function renderWhatIfPreview(
  outcome: { result: ScenarioComparison | null },
  outside: boolean,
): Array<HTMLElement | null> {
  if (!outcome.result) {
    return [el("p", { class: "help", text: "Enter an amount greater than 0 and a date to compare. Nothing is saved from this screen until you add it to the plan." })];
  }
  const { baseline, scenario, lowDeltaCents } = outcome.result;
  let delta = "This scenario does not change the 30-day estimate.";
  if (lowDeltaCents < 0) delta = `This scenario lowers the lowest estimate by ${money(Math.abs(lowDeltaCents))}.`;
  if (lowDeltaCents > 0) delta = `This scenario raises the lowest estimate by ${money(lowDeltaCents)}.`;
  const interesting = scenario.days.filter((day) => day.date === scenario.lowest.date || day.events.some((event) => event.scenario));
  return [
    outside ? el("p", { class: "banner", text: "That date is outside this 30-day window, so the saved estimate does not change." }) : null,
    el("p", { text: delta }),
    el("div", { class: "compare" }, [
      scenarioColumn("Saved estimate", baseline, false),
      scenarioColumn("Scenario · not saved", scenario, true),
    ]),
    el("h2", { text: "Days this scenario touches" }),
    ledger({ ...scenario, days: interesting }, { onlyEvents: true }),
  ];
}

function scenarioColumn(title: string, forecast: Forecast, scenario: boolean): HTMLElement {
  return el("section", { class: scenario ? "card is-scenario" : "card" }, [
    el("h2", { text: title }),
    scenario ? el("p", { class: "tag", text: "Not part of the saved plan" }) : null,
    kv("Safe to spend", money(forecast.spendableCents)),
    forecast.shortfallCents ? kv("Short of set-aside", money(forecast.shortfallCents)) : null,
    kv("Lowest estimate", `${money(forecast.lowest.balanceCents)} on ${formatLong(forecast.lowest.date)}`),
  ]);
}

function reminderValues() {
  const draft = draftFor("reminder");
  if (draft) return draft;
  const plan = requireModel();
  return {
    enabled: plan.reminder.enabled ? "on" : "",
    threshold: plan.reminder.thresholdCents == null ? "" : centsToInput(plan.reminder.thresholdCents),
  };
}

function notificationStatus() {
  if (typeof Notification === "undefined") {
    return "This browser does not offer device notifications. The in-app alert still works.";
  }
  if (Notification.permission === "granted") {
    return "Device notifications are allowed while this page is open. MoneyMind does not alert you after the page is closed.";
  }
  if (Notification.permission === "denied") {
    return "Notifications are blocked. MoneyMind will keep the alert on Home and on this screen. You can allow notifications in the browser’s site settings.";
  }
  return "Device notifications are off until you allow them. The in-app alert does not need that permission.";
}

function viewReminders() {
  pageTitle = "Low-balance alert";
  const plan = requireModel();
  const forecast = currentForecast();
  const values = reminderValues();
  const threshold = parseAmountToCents(values.threshold || "", { allowZero: true });
  const thresholdCents = plan.reminder.thresholdCents;
  const dates = plan.reminder.enabled && thresholdCents != null
    ? daysBelowThreshold(forecast, thresholdCents)
    : [];
  return el("article", { class: "sheet narrow" }, [
    ...banners(forecast),
    el("h1", { text: "Low-balance alert" }),
    el("p", { text: "Choose an amount. MoneyMind shows an in-app alert when any estimated day in the next 30 days goes below it." }),
    el("form", { class: "stack", "data-form": "reminder", "data-route": location.hash, novalidate: true }, [
      el("label", { class: "choice" }, [
        el("input", { type: "checkbox", name: "enabled", checked: values.enabled === "on" ? true : null }),
        "Show an alert in MoneyMind",
      ]),
      field({
        id: "threshold",
        name: "threshold",
        label: "Alert when the estimate goes below",
        value: values.threshold,
        inputmode: "decimal",
        error: formErrors.threshold,
        help: "Use 0 if you only want an alert when the estimate goes below zero.",
      }),
      el("button", { class: "button primary", type: "submit", text: "Save alert" }),
    ]),
    el("h2", { text: "Current status" }),
    el("p", { text: !plan.reminder.enabled
      ? "The in-app alert is off."
      : dates.length && thresholdCents != null
        ? `The estimate goes below ${money(thresholdCents)} on ${formatLong(dates[0])}.`
        : threshold.ok
          ? "No estimated day is below the saved amount."
          : "Save an amount to check the estimate." }),
    el("h2", { text: "Device notifications" }),
    el("p", { text: notificationStatus() }),
    el("p", { class: "help", text: "A browser notification can appear only while MoneyMind is open and only after you allow it. This prototype does not schedule background alerts." }),
    typeof Notification !== "undefined" && Notification.permission === "default"
      ? el("button", { class: "button secondary", type: "button", "data-action": "request-notifications", text: "Allow device notifications" })
      : null,
    disclaimer(),
  ]);
}

function viewSummary() {
  pageTitle = "Summary";
  const summary = summarizeWindow(currentForecast());
  return el("article", { class: "sheet narrow" }, [
    el("h1", { text: "Entered totals" }),
    el("p", { text: "Totals of items that occur in this 30-day window. This is not a grade and not a budget limit." }),
    el("div", { class: "card" }, [
      kv("Income", money(summary.incomeCents)),
      kv("Expenses", money(summary.expenseCents)),
      kv("Net of entered items", money(summary.netCents)),
    ]),
    summary.rows.length
      ? el("div", { class: "table-wrap" }, [
        el("table", {}, [
          el("caption", { text: "Entered items by category" }),
          el("thead", {}, [el("tr", {}, ["Category", "Type", "Count", "Total"].map((label) => el("th", { scope: "col", text: label })))]),
          el("tbody", {}, summary.rows.map((row) => el("tr", {}, [
            el("th", { scope: "row", text: row.category }),
            el("td", { text: row.type }),
            el("td", { text: String(row.count) }),
            el("td", { class: "num", text: money(row.amountCents) }),
          ]))),
        ]),
      ])
      : el("p", { text: "No items occur in this window yet." }),
  ]);
}

function viewSettings() {
  pageTitle = "Settings";
  const plan = requireModel();
  const updated = plan.profile.updatedAt ? new Date(plan.profile.updatedAt) : null;
  const stamp = updated && !Number.isNaN(updated.getTime())
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(updated)
    : "Not available";
  return el("article", { class: "sheet narrow" }, [
    el("h1", { text: "Settings" }),
    el("div", { class: "card stack" }, [
      el("h2", { text: "Plan" }),
      el("a", { href: "#/balance", text: "Update balance, currency, and set-aside" }),
      el("a", { href: "#/reminders", text: "Low-balance alert" }),
      el("a", { href: "#/summary", text: "Category summary" }),
      el("a", { href: "#/how", text: "How estimates work" }),
      el("a", { href: "#/privacy", text: "Privacy and storage" }),
    ]),
    el("div", { class: "card stack" }, [
      el("h2", { text: "Your entries" }),
      el("p", { class: "help", text: `Last saved change: ${stamp}.` }),
      el("button", { class: "button secondary", type: "button", "data-action": "export-data", text: "Download my entries" }),
      el("button", { class: "button danger", type: "button", "data-action": "delete-all", text: "Delete all data on this device" }),
    ]),
    el("div", { class: "card stack" }, [
      el("h2", { text: "Review interface states" }),
      el("p", { class: "help", text: "These previews do not change saved entries." }),
      el("a", { href: "#/preview/loading", text: "Loading" }),
      el("a", { href: "#/preview/error", text: "Unreadable saved data" }),
      el("a", { href: "#/preview/empty", text: "No items yet" }),
      el("a", { href: "#/preview/offline", text: "Offline message" }),
    ]),
    el("p", { class: "help", text: "MoneyMind portfolio prototype. Calculations run in this browser. Not a bank, adviser, or production financial service." }),
  ]);
}

function viewHow() {
  pageTitle = "How estimates work";
  return el("article", { class: "sheet narrow" }, [
    model ? el("p", {}, [el("a", { href: "#/home", text: "Back to home" })]) : null,
    el("h1", { text: "How an estimate is built" }),
    el("ul", { class: "plain-list" }, [
      "You enter one starting balance and the date it was true.",
      "Income and expenses are expanded by the repeat rule you chose.",
      "The window is 30 calendar days, including the balance date.",
      "On any day, expenses are counted before income.",
      "The lowest point in that window, minus your set-aside, is safe to spend.",
      "A what-if purchase is not saved unless you add it to the plan.",
      "Nothing here connects to a bank or moves money.",
    ].map((text) => el("li", { text }))),
    model ? el("a", { class: "button primary", href: "#/explain", text: "See your calculation" }) : el("a", { class: "button primary", href: "#/start", text: "Enter a balance" }),
    disclaimer(),
  ]);
}

function viewPrivacy() {
  pageTitle = "Privacy";
  return el("article", { class: "sheet narrow" }, [
    model ? el("p", {}, [el("a", { href: "#/home", text: "Back to home" })]) : el("p", {}, [el("a", { href: "#/welcome", text: "Back" })]),
    el("h1", { text: "Privacy and storage" }),
    el("p", { text: "This prototype keeps a balance, items, alert preference, and a derived estimate snapshot in this browser’s local storage, under the key moneymind.v1." }),
    el("ul", { class: "plain-list" }, [
      "There is no account and no upload to a MoneyMind server.",
      "The file you download is created on this device.",
      "Delete all data removes that saved record from this browser.",
      "Bank passwords and full account numbers are not requested. Do not put them in names or notes.",
      "Entries are not encrypted at rest. Anyone who can use this browser profile can read them.",
      "Data is not used for advertising or unrelated profiling. The prototype has no ad system.",
      "If you allow notifications, the message is created locally while the page is open.",
      "Sample data is fictional and stays until you remove it or delete all data.",
    ].map((text) => el("li", { text }))),
    el("p", { text: "A production version would need an approved storage design, retention period, and deletion process before anyone should enter live financial data. Those decisions are still open." }),
  ]);
}

function viewError() {
  pageTitle = "Saved data unreadable";
  const preview = route.name === "preview";
  return el("article", { class: "sheet narrow" }, [
    el("h1", { text: "Saved data could not be read" }),
    el("p", { text: preview
      ? "This is a preview of the unreadable-data screen. Your saved data was not changed."
      : "MoneyMind found a saved record on this device and could not use it. It has not been erased." }),
    preview ? null : el("p", { class: "help", text: loadProblem?.error || "The saved record is invalid." }),
    el("div", { class: "row" }, [
      preview ? el("a", { class: "button primary", href: "#/home", text: "Exit preview" }) : null,
      preview ? null : el("button", { class: "button secondary", type: "button", "data-action": "download-raw", text: "Download the saved text" }),
      preview ? null : el("button", { class: "button danger", type: "button", "data-action": "erase-corrupt", text: "Erase and start over" }),
    ]),
  ]);
}

function viewLoading() {
  pageTitle = "Loading";
  return el("div", { class: "sheet narrow", "aria-busy": "true" }, [
    el("h1", { text: "Preparing your estimate" }),
    el("div", { class: "skeleton", "aria-hidden": "true" }, [
      el("span", { class: "lg" }),
      el("span"),
      el("span"),
    ]),
    el("p", { text: "This preview shows the loading pattern. Opening the app from saved data is usually immediate." }),
    el("a", { class: "button secondary", href: model ? "#/home" : "#/welcome", text: "Exit preview" }),
  ]);
}

function requiredCents(raw: string, options?: { allowZero?: boolean; allowNegative?: boolean }): number {
  const parsed = parseAmountToCents(raw, options);
  if (!parsed.ok) throw new Error(parsed.message);
  return parsed.cents;
}

function validateItemFields(values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = (values.name || "").trim();
  if (!name || name.length > 60) errors.name = "Add a short name, such as Rent or Payday.";
  if (!isItemType(values.type || "")) errors.type = "Choose income or expense.";
  const amount = parseAmountToCents(values.amount || "");
  if (!amount.ok) errors.amount = amount.message;
  if (!parseISODate(values.date || "")) errors.date = "Choose a date.";
  if (!isRecurrence(values.recurrence || "")) errors.recurrence = "Choose how often this repeats.";
  if (!isCategory(values.category || "")) errors.category = "Choose a category.";
  if ((values.notes || "").length > 280) errors.notes = "Shorten the note to 280 characters or fewer.";
  return errors;
}

function itemFromValues(values: Record<string, string>, id: string): PlanItem {
  const type = values.type || "";
  const recurrence = values.recurrence || "";
  const category = values.category || "";
  if (!isItemType(type) || !isRecurrence(recurrence) || !isCategory(category)) {
    throw new Error("Item fields were not validated.");
  }
  return {
    id,
    name: (values.name || "").trim(),
    type,
    amountCents: requiredCents(values.amount || ""),
    date: values.date || "",
    recurrence,
    category,
    notes: values.notes || "",
  };
}

function validateWhatIf(values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!(values.name || "").trim() || (values.name || "").trim().length > 60) errors.name = "Add a short name, such as Dinner out.";
  const amount = parseAmountToCents(values.amount || "");
  if (!amount.ok) errors.amount = amount.message;
  if (!parseISODate(values.date || "")) errors.date = "Choose a date.";
  if (!isItemType(values.type || "")) errors.type = "Choose income or expense.";
  if (!isCategory(values.category || "")) errors.category = "Choose a category.";
  return errors;
}

function readBalance(values: Record<string, string>): {
  ok: boolean;
  errors: Record<string, string>;
  balance?: number;
  setAside?: number;
  date?: string;
  currency?: CurrencyCode;
} {
  const errors: Record<string, string> = {};
  const balance = parseAmountToCents(values.balance || "", { allowNegative: true, allowZero: true });
  if (!balance.ok) errors.balance = balance.message;
  const setAside = parseAmountToCents((values.setAside || "").trim() === "" ? "0" : values.setAside || "", { allowZero: true });
  if (!setAside.ok) errors.setAside = "Enter 0 or more, such as 0.00 or 100.00.";
  if (!parseISODate(values.asOf || "")) errors.asOf = "Choose a date.";
  else if (staleness(values.asOf || "", todayISO()).future) {
    errors.asOf = "Choose today or a past date. The estimate starts from cash you already have.";
  }
  const currency = values.currency || "";
  if (!isCurrencyCode(currency)) errors.currency = "Choose a currency.";
  return {
    ok: Object.keys(errors).length === 0,
    errors,
    balance: balance.ok ? balance.cents : undefined,
    setAside: setAside.ok ? setAside.cents : undefined,
    date: values.asOf,
    currency: isCurrencyCode(currency) ? currency : undefined,
  };
}

function saveBalance(form: HTMLFormElement): void {
  const values = readFields(form);
  const parsed = readBalance(values);
  formErrors = parsed.errors;
  if (!parsed.ok || parsed.balance == null || parsed.setAside == null || !parsed.date || !parsed.currency) {
    render();
    say("Check the balance fields.");
    return;
  }
  const creating = !model;
  const now = new Date().toISOString();
  if (creating) {
    model = {
      version: 1,
      profile: {
        currency: parsed.currency,
        startingBalanceCents: parsed.balance,
        asOfDate: parsed.date,
        setAsideCents: parsed.setAside,
        onboardingComplete: true,
        demo: false,
        createdAt: now,
        updatedAt: now,
      },
      items: [],
      reminder: emptyReminder(),
      forecastSnapshot: null,
    };
  } else {
    const plan = requireModel();
    Object.assign(plan.profile, {
      currency: parsed.currency,
      startingBalanceCents: parsed.balance,
      asOfDate: parsed.date,
      setAsideCents: parsed.setAside,
    });
  }
  persist();
  formErrors = {};
  formDraft = null;
  toast = { text: creating ? "Estimate created from what you entered." : "Balance updated. Estimate refreshed." };
  say(toast.text);
  go("#/home");
}

function saveItem(form: HTMLFormElement): void {
  const values = readFields(form);
  formErrors = validateItemFields(values);
  if (Object.keys(formErrors).length) {
    render();
    say("Check the item fields.");
    return;
  }
  const plan = requireModel();
  const existing = route.id ? plan.items.find((item) => item.id === route.id) : null;
  const id = existing ? existing.id : crypto.randomUUID();
  const next = itemFromValues(values, id);
  if (existing) plan.items = plan.items.map((item) => (item.id === id ? next : item));
  else plan.items = [...plan.items, next];
  persist();
  formErrors = {};
  formDraft = null;
  toast = { text: `${next.name} saved. The estimate includes it.` };
  say(toast.text);
  go(`#/items/${encodeURIComponent(id)}`);
}

function saveReminder(form: HTMLFormElement): void {
  const plan = requireModel();
  const values = readFields(form);
  const enabled = values.enabled === "on";
  const parsed = parseAmountToCents(values.threshold || "", { allowZero: true });
  formErrors = {};
  if (enabled && !parsed.ok) {
    formErrors.threshold = parsed.message;
    render();
    say("Enter the alert amount.");
    return;
  }
  if (!enabled && values.threshold && !parsed.ok) {
    formErrors.threshold = parsed.message;
    render();
    return;
  }
  plan.reminder = {
    enabled,
    thresholdCents: parsed.ok ? parsed.cents : null,
  };
  if (enabled && plan.reminder.thresholdCents == null) {
    formErrors.threshold = "Enter an amount. Use 0 to alert only when the estimate goes below zero.";
    render();
    return;
  }
  persist();
  formDraft = null;
  formErrors = {};
  toast = { text: enabled ? "Alert saved." : "In-app alert turned off." };
  say(toast.text);
  render();
}

function rememberWhatIf(values: Record<string, string>): void {
  const type = values.type ?? "";
  const category = values.category ?? "";
  whatIfDraft = {
    name: values.name ?? "",
    amount: values.amount ?? "",
    date: values.date ?? "",
    type: isItemType(type) ? type : "expense",
    category: isCategory(category) ? category : "Personal",
  };
}

function saveScenario() {
  const values = whatIfValues();
  const outcome = whatIfResult(values);
  if (!outcome.result || !outcome.scenarioItem) {
    formErrors = outcome.errors;
    render();
    return;
  }
  const plan = requireModel();
  const item: PlanItem = { ...outcome.scenarioItem, id: crypto.randomUUID() };
  delete item.scenario;
  plan.items = [...plan.items, item];
  persist();
  whatIfDraft = { name: "Optional purchase", amount: "", date: "", type: "expense", category: "Personal" };
  formDraft = null;
  toast = { text: `${item.name} added to the plan. The saved estimate now includes it.` };
  say(toast.text);
  go(`#/items/${encodeURIComponent(item.id)}`);
}

function loadSample() {
  model = buildSample(todayISO());
  persist();
  formDraft = null;
  dialog = null;
  toast = { text: "Sample data loaded. These are not your finances." };
  say(toast.text);
  go("#/home");
}

function exportData() {
  const payload = { ...model, forecastSnapshot: snapshotOf(buildForecast(realInput())) };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = el("a", { href: url, download: `moneymind-${todayISO()}.json` });
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  say("Download started. The file stays on this device.");
}

function maybeNotify(forecast: Forecast) {
  if (!model?.reminder.enabled || model.reminder.thresholdCents == null) return;
  if (route.name === "preview") return;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const dates = daysBelowThreshold(forecast, model.reminder.thresholdCents);
  if (!dates.length) return;
  const key = `${model.reminder.thresholdCents}:${dates[0]}:${model.profile.updatedAt}`;
  if (notifiedKey === key) return;
  notifiedKey = key;
  try {
    new Notification("MoneyMind estimate", {
      body: `The estimate goes below ${money(model.reminder.thresholdCents)} on ${formatLong(dates[0])}. This is not a guarantee.`,
    });
  } catch {
    /* The in-app alert remains visible even if the browser blocks the call. */
  }
}

function header() {
  const inApp = Boolean(model?.profile.onboardingComplete) && !loadProblem;
  return el("header", { class: "topbar" }, [
    el("a", { class: "brand", href: inApp ? "#/home" : "#/welcome", text: "MoneyMind" }),
    el("div", { class: "top-actions" }, [
      el("span", { class: "pill", text: "Estimate" }),
      model?.profile.demo ? el("span", { class: "pill demo", text: "Sample" }) : null,
      !online ? el("span", { class: "pill offline", text: "Offline" }) : el("span", { class: "pill", text: "On this device" }),
      inApp ? el("a", { class: "settings-link", href: "#/settings", text: "Settings" }) : el("a", { href: "#/privacy", text: "Privacy" }),
    ]),
  ]);
}

function nav() {
  const links = [
    ["#/home", "Home", "home"],
    ["#/timeline", "Timeline", "timeline"],
    ["#/what-if", "What-if", "what-if"],
    ["#/plan", "Plan", "plan"],
    ["#/settings", "Settings", "settings"],
  ];
  const current = route.name === "item" || route.name === "item-form" ? "plan" : route.name;
  return el("nav", { class: "nav", "aria-label": "Primary" }, links.map(([href, label, name]) => el("a", {
    href,
    class: name === "settings" ? "settings-link" : null,
    "aria-current": current === name ? "page" : null,
    text: label,
  })));
}

function toastView() {
  if (!toast) return el("div");
  const current = toast;
  return el("div", { class: "toast" }, [
    el("p", { text: current.text }),
    el("div", { class: "row" }, [
      current.undo ? el("button", { id: "undo", class: "button secondary", type: "button", "data-action": "undo", text: "Undo" }) : null,
      el("button", { class: "button ghost", type: "button", "data-action": "dismiss-toast", text: "Dismiss" }),
    ]),
  ]);
}

function dialogView() {
  if (!dialog) return el("div");
  const current = dialog;
  return el("div", { class: "backdrop" }, [
    el("div", { class: "dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "dialog-title" }, [
      el("h2", { id: "dialog-title", text: current.title }),
      el("p", { text: current.body }),
      el("div", { class: "row" }, [
        el("button", { class: "button secondary", type: "button", "data-action": "close-dialog", text: current.cancel || "Cancel" }),
        el("button", { class: current.danger ? "button danger" : "button primary", type: "button", "data-action": current.confirmAction, text: current.confirm }),
      ]),
    ]),
  ]);
}

function screen() {
  if (loadProblem && route.name !== "error") return viewError();
  if (route.name === "preview" && route.panel === "loading") return viewLoading();
  if (route.name === "preview" && route.panel === "error") return viewError();
  if (route.name === "error") return viewError();
  if (!model && !["welcome", "start", "how", "privacy"].includes(route.name)) return viewWelcome();
  if (route.name === "welcome") return viewWelcome();
  if (route.name === "start" || route.name === "balance") return viewBalance();
  if (route.name === "how") return viewHow();
  if (route.name === "privacy") return viewPrivacy();
  if (route.name === "timeline") return viewTimeline();
  if (route.name === "explain") return viewExplain();
  if (route.name === "item-form") return viewItemForm();
  if (route.name === "item") return viewItem();
  if (route.name === "plan") return viewPlan();
  if (route.name === "what-if") return viewWhatIf();
  if (route.name === "reminders") return viewReminders();
  if (route.name === "summary") return viewSummary();
  if (route.name === "settings") return viewSettings();
  if (route.name === "preview" && route.panel === "empty") return viewHome();
  if (route.name === "preview" && route.panel === "offline") return viewHome();
  return viewHome();
}

function render() {
  const openForm = document.querySelector("form[data-form]");
  if (openForm instanceof HTMLFormElement) capture(openForm);
  route = parseRoute();
  const known = new Set(["welcome", "start", "balance", "home", "timeline", "explain", "item-form", "item", "plan", "what-if", "reminders", "summary", "settings", "how", "privacy", "error", "preview"]);
  if (!known.has(route.name)) route = { name: model ? "home" : "welcome" };
  if (loadProblem && route.name !== "error") {
    if (location.hash !== "#/error") {
      location.hash = "#/error";
      return;
    }
    route = { name: "error" };
  }
  if (!model && !["welcome", "start", "how", "privacy", "error"].includes(route.name)) {
    if (location.hash !== "#/welcome") {
      location.hash = "#/welcome";
      return;
    }
  }
  if (model && route.name === "start") {
    if (location.hash !== "#/balance") {
      location.hash = "#/balance";
      return;
    }
  }
  const inApp = Boolean(model) && !loadProblem && !["welcome", "start", "balance", "how", "privacy", "error"].includes(route.name) && !(route.name === "preview" && route.panel === "error");
  const showNav = inApp && !(route.name === "preview" && route.panel === "loading");
  const node = screen();
  document.title = `${pageTitle} · MoneyMind`;
  const shell = el("div", { class: showNav ? "app-shell has-nav" : "app-shell no-nav" }, [
    header(),
    el("main", { id: "main", class: "main", tabindex: "-1" }, [node]),
    showNav ? nav() : null,
    toast ? toastView() : null,
    dialog ? dialogView() : null,
  ]);
  app.replaceChildren(shell);
  if (dialog) {
    const focusTarget = document.querySelector("[role=dialog] button");
    if (focusTarget instanceof HTMLElement) focusTarget.focus();
  }
  else if (toast?.undo) document.getElementById("undo")?.focus();
  else if (document.activeElement === document.body) document.getElementById("main")?.focus();
  if (model && showNav && route.name === "home") maybeNotify(currentForecast());
}

function onSubmit(event: Event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.dataset.form) return;
  event.preventDefault();
  capture(form);
  if (form.dataset.form === "balance") saveBalance(form);
  if (form.dataset.form === "item") saveItem(form);
  if (form.dataset.form === "reminder") saveReminder(form);
}

function onInput(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const form = target.closest("form");
  if (!(form instanceof HTMLFormElement) || !form.dataset.live) return;
  capture(form);
  const slot = document.getElementById("live-preview");
  if (!slot) return;
  const values = readFields(form);
  if (form.dataset.live === "item") slot.replaceChildren(...previewItem(values));
  if (form.dataset.live === "what-if") {
    rememberWhatIf(values);
    const outcome = whatIfResult(values);
    const plan = requireModel();
    const outside = Boolean(outcome.result && (values.date < plan.profile.asOfDate || values.date > addDays(plan.profile.asOfDate, 29)));
    slot.replaceChildren(...renderWhatIfPreview(outcome, outside).filter((node): node is HTMLElement => node instanceof HTMLElement));
    const saveButton = form.querySelector("[data-action=save-scenario]");
    if (saveButton instanceof HTMLButtonElement) saveButton.disabled = !outcome.result;
  }
}

function onClick(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest("[data-action]");
  if (!(button instanceof HTMLElement)) return;
  const action = button.dataset.action;
  if (action === "dismiss-toast") {
    toast = null;
    render();
  }
  if (action === "close-dialog") {
    dialog = null;
    render();
  }
  if (action === "use-sample") {
    if (model?.profile.onboardingComplete) {
      dialog = {
        title: "Replace this plan with sample data?",
        body: "Sample figures will replace the balance and items saved in this browser. You can delete them later.",
        confirm: "Load sample data",
        confirmAction: "confirm-sample",
        danger: true,
      };
      render();
    } else loadSample();
  }
  if (action === "confirm-sample") loadSample();
  if (action === "clear-sample") {
    dialog = {
      title: "Remove sample data?",
      body: "This deletes the sample balance and items stored in this browser.",
      confirm: "Remove sample data",
      confirmAction: "confirm-clear-sample",
      danger: true,
    };
    render();
  }
  if (action === "confirm-clear-sample") {
    store.clear();
    model = null;
    dialog = null;
    toast = null;
    say("Sample data removed.");
    go("#/welcome");
  }
  if (action === "delete-item") {
    const item = requireModel().items.find((entry) => entry.id === button.dataset.id);
    if (!item) return;
    dialog = {
      title: `Delete ${item.name}?`,
      body: "The 30-day estimate will update. You can undo this once, until you save something else.",
      confirm: "Delete item",
      confirmAction: "confirm-delete-item",
      danger: true,
      id: item.id,
    };
    render();
  }
  if (action === "confirm-delete-item") {
    const plan = requireModel();
    const pending = dialog;
    if (!pending?.id) return;
    const item = plan.items.find((entry) => entry.id === pending.id);
    if (!item) return;
    plan.items = plan.items.filter((entry) => entry.id !== pending.id);
    undoItem = item;
    dialog = null;
    persist();
    toast = { text: `${item.name} deleted. Estimate updated.`, undo: true };
    say(toast.text);
    go("#/plan");
  }
  if (action === "undo") {
    if (undoItem) {
      const plan = requireModel();
      plan.items = [...plan.items, undoItem];
      const name = undoItem.name;
      undoItem = null;
      persist();
      toast = { text: `${name} restored. Estimate updated.` };
      say(toast.text);
      render();
    }
  }
  if (action === "delete-all" || action === "erase-corrupt") {
    dialog = {
      title: "Delete everything stored in this browser?",
      body: "Balance, items, the alert, and the saved estimate snapshot will be removed from this device. This cannot be undone.",
      confirm: "Delete all data",
      confirmAction: "confirm-delete-all",
      danger: true,
    };
    render();
  }
  if (action === "confirm-delete-all") {
    try {
      store.clear();
    } catch {
      say("MoneyMind could not clear storage in this browser.");
    }
    model = null;
    loadProblem = null;
    dialog = null;
    toast = null;
    undoItem = null;
    say("Saved MoneyMind data was deleted from this browser.");
    go("#/welcome");
  }
  if (action === "export-data") exportData();
  if (action === "download-raw" && loadProblem?.raw != null) {
    const blob = new Blob([loadProblem.raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = el("a", { href: url, download: "moneymind-unreadable.json" });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    say("Saved text downloaded.");
  }
  if (action === "discard-what-if") {
    dialog = {
      title: "Discard this scenario?",
      body: "It is not part of the saved plan. Discarding clears the fields.",
      confirm: "Discard scenario",
      confirmAction: "confirm-discard-what-if",
      danger: false,
    };
    render();
  }
  if (action === "confirm-discard-what-if") {
    whatIfDraft = { name: "Optional purchase", amount: "", date: model?.profile.asOfDate || "", type: "expense", category: "Personal" };
    formDraft = null;
    formErrors = {};
    dialog = null;
    say("Scenario discarded. The saved estimate is unchanged.");
    render();
  }
  if (action === "save-scenario") saveScenario();
  if (action === "request-notifications") requestNotifications();
}

async function requestNotifications() {
  if (typeof Notification === "undefined") {
    toast = { text: "This browser does not offer device notifications. The in-app alert still works." };
    render();
    return;
  }
  try {
    const result = await Notification.requestPermission();
    toast = {
      text: result === "granted"
        ? "Device notifications are allowed while this page is open."
        : "Notifications stay blocked. The in-app alert still works.",
    };
  } catch {
    toast = { text: "MoneyMind could not request notification permission. The in-app alert still works." };
  }
  say(toast.text);
  render();
}

document.addEventListener("keydown", (event) => {
  if (!dialog) return;
  if (event.key === "Escape") {
    dialog = null;
    render();
    return;
  }
  if (event.key !== "Tab") return;
  const root = document.querySelector("[role=dialog]");
  if (!root) return;
  const items = [...root.querySelectorAll("button, a, input, select, textarea")].filter((node): node is HTMLElement => node instanceof HTMLElement);
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

app.addEventListener("submit", onSubmit);
app.addEventListener("input", onInput);
app.addEventListener("change", onInput);
app.addEventListener("click", onClick);
window.addEventListener("hashchange", render);
window.addEventListener("online", () => {
  online = true;
  render();
});
window.addEventListener("offline", () => {
  online = false;
  render();
});

function boot() {
  try {
    const params = new URLSearchParams(location.search);
    const result = store.load();
    if (result.status === "invalid") {
      loadProblem = result;
      if (!location.hash) location.hash = "#/error";
    } else if (result.status === "ok") {
      model = result.data;
      if (!location.hash || location.hash === "#") location.hash = "#/home";
    } else if (!location.hash || location.hash === "#") location.hash = "#/welcome";
    if (!loadProblem && !model && params.get("sample") === "1") {
      model = buildSample(todayISO());
      persist();
      if (!location.hash || location.hash === "#") location.hash = "#/home";
    }
  } catch {
    loadProblem = {
      status: "invalid",
      data: null,
      raw: null,
      error: "This browser blocked storage. MoneyMind cannot save entries here.",
    };
    location.hash = "#/error";
  }
  render();
}

boot();
