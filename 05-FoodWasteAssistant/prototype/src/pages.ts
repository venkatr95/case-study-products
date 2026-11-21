import { COPY } from "./copy";
import { classifyItem, formatDate } from "./dates";
import { esc, fieldError, itemChip, locationLabel, locationOptions, statusChip, unitOptions } from "./html";
import type { Model } from "./model";
import { matchRecipe, recipeHidden, usesAttentionItem } from "./match";
import { namesMatch } from "./names";
import { RECIPES, recipeById } from "./recipes";
import { navKey } from "./routes";
import type { AttentionKind, LocationId, PantryItem, ShoppingDraftLine, Unit } from "./types";
import { formatQuantity } from "./units";

const LOCATIONS: LocationId[] = ["fridge", "freezer", "cupboard", "other"];

function brand(): string {
  return `<span class="brand-mark" aria-hidden="true"></span><span>FreshLoop</span>`;
}

function banners(model: Model): string {
  const parts: string[] = [];
  if (model.offline) parts.push(`<p class="banner" role="status">${esc(COPY.offline)}</p>`);
  if (model.persistError) parts.push(`<p class="banner banner-warn" role="alert">${esc(model.persistError)}</p>`);
  if (model.state.demo && model.route.name !== "welcome") {
    parts.push(`<p class="banner" role="status">${esc(COPY.sampleBanner)}</p>`);
  }
  return parts.join("");
}

function nav(model: Model): string {
  const active = navKey(model.route);
  const links = [
    ["/pantry", "Pantry", "pantry"],
    ["/use-soon", "Use soon", "use-soon"],
    ["/cook", "Cook", "cook"],
    ["/plan", "Plan", "plan"],
    ["/shop", "Shop", "shop"],
    ["/settings", "Settings", "settings"],
  ];
  const side = links
    .map(([href, label, key]) => {
      const current = key === active ? ' aria-current="page"' : "";
      return `<a href="#${href}"${current}>${label}</a>`;
    })
    .join("");
  const bottom = [
    ["/pantry", "Pantry", "pantry"],
    ["/cook", "Cook", "cook"],
    ["/shop", "Shop", "shop"],
    ["/plan", "Plan", "plan"],
  ]
    .map(([href, label, key]) => {
      const current = key === active ? ' aria-current="page"' : "";
      return `<a href="#${href}"${current}>${label}</a>`;
    })
    .join("");
  return `<aside class="side-nav" aria-label="Primary"><a class="brand" href="#/pantry">${brand()}</a>${side}</aside><nav class="bottom-nav" aria-label="Primary">${bottom}</nav>`;
}

function shell(model: Model, title: string, body: string, withNav = true): string {
  const dialog = model.ui.dialog ? dialogHtml(model) : "";
  const toast = model.ui.toast
    ? `<div class="toast" role="status"><p>${esc(model.ui.toast.message)}</p>${
        model.ui.toast.undo ? '<button type="button" data-action="undo">Undo</button>' : ""
      }<button type="button" data-action="dismiss-toast">Dismiss</button></div>`
    : "";
  if (!withNav) {
    return `<div class="solo"><header class="topbar"><p class="brand">${brand()}</p></header>${banners(model)}<main id="main" tabindex="-1"><h1>${esc(title)}</h1>${body}</main></div>${dialog}${toast}`;
  }
  const inert = model.ui.dialog ? " inert" : "";
  return `<div class="shell"${inert}>${nav(model)}<div class="workspace"><header class="topbar"><a class="brand" href="#/pantry">${brand()}</a><p class="kitchen-name">${esc(model.state.kitchenName)}</p><a class="text-link" href="#/settings">Settings</a></header>${banners(model)}<main id="main" tabindex="-1"><h1>${esc(title)}</h1>${body}</main></div></div>${dialog}${toast}`;
}

function attentionCounts(items: PantryItem[], today: string, leadDays: number): Record<AttentionKind, PantryItem[]> {
  const groups: Record<AttentionKind, PantryItem[]> = {
    "date-passed": [],
    "use-soon": [],
    opened: [],
    "no-date": [],
    later: [],
  };
  for (const item of items) groups[classifyItem(item, today, leadDays).kind].push(item);
  return groups;
}

function itemRow(model: Model, item: PantryItem): string {
  const meta = `${formatQuantity(item.quantity, item.unit)} · ${locationLabel(item.location)}`;
  const chip = itemChip(item, model.today, model.state.reminders.leadDays);
  const selected = model.ui.selected.includes(item.id) ? " checked" : "";
  const select = model.ui.selectMode
    ? `<label class="select-box"><input type="checkbox" data-action="select-item" data-id="${esc(item.id)}"${selected} /><span class="visually-hidden">Select ${esc(item.name)}</span></label>`
    : "";
  return `<li class="item-row">${select}<a href="#/item/${esc(item.id)}"><span class="item-name">${esc(item.name)}</span><span class="item-meta">${esc(meta)}</span></a>${chip}</li>`;
}

function pageWelcome(model: Model): string {
  const body = `
    <p>${esc(COPY.safety)}</p>
    <p>${esc(COPY.safetyLong)}</p>
    <ol class="steps">
      <li>Add food you already have. A date is optional, and you choose what kind of date it is.</li>
      <li>See which entered dates are soon. Then open recipes that use those items.</li>
      <li>Shop only for gaps the pantry does not already cover, then mark what you cooked.</li>
    </ol>
    <div class="actions">
      <button type="button" class="primary" data-action="start-own">Start my kitchen</button>
      <button type="button" data-action="start-sample">Try the sample kitchen</button>
    </div>
    <p class="quiet">The sample kitchen is fictional. Nothing is uploaded.</p>`;
  return shell(model, COPY.uvp, body, false);
}

