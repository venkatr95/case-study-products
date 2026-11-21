const ALIASES: Record<string, string> = {
  garbanzo: "chickpeas",
  "garbanzo beans": "chickpeas",
  chickpea: "chickpeas",
  "spring onion": "scallion",
  "green onion": "scallion",
  scallions: "scallion",
  coriander: "cilantro",
  "tinned tomatoes": "canned tomatoes",
  "chopped tomatoes": "canned tomatoes",
  yoghurt: "yogurt",
  "plain yogurt": "yogurt",
  "plain yoghurt": "yogurt",
  "chicken thigh": "chicken thighs",
  "frozen peas": "peas",
  pea: "peas",
  peas: "peas",
};

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalName(name: string): string {
  const normalized = normalizeName(name);
  if (ALIASES[normalized]) return ALIASES[normalized];
  if (normalized.endsWith("s") && ALIASES[normalized.slice(0, -1)]) {
    return ALIASES[normalized.slice(0, -1)];
  }
  return normalized;
}

/**
 * Match names only by canonical equality or a simple plural.
 * Substring matches are intentionally rejected so "tomato" does not count as "canned tomatoes".
 */
export function namesMatch(a: string, b: string): boolean {
  const left = canonicalName(a);
  const right = canonicalName(b);
  if (!left || !right) return false;
  if (left === right) return true;
  if (left + "s" === right || right + "s" === left) return true;
  return false;
}
