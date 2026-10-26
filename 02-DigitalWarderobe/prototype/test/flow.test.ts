import { describe, expect, it } from "vitest";
import { perform, updateField } from "../src/actions";
import { consolidatePacking } from "../src/packing";
import { getState, update } from "../src/store";
import { renderApp } from "../src/ui/render";

function control(attrs: Record<string, string> = {}, value = "", checked = false): HTMLInputElement {
  return {
    getAttribute: (name: string) => attrs[name] ?? null,
    value,
    checked,
  } as unknown as HTMLInputElement;
}

describe("primary wardrobe journey", () => {
  it("loads the sample, saves an outfit, edits an item, and consolidates a packing list", () => {
    perform("confirm-wipe", control());
    perform("start-sample", control());
    let state = getState();
    expect(state.items).toHaveLength(12);
    expect(state.prefs.onboarded).toBe(true);
    expect(state.route.name).toBe("wardrobe");

    updateField("query", control({}, "navy"));
    state = getState();
    expect(state.filters.query).toBe("navy");
    expect(state.announcement).toMatch(/2 items match/);

    update((current) => ({
      ...current,
      draft: {
        mode: "outfit",
        id: null,
        name: "Office day",
        occasion: "work",
        weather: "cold",
        itemIds: ["sample-merino", "sample-trousers", "sample-loafers"],
        notes: "",
        source: "manual",
        factors: [],
        pickerQuery: "",
        error: null,
      },
    }));
    perform("save-outfit", control());
    state = getState();
    expect(state.outfits).toHaveLength(1);
    expect(state.outfits[0].itemIds).toContain("sample-loafers");
    expect(state.route.name).toBe("outfit");

    update((current) => ({
      ...current,
      route: { name: "item-form", id: "sample-merino" },
      draft: {
        mode: "item",
        id: "sample-merino",
        name: "Navy merino knit, mended",
        category: "top",
        color: "navy",
        season: "autumn",
        formality: "smart",
        notes: "",
        price: "68",
        photoDataUrl: null,
        error: null,
      },
    }));
    perform("save-item", control());
    state = getState();
    const outfit = state.outfits[0];
    expect(outfit.itemIds).toContain("sample-merino");
    expect(state.items.find((item) => item.id === "sample-merino")?.name).toBe("Navy merino knit, mended");
    const detail = renderApp({ ...state, route: { name: "outfit", id: outfit.id } });
    expect(detail).toContain("Navy merino knit, mended");

    update((current) => ({ ...current, dialog: { type: "delete-item", id: "sample-merino" } }));
    perform("confirm-delete-item", control());
    state = getState();
    expect(state.items.some((item) => item.id === "sample-merino")).toBe(false);
    expect(state.outfits[0].itemIds).not.toContain("sample-merino");
    expect(state.toast).toMatch(/Removed from 1 outfit/);

    update((current) => ({
      ...current,
      outfits: [
        ...current.outfits,
        {
          id: "dinner",
          name: "Dinner",
          occasion: "evening",
          weather: "mild",
          itemIds: ["sample-dress", "sample-loafers"],
          notes: "",
          source: "manual",
          factors: [],
          createdAt: "2026-10-22T00:00:00.000Z",
          updatedAt: "2026-10-22T00:00:00.000Z",
        },
      ],
      draft: {
        mode: "trip",
        id: null,
        name: "Lisbon",
        nights: "4",
        notes: "City label only",
        outfitIds: [current.outfits[0].id, "dinner"],
        error: null,
      },
    }));
    perform("save-trip", control());
    state = getState();
    expect(state.route.name).toBe("trip");
    const trip = state.trips[0];
    const list = consolidatePacking(trip.outfitIds, state.outfits, state.items);
    const loafers = list.lines.filter((line) => line.itemId === "sample-loafers");
    expect(loafers).toHaveLength(1);
    expect(loafers[0].outfitIds).toHaveLength(2);
    const html = renderApp(state);
    expect(html).toContain("Shared pieces are listed once.");
    expect(html).toContain("In 2 outfits");
    expect(html).toContain("Lisbon");
  });
});