function pagePantry(model: Model): string {
  const { state, ui, today } = model;
  const lead = state.reminders.leadDays;
  if (state.items.length === 0) {
    const body = `
      <p class="lede">Your pantry is empty. FreshLoop can only suggest food you enter.</p>
      <p>${esc(COPY.safety)}</p>
      <form class="quick-add" data-action="quick-add">
        <label for="quick-name">Add an item</label>
        <input id="quick-name" data-action="quick-name" value="${esc(ui.quickName)}" autocomplete="off" />
        <button type="submit" class="primary">Add</button>
      </form>
      <p class="quiet">A quick add stores the name in the fridge with no quantity and no date. You can add both afterward.</p>
      <div class="actions">
        <a class="button primary" href="#/add">Add details</a>
        <button type="button" data-action="open-replace-sample">Try the sample kitchen</button>
      </div>`;
    return shell(model, "Pantry", body);
  }

  const groups = attentionCounts(state.items, today, lead);
  const query = ui.pantryQuery.trim().toLowerCase();
  const visible = state.items.filter((item) => !query || item.name.toLowerCase().includes(query));
  const reminder =
    state.reminders.enabled && groups["use-soon"].length + groups["date-passed"].length > 0
      ? `<p class="banner">In-app reminder: ${groups["use-soon"].length + groups["date-passed"].length} items are inside the ${lead}-day window. This shows while FreshLoop is open. <a href="#/settings">Change reminders</a></p>`
      : "";
  const sections = LOCATIONS.map((location) => {
    const rows = visible.filter((item) => item.location === location);
    if (rows.length === 0) return "";
    return `<section><h2>${locationLabel(location)}</h2><ul class="list">${rows.map((item) => itemRow(model, item)).join("")}</ul></section>`;
  }).join("");
  const selectedCount = ui.selected.length;
  const batch = ui.selectMode
    ? `<div class="batch-bar">
        <p>${selectedCount} selected.</p>
        <label for="batch-location">Move selected to</label>
        <select id="batch-location" data-action="batch-location">${locationOptions(ui.batchLocation)}</select>
        <button type="button" data-action="batch-move" ${selectedCount === 0 ? "disabled" : ""}>Move</button>
        <button type="button" data-action="batch-remove" ${selectedCount === 0 ? "disabled" : ""}>Remove</button>
        <button type="button" data-action="batch-consume-open" ${selectedCount === 0 ? "disabled" : ""}>Mark consumed</button>
        <button type="button" data-action="cancel-select">Cancel</button>
        <p class="quiet">Mark consumed removes the whole item. Partial amounts are edited one item at a time.</p>
      </div>`
    : `<button type="button" data-action="toggle-select">Select items</button>`;

  const body = `
    ${reminder}
    <section class="hero">
      <h2>Use soon</h2>
      <p class="hero-stat">${groups["use-soon"].length} items are marked Use soon.</p>
      <p>${groups["date-passed"].length} ${groups["date-passed"].length === 1 ? "item is" : "items are"} marked Date passed.</p>
      <p class="quiet">${esc(COPY.safety)} Window: ${lead} days.</p>
      <a class="button" href="#/use-soon">Open the use-soon list</a>
    </section>
    <form class="quick-add" data-action="quick-add">
      <label for="quick-name">Add an item</label>
      <input id="quick-name" data-action="quick-name" value="${esc(ui.quickName)}" autocomplete="off" />
      <button type="submit" class="primary">Add</button>
    </form>
    <p class="quiet"><a href="#/add">Add quantity, location, or a date</a></p>
    <label for="pantry-query">Search the pantry</label>
    <input id="pantry-query" data-action="pantry-query" value="${esc(ui.pantryQuery)}" autocomplete="off" />
    ${batch}
    ${sections || "<p>No items match that search.</p>"}`;
  return shell(model, "Pantry", body);
}

function pageUseSoon(model: Model): string {
  const lead = model.state.reminders.leadDays;
  const groups = attentionCounts(model.state.items, model.today, lead);
  const section = (kind: AttentionKind, title: string, intro: string) => {
    const rows = groups[kind];
    if (rows.length === 0) return "";
    return `<section><h2>${esc(title)}</h2><p>${esc(intro)}</p><ul class="list">${rows.map((item) => itemRow(model, item)).join("")}</ul></section>`;
  };
  const reminderNote =
    model.state.reminders.permission === "denied"
      ? `<p class="banner">Reminders stay off. You chose not to allow them. This list still works. <a href="#/settings">Review the choice</a></p>`
      : model.state.reminders.enabled
        ? `<p class="quiet">${esc(COPY.reminderLimit)}</p>`
        : `<p class="quiet">In-app reminders are off. The list still works. <a href="#/settings">Turn reminders on</a></p>`;
  const empty =
    model.state.items.length === 0
      ? `<p>Your pantry is empty, so there is nothing to sort by date. <a href="#/add">Add an item</a></p>`
      : "";
  const body = `
    <p class="lede">Use soon and Date passed come from dates you entered. Opened is not an expiry. No date means FreshLoop is not guessing.</p>
    <p>${esc(COPY.safety)} Window: ${lead} days. <a href="#/settings">Change the window</a></p>
    ${reminderNote}
    ${empty}
    ${section("date-passed", "Date passed", "The date you entered is before today. This is not a safety verdict.")}
    ${section("use-soon", "Use soon", "The best-before or use-by date you entered falls inside the window.")}
    ${section("opened", "Opened", "An opened-on date stays in this group. FreshLoop does not convert it into an expiry.")}
    ${section("no-date", "No date", "These items have no date. They are not treated as urgent.")}
    ${groups.later.length ? `<p class="quiet">${groups.later.length} items have a date outside the window. They stay in the pantry and are not listed here.</p>` : ""}`;
  return shell(model, "Use soon", body);
}

