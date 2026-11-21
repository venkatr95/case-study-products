import { todayISO } from "./dates";
import { ensurePlan } from "./inventory";
import { samplePantry } from "./sample";
import type { DietSettings, PersistedState, ReminderSettings } from "./types";

export const STORAGE_KEY = "freshloop.v1";

export function defaultDiet(): DietSettings {
  return {
    vegetarian: false,
    vegan: false,
    hideGlutenListed: false,
    hideDairyListed: false,
    hideNutsListed: false,
  };
}

export function defaultReminders(): ReminderSettings {
  return { enabled: false, permission: "unknown", leadDays: 3 };
}

export function blankState(): PersistedState {
  return {
    version: 1,
    onboarded: false,
    demo: false,
    kitchenName: "My kitchen",
    items: [],
    reminders: defaultReminders(),
    diet: defaultDiet(),
    assumeStaples: true,
    shop: [],
    plan: ensurePlan([]),
  };
}

export function sampleState(now = new Date()): PersistedState {
  return {
    ...blankState(),
    onboarded: true,
    demo: true,
    kitchenName: "Sample kitchen",
    items: samplePantry(todayISO(now)),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseState(raw: string): PersistedState | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.items)) return null;
    const base = blankState();
    const next: PersistedState = {
      ...base,
      ...value,
      version: 1,
      reminders: { ...base.reminders, ...(isRecord(value.reminders) ? value.reminders : {}) },
      diet: { ...base.diet, ...(isRecord(value.diet) ? value.diet : {}) },
      items: value.items as PersistedState["items"],
      shop: Array.isArray(value.shop) ? (value.shop as PersistedState["shop"]) : [],
      plan: ensurePlan(Array.isArray(value.plan) ? (value.plan as PersistedState["plan"]) : []),
    };
    if (typeof next.kitchenName !== "string" || next.kitchenName.trim() === "") {
      next.kitchenName = "My kitchen";
    }
    if (![1, 2, 3, 7].includes(next.reminders.leadDays)) next.reminders.leadDays = 3;
    return next;
  } catch {
    return null;
  }
}

export interface Loaded {
  state: PersistedState;
  corruptRaw: string | null;
}

export function loadState(storage: Pick<Storage, "getItem"> | null): Loaded {
  if (!storage) return { state: blankState(), corruptRaw: null };
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: blankState(), corruptRaw: null };
  }
  if (!raw) return { state: blankState(), corruptRaw: null };
  const parsed = parseState(raw);
  if (!parsed) return { state: blankState(), corruptRaw: raw };
  return { state: parsed, corruptRaw: null };
}

export function saveState(storage: Pick<Storage, "setItem">, state: PersistedState): string | null {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch {
    return "This browser blocked saving. The change is on screen and may disappear if you reload.";
  }
}
