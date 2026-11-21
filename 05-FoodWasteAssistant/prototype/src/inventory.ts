import { addDays, classifyItem, todayISO } from "./dates";
import { namesMatch } from "./names";
import { convertQuantity, roundCook } from "./units";
import type { LocationId, PantryItem, PantryUpdateRow, PlanSlot, Recipe, ShoppingDraftLine, ShoppingItem, Unit } from "./types";

export function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

export interface ItemInput {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  location: LocationId;
  dateKind: PantryItem["dateKind"];
  date: string | null;
  note: string;
}

export function createItem(input: ItemInput, now = new Date()): PantryItem {
  const stamp = now.toISOString();
  return {
    id: uid(),
    name: input.name.trim(),
    quantity: input.quantity,
    unit: input.unit,
    location: input.location,
    dateKind: input.dateKind,
    date: input.dateKind === "none" ? null : input.date,
    note: input.note.trim(),
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function replaceItem(items: PantryItem[], next: PantryItem): PantryItem[] {
  return items.map((item) => (item.id === next.id ? next : item));
}

export function applyInput(existing: PantryItem, input: ItemInput): PantryItem {
  return {
    ...existing,
    name: input.name.trim(),
    quantity: input.quantity,
    unit: input.unit,
    location: input.location,
    dateKind: input.dateKind,
    date: input.dateKind === "none" ? null : input.date,
    note: input.note.trim(),
    updatedAt: new Date().toISOString(),
  };
}

export function duplicateCandidate(items: PantryItem[], name: string, location: LocationId, ignoreId?: string): PantryItem | null {
  return (
    items.find(
      (item) => item.id !== ignoreId && item.location === location && namesMatch(item.name, name),
    ) ?? null
  );
}

export function otherLocationNote(items: PantryItem[], name: string, location: LocationId, ignoreId?: string): string | null {
  const other = items.find(
    (item) => item.id !== ignoreId && item.location !== location && namesMatch(item.name, name),
  );
  if (!other) return null;
  return `You also have ${other.name} in the ${other.location}. This save will not change that item.`;
}

export function mergeQuantity(existing: PantryItem, addition: ItemInput): PantryItem | null {
  if (addition.quantity == null) return { ...existing, updatedAt: new Date().toISOString() };
  if (existing.quantity == null || existing.unit == null || addition.unit == null) return null;
  const converted = convertQuantity(addition.quantity, addition.unit, existing.unit);
  if (converted == null) return null;
  return {
    ...existing,
    quantity: roundCook(existing.quantity + converted),
    updatedAt: new Date().toISOString(),
  };
}

export function ensurePlan(plan: PlanSlot[], today = todayISO()): PlanSlot[] {
  return [0, 1, 2, 3].map((offset) => {
    const date = addDays(today, offset);
    const existing = plan.find((slot) => slot.date === date);
    return existing ?? { date, recipeId: null, servings: 2 };
  });
}

export interface CookedSkip {
  ingredient: string;
  message: string;
}

/**
 * Propose pantry changes for a cooked recipe.
 * Dated matches are consumed before undated matches. Amounts are proposals.
 */
export function proposeCookedUpdates(
  items: PantryItem[],
  recipe: Recipe,
  servings: number,
  today: string,
  leadDays: number,
): { rows: PantryUpdateRow[]; skipped: CookedSkip[] } {
  const rows: PantryUpdateRow[] = [];
  const skipped: CookedSkip[] = [];
  const used = new Set<string>();

  for (const ingredient of recipe.ingredients) {
    if (ingredient.pantryStaple) {
      skipped.push({
        ingredient: ingredient.name,
        message: `${ingredient.name} is left unchanged. Salt, pepper, and water are not subtracted automatically.`,
      });
      continue;
    }
    const needed =
      ingredient.quantity == null || recipe.servings <= 0
        ? ingredient.quantity
        : roundCook(ingredient.quantity * (servings / recipe.servings));
    const matches = items
      .filter((item) => namesMatch(item.name, ingredient.name))
      .sort((a, b) => {
        const ar = classifyItem(a, today, leadDays).kind;
        const br = classifyItem(b, today, leadDays).kind;
        const rank = (kind: string) => (kind === "date-passed" || kind === "use-soon" ? 0 : 1);
        return rank(ar) - rank(br);
      });

    if (matches.length === 0) {
      if (!ingredient.pantryStaple) {
        skipped.push({
          ingredient: ingredient.name,
          message: `${ingredient.name} is not in the pantry, so it was not changed.`,
        });
      }
      continue;
    }

    if (needed == null || ingredient.unit == null) {
      for (const item of matches) {
        if (used.has(item.id)) continue;
        used.add(item.id);
        rows.push({
          itemId: item.id,
          name: item.name,
          unit: item.unit,
          current: item.quantity,
          proposed: null,
          message: "The recipe lists no amount. Enter how much to subtract, or leave it unchanged.",
        });
      }
      continue;
    }

    let remaining = needed;
    let allocated = false;
    for (const item of matches) {
      if (remaining <= 0) break;
      if (item.quantity == null || item.unit == null) {
        if (!used.has(item.id)) {
          used.add(item.id);
          rows.push({
            itemId: item.id,
            name: item.name,
            unit: item.unit,
            current: null,
            proposed: null,
            message: "Quantity was never set. FreshLoop can remove the item or leave it. It will not invent a remainder.",
          });
        }
        continue;
      }
      const inRecipeUnit = convertQuantity(item.quantity, item.unit, ingredient.unit);
      if (inRecipeUnit == null) {
        if (!used.has(item.id)) {
          used.add(item.id);
          rows.push({
            itemId: item.id,
            name: item.name,
            unit: item.unit,
            current: item.quantity,
            proposed: null,
            message: `Units differ (${item.unit} and ${ingredient.unit}). Nothing is subtracted unless you remove the item yourself.`,
          });
        }
        continue;
      }
      const take = Math.min(inRecipeUnit, remaining);
      const subtractInItemUnit = convertQuantity(take, ingredient.unit, item.unit);
      if (subtractInItemUnit == null) continue;
      allocated = true;
      remaining = roundCook(remaining - take);
      if (used.has(item.id)) continue;
      used.add(item.id);
      rows.push({
        itemId: item.id,
        name: item.name,
        unit: item.unit,
        current: item.quantity,
        proposed: roundCook(subtractInItemUnit),
        message:
          classifyItem(item, today, leadDays).kind === "use-soon" ||
          classifyItem(item, today, leadDays).kind === "date-passed"
            ? "Proposed first because the date you entered is inside the attention window."
            : "Proposed from the amount in the pantry.",
      });
    }
    if (!allocated && remaining === needed) {
      skipped.push({
        ingredient: ingredient.name,
        message: `${ingredient.name} matched an item, but the amount could not be compared. It is listed above if a row was created.`,
      });
    }
  }

  return { rows, skipped };
}

export interface AppliedUpdate {
  itemId: string;
  /** Null removes the whole item. A number subtracts that amount in the item unit. */
  subtract: number | null;
  remove: boolean;
}

export function applyPantryUpdates(items: PantryItem[], updates: AppliedUpdate[]): PantryItem[] {
  const byId = new Map(updates.map((update) => [update.itemId, update]));
  const next: PantryItem[] = [];
  for (const item of items) {
    const update = byId.get(item.id);
    if (!update) {
      next.push(item);
      continue;
    }
    if (update.remove) continue;
    if (update.subtract == null || update.subtract <= 0) {
      next.push(item);
      continue;
    }
    if (item.quantity == null) {
      next.push(item);
      continue;
    }
    const remaining = roundCook(item.quantity - update.subtract);
    if (remaining <= 0) continue;
    next.push({ ...item, quantity: remaining, updatedAt: new Date().toISOString() });
  }
  return next;
}

export function mergeShopping(existing: ShoppingItem[], lines: ShoppingDraftLine[], sourceLabel: string): ShoppingItem[] {
  const next = existing.map((item) => ({ ...item }));
  for (const line of lines) {
    if (!line.include) continue;
    const match = next.find(
      (item) => !item.checked && namesMatch(item.name, line.name) && item.unit === line.unit,
    );
    if (!match) {
      next.push({
        id: uid(),
        name: line.name,
        quantity: line.quantity,
        unit: line.unit,
        checked: false,
        note: line.note,
        source: sourceLabel,
      });
      continue;
    }
    if (match.quantity != null && line.quantity != null) {
      match.quantity = roundCook(match.quantity + line.quantity);
      match.note = `${match.note} Combined with another line. Review the total.`.trim();
    } else {
      match.quantity = null;
      match.note = "Quantity was not set on every line, so the total was cleared instead of guessed.";
    }
    if (!match.source.includes(sourceLabel)) {
      match.source = `${match.source}; ${sourceLabel}`;
    }
  }
  return next;
}

export function shopItemsToPantry(items: PantryItem[], shop: ShoppingItem[], location: LocationId): PantryItem[] {
  const added = shop
    .filter((item) => item.checked)
    .map((item) =>
      createItem({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        location,
        dateKind: "none",
        date: null,
        note: "Added from the shopping list. No date was copied.",
      }),
    );
  return [...items, ...added];
}