function draftForm(model: Model, submitLabel: string): string {
  const draft = model.ui.draft;
  const err = draft.errors;
  const described = (field: string) => (err[field] ? ` aria-invalid="true" aria-describedby="${field}-error"` : "");
  return `<form data-action="save-item">
    <label for="draft-name">Name</label>
    <input id="draft-name" data-action="draft-name" value="${esc(draft.name)}" autocomplete="off"${described("name")} />
    ${fieldError("name-error", err.name)}
    <div class="split">
      <div>
        <label for="draft-qty">Quantity <span class="optional">(optional)</span></label>
        <input id="draft-qty" data-action="draft-qty" inputmode="decimal" value="${esc(draft.quantity)}"${described("quantity")} />
        ${fieldError("quantity-error", err.quantity)}
      </div>
      <div>
        <label for="draft-unit">Unit</label>
        <select id="draft-unit" data-action="draft-unit">${unitOptions(draft.unit)}</select>
        ${fieldError("unit-error", err.unit)}
      </div>
    </div>
    <label for="draft-location">Storage location</label>
    <select id="draft-location" data-action="draft-location">${locationOptions(draft.location)}</select>
    <fieldset>
      <legend>Date you are entering</legend>
      ${(["none", "best-before", "use-by", "opened-on"] as const)
        .map((kind) => {
          const label = kind === "none" ? "No date" : kind === "best-before" ? "Best-before" : kind === "use-by" ? "Use-by" : "Opened on";
          return `<label class="choice"><input type="radio" name="date-kind" data-action="draft-date-kind" value="${kind}"${draft.dateKind === kind ? " checked" : ""} /> ${label}</label>`;
        })
        .join("")}
      <p class="quiet">Best-before and use-by are reminders only. Opened on is not an expiry.</p>
    </fieldset>
    ${
      draft.dateKind === "none"
        ? ""
        : `<label for="draft-date">Date</label><input id="draft-date" type="date" data-action="draft-date" value="${esc(draft.date)}"${described("date")} />${fieldError("date-error", err.date)}${draft.warning ? `<p class="quiet">${esc(draft.warning)}</p>` : ""}`
    }
    <label for="draft-note">Note <span class="optional">(optional)</span></label>
    <input id="draft-note" data-action="draft-note" value="${esc(draft.note)}"${described("note")} />
    ${fieldError("note-error", err.note)}
    <fieldset>
      <legend>Faster entry</legend>
      <label for="draft-barcode">Sample barcode</label>
      <input id="draft-barcode" data-action="draft-barcode" inputmode="numeric" value="${esc(draft.barcode)}" />
      <button type="button" data-action="lookup-barcode">Find sample product</button>
      <button type="button" data-action="show-receipt">Scan a receipt</button>
      ${draft.barcodeMessage ? `<p role="status">${esc(draft.barcodeMessage)}</p>` : ""}
      <p class="quiet">Try 000000111111 or 000000222222. A result is not saved until you press ${esc(submitLabel)}.</p>
    </fieldset>
    <div class="actions">
      <button type="submit" class="primary">${esc(submitLabel)}</button>
      <a class="button" href="#/pantry">Cancel</a>
    </div>
  </form>`;
}

function pageAdd(model: Model): string {
  const editing = model.route.name === "edit";
  return shell(model, editing ? "Edit item" : "Add item", draftForm(model, editing ? "Save changes" : "Save item"));
}

function pageItem(model: Model): string {
  if (model.route.name !== "item") return pageMissing(model);
  const itemId = model.route.id;
  const current = model.state.items.find((entry) => entry.id === itemId);
  if (!current) return shell(model, "Item not found", `<p>That item is not in this pantry.</p><a href="#/pantry">Back to the pantry</a>`);
  const attention = classifyItem(current, model.today, model.state.reminders.leadDays);
  const elsewhere = model.state.items.find(
    (entry) => entry.id !== current.id && namesMatch(entry.name, current.name),
  );
  let preview = "";
  if (current.quantity != null && model.ui.consumeAmount.trim() !== "") {
    const amount = Number(model.ui.consumeAmount);
    if (Number.isFinite(amount) && amount > 0 && amount < current.quantity) {
      preview = `${formatQuantity(current.quantity, current.unit)} becomes ${formatQuantity(Number((current.quantity - amount).toFixed(2)), current.unit)}.`;
    } else if (Number.isFinite(amount) && amount >= current.quantity) {
      preview = "This removes the item.";
    }
  }
  const consume =
    current.quantity == null
      ? `<p>Quantity was never set. You can remove the item. FreshLoop will not invent how much is left.</p>`
      : `<form data-action="consume-one">
          <label for="consume-amount">Amount to mark consumed (${esc(current.unit ?? "units")})</label>
          <input id="consume-amount" data-action="consume-amount" inputmode="decimal" value="${esc(model.ui.consumeAmount)}" />
          ${preview ? `<p>${esc(preview)}</p>` : ""}
          ${model.ui.consumeError ? `<p class="field-error" role="alert">${esc(model.ui.consumeError)}</p>` : ""}
          <button type="submit" class="primary">Update inventory</button>
        </form>`;
  const body = `
    <p>${itemChip(current, model.today, model.state.reminders.leadDays)}</p>
    <p>${esc(attention.detail)}</p>
    <dl class="facts">
      <div><dt>Quantity</dt><dd>${esc(formatQuantity(current.quantity, current.unit))}</dd></div>
      <div><dt>Location</dt><dd>${locationLabel(current.location)}</dd></div>
      <div><dt>Date type</dt><dd>${esc(current.dateKind === "none" ? "No date" : current.dateKind)}</dd></div>
      <div><dt>Date</dt><dd>${current.date ? esc(formatDate(current.date)) : "None entered"}</dd></div>
    </dl>
    ${current.note ? `<p>Note: ${esc(current.note)}</p>` : ""}
    ${elsewhere ? `<p class="quiet">You also have ${esc(elsewhere.name)} in the ${esc(elsewhere.location)}.</p>` : ""}
    <h2>Mark consumed</h2>
    ${consume}
    <div class="actions">
      <a class="button" href="#/edit/${esc(current.id)}">Edit</a>
      <button type="button" class="danger" data-action="remove-item" data-id="${esc(current.id)}">Remove</button>
    </div>`;
  return shell(model, current.name, body);
}

