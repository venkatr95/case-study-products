import type {
  Category,
  ColorName,
  Currency,
  Formality,
  Occasion,
  Season,
  WeatherPref,
} from "./types";

export const categoryLabel: Record<Category, string> = {
  top: "Top",
  bottom: "Bottom",
  dress: "Dress",
  outerwear: "Outerwear",
  shoes: "Shoes",
  bag: "Bag",
  accessory: "Accessory",
};

export const colorLabel: Record<ColorName, string> = {
  black: "Black",
  white: "White",
  navy: "Navy",
  blue: "Blue",
  green: "Green",
  brown: "Brown",
  beige: "Beige",
  grey: "Grey",
  red: "Red",
  pink: "Pink",
  yellow: "Yellow",
  purple: "Purple",
  orange: "Orange",
  multi: "Multi",
};

export const seasonLabel: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
  all: "All season",
};

export const formalityLabel: Record<Formality, string> = {
  casual: "Casual",
  smart: "Smart",
  formal: "Formal",
};

export const occasionLabel: Record<Occasion, string> = {
  everyday: "Everyday",
  work: "Work",
  evening: "Evening",
  travel: "Travel",
  active: "Active",
  formal: "Formal",
};

export const weatherLabel: Record<WeatherPref, string> = {
  mild: "Mild",
  warm: "Warm",
  cold: "Cold",
  rain: "Rain",
};

export const currencyLabel: Record<Currency, string> = {
  GBP: "GBP (£)",
  USD: "USD ($)",
  EUR: "EUR (€)",
};

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function displayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function uid(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}-${rand}${time}`;
}

export function daysSince(earlier: string, later: string): number {
  const a = Date.parse(`${later}T00:00:00Z`);
  const b = Date.parse(`${earlier}T00:00:00Z`);
  return Math.round((a - b) / 86_400_000);
}
