import { matchItems, emptyFilters } from "./filters";
import {
  occasionLabel,
  todayISO,
  uid,
  weatherLabel,
} from "./labels";
import type { Category, ColorName, Currency, Formality, Occasion, Season, WeatherPref } from "./types";
import { getState, navigate, replaceWithSample, update, freshState } from "./store";
import {
  canSaveOutfit,
  logWear,
  removeItemFromOutfits,
  validateItemDraft,
  validateTripDraft,
} from "./wardrobe";
import { suggestOutfits } from "./suggest";
import { consolidatePacking } from "./packing";
import { outfitSignature } from "./wardrobe";

function countLine(n: number): string {
  return `${n} ${n === 1 ? "item matches" : "items match"}.`;
}

function withMatchAnnouncement<T extends { items: { archived: boolean }[] }>(
  filters: Parameters<typeof matchItems>[1],
  items: Parameters<typeof matchItems>[0],
): string {
  return countLine(matchItems(items, filters).length);
}

function controlValue(target: Element): string {
  const record = target as unknown as { value?: unknown };
  return typeof record.value === "string" ? record.value : "";
}

function controlChecked(target: Element): boolean {
  const record = target as unknown as { checked?: unknown };
  return record.checked === true;
}

export function perform(action: string, target: Element): void {
  const value = target.getAttribute("data-value") ?? controlValue(target);
  const checked = controlChecked(target);
  const id = target.getAttribute("data-id") ?? "";

  switch (action) {
    case "dismiss-toast":
      update((current) => ({ ...current, toast: null, undo: null }));
      return;
    case "dismiss-sample":
      update((current) => ({ ...current, prefs: { ...current.prefs, sampleBanner: false } }));
      return;
    case "start-sample": {
      const current = getState();
      const hasUserWork =
        current.items.some((item) => !item.sample) || current.outfits.length > 0 || current.trips.length > 0;
      if (hasUserWork) {
        update((state) => ({ ...state, dialog: { type: "load-sample" } }));
        return;
      }
      update((state) => replaceWithSample(state));
      navigate({ name: "wardrobe" });
      return;
    }
    case "start-empty":
      update((current) => ({
        ...current,
        prefs: { ...current.prefs, onboarded: true },
        toast: current.items.length > 0 ? "Your wardrobe is still here." : "Wardrobe ready. Add the first item when you want.",
        announcement: "Wardrobe",
      }));
      navigate({ name: "wardrobe" });
      return;
    case "open-filters":
      update((current) => ({ ...current, filtersOpen: true }));
      return;
    case "close-filters":
      update((current) => ({
        ...current,
        filtersOpen: false,
        announcement: withMatchAnnouncement(current.filters, current.items),
      }));
      return;
    case "clear-filters":
      update((current) => {
        const filters = emptyFilters();
        return {
          ...current,
          filters,
          announcement: withMatchAnnouncement(filters, current.items),
        };
      });
      return;
    case "toggle-category":
      toggleList("categories", value as Category);
      return;
    case "toggle-color":
      toggleList("colors", value as ColorName);
      return;
    case "toggle-season":
      toggleList("seasons", value as Season);
      return;
    case "toggle-archived":
      update((current) => {
        const filters = { ...current.filters, archivedOnly: checked };
        return { ...current, filters, announcement: withMatchAnnouncement(filters, current.items) };
      });
      return;
    case "save-item":
      saveItem();
      return;
    case "clear-draft-photo":
      update((current) =>
        current.draft?.mode === "item"
          ? { ...current, draft: { ...current.draft, photoDataUrl: null }, upload: { phase: "idle", progress: 0, message: "" } }
          : current,
      );
      return;
    case "preview-upload-failure":
      update((current) => ({
        ...current,
        upload: {
          phase: "error",
          progress: 0,
          message: "The photo could not be saved. You can try again, or save the item without a photo.",
        },
      }));
      return;
    case "mark-worn":
      update((current) => ({
        ...current,
        items: current.items.map((item) => (item.id === id ? logWear(item, todayISO()) : item)),
        toast: "Wear logged for today.",
        announcement: "Wear logged for today.",
      }));
      return;
    case "toggle-archive":
      update((current) => {
        const item = current.items.find((entry) => entry.id === id);
        return {
          ...current,
          items: current.items.map((entry) =>
            entry.id === id ? { ...entry, archived: !entry.archived } : entry,
          ),
          toast: item?.archived
            ? "Item restored to the wardrobe."
            : "Item archived. It stays in saved outfits and is hidden from new ones.",
        };
      });
      return;
    case "ask-delete-item":
      update((current) => ({ ...current, dialog: { type: "delete-item", id } }));
      return;
    case "ask-delete-photo":
      update((current) => ({ ...current, dialog: { type: "delete-photo", id } }));
      return;
    case "ask-delete-outfit":
      update((current) => ({ ...current, dialog: { type: "delete-outfit", id } }));
      return;
    case "ask-delete-trip":
      update((current) => ({ ...current, dialog: { type: "delete-trip", id } }));
      return;
    case "ask-wipe":
      update((current) => ({ ...current, dialog: { type: "wipe" } }));
      return;
    case "ask-load-sample":
      update((current) => ({ ...current, dialog: { type: "load-sample" } }));
      return;
    case "ask-delete-photos":
      update((current) => ({ ...current, dialog: { type: "delete-all-photos" } }));
      return;
    case "close-dialog":
      update((current) => ({ ...current, dialog: null }));
      return;
    case "confirm-delete-item":
      confirmDeleteItem();
      return;
    case "confirm-delete-photo":
      confirmDeletePhoto();
      return;
    case "confirm-delete-outfit":
      confirmDeleteOutfit();
      return;
    case "confirm-delete-trip":
      confirmDeleteTrip();
      return;
    case "confirm-wipe":
      update(() => ({
        ...freshState(),
        toast: "Wardrobe data deleted from this browser.",
        announcement: "Wardrobe data deleted.",
      }));
      navigate({ name: "welcome" });
      return;
    case "confirm-load-sample":
      update((current) => replaceWithSample(current));
      navigate({ name: "wardrobe" });
      return;
    case "confirm-delete-photos":
      update((current) => ({
        ...current,
        items: current.items.map((item) => ({ ...item, photoDataUrl: null })),
        dialog: null,
        undo: null,
        toast: "All photos deleted from this browser.",
        announcement: "All photos deleted.",
      }));
      return;
    case "undo":
      update((current) => {
        if (current.undo?.kind !== "photo") return { ...current, toast: null, undo: null };
        const undo = current.undo;
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === undo.itemId ? { ...item, photoDataUrl: undo.photo } : item,
          ),
          undo: null,
          toast: "Photo restored.",
          announcement: "Photo restored.",
        };
      });
      return;
    case "toggle-outfit-item":
      update((current) => {
        if (current.draft?.mode !== "outfit") return current;
        const has = current.draft.itemIds.includes(id);
        return {
          ...current,
          draft: {
            ...current.draft,
            error: null,
            itemIds: has ? current.draft.itemIds.filter((itemId) => itemId !== id) : [...current.draft.itemIds, id],
          },
        };
      });
      return;
    case "remove-outfit-item":
      update((current) =>
        current.draft?.mode === "outfit"
          ? {
              ...current,
              draft: { ...current.draft, itemIds: current.draft.itemIds.filter((itemId) => itemId !== id) },
            }
          : current,
      );
      return;
    case "save-outfit":
      saveOutfit();
      return;
    case "mark-outfit-worn":
      update((current) => {
        const outfit = current.outfits.find((entry) => entry.id === id);
        if (!outfit) return current;
        const day = todayISO();
        const ids = new Set(outfit.itemIds);
        return {
          ...current,
          items: current.items.map((item) => (ids.has(item.id) ? logWear(item, day) : item)),
          toast: "Wear logged for every item in this outfit.",
          announcement: "Outfit marked as worn today.",
        };
      });
      return;
    case "save-suggestion":
      saveSuggestion(id);
      return;
    case "dismiss-suggestion":
      update((current) => ({
        ...current,
        dismissed: current.dismissed.includes(id) ? current.dismissed : [...current.dismissed, id],
        toast: "Suggestion dismissed.",
        announcement: "Suggestion dismissed.",
      }));
      return;
    case "toggle-trip-outfit":
      update((current) => {
        if (current.draft?.mode !== "trip") return current;
        const outfitIds = checked
          ? [...new Set([...current.draft.outfitIds, id])]
          : current.draft.outfitIds.filter((outfitId) => outfitId !== id);
        return { ...current, draft: { ...current.draft, outfitIds, error: null } };
      });
      return;
    case "save-trip":
      saveTrip();
      return;
    case "toggle-packed":
      update((current) => {
        if (current.route.name !== "trip") return current;
        const tripId = current.route.id;
        return {
          ...current,
          trips: current.trips.map((trip) => {
            if (trip.id !== tripId) return trip;
            const packedItemIds = checked
              ? [...new Set([...trip.packedItemIds, id])]
              : trip.packedItemIds.filter((itemId) => itemId !== id);
            return { ...trip, packedItemIds };
          }),
        };
      });
      return;
    case "set-scale": {
      const scale = Number(value);
      if (scale !== 100 && scale !== 120 && scale !== 140) return;
      update((current) => ({
        ...current,
        prefs: { ...current.prefs, textScale: scale },
        announcement: `Text size ${scale} percent.`,
      }));
      return;
    }
    case "set-currency": {
      const currency: Currency = value === "USD" || value === "EUR" ? value : "GBP";
      update((current) => ({
        ...current,
        prefs: { ...current.prefs, currency },
        toast: "Currency symbol updated. Amounts are not converted.",
        announcement: "Currency symbol updated. Amounts are not converted.",
      }));
      return;
    }
    case "toggle-skip":
      update((current) => {
        const color = value as ColorName;
        const skipColors = current.prefs.skipColors.includes(color)
          ? current.prefs.skipColors.filter((entry) => entry !== color)
          : [...current.prefs.skipColors, color];
        return {
          ...current,
          prefs: { ...current.prefs, skipColors },
          announcement: "Suggestion colors updated.",
        };
      });
      return;
    case "replay-intro":
      update((current) => ({ ...current, prefs: { ...current.prefs, onboarded: false } }));
      navigate({ name: "welcome" });
      return;
    default:
      return;
  }
}

