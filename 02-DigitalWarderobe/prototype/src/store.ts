import { catalogPhoto, sampleItems } from "./sample";
import { hrefFor, parseHash, screenTitle } from "./route";
import type {
  AppState,
  Draft,
  Filters,
  Item,
  ItemDraft,
  Outfit,
  OutfitDraft,
  Prefs,
  Route,
  SuggestDraft,
  TripDraft,
  UploadState,
} from "./types";
import { emptyFilters } from "./filters";

const KEY = "rewear.v1";

const idleUpload = (): UploadState => ({ phase: "idle", progress: 0, message: "" });

export function defaultPrefs(): Prefs {
  return {
    onboarded: false,
    currency: "GBP",
    textScale: 100,
    skipColors: [],
    sampleBanner: false,
  };
}

export function emptyItemDraft(): ItemDraft {
  return {
    mode: "item",
    id: null,
    name: "",
    category: "top",
    color: "navy",
    season: "all",
    formality: "smart",
    notes: "",
    price: "",
    photoDataUrl: null,
    error: null,
  };
}

export function itemToDraft(item: Item): ItemDraft {
  return {
    mode: "item",
    id: item.id,
    name: item.name,
    category: item.category,
    color: item.color,
    season: item.season,
    formality: item.formality,
    notes: item.notes,
    price: item.price == null ? "" : String(item.price),
    photoDataUrl: item.photoDataUrl,
    error: null,
  };
}

export function emptyOutfitDraft(): OutfitDraft {
  return {
    mode: "outfit",
    id: null,
    name: "",
    occasion: "work",
    weather: "mild",
    itemIds: [],
    notes: "",
    source: "manual",
    factors: [],
    pickerQuery: "",
    error: null,
  };
}

export function outfitToDraft(outfit: Outfit): OutfitDraft {
  return {
    mode: "outfit",
    id: outfit.id,
    name: outfit.name,
    occasion: outfit.occasion,
    weather: outfit.weather,
    itemIds: [...outfit.itemIds],
    notes: outfit.notes,
    source: outfit.source,
    factors: [...outfit.factors],
    pickerQuery: "",
    error: null,
  };
}

export function emptyTripDraft(): TripDraft {
  return { mode: "trip", id: null, name: "", nights: "3", notes: "", outfitIds: [], error: null };
}

export function emptySuggestDraft(): SuggestDraft {
  return { mode: "suggest", occasion: "work", weather: "cold" };
}

export function freshState(): AppState {
  return {
    items: [],
    outfits: [],
    trips: [],
    prefs: defaultPrefs(),
    dismissed: [],
    filters: emptyFilters(),
    filtersOpen: false,
    route: { name: "welcome" },
    dialog: null,
    toast: null,
    announcement: "",
    upload: idleUpload(),
    draft: null,
    undo: null,
    offline: false,
  };
}

function draftFor(state: AppState, route: Route): Draft | null {
  if (route.name === "item-form") {
    if (!route.id) return emptyItemDraft();
    const item = state.items.find((entry) => entry.id === route.id);
    return item ? itemToDraft(item) : null;
  }
  if (route.name === "outfit-form") {
    if (!route.id) return emptyOutfitDraft();
    const outfit = state.outfits.find((entry) => entry.id === route.id);
    return outfit ? outfitToDraft(outfit) : null;
  }
  if (route.name === "trip-form") {
    if (!route.id) return emptyTripDraft();
    const trip = state.trips.find((entry) => entry.id === route.id);
    if (!trip) return null;
    return {
      mode: "trip",
      id: trip.id,
      name: trip.name,
      nights: String(trip.nights),
      notes: trip.notes,
      outfitIds: [...trip.outfitIds],
      error: null,
    };
  }
  if (route.name === "suggest") {
    if (state.draft?.mode === "suggest") return state.draft;
    return emptySuggestDraft();
  }
  return null;
}

let focusHeading = false;

export function consumeHeadingFocus(): boolean {
  const value = focusHeading;
  focusHeading = false;
  return value;
}

let state = freshState();
const listeners = new Set<() => void>();

export function getState(): AppState {
  return state;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function durable(current: AppState) {
  return {
    items: current.items,
    outfits: current.outfits,
    trips: current.trips,
    prefs: current.prefs,
    dismissed: current.dismissed,
    filters: current.filters,
  };
}

function persist(): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    localStorage.setItem(KEY, JSON.stringify(durable(state)));
    return null;
  } catch {
    return "This browser could not save the latest change. It may disappear if you refresh.";
  }
}

