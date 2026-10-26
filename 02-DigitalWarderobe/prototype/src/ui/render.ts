import { hasActiveFilters, matchItems } from "../filters";
import {
  categoryLabel,
  colorLabel,
  currencyLabel,
  displayDate,
  formalityLabel,
  formatMoney,
  occasionLabel,
  seasonLabel,
  weatherLabel,
} from "../labels";
import { costPerWear } from "../money";
import { categoryHeading, consolidatePacking, packingSummary } from "../packing";
import { suggestOutfits } from "../suggest";
import { CATEGORIES, COLORS, OCCASIONS, SEASONS, WEATHERS } from "../types";
import type {
  AppState,
  Category,
  Item,
  ItemDraft,
  Occasion,
  OutfitDraft,
  Season,
  SuggestDraft,
  TripDraft,
  WeatherPref,
} from "../types";
import { canSaveOutfit, outfitSignature } from "../wardrobe";
import { esc, garment, photoOrGarment } from "./markup";

const CATEGORY_ORDER: Category[] = [
  "outerwear",
  "top",
  "dress",
  "bottom",
  "shoes",
  "bag",
  "accessory",
];

function findItem(state: AppState, id: string): Item | undefined {
  return state.items.find((item) => item.id === id);
}

function orderedItems(ids: string[], items: Item[]): Item[] {
  const known = ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is Item => Boolean(item));
  return known.sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
      a.name.localeCompare(b.name),
  );
}

export function renderApp(state: AppState): string {
  const showNav = state.prefs.onboarded && state.route.name !== "welcome";
  return `<div class="shell ${showNav ? "with-nav" : ""}">
    ${state.offline ? `<div class="banner banner-offline" role="status">You're offline. Your wardrobe is saved on this device and still works.</div>` : ""}
    <header class="topbar">
      <a class="wordmark" href="${state.prefs.onboarded ? "#/wardrobe" : "#/welcome"}">Rewear</a>
      <p class="prototype-note">Portfolio prototype · stays on this device</p>
    </header>
    ${sampleBanner(state)}
    <main id="main" tabindex="-1">
      <h1 id="screen-title" tabindex="-1">${esc(title(state))}</h1>
      ${screen(state)}
    </main>
    ${toast(state)}
    ${showNav ? nav(state) : ""}
    ${overlay(state)}
  </div>`;
}

function title(state: AppState): string {
  const route = state.route;
  if (route.name === "item") {
    const id = route.id;
    return findItem(state, id)?.name ?? "Item";
  }
  if (route.name === "outfit") {
    const id = route.id;
    return state.outfits.find((outfit) => outfit.id === id)?.name ?? "Outfit";
  }
  if (route.name === "trip") {
    const id = route.id;
    return state.trips.find((trip) => trip.id === id)?.name ?? "Packing list";
  }
  if (state.route.name === "welcome") return "Create more outfits from clothes you already own.";
  if (state.route.name === "item-form") return state.route.id ? "Edit item" : "Add item";
  if (state.route.name === "outfit-form") return state.route.id ? "Edit outfit" : "New outfit";
  if (state.route.name === "trip-form") return state.route.id ? "Edit trip" : "New trip";
  if (state.route.name === "suggest") return "Suggestions";
  if (state.route.name === "outfits") return "Outfits";
  if (state.route.name === "trips") return "Trips";
  if (state.route.name === "settings") return "Settings";
  return "Wardrobe";
}

function sampleBanner(state: AppState): string {
  if (!state.prefs.sampleBanner || !state.items.some((item) => item.sample)) return "";
  return `<div class="banner">
    <p><strong>Sample wardrobe.</strong> These 12 items are illustrative, so you can try outfits before adding your own.</p>
    <button type="button" class="text-button" data-action="dismiss-sample">Dismiss</button>
  </div>`;
}

function toast(state: AppState): string {
  if (!state.toast) return "";
  return `<div class="toast" role="status">
    <p>${esc(state.toast)}</p>
    <div class="toast-actions">
      ${state.undo ? `<button type="button" data-action="undo">Undo</button>` : ""}
      <button type="button" data-action="dismiss-toast">Close</button>
    </div>
  </div>`;
}

function nav(state: AppState): string {
  const current = state.route.name;
  const item = (href: string, id: string, label: string, on: boolean) =>
    `<a href="${href}" ${on ? 'aria-current="page"' : ""}>${icon(id)}<span>${label}</span></a>`;
  return `<nav class="nav" aria-label="Primary">
    ${item("#/wardrobe", "wardrobe", "Wardrobe", current === "wardrobe" || current === "item" || current === "item-form")}
    ${item("#/outfits", "outfits", "Outfits", current === "outfits" || current === "outfit" || current === "outfit-form" || current === "suggest")}
    ${item("#/trips", "trips", "Trips", current === "trips" || current === "trip" || current === "trip-form")}
    ${item("#/settings", "settings", "You", current === "settings")}
  </nav>`;
}

function icon(name: string): string {
  const paths: Record<string, string> = {
    wardrobe: "M4 6h12v14H4z M8 6V4h4v2",
    outfits: "M4 14 8 5l4 9M12 14l4-6 4 6",
    trips: "M3 8h14v9H3z M7 8V6h6v2",
    settings: "M12 8a4 4 0 1 0 0.01 0z",
  };
  return `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="${paths[name]}" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
}

