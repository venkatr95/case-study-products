import { describe, expect, it } from "vitest";
import { contrastRatio } from "../src/contrast";
import { COPY, hasSafetyVerdict } from "../src/copy";
import { addDays, classifyItem, diffDays } from "../src/dates";
import { applyPantryUpdates, duplicateCandidate, mergeQuantity, proposeCookedUpdates } from "../src/inventory";
import { buildShoppingDraft, matchRecipe, recipeHidden } from "../src/match";
import { namesMatch } from "../src/names";
import { RECIPES, recipeById } from "../src/recipes";
import { samplePantry } from "../src/sample";
import { parseState } from "../src/store";
import type { PantryItem, Recipe } from "../src/types";
import { validateItemDraft, emptyDraft } from "../src/validate";

const TODAY = "2026-10-22";

function item(partial: Partial<PantryItem> & Pick<PantryItem, "name">): PantryItem {
  return {
    id: partial.name,
    quantity: 1,
    unit: "piece",
    location: "fridge",
    dateKind: "none",
    date: null,
    note: "",
    createdAt: TODAY,
    updatedAt: TODAY,
    ...partial,
  };
}

describe("dates", () => {
  const pantry = samplePantry(TODAY);
  const byName = (name: string) => pantry.find((entry) => entry.name === name)!;

  it("classifies the sample kitchen without turning opened-on into an expiry", () => {
    expect(classifyItem(byName("Spinach"), TODAY, 3).kind).toBe("use-soon");
    expect(classifyItem(byName("Chicken thighs"), TODAY, 3).kind).toBe("use-soon");
    expect(classifyItem(byName("Milk"), TODAY, 3).kind).toBe("use-soon");
    expect(classifyItem(byName("Bread"), TODAY, 3).kind).toBe("use-soon");
    expect(classifyItem(byName("Plain yogurt"), TODAY, 3).kind).toBe("date-passed");
    expect(classifyItem(byName("Ginger"), TODAY, 3).kind).toBe("opened");
    expect(classifyItem(byName("Lemon"), TODAY, 3).kind).toBe("no-date");
    expect(classifyItem(byName("Carrots"), TODAY, 3).kind).toBe("later");
  });

  it("treats the lead-day boundary as inside the window", () => {
    const boundary = item({ name: "Milk", dateKind: "use-by", date: addDays(TODAY, 3) });
    const outside = item({ name: "Milk", dateKind: "use-by", date: addDays(TODAY, 4) });
    expect(classifyItem(boundary, TODAY, 3).kind).toBe("use-soon");
    expect(classifyItem(outside, TODAY, 3).kind).toBe("later");
    expect(diffDays(addDays(TODAY, -1), TODAY)).toBe(-1);
  });

  it("does not use a safety verdict in date explanations", () => {
    for (const entry of pantry) {
      expect(hasSafetyVerdict(classifyItem(entry, TODAY, 3).detail)).toBe(false);
    }
    for (const value of Object.values(COPY)) {
      expect(hasSafetyVerdict(value)).toBe(false);
    }
  });
});

describe("names and quantities", () => {
  it("matches aliases and rejects a loose substring", () => {
    expect(namesMatch("Plain yogurt", "Yogurt")).toBe(true);
    expect(namesMatch("Chickpea", "Chickpeas")).toBe(true);
    expect(namesMatch("Tomato", "Canned tomatoes")).toBe(false);
  });

  it("covers, shorts, and refuses a unit mismatch", () => {
    const items = samplePantry(TODAY);
    const skillet = recipeById("spinach-chickpea-skillet")!;
    const matches = matchRecipe(skillet, items, { servings: 2, assumeStaples: true });
    const byName = (name: string) => matches.find((match) => match.ingredient.name === name)!;
    expect(byName("Spinach").status).toBe("have");
    expect(byName("Salt").status).toBe("staple-assumed");
    expect(byName("Cumin").status).toBe("optional-missing");
    expect(byName("Cumin").reason).toContain("Optional");

    const yogurt = recipeById("yogurt-oat-bowl")!;
    const yogurtMatch = matchRecipe(yogurt, items, { servings: 1, assumeStaples: true }).find((match) => match.ingredient.name === "Yogurt")!;
    expect(yogurtMatch.status).toBe("check");
    expect(yogurtMatch.reason).toContain("Nothing was subtracted");
  });

  it("subtracts a shared pantry once across two dinners", () => {
    const items = samplePantry(TODAY);
    const lines = buildShoppingDraft(
      [
        { recipe: recipeById("spinach-chickpea-skillet")!, servings: 2 },
        { recipe: recipeById("lemon-chicken-tray")!, servings: 2 },
      ],
      items,
      true,
    );
    const line = (name: string) => lines.find((entry) => entry.name === name)!;
    expect(line("Lemon").status).toBe("short");
    expect(line("Lemon").quantity).toBe(1);
    expect(line("Lemon").include).toBe(true);
    expect(line("Garlic").quantity).toBe(1);
    expect(line("Spinach").status).toBe("have");
    expect(line("Spinach").include).toBe(false);
    expect(line("Salt").include).toBe(false);
    expect(line("Cumin").include).toBe(false);
  });
});

