import { classifyItem } from "./dates";
import type { Attention, LocationId, PantryItem, Unit } from "./types";
import { UNIT_LABEL, UNITS } from "./units";

export function esc(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function locationLabel(location: LocationId): string {
  switch (location) {
    case "fridge":
      return "Fridge";
    case "freezer":
      return "Freezer";
    case "cupboard":
      return "Cupboard";
    case "other":
      return "Other";
    default: {
      const neverLocation: never = location;
      return neverLocation;
    }
  }
}

export function statusChip(attention: Attention): string {
  return `<span class="status status-${attention.kind}"><span class="mark" aria-hidden="true"></span>${esc(attention.label)}</span>`;
}

export function itemChip(item: PantryItem, today: string, leadDays: number): string {
  return statusChip(classifyItem(item, today, leadDays));
}

export function unitOptions(selected: Unit | ""): string {
  const blank = `<option value=""${selected === "" ? " selected" : ""}>No unit</option>`;
  const rest = UNITS.map(
    (unit) => `<option value="${unit}"${unit === selected ? " selected" : ""}>${esc(UNIT_LABEL[unit])}</option>`,
  ).join("");
  return blank + rest;
}

export function locationOptions(selected: LocationId): string {
  return (["fridge", "freezer", "cupboard", "other"] as LocationId[])
    .map(
      (location) =>
        `<option value="${location}"${location === selected ? " selected" : ""}>${locationLabel(location)}</option>`,
    )
    .join("");
}

export function fieldError(id: string, message: string | undefined): string {
  if (!message) return "";
  return `<p class="field-error" id="${id}">${esc(message)}</p>`;
}