function screen(state: AppState): string {
  switch (state.route.name) {
    case "welcome":
      return welcome();
    case "wardrobe":
      return wardrobe(state);
    case "item-form":
      return state.draft?.mode === "item" ? itemForm(state, state.draft) : missing("item");
    case "item":
      return itemDetail(state, state.route.id);
    case "outfits":
      return outfits(state);
    case "outfit-form":
      return state.draft?.mode === "outfit" ? outfitForm(state, state.draft) : missing("outfit");
    case "outfit":
      return outfitDetail(state, state.route.id);
    case "suggest":
      return suggestions(state, state.draft?.mode === "suggest" ? state.draft : { mode: "suggest", occasion: "work", weather: "cold" });
    case "trips":
      return trips(state);
    case "trip-form":
      return state.draft?.mode === "trip" ? tripForm(state, state.draft) : missing("trip");
    case "trip":
      return tripDetail(state, state.route.id);
    case "settings":
      return settings(state);
  }
}

function missing(noun: string): string {
  return `<p class="lede">That ${noun} is not available.</p><p><a class="button" href="#/wardrobe">Back to wardrobe</a></p>`;
}

function welcome(): string {
  return `<p class="lede">Catalogue what you have, then build an outfit for an occasion or a trip. Photos are optional. Rewear does not comment on your body or tell you to buy more.</p>
  <div class="stack">
    <button type="button" class="button" data-action="start-sample">Look through a sample wardrobe</button>
    <button type="button" class="button button-secondary" data-action="start-empty">Start with an empty wardrobe</button>
    <a class="text-link" href="#/settings">How photos and data are stored</a>
  </div>
  <p class="fine">Photos stay in this browser. You can delete them at any time. Nothing is uploaded.</p>`;
}

function wardrobe(state: AppState): string {
  const matches = matchItems(state.items, state.filters);
  const activeCount = state.items.filter((item) => !item.archived).length;
  const archivedCount = state.items.filter((item) => item.archived).length;
  return `<div class="toolbar">
      <label class="search">
        <span class="sr-only">Search wardrobe</span>
        <input id="search-wardrobe" type="search" placeholder="Search name, note, or color" value="${esc(state.filters.query)}" data-field="query" />
      </label>
      <button type="button" class="button button-secondary" data-action="open-filters" aria-haspopup="dialog">Filters${filterCount(state)}</button>
      <a class="button" href="#/items/new">Add item</a>
    </div>
    <div class="chips" role="group" aria-label="Category">
      ${CATEGORIES.map((category) => chip("toggle-category", category, categoryLabel[category], state.filters.categories.includes(category))).join("")}
    </div>
    ${activeFilterNote(state)}
    <p class="count">${matches.length} ${matches.length === 1 ? "item" : "items"}${state.filters.archivedOnly ? " archived" : ` of ${activeCount} active`}</p>
    ${matches.length === 0 ? emptyWardrobe(state, activeCount, archivedCount) : `<div class="grid" role="list">${matches.map((item) => card(item)).join("")}</div>`}`;
}

function filterCount(state: AppState): string {
  const count =
    state.filters.colors.length +
    state.filters.seasons.length +
    (state.filters.archivedOnly ? 1 : 0);
  return count ? ` (${count})` : "";
}

function activeFilterNote(state: AppState): string {
  if (!hasActiveFilters(state.filters)) return "";
  const parts = [
    ...state.filters.categories.map((category) => categoryLabel[category]),
    ...state.filters.colors.map((color) => colorLabel[color]),
    ...state.filters.seasons.map((season) => seasonLabel[season]),
  ];
  if (state.filters.archivedOnly) parts.push("Archived");
  if (state.filters.query.trim()) parts.push(`“${state.filters.query.trim()}”`);
  return `<p class="filters-note">${esc(parts.join(" · "))} <button type="button" class="text-button" data-action="clear-filters">Clear filters</button></p>`;
}

function emptyWardrobe(state: AppState, activeCount: number, archivedCount: number): string {
  if (hasActiveFilters(state.filters)) {
    return `<div class="empty"><p>No items match these filters.</p><button type="button" class="button button-secondary" data-action="clear-filters">Clear filters</button></div>`;
  }
  if (state.filters.archivedOnly) {
    return `<div class="empty"><p>${archivedCount === 0 ? "No archived items." : "Nothing archived matches."}</p></div>`;
  }
  if (activeCount === 0) {
    return `<div class="empty">
      <p>Your wardrobe is empty.</p>
      <p>Add an item you already wear, or look through the sample wardrobe.</p>
      <a class="button" href="#/items/new">Add item</a>
      <button type="button" class="button button-secondary" data-action="start-sample">Look through a sample wardrobe</button>
    </div>`;
  }
  return `<div class="empty"><p>No items to show.</p></div>`;
}

