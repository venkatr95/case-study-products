import type { Filters, Item } from "./types";

/** Groups combine with AND. Values inside a group combine with OR. */
export function matchItems(items: Item[], filters: Filters): Item[] {
  const query = filters.query.trim().toLowerCase();
  return items
    .filter((item) => {
      if (filters.archivedOnly !== item.archived) return false;
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }
      if (filters.colors.length > 0 && !filters.colors.includes(item.color)) return false;
      if (filters.seasons.length > 0 && !filters.seasons.includes(item.season)) return false;
      if (!query) return true;
      const haystack = [
        item.name,
        item.notes,
        item.category,
        item.color,
        item.season,
        item.formality,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    })
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.categories.length > 0 ||
    filters.colors.length > 0 ||
    filters.seasons.length > 0 ||
    filters.archivedOnly
  );
}

export const emptyFilters = (): Filters => ({
  query: "",
  categories: [],
  colors: [],
  seasons: [],
  archivedOnly: false,
});