function recipeCards(model: Model): string {
  const { state, ui, today } = model;
  const query = ui.cookQuery.trim().toLowerCase();
  let hidden = 0;
  const ranked = RECIPES.map((recipe) => {
    const reason = recipeHidden(recipe, state.diet);
    const matches = matchRecipe(recipe, state.items, { servings: recipe.servings, assumeStaples: state.assumeStaples });
    const attention = usesAttentionItem(matches, today, state.reminders.leadDays);
    return { recipe, reason, matches, attention };
  })
    .filter((entry) => {
      if (entry.reason) {
        hidden += 1;
        return false;
      }
      if (query && !entry.recipe.title.toLowerCase().includes(query)) return false;
      if (ui.useSoonOnly && entry.attention.length === 0) return false;
      return true;
    })
    .sort((a, b) => b.attention.length - a.attention.length || a.recipe.title.localeCompare(b.recipe.title));

  const cards = ranked
    .map(({ recipe, matches, attention }) => {
      const missing = matches.filter((match) => match.status === "missing").length;
      const check = matches.filter((match) => match.status === "check").length;
      const have = matches.filter((match) => match.status === "have" || match.status === "short").length;
      const tags = attention
        .map((item) => `${item.name} · ${classifyItem(item, today, state.reminders.leadDays).label}`)
        .join(", ");
      return `<article class="card">
        <h2><a href="#/recipe/${esc(recipe.id)}">${esc(recipe.title)}</a></h2>
        <p>${recipe.minutes} min · listed for ${recipe.servings} servings</p>
        <p>Uses ${have} pantry items · ${missing} missing · ${check} to check</p>
        ${tags ? `<p>${esc(tags)}</p>` : ""}
      </article>`;
    })
    .join("");

  const hiddenNote =
    hidden > 0
      ? `<p>${hidden} sample ${hidden === 1 ? "recipe is" : "recipes are"} hidden by your diet filters. ${esc(COPY.dietDisclaimer)}</p><button type="button" data-action="clear-diet">Clear diet filters</button>`
      : "";
  return `${hiddenNote}${cards || "<p>No sample recipes are left with these filters.</p>"}<p class="quiet" role="status">Showing ${ranked.length} sample recipes.</p>`;
}

function dietFields(model: Model): string {
  const diet = model.state.diet;
  const box = (key: string, label: string, checked: boolean) =>
    `<label class="choice"><input type="checkbox" data-action="diet" data-diet="${key}"${checked ? " checked" : ""} /> ${label}</label>`;
  return `<fieldset>
    <legend>Diet filters</legend>
    ${box("vegetarian", "Vegetarian", diet.vegetarian)}
    ${box("vegan", "Vegan", diet.vegan)}
    ${box("hideGlutenListed", "Hide recipes that list gluten", diet.hideGlutenListed)}
    ${box("hideDairyListed", "Hide recipes that list dairy", diet.hideDairyListed)}
    ${box("hideNutsListed", "Hide recipes that list nuts", diet.hideNutsListed)}
    <p class="quiet">${esc(COPY.dietDisclaimer)}</p>
  </fieldset>`;
}

function pageCook(model: Model): string {
  const empty = model.state.items.length === 0 && !model.ui.browseCatalog;
  const body = `
    <p class="lede">Recipes are chosen from the sample catalog using your pantry, not from a general feed.</p>
    <p>${esc(COPY.safety)}</p>
    ${dietFields(model)}
    <label class="choice"><input type="checkbox" data-action="use-soon-only"${model.ui.useSoonOnly ? " checked" : ""} /> Only recipes that use a Use soon or Date passed item</label>
    <label for="cook-query">Search sample recipes</label>
    <input id="cook-query" data-action="cook-query" value="${esc(model.ui.cookQuery)}" autocomplete="off" />
    ${
      empty
        ? `<section class="hero"><h2>Nothing to match yet</h2><p>Add an ingredient, or try the sample kitchen. Browsing the catalog now would not be based on your food.</p><button type="button" data-action="browse-catalog">Browse sample recipes anyway</button></section>`
        : recipeCards(model)
    }`;
  return shell(model, "Cook from the pantry", body);
}

