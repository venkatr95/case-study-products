import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync(dir, { recursive: true });

const screens = [
  {
    id: "WF-01",
    file: "wf-01-onboarding.svg",
    name: "Onboarding — estimates, not promises",
    nav: false,
    blocks: [
      { t: "kicker", text: "Step 1 of 2" },
      { t: "h", text: "Estimates, not promises" },
      { t: "p", text: "MoneyMind shows whether the cash you enter is likely to cover the bills you enter over the next 30 days." },
      { t: "li", text: "You type a balance, income, and bills. Nothing connects to a bank." },
      { t: "li", text: "The result is an estimate, not a guarantee or financial advice." },
      { t: "li", text: "Same-day bills are counted before same-day income." },
      { t: "li", text: "Do not enter bank passwords or account numbers." },
      { t: "card", lines: ["Lowest estimated balance", "− Set-aside you choose", "= Safe to spend"] },
      { t: "btn", text: "Enter what I have now" },
      { t: "btn2", text: "Explore with sample data" },
    ],
    notes: [
      "1. Limits and data source come before any number.",
      "2. No bank login and no credential field exist.",
      "3. Safe to spend is defined before the user is asked for money.",
      "4. Sample data is optional and labeled fictional.",
      "5. Covers FR-03 trust labeling and onboarding acceptance.",
    ],
  },
  {
    id: "WF-02",
    file: "wf-02-starting-balance.svg",
    name: "Starting balance",
    nav: false,
    blocks: [
      { t: "kicker", text: "Step 2 of 2" },
      { t: "h", text: "What cash is available now?" },
      { t: "p", text: "The estimate starts here, before today’s bills and income." },
      { t: "label", text: "Currency symbol" },
      { t: "input", text: "USD — US dollar" },
      { t: "label", text: "Current balance" },
      { t: "input", text: "1840.00" },
      { t: "label", text: "Balance date" },
      { t: "input", text: "2026-10-22" },
      { t: "label", text: "Set-aside" },
      { t: "input", text: "100.00" },
      { t: "help", text: "Your choice, not a recommendation. Use 0 for no cushion." },
      { t: "btn", text: "Create my estimate" },
    ],
    notes: [
      "1. One cash pool. No account aggregation.",
      "2. Future balance dates are rejected.",
      "3. Set-aside defaults to an explicit choice, including zero.",
      "4. Currency is a symbol only. No conversion.",
      "5. Covers FR-01.",
    ],
  },
  {
    id: "WF-03",
    file: "wf-03-home.svg",
    name: "Home — safe to spend",
    nav: true,
    blocks: [
      { t: "banner", text: "Sample data. These figures are not your finances." },
      { t: "kicker", text: "Safe to spend" },
      { t: "figure", text: "$90.00" },
      { t: "p", text: "You could spend this today and still be at the $100.00 set-aside at the lowest point." },
      { t: "btn", text: "See the calculation" },
      { t: "btn2", text: "Try a purchase" },
      { t: "card", lines: ["Lowest estimate", "$190.00 on Fri, Oct 30", "Marker, not color alone"] },
      { t: "row", text: "Oct 26 · Rent · −$1,450.00" },
      { t: "help", text: "Estimate only. Not a guarantee or financial advice." },
    ],
    notes: [
      "1. The decision number is first. The low point is next to it.",
      "2. Illustrative sample math, not a user result.",
      "3. Disclaimer stays on the decision screen.",
      "4. Primary path continues to the explanation or a what-if.",
      "5. Covers FR-03 and FR-04 entry.",
    ],
  },
  {
    id: "WF-04",
    file: "wf-04-timeline.svg",
    name: "30-day timeline",
    nav: true,
    blocks: [
      { t: "kicker", text: "Thu, Oct 22 – Fri, Nov 20" },
      { t: "h", text: "30-day timeline" },
      { t: "chart", text: "Low-balance line · lowest point marked" },
      { t: "row", text: "Oct 23 · Transit pass · −$40.00" },
      { t: "row", text: "Oct 24 · Groceries · −$120.00" },
      { t: "row", text: "Oct 26 · Rent · −$1,450.00" },
      { t: "low", text: "Oct 30 · Lowest estimate · $190.00" },
      { t: "row", text: "Nov 1 · Payday · +$1,680.00" },
      { t: "help", text: "Quiet days group. A 30-row table sits below the chart." },
    ],
    notes: [
      "1. Ledger first, chart second. The table is the text alternative.",
      "2. Payday after the low point is visible but does not raise safe to spend.",
      "3. Lowest day is labeled in text, not by color alone.",
      "4. Covers FR-02 display and FR-03.",
    ],
  },
  {
    id: "WF-05",
    file: "wf-05-safe-to-spend.svg",
    name: "Safe-to-spend explanation",
    nav: true,
    blocks: [
      { t: "h", text: "Safe to spend" },
      { t: "p", text: "How much you could spend today without going under the set-aside at the lowest point." },
      { t: "card", lines: ["Starting balance · $1,840.00", "Income counted · + $0.00", "Expenses counted · − $1,650.00", "Lowest estimate · $190.00", "Set-aside · − $100.00", "Safe to spend · $90.00"] },
      { t: "h", text: "After the low point" },
      { t: "p", text: "Payday arrives later, so it is not part of safe to spend. It remains on the timeline." },
      { t: "help", text: "Assumptions are listed in full. This is not advice." },
    ],
    notes: [
      "1. Every term in the formula is visible and ties back to entered items.",
      "2. Later income is explained instead of being hidden.",
      "3. A negative result is shown as a shortfall, not clamped without comment.",
      "4. Covers FR-04.",
    ],
  },
  {
    id: "WF-06",
    file: "wf-06-add-item.svg",
    name: "Add income or a bill",
    nav: true,
    blocks: [
      { t: "h", text: "Add income or a bill" },
      { t: "label", text: "Name" },
      { t: "input", text: "Rent" },
      { t: "label", text: "Type · Expense selected" },
      { t: "label", text: "Amount" },
      { t: "input", text: "1450.00" },
      { t: "label", text: "First date · Repeats every month" },
      { t: "input", text: "2026-10-26 · Every month" },
      { t: "card", lines: ["If you save", "Lowest estimate would change", "Preview is not saved yet"] },
      { t: "btn", text: "Save item" },
      { t: "btn2", text: "Cancel" },
    ],
    notes: [
      "1. Invalid amounts are rejected before save.",
      "2. The preview updates the low point before the user commits.",
      "3. Monthly day 29–31 explains the short-month clamp.",
      "4. Covers FR-02 and FR-05 entry.",
    ],
  },
  {
    id: "WF-07",
    file: "wf-07-item-detail.svg",
    name: "Item detail",
    nav: true,
    blocks: [
      { t: "kicker", text: "Expense" },
      { t: "h", text: "Rent" },
      { t: "figure", text: "−$1,450.00" },
      { t: "card", lines: ["First date · Mon, Oct 26", "Repeats · Every month", "Category · Housing"] },
      { t: "p", text: "In this 30-day window: Mon, Oct 26." },
      { t: "btn", text: "Edit" },
      { t: "btn2", text: "Delete" },
    ],
    notes: [
      "1. Delete asks for confirmation and can be undone once.",
      "2. Occurrences outside the window are kept and explained.",
      "3. Edit returns to the previewing form.",
      "4. Covers FR-05.",
    ],
  },
  {
    id: "WF-08",
    file: "wf-08-what-if.svg",
    name: "What-if scenario",
    nav: true,
    blocks: [
      { t: "kicker", text: "Not saved" },
      { t: "h", text: "Try a purchase" },
      { t: "label", text: "Amount · Date" },
      { t: "input", text: "Dinner out · 150.00 · Oct 25" },
      { t: "split", left: "Saved · $90.00", right: "Scenario · $0.00" },
      { t: "p", text: "This scenario lowers the lowest estimate. It is short of the set-aside by $60.00." },
      { t: "btn2", text: "Discard scenario" },
      { t: "btn", text: "Add to plan" },
    ],
    notes: [
      "1. Scenario styling is separate from the saved plan.",
      "2. Discard leaves the baseline untouched.",
      "3. Add to plan is explicit. Nothing is saved by typing.",
      "4. A date outside the 30 days is explained, not silently ignored.",
      "5. Covers FR-07.",
    ],
  },
  {
    id: "WF-09",
    file: "wf-09-reminders.svg",
    name: "Low-balance alert",
    nav: true,
    blocks: [
      { t: "h", text: "Low-balance alert" },
      { t: "p", text: "Show an alert when any estimated day goes below the amount you set." },
      { t: "input", text: "Alert below · 250.00 · On" },
      { t: "banner", text: "The estimate goes below $250.00 on Fri, Oct 30." },
      { t: "h", text: "Device notifications" },
      { t: "p", text: "If blocked, say so. Alerts still appear in the app. None are sent after the page closes." },
      { t: "btn", text: "Save alert" },
    ],
    notes: [
      "1. In-app status does not depend on notification permission.",
      "2. Denied permission is explained. No fake scheduled alert.",
      "3. Copy stays neutral. No shame language.",
      "4. Covers FR-06.",
    ],
  },
  {
    id: "WF-10",
    file: "wf-10-settings.svg",
    name: "Settings, export, delete",
    nav: true,
    blocks: [
      { t: "h", text: "Settings" },
      { t: "row", text: "Update balance, currency, and set-aside" },
      { t: "row", text: "Low-balance alert" },
      { t: "row", text: "Category summary" },
      { t: "row", text: "How estimates work" },
      { t: "row", text: "Privacy and storage" },
      { t: "btn2", text: "Download my entries" },
      { t: "danger", text: "Delete all data on this device" },
      { t: "help", text: "Stored in this browser under moneymind.v1. Not encrypted." },
    ],
    notes: [
      "1. Export is the user’s file. Nothing is uploaded.",
      "2. Delete is confirmed, with Cancel focused first.",
      "3. Preview links show loading, error, empty, and offline without changing data.",
      "4. Covers privacy and empty/error acceptance.",
    ],
  },
  {
    id: "WF-11",
    file: "wf-11-empty.svg",
    name: "Empty plan",
    nav: true,
    blocks: [
      { t: "kicker", text: "Safe to spend" },
      { t: "figure", text: "$1,740.00" },
      { t: "p", text: "No bills are entered. This is the balance minus the set-aside, not a forecast of real spending." },
      { t: "banner", text: "No income is entered in this 30-day window." },
      { t: "h", text: "Nothing planned yet" },
      { t: "p", text: "Add the next payday and the bills due before it." },
      { t: "btn", text: "Add an item" },
      { t: "btn2", text: "Explore with sample data" },
    ],
    notes: [
      "1. Empty is a flat estimate, not a blank screen or a fake insight.",
      "2. Sample data asks before it replaces a saved balance.",
      "3. The missing-input notes are specific.",
    ],
  },
  {
    id: "WF-12",
    file: "wf-12-unreadable-data.svg",
    name: "Unreadable saved data",
    nav: false,
    blocks: [
      { t: "h", text: "Saved data could not be read" },
      { t: "p", text: "MoneyMind found a saved record and could not use it. It has not been erased." },
      { t: "btn2", text: "Download the saved text" },
      { t: "danger", text: "Erase and start over" },
    ],
    notes: [
      "1. Corrupt storage is not silently wiped.",
      "2. The raw text can be downloaded before erase.",
      "3. Erase still requires confirmation.",
      "4. A storage-blocked browser uses the same screen.",
    ],
  },
];

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrap(text, max) {
  const words = text.split(" ");
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
  parts.push(`<rect width="1040" height="980" fill="#f7f7f5"/>`);
  parts.push(`<text x="36" y="42" font-family="Segoe UI, sans-serif" font-size="14" fill="#555">${esc(screen.id)} · grayscale wireframe · 390 × 844</text>`);
  parts.push(`<text x="36" y="68" font-family="Segoe UI, sans-serif" font-size="22" font-weight="700" fill="#1c1c1c">${esc(screen.name)}</text>`);
  parts.push(`<rect x="36" y="92" width="390" height="844" rx="28" fill="#fff" stroke="#222" stroke-width="3"/>`);
  parts.push(`<text x="64" y="128" font-family="Georgia, serif" font-size="20" fill="#111">MoneyMind</text>`);
  parts.push(`<rect x="250" y="112" width="78" height="24" rx="12" fill="#eee" stroke="#999"/>`);
  parts.push(`<text x="262" y="129" font-family="Segoe UI, sans-serif" font-size="12" fill="#333">Estimate</text>`);
  let y = 168;
  const maxY = screen.nav ? 860 : 900;
  for (const block of screen.blocks) {
    if (y > maxY - 20) break;
    if (block.t === "kicker") {
      parts.push(`<text x="64" y="${y}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#333">${esc(block.text)}</text>`);
      y += 28;
    } else if (block.t === "h") {
      for (const line of wrap(block.text, 24)) {
        parts.push(`<text x="64" y="${y}" font-family="Georgia, serif" font-size="26" fill="#111">${esc(line)}</text>`);
        y += 32;
      }
      y += 6;
    } else if (block.t === "figure") {
      parts.push(`<text x="64" y="${y + 20}" font-family="Georgia, serif" font-size="42" fill="#111">${esc(block.text)}</text>`);
      y += 64;
    } else if (block.t === "p" || block.t === "help" || block.t === "li") {
      const prefix = block.t === "li" ? "• " : "";
      for (const line of wrap(prefix + block.text, 42)) {
        parts.push(`<text x="64" y="${y}" font-family="Segoe UI, sans-serif" font-size="14" fill="${block.t === "help" ? "#444" : "#222"}">${esc(line)}</text>`);
        y += 20;
      }
      y += 8;
    } else if (block.t === "banner") {
      const lines = wrap(block.text, 40);
      const h = 18 + lines.length * 18;
      parts.push(`<rect x="64" y="${y}" width="334" height="${h}" rx="8" fill="#f3f3f3" stroke="#bbb"/>`);
      lines.forEach((line, index) => {
        parts.push(`<text x="76" y="${y + 20 + index * 18}" font-family="Segoe UI, sans-serif" font-size="13" fill="#222">${esc(line)}</text>`);
      });
      y += h + 12;
    } else if (block.t === "label") {
      parts.push(`<text x="64" y="${y}" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#222">${esc(block.text)}</text>`);
      y += 8;
    } else if (block.t === "input") {
      parts.push(`<rect x="64" y="${y}" width="334" height="40" rx="8" fill="#fff" stroke="#999"/>`);
      parts.push(`<text x="76" y="${y + 26}" font-family="Segoe UI, sans-serif" font-size="14" fill="#333">${esc(block.text)}</text>`);
      y += 52;
    } else if (block.t === "card") {
      const h = 16 + block.lines.length * 22;
      parts.push(`<rect x="64" y="${y}" width="334" height="${h}" rx="10" fill="#fafafa" stroke="#bbb"/>`);
      block.lines.forEach((line, index) => {
        parts.push(`<text x="76" y="${y + 24 + index * 22}" font-family="Segoe UI, sans-serif" font-size="14" fill="#222">${esc(line)}</text>`);
      });
      y += h + 12;
    } else if (block.t === "row" || block.t === "low") {
      parts.push(`<rect x="64" y="${y}" width="334" height="36" rx="8" fill="${block.t === "low" ? "#eee" : "#fff"}" stroke="${block.t === "low" ? "#111" : "#ccc"}"/>`);
      parts.push(`<text x="76" y="${y + 24}" font-family="Segoe UI, sans-serif" font-size="13" fill="#222">${esc(block.text)}</text>`);
      y += 46;
    } else if (block.t === "chart") {
      parts.push(`<rect x="64" y="${y}" width="334" height="84" rx="8" fill="#fff" stroke="#ccc"/>`);
      parts.push(`<polyline points="80,${y + 30} 140,${y + 36} 200,${y + 58} 250,${y + 62} 300,${y + 28} 370,${y + 24}" fill="none" stroke="#222" stroke-width="2"/>`);
      parts.push(`<circle cx="250" cy="${y + 62}" r="4" fill="#111"/>`);
      parts.push(`<text x="76" y="${y + 78}" font-family="Segoe UI, sans-serif" font-size="11" fill="#444">${esc(block.text)}</text>`);
      y += 98;
    } else if (block.t === "split") {
      parts.push(`<rect x="64" y="${y}" width="160" height="72" rx="8" fill="#fff" stroke="#999"/>`);
      parts.push(`<rect x="238" y="${y}" width="160" height="72" rx="8" fill="#f7f7f7" stroke="#111" stroke-dasharray="4 3"/>`);
      parts.push(`<text x="76" y="${y + 40}" font-family="Segoe UI, sans-serif" font-size="13" fill="#222">${esc(block.left)}</text>`);
      parts.push(`<text x="250" y="${y + 40}" font-family="Segoe UI, sans-serif" font-size="13" fill="#222">${esc(block.right)}</text>`);
      y += 86;
    } else if (block.t === "btn" || block.t === "btn2" || block.t === "danger") {
      const fill = block.t === "btn" ? "#222" : "#fff";
      const color = block.t === "btn" ? "#fff" : "#222";
      const stroke = block.t === "danger" ? "#222" : "#222";
      parts.push(`<rect x="64" y="${y}" width="334" height="44" rx="22" fill="${fill}" stroke="${stroke}"/>`);
      parts.push(`<text x="231" y="${y + 28}" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="15" fill="${color}">${esc(block.text)}</text>`);
      y += 56;
    }
  }
  if (screen.nav) {
    parts.push(`<rect x="36" y="860" width="390" height="76" fill="#fff" stroke="#222"/>`);
    ["Home", "Timeline", "What-if", "Plan"].forEach((label, index) => {
      parts.push(`<text x="${78 + index * 92}" y="904" font-family="Segoe UI, sans-serif" font-size="12" fill="#333">${label}</text>`);
    });
  }
  parts.push(`<text x="460" y="120" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#111">Annotations</text>`);
  let noteY = 156;
  for (const note of screen.notes) {
    for (const line of wrap(note, 48)) {
      parts.push(`<text x="460" y="${noteY}" font-family="Segoe UI, sans-serif" font-size="15" fill="#222">${esc(line)}</text>`);
      noteY += 22;
    }
    noteY += 12;
  }
  parts.push(`<text x="460" y="930" font-family="Segoe UI, sans-serif" font-size="13" fill="#555">Responsive: single column under 880px. Side navigation at 880px and wider. Touch targets 44px.</text>`);
  parts.push(`</svg>`);
  writeFileSync(join(dir, screen.file), parts.join("\n"), "utf8");
}

for (const screen of screens) render(screen);
console.log(`Wrote ${screens.length} wireframes to ${dir}`);
