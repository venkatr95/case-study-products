import type { ItemDraft } from "./validate";
import type { Route } from "./routes";
import type { CookedSkip, ItemInput } from "./inventory";
import type { LocationId, PersistedState, ShoppingDraftLine, Unit } from "./types";

export type Dialog =
  | { type: "duplicate"; existingId: string; pending: ItemInput; editingId: string | null }
  | { type: "remove-item"; id: string }
  | { type: "batch-remove" }
  | { type: "batch-consume" }
  | { type: "delete-all" }
  | { type: "permission" }
  | { type: "replace-sample" }
  | { type: "clear-pantry" }
  | { type: "move-shop" }
  | { type: "receipt" };

export interface CookRowUi {
  itemId: string;
  amount: string;
  remove: boolean;
  skip: boolean;
  error: string;
}

export interface UiState {
  quickName: string;
  pantryQuery: string;
  selectMode: boolean;
  selected: string[];
  batchLocation: LocationId;
  draft: ItemDraft;
  cookQuery: string;
  useSoonOnly: boolean;
  browseCatalog: boolean;
  servings: Record<string, number>;
  review: { title: string; sourceLabel: string; lines: ShoppingDraftLine[] } | null;
  cook: { recipeId: string; servings: number; rows: CookRowUi[]; skipped: CookedSkip[]; formError: string } | null;
  toast: { message: string; undo: boolean } | null;
  dialog: Dialog | null;
  shopName: string;
  shopQty: string;
  shopUnit: Unit | "";
  moveLocation: LocationId;
  consumeAmount: string;
  consumeError: string;
}

export interface Model {
  state: PersistedState;
  today: string;
  route: Route;
  offline: boolean;
  persistError: string | null;
  ui: UiState;
}

export function freshUi(): UiState {
  return {
    quickName: "",
    pantryQuery: "",
    selectMode: false,
    selected: [],
    batchLocation: "fridge",
    draft: {
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
    },
    cookQuery: "",
    useSoonOnly: false,
    browseCatalog: false,
    servings: {},
    review: null,
    cook: null,
    toast: null,
    dialog: null,
    shopName: "",
    shopQty: "",
    shopUnit: "",
    moveLocation: "cupboard",
    consumeAmount: "",
    consumeError: "",
  };
}
