export const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "bag",
  "accessory",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const COLORS = [
  "black",
  "white",
  "navy",
  "blue",
  "green",
  "brown",
  "beige",
  "grey",
  "red",
  "pink",
  "yellow",
  "purple",
  "orange",
  "multi",
] as const;
export type ColorName = (typeof COLORS)[number];

export const SEASONS = ["spring", "summer", "autumn", "winter", "all"] as const;
export type Season = (typeof SEASONS)[number];

export const FORMALITIES = ["casual", "smart", "formal"] as const;
export type Formality = (typeof FORMALITIES)[number];

export const OCCASIONS = [
  "everyday",
  "work",
  "evening",
  "travel",
  "active",
  "formal",
] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const WEATHERS = ["mild", "warm", "cold", "rain"] as const;
export type WeatherPref = (typeof WEATHERS)[number];

export const CURRENCIES = ["GBP", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface Item {
  id: string;
  name: string;
  category: Category;
  color: ColorName;
  season: Season;
  formality: Formality;
  notes: string;
  /** Amount as entered. Null means the wearer did not provide a price. */
  price: number | null;
  wearCount: number;
  /** Local calendar date YYYY-MM-DD, or null if never logged. */
  lastWorn: string | null;
  photoDataUrl: string | null;
  archived: boolean;
  /** True for the illustrative sample wardrobe, never for items the user adds. */
  sample: boolean;
  createdAt: string;
}

export interface Outfit {
  id: string;
  name: string;
  occasion: Occasion;
  weather: WeatherPref;
  itemIds: string[];
  notes: string;
  source: "manual" | "suggestion";
  factors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  name: string;
  nights: number;
  notes: string;
  outfitIds: string[];
  packedItemIds: string[];
  createdAt: string;
}

export interface Prefs {
  onboarded: boolean;
  currency: Currency;
  textScale: 100 | 120 | 140;
  skipColors: ColorName[];
  sampleBanner: boolean;
}

export interface Filters {
  query: string;
  categories: Category[];
  colors: ColorName[];
  seasons: Season[];
  /** When true, the wardrobe shows archived items instead of active ones. */
  archivedOnly: boolean;
}

export type Route =
  | { name: "welcome" }
  | { name: "wardrobe" }
  | { name: "item-form"; id: string | null }
  | { name: "item"; id: string }
  | { name: "outfits" }
  | { name: "outfit-form"; id: string | null }
  | { name: "outfit"; id: string }
  | { name: "suggest" }
  | { name: "trips" }
  | { name: "trip-form"; id: string | null }
  | { name: "trip"; id: string }
  | { name: "settings" };

export interface ItemDraft {
  mode: "item";
  id: string | null;
  name: string;
  category: Category;
  color: ColorName;
  season: Season;
  formality: Formality;
  notes: string;
  price: string;
  photoDataUrl: string | null;
  error: string | null;
}

export interface OutfitDraft {
  mode: "outfit";
  id: string | null;
  name: string;
  occasion: Occasion;
  weather: WeatherPref;
  itemIds: string[];
  notes: string;
  source: "manual" | "suggestion";
  factors: string[];
  pickerQuery: string;
  error: string | null;
}

export interface TripDraft {
  mode: "trip";
  id: string | null;
  name: string;
  nights: string;
  notes: string;
  outfitIds: string[];
  error: string | null;
}

export interface SuggestDraft {
  mode: "suggest";
  occasion: Occasion;
  weather: WeatherPref;
}

export type Draft = ItemDraft | OutfitDraft | TripDraft | SuggestDraft;

export interface UploadState {
  phase: "idle" | "reading" | "error";
  progress: number;
  message: string;
}

export type DialogState =
  | { type: "delete-item"; id: string }
  | { type: "delete-outfit"; id: string }
  | { type: "delete-trip"; id: string }
  | { type: "delete-photo"; id: string }
  | { type: "wipe" }
  | { type: "load-sample" }
  | { type: "delete-all-photos" };

export interface UndoState {
  kind: "photo";
  itemId: string;
  photo: string;
}

export interface AppState {
  items: Item[];
  outfits: Outfit[];
  trips: Trip[];
  prefs: Prefs;
  dismissed: string[];
  filters: Filters;
  filtersOpen: boolean;
  route: Route;
  dialog: DialogState | null;
  toast: string | null;
  announcement: string;
  upload: UploadState;
  draft: Draft | null;
  undo: UndoState | null;
  offline: boolean;
}
