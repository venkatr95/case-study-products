# Wireframe specifications

Frames are structural. Copy on the SVG is the real interface language, shortened to fit 390px. The prototype is the full copy. Field-level behavior that is awkward to draw is specified here.

Shared chrome after welcome: brand, kitchen name, Settings, primary nav, main heading. Dialogs cover the page. A toast sits above the bottom bar.

## WF-01 Welcome

- **Goal:** Understand the promise and the limit before any food is stored.
- **Entry:** First visit. **Exit:** Start my kitchen, or Try the sample kitchen.
- **Hierarchy:** UVP as the only title. Safety sentence. Three steps: add, notice dates, shop the gap. Two buttons. A quiet line that the sample is fictional.
- **Primary:** Start my kitchen. **Secondary:** Try the sample kitchen.
- **Validation:** No fields.
- **PRD:** Problem framing, guardrail, demo mode.

## WF-02 Empty pantry

- **Goal:** Add the first item, or load the sample, without a dead end.
- **Entry:** Start my kitchen. **Exit:** Add, or sample.
- **Hierarchy:** Empty explanation. Name field for quick add. Link to the full form. Sample action.
- **Error:** Blank submit does not create an item.
- **PRD:** Empty state, FR-01.

## WF-03 Pantry

- **Goal:** See how many items need attention before browsing storage.
- **Entry:** Nav or demo. **Exit:** Use soon, add, item, Cook.
- **Hierarchy:** Sample banner when relevant. Count of Use soon. Separate Date passed sentence. Reminder that dates are not a safety check. Quick add. List rows with name, amount, location, and a word status.
- **Primary:** Open the use-soon list.
- **PRD:** FR-01 display, FR-03.

## WF-04 Add item

- **Goal:** Save a name and, if the person has them, a quantity, unit, location, and date.
- **Fields:** Name. Quantity. Unit. Location (fridge, freezer, cupboard, other). Date type (best-before, use-by, opened-on, no date). Date. Note.
- **Primary:** Save. **Secondary:** Cancel back to Pantry.
- **Validation:** Name required. Zero rejected. A unit with a blank quantity is rejected, because the app will not assume an amount. Opened-on still requires a date if that type is chosen. No date clears the date.
- **PRD:** FR-01, FR-07 entry point.

## WF-05 Duplicate

- **Goal:** Avoid a second spinach in the same location by accident.
- **Content:** Names the existing item and location. Offers to add quantity when units match. Otherwise explains that the units differ and will not merge.
- **Primary:** Add to the existing item, when the units match. **Secondary:** Save as a separate item, or go back. Separate is allowed even when a merge is possible, because the person may mean a second package.
- **PRD:** Duplicate state.

## WF-06 Use soon

- **Goal:** Read the items inside the window, including Date passed, without treating Opened as expired.
- **Content:** Lead window in words. Explanation that Opened is not an expiry. Rows. Link into a recipe that uses the first attention item when one exists.
- **PRD:** FR-03.

## WF-07 Cook

- **Goal:** Pick a recipe from what is already in the kitchen.
- **Content:** Diet checkboxes. Limitation sentence. Recipe cards with a one-line match summary, time, and servings.
- **Hidden recipes:** The list shows a count and the diet limitation, plus Clear diet filters. It does not keep the hidden titles on the list. Opening a hidden recipe by its address still shows the specific reason and lets the person read it.
- **PRD:** FR-04, FR-06.

## WF-08 Recipe

- **Goal:** See ingredients and steps, and see the pantry match on every line.
- **Content:** Source note (original sample, not a licensed service). Servings stepper. Each ingredient with status and reason. Steps.
- **Primary:** Shop for what's missing. **Secondary:** I cooked this.
- **PRD:** FR-04, recipe detail.

## WF-09 Review

- **Goal:** Confirm the gap before anything is added to the shopping list.
- **Content:** Lines that would be bought, with a reason. A second group for staples and optional items left off. Checkboxes. Quantity edits.
- **Primary:** Add the selected lines to the shopping list.
- **Empty selection:** Explicit sentence. Nothing is written to Shop.
- **PRD:** FR-05.

## WF-10 Shop

- **Goal:** Work the list. Check does not mean delete.
- **Content:** Lines with name, amount, source. Check, edit, remove. Action to add checked purchases into the pantry at a chosen location, still without inventing a unit.
- **PRD:** FR-05.

## WF-11 Cooked

- **Goal:** Update inventory with the amounts the recipe used.
- **Content:** Proposed changes. Soonest dated match is preferred. Person can change an amount before confirming.
- **Primary:** Update pantry. The heading is “Update the pantry?” **Secondary:** Back. Undo toast after success.
- **PRD:** FR-02.

## WF-12 Plan

- **Goal:** Choose up to four dinners and shop the combined gap once.
- **Content:** Four dates, recipe select, servings. Primary opens Review for the set.
- **PRD:** Meal plan should-have.

## WF-13 Reminders

- **Goal:** Turn reminders on or refuse them without blocking the kitchen.
- **Content:** Explanation that this prototype only notifies while the page is open. Allow. Deny.
- **PRD:** Permission state, NFR.

## WF-14 Barcode

- **Goal:** Show a lookup that cannot save itself.
- **Content:** Code field. Find sample product. Filled name. Sentence that it is not in the pantry until Save. Miss state for unknown codes. Scan a receipt opens an unavailable dialog, not a camera.
- **PRD:** FR-07.

## WF-15 Unreadable data

- **Goal:** Do not destroy a file the app cannot parse.
- **Content:** Explanation. Download the raw text. Erase and start over, only on a second action.
- **PRD:** Error state, deletion control.

## WF-16 Offline

- **Goal:** Keep working from local data.
- **Content:** Banner. Pantry and sample recipes still render.
- **PRD:** Offline state.

## Accessibility notes for the set

Every status is a word. Buttons have visible text. The phone frame keeps the primary action in the first screenful of the core path. Annotations on the SVG repeat the rule that color is not the only signal. Full contrast and keyboard notes are in `05-ui-design-system/accessibility.md`.