function toggleList(key: "categories" | "colors" | "seasons", value: Category | ColorName | Season): void {
  update((current) => {
    const list = current.filters[key] as string[];
    const next = list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
    const filters = { ...current.filters, [key]: next };
    return {
      ...current,
      filters,
      announcement: withMatchAnnouncement(filters, current.items),
    };
  });
}

export function updateField(field: string, target: Element): void {
  const value = controlValue(target);
  if (field === "query") {
    update((current) => {
      const filters = { ...current.filters, query: value };
      return { ...current, filters, announcement: withMatchAnnouncement(filters, current.items) };
    });
    return;
  }
  update((current) => {
    const draft = current.draft;
    if (!draft) return current;
    if (draft.mode === "item") {
      if (field === "name" || field === "notes" || field === "price") {
        return { ...current, draft: { ...draft, [field]: value, error: null } };
      }
      if (field === "category") return { ...current, draft: { ...draft, category: value as Category, error: null } };
      if (field === "color") return { ...current, draft: { ...draft, color: value as ColorName, error: null } };
      if (field === "season") return { ...current, draft: { ...draft, season: value as Season, error: null } };
      if (field === "formality") return { ...current, draft: { ...draft, formality: value as Formality, error: null } };
    }
    if (draft.mode === "outfit") {
      if (field === "outfit-name") return { ...current, draft: { ...draft, name: value, error: null } };
      if (field === "picker") return { ...current, draft: { ...draft, pickerQuery: value } };
      if (field === "occasion") return { ...current, draft: { ...draft, occasion: value as Occasion, error: null } };
      if (field === "weather") return { ...current, draft: { ...draft, weather: value as WeatherPref, error: null } };
    }
    if (draft.mode === "trip") {
      if (field === "trip-name") return { ...current, draft: { ...draft, name: value, error: null } };
      if (field === "nights") return { ...current, draft: { ...draft, nights: value, error: null } };
      if (field === "trip-notes") return { ...current, draft: { ...draft, notes: value, error: null } };
    }
    if (draft.mode === "suggest" && (field === "occasion" || field === "weather")) {
      return {
        ...current,
        draft: { ...draft, [field]: value },
        announcement: "Suggestions updated.",
      };
    }
    return current;
  });
}

