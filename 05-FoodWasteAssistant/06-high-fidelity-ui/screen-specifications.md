# High-fidelity screen specifications

The high-fidelity UI is the TypeScript prototype. These notes say how each screen uses the design system and how it moves the task. Sample food is fictional.

## Welcome `#/welcome`

- **Components:** Solo shell, h1, two buttons, quiet line.
- **Content:** H1 is `COPY.uvp`. Next paragraphs are `COPY.safety` and `COPY.safetyLong`. Three numbered steps. “Start my kitchen.” “Try the sample kitchen.” “The sample kitchen is fictional. Nothing is uploaded.”
- **Task:** Choose an empty kitchen or the labeled sample.
- **Responsive:** Centered column. No bottom nav, so the choice is not competing with Pantry.

## Pantry `#/pantry`

- **Components:** Shell, hero stat, list rows, quick-add form, batch bar.
- **Content:** “4 items are marked Use soon.” when the sample clock and window say so. A separate sentence for Date passed. Safety line. Rows: name, quantity and unit, location, chip.
- **Primary action:** Open the use-soon list.
- **States:** Empty hero. Sample banner. Offline banner. Select mode with Move, Remove, Mark consumed.
- **Task:** See the decision count, then go to Use soon or add a name.

## Use soon `#/use-soon`

- **Components:** Explanation card, list rows.
- **Content:** Window length. “Opened is not an expiry.” Items inside the window, Date passed, and Opened so the distinction is on this page.
- **Task:** Pick an ingredient that should drive the recipe.

## Add and edit `#/add` `#/edit/:id`

- **Components:** Form card, barcode row, dialog.
- **Content:** Name, quantity, unit, location, date type, date, note. “Find sample product.” “Scan a receipt.”
- **States:** Field errors. Barcode hit banner. Barcode miss. Receipt dialog. Duplicate dialog.
- **Task:** FR-01 and FR-07. Save is the only way onto the pantry.

## Item `#/item/:id`

- **Components:** Detail card, quantity update, consume, remove.
- **Task:** FR-02 for a single item. Partial consume lives here. Batch consume removes the whole selected item.

## Cook `#/cook`

- **Components:** Diet choices, search, recipe cards, status line.
- **Content:** “Recipes are chosen from the sample catalog using your pantry, not from a general feed.” Diet disclaimer. Optional “Only recipes that use a Use soon or Date passed item.”
- **States:** Empty pantry blocks the catalog until “Browse sample recipes anyway.” Hidden count with Clear diet filters.
- **Task:** FR-04 and FR-06.

## Recipe `#/recipe/:id`

- **Components:** Stepper, match list, steps, two actions.
- **Content:** Minutes, summary, disclaimer or the specific hidden reason, servings from 1 to 12, ingredient rows, steps, source note.
- **Primary:** Shop for what's missing. **Secondary:** I cooked this.
- **Task:** See the match before leaving the recipe.

## Review `#/review`

- **Components:** Checkbox lines, amount fields, two actions.
- **Groups:** Lines to buy. “Left off because the pantry covers them.” “Left off as staples.” “Left off” for optional or excluded rows.
- **Empty:** “Nothing is selected to buy. Review what was left off before you decide.” Commit is disabled.
- **Primary:** Add selected items to my list.
- **Task:** FR-05. This is the honesty screen.

## Shop `#/shop`

- **Components:** Lines with Got it, amount, Delete. Add-to-list form. “Move checked items into the pantry.”
- **Empty:** Points back to Cook. Nothing is invented.
- **Task:** Edit the list. Checking “Got it” does not remove the row.

## Plan `#/plan`

- **Components:** Four date rows, recipe select, servings, one primary.
- **Content:** Selects show a suffix when a recipe lists a filtered ingredient.
- **Primary:** Build a shopping list for this plan. Opens Review with the combined draft.
- **Task:** Should-have meal plan. Proves the pantry is subtracted once.

## Cooked `#/cooked/:id`

- **Components:** Proposal list, amount edits, primary.
- **Heading:** “Update the pantry?”
- **Primary:** Update pantry.
- **Task:** FR-02. Undo toast returns the snapshot, including a cooked skillet back to 200 g spinach.

## Settings `#/settings`

- **Components:** Cards for reminders, lead days (1, 2, 3, 7), staples, diet, sample load, empty pantry, export, delete.
- **Copy:** Reminder limit. Diet disclaimer. Staples note.
- **Task:** NFRs. None of these reset the pantry unless the person confirms a destructive dialog.

## Recovery `#/recovery`

- **Components:** Explanation, download, erase.
- **Task:** Keep the raw `freshloop.v1` text until the person erases it.

## Missing

Short message and a link to Pantry or Cook. No illustrated empty illustration.

## Responsive

Under 960px the primary action stays in the document flow, above the bottom nav, with workspace padding of 96px at the bottom. From 960px the same screens sit beside the side nav. Pantry and Shop are the screens to check at both widths because the list row and the nav compete for space.
