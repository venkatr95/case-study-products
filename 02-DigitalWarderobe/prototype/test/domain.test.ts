import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { emptyFilters, matchItems } from "../src/filters";
import { contrastRatio, tokens } from "../src/tokens";
import { costPerWear } from "../src/money";
import { consolidatePacking } from "../src/packing";
import { parseHash, hrefFor } from "../src/route";
import { sampleItems } from "../src/sample";
import { suggestOutfits } from "../src/suggest";
import type { Item, Outfit } from "../src/types";
import { canSaveOutfit, removeItemFromOutfits, validateItemDraft, validateTripDraft } from "../src/wardrobe";
import { renderApp } from "../src/ui/render";
import { freshState, replaceWithSample } from "../src/store";

const today = "2026-10-22";

function item(partial: Partial<Item> & Pick<Item, "id" | "name" | "category">): Item {
  return {
    color: "navy",
    season: "all",
    formality: "smart",
    notes: "",
    price: null,
    wearCount: 0,
    lastWorn: null,
    photoDataUrl: null,
    archived: false,
    sample: false,
    createdAt: "2026-10-01T00:00:00.000Z",
    ...partial,
  };
}

describe("cost per wear", () => {
  it("hides the figure until a price and a wear exist", () => {
    expect(costPerWear(null, 3).status).toBe("need-price");
    expect(costPerWear(80, 0).status).toBe("need-wear");
    expect(costPerWear(80, 4)).toEqual({ status: "value", perWear: 20 });
  });
});

describe("filters", () => {
  const items = [
    item({ id: "a", name: "Navy knit", category: "top", color: "navy", season: "autumn" }),
    item({ id: "b", name: "Stone chinos", category: "bottom", color: "beige", season: "summer", notes: "weekend" }),
  ];

  it("combines groups with AND and values with OR", () => {
    const filters = { ...emptyFilters(), categories: ["top"], colors: ["navy"], query: "knit" };
    expect(matchItems(items, filters).map((entry) => entry.id)).toEqual(["a"]);
    expect(matchItems(items, { ...emptyFilters(), categories: ["top", "bottom"] })).toHaveLength(2);
  });

  it("can clear back to the full active wardrobe", () => {
    expect(matchItems(items, emptyFilters())).toHaveLength(2);
  });
});

describe("wardrobe edits", () => {
  it("removes a deleted item from saved outfits", () => {
    const outfits: Outfit[] = [
      {
        id: "o1",
        name: "Work",
        occasion: "work",
        weather: "cold",
        itemIds: ["knit", "trousers"],
        notes: "",
        source: "manual",
        factors: [],
        createdAt: today,
        updatedAt: today,
      },
    ];
    const removed = removeItemFromOutfits(outfits, "knit");
    expect(removed.touched).toEqual(["o1"]);
    expect(removed.outfits[0].itemIds).toEqual(["trousers"]);
  });

  it("allows two items, or a dress on its own", () => {
    const dress = item({ id: "d", name: "Slip", category: "dress" });
    const top = item({ id: "t", name: "Tee", category: "top" });
    expect(canSaveOutfit(["d"], [dress]).ok).toBe(true);
    expect(canSaveOutfit(["t"], [top]).ok).toBe(false);
    expect(canSaveOutfit(["t", "d"], [top, dress]).ok).toBe(true);
  });

  it("rejects a blank name and a nonsense price", () => {
    expect(validateItemDraft({ name: " ", price: "", notes: "" }).error).toMatch(/name/i);
    expect(validateItemDraft({ name: "Coat", price: "-2", notes: "" }).error).toMatch(/price/i);
    expect(validateItemDraft({ name: "Coat", price: "", notes: "" }).price).toBeNull();
  });
});

describe("suggestions", () => {
  const items = sampleItems();

  it("explains a cold-weather work outfit with an outer layer", () => {
    const result = suggestOutfits({
      items,
      occasion: "work",
      weather: "cold",
      savedSignatures: [],
      dismissed: [],
      skipColors: [],
      today,
    });
    expect(result.suggestions.length).toBeGreaterThan(0);
    const first = result.suggestions[0];
    expect(first.itemIds).toContain("sample-coat");
    expect(first.factors.join(" ")).toMatch(/work/i);
    expect(first.factors.join(" ")).toMatch(/cold/i);
    expect(first.itemIds).not.toContain("sample-tee");
  });

  it("keeps active outfits casual", () => {
    const result = suggestOutfits({
      items,
      occasion: "active",
      weather: "warm",
      savedSignatures: [],
      dismissed: [],
      skipColors: [],
      today,
    });
    expect(result.suggestions).toHaveLength(1);
    expect(result.suggestions[0].itemIds).toEqual(
      expect.arrayContaining(["sample-tee", "sample-jeans", "sample-sneakers"]),
    );
    expect(result.suggestions[0].itemIds).not.toContain("sample-dress");
  });

  it("asks for a bottom when the wardrobe cannot anchor an outfit", () => {
    const tops = items.filter((entry) => entry.category === "top");
    const result = suggestOutfits({
      items: tops,
      occasion: "everyday",
      weather: "mild",
      savedSignatures: [],
      dismissed: [],
      skipColors: [],
      today,
    });
    expect(result.suggestions).toHaveLength(0);
    expect(result.gaps.join(" ")).toMatch(/bottom or a dress/i);
  });

  it("leaves skipped colors out", () => {
    const result = suggestOutfits({
      items,
      occasion: "work",
      weather: "cold",
      savedSignatures: [],
      dismissed: [],
      skipColors: ["navy"],
      today,
    });
    const ids = result.suggestions.flatMap((suggestion) => suggestion.itemIds);
    expect(ids).not.toContain("sample-merino");
    expect(ids).not.toContain("sample-coat");
  });
});

