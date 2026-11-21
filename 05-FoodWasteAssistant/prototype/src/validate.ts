import { isIsoDate } from "./dates";
import type { ItemInput } from "./inventory";
import type { DateKind, LocationId, Unit } from "./types";
import { UNITS } from "./units";

export interface ItemDraft {
  name: string;
  quantity: string;
  unit: Unit | "";
  location: LocationId;
  dateKind: DateKind;
  date: string;
  note: string;
  barcode: string;
  barcodeMessage: string;
  warning: string;
  errors: Record<string, string>;
}

export function emptyDraft(): ItemDraft {
  return {
    name: "",
    quantity: "",
    unit: "",
    location: "fridge",
    dateKind: "none",
    date: "",
    note: "",
    barcode: "",
    barcodeMessage: "",
    warning: "",
    errors: {},
  };
}

export function draftFromItem(item: {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  location: LocationId;
  dateKind: DateKind;
  date: string | null;
  note: string;
}): ItemDraft {
  return {
    ...emptyDraft(),
    name: item.name,
    quantity: item.quantity == null ? "" : String(item.quantity),
    unit: item.unit ?? "",
    location: item.location,
    dateKind: item.dateKind,
    date: item.date ?? "",
    note: item.note,
  };
}

const LOCATIONS: LocationId[] = ["fridge", "freezer", "cupboard", "other"];

export function validateItemDraft(draft: ItemDraft, today: string): { errors: Record<string, string>; warning: string; value: ItemInput | null } {
  const errors: Record<string, string> = {};
  const name = draft.name.trim();
  if (!name) errors.name = "Enter a name.";
  else if (name.length > 80) errors.name = "Use 80 characters or fewer.";

  let quantity: number | null = null;
  const quantityText = draft.quantity.trim();
  if (quantityText !== "") {
    const parsed = Number(quantityText);
    if (!Number.isFinite(parsed) || parsed < 0) errors.quantity = "Enter a number, or leave quantity blank.";
    else if (parsed === 0) errors.quantity = "Zero is not stored. Leave quantity blank, or mark the item consumed.";
    else quantity = parsed;
  }

  const unit = draft.unit === "" ? null : draft.unit;
  if (unit && !UNITS.includes(unit)) errors.unit = "Choose a unit from the list.";
  if (quantity != null && !unit) errors.unit = "Choose a unit so the amount can be compared with recipes.";
  if (quantity == null && unit && !errors.quantity) errors.quantity = "Enter a quantity, or clear the unit. FreshLoop will not assume an amount.";

  if (!LOCATIONS.includes(draft.location)) errors.location = "Choose a storage location.";

  let date: string | null = null;
  let warning = "";
  if (draft.dateKind === "none") {
    date = null;
  } else if (!draft.date) {
    errors.date = "Enter the date, or choose No date.";
  } else if (!isIsoDate(draft.date)) {
    errors.date = "Enter a real calendar date.";
  } else {
    date = draft.date;
    if (draft.dateKind === "opened-on" && date > today) {
      warning = "That opened-on date is after today. You can still save it.";
    }
  }

  if (draft.note.trim().length > 200) errors.note = "Use 200 characters or fewer.";

  if (Object.keys(errors).length > 0) return { errors, warning, value: null };
  return {
    errors,
    warning,
    value: {
      name,
      quantity,
      unit,
      location: draft.location,
      dateKind: draft.dateKind,
      date,
      note: draft.note,
    },
  };
}
