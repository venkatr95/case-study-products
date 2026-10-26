export type CostPerWear =
  | { status: "need-price" }
  | { status: "need-wear" }
  | { status: "value"; perWear: number };

/**
 * Cost per wear is price divided by wears.
 * Both a price and at least one logged wear are required.
 * A zero wear count is not treated as a cost.
 */
export function costPerWear(price: number | null, wearCount: number): CostPerWear {
  if (price == null || !Number.isFinite(price)) return { status: "need-price" };
  if (!Number.isInteger(wearCount) || wearCount < 1) return { status: "need-wear" };
  return { status: "value", perWear: price / wearCount };
}
