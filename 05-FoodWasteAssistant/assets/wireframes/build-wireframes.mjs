import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync(dir, { recursive: true });

const screens = [
  {
    id: "WF-01",
    file: "wf-01-onboarding.svg",
    name: "Onboarding — dates are reminders",
    nav: false,
    blocks: [
      { t: "kicker", text: "FreshLoop" },
      { t: "h", text: "Know what to cook before food goes to waste" },
      { t: "p", text: "Dates you enter are reminders. FreshLoop does not decide whether food is safe." },
      { t: "li", text: "Add food you already have. A date is optional." },
      { t: "li", text: "See which entered dates are soon, then open recipes that use them." },
      { t: "li", text: "Shop only for gaps the pantry does not cover." },
      { t: "btn", text: "Start my kitchen" },
      { t: "btn2", text: "Try the sample kitchen" },
      { t: "help", text: "The sample kitchen is fictional. Nothing is uploaded." },
    ],
    notes: [
      "1. The limit is stated before any pantry is created.",
      "2. Sample data is optional and labeled fictional.",
      "3. No account, barcode, or safety verdict is required to begin.",
      "4. Covers the trust half of FR-03 and the manual-entry path in FR-01.",
    ],
  },
  {
    id: "WF-02",
    file: "wf-02-empty-pantry.svg",
    name: "Empty pantry",
    nav: true,
    blocks: [
      { t: "h", text: "Pantry" },
      { t: "p", text: "Your pantry is empty. FreshLoop can only suggest food you enter." },
      { t: "banner", text: "Dates you enter are reminders, not a safety check." },
      { t: "label", text: "Add an item" },
      { t: "input", text: "Name, such as spinach" },
      { t: "btn", text: "Add" },
      { t: "help", text: "Quick add stores the name in the fridge. Quantity and date stay blank." },
      { t: "btn2", text: "Add details" },
      { t: "btn2", text: "Try the sample kitchen" },
    ],
    notes: [
      "1. Empty is an explanation, not a blank illustration.",
      "2. Quick add is the low-friction path. Details are one step away.",
      "3. Sample data asks before it replaces a pantry that already has items.",
      "4. Covers the no-inventory state in the PRD.",
    ],
  },
  {
    id: "WF-03",
    file: "wf-03-pantry.svg",
    name: "Pantry — use soon first",
    nav: true,
    blocks: [
      { t: "banner", text: "Sample kitchen. These items are fictional." },
      { t: "kicker", text: "Use soon · window 3 days" },
      { t: "figure", text: "4 items" },
      { t: "p", text: "1 item is marked Date passed. Dates are reminders, not a safety check." },
      { t: "btn", text: "Open the use-soon list" },
      { t: "label", text: "Add an item" },
      { t: "input", text: "Name" },
      { t: "row", text: "Spinach · 200 g · Fridge · Use soon" },
      { t: "row", text: "Plain yogurt · 1 piece · Fridge · Date passed" },
      { t: "low", text: "Ginger · 1 piece · Fridge · Opened" },
    ],
    notes: [
      "1. The decision count is above the storage lists.",
      "2. Use soon, Date passed, and Opened are words, not color alone.",
      "3. Opened is visible and is not treated as an expiry.",
      "4. Covers FR-01 display and FR-03.",
    ],
  },
  {
    id: "WF-04",
    file: "wf-04-add-item.svg",
    name: "Add item",
    nav: false,
    blocks: [
      { t: "h", text: "Add item" },
      { t: "label", text: "Name" },
      { t: "input", text: "Spinach" },
      { t: "label", text: "Quantity, optional" },
      { t: "input", text: "200" },
      { t: "label", text: "Unit" },
      { t: "input", text: "g" },
      { t: "label", text: "Location" },
      { t: "input", text: "Fridge" },
      { t: "label", text: "Date type" },
      { t: "input", text: "Use-by" },
      { t: "label", text: "Date" },
      { t: "input", text: "2026-10-23" },
      { t: "help", text: "A blank quantity is allowed. A unit without a quantity is not." },
      { t: "btn", text: "Save item" },
      { t: "btn2", text: "Cancel" },
    ],
    notes: [
      "1. Name and location are required. Quantity and date are optional.",
      "2. Date type is chosen by the person. FreshLoop does not infer one.",
      "3. Zero is rejected. The app will not assume an amount.",
      "4. Covers FR-01.",
    ],
  },
  {
    id: "WF-05",
    file: "wf-05-duplicate.svg",
    name: "Duplicate item",
    nav: false,
    blocks: [
      { t: "h", text: "Spinach is already in the fridge" },
      { t: "p", text: "You already have Spinach in the fridge (200 g)." },
      { t: "card", lines: ["Add to the existing item", "Save as a separate item", "Go back"] },
      { t: "help", text: "If the units differ, combining is unavailable. Amounts are not guessed." },
    ],
    notes: [
      "1. A same-name, same-location match asks before a second row is saved.",
      "2. Another location is mentioned, not blocked.",
      "3. Unit mismatches cannot be merged.",
      "4. Covers the duplicate state in the PRD.",
    ],
  },
  {
    id: "WF-06",
    file: "wf-06-use-soon.svg",
    name: "Use soon",
    nav: true,
    blocks: [
      { t: "p", text: "Use soon and Date passed come from dates you entered. Opened is not an expiry." },
      { t: "banner", text: "In-app reminders are off. This list still works." },
      { t: "h", text: "Date passed" },
      { t: "low", text: "Plain yogurt · best-before was yesterday" },
      { t: "h", text: "Use soon" },
      { t: "row", text: "Spinach · use-by Fri, Oct 23" },
      { t: "row", text: "Bread · best-before today" },
      { t: "h", text: "Opened" },
      { t: "row", text: "Ginger · opened on, not an expiry" },
    ],
    notes: [
      "1. Date passed is first, and the copy refuses a safety verdict.",
      "2. The list works when reminders are off.",
      "3. No-date items are a separate group and are not marked urgent.",
      "4. Covers FR-03.",
    ],
  },
  {
    id: "WF-07",
    file: "wf-07-cook.svg",
    name: "Cook from the pantry",
    nav: true,
    blocks: [
      { t: "h", text: "Cook from the pantry" },
      { t: "p", text: "Filters use listed ingredients. They are not an allergen check." },
      { t: "input", text: "Vegetarian · Vegan · Hide gluten" },
      { t: "label", text: "Only recipes that use a Use soon item" },
      { t: "card", lines: ["Spinach and chickpea skillet", "Uses spinach · Use soon", "Uses 6 pantry items · 0 missing"] },
      { t: "row", text: "Chickpea herb salad · Missing cilantro" },
    ],
    notes: [
      "1. Results are sorted toward items already marked Use soon.",
      "2. Missing and check counts are visible on the card.",
      "3. An empty pantry does not pretend to match. Browsing is a second step.",
      "4. Covers FR-04 and FR-06.",
    ],
  },
  {
    id: "WF-08",
    file: "wf-08-recipe.svg",
    name: "Recipe detail",
    nav: true,
    blocks: [
      { t: "h", text: "Spinach and chickpea skillet" },
      { t: "p", text: "20 min · 2 servings" },
      { t: "row", text: "Spinach · 150 g · Have · Use soon" },
      { t: "row", text: "Cumin · optional · left off" },
      { t: "low", text: "Yogurt oat bowl would say Check, not Have" },
      { t: "btn", text: "Shop for what's missing" },
      { t: "btn2", text: "I cooked this" },
      { t: "help", text: "Original sample recipe. Not a licensed catalog." },
    ],
    notes: [
      "1. Every ingredient shows a status word: Have, Short, Check, Missing, Staple, or Optional.",
      "2. A unit mismatch stays on Check. It is not counted as covered.",
      "3. Servings can change before the list is built.",
      "4. Covers FR-04 and the recipe-detail deliverable.",
    ],
  },
  {
    id: "WF-09",
    file: "wf-09-review-list.svg",
    name: "Review the shopping list",
    nav: true,
    blocks: [
      { t: "h", text: "Check the list before you shop" },
      { t: "p", text: "Only confirmed amounts are subtracted. Uncertain amounts stay on the list." },
      { t: "low", text: "On the list · Lemon · 1 piece · Short" },
      { t: "low", text: "On the list · Garlic · 1 piece · Short" },
      { t: "row", text: "Left off · Spinach · pantry covers 150 g" },
      { t: "row", text: "Left off · Salt · staple" },
      { t: "btn", text: "Add selected items to my list" },
      { t: "btn2", text: "Discard this review" },
    ],
    notes: [
      "1. Covered items stay visible. Exclusion is not silent.",
      "2. A two-recipe plan subtracts the pantry once, so lemon and garlic show the gap.",
      "3. The person can put a left-off line back on the list.",
      "4. Covers FR-05.",
    ],
  },
  {
    id: "WF-10",
    file: "wf-10-shop.svg",
    name: "Shopping list",
    nav: true,
    blocks: [
      { t: "h", text: "Shopping list" },
      { t: "row", text: "Lemon · 1 piece · From the four-day plan" },
      { t: "row", text: "Garlic · 1 piece · editable amount" },
      { t: "input", text: "Add an item yourself" },
      { t: "btn", text: "Move checked items into the pantry" },
      { t: "help", text: "Checked items copy no date. A blank amount stays blank." },
    ],
    notes: [
      "1. Amounts remain editable after the review.",
      "2. Moving items into the pantry is explicit.",
      "3. Empty list points back to Cook rather than inventing items.",
      "4. Covers FR-05 and FR-02 when bought food returns to inventory.",
    ],
  },
  {
    id: "WF-11",
    file: "wf-11-cooked.svg",
    name: "Mark cooked",
    nav: false,
    blocks: [
      { t: "h", text: "Update the pantry?" },
      { t: "p", text: "Spinach and chickpea skillet · 2 servings. Change any amount." },
      { t: "row", text: "Spinach · subtract 150 g · 200 g becomes 50 g" },
      { t: "low", text: "Proposed first because the date is in the window." },
      { t: "row", text: "Garlic · subtract 1 piece · this removes the item" },
      { t: "help", text: "Salt, pepper, and water are not subtracted." },
      { t: "btn", text: "Update pantry" },
      { t: "btn2", text: "Cancel" },
    ],
    notes: [
      "1. Amounts are proposals. Each row can be skipped or removed.",
      "2. Dated items are proposed before undated matches.",
      "3. Undo is offered after the update.",
      "4. Covers FR-02.",
    ],
  },
  {
    id: "WF-12",
    file: "wf-12-plan.svg",
    name: "Four-day dinner plan",
    nav: true,
    blocks: [
      { t: "h", text: "Four-day dinner plan" },
      { t: "p", text: "A combined list subtracts each pantry amount once." },
      { t: "card", lines: ["Thu, Oct 22", "Spinach and chickpea skillet", "2 servings"] },
      { t: "card", lines: ["Fri, Oct 23", "Lemon chicken tray", "2 servings"] },
      { t: "row", text: "Sat · No dinner planned" },
      { t: "btn", text: "Build a shopping list for this plan" },
    ],
    notes: [
      "1. Meal plan is a should-have and is in the prototype.",
      "2. Diet-hidden recipes can still be planned, with a visible note.",
      "3. Building a list opens the same review screen as a single recipe.",
      "4. Past days drop off the four-day window on the next visit.",
    ],
  },
  {
    id: "WF-13",
    file: "wf-13-reminders.svg",
    name: "Reminders denied",
    nav: true,
    blocks: [
      { t: "h", text: "Settings" },
      { t: "label", text: "Use-soon window" },
      { t: "input", text: "3 days" },
      { t: "help", text: "The window changes the list. It does not send a notification by itself." },
      { t: "banner", text: "Reminders stay off. You chose not to allow them." },
      { t: "p", text: "FreshLoop cannot notify you after you close this page." },
      { t: "btn2", text: "Ask again" },
      { t: "btn", text: "Turn off reminders" },
    ],
    notes: [
      "1. Permission is opt-in and denial does not block the pantry.",
      "2. Turning reminders off is one control.",
      "3. The prototype does not ask the browser for background notifications.",
      "4. Covers the reminder-permission state and the opt-in non-functional requirement.",
    ],
  },
  {
    id: "WF-14",
    file: "wf-14-barcode.svg",
    name: "Barcode confirmation",
    nav: false,
    blocks: [
      { t: "h", text: "Add item" },
      { t: "label", text: "Sample barcode" },
      { t: "input", text: "000000111111" },
      { t: "banner", text: "Check this result before saving. It is not in the pantry yet." },
      { t: "card", lines: ["Oat milk", "1 L · Fridge", "Sample result, not a product database"] },
      { t: "btn", text: "Save item" },
      { t: "btn2", text: "Scan a receipt" },
      { t: "help", text: "Receipt scanning is not connected. There is no OCR provider." },
    ],
    notes: [
      "1. A lookup never saves by itself. FR-07 confirmation is the point.",
      "2. Unknown codes add nothing.",
      "3. Receipt scan is an explicit unavailable state, not a fake capture.",
      "4. The codes are illustrative, not real product identifiers.",
    ],
  },
  {
    id: "WF-15",
    file: "wf-15-unreadable.svg",
    name: "Unreadable saved data",
    nav: false,
    blocks: [
      { t: "h", text: "Saved data could not be read" },
      { t: "p", text: "FreshLoop found a saved record and could not use it. It has not been erased." },
      { t: "btn2", text: "Download the saved text" },
      { t: "danger", text: "Erase and start over" },
    ],
    notes: [
      "1. Corrupt storage is not silently replaced with an empty pantry.",
      "2. The raw text can be downloaded first.",
      "3. Erase is a separate action.",
      "4. Export and delete for readable data live in Settings.",
    ],
  },
  {
    id: "WF-16",
    file: "wf-16-offline.svg",
    name: "Offline and save error",
    nav: true,
    blocks: [
      { t: "banner", text: "You are offline. The pantry stays on this device." },
      { t: "banner", text: "This browser blocked saving. The change is on screen only." },
      { t: "h", text: "Pantry" },
      { t: "p", text: "Recipe search uses the sample catalog stored in the app." },
      { t: "row", text: "Spinach · 200 g · Fridge · Use soon" },
      { t: "help", text: "There is no account to sync. Offline does not invent a network error for recipes." },
    ],
    notes: [
      "1. Offline is a status, not a blocker, because the catalog is local.",
      "2. A failed save is explained and the previous record is not wiped.",
      "3. Covers the error and offline states required by the PRD.",
    ],
  },
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(text, max) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max) {
      if (line) lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function render(screen) {
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="980" viewBox="0 0 1040 980" role="img">`);
  parts.push(`<title>${esc(screen.id)} ${esc(screen.name)}</title>`);
  parts.push(`<rect width="1040" height="980" fill="#f4efe6"/>`);
  parts.push(`<text x="36" y="42" font-family="Segoe UI, sans-serif" font-size="14" fill="#24312a">${esc(screen.id)} · grayscale wireframe · 390 × 844</text>`);
  parts.push(`<text x="36" y="68" font-family="Georgia, serif" font-size="22" font-weight="700" fill="#1c2822">${esc(screen.name)}</text>`);
  parts.push(`<rect x="36" y="92" width="390" height="844" rx="28" fill="#fffcf7" stroke="#1c2822" stroke-width="3"/>`);
  parts.push(`<text x="64" y="128" font-family="Georgia, serif" font-size="20" fill="#1c2822">FreshLoop</text>`);
  let y = 156;
  const maxY = screen.nav ? 860 : 900;
  for (const block of screen.blocks) {
    if (y > maxY - 24) break;
    if (block.t === "kicker") {
      parts.push(`<text x="64" y="${y}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#24312a">${esc(block.text)}</text>`);
      y += 28;
    } else if (block.t === "h") {
      for (const line of wrap(block.text, 24)) {
        parts.push(`<text x="64" y="${y}" font-family="Georgia, serif" font-size="24" fill="#1c2822">${esc(line)}</text>`);
        y += 30;
      }
      y += 6;
    } else if (block.t === "figure") {
      parts.push(`<text x="64" y="${y + 18}" font-family="Georgia, serif" font-size="40" fill="#1c2822">${esc(block.text)}</text>`);
      y += 58;
    } else if (block.t === "p" || block.t === "help" || block.t === "li") {
      const prefix = block.t === "li" ? "• " : "";
      for (const line of wrap(prefix + block.text, 42)) {
        parts.push(`<text x="64" y="${y}" font-family="Segoe UI, sans-serif" font-size="14" fill="${block.t === "help" ? "#24312a" : "#1c2822"}">${esc(line)}</text>`);
        y += 20;
      }
      y += 8;
    } else if (block.t === "banner") {
      const lines = wrap(block.text, 40);
      const h = 18 + lines.length * 18;
      parts.push(`<rect x="64" y="${y}" width="334" height="${h}" rx="8" fill="#f4efe6" stroke="#8d8376"/>`);
      lines.forEach((line, index) => {
        parts.push(`<text x="76" y="${y + 20 + index * 18}" font-family="Segoe UI, sans-serif" font-size="13" fill="#1c2822">${esc(line)}</text>`);
      });
      y += h + 12;
    } else if (block.t === "label") {
      parts.push(`<text x="64" y="${y}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#1c2822">${esc(block.text)}</text>`);
      y += 8;
    } else if (block.t === "input") {
      parts.push(`<rect x="64" y="${y}" width="334" height="40" rx="8" fill="#fffcf7" stroke="#8d8376"/>`);
      parts.push(`<text x="76" y="${y + 26}" font-family="Segoe UI, sans-serif" font-size="14" fill="#24312a">${esc(block.text)}</text>`);
      y += 52;
    } else if (block.t === "card") {
      const h = 16 + block.lines.length * 22;
      parts.push(`<rect x="64" y="${y}" width="334" height="${h}" rx="10" fill="#f7f7f5" stroke="#8d8376"/>`);
      block.lines.forEach((line, index) => {
        parts.push(`<text x="76" y="${y + 24 + index * 22}" font-family="Segoe UI, sans-serif" font-size="14" fill="#1c2822">${esc(line)}</text>`);
      });
      y += h + 12;
    } else if (block.t === "row" || block.t === "low") {
      parts.push(`<rect x="64" y="${y}" width="334" height="36" rx="8" fill="${block.t === "low" ? "#eceae4" : "#fffcf7"}" stroke="${block.t === "low" ? "#1c2822" : "#cfc6b8"}"/>`);
      parts.push(`<text x="76" y="${y + 24}" font-family="Segoe UI, sans-serif" font-size="13" fill="#1c2822">${esc(block.text)}</text>`);
      y += 46;
    } else if (block.t === "btn" || block.t === "btn2" || block.t === "danger") {
      const fill = block.t === "btn" ? "#1c2822" : "#fffcf7";
      const color = block.t === "btn" ? "#fffcf7" : "#1c2822";
      parts.push(`<rect x="64" y="${y}" width="334" height="44" rx="22" fill="${fill}" stroke="#1c2822"/>`);
      parts.push(`<text x="231" y="${y + 28}" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="15" fill="${color}">${esc(block.text)}</text>`);
      y += 56;
    }
  }
  if (screen.nav) {
    parts.push(`<rect x="36" y="860" width="390" height="76" fill="#fffcf7" stroke="#1c2822"/>`);
    ["Pantry", "Cook", "Shop", "Plan"].forEach((label, index) => {
      const weight = index === 0 ? "700" : "400";
      parts.push(`<text x="${70 + index * 92}" y="904" font-family="Segoe UI, sans-serif" font-size="12" font-weight="${weight}" fill="#1c2822">${label}</text>`);
    });
  }
  parts.push(`<text x="460" y="120" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#1c2822">Annotations</text>`);
  let noteY = 156;
  for (const note of screen.notes) {
    for (const line of wrap(note, 48)) {
      parts.push(`<text x="460" y="${noteY}" font-family="Segoe UI, sans-serif" font-size="15" fill="#1c2822">${esc(line)}</text>`);
      noteY += 22;
    }
    noteY += 12;
  }
  parts.push(`<text x="460" y="930" font-family="Segoe UI, sans-serif" font-size="13" fill="#24312a">Responsive: one column under 960px. Side navigation from 960px. Targets at least 44px.</text>`);
  parts.push(`</svg>`);
  writeFileSync(join(dir, screen.file), parts.join("\n"), "utf8");
}

for (const screen of screens) render(screen);
console.log(`Wrote ${screens.length} wireframes to ${dir}`);
