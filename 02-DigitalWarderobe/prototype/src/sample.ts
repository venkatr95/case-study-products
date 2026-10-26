import type { Item } from "./types";

const created = "2026-10-01T09:00:00.000Z";

/**
 * Illustrative wardrobe used only so a reviewer can reach outfits
 * without photographing clothes. Not a real person's closet.
 */
export function sampleItems(): Item[] {
  const row = (
    partial: Omit<Item, "notes" | "photoDataUrl" | "archived" | "sample" | "createdAt" | "lastWorn"> & {
      notes?: string;
      lastWorn?: string | null;
    },
  ): Item => ({
    ...partial,
    notes: partial.notes ?? "",
    lastWorn: partial.lastWorn ?? null,
    photoDataUrl: null,
    archived: false,
    sample: true,
    createdAt: created,
  });

  return [
    row({
      id: "sample-oxford",
      name: "Ivory oxford shirt",
      category: "top",
      color: "white",
      season: "all",
      formality: "smart",
      price: 45,
      wearCount: 6,
      lastWorn: "2026-09-02",
    }),
    row({
      id: "sample-merino",
      name: "Navy merino knit",
      category: "top",
      color: "navy",
      season: "autumn",
      formality: "smart",
      price: 68,
      wearCount: 4,
      lastWorn: "2026-09-12",
    }),
    row({
      id: "sample-tee",
      name: "Black tee",
      category: "top",
      color: "black",
      season: "all",
      formality: "casual",
      price: 18,
      wearCount: 12,
      lastWorn: "2026-09-20",
    }),
    row({
      id: "sample-jacket",
      name: "Olive chore jacket",
      category: "outerwear",
      color: "green",
      season: "autumn",
      formality: "casual",
      price: null,
      wearCount: 2,
      notes: "Price was not entered. Cost per wear stays hidden until it is.",
      lastWorn: "2026-09-18",
    }),
    row({
      id: "sample-trousers",
      name: "Charcoal wool trousers",
      category: "bottom",
      color: "grey",
      season: "winter",
      formality: "smart",
      price: 75,
      wearCount: 5,
      lastWorn: "2026-09-14",
    }),
    row({
      id: "sample-jeans",
      name: "Indigo jeans",
      category: "bottom",
      color: "blue",
      season: "all",
      formality: "casual",
      price: 55,
      wearCount: 9,
      lastWorn: "2026-09-21",
    }),
    row({
      id: "sample-chinos",
      name: "Stone chinos",
      category: "bottom",
      color: "beige",
      season: "summer",
      formality: "smart",
      price: 48,
      wearCount: 3,
      lastWorn: "2026-08-02",
    }),
    row({
      id: "sample-dress",
      name: "Black slip dress",
      category: "dress",
      color: "black",
      season: "all",
      formality: "formal",
      price: 80,
      wearCount: 1,
      lastWorn: "2026-06-11",
    }),
    row({
      id: "sample-sneakers",
      name: "White sneakers",
      category: "shoes",
      color: "white",
      season: "all",
      formality: "casual",
      price: 70,
      wearCount: 11,
      lastWorn: "2026-09-22",
    }),
    row({
      id: "sample-loafers",
      name: "Brown loafers",
      category: "shoes",
      color: "brown",
      season: "all",
      formality: "smart",
      price: 110,
      wearCount: 4,
      lastWorn: "2026-09-10",
    }),
    row({
      id: "sample-coat",
      name: "Navy overcoat",
      category: "outerwear",
      color: "navy",
      season: "winter",
      formality: "smart",
      price: 180,
      wearCount: 2,
      lastWorn: "2026-01-20",
    }),
    row({
      id: "sample-scarf",
      name: "Cream scarf",
      category: "accessory",
      color: "beige",
      season: "winter",
      formality: "smart",
      price: 22,
      wearCount: 0,
    }),
  ];
}