function pageRecipe(model: Model): string {
  if (model.route.name !== "recipe") return pageMissing(model);
  const recipe = recipeById(model.route.id);
  if (!recipe) return shell(model, "Recipe not found", `<p>That recipe is not in the sample catalog.</p><a href="#/cook">Back to Cook</a>`);
  const servings = model.ui.servings[recipe.id] ?? recipe.servings;
  const matches = matchRecipe(recipe, model.state.items, { servings, assumeStaples: model.state.assumeStaples });
  const hidden = recipeHidden(recipe, model.state.diet);
  const rows = matches
    .map((match) => {
      const attention = match.pantryItems[0]
        ? classifyItem(match.pantryItems[0], model.today, model.state.reminders.leadDays)
        : null;
      const amount =
        match.ingredient.quantity == null
          ? "Amount not listed"
          : formatQuantity(match.ingredient.quantity * (servings / recipe.servings), match.ingredient.unit);
      return `<li class="match match-${match.status}">
        <span class="item-name">${esc(match.ingredient.name)}${match.ingredient.optional ? " (optional)" : ""}</span>
        <span>${esc(amount)}</span>
        <span class="status status-${match.status}">${esc(match.status === "staple-assumed" ? "Staple" : match.status === "optional-missing" ? "Optional" : match.status === "have" ? "Have" : match.status === "short" ? "Short" : match.status === "check" ? "Check" : "Missing")}</span>
        ${attention ? statusChip(attention) : ""}
        <p>${esc(match.reason)}</p>
      </li>`;
    })
    .join("");
  const body = `
    <p>${recipe.minutes} min · ${esc(recipe.summary)}</p>
    ${hidden ? `<p class="banner">${esc(hidden)} You can still read it. ${esc(COPY.dietDisclaimer)}</p>` : `<p class="quiet">${esc(COPY.dietDisclaimer)}</p>`}
    <div class="stepper">
      <button type="button" data-action="servings" data-id="${esc(recipe.id)}" data-delta="-1" ${servings <= 1 ? "disabled" : ""}>Fewer servings</button>
      <p id="servings-label">${servings} servings</p>
      <button type="button" data-action="servings" data-id="${esc(recipe.id)}" data-delta="1" ${servings >= 12 ? "disabled" : ""}>More servings</button>
    </div>
    <h2>Ingredients against your pantry</h2>
    <ul class="list">${rows}</ul>
    <div class="actions">
      <button type="button" class="primary" data-action="open-review-recipe" data-id="${esc(recipe.id)}">Shop for what's missing</button>
      <a class="button" href="#/cooked/${esc(recipe.id)}">I cooked this</a>
    </div>
    <h2>Steps</h2>
    <ol>${recipe.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
    <p class="quiet">${esc(recipe.sourceNote)}</p>`;
  return shell(model, recipe.title, body);
}

function reviewGroup(title: string, lines: ShoppingDraftLine[]): string {
  if (lines.length === 0) return "";
  const rows = lines
    .map((line) => {
      const qty = line.quantity == null ? "" : String(line.quantity);
      return `<li>
        <label class="choice"><input type="checkbox" data-action="toggle-line" data-key="${esc(line.key)}"${line.include ? " checked" : ""} /> On the list</label>
        <span class="item-name">${esc(line.name)}</span>
        <label for="line-${esc(line.key).replace(/\s+/g, "-")}">Amount</label>
        <input id="line-${esc(line.key).replace(/\s+/g, "-")}" data-action="line-qty" data-key="${esc(line.key)}" inputmode="decimal" value="${esc(qty)}" />
        <span>${line.unit ? esc(line.unit) : "No unit"}</span>
        <p>${esc(line.note)}</p>
      </li>`;
    })
    .join("");
  return `<section><h2>${esc(title)}</h2><ul class="list">${rows}</ul></section>`;
}

function pageShop(model: Model): string {
  const { state, ui } = model;
  const rows =
    state.shop.length === 0
      ? `<section class="hero"><h2>Nothing to buy yet</h2><p>Choose a recipe or a dinner plan. FreshLoop will show what it left off before anything is added here.</p><a class="button" href="#/cook">Find a recipe</a></section>`
      : `<ul class="list">${state.shop
          .map((item) => {
            const qty = item.quantity == null ? "" : String(item.quantity);
            return `<li>
              <label class="choice"><input type="checkbox" data-action="shop-check" data-id="${esc(item.id)}"${item.checked ? " checked" : ""} /> Got it</label>
              <span class="item-name">${esc(item.name)}</span>
              <label for="shop-${esc(item.id)}">Amount</label>
              <input id="shop-${esc(item.id)}" data-action="shop-qty" data-id="${esc(item.id)}" inputmode="decimal" value="${esc(qty)}" />
              <span>${item.unit ? esc(item.unit) : "No unit"}</span>
              <p>${esc(item.note)}</p>
              <p class="quiet">${esc(item.source)}</p>
              <button type="button" data-action="shop-delete" data-id="${esc(item.id)}">Delete</button>
            </li>`;
          })
          .join("")}</ul>
        <button type="button" data-action="open-move-shop" ${state.shop.some((item) => item.checked) ? "" : "disabled"}>Move checked items into the pantry</button>`;
  const body = `
    <p>${esc(COPY.quantityHonesty)}</p>
    ${rows}
    <h2>Add an item yourself</h2>
    <form data-action="shop-add">
      <label for="shop-name">Name</label>
      <input id="shop-name" data-action="shop-name" value="${esc(ui.shopName)}" autocomplete="off" />
      <label for="shop-qty-new">Amount <span class="optional">(optional)</span></label>
      <input id="shop-qty-new" data-action="shop-qty-new" inputmode="decimal" value="${esc(ui.shopQty)}" />
      <label for="shop-unit-new">Unit</label>
      <select id="shop-unit-new" data-action="shop-unit-new">${unitOptions(ui.shopUnit)}</select>
      <button type="submit" class="primary">Add to list</button>
    </form>`;
  return shell(model, "Shopping list", body);
}

