import { addDays, todayISO } from "./dates";
import { createItem } from "./inventory";
import type { PantryItem, Unit, LocationId, DateKind } from "./types";

interface SampleSeed {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  location: LocationId;
  dateKind: DateKind;
  dayOffset: number | null;
}

const SEEDS: SampleSeed[] = [
  { name: "Spinach", quantity: 200, unit: "g", location: "fridge", dateKind: "use-by", dayOffset: 1 },
  { name: "Chicken thighs", quantity: 500, unit: "g", location: "fridge", dateKind: "use-by", dayOffset: 2 },
  { name: "Milk", quantity: 1, unit: "l", location: "fridge", dateKind: "use-by", dayOffset: 3 },
  { name: "Bread", quantity: 6, unit: "piece", location: "cupboard", dateKind: "best-before", dayOffset: 0 },
  { name: "Plain yogurt", quantity: 1, unit: "piece", location: "fridge", dateKind: "best-before", dayOffset: -1 },
  { name: "Carrots", quantity: 4, unit: "piece", location: "fridge", dateKind: "best-before", dayOffset: 12 },
  { name: "Eggs", quantity: 6, unit: "piece", location: "fridge", dateKind: "best-before", dayOffset: 9 },
  { name: "Ginger", quantity: 1, unit: "piece", location: "fridge", dateKind: "opened-on", dayOffset: -4 },
  { name: "Lemon", quantity: 1, unit: "piece", location: "fridge", dateKind: "none", dayOffset: null },
  { name: "Onion", quantity: 3, unit: "piece", location: "cupboard", dateKind: "none", dayOffset: null },
  { name: "Garlic", quantity: 1, unit: "piece", location: "cupboard", dateKind: "none", dayOffset: null },
  { name: "Rice", quantity: 1, unit: "kg", location: "cupboard", dateKind: "none", dayOffset: null },
  { name: "Canned tomatoes", quantity: 2, unit: "can", location: "cupboard", dateKind: "best-before", dayOffset: 200 },
  { name: "Chickpeas", quantity: 400, unit: "g", location: "cupboard", dateKind: "best-before", dayOffset: 300 },
  { name: "Oats", quantity: 500, unit: "g", location: "cupboard", dateKind: "best-before", dayOffset: 90 },
  { name: "Olive oil", quantity: 250, unit: "ml", location: "cupboard", dateKind: "none", dayOffset: null },
  { name: "Peas", quantity: 300, unit: "g", location: "freezer", dateKind: "best-before", dayOffset: 80 },
];

export function samplePantry(today = todayISO()): PantryItem[] {
  return SEEDS.map((seed) =>
    createItem({
      name: seed.name,
      quantity: seed.quantity,
      unit: seed.unit,
      location: seed.location,
      dateKind: seed.dateKind,
      date: seed.dayOffset == null ? null : addDays(today, seed.dayOffset),
      note: "Fictional sample item.",
    }),
  );
}

export interface SampleBarcode {
  name: string;
  quantity: number;
  unit: Unit;
  location: LocationId;
}

/** Illustrative codes only. They are not real product identifiers. */
export const SAMPLE_BARCODES: Record<string, SampleBarcode> = {
  "000000111111": { name: "Oat milk", quantity: 1, unit: "l", location: "fridge" },
  "000000222222": { name: "Canned chickpeas", quantity: 1, unit: "can", location: "cupboard" },
};