describe("packing", () => {
  it("lists a shared item once and names both outfits", () => {
    const outfits: Outfit[] = [
      {
        id: "work",
        name: "Office",
        occasion: "work",
        weather: "cold",
        itemIds: ["sample-loafers", "sample-trousers"],
        notes: "",
        source: "manual",
        factors: [],
        createdAt: today,
        updatedAt: today,
      },
      {
        id: "dinner",
        name: "Dinner",
        occasion: "evening",
        weather: "mild",
        itemIds: ["sample-loafers", "sample-dress"],
        notes: "",
        source: "manual",
        factors: [],
        createdAt: today,
        updatedAt: today,
      },
    ];
    const list = consolidatePacking(["work", "dinner"], outfits, sampleItems());
    const loafers = list.lines.find((line) => line.itemId === "sample-loafers");
    expect(list.lines.filter((line) => line.itemId === "sample-loafers")).toHaveLength(1);
    expect(loafers?.outfitIds).toEqual(["work", "dinner"]);
    expect(validateTripDraft("Lisbon", "4").nights).toBe(4);
    expect(validateTripDraft("Lisbon", "0").error).toMatch(/1 to 21/);
  });
});

describe("routes", () => {
  it("round-trips the core paths", () => {
    expect(parseHash("#/items/sample-oxford/edit")).toEqual({ name: "item-form", id: "sample-oxford" });
    expect(hrefFor({ name: "trip", id: "trip 1" })).toBe("#/trips/trip%201");
    expect(parseHash("#/nope")).toBeNull();
  });
});

describe("tokens", () => {
  it("keeps text pairs at WCAG AA", () => {
    expect(contrastRatio(tokens.ink, tokens.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.ink, tokens.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.muted, tokens.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.muted, tokens.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.accentInk, tokens.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.oliveInk, tokens.olive)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.dangerInk, tokens.danger)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.ink, tokens.chip)).toBeGreaterThanOrEqual(4.5);
  });

  it("uses the same hex values in CSS", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    for (const value of Object.values(tokens)) expect(css.toLowerCase()).toContain(value.toLowerCase());
  });
});

describe("render", () => {
  it("shows the sample wardrobe and the manual path", () => {
    const state = replaceWithSample(freshState());
    state.route = { name: "wardrobe" };
    const html = renderApp(state);
    expect(html).toContain("Sample wardrobe");
    expect(html).toContain("Ivory oxford shirt");
    expect(html).toContain("Add item");
    expect(html).not.toContain("undefined");
  });

  it("explains a suggestion instead of only showing clothes", () => {
    const state = replaceWithSample(freshState());
    state.route = { name: "suggest" };
    state.draft = { mode: "suggest", occasion: "work", weather: "cold" };
    const html = renderApp(state);
    expect(html).toContain("Why this was suggested");
    expect(html).toContain("Navy overcoat");
    expect(html).toContain("Dismiss");
  });

  it("shows small catalog photos and an upload on a new outfit", () => {
    const state = replaceWithSample(freshState());
    state.prefs.onboarded = true;
    state.route = { name: "outfit-form", id: null };
    state.draft = {
      mode: "outfit",
      id: null,
      name: "",
      occasion: "work",
      weather: "mild",
      itemIds: ["sample-oxford"],
      notes: "",
      source: "manual",
      factors: [],
      pickerQuery: "",
      error: null,
    };
    const html = renderApp(state);
    expect(html).toContain("./sample/oxford.jpg");
    expect(html).toContain("./sample/coat.jpg");
    expect(html).toContain('class="item-photo-input"');
    expect(html).toContain("Upload a photo for Ivory oxford shirt");
    expect(html).not.toContain('<svg class="garment"');
  });

  it("shows the photo failure copy and the manual save", () => {
    const state = freshState();
    state.prefs.onboarded = true;
    state.route = { name: "item-form", id: null };
    state.draft = {
      mode: "item",
      id: null,
      name: "Linen shirt",
      category: "top",
      color: "white",
      season: "summer",
      formality: "smart",
      notes: "",
      price: "",
      photoDataUrl: null,
      error: null,
    };
    state.upload = {
      phase: "error",
      progress: 0,
      message: "The photo could not be saved. You can try again, or save the item without a photo.",
    };
    const html = renderApp(state);
    expect(html).toContain("Save item");
    expect(html).toContain("could not be saved");
    expect(html).toContain("does not detect");
  });
});