function saveItem(): void {
  const current = getState();
  if (current.draft?.mode !== "item") return;
  if (current.upload.phase === "reading") {
    update((state) => ({
      ...state,
      toast: "Wait for the photo to finish, or remove it and save without a photo.",
    }));
    return;
  }
  const draft = current.draft;
  const validated = validateItemDraft(draft);
  if (validated.error) {
    update((state) =>
      state.draft?.mode === "item" ? { ...state, draft: { ...state.draft, error: validated.error } } : state,
    );
    return;
  }
  const id = draft.id ?? uid("item");
  update((state) => {
    const existing = state.items.find((item) => item.id === id);
    const item = {
      id,
      name: draft.name.trim(),
      category: draft.category,
      color: draft.color,
      season: draft.season,
      formality: draft.formality,
      notes: draft.notes.trim(),
      price: validated.price,
      wearCount: existing?.wearCount ?? 0,
      lastWorn: existing?.lastWorn ?? null,
      photoDataUrl: draft.photoDataUrl,
      archived: existing?.archived ?? false,
      sample: existing?.sample ?? false,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    const items = existing ? state.items.map((entry) => (entry.id === id ? item : entry)) : [item, ...state.items];
    return {
      ...state,
      items,
      toast: existing ? "Item updated. Saved outfits use this version." : "Item saved to your wardrobe.",
      announcement: existing ? "Item updated." : "Item saved.",
    };
  });
  navigate({ name: "item", id });
}

function confirmDeleteItem(): void {
  const dialog = getState().dialog;
  if (!dialog || dialog.type !== "delete-item") return;
  const item = getState().items.find((entry) => entry.id === dialog.id);
  update((current) => {
    const removed = removeItemFromOutfits(current.outfits, dialog.id);
    return {
      ...current,
      items: current.items.filter((entry) => entry.id !== dialog.id),
      outfits: removed.outfits,
      dialog: null,
      toast: `${item?.name ?? "Item"} deleted. Removed from ${removed.touched.length} ${removed.touched.length === 1 ? "outfit" : "outfits"}.`,
      announcement: "Item deleted.",
    };
  });
  navigate({ name: "wardrobe" });
}

function confirmDeletePhoto(): void {
  const dialog = getState().dialog;
  if (!dialog || dialog.type !== "delete-photo") return;
  const item = getState().items.find((entry) => entry.id === dialog.id);
  update((current) => ({
    ...current,
    items: current.items.map((entry) => (entry.id === dialog.id ? { ...entry, photoDataUrl: null } : entry)),
    dialog: null,
    undo: item?.photoDataUrl ? { kind: "photo", itemId: dialog.id, photo: item.photoDataUrl } : null,
    toast: "Photo deleted.",
    announcement: "Photo deleted.",
  }));
}

function confirmDeleteOutfit(): void {
  const dialog = getState().dialog;
  if (!dialog || dialog.type !== "delete-outfit") return;
  update((current) => ({
    ...current,
    outfits: current.outfits.filter((outfit) => outfit.id !== dialog.id),
    dialog: null,
    toast: "Outfit deleted. The items are still in your wardrobe.",
    announcement: "Outfit deleted.",
  }));
  navigate({ name: "outfits" });
}

function confirmDeleteTrip(): void {
  const dialog = getState().dialog;
  if (!dialog || dialog.type !== "delete-trip") return;
  update((current) => ({
    ...current,
    trips: current.trips.filter((trip) => trip.id !== dialog.id),
    dialog: null,
    toast: "Trip deleted.",
    announcement: "Trip deleted.",
  }));
  navigate({ name: "trips" });
}

function saveOutfit(): void {
  const current = getState();
  if (current.draft?.mode !== "outfit") return;
  const draft = current.draft;
  const check = canSaveOutfit(draft.itemIds, current.items);
  if (!check.ok) {
    update((state) => (state.draft?.mode === "outfit" ? { ...state, draft: { ...state.draft, error: check.reason } } : state));
    return;
  }
  const existing = draft.id ? current.outfits.find((outfit) => outfit.id === draft.id) : undefined;
  const itemsChanged =
    existing != null && outfitSignature(existing.itemIds) !== outfitSignature(draft.itemIds);
  const source = itemsChanged ? "manual" : draft.source;
  const factors = source === "suggestion" ? draft.factors : [];
  const name = draft.name.trim() || `${occasionLabel[draft.occasion]} · ${weatherLabel[draft.weather]}`;
  const id = draft.id ?? uid("outfit");
  const now = new Date().toISOString();
  update((state) => {
    const outfit = {
      id,
      name,
      occasion: draft.occasion,
      weather: draft.weather,
      itemIds: [...draft.itemIds],
      notes: draft.notes,
      source,
      factors,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    const outfits = existing
      ? state.outfits.map((entry) => (entry.id === id ? outfit : entry))
      : [outfit, ...state.outfits];
    return { ...state, outfits, toast: "Outfit saved.", announcement: "Outfit saved." };
  });
  navigate({ name: "outfit", id });
}

function saveSuggestion(signature: string): void {
  const current = getState();
  const draft = current.draft?.mode === "suggest" ? current.draft : { mode: "suggest" as const, occasion: "work" as const, weather: "cold" as const };
  const result = suggestOutfits({
    items: current.items,
    occasion: draft.occasion,
    weather: draft.weather,
    savedSignatures: current.outfits.map((outfit) => outfitSignature(outfit.itemIds)),
    dismissed: current.dismissed,
    skipColors: current.prefs.skipColors,
    today: todayISO(),
  });
  const suggestion = result.suggestions.find((entry) => entry.id === signature);
  if (!suggestion) {
    update((state) => ({ ...state, toast: "That suggestion is no longer available." }));
    return;
  }
  const id = uid("outfit");
  const now = new Date().toISOString();
  const name = `${occasionLabel[draft.occasion]} · ${weatherLabel[draft.weather]}`;
  update((state) => ({
    ...state,
    outfits: [
      {
        id,
        name,
        occasion: draft.occasion,
        weather: draft.weather,
        itemIds: suggestion.itemIds,
        notes: "",
        source: "suggestion",
        factors: suggestion.factors,
        createdAt: now,
        updatedAt: now,
      },
      ...state.outfits,
    ],
    toast: "Suggestion saved as an outfit.",
    announcement: "Suggestion saved.",
  }));
  navigate({ name: "outfit", id });
}

function saveTrip(): void {
  const current = getState();
  if (current.draft?.mode !== "trip") return;
  const draft = current.draft;
  if (draft.outfitIds.length === 0) {
    update((state) =>
      state.draft?.mode === "trip"
        ? { ...state, draft: { ...state.draft, error: "Select at least one outfit." } }
        : state,
    );
    return;
  }
  const validated = validateTripDraft(draft.name, draft.nights);
  if (validated.error) {
    update((state) =>
      state.draft?.mode === "trip" ? { ...state, draft: { ...state.draft, error: validated.error } } : state,
    );
    return;
  }
  const id = draft.id ?? uid("trip");
  const now = new Date().toISOString();
  update((state) => {
    const existing = state.trips.find((trip) => trip.id === id);
    const lines = consolidatePacking(draft.outfitIds, state.outfits, state.items).lines.map((line) => line.itemId);
    const still = new Set(lines);
    const trip = {
      id,
      name: draft.name.trim(),
      nights: validated.nights,
      notes: draft.notes.trim(),
      outfitIds: [...draft.outfitIds],
      packedItemIds: (existing?.packedItemIds ?? []).filter((itemId) => still.has(itemId)),
      createdAt: existing?.createdAt ?? now,
    };
    const trips = existing ? state.trips.map((entry) => (entry.id === id ? trip : entry)) : [trip, ...state.trips];
    return { ...state, trips, toast: "Packing list ready. Shared items are listed once.", announcement: "Packing list ready." };
  });
  navigate({ name: "trip", id });
}