function pagePlan(model: Model): string {
  const body = `
    <p class="lede">Plan up to four dinners. A combined list subtracts each pantry amount once.</p>
    <p class="quiet">${esc(COPY.safety)}</p>
    ${model.state.plan
      .map((slot) => {
        const options = [`<option value="">No dinner planned</option>`]
          .concat(
            RECIPES.map((recipe) => {
              const hidden = recipeHidden(recipe, model.state.diet);
              const suffix = hidden ? " — lists a filtered ingredient" : "";
              return `<option value="${esc(recipe.id)}"${slot.recipeId === recipe.id ? " selected" : ""}>${esc(recipe.title + suffix)}</option>`;
            }),
          )
          .join("");
        return `<section class="card">
          <h2>${esc(formatDate(slot.date))}</h2>
          <label for="plan-${esc(slot.date)}">Dinner</label>
          <select id="plan-${esc(slot.date)}" data-action="plan-recipe" data-date="${esc(slot.date)}">${options}</select>
          <label for="plan-servings-${esc(slot.date)}">Servings</label>
          <input id="plan-servings-${esc(slot.date)}" data-action="plan-servings" data-date="${esc(slot.date)}" inputmode="numeric" value="${esc(slot.servings)}" />
        </section>`;
      })
      .join("")}
    <button type="button" class="primary" data-action="open-review-plan">Build a shopping list for this plan</button>`;
  return shell(model, "Four-day dinner plan", body);
}

function pageCooked(model: Model): string {
  if (model.route.name !== "cooked" || !model.ui.cook) {
    return shell(model, "Update the pantry", `<p>Choose a recipe first.</p><a href="#/cook">Back to Cook</a>`);
  }
  const cook = model.ui.cook;
  const recipe = recipeById(cook.recipeId);
  const rows = cook.rows
    .map((row) => {
      const item = model.state.items.find((entry) => entry.id === row.itemId);
      if (!item) return "";
      const attention = classifyItem(item, model.today, model.state.reminders.leadDays);
      let preview = "Left unchanged.";
      if (row.remove) preview = "This removes the item.";
      else if (!row.skip && row.amount.trim() !== "" && item.quantity != null) {
        const amount = Number(row.amount);
        if (Number.isFinite(amount) && amount > 0) {
          const left = item.quantity - amount;
          preview = left <= 0 ? "This removes the item." : `${formatQuantity(item.quantity, item.unit)} becomes ${formatQuantity(Number(left.toFixed(2)), item.unit)}.`;
        }
      }
      return `<li>
        <span class="item-name">${esc(item.name)}</span>
        ${statusChip(attention)}
        <p>In pantry: ${esc(formatQuantity(item.quantity, item.unit))}</p>
        <label for="cook-${esc(row.itemId)}">Amount to subtract</label>
        <input id="cook-${esc(row.itemId)}" data-action="cook-amount" data-id="${esc(row.itemId)}" inputmode="decimal" value="${esc(row.amount)}" ${row.skip || row.remove || item.quantity == null ? "disabled" : ""} />
        <label class="choice"><input type="checkbox" data-action="cook-skip" data-id="${esc(row.itemId)}"${row.skip ? " checked" : ""} /> Leave unchanged</label>
        <label class="choice"><input type="checkbox" data-action="cook-remove" data-id="${esc(row.itemId)}"${row.remove ? " checked" : ""} /> Remove item</label>
        <p>${esc(preview)}</p>
        ${row.error ? `<p class="field-error" role="alert">${esc(row.error)}</p>` : `<p class="quiet">${esc(row.amount === "" && item.quantity == null ? "Quantity was never set. FreshLoop can remove the item or leave it." : "")}</p>`}
      </li>`;
    })
    .join("");
  const skipped = cook.skipped.map((skip) => `<li>${esc(skip.message)}</li>`).join("");
  const body = `
    <p class="lede">These amounts will be subtracted for ${recipe ? esc(recipe.title) : "this recipe"} at ${cook.servings} servings. Change anything that looks wrong.</p>
    <p>${esc(COPY.safety)}</p>
    ${cook.formError ? `<p class="field-error" role="alert">${esc(cook.formError)}</p>` : ""}
    <ul class="list">${rows}</ul>
    ${skipped ? `<h2>Not changed</h2><ul>${skipped}</ul>` : ""}
    <div class="actions">
      <button type="button" class="primary" data-action="apply-cooked">Update pantry</button>
      <a class="button" href="#/recipe/${esc(cook.recipeId)}">Cancel</a>
    </div>`;
  return shell(model, "Update the pantry?", body);
}

