import type { Item, Outfit } from "./types";

export function removeItemFromOutfits(
  outfits: Outfit[],
  itemId: string,
): { outfits: Outfit[]; touched: string[] } {
  const touched: string[] = [];
  const next = outfits.map((outfit) => {
    if (!outfit.itemIds.includes(itemId)) return outfit;
    touched.push(outfit.id);
    return { ...outfit, itemIds: outfit.itemIds.filter((id) => id !== itemId) };
  });
  return { outfits: next, touched };
}

export function canSaveOutfit(
  itemIds: string[],
  items: Item[],
): { ok: boolean; reason: string } {
  const unique = [...new Set(itemIds)];
  if (unique.length >= 2) return { ok: true, reason: "" };
  if (unique.length === 1) {
    const item = items.find((entry) => entry.id === unique[0]);
    if (item?.category === "dress") return { ok: true, reason: "" };
  }
  return {
    ok: false,
    reason: "Select at least two items, or a single dress.",
  };
}

export function logWear(item: Item, day: string): Item {
  return { ...item, wearCount: item.wearCount + 1, lastWorn: day };
}

export function outfitSignature(itemIds: string[]): string {
  return [...itemIds].sort().join("|");
}

export interface SaveItemInput {
  name: string;
  price: string;
  notes: string;
}

export function validateItemDraft(input: SaveItemInput): { error: string | null; price: number | null } {
  const name = input.name.trim();
  if (!name) return { error: "Add a name so you can find this item later.", price: null };
  if (name.length > 60) return { error: "Use 60 characters or fewer for the name.", price: null };
  if (input.notes.trim().length > 280) {
    return { error: "Keep notes to 280 characters.", price: null };
  }
  const raw = input.price.trim();
  if (!raw) return { error: null, price: null };
  const price = Number(raw);
  if (!Number.isFinite(price) || price < 0 || price > 100_000) {
    return { error: "Enter a price from 0 to 100000, or leave it blank.", price: null };
  }
  return { error: null, price: Math.round(price * 100) / 100 };
}

export function validateTripDraft(name: string, nights: string): { error: string | null; nights: number } {
  if (!name.trim()) return { error: "Name the trip so you can find the list.", nights: 0 };
  if (name.trim().length > 60) return { error: "Use 60 characters or fewer for the trip name.", nights: 0 };
  if (!/^\d+$/.test(nights.trim())) {
    return { error: "Enter nights as a whole number from 1 to 21.", nights: 0 };
  }
  const count = Number(nights.trim());
  if (count < 1 || count > 21) {
    return { error: "Enter nights as a whole number from 1 to 21.", nights: 0 };
  }
  return { error: null, nights: count };
}
