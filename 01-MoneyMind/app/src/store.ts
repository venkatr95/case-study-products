import { parseISODate } from "./dates.ts";
import {
  isCategory,
  isCurrencyCode,
  isItemType,
  isRecurrence,
  type PlanItem,
  type PlanState,
  type Reminder,
} from "./model.ts";

export const STORAGE_KEY = "moneymind.v1";

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type LoadResult =
  | { status: "empty"; data: null; raw: null }
  | { status: "ok"; data: PlanState; raw: string; error: null }
  | { status: "invalid"; data: null; raw: string | null; error: string };

export function createStore(storage: KeyValueStorage) {
  return {
    load(): LoadResult {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw == null || raw === "") return { status: "empty", data: null, raw: null };
      try {
        const parsed: unknown = JSON.parse(raw);
        const error = validateState(parsed);
        if (error) return { status: "invalid", data: null, raw, error };
        return { status: "ok", data: parsed as PlanState, raw, error: null };
      } catch {
        return {
          status: "invalid",
          data: null,
          raw,
          error: "Saved data on this device could not be read.",
        };
      }
    },
    save(data: PlanState): void {
      const error = validateState(data);
      if (error) throw new Error(error);
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    clear(): void {
      storage.removeItem(STORAGE_KEY);
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

export function validateState(data: unknown): string | null {
  if (!isRecord(data)) return "Saved data is not a MoneyMind record.";
  if (data.version !== 1) return "Saved data is from an unsupported version.";
  const profile = data.profile;
  if (!isRecord(profile)) return "Saved profile is missing.";
  if (typeof profile.currency !== "string" || !isCurrencyCode(profile.currency)) {
    return "Saved currency is not supported.";
  }
  if (!isInteger(profile.startingBalanceCents)) return "Saved balance is invalid.";
  if (Math.abs(profile.startingBalanceCents) >= 10_000_000_000) return "Saved balance is out of range.";
  if (typeof profile.asOfDate !== "string" || !parseISODate(profile.asOfDate)) return "Saved balance date is invalid.";
  if (!isInteger(profile.setAsideCents) || profile.setAsideCents < 0) return "Saved set-aside is invalid.";
  if (typeof profile.demo !== "boolean") return "Saved demo flag is invalid.";
  if (typeof profile.onboardingComplete !== "boolean") return "Saved onboarding flag is invalid.";
  if (!Array.isArray(data.items)) return "Saved items are missing.";
  const ids = new Set<string>();
  for (const item of data.items) {
    const itemError = validateItem(item);
    if (itemError) return itemError;
    if (!isRecord(item) || typeof item.id !== "string") return "A saved item id is invalid.";
    if (ids.has(item.id)) return "Saved items contain a duplicate id.";
    ids.add(item.id);
  }
  const reminder = data.reminder;
  if (!isRecord(reminder)) return "Saved reminder is missing.";
  if (typeof reminder.enabled !== "boolean") return "Saved reminder is invalid.";
  if (reminder.thresholdCents !== null && (!isInteger(reminder.thresholdCents) || reminder.thresholdCents < 0)) {
    return "Saved alert amount is invalid.";
  }
  if (reminder.enabled && reminder.thresholdCents === null) return "An enabled alert needs an amount.";
  return null;
}

function validateItem(item: unknown): string | null {
  if (!isRecord(item)) return "A saved item is invalid.";
  if (typeof item.id !== "string" || !item.id || item.id.length > 80) return "A saved item id is invalid.";
  if (typeof item.name !== "string" || !item.name.trim() || item.name.trim().length > 60) {
    return "A saved item name is invalid.";
  }
  if (!isItemType(String(item.type))) return "A saved item type is invalid.";
  if (!isInteger(item.amountCents) || item.amountCents <= 0) return "A saved item amount is invalid.";
  if (typeof item.date !== "string" || !parseISODate(item.date)) return "A saved item date is invalid.";
  if (typeof item.recurrence !== "string" || !isRecurrence(item.recurrence)) return "A saved item repeat rule is invalid.";
  if (typeof item.category !== "string" || !isCategory(item.category)) return "A saved item category is invalid.";
  if (typeof item.notes !== "string" || item.notes.length > 280) return "A saved item note is invalid.";
  return null;
}

export function emptyReminder(): Reminder {
  return { enabled: false, thresholdCents: null };
}

export type { PlanItem, PlanState };
