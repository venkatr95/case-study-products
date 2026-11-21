import { attentionRank, classifyItem } from "./dates";
import { namesMatch, canonicalName } from "./names";
import { convertQuantity, roundCook } from "./units";
import type {
  DietSettings,
  IngredientMatch,
  MatchStatus,
  PantryItem,
  Recipe,
  RecipeIngredient,
  ShoppingDraftLine,
} from "./types";

export interface MatchOptions {
  servings: number;
  assumeStaples: boolean;
}

function scaledQuantity(ingredient: RecipeIngredient, recipeServings: number, servings: number): number | null {
  if (ingredient.quantity == null) return null;
  if (recipeServings <= 0) return ingredient.quantity;
  return roundCook(ingredient.quantity * (servings / recipeServings));
}

function sortByAttention(items: PantryItem[], today: string, leadDays: number): PantryItem[] {
  return [...items].sort((a, b) => {
    const rank = attentionRank(classifyItem(a, today, leadDays).kind) - attentionRank(classifyItem(b, today, leadDays).kind);
    if (rank !== 0) return rank;
    if (a.date && b.date) return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    return 0;
  });
}

export function matchIngredient(
  ingredient: RecipeIngredient,
  needed: number | null,
  items: PantryItem[],
  assumeStaples: boolean,
): IngredientMatch {
  const found = items.filter((item) => namesMatch(item.name, ingredient.name));

  if (found.length === 0) {
    if (ingredient.pantryStaple && assumeStaples) {
      return {
        ingredient,
        status: "staple-assumed",
        pantryItems: [],
        stillNeed: null,
        haveAmount: 0,
        reason: "Left off because salt, pepper, and water are treated as already at home.",
      };
    }
    if (ingredient.optional) {
      return {
        ingredient,
        status: "optional-missing",
        pantryItems: [],
        stillNeed: needed,
        haveAmount: 0,
        reason: "Optional, and it is not in the pantry. It stays off the list unless you add it.",
      };
    }
    return {
      ingredient,
      status: "missing",
      pantryItems: [],
      stillNeed: needed,
      haveAmount: 0,
      reason: "Not in the pantry.",
    };
  }

  if (needed == null || ingredient.unit == null) {
    return {
      ingredient,
      status: "check",
      pantryItems: found,
      stillNeed: null,
      haveAmount: null,
      reason: "The recipe does not list an amount. FreshLoop will not guess how much to buy or subtract.",
    };
  }

  let known = 0;
  let sawKnown = false;
  let unknown = false;
  for (const item of found) {
    if (item.quantity == null || item.unit == null) {
      unknown = true;
      continue;
    }
    const converted = convertQuantity(item.quantity, item.unit, ingredient.unit);
    if (converted == null) {
      unknown = true;
      continue;
    }
    known = roundCook(known + converted);
    sawKnown = true;
  }

  if (!sawKnown) {
    return {
      ingredient,
      status: "check",
      pantryItems: found,
      stillNeed: needed,
      haveAmount: null,
      reason: "A matching item has no comparable quantity. Nothing was subtracted.",
    };
  }

  if (known >= needed) {
    return {
      ingredient,
      status: "have",
      pantryItems: found,
      stillNeed: 0,
      haveAmount: known,
      reason: unknown
        ? "Items with a comparable quantity already cover the recipe. Another match had no usable quantity."
        : "The pantry covers this amount.",
    };
  }

  if (unknown) {
    return {
      ingredient,
      status: "check",
      pantryItems: found,
      stillNeed: needed,
      haveAmount: known,
      reason: "Part of the pantry amount has no quantity or a different unit. The full recipe amount stays on the list.",
    };
  }

  return {
    ingredient,
    status: "short",
    pantryItems: found,
    stillNeed: roundCook(needed - known),
    haveAmount: known,
    reason: "The pantry has some, but not the full amount. Only the gap goes on the list.",
  };
}

export function matchRecipe(
  recipe: Recipe,
  items: PantryItem[],
  options: MatchOptions,
): IngredientMatch[] {
  return recipe.ingredients.map((ingredient) =>
    matchIngredient(ingredient, scaledQuantity(ingredient, recipe.servings, options.servings), items, options.assumeStaples),
  );
}

