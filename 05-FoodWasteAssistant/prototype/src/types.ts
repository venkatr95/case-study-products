export type LocationId = "fridge" | "freezer" | "cupboard" | "other";

export type DateKind = "best-before" | "use-by" | "opened-on" | "none";

export type Unit =
  | "piece"
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "pack"
  | "tbsp"
  | "tsp"
  | "cup"
  | "bunch"
  | "can";

export type DietFlag = "meat" | "dairy" | "egg" | "gluten" | "nuts";

export type AttentionKind = "use-soon" | "date-passed" | "opened" | "no-date" | "later";

export type MatchStatus =
  | "have"
  | "short"
  | "check"
  | "missing"
  | "staple-assumed"
  | "optional-missing";

export interface PantryItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: Unit | null;
  location: LocationId;
  dateKind: DateKind;
  /** Calendar date YYYY-MM-DD. Null when dateKind is none. */
  date: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number | null;
  unit: Unit | null;
  optional: boolean;
  /** Salt, pepper, or water. Not assumed unless the setting is on. */
  pantryStaple: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  minutes: number;
  servings: number;
  summary: string;
  steps: string[];
  ingredients: RecipeIngredient[];
  /** Flags describe listed ingredients, including optional ones. */
  flags: DietFlag[];
  sourceNote: string;
}

export interface DietSettings {
  vegetarian: boolean;
  vegan: boolean;
  hideGlutenListed: boolean;
  hideDairyListed: boolean;
  hideNutsListed: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  permission: "unknown" | "granted" | "denied";
  /** How many days ahead a best-before or use-by date counts as use soon. */
  leadDays: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: Unit | null;
  checked: boolean;
  note: string;
  source: string;
}

export interface PlanSlot {
  date: string;
  recipeId: string | null;
  servings: number;
}

export interface PersistedState {
  version: 1;
  onboarded: boolean;
  demo: boolean;
  kitchenName: string;
  items: PantryItem[];
  reminders: ReminderSettings;
  diet: DietSettings;
  assumeStaples: boolean;
  shop: ShoppingItem[];
  plan: PlanSlot[];
}

export interface Attention {
  kind: AttentionKind;
  label: string;
  detail: string;
}

export interface IngredientMatch {
  ingredient: RecipeIngredient;
  status: MatchStatus;
  pantryItems: PantryItem[];
  /** Quantity still needed, in the recipe unit, when it can be computed. */
  stillNeed: number | null;
  /** Quantity confirmed in the pantry, in the recipe unit, when it can be computed. */
  haveAmount: number | null;
  reason: string;
}

export interface ShoppingDraftLine {
  key: string;
  name: string;
  quantity: number | null;
  unit: Unit | null;
  include: boolean;
  note: string;
  recipeIds: string[];
  status: MatchStatus;
}

export interface PantryUpdateRow {
  itemId: string;
  name: string;
  unit: Unit | null;
  current: number | null;
  /** Amount to subtract. Null means the row cannot be calculated. */
  proposed: number | null;
  message: string;
}

export interface LoadResult {
  state: PersistedState;
  corruptRaw: string | null;
}