describe("inventory updates", () => {
  it("cooks the skillet by subtracting proposed amounts and removing empties", () => {
    const items = samplePantry(TODAY);
    const recipe = recipeById("spinach-chickpea-skillet")!;
    const proposal = proposeCookedUpdates(items, recipe, 2, TODAY, 3);
    const spinach = proposal.rows.find((row) => row.name === "Spinach")!;
    expect(spinach.proposed).toBe(150);
    const next = applyPantryUpdates(
      items,
      proposal.rows.map((row) => ({
        itemId: row.itemId,
        subtract: row.proposed,
        remove: false,
      })),
    );
    expect(next.find((entry) => entry.name === "Spinach")?.quantity).toBe(50);
    expect(next.find((entry) => entry.name === "Garlic")).toBeUndefined();
    expect(next.find((entry) => entry.name === "Lemon")).toBeUndefined();
    expect(next.find((entry) => entry.name === "Chickpeas")?.quantity).toBe(200);
  });

  it("flags a same-location duplicate and will not merge different units", () => {
    const items = samplePantry(TODAY);
    expect(duplicateCandidate(items, "spinach", "fridge")?.name).toBe("Spinach");
    expect(duplicateCandidate(items, "spinach", "freezer")).toBeNull();
    const yogurt = items.find((entry) => entry.name === "Plain yogurt")!;
    expect(mergeQuantity(yogurt, { name: "Yogurt", quantity: 150, unit: "g", location: "fridge", dateKind: "none", date: null, note: "" })).toBeNull();
  });
});

describe("diet filters and validation", () => {
  it("hides listed ingredients, including optional eggs, without an allergen claim", () => {
    expect(recipeHidden(recipeById("lemon-chicken-tray")!, { vegetarian: false, vegan: true, hideGlutenListed: false, hideDairyListed: false, hideNutsListed: false })).toContain("vegan");
    expect(recipeHidden(recipeById("pea-rice-skillet")!, { vegetarian: false, vegan: true, hideGlutenListed: false, hideDairyListed: false, hideNutsListed: false })).toContain("egg");
    expect(recipeHidden(recipeById("spinach-chickpea-skillet")!, { vegetarian: true, vegan: true, hideGlutenListed: false, hideDairyListed: false, hideNutsListed: false })).toBeNull();
    const nuts: Recipe = { ...recipeById("tomato-toast")!, flags: ["nuts"] };
    expect(recipeHidden(nuts, { vegetarian: false, vegan: false, hideGlutenListed: false, hideDairyListed: false, hideNutsListed: true })).toContain("nuts");
  });

  it("rejects a missing name, a zero quantity, and a unit without an amount", () => {
    expect(validateItemDraft({ ...emptyDraft(), name: "" }, TODAY).errors.name).toBe("Enter a name.");
    expect(validateItemDraft({ ...emptyDraft(), name: "Rice", quantity: "0", unit: "g" }, TODAY).errors.quantity).toContain("Zero");
    expect(validateItemDraft({ ...emptyDraft(), name: "Rice", quantity: "", unit: "g" }, TODAY).errors.quantity).toContain("will not assume");
  });
});

describe("storage", () => {
  it("returns corrupt text without parsing it into an empty pantry", () => {
    expect(parseState("{")).toBeNull();
    expect(parseState(JSON.stringify({ version: 1, items: [], onboarded: true })).onboarded).toBe(true);
  });
});

describe("contrast", () => {
  it("meets WCAG AA for the core text pairs", () => {
    const pairs: [string, string][] = [
      ["#1c2822", "#fffcf7"],
      ["#1c2822", "#f4efe6"],
      ["#24312a", "#fffcf7"],
      ["#f7fbf8", "#215c40"],
      ["#6b3208", "#f8e7d4"],
      ["#6e2b26", "#f8e6e2"],
      ["#f4efe6", "#1c2822"],
      ["#173f2c", "#fffcf7"],
    ];
    for (const [foreground, background] of pairs) {
      expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrastRatio("#0b5cab", "#f4efe6")).toBeGreaterThanOrEqual(3);
  });
});
