import { categoryLabel } from "./labels";
import type { Category, Item, Outfit } from "./types";

const ORDER: Category[] = [
  "outerwear",
  "top",
  "dress",
  "bottom",
  "shoes",
  "bag",
  "accessory",
];

export interface PackingLine {
  itemId: string;
  outfitIds: string[];
  category: Category;
  /** The item is no longer in the wardrobe. */
  missing: boolean;
  name: string;
}

export interface PackingList {
  lines: PackingLine[];
  missingOutfitIds: string[];
}

/**
 * Union of items across the selected outfits.
 * The same item in several outfits becomes one line.
 */
export function consolidatePacking(
  outfitIds: string[],
  outfits: Outfit[],
  items: Item[],
): PackingList {
  const missingOutfitIds: string[] = [];
  const byItem = new Map<string, string[]>();
  for (const outfitId of outfitIds) {
    const outfit = outfits.find((entry) => entry.id === outfitId);
    if (!outfit) {
      missingOutfitIds.push(outfitId);
      continue;
    }
    for (const itemId of outfit.itemIds) {
      const list = byItem.get(itemId) ?? [];
      if (!list.includes(outfitId)) list.push(outfitId);
      byItem.set(itemId, list);
    }
  }

  const lines: PackingLine[] = [...byItem.entries()].map(([itemId, usedIn]) => {
    const item = items.find((entry) => entry.id === itemId);
    return {
      itemId,
      outfitIds: usedIn,
      category: item?.category ?? "accessory",
      missing: !item,
      name: item?.name ?? "Removed item",
    };
  });

  lines.sort((a, b) => {
    const category = ORDER.indexOf(a.category) - ORDER.indexOf(b.category);
    if (category !== 0) return category;
    return a.name.localeCompare(b.name) || a.itemId.localeCompare(b.itemId);
  });

  return { lines, missingOutfitIds };
}

export function packingSummary(line: PackingLine, outfits: Outfit[]): string {
  if (line.missing) return "This item was removed from the wardrobe.";
  if (line.outfitIds.length <= 1) {
    const outfit = outfits.find((entry) => entry.id === line.outfitIds[0]);
    return outfit ? `In ${outfit.name}` : "In 1 outfit";
  }
  const names = line.outfitIds
    .map((id) => outfits.find((entry) => entry.id === id)?.name ?? "Untitled outfit")
    .join(" and ");
  return `In ${line.outfitIds.length} outfits: ${names}`;
}

export function categoryHeading(category: Category): string {
  return categoryLabel[category];
}
