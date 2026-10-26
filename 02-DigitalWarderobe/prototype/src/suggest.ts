import { categoryLabel, colorLabel, daysSince, occasionLabel, seasonLabel, weatherLabel } from "./labels";
import type { ColorName, Formality, Item, Occasion, Season, WeatherPref } from "./types";
import { outfitSignature } from "./wardrobe";

const NEUTRALS: ColorName[] = ["black", "white", "navy", "grey", "beige", "brown"];

export interface Suggestion {
  id: string;
  itemIds: string[];
  factors: string[];
  score: number;
}

export interface SuggestResult {
  suggestions: Suggestion[];
  gaps: string[];
}

export interface SuggestRequest {
  items: Item[];
  occasion: Occasion;
  weather: WeatherPref;
  savedSignatures: string[];
  dismissed: string[];
  skipColors: ColorName[];
  today: string;
}

export function seasonsFor(weather: WeatherPref): Season[] | "any" {
  if (weather === "rain") return "any";
  if (weather === "warm") return ["summer", "spring", "all"];
  if (weather === "mild") return ["spring", "summer", "autumn", "all"];
  return ["autumn", "winter", "all"];
}

export function formalitiesFor(occasion: Occasion): Formality[] {
  if (occasion === "active") return ["casual"];
  if (occasion === "formal") return ["formal"];
  if (occasion === "work" || occasion === "evening") return ["smart", "formal"];
  return ["casual", "smart"];
}

function seasonAllowed(item: Item, weather: WeatherPref): boolean {
  const seasons = seasonsFor(weather);
  if (seasons === "any") return true;
  return seasons.includes(item.season);
}

function eligible(items: Item[], request: SuggestRequest): Item[] {
  const formalities = formalitiesFor(request.occasion);
  return items.filter(
    (item) =>
      !item.archived &&
      !request.skipColors.includes(item.color) &&
      formalities.includes(item.formality) &&
      seasonAllowed(item, request.weather),
  );
}

function recentlyWorn(item: Item, today: string): boolean {
  if (!item.lastWorn) return false;
  const days = daysSince(item.lastWorn, today);
  return days >= 0 && days <= 3;
}

function colorScore(colors: ColorName[]): { score: number; text: string } {
  const statements = [
    ...new Set(colors.filter((color) => !NEUTRALS.includes(color) && color !== "multi")),
  ];
  if (statements.length === 0) {
    return {
      score: 2,
      text: "The palette stays in neutrals, so the pieces sit together quietly.",
    };
  }
  if (statements.length === 1) {
    return {
      score: 2,
      text: `${colorLabel[statements[0]]} is the only statement color, set against neutrals.`,
    };
  }
  const names = statements.map((color) => colorLabel[color].toLowerCase()).join(" and ");
  return {
    score: 0,
    text: `This mix uses two statement colors (${names}). Swap one if that feels loud.`,
  };
}

function pieceScore(item: Item, today: string): number {
  let score = 0;
  if (item.wearCount === 0) score += 1;
  if (recentlyWorn(item, today)) score -= 3;
  return score;
}

function best(items: Item[], today: string): Item | null {
  if (items.length === 0) return null;
  return items
    .slice()
    .sort((a, b) => {
      const delta = pieceScore(b, today) - pieceScore(a, today);
      if (delta !== 0) return delta;
      return a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
    })[0];
}

function byCategory(items: Item[], category: Item["category"]): Item[] {
  return items.filter((item) => item.category === category);
}

function describe(chosen: Item[], request: SuggestRequest, missingLayer: boolean): string[] {
  const factors: string[] = [];
  const formalities = formalitiesFor(request.occasion)
    .map((value) => value)
    .join(" or ");
  factors.push(
    `Each piece is tagged ${formalities}, which fits ${occasionLabel[request.occasion].toLowerCase()}.`,
  );
  if (request.weather === "rain") {
    factors.push(
      "Weather preference is rain. Season is not used as a filter, because rain is about a layer rather than a temperature.",
    );
  } else {
    const seasons = seasonsFor(request.weather);
    const list = (seasons === "any" ? [] : seasons).map((season) => seasonLabel[season].toLowerCase());
    factors.push(
      `Weather preference is ${weatherLabel[request.weather].toLowerCase()}, so seasons are limited to ${list.join(", ")}.`,
    );
  }
  const layer = chosen.find((item) => item.category === "outerwear");
  if (layer) {
    factors.push(`Includes ${layer.name} as an outer layer.`);
  } else if (missingLayer) {
    factors.push("No matching outer layer. Add a jacket or coat if you want cover.");
  }
  factors.push(colorScore(chosen.map((item) => item.color)).text);
  for (const item of chosen) {
    if (item.wearCount === 0) {
      factors.push(`${item.name} has no wears logged, so it is boosted into the mix.`);
    } else if (recentlyWorn(item, request.today) && item.lastWorn) {
      factors.push(
        `${item.name} was worn on ${item.lastWorn}, so this mix is ranked lower.`,
      );
    }
  }
  const categories = [...new Set(chosen.map((item) => categoryLabel[item.category]))];
  factors.push(`Built from ${categories.join(", ")}.`);
  return factors;
}