function card(item: Item): string {
  const meta = `${categoryLabel[item.category]} · ${colorLabel[item.color]} · ${seasonLabel[item.season]}`;
  return `<a class="card" role="listitem" href="#/items/${esc(item.id)}">
    ${item.photoDataUrl ? `<img src="${esc(item.photoDataUrl)}" alt="" />` : garment(item.category, item.color)}
    <span class="card-copy">
      <span class="card-name">${esc(item.name)}</span>
      <span class="card-meta">${esc(meta)}</span>
      ${item.archived ? `<span class="pill">Archived</span>` : ""}
    </span>
  </a>`;
}

function chip(action: string, value: string, label: string, pressed: boolean): string {
  return `<button type="button" class="chip" id="chip-${esc(action)}-${esc(value)}" data-action="${action}" data-value="${esc(value)}" aria-pressed="${pressed ? "true" : "false"}">${esc(label)}</button>`;
}

function itemForm(state: AppState, draft: ItemDraft): string {
  const upload = state.upload;
  return `<form class="form" data-form="item">
    <p class="lede">A name, category, color, season, and how dressy it is are enough to save. A photo is optional, and it is not scanned.</p>
    ${draft.error ? `<p class="form-error" role="alert">${esc(draft.error)}</p>` : ""}
    ${field("Name", `<input id="field-name" data-field="name" required maxlength="60" value="${esc(draft.name)}" />`)}
    ${selectField("Category", "category", CATEGORIES, draft.category, categoryLabel)}
    ${selectField("Color", "color", COLORS, draft.color, colorLabel)}
    ${selectField("Season", "season", SEASONS, draft.season, seasonLabel)}
    ${selectField("Dressiness", "formality", ["casual", "smart", "formal"] as const, draft.formality, formalityLabel)}
    <p class="fine">Dressiness is only used to match an occasion. It is not a rule about you.</p>
    ${field("Notes, optional", `<textarea id="field-notes" data-field="notes" maxlength="280">${esc(draft.notes)}</textarea>`)}
    ${field("Price, optional", `<input id="field-price" data-field="price" inputmode="decimal" value="${esc(draft.price)}" />`, "Used only if you want cost per wear. Leave blank to skip.")}
    <fieldset class="photo-box">
      <legend>Photo, optional</legend>
      ${draft.photoDataUrl ? `<img class="preview" src="${esc(draft.photoDataUrl)}" alt="Selected item photo" />` : `<div class="preview preview-empty">${garment(draft.category, draft.color)}<p>No photo yet</p></div>`}
      ${upload.phase === "reading" ? `<div class="progress" style="--progress:${upload.progress}%" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${upload.progress}" aria-label="Photo preparation">${upload.progress}%</div>` : ""}
      ${upload.phase === "error" ? `<p class="form-error" role="alert">${esc(upload.message)}</p>` : ""}
      ${upload.phase === "idle" && upload.message ? `<p class="fine">${esc(upload.message)}</p>` : ""}
      <label class="button button-secondary file-button">Choose a photo<input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /></label>
      ${draft.photoDataUrl ? `<button type="button" class="button button-secondary" data-action="clear-draft-photo">Remove photo</button>` : ""}
      <p class="fine">If the photo fails, you can still save the item. Rewear does not detect color, size, or anything about you from the picture.</p>
      <details>
        <summary>Reviewer tools</summary>
        <button type="button" class="button button-secondary" data-action="preview-upload-failure">Preview a failed upload</button>
      </details>
    </fieldset>
    <div class="row-actions">
      <button type="submit" class="button" data-action="save-item">Save item</button>
      <a class="button button-secondary" href="${draft.id ? `#/items/${esc(draft.id)}` : "#/wardrobe"}">Cancel</a>
    </div>
  </form>`;
}

function selectField<T extends string>(
  label: string,
  fieldName: string,
  values: readonly T[],
  current: T,
  labels: Record<T, string>,
): string {
  return field(
    label,
    `<select id="field-${fieldName}" data-field="${fieldName}">${values
      .map((value) => `<option value="${esc(value)}" ${value === current ? "selected" : ""}>${esc(labels[value])}</option>`)
      .join("")}</select>`,
  );
}

function field(label: string, control: string, hint?: string): string {
  return `<label class="field"><span>${esc(label)}</span>${control}${hint ? `<span class="fine">${esc(hint)}</span>` : ""}</label>`;
}

function itemDetail(state: AppState, id: string): string {
  const item = findItem(state, id);
  if (!item) return missing("item");
  const cpw = costPerWear(item.price, item.wearCount);
  const money =
    cpw.status === "value"
      ? `${formatMoney(cpw.perWear, state.prefs.currency)} per wear`
      : cpw.status === "need-price"
        ? "Add a price to see cost per wear."
        : "Wear it once to start cost per wear.";
  const outfits = state.outfits.filter((outfit) => outfit.itemIds.includes(item.id));
  const worn =
    item.lastWorn == null
      ? "Not worn yet"
      : `Last worn ${displayDate(item.lastWorn)}`;
  return `<a class="back" href="#/wardrobe">Back to wardrobe</a>
    <div class="detail-hero">${photoOrGarment(item.photoDataUrl, item.category, item.color, item.name)}</div>
    <ul class="meta-list">
      <li>${esc(categoryLabel[item.category])}</li>
      <li>${esc(colorLabel[item.color])}</li>
      <li>${esc(seasonLabel[item.season])}</li>
      <li>${esc(formalityLabel[item.formality])}</li>
      ${item.archived ? `<li>Archived</li>` : ""}
    </ul>
    ${item.notes ? `<p>${esc(item.notes)}</p>` : ""}
    ${item.sample ? `<p class="fine">Sample item. Any price is an illustrative figure, entered as GBP.</p>` : ""}
    <section class="panel">
      <h2>Wear</h2>
      <p>${item.wearCount} ${item.wearCount === 1 ? "wear" : "wears"} logged. ${esc(worn)}.</p>
      <p>${esc(money)}${item.price != null ? ` Price entered: ${esc(formatMoney(item.price, state.prefs.currency))}.` : ""}</p>
      <p class="fine">Changing the currency in settings changes the symbol only. Amounts are not converted.</p>
      <button type="button" class="button" data-action="mark-worn" data-id="${esc(item.id)}">${item.lastWorn === localDay() ? "Log another wear" : "Mark worn today"}</button>
    </section>
    <section class="panel">
      <h2>In outfits</h2>
      ${outfits.length === 0 ? `<p>Not in a saved outfit yet.</p>` : `<ul class="plain-list">${outfits.map((outfit) => `<li><a href="#/outfits/${esc(outfit.id)}">${esc(outfit.name)}</a></li>`).join("")}</ul>`}
    </section>
    <div class="row-actions">
      <a class="button" href="#/items/${esc(item.id)}/edit">Edit</a>
      <button type="button" class="button button-secondary" data-action="toggle-archive" data-id="${esc(item.id)}">${item.archived ? "Restore" : "Archive"}</button>
      ${item.photoDataUrl ? `<button type="button" class="button button-secondary" data-action="ask-delete-photo" data-id="${esc(item.id)}">Delete photo</button>` : ""}
      <button type="button" class="button button-danger" data-action="ask-delete-item" data-id="${esc(item.id)}">Delete item</button>
    </div>`;
}

function outfits(state: AppState): string {
  if (state.outfits.length === 0) {
    return `<div class="empty">
      <p>No outfits saved yet.</p>
      <p>Build one from your items, or ask for a suggestion that explains why it matches.</p>
      <a class="button" href="#/outfits/new">New outfit</a>
      <a class="button button-secondary" href="#/suggest">Show suggestions</a>
    </div>`;
  }
  return `<div class="stack tight">
      <a class="button" href="#/outfits/new">New outfit</a>
      <a class="button button-secondary" href="#/suggest">Show suggestions</a>
    </div>
    <div class="stack">${state.outfits
      .map((outfit) => {
        const pieces = orderedItems(outfit.itemIds, state.items);
        return `<a class="outfit-row" href="#/outfits/${esc(outfit.id)}">
          <span class="mini-row">${pieces.slice(0, 4).map((item) => garment(item.category, item.color)).join("") || ""}</span>
          <span><strong>${esc(outfit.name)}</strong><span class="card-meta">${esc(occasionLabel[outfit.occasion])} · ${esc(weatherLabel[outfit.weather])} · ${pieces.length} ${pieces.length === 1 ? "item" : "items"}</span></span>
        </a>`;
      })
      .join("")}</div>`;
}

function outfitForm(state: AppState, draft: OutfitDraft): string {
  const active = state.items.filter((item) => !item.archived);
  const selected = orderedItems(draft.itemIds, state.items);
  const check = canSaveOutfit(draft.itemIds, state.items);
  const pickerQuery = draft.pickerQuery;
  const visible = active.filter((item) => {
    if (!pickerQuery.trim()) return true;
    return `${item.name} ${item.category} ${item.color}`.toLowerCase().includes(pickerQuery.trim().toLowerCase());
  });
  return `<form class="form" data-form="outfit">
    <a class="back" href="${draft.id ? `#/outfits/${esc(draft.id)}` : "#/outfits"}">Back</a>
    <p class="lede">Choose an occasion and a weather preference, then select items you own.</p>
    ${draft.error ? `<p class="form-error" role="alert">${esc(draft.error)}</p>` : ""}
    ${field("Outfit name, optional", `<input id="field-outfit-name" data-field="outfit-name" maxlength="60" value="${esc(draft.name)}" placeholder="Named from the occasion if you leave this blank" />`)}
    ${choiceGroup("Occasion", "occasion", OCCASIONS, draft.occasion, occasionLabel)}
    ${choiceGroup("Weather preference", "weather", WEATHERS, draft.weather, weatherLabel)}
    <p class="fine">Weather is a preference you choose. Rewear does not use your location.</p>
    <section class="panel">
      <h2>Selected</h2>
      ${selected.length === 0 ? `<p>Nothing selected yet.</p>` : `<ul class="plain-list">${selected.map((item) => `<li><span>${esc(item.name)}</span> <button type="button" id="remove-${esc(item.id)}" data-action="remove-outfit-item" data-id="${esc(item.id)}">Remove</button></li>`).join("")}</ul>`}
      ${selected.length > 0 && !check.ok ? `<p class="form-error">${esc(check.reason)}</p>` : ""}
      ${duplicateNote(selected)}
    </section>
    <label class="field"><span>Find an item</span><input id="field-picker" data-field="picker" value="${esc(pickerQuery)}" placeholder="Search your wardrobe" /></label>
    ${active.length === 0 ? `<div class="empty"><p>Add items before building an outfit.</p><a class="button" href="#/items/new">Add item</a></div>` : `<div class="pick-list">${visible.map((item) => {
      const on = draft.itemIds.includes(item.id);
      return `<button type="button" class="pick ${on ? "is-on" : ""}" id="pick-${esc(item.id)}" data-action="toggle-outfit-item" data-id="${esc(item.id)}" aria-pressed="${on ? "true" : "false"}">${garment(item.category, item.color)}<span>${esc(item.name)}<small>${esc(categoryLabel[item.category])}</small></span></button>`;
    }).join("")}</div>`}
    <div class="row-actions">
      <button type="submit" class="button" data-action="save-outfit">Save outfit</button>
      <a class="button button-secondary" href="${draft.id ? `#/outfits/${esc(draft.id)}` : "#/outfits"}">Cancel</a>
    </div>
  </form>`;
}

function duplicateNote(items: Item[]): string {
  const bottoms = items.filter((item) => item.category === "bottom").length;
  const dresses = items.filter((item) => item.category === "dress").length;
  const notes: string[] = [];
  if (bottoms > 1) notes.push("This outfit has more than one bottom.");
  if (dresses > 1) notes.push("This outfit has more than one dress.");
  if (!notes.length) return "";
  return `<p class="fine">${esc(notes.join(" "))} You can still save it.</p>`;
}

function choiceGroup<T extends string>(
  legend: string,
  fieldName: string,
  values: readonly T[],
  current: T,
  labels: Record<T, string>,
): string {
  return `<fieldset class="choices"><legend>${esc(legend)}</legend>${values
    .map(
      (value) =>
        `<label class="choice" for="${fieldName}-${esc(value)}"><input id="${fieldName}-${esc(value)}" type="radio" name="${fieldName}" data-field="${fieldName}" value="${esc(value)}" ${value === current ? "checked" : ""} /><span>${esc(labels[value])}</span></label>`,
    )
    .join("")}</fieldset>`;
}

function outfitDetail(state: AppState, id: string): string {
  const outfit = state.outfits.find((entry) => entry.id === id);
  if (!outfit) return missing("outfit");
  const pieces = orderedItems(outfit.itemIds, state.items);
  const missingIds = outfit.itemIds.filter((itemId) => !findItem(state, itemId));
  return `<a class="back" href="#/outfits">Back to outfits</a>
    <p class="lede">${esc(occasionLabel[outfit.occasion])} · ${esc(weatherLabel[outfit.weather])}${outfit.source === "suggestion" ? " · Saved from a suggestion" : ""}</p>
    ${outfit.notes ? `<p>${esc(outfit.notes)}</p>` : ""}
    <div class="stack">${pieces
      .map(
        (item) => `<a class="outfit-row" href="#/items/${esc(item.id)}">${photoOrGarment(item.photoDataUrl, item.category, item.color, item.name)}<span><strong>${esc(item.name)}</strong><span class="card-meta">${esc(categoryLabel[item.category])}${item.archived ? " · Archived" : ""}</span></span></a>`,
      )
      .join("")}
      ${missingIds.length ? `<p class="form-error">${missingIds.length} item${missingIds.length === 1 ? " is" : "s are"} no longer in the wardrobe.</p>` : ""}
    </div>
    ${outfit.factors.length ? `<section class="panel"><h2>Why this was suggested</h2><ul>${outfit.factors.map((factor) => `<li>${esc(factor)}</li>`).join("")}</ul></section>` : ""}
    ${pieces.some((item) => item.archived) ? `<p class="fine">Archived items stay in this outfit until you remove them. They are hidden from the wardrobe and from new outfits.</p>` : ""}
    <div class="row-actions">
      <button type="button" class="button" data-action="mark-outfit-worn" data-id="${esc(outfit.id)}">Mark outfit worn today</button>
      <a class="button button-secondary" href="#/outfits/${esc(outfit.id)}/edit">Edit items</a>
      <a class="button button-secondary" href="#/trips/new">Add to a trip</a>
      <button type="button" class="button button-danger" data-action="ask-delete-outfit" data-id="${esc(outfit.id)}">Delete outfit</button>
    </div>`;
}

function suggestions(state: AppState, draft: SuggestDraft): string {
  const result = suggestOutfits({
    items: state.items,
    occasion: draft.occasion,
    weather: draft.weather,
    savedSignatures: state.outfits.map((outfit) => outfitSignature(outfit.itemIds)),
    dismissed: state.dismissed,
    skipColors: state.prefs.skipColors,
    today: localDay(),
  });
  return `<form class="form" data-form="suggest">
    <p class="lede">Suggestions use the tags you set: dressiness, season, and color. Each one explains the match. You can dismiss it or save it.</p>
    ${choiceGroup("Occasion", "occasion", OCCASIONS, draft.occasion, occasionLabel)}
    ${choiceGroup("Weather preference", "weather", WEATHERS, draft.weather, weatherLabel)}
    ${result.gaps.map((gap) => `<p class="panel">${esc(gap)}</p>`).join("")}
    <div class="stack">${result.suggestions
      .map((suggestion) => {
        const pieces = orderedItems(suggestion.itemIds, state.items);
        return `<article class="panel suggestion">
          <h2>${pieces.map((item) => esc(item.name)).join(", ")}</h2>
          <div class="mini-row">${pieces.map((item) => garment(item.category, item.color)).join("")}</div>
          <h3>Why this was suggested</h3>
          <ul>${suggestion.factors.map((factor) => `<li>${esc(factor)}</li>`).join("")}</ul>
          <div class="row-actions">
            <button type="button" class="button" data-action="save-suggestion" data-id="${esc(suggestion.id)}">Save outfit</button>
            <button type="button" class="button button-secondary" data-action="dismiss-suggestion" data-id="${esc(suggestion.id)}">Dismiss</button>
          </div>
        </article>`;
      })
      .join("")}</div>
    <p><a href="#/outfits/new">Build an outfit yourself</a></p>
  </form>`;
}

function trips(state: AppState): string {
  if (state.trips.length === 0) {
    return `<div class="empty">
      <p>No trips yet.</p>
      <p>A packing list is built from outfits you have already saved. Shared items are listed once.</p>
      ${state.outfits.length === 0 ? `<a class="button" href="#/outfits/new">Create an outfit first</a>` : `<a class="button" href="#/trips/new">New trip</a>`}
    </div>`;
  }
  return `<a class="button" href="#/trips/new">New trip</a>
    <div class="stack">${state.trips
      .map((trip) => {
        const list = consolidatePacking(trip.outfitIds, state.outfits, state.items);
        const packed = list.lines.filter((line) => trip.packedItemIds.includes(line.itemId)).length;
        return `<a class="outfit-row" href="#/trips/${esc(trip.id)}"><span><strong>${esc(trip.name)}</strong><span class="card-meta">${trip.nights} ${trip.nights === 1 ? "night" : "nights"} · ${packed} of ${list.lines.length} packed</span></span></a>`;
      })
      .join("")}</div>`;
}

function tripForm(state: AppState, draft: TripDraft): string {
  return `<form class="form" data-form="trip">
    <a class="back" href="${draft.id ? `#/trips/${esc(draft.id)}` : "#/trips"}">Back</a>
    <p class="lede">Pick the outfits you want to wear. The packing list keeps one line for each item, even if several outfits share it.</p>
    ${draft.error ? `<p class="form-error" role="alert">${esc(draft.error)}</p>` : ""}
    ${field("Trip name", `<input id="field-trip-name" data-field="trip-name" required maxlength="60" value="${esc(draft.name)}" />`)}
    ${field("Nights", `<input id="field-nights" data-field="nights" inputmode="numeric" value="${esc(draft.nights)}" />`, "A whole number from 1 to 21. This is a reminder, not a calendar.")}
    ${field("Notes, optional", `<textarea id="field-trip-notes" data-field="trip-notes" maxlength="280">${esc(draft.notes)}</textarea>`, "A destination name is a label only. Rewear does not collect location.")}
    <fieldset class="choices">
      <legend>Outfits to pack</legend>
      ${state.outfits.length === 0 ? `<p>Save an outfit before building a packing list. <a href="#/outfits/new">New outfit</a></p>` : state.outfits
        .map((outfit) => {
          const on = draft.outfitIds.includes(outfit.id);
          return `<label class="choice"><input type="checkbox" data-action="toggle-trip-outfit" data-id="${esc(outfit.id)}" ${on ? "checked" : ""} /><span>${esc(outfit.name)} <small>${esc(occasionLabel[outfit.occasion])} · ${esc(weatherLabel[outfit.weather])}</small></span></label>`;
        })
        .join("")}
    </fieldset>
    <div class="row-actions">
      <button type="submit" class="button" data-action="save-trip" ${draft.outfitIds.length === 0 ? "disabled" : ""}>Build packing list</button>
      <a class="button button-secondary" href="${draft.id ? `#/trips/${esc(draft.id)}` : "#/trips"}">Cancel</a>
    </div>
    ${draft.outfitIds.length === 0 ? `<p class="fine">Select at least one outfit to build the list.</p>` : ""}
  </form>`;
}

function tripDetail(state: AppState, id: string): string {
  const trip = state.trips.find((entry) => entry.id === id);
  if (!trip) return missing("trip");
  const list = consolidatePacking(trip.outfitIds, state.outfits, state.items);
  const packed = list.lines.filter((line) => trip.packedItemIds.includes(line.itemId)).length;
  const groups = new Map<string, typeof list.lines>();
  for (const line of list.lines) {
    const key = line.category;
    groups.set(key, [...(groups.get(key) ?? []), line]);
  }
  return `<a class="back" href="#/trips">Back to trips</a>
    <p class="lede">${trip.nights} ${trip.nights === 1 ? "night" : "nights"} · ${packed} of ${list.lines.length} packed</p>
    ${trip.notes ? `<p>${esc(trip.notes)}</p>` : ""}
    <p>Shared pieces are listed once.</p>
    ${list.missingOutfitIds.length ? `<p class="form-error">An outfit on this trip was deleted. Edit the trip to refresh the list.</p>` : ""}
    ${list.lines.length === 0 ? `<div class="empty"><p>This trip has no items yet. Add an outfit that still contains items.</p></div>` : [...groups.entries()].map(([category, lines]) => `<section class="panel"><h2>${esc(categoryHeading(category as Category))}</h2><ul class="check-list">${lines
      .map((line) => {
        const on = trip.packedItemIds.includes(line.itemId);
        return `<li><label class="choice"><input type="checkbox" data-action="toggle-packed" data-id="${esc(line.itemId)}" ${on ? "checked" : ""} /><span><strong>${esc(line.name)}</strong><small>${esc(packingSummary(line, state.outfits))}</small></span></label></li>`;
      })
      .join("")}</ul></section>`).join("")}
    <section class="panel">
      <h2>Outfits on this trip</h2>
      <ul class="plain-list">${trip.outfitIds
        .map((outfitId) => {
          const outfit = state.outfits.find((entry) => entry.id === outfitId);
          return `<li>${outfit ? `<a href="#/outfits/${esc(outfit.id)}">${esc(outfit.name)}</a>` : "Removed outfit"}</li>`;
        })
        .join("")}</ul>
    </section>
    <div class="row-actions">
      <a class="button" href="#/trips/${esc(trip.id)}/edit">Edit trip</a>
      <button type="button" class="button button-danger" data-action="ask-delete-trip" data-id="${esc(trip.id)}">Delete trip</button>
    </div>`;
}

function settings(state: AppState): string {
  const back = state.prefs.onboarded ? "#/wardrobe" : "#/welcome";
  return `<a class="back" href="${back}">Back</a>
    <form class="form">
      <fieldset class="choices">
        <legend>Text size</legend>
        ${([100, 120, 140] as const)
          .map(
            (scale) =>
              `<label class="choice" for="scale-${scale}"><input id="scale-${scale}" type="radio" name="text-scale" data-action="set-scale" value="${scale}" ${state.prefs.textScale === scale ? "checked" : ""} /><span>${scale}%</span></label>`,
          )
          .join("")}
      </fieldset>
      <label class="field"><span>Currency symbol</span>
        <select id="field-currency" data-action="set-currency">${(["GBP", "USD", "EUR"] as const)
          .map((currency) => `<option value="${currency}" ${state.prefs.currency === currency ? "selected" : ""}>${esc(currencyLabel[currency])}</option>`)
          .join("")}</select>
        <span class="fine">This changes the symbol only. Amounts you entered are not converted.</span>
      </label>
      <fieldset class="choices">
        <legend>Colors to skip in suggestions</legend>
        <p class="fine">Skipped colors stay in your wardrobe. They are left out of new suggestions.</p>
        <div class="chips">${COLORS.map((color) => chip("toggle-skip", color, colorLabel[color], state.prefs.skipColors.includes(color))).join("")}</div>
      </fieldset>
    </form>
    <section class="panel">
      <h2>Photos and privacy</h2>
      <p>In this prototype, items, outfits, trips, and photos stay in this browser’s local storage. Nothing is uploaded, and your location is not collected.</p>
      <p>You can delete a single photo, delete every photo, or delete the whole wardrobe. Clearing this site’s data in the browser removes it as well.</p>
      <p>Rewear does not scan photos and does not infer anything about your body, size, or identity.</p>
    </section>
    <section class="panel">
      <h2>Wardrobe data</h2>
      <div class="row-actions">
        <button type="button" class="button button-secondary" data-action="ask-load-sample">Replace with the sample wardrobe</button>
        <button type="button" class="button button-secondary" data-action="ask-delete-photos">Delete all photos</button>
        <button type="button" class="button button-danger" data-action="ask-wipe">Delete all wardrobe data</button>
      </div>
    </section>
    <section class="panel">
      <h2>About this prototype</h2>
      <p>Rewear helps you make outfits from clothes you already own. Suggestions are rule-based and explained. They are not generated by a model.</p>
      <p>Not included: weather forecasts, image recognition, care reminders, sharing, a social feed, resale, and purchase recommendations.</p>
      <button type="button" class="button button-secondary" data-action="replay-intro">Show the introduction again</button>
    </section>`;
}

function overlay(state: AppState): string {
  if (state.filtersOpen) return filterDialog(state);
  if (!state.dialog) return "";
  const dialog = state.dialog;
  if (dialog.type === "delete-item") {
    const item = findItem(state, dialog.id);
    const used = state.outfits.filter((outfit) => outfit.itemIds.includes(dialog.id));
    const extra =
      used.length === 0
        ? "It will be removed from the wardrobe."
        : `It is in ${used.length} ${used.length === 1 ? "outfit" : "outfits"}: ${used.map((outfit) => outfit.name).join(", ")}. Those outfits will update.`;
    return confirm(
      "Delete this item?",
      `${item?.name ?? "This item"}. ${extra}`,
      "Delete item",
      "confirm-delete-item",
      true,
    );
  }
  if (dialog.type === "delete-photo") {
    return confirm("Delete this photo?", "The item stays, without its photo. You can undo this from the notice.", "Delete photo", "confirm-delete-photo", true);
  }
  if (dialog.type === "delete-outfit") {
    return confirm("Delete this outfit?", "The items stay in your wardrobe.", "Delete outfit", "confirm-delete-outfit", true);
  }
  if (dialog.type === "delete-trip") {
    return confirm("Delete this trip?", "Saved outfits stay. Only this packing list is removed.", "Delete trip", "confirm-delete-trip", true);
  }
  if (dialog.type === "wipe") {
    return confirm(
      "Delete all wardrobe data?",
      "Items, photos, outfits, and trips in this browser will be removed. This cannot be undone from Rewear.",
      "Delete everything",
      "confirm-wipe",
      true,
    );
  }
  if (dialog.type === "load-sample") {
    return confirm(
      "Replace the wardrobe with the sample?",
      "Your current items, outfits, and trips in this browser will be replaced by 12 illustrative items.",
      "Load sample wardrobe",
      "confirm-load-sample",
      true,
    );
  }
  return confirm(
    "Delete all photos?",
    "Every item photo stored in this browser will be removed. Names and tags stay.",
    "Delete all photos",
    "confirm-delete-photos",
    true,
  );
}

function confirm(titleText: string, body: string, primary: string, action: string, danger: boolean): string {
  return `<div class="scrim"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
    <h2 id="dialog-title">${esc(titleText)}</h2>
    <p>${esc(body)}</p>
    <div class="row-actions">
      <button type="button" class="button ${danger ? "button-danger" : ""}" id="dialog-primary" data-action="${action}">${esc(primary)}</button>
      <button type="button" class="button button-secondary" data-action="close-dialog">Cancel</button>
    </div>
  </div></div>`;
}

function filterDialog(state: AppState): string {
  return `<div class="scrim"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="filter-title">
    <h2 id="filter-title">Filters</h2>
    <p class="fine">A category chip, a color, and a season all have to match. Choices inside one group match any of those choices.</p>
    <fieldset class="choices"><legend>Color</legend><div class="chips">${COLORS.map((color) => chip("toggle-color", color, colorLabel[color], state.filters.colors.includes(color))).join("")}</div></fieldset>
    <fieldset class="choices"><legend>Season</legend><div class="chips">${SEASONS.map((season) => chip("toggle-season", season, seasonLabel[season], state.filters.seasons.includes(season))).join("")}</div></fieldset>
    <label class="choice"><input type="checkbox" data-action="toggle-archived" ${state.filters.archivedOnly ? "checked" : ""} /><span>Show archived items instead</span></label>
    <div class="row-actions">
      <button type="button" class="button" id="filter-close" data-action="close-filters">Show results</button>
      <button type="button" class="button button-secondary" data-action="clear-filters">Clear filters</button>
    </div>
  </div></div>`;
}

function localDay(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function suggestionDraft(state: AppState): SuggestDraft {
  return state.draft?.mode === "suggest" ? state.draft : { mode: "suggest", occasion: "work", weather: "cold" };
}


