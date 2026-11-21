import { todayISO } from "./dates";
import {
  applyInput,
  applyPantryUpdates,
  createItem,
  duplicateCandidate,
  ensurePlan,
  mergeQuantity,
  mergeShopping,
  otherLocationNote,
  proposeCookedUpdates,
  shopItemsToPantry,
  uid,
} from "./inventory";
import { buildShoppingDraft } from "./match";
import { freshUi, type Dialog, type Model } from "./model";
import { renderPage } from "./pages";
import { recipeById } from "./recipes";
import { parseRoute, type Route } from "./routes";
import { SAMPLE_BARCODES, samplePantry } from "./sample";
import { blankState, loadState, saveState, sampleState, type Loaded } from "./store";
import type { DateKind, DietSettings, LocationId, PersistedState, Unit } from "./types";
import { COPY } from "./copy";
import { draftFromItem, emptyDraft, validateItemDraft } from "./validate";

export interface Host {
  storage: Storage;
  now: () => Date;
  online: () => boolean;
  hash: () => string;
  setHash: (hash: string) => void;
  onHash: (listener: () => void) => void;
  onConnectivity: (listener: () => void) => void;
  download: (filename: string, contents: string) => void;
}

export function createApp(root: HTMLElement, host: Host): void {
  const loaded: Loaded = loadState(host.storage);
  let state = loaded.state;
  let corruptRaw = loaded.corruptRaw;
  let persistError: string | null = null;
  const ui = freshUi();
  let undoSnapshot: PersistedState | null = null;
  let keepToast = false;
  let lastHash = "";
  let focusDialog = false;
  let painted = false;
  let selection: { id: string; start: number | null; end: number | null } | null = null;

  function today(): string {
    return todayISO(host.now());
  }

  function write(next: PersistedState, preserveBlankName = false): void {
    const kitchenName =
      next.kitchenName.trim() === "" && !preserveBlankName ? "My kitchen" : next.kitchenName;
    state = { ...next, kitchenName, plan: ensurePlan(next.plan, today()) };
    persistError = saveState(host.storage, state);
  }

  function openDialog(dialog: Dialog): void {
    ui.dialog = dialog;
    focusDialog = true;
    render();
  }

  function navigate(hash: string): void {
    const next = hash.startsWith("/") ? hash : `/${hash}`;
    const before = host.hash();
    host.setHash(next);
    if (host.hash() === before) render();
  }

  function notice(message: string, undo?: PersistedState): void {
    ui.toast = { message, undo: Boolean(undo) };
    undoSnapshot = undo ?? null;
    keepToast = true;
  }

  function prepare(route: Route): void {
    ui.dialog = null;
    if (route.name === "add") ui.draft = emptyDraft();
    if (route.name === "edit") {
      const item = state.items.find((entry) => entry.id === route.id);
      ui.draft = item ? draftFromItem(item) : emptyDraft();
    }
    if (route.name === "item") {
      ui.consumeAmount = "";
      ui.consumeError = "";
    }
    if (route.name === "cooked") initCook(route.id);
    if (route.name === "pantry") {
      ui.selectMode = false;
      ui.selected = [];
    }
  }

  function initCook(id: string): void {
    const recipe = recipeById(id);
    if (!recipe) {
      ui.cook = null;
      return;
    }
    const servings = ui.servings[id] ?? recipe.servings;
    const proposal = proposeCookedUpdates(state.items, recipe, servings, today(), state.reminders.leadDays);
    ui.cook = {
      recipeId: id,
      servings,
      formError: "",
      skipped: proposal.skipped,
      rows: proposal.rows.map((row) => ({
        itemId: row.itemId,
        amount: row.proposed == null ? "" : String(row.proposed),
        remove: false,
        skip: row.proposed == null,
        error: "",
      })),
    };
  }

  function rememberFocus(): void {
    const active = document.activeElement as HTMLInputElement | null;
    if (!active || !active.id || !root.contains(active)) {
      selection = null;
      return;
    }
    selection = { id: active.id, start: active.selectionStart, end: active.selectionEnd };
  }

  function restoreFocus(): void {
    if (!selection) return;
    const element = document.getElementById(selection.id) as HTMLInputElement | null;
    if (!element) return;
    element.focus();
    if (selection.start != null && typeof element.setSelectionRange === "function") {
      try {
        element.setSelectionRange(selection.start, selection.end ?? selection.start);
      } catch {
        /* Some input types do not support a selection range. */
      }
    }
  }

  function render(): void {
    const hash = host.hash() || "/welcome";
    if (corruptRaw && hash !== "/recovery") {
      host.setHash("/recovery");
      return;
    }
    if (!corruptRaw && !state.onboarded && hash !== "/welcome") {
      host.setHash("/welcome");
      return;
    }
    const routeChanged = hash !== lastHash;
    if (routeChanged) {
      if (!keepToast) {
        ui.toast = null;
        undoSnapshot = null;
      }
      keepToast = false;
      lastHash = hash;
      prepare(parseRoute(hash));
    } else {
      rememberFocus();
    }
    const model: Model = {
      state,
      today: today(),
      route: parseRoute(hash),
      offline: !host.online(),
      persistError,
      ui,
    };
    const view = renderPage(model);
    root.innerHTML = view.html;
    document.title = `${view.title} · FreshLoop`;
    if (focusDialog) {
      root.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      focusDialog = false;
    } else if (routeChanged && painted) {
      root.querySelector<HTMLElement>("#main")?.focus();
    } else if (!routeChanged) {
      restoreFocus();
    }
    painted = true;
  }

  function savePending(pending: ReturnType<typeof validateItemDraft>["value"], editingId: string | null): void {
    if (!pending) return;
    const previous = structuredClone(state);
    if (editingId) {
      const existing = state.items.find((item) => item.id === editingId);
      if (!existing) return;
      const nextItem = applyInput(existing, pending);
      write({ ...state, items: state.items.map((item) => (item.id === editingId ? nextItem : item)) });
      const extra = otherLocationNote(state.items, pending.name, pending.location, editingId);
      notice(extra ?? "Changes saved.", previous);
      navigate(`/item/${editingId}`);
      return;
    }
    const created = createItem(pending, host.now());
    write({ ...state, items: [...state.items, created] });
    const extra = otherLocationNote(state.items, pending.name, pending.location, created.id);
    notice(extra ?? `${created.name} added to the ${created.location}.`, previous);
    navigate(`/item/${created.id}`);
  }

  function onSubmit(action: string): void {
    if (action === "quick-add") {
      const name = ui.quickName.trim();
      if (!name) {
        notice("Enter a name.");
        render();
        return;
      }
      if (name.length > 80) {
        notice("Use 80 characters or fewer.");
        render();
        return;
      }
      const pending = {
        name,
        quantity: null,
        unit: null,
        location: "fridge" as const,
        dateKind: "none" as const,
        date: null,
        note: "",
      };
      const existing = duplicateCandidate(state.items, name, "fridge");
      ui.quickName = "";
      if (existing) {
        openDialog({ type: "duplicate", existingId: existing.id, pending, editingId: null });
        return;
      }
      savePending(pending, null);
      return;
    }
    if (action === "save-item") {
      const result = validateItemDraft(ui.draft, today());
      ui.draft = { ...ui.draft, errors: result.errors, warning: result.warning };
      if (!result.value) {
        render();
        return;
      }
      const route = parseRoute(host.hash());
      const editingId = route.name === "edit" ? route.id : null;
      const existing = duplicateCandidate(state.items, result.value.name, result.value.location, editingId ?? undefined);
      if (existing) {
        openDialog({ type: "duplicate", existingId: existing.id, pending: result.value, editingId });
        return;
      }
      savePending(result.value, editingId);
      return;
    }
    if (action === "consume-one") {
      const route = parseRoute(host.hash());
      if (route.name !== "item") return;
      const item = state.items.find((entry) => entry.id === route.id);
      if (!item || item.quantity == null) return;
      const amount = Number(ui.consumeAmount);
      if (!ui.consumeAmount.trim() || !Number.isFinite(amount) || amount <= 0) {
        ui.consumeError = "Enter an amount, or remove the item.";
        render();
        return;
      }
      if (amount > item.quantity) {
        ui.consumeError = `Enter an amount up to ${item.quantity}, or remove the item.`;
        render();
        return;
      }
      const previous = structuredClone(state);
      const items = applyPantryUpdates(state.items, [{ itemId: item.id, subtract: amount, remove: false }]);
      write({ ...state, items });
      ui.consumeAmount = "";
      ui.consumeError = "";
      notice("Inventory updated.", previous);
      navigate("/pantry");
      return;
    }
    if (action === "shop-add") {
      const name = ui.shopName.trim();
      if (!name) {
        notice("Enter a name.");
        render();
        return;
      }
      let quantity: number | null = null;
      if (ui.shopQty.trim()) {
        const parsed = Number(ui.shopQty);
        if (!Number.isFinite(parsed) || parsed <= 0) {
          notice("Enter a quantity greater than zero, or leave it blank.");
          render();
          return;
        }
        quantity = parsed;
      }
      if (quantity != null && !ui.shopUnit) {
        notice("Choose a unit so the amount is not a guess.");
        render();
        return;
      }
      if (quantity == null && ui.shopUnit) {
        notice("Enter a quantity, or clear the unit. FreshLoop will not assume an amount.");
        render();
        return;
      }
      const previous = structuredClone(state);
      write({
        ...state,
        shop: [
          ...state.shop,
          {
            id: uid(),
            name,
            quantity,
            unit: ui.shopUnit === "" ? null : ui.shopUnit,
            checked: false,
            note: "Added by you.",
            source: "Added on the shopping list",
          },
        ],
      });
      ui.shopName = "";
      ui.shopQty = "";
      ui.shopUnit = "";
      notice("Added to the shopping list.", previous);
      render();
    }
  }

  function onClick(action: string, element: HTMLElement): void {
    const id = element.dataset.id ?? "";
    if (action === "start-own") {
      write({ ...blankState(), onboarded: true });
      navigate("/pantry");
      return;
    }
    if (action === "start-sample") {
      write(sampleState(host.now()));
      navigate("/pantry");
      return;
    }
    if (action === "toggle-select") {
      ui.selectMode = true;
      ui.selected = [];
      render();
      return;
    }
    if (action === "cancel-select" || action === "cancel-dialog") {
      ui.selectMode = action === "cancel-select" ? false : ui.selectMode;
      ui.selected = action === "cancel-select" ? [] : ui.selected;
      ui.dialog = null;
      render();
      return;
    }
    if (action === "batch-move") {
      const previous = structuredClone(state);
      write({
        ...state,
        items: state.items.map((item) =>
          ui.selected.includes(item.id) ? { ...item, location: ui.batchLocation, updatedAt: host.now().toISOString() } : item,
        ),
      });
      ui.selectMode = false;
      ui.selected = [];
      notice("Locations updated.", previous);
      render();
      return;
    }
    if (action === "batch-remove") return openDialog({ type: "batch-remove" });
    if (action === "batch-consume-open") return openDialog({ type: "batch-consume" });
    if (action === "confirm-batch-remove" || action === "confirm-batch-consume") {
      const previous = structuredClone(state);
      write({ ...state, items: state.items.filter((item) => !ui.selected.includes(item.id)) });
      ui.dialog = null;
      ui.selectMode = false;
      ui.selected = [];
      notice(action === "confirm-batch-consume" ? "Selected items removed." : "Items removed.", previous);
      render();
      return;
    }
    if (action === "remove-item") return openDialog({ type: "remove-item", id });
    if (action === "confirm-remove" && ui.dialog?.type === "remove-item") {
      const removeId = ui.dialog.id;
      const previous = structuredClone(state);
      write({ ...state, items: state.items.filter((item) => item.id !== removeId) });
      ui.dialog = null;
      notice("Item removed.", previous);
      navigate("/pantry");
      return;
    }
    if (action === "add-to-existing" && ui.dialog?.type === "duplicate") {
      const dialog = ui.dialog;
      const existing = state.items.find((item) => item.id === dialog.existingId);
      if (!existing) return;
      const merged = mergeQuantity(existing, dialog.pending);
      if (!merged) return;
      const previous = structuredClone(state);
      const withoutEdited =
        dialog.editingId && dialog.editingId !== existing.id
          ? state.items.filter((item) => item.id !== dialog.editingId)
          : state.items;
      write({ ...state, items: withoutEdited.map((item) => (item.id === existing.id ? merged : item)) });
      ui.dialog = null;
      notice("Added to the existing item.", previous);
      navigate(`/item/${existing.id}`);
      return;
    }
    if (action === "save-separate" && ui.dialog?.type === "duplicate") {
      const dialog = ui.dialog;
      ui.dialog = null;
      savePending(dialog.pending, dialog.editingId);
      return;
    }
    if (action === "lookup-barcode") {
      const code = ui.draft.barcode.trim();
      const hit = SAMPLE_BARCODES[code];
      if (!hit) {
        ui.draft = { ...ui.draft, barcodeMessage: COPY.barcodeMiss };
      } else {
        ui.draft = {
          ...ui.draft,
          name: hit.name,
          quantity: String(hit.quantity),
          unit: hit.unit,
          location: hit.location,
          barcodeMessage: COPY.barcodeConfirm,
          errors: {},
        };
      }
      render();
      return;
    }
    if (action === "show-receipt") return openDialog({ type: "receipt" });
    if (action === "servings") {
      const recipe = recipeById(id);
      if (!recipe) return;
      const current = ui.servings[id] ?? recipe.servings;
      const delta = Number(element.dataset.delta ?? 0);
      const next = Math.min(12, Math.max(1, current + delta));
      ui.servings = { ...ui.servings, [id]: next };
      render();
      return;
    }
    if (action === "open-review-recipe") {
      const recipe = recipeById(id);
      if (!recipe) return;
      const servings = ui.servings[id] ?? recipe.servings;
      ui.review = {
        title: "Check the list before you shop",
        sourceLabel: recipe.title,
        lines: buildShoppingDraft([{ recipe, servings }], state.items, state.assumeStaples),
      };
      navigate("/review");
      return;
    }
    if (action === "open-review-plan") {
      const planned = state.plan.flatMap((slot) => {
        if (!slot.recipeId) return [];
        const recipe = recipeById(slot.recipeId);
        return recipe ? [{ recipe, servings: slot.servings }] : [];
      });
      if (planned.length === 0) {
        notice("Add a dinner before building a list.");
        render();
        return;
      }
      ui.review = {
        title: "Check the plan list",
        sourceLabel: "Four-day plan",
        lines: buildShoppingDraft(planned, state.items, state.assumeStaples),
      };
      navigate("/review");
      return;
    }
    if (action === "commit-review" && ui.review) {
      const previous = structuredClone(state);
      const source = ui.review.sourceLabel;
      write({ ...state, shop: mergeShopping(state.shop, ui.review.lines, source) });
      ui.review = null;
      notice("Shopping list updated.", previous);
      navigate("/shop");
      return;
    }
    if (action === "discard-review") {
      const dest = ui.review?.sourceLabel === "Four-day plan" ? "/plan" : "/cook";
      ui.review = null;
      navigate(dest);
      return;
    }
    if (action === "shop-delete") {
      const previous = structuredClone(state);
      write({ ...state, shop: state.shop.filter((item) => item.id !== id) });
      notice("Removed from the shopping list.", previous);
      render();
      return;
    }
    if (action === "open-move-shop") return openDialog({ type: "move-shop" });
    if (action === "confirm-move-shop") {
      const previous = structuredClone(state);
      const items = shopItemsToPantry(state.items, state.shop, ui.moveLocation);
      write({ ...state, items, shop: state.shop.filter((item) => !item.checked) });
      ui.dialog = null;
      notice("Checked items were added to the pantry. No dates were copied.", previous);
      render();
      return;
    }
    if (action === "clear-diet") {
      write({
        ...state,
        diet: { vegetarian: false, vegan: false, hideGlutenListed: false, hideDairyListed: false, hideNutsListed: false },
      });
      render();
      return;
    }
    if (action === "browse-catalog") {
      ui.browseCatalog = true;
      render();
      return;
    }
    if (action === "apply-cooked") return applyCooked();
    if (action === "open-permission") return openDialog({ type: "permission" });
    if (action === "allow-reminders") {
      write({ ...state, reminders: { ...state.reminders, enabled: true, permission: "granted" } });
      ui.dialog = null;
      notice("In-app reminders are on.");
      render();
      return;
    }
    if (action === "deny-reminders") {
      write({ ...state, reminders: { ...state.reminders, enabled: false, permission: "denied" } });
      ui.dialog = null;
      notice("Reminders stay off.");
      render();
      return;
    }
    if (action === "disable-reminders") {
      write({ ...state, reminders: { ...state.reminders, enabled: false } });
      notice("Reminders are off. The use-soon list still works.");
      render();
      return;
    }
    if (action === "open-replace-sample") return openDialog({ type: "replace-sample" });
    if (action === "confirm-replace-sample") {
      const previous = structuredClone(state);
      write({
        ...state,
        onboarded: true,
        demo: true,
        kitchenName: "Sample kitchen",
        items: samplePantry(today()),
      });
      ui.dialog = null;
      notice("Sample kitchen loaded.", previous);
      navigate("/pantry");
      return;
    }
    if (action === "open-clear-pantry") return openDialog({ type: "clear-pantry" });
    if (action === "confirm-clear-pantry") {
      const previous = structuredClone(state);
      write({ ...state, items: [], demo: false, kitchenName: state.demo ? "My kitchen" : state.kitchenName });
      ui.dialog = null;
      notice("Pantry emptied.", previous);
      navigate("/pantry");
      return;
    }
    if (action === "export-data") {
      host.download(
        "freshloop-pantry.json",
        JSON.stringify(
          {
            note: "Exported from the FreshLoop prototype. Not a backup service.",
            sampleData: state.demo,
            exportedAt: host.now().toISOString(),
            state,
          },
          null,
          2,
        ),
      );
      notice("Download started on this device.");
      render();
      return;
    }
    if (action === "open-delete") return openDialog({ type: "delete-all" });
    if (action === "confirm-delete") {
      const previous = structuredClone(state);
      write({ ...blankState(), onboarded: true });
      ui.dialog = null;
      notice("Data on this device was deleted.", previous);
      navigate("/pantry");
      return;
    }
    if (action === "download-corrupt") {
      host.download("freshloop-unreadable.txt", corruptRaw ?? "");
      return;
    }
    if (action === "erase-corrupt") {
      host.storage.removeItem(hostKey());
      corruptRaw = null;
      state = blankState();
      persistError = null;
      navigate("/welcome");
      return;
    }
    if (action === "undo" && undoSnapshot) {
      const restore = undoSnapshot;
      undoSnapshot = null;
      ui.toast = null;
      write(restore);
      render();
      return;
    }
    if (action === "dismiss-toast") {
      ui.toast = null;
      undoSnapshot = null;
      render();
    }
  }

  function hostKey(): string {
    return "freshloop.v1";
  }

  function applyCooked(): void {
    if (!ui.cook) return;
    let invalid = false;
    const rows = ui.cook.rows.map((row) => {
      const item = state.items.find((entry) => entry.id === row.itemId);
      const next = { ...row, error: "" };
      if (!item || row.skip || row.remove) return next;
      if (item.quantity == null) {
        next.error = "Quantity was never set. Leave the item unchanged or remove it.";
        invalid = true;
        return next;
      }
      const amount = Number(row.amount);
      if (!row.amount.trim() || !Number.isFinite(amount) || amount <= 0) {
        next.error = "Enter an amount, leave it unchanged, or remove the item.";
        invalid = true;
        return next;
      }
      if (amount > item.quantity) {
        next.error = `Enter an amount up to ${item.quantity}, or remove the item.`;
        invalid = true;
      }
      return next;
    });
    ui.cook = { ...ui.cook, rows, formError: invalid ? "Fix the rows below before updating the pantry." : "" };
    if (invalid) {
      render();
      return;
    }
    const previous = structuredClone(state);
    const items = applyPantryUpdates(
      state.items,
      rows.map((row) => ({
        itemId: row.itemId,
        subtract: row.remove || row.skip ? null : Number(row.amount),
        remove: row.remove,
      })),
    );
    write({ ...state, items });
    notice("Pantry updated.", previous);
    navigate("/pantry");
  }

  function onInput(action: string, element: HTMLInputElement): void {
    const value = element.value;
    if (action === "quick-name") ui.quickName = value;
    else if (action === "pantry-query") ui.pantryQuery = value;
    else if (action === "cook-query") ui.cookQuery = value;
    else if (action === "draft-name") patchDraft({ name: value }, "name");
    else if (action === "draft-qty") patchDraft({ quantity: value }, "quantity");
    else if (action === "draft-date") patchDraft({ date: value }, "date");
    else if (action === "draft-note") patchDraft({ note: value }, "note");
    else if (action === "draft-barcode") patchDraft({ barcode: value });
    else if (action === "consume-amount") {
      ui.consumeAmount = value;
      ui.consumeError = "";
    } else if (action === "kitchen-name") {
      write({ ...state, kitchenName: value }, true);
    } else if (action === "shop-name") ui.shopName = value;
    else if (action === "shop-qty-new") ui.shopQty = value;
    else if (action === "line-qty") {
      if (!ui.review) return;
      const parsed = value.trim() === "" ? null : Number(value);
      if (parsed != null && (!Number.isFinite(parsed) || parsed < 0)) return;
      ui.review = {
        ...ui.review,
        lines: ui.review.lines.map((line) => (line.key === element.dataset.key ? { ...line, quantity: parsed } : line)),
      };
    } else if (action === "shop-qty") {
      const parsed = value.trim() === "" ? null : Number(value);
      if (parsed != null && (!Number.isFinite(parsed) || parsed < 0)) return;
      write({
        ...state,
        shop: state.shop.map((item) => (item.id === element.dataset.id ? { ...item, quantity: parsed } : item)),
      });
    } else if (action === "plan-servings") {
      const parsed = Number(value);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 12) return;
      write({
        ...state,
        plan: state.plan.map((slot) => (slot.date === element.dataset.date ? { ...slot, servings: parsed } : slot)),
      });
    } else if (action === "cook-amount") {
      if (!ui.cook) return;
      ui.cook = {
        ...ui.cook,
        rows: ui.cook.rows.map((row) => (row.itemId === element.dataset.id ? { ...row, amount: value, error: "" } : row)),
      };
    } else return;
    render();
  }

  function patchDraft(partial: Partial<typeof ui.draft>, clear?: string): void {
    const errors = { ...ui.draft.errors };
    if (clear) delete errors[clear];
    ui.draft = { ...ui.draft, ...partial, errors };
  }

  function onChange(action: string, element: HTMLInputElement | HTMLSelectElement): void {
    const value = element.value;
    if (action === "draft-unit") patchDraft({ unit: value as Unit | "" }, "unit");
    else if (action === "draft-location") patchDraft({ location: value as LocationId });
    else if (action === "draft-date-kind") patchDraft({ dateKind: value as DateKind }, "date");
    else if (action === "batch-location") ui.batchLocation = value as LocationId;
    else if (action === "move-location") ui.moveLocation = value as LocationId;
    else if (action === "shop-unit-new") ui.shopUnit = value as Unit | "";
    else if (action === "select-item") {
      const checked = element instanceof HTMLInputElement && element.checked;
      const itemId = element.dataset.id ?? "";
      ui.selected = checked ? [...ui.selected, itemId] : ui.selected.filter((entry) => entry !== itemId);
    } else if (action === "diet") {
      const key = element.dataset.diet as keyof DietSettings;
      if (!key) return;
      write({ ...state, diet: { ...state.diet, [key]: element instanceof HTMLInputElement ? element.checked : false } });
    } else if (action === "use-soon-only") {
      ui.useSoonOnly = element instanceof HTMLInputElement ? element.checked : false;
    } else if (action === "staples") {
      write({ ...state, assumeStaples: element instanceof HTMLInputElement ? element.checked : false });
    } else if (action === "lead-days") {
      const days = Number(value);
      if (![1, 2, 3, 7].includes(days)) return;
      write({ ...state, reminders: { ...state.reminders, leadDays: days } });
    } else if (action === "plan-recipe") {
      write({
        ...state,
        plan: state.plan.map((slot) =>
          slot.date === element.dataset.date ? { ...slot, recipeId: value || null } : slot,
        ),
      });
    } else if (action === "toggle-line" && ui.review) {
      const checked = element instanceof HTMLInputElement && element.checked;
      ui.review = {
        ...ui.review,
        lines: ui.review.lines.map((line) => (line.key === element.dataset.key ? { ...line, include: checked } : line)),
      };
    } else if (action === "shop-check") {
      const checked = element instanceof HTMLInputElement && element.checked;
      write({
        ...state,
        shop: state.shop.map((item) => (item.id === element.dataset.id ? { ...item, checked } : item)),
      });
    } else if (action === "cook-skip" || action === "cook-remove") {
      if (!ui.cook) return;
      const checked = element instanceof HTMLInputElement && element.checked;
      ui.cook = {
        ...ui.cook,
        rows: ui.cook.rows.map((row) => {
          if (row.itemId !== element.dataset.id) return row;
          if (action === "cook-skip") return { ...row, skip: checked, remove: checked ? false : row.remove, error: "" };
          return { ...row, remove: checked, skip: checked ? false : row.skip, error: "" };
        }),
      };
    } else return;
    render();
  }

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.classList.contains("backdrop")) {
      ui.dialog = null;
      render();
      return;
    }
    const anchor = target.closest("a[href^='#']");
    if (anchor && root.contains(anchor)) {
      event.preventDefault();
      navigate(anchor.getAttribute("href")!.replace(/^#/, ""));
      return;
    }
    const control = target.closest<HTMLElement>("[data-action]");
    if (!control || !root.contains(control)) return;
    if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement) return;
    if (control instanceof HTMLButtonElement && control.type === "submit") return;
    event.preventDefault();
    onClick(control.dataset.action ?? "", control);
  });

  root.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.dataset.action || target.type === "checkbox" || target.type === "radio") return;
    onInput(target.dataset.action, target);
  });

  root.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;
    if (!target.dataset.action) return;
    if (target instanceof HTMLInputElement && target.type !== "checkbox" && target.type !== "radio") return;
    onChange(target.dataset.action, target);
  });

  root.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    onSubmit(form.dataset.action ?? "");
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && ui.dialog) {
      ui.dialog = null;
      render();
      return;
    }
    if (event.key !== "Tab" || !ui.dialog) return;
    const dialog = root.querySelector("[role='dialog']");
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")).filter(
      (element) => !element.hasAttribute("disabled"),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  host.onHash(() => render());
  host.onConnectivity(() => render());
  render();
}