export function includeByDefault(match: IngredientMatch): boolean {
  if (match.ingredient.optional) return false;
  return match.status === "missing" || match.status === "short" || match.status === "check";
}

export function recipeHidden(recipe: Recipe, diet: DietSettings): string | null {
  const has = (flag: Recipe["flags"][number]) => recipe.flags.includes(flag);
  if (diet.vegan && (has("meat") || has("dairy") || has("egg"))) {
    return "Hidden on your vegan filter because the ingredient list includes meat, dairy, or egg.";
  }
  if (diet.vegetarian && has("meat")) {
    return "Hidden on your vegetarian filter because the ingredient list includes meat.";
  }
  if (diet.hideDairyListed && has("dairy")) {
    return "Hidden because the ingredient list includes dairy.";
  }
  if (diet.hideGlutenListed && has("gluten")) {
    return "Hidden because the ingredient list includes gluten.";
  }
  if (diet.hideNutsListed && has("nuts")) {
    return "Hidden because the ingredient list includes nuts.";
  }
  return null;
}

export interface PlannedRecipe {
  recipe: Recipe;
  servings: number;
}

/**
 * Build one shopping draft for one or more recipes.
 * Pantry quantities are allocated once across the combined need.
 */
export function buildShoppingDraft(
  planned: PlannedRecipe[],
  items: PantryItem[],
  assumeStaples: boolean,
): ShoppingDraftLine[] {
  interface Group {
    name: string;
    ingredient: RecipeIngredient;
    needed: number | null;
    recipeIds: string[];
    optional: boolean;
    staple: boolean;
    mixedUnits: boolean;
  }

  const groups = new Map<string, Group>();
  for (const entry of planned) {
    for (const ingredient of entry.recipe.ingredients) {
      const key = canonicalName(ingredient.name);
      const need = scaledQuantity(ingredient, entry.recipe.servings, entry.servings);
      const existing = groups.get(key);
      if (!existing) {
        groups.set(key, {
          name: ingredient.name,
          ingredient,
          needed: need,
          recipeIds: [entry.recipe.id],
          optional: ingredient.optional,
          staple: ingredient.pantryStaple,
          mixedUnits: false,
        });
        continue;
      }
      existing.recipeIds.push(entry.recipe.id);
      existing.optional = existing.optional && ingredient.optional;
      existing.staple = existing.staple && ingredient.pantryStaple;
      if (existing.ingredient.unit !== ingredient.unit) existing.mixedUnits = true;
      if (existing.needed == null || need == null || existing.mixedUnits) {
        existing.needed = null;
      } else {
        existing.needed = roundCook(existing.needed + need);
      }
    }
  }

  const lines: ShoppingDraftLine[] = [];
  for (const [key, group] of groups) {
    const synthetic: RecipeIngredient = {
      ...group.ingredient,
      name: group.name,
      quantity: group.needed,
      optional: group.optional,
      pantryStaple: group.staple,
    };
    const match = matchIngredient(synthetic, group.needed, items, assumeStaples);
    const status: MatchStatus = group.mixedUnits ? "check" : match.status;
    const note = group.mixedUnits
      ? "The recipes list this ingredient in different units. FreshLoop did not combine the amounts."
      : match.reason;
    lines.push({
      key,
      name: group.name,
      quantity: status === "short" ? match.stillNeed : status === "have" || status === "staple-assumed" ? null : group.needed,
      unit: group.ingredient.unit,
      include: group.mixedUnits ? true : includeByDefault(match),
      note,
      recipeIds: [...new Set(group.recipeIds)],
      status,
    });
  }

  const order: MatchStatus[] = ["short", "missing", "check", "optional-missing", "have", "staple-assumed"];
  return lines.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.name.localeCompare(b.name));
}

export function usesAttentionItem(matches: IngredientMatch[], today: string, leadDays: number): PantryItem[] {
  const seen = new Set<string>();
  const found: PantryItem[] = [];
  for (const match of matches) {
    for (const item of sortByAttention(match.pantryItems, today, leadDays)) {
      const attention = classifyItem(item, today, leadDays).kind;
      if ((attention === "use-soon" || attention === "date-passed") && !seen.has(item.id)) {
        seen.add(item.id);
        found.push(item);
      }
    }
  }
  return found;
}