function pageSettings(model: Model): string {
  const { state } = model;
  const reminders = state.reminders;
  const permission =
    reminders.permission === "denied"
      ? `<p class="banner" role="status">Reminders stay off. You chose not to allow them. FreshLoop will still show Use soon while you are here.</p><button type="button" data-action="open-permission">Ask again</button>`
      : reminders.enabled
        ? `<p role="status">In-app reminders are on. ${esc(COPY.reminderLimit)}</p><button type="button" data-action="disable-reminders">Turn off reminders</button>`
        : `<p>Reminders are off.</p><button type="button" data-action="open-permission">Turn on reminders</button>`;
  const body = `
    <section>
      <h2>Kitchen name</h2>
      <label for="kitchen-name">Name on this device</label>
      <input id="kitchen-name" data-action="kitchen-name" value="${esc(state.kitchenName)}" />
      <p class="quiet">One kitchen on this device. Sharing with other people is not part of this prototype.</p>
    </section>
    <section>
      <h2>Use-soon window</h2>
      <label for="lead-days">Mark best-before and use-by dates inside</label>
      <select id="lead-days" data-action="lead-days">
        ${[1, 2, 3, 7].map((days) => `<option value="${days}"${reminders.leadDays === days ? " selected" : ""}>${days} days</option>`).join("")}
      </select>
      <p class="quiet">This changes the Use soon list. It does not send a notification by itself.</p>
    </section>
    <section>
      <h2>Reminders</h2>
      ${permission}
    </section>
    ${dietFields(model)}
    <section>
      <h2>Staples</h2>
      <label class="choice"><input type="checkbox" data-action="staples"${state.assumeStaples ? " checked" : ""} /> Treat salt, pepper, and water as already at home</label>
      <p class="quiet">${esc(COPY.staplesNote)}</p>
    </section>
    <section>
      <h2>Food dates</h2>
      <p>${esc(COPY.safetyLong)}</p>
      <p>This prototype uses best-before, use-by, and opened-on. Those labels are a pilot assumption for an English-language concept.</p>
      <p><a href="${COPY.fsisUrl}">Food product dating (USDA FSIS)</a></p>
      <p><a href="${COPY.foodKeeperUrl}">FoodKeeper (FoodSafety.gov)</a></p>
      <p class="quiet">FreshLoop links to those pages and does not apply their storage times for you.</p>
    </section>
    <section>
      <h2>Sample kitchen</h2>
      <button type="button" data-action="open-replace-sample">Load the sample kitchen</button>
      <button type="button" data-action="open-clear-pantry">Empty the pantry</button>
    </section>
    <section>
      <h2>Your data</h2>
      <p>Items, the shopping list, the meal plan, and these settings stay in this browser under the key freshloop.v1. They are not encrypted and not uploaded.</p>
      <button type="button" data-action="export-data">Download a JSON copy</button>
      <button type="button" class="danger" data-action="open-delete">Delete data on this device</button>
      <p><a href="#/welcome">Read the limits again</a></p>
    </section>`;
  return shell(model, "Settings", body);
}

function pageRecovery(model: Model): string {
  const body = `
    <p>FreshLoop found a saved record and could not use it. It has not been erased.</p>
    <div class="actions">
      <button type="button" data-action="download-corrupt">Download the saved text</button>
      <button type="button" class="danger" data-action="erase-corrupt">Erase and start over</button>
    </div>`;
  return shell(model, "Saved data could not be read", body, false);
}

function pageMissing(model: Model): string {
  return shell(model, "Page not found", `<p>That page is not in FreshLoop.</p><a href="#/pantry">Go to the pantry</a>`);
}

function dialogHtml(model: Model): string {
  const dialog = model.ui.dialog;
  if (!dialog) return "";
  let title = "";
  let body = "";
  let actions = "";
  if (dialog.type === "duplicate") {
    const existing = model.state.items.find((item) => item.id === dialog.existingId);
    title = existing ? `${existing.name} is already in the ${existing.location}` : "Possible duplicate";
    const canMerge = existing ? Boolean(mergeAllowed(existing, dialog.pending)) : false;
    body = existing
      ? `<p>You already have ${esc(existing.name)} in the ${esc(existing.location)} (${esc(formatQuantity(existing.quantity, existing.unit))}).</p>${canMerge ? "" : "<p>Units differ, or a quantity is missing, so FreshLoop will not combine them.</p>"}`
      : "";
    actions = `${canMerge ? '<button type="button" class="primary" data-action="add-to-existing" data-autofocus>Add to the existing item</button>' : ""}<button type="button" data-action="save-separate" ${canMerge ? "" : "data-autofocus"}>Save as a separate item</button><button type="button" data-action="cancel-dialog">Go back</button>`;
  } else if (dialog.type === "remove-item") {
    title = "Remove this item?";
    body = "<p>It will leave the pantry on this device.</p>";
    actions = `<button type="button" class="danger" data-action="confirm-remove" data-autofocus>Remove</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "batch-remove") {
    title = `Remove ${model.ui.selected.length} items?`;
    body = "<p>They will leave the pantry on this device.</p>";
    actions = `<button type="button" class="danger" data-action="confirm-batch-remove" data-autofocus>Remove</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "batch-consume") {
    title = "Mark selected items consumed?";
    body = "<p>This removes each selected item. Partial amounts are not calculated in a batch.</p>";
    actions = `<button type="button" class="danger" data-action="confirm-batch-consume" data-autofocus>Remove selected</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "delete-all") {
    title = "Delete the pantry on this device?";
    body = "<p>This removes items, the shopping list, the meal plan, and settings stored in this browser. Nothing is uploaded, so other devices are not affected.</p>";
    actions = `<button type="button" class="danger" data-action="confirm-delete" data-autofocus>Delete data</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "permission") {
    title = "Allow in-app reminders?";
    body = `<p>FreshLoop would remind you about best-before and use-by dates you entered, while this page is open.</p><p>${esc(COPY.reminderLimit)}</p>`;
    actions = `<button type="button" class="primary" data-action="allow-reminders" data-autofocus>Allow reminders</button><button type="button" data-action="deny-reminders">Don't allow</button>`;
  } else if (dialog.type === "replace-sample") {
    title = "Load the sample kitchen?";
    body = "<p>This replaces the current pantry with fictional items. Your current items will be removed from this browser.</p>";
    actions = `<button type="button" class="primary" data-action="confirm-replace-sample" data-autofocus>Replace with sample items</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "clear-pantry") {
    title = "Empty the pantry?";
    body = "<p>Items will be removed from this browser. Recipes in the sample catalog stay available.</p>";
    actions = `<button type="button" class="danger" data-action="confirm-clear-pantry" data-autofocus>Empty pantry</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "move-shop") {
    title = "Move checked items into the pantry?";
    body = `<p>No date is copied. Quantities stay blank when the list has no amount.</p>
      <label for="move-location">Put them in</label>
      <select id="move-location" data-action="move-location">${locationOptions(model.ui.moveLocation)}</select>`;
    actions = `<button type="button" class="primary" data-action="confirm-move-shop" data-autofocus>Add to pantry</button><button type="button" data-action="cancel-dialog">Cancel</button>`;
  } else if (dialog.type === "receipt") {
    title = "Receipt scanning is not connected";
    body = `<p>${esc(COPY.receiptUnavailable)}</p>`;
    actions = `<button type="button" class="primary" data-action="cancel-dialog" data-autofocus>Add items myself</button>`;
  }
  return `<div class="backdrop"><div role="dialog" aria-modal="true" aria-labelledby="dialog-title"><h2 id="dialog-title">${esc(title)}</h2>${body}<div class="actions">${actions}</div></div></div>`;
}

