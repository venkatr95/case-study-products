import type { Unit } from "./types";

export const UNITS: Unit[] = [
  "piece",
  "g",
  "kg",
  "ml",
  "l",
  "pack",
  "tbsp",
  "tsp",
  "cup",
  "bunch",
  "can",
];

export const UNIT_LABEL: Record<Unit, string> = {
  piece: "piece",
  g: "g",
  kg: "kg",
  ml: "ml",
  l: "L",
  pack: "pack",
  tbsp: "tbsp",
  tsp: "tsp",
  cup: "cup",
  bunch: "bunch",
  can: "can",
};

type Dimension = "mass" | "volume" | "count";

function toBase(quantity: number, unit: Unit): { dimension: Dimension; value: number } {
  switch (unit) {
    case "g":
      return { dimension: "mass", value: quantity };
    case "kg":
      return { dimension: "mass", value: quantity * 1000 };
    case "ml":
      return { dimension: "volume", value: quantity };
    case "l":
      return { dimension: "volume", value: quantity * 1000 };
    case "tsp":
      return { dimension: "volume", value: quantity * 5 };
    case "tbsp":
      return { dimension: "volume", value: quantity * 15 };
    case "cup":
      return { dimension: "volume", value: quantity * 240 };
    case "piece":
    case "pack":
    case "bunch":
    case "can":
      return { dimension: "count", value: quantity };
    default: {
      const neverUnit: never = unit;
      return neverUnit;
    }
  }
}

/** Convert a quantity between units. Count units convert only when identical. */
export function convertQuantity(quantity: number, from: Unit, to: Unit): number | null {
  const source = toBase(quantity, from);
  const target = toBase(1, to);
  if (source.dimension !== target.dimension) return null;
  if (source.dimension === "count" && from !== to) return null;
  return source.value / target.value;
}

export function formatQuantity(quantity: number | null, unit: Unit | null): string {
  if (quantity == null) return "Quantity not set";
  const rounded = Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1).replace(/\.0$/, "");
  if (!unit) return rounded;
  const label = UNIT_LABEL[unit];
  if (unit === "piece" && quantity !== 1) return `${rounded} pieces`;
  return `${rounded} ${label}`;
}

export function roundCook(value: number): number {
  return Math.round(value * 100) / 100;
}
