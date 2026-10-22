# Wireframe specifications

Shared rules: one primary button per screen, sentences instead of icons-only actions, the estimate disclaimer on every decision screen, and no bank credential field anywhere. Copy in the wireframes matches the prototype closely enough to review hierarchy. The prototype is the source of truth if a label drifts.

Illustrative amounts on WF-03 through WF-09 are the sample story (lowest estimate $190, safe to spend $90, set-aside $100). They are not research data.

## WF-01 Onboarding

- **Goal:** Understand what will and will not happen before typing money.
- **Enter:** First open, or after all data is deleted.
- **Exit:** “Enter what I have now” → balance. “Explore with sample data” → Home, after a confirm if a plan already exists.
- **Regions:** Step label, headline, six plain statements, formula card, two buttons, disclaimer.
- **Primary:** Enter what I have now. **Secondary:** Explore with sample data.
- **Validation:** None. No fields.
- **States:** If storage is unreadable, the app opens WF-12 instead.
- **Access:** Heading order h1 then list. Buttons are real buttons or links. No information is only in the formula’s alignment.
- **PRD:** Onboarding, data sources, limitations.

## WF-02 Starting balance

- **Goal:** Save the cash pool the estimate starts from.
- **Enter:** Onboarding, or “Update balance” from Home or Settings.
- **Exit:** Save → Home. Back → explainer or Home.
- **Fields:** Currency symbol (USD, CAD, GBP, EUR, AUD). Current balance (negative allowed, zero allowed). Balance date (today or past). Set-aside (zero allowed).
- **Help:** Currency is a symbol only. Set-aside is “your choice, not a recommendation.”
- **Validation:** Non-numeric amounts, more than two decimal places, and future dates are rejected with a specific message. Empty set-aside is treated as 0.
- **States:** Editing sample data shows a banner that the sample label remains until sample data is removed.
- **PRD:** FR-01.

## WF-03 Home

- **Goal:** Read safe to spend and decide whether to inspect or try a purchase.
- **Regions:** Optional banners (sample, stale, missing income or bills, alert). Hero with the figure and a sentence. Lowest-estimate card. Next items or the empty prompt. Disclaimer.
- **Primary:** See the calculation. **Secondary:** Try a purchase. Add an item sits with the list.
- **Figure rules:** If there is a shortfall, the figure is $0 and the sentence states the shortfall and the date. If set-aside is $0, the sentence says no cushion was chosen.
- **Navigation:** Bottom or side bar.
- **PRD:** FR-03, entry to FR-04 and FR-07.

## WF-04 Timeline

- **Goal:** See each planned item and the running low point.
- **Regions:** Date range, chart with the lowest point marked, grouped ledger, disclosure that opens a 30-row table.
- **Quiet days:** One row for a stretch with no items, including a text marker if the lowest point falls in that stretch.
- **Chart:** Not the only representation. The table has date, income, expenses, low point, and end of day.
- **PRD:** FR-02 display, FR-03.

## WF-05 Explanation

- **Goal:** Reconstruct safe to spend from the starting balance and the items.
- **Regions:** Definition sentence. Formula rows. Shortfall note if the raw result is negative. Items on or before the low point, including same-day income marked “not counted” when bills are counted first. Items after the low point. Assumption list. Disclaimer.
- **PRD:** FR-04.

## WF-06 Add or edit item

- **Goal:** Add income or an expense, or change one, seeing the new low point before it is saved.
- **Fields:** Name (1–60). Type, expense or income. Amount greater than 0. First date. Repeats: once, weekly, every two weeks, monthly. Category. Note up to 280, optional.
- **Preview:** “If you save, the lowest estimate would be … It is … now.” Invalid fields replace the preview with what to enter.
- **Monthly help:** If the anchor day is 29–31, say that shorter months use the last day and the following month returns to the anchor day.
- **Actions:** Save, Cancel, and Delete when editing.
- **PRD:** FR-02, FR-05.

## WF-07 Item detail

- **Goal:** See one item’s amount, repeat rule, and dates inside this window.
- **If no date falls in the window:** Say it is saved and will matter when the window includes a date. Do not imply it changed today’s number.
- **Actions:** Edit. Delete, which confirms.
- **PRD:** FR-05.

## WF-08 What-if

- **Goal:** See one unsaved amount beside the saved estimate.
- **Fields:** Name, amount, date, type, category.
- **Comparison:** Two columns. The scenario column is dashed and says “Not saved.”
- **Outside the window:** Say the saved estimate does not change.
- **Actions:** Discard (confirm). Add to plan (disabled until the fields are valid). Typing does not save.
- **PRD:** FR-07.

## WF-09 Low-balance alert

- **Goal:** Choose an amount and understand what will and will not notify them.
- **Fields:** Checkbox “Show an alert in MoneyMind.” Amount, zero allowed.
- **Status:** Off, no day below the amount, or the first date below it.
- **Permission:** Unavailable, denied, granted, or not yet asked. Copy states that a device notification exists only while the page is open.
- **PRD:** FR-06.

## WF-10 Settings

- **Goal:** Reach balance, alert, summary, explainer, privacy, export, and delete.
- **Destructive:** Delete all data opens a dialog. Cancel is focused first. The confirm button is explicit.
- **Prototype-only block:** “Review interface states” links to loading, unreadable data, empty, and offline previews. The block says saved entries are not changed.
- **PRD:** Export should-have, deletion, state coverage.

## WF-11 Empty plan

- **Goal:** Show a flat estimate without pretending the person has planned their bills.
- **Hero:** Balance minus set-aside, with a sentence that no bills are entered.
- **Banners:** No income in the window. No bills in the window.
- **Actions:** Add an item. Explore with sample data, which confirms before replacing a saved balance.

## WF-12 Unreadable data

- **Goal:** Do not wipe a record the app cannot parse.
- **Actions:** Download the saved text. Erase and start over, with a second confirm.
- **Preview variant:** Says the real record was not changed and offers Exit preview instead of erase.

## WF-13 Plan

List of income, then expenses. Each row: name, repeat rule, anchor date, signed amount. Empty group says none. Add is the primary action.

## WF-14 Summary

Totals of items that occur in the 30-day window, by category. Intro line: not a grade and not a budget limit.

## WF-15 and WF-16

Replay of the rules, and a privacy page that names `localStorage`, the export file, deletion, the lack of encryption, and the absence of ads. Production retention is called an open decision.

## WF-17 Loading

A heading “Preparing your estimate” and placeholder bars. Real startup is usually immediate. The screen exists so the pattern can be reviewed.

## WF-18 Offline

Banner: entries stay in this browser. The preview route uses different wording so it does not claim the computer is offline when it is not.

## WF-19 Stale

Banner names the balance date, the number of days, and asks for an update. The ledger still renders from that date.