function consider(
  anchor: Item[],
  pool: Item[],
  request: SuggestRequest,
): { items: Item[]; score: number; missingLayer: boolean } | null {
  const wantLayer = request.weather === "cold" || request.weather === "rain" || request.weather === "mild";
  const layer = best(byCategory(pool, "outerwear"), request.today);
  const shoes = best(byCategory(pool, "shoes"), request.today);
  const extra = best(
    [...byCategory(pool, "accessory"), ...byCategory(pool, "bag")],
    request.today,
  );
  const chosen = [...anchor];
  if (wantLayer && layer) chosen.push(layer);
  if (!wantLayer && layer && pieceScore(layer, request.today) > 0) chosen.push(layer);
  if (shoes) chosen.push(shoes);
  if (extra && pieceScore(extra, request.today) >= 1 && !chosen.includes(extra)) chosen.push(extra);

  const missingLayer = (request.weather === "cold" || request.weather === "rain") && !layer;
  const colors = colorScore(chosen.map((item) => item.color));
  let score = colors.score + chosen.reduce((sum, item) => sum + pieceScore(item, request.today), 0);
  if (shoes) score += 3;
  if (layer && (request.weather === "cold" || request.weather === "rain")) score += 3;
  if (layer && request.weather === "mild") score += 1;
  const signature = outfitSignature(chosen.map((item) => item.id));
  if (request.savedSignatures.includes(signature) || request.dismissed.includes(signature)) {
    return null;
  }
  return { items: chosen, score, missingLayer };
}

export function suggestOutfits(request: SuggestRequest): SuggestResult {
  const pool = eligible(request.items, request);
  const tops = byCategory(pool, "top");
  const bottoms = byCategory(pool, "bottom");
  const dresses = byCategory(pool, "dress");
  const gaps: string[] = [];

  if (pool.length === 0) {
    const anyActive = request.items.some((item) => !item.archived);
    gaps.push(
      anyActive
        ? "Nothing matched that occasion and weather. Clear a skipped color, or add items tagged for it."
        : "Add items before asking for a suggestion.",
    );
    return { suggestions: [], gaps };
  }

  if (dresses.length === 0 && (tops.length === 0 || bottoms.length === 0)) {
    if (tops.length === 0 && bottoms.length === 0) {
      gaps.push("Add a dress, or a top and a bottom. Suggestions need a complete anchor.");
    } else if (tops.length === 0) {
      gaps.push("Add a top or a dress to pair with the bottoms you already have.");
    } else {
      gaps.push("Add a bottom or a dress to pair with the tops you already have.");
    }
    return { suggestions: [], gaps };
  }

  const candidates: { items: Item[]; score: number; missingLayer: boolean }[] = [];
  for (const dress of dresses) {
    const built = consider([dress], pool, request);
    if (built) candidates.push(built);
  }
  for (const top of tops) {
    for (const bottom of bottoms) {
      const built = consider([top, bottom], pool, request);
      if (built) candidates.push(built);
    }
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return outfitSignature(a.items.map((item) => item.id)).localeCompare(
      outfitSignature(b.items.map((item) => item.id)),
    );
  });

  const suggestions: Suggestion[] = [];
  const usedAnchors = new Set<string>();
  for (const candidate of candidates) {
    const anchor = candidate.items.filter((item) => item.category === "dress" || item.category === "top" || item.category === "bottom");
    const anchorKey = outfitSignature(anchor.map((item) => item.id));
    if (usedAnchors.has(anchorKey)) continue;
    usedAnchors.add(anchorKey);
    const itemIds = candidate.items.map((item) => item.id);
    suggestions.push({
      id: outfitSignature(itemIds),
      itemIds,
      factors: describe(candidate.items, request, candidate.missingLayer),
      score: candidate.score,
    });
    if (suggestions.length === 3) break;
  }

  if (suggestions.length === 0) {
    gaps.push(
      "Every combination from these tags is already saved or dismissed. Add a piece, or build an outfit by hand.",
    );
  }
  return { suggestions, gaps };
}
