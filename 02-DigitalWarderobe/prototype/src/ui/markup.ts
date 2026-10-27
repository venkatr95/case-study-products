import { colorSwatches } from "../tokens";
import type { Category, ColorName } from "../types";

export function esc(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] ?? char;
  });
}

const shapes: Record<Category, string> = {
  top: "M24 30 40 18 56 30 64 48 54 50 52 90H28L26 50 16 48Z",
  bottom: "M26 16h28l6 78H20Z",
  dress: "M30 14h20l8 16-8 4 6 64H24l6-64-8-4Z",
  outerwear: "M18 28 40 14 62 28 70 52 58 54 56 92H24L22 54 10 52Z",
  shoes: "M14 62c8-16 44-16 52 0 2 16-6 24-16 24H28C16 86 12 76 14 62Z",
  bag: "M28 36h24v48H28Z M34 36c0-10 12-10 12 0",
  accessory: "M12 48c12-16 20 16 32 0 10-12 16 8 24 0",
};

export function garment(category: Category, color: ColorName): string {
  const fill = colorSwatches[color] ?? "#8A847C";
  const stroke = color === "white" || color === "beige" ? "#B7A894" : "#1C1916";
  const strokeWidth = color === "white" || color === "beige" ? "2" : "0";
  if (category === "bag") {
    return `<svg class="garment" viewBox="0 0 80 104" aria-hidden="true"><rect width="80" height="104" fill="#F7F1EA"/><path d="M30 40h20v44H30Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/><path d="M34 40c0-8 12-8 12 0" fill="none" stroke="${fill}" stroke-width="3"/></svg>`;
  }
  if (category === "accessory") {
    return `<svg class="garment" viewBox="0 0 80 104" aria-hidden="true"><rect width="80" height="104" fill="#F7F1EA"/><path d="M10 46c14-14 18 18 32 2 12-14 16 10 28-2" fill="none" stroke="${fill}" stroke-width="8" stroke-linecap="round"/></svg>`;
  }
  if (color === "multi") {
    return `<svg class="garment" viewBox="0 0 80 104" aria-hidden="true"><rect width="80" height="104" fill="#F7F1EA"/><path d="${shapes[category]}" fill="#1E3354"/><path d="${shapes[category]}" fill="#CDB89A" clip-path="inset(0 0 0 50%)"/></svg>`;
  }
  return `<svg class="garment" viewBox="0 0 80 104" aria-hidden="true"><rect width="80" height="104" fill="#F7F1EA"/><path d="${shapes[category]}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
}

export function thumb(photo: string | null, category: Category, color: ColorName): string {
  if (photo) return `<img class="thumb" src="${esc(photo)}" alt="" />`;
  return garment(category, color);
}

export function photoOrGarment(photo: string | null, category: Category, color: ColorName, label: string): string {
  if (photo) {
    return `<img class="photo" src="${esc(photo)}" alt="${esc(label)}" />`;
  }
  return `<div class="photo-fallback">${garment(category, color)}<span class="sr-only">${esc(label)}</span></div>`;
}
