import { isCurrencyCode, type CurrencyCode } from "./model.ts";

const MAX_CENTS = 10_000_000_000;

export type AmountResult = { ok: true; cents: number } | { ok: false; message: string };

export interface AmountOptions {
  allowZero?: boolean;
  allowNegative?: boolean;
}

/**
 * Parse a user-typed amount into integer cents.
 * Commas and a leading currency symbol are ignored. Partial cents are rejected.
 */
export function parseAmountToCents(raw: string, options: AmountOptions = {}): AmountResult {
  const allowZero = options.allowZero ?? false;
  const allowNegative = options.allowNegative ?? false;
  if (typeof raw !== "string") {
    return { ok: false, message: "Enter an amount using numbers, such as 25.00." };
  }
  let source = raw.trim().replace(/[$,\s]/g, "");
  if (!source) {
    return { ok: false, message: "Enter an amount using numbers, such as 25.00." };
  }
  let sign = 1;
  if (source.startsWith("-")) {
    if (!allowNegative) {
      return {
        ok: false,
        message: "Enter an amount greater than 0. Choose income or expense for the direction.",
      };
    }
    sign = -1;
    source = source.slice(1);
  }
  if (source.startsWith("+")) source = source.slice(1);
  if (!/^\d+(\.\d{1,2})?$/.test(source)) {
    return { ok: false, message: "Use dollars and up to two cents, such as 25.00." };
  }
  const [whole, fraction = ""] = source.split(".");
  if (whole.length > 8) {
    return { ok: false, message: "Enter an amount under 100,000,000." };
  }
  const centsAbs = Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
  if (!Number.isSafeInteger(centsAbs) || centsAbs >= MAX_CENTS) {
    return { ok: false, message: "Enter an amount under 100,000,000." };
  }
  const cents = sign * centsAbs;
  if (cents === 0 && !allowZero) {
    return { ok: false, message: "Enter an amount greater than 0, such as 25.00." };
  }
  return { ok: true, cents };
}

export function formatMoney(cents: number, currency: CurrencyCode | string = "USD"): string {
  if (!Number.isInteger(cents)) return "";
  const amount = cents / 100;
  const code = isCurrencyCode(currency) ? currency : "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
  }).format(amount);
}

export function centsToInput(cents: number): string {
  if (!Number.isInteger(cents)) return "";
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

export const CURRENCIES: ReadonlyArray<{ code: CurrencyCode; label: string }> = [
  { code: "USD", label: "USD — US dollar" },
  { code: "CAD", label: "CAD — Canadian dollar" },
  { code: "GBP", label: "GBP — British pound" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "AUD", label: "AUD — Australian dollar" },
];