function mergeAllowed(existing: PantryItem, pending: { quantity: number | null; unit: Unit | null }): boolean {
  if (pending.quantity == null) return true;
  if (existing.quantity == null || existing.unit == null || pending.unit == null) return false;
  return existing.unit === pending.unit || Boolean(convertSame(existing.unit, pending.unit));
}

function convertSame(a: Unit, b: Unit): boolean {
  if (a === b) return true;
  const mass = a === "g" || a === "kg";
  const massB = b === "g" || b === "kg";
  const volume = a === "ml" || a === "l" || a === "tsp" || a === "tbsp" || a === "cup";
  const volumeB = b === "ml" || b === "l" || b === "tsp" || b === "tbsp" || b === "cup";
  if (mass && massB) return true;
  if (volume && volumeB) return true;
  return false;
}

function lineOptional(line: ShoppingDraftLine): boolean {
  return line.status === "optional-missing" || line.note.startsWith("Optional");
}

function pageReviewFixed(model: Model): string {
  const review = model.ui.review;
  if (!review) {
    return shell(
      model,
      "Check the list before you shop",
      `<p>There is no list to review.</p><a href="#/cook">Choose a recipe</a>`,
    );
  }
  const optional = review.lines.filter((line) => !line.include && lineOptional(line));
  const on = review.lines.filter((line) => line.include);
  const covered = review.lines.filter((line) => !line.include && line.status === "have");
  const staples = review.lines.filter((line) => !line.include && line.status === "staple-assumed");
  const rest = review.lines.filter(
    (line) => !on.includes(line) && !covered.includes(line) && !staples.includes(line) && !optional.includes(line),
  );
  const body = `
    <p class="lede">${esc(COPY.quantityHonesty)}</p>
    <p>Source: ${esc(review.sourceLabel)}</p>
    ${reviewGroup("On the shopping list", on)}
    ${on.length === 0 ? "<p>Nothing is selected to buy. Review what was left off before you decide.</p>" : ""}
    ${reviewGroup("Left off because the pantry covers them", covered)}
    ${reviewGroup("Left off as staples", staples)}
    ${reviewGroup("Optional, left off", optional)}
    ${reviewGroup("Left off", rest)}
    <div class="actions">
      <button type="button" class="primary" data-action="commit-review" ${on.length === 0 ? "disabled" : ""}>Add selected items to my list</button>
      <button type="button" data-action="discard-review">Discard this review</button>
    </div>`;
  return shell(model, review.title, body);
}

export function renderPage(model: Model): { title: string; html: string } {
  switch (model.route.name) {
    case "welcome":
      return { title: "Welcome", html: pageWelcome(model) };
    case "pantry":
      return { title: "Pantry", html: pagePantry(model) };
    case "use-soon":
      return { title: "Use soon", html: pageUseSoon(model) };
    case "add":
    case "edit":
      return { title: model.route.name === "edit" ? "Edit item" : "Add item", html: pageAdd(model) };
    case "item":
      return { title: "Item", html: pageItem(model) };
    case "cook":
      return { title: "Cook", html: pageCook(model) };
    case "recipe": {
      const recipe = model.route.name === "recipe" ? recipeById(model.route.id) : undefined;
      return { title: recipe?.title ?? "Recipe", html: pageRecipe(model) };
    }
    case "review":
      return { title: "Review list", html: pageReviewFixed(model) };
    case "shop":
      return { title: "Shopping list", html: pageShop(model) };
    case "plan":
      return { title: "Meal plan", html: pagePlan(model) };
    case "cooked":
      return { title: "Update pantry", html: pageCooked(model) };
    case "settings":
      return { title: "Settings", html: pageSettings(model) };
    case "recovery":
      return { title: "Saved data", html: pageRecovery(model) };
    default:
      return { title: "Not found", html: pageMissing(model) };
  }
}