export function update(recipe: (current: AppState) => AppState, heading = false): void {
  if (heading) focusHeading = true;
  state = recipe(state);
  const error = persist();
  if (error) state = { ...state, toast: error };
  listeners.forEach((listener) => listener());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function withCatalogPhotos(items: Item[]): Item[] {
  return items.map((item) => {
    if (!item.sample) return item;
    if (typeof item.photoDataUrl === "string" && item.photoDataUrl.startsWith("data:")) return item;
    const catalog = catalogPhoto(item.id);
    if (!catalog || item.photoDataUrl === catalog) return item;
    return { ...item, photoDataUrl: catalog };
  });
}

export function hydrate(raw: unknown): AppState {
  const next = freshState();
  if (!isRecord(raw)) return next;
  if (Array.isArray(raw.items)) next.items = withCatalogPhotos(raw.items as AppState["items"]);
  if (Array.isArray(raw.outfits)) next.outfits = raw.outfits as AppState["outfits"];
  if (Array.isArray(raw.trips)) next.trips = raw.trips as AppState["trips"];
  if (Array.isArray(raw.dismissed)) next.dismissed = raw.dismissed.filter((id) => typeof id === "string");
  if (isRecord(raw.prefs)) {
    const prefs = raw.prefs;
    next.prefs = {
      ...defaultPrefs(),
      onboarded: prefs.onboarded === true,
      currency: prefs.currency === "USD" || prefs.currency === "EUR" ? prefs.currency : "GBP",
      textScale: prefs.textScale === 120 || prefs.textScale === 140 ? prefs.textScale : 100,
      skipColors: Array.isArray(prefs.skipColors) ? (prefs.skipColors as Prefs["skipColors"]) : [],
      sampleBanner: prefs.sampleBanner === true,
    };
  }
  if (isRecord(raw.filters)) {
    const filters = raw.filters as Partial<Filters>;
    next.filters = {
      query: typeof filters.query === "string" ? filters.query : "",
      categories: Array.isArray(filters.categories) ? filters.categories : [],
      colors: Array.isArray(filters.colors) ? filters.colors : [],
      seasons: Array.isArray(filters.seasons) ? filters.seasons : [],
      archivedOnly: filters.archivedOnly === true,
    };
  }
  return next;
}

export function applyRoute(route: Route, announce = true): void {
  update((current) => {
    let resolved = route;
    if (!current.prefs.onboarded && resolved.name !== "welcome" && resolved.name !== "settings") {
      resolved = { name: "welcome" };
    }
    const draft = draftFor(current, resolved);
    if (
      (resolved.name === "item-form" && resolved.id && !draft) ||
      (resolved.name === "outfit-form" && resolved.id && !draft) ||
      (resolved.name === "trip-form" && resolved.id && !draft) ||
      (resolved.name === "item" && !current.items.some((item) => item.id === resolved.id)) ||
      (resolved.name === "outfit" && !current.outfits.some((outfit) => outfit.id === resolved.id)) ||
      (resolved.name === "trip" && !current.trips.some((trip) => trip.id === resolved.id))
    ) {
      return {
        ...current,
        route: current.prefs.onboarded ? { name: "wardrobe" } : { name: "welcome" },
        draft: null,
        dialog: null,
        filtersOpen: false,
        upload: idleUpload(),
        announcement: "That page is not available.",
      };
    }
    return {
      ...current,
      route: resolved,
      draft,
      dialog: null,
      filtersOpen: false,
      upload: idleUpload(),
      announcement: announce ? screenTitle(resolved) : current.announcement,
    };
  }, true);
  const href = hrefFor(getState().route);
  if (typeof location !== "undefined" && location.hash !== href) location.hash = href;
}

export function navigate(route: Route): void {
  const href = hrefFor(route);
  if (typeof location === "undefined") {
    applyRoute(route);
    return;
  }
  if (location.hash === href) applyRoute(route);
  else location.hash = href;
}

export function boot(): void {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = hydrate(JSON.parse(raw));
    } catch {
      state = freshState();
    }
  }
  const parsed = typeof location === "undefined" ? null : parseHash(location.hash);
  const route = parsed ?? (state.prefs.onboarded ? { name: "wardrobe" as const } : { name: "welcome" as const });
  applyRoute(route, false);
}

export function replaceWithSample(current: AppState): AppState {
  return {
    ...current,
    items: sampleItems(),
    outfits: [],
    trips: [],
    dismissed: [],
    prefs: { ...current.prefs, onboarded: true, sampleBanner: true },
    dialog: null,
    undo: null,
    toast: "Sample wardrobe loaded. These 12 items are illustrative.",
  };
}
