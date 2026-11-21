# Interaction specifications

Hash routes. No full page reload. State writes to `localStorage` key `freshloop.v1` after each confirmed change. The in-memory UI (drafts, open dialog, toast) is not all persisted. A refresh keeps the pantry and loses an open dialog.

## Input

| Control | Behavior |
| --- | --- |
| Text | Updates the draft on input. Re-render restores the caret by element id. |
| Quantity | Decimal. Empty is allowed only when the unit is also empty. |
| Date type | Switching to none clears the date. Other types require a valid date on save. |
| Servings | Step by 1 between 1 and 12. Amounts on the recipe scale. Staples stay staples. |
| Diet checkbox | Writes immediately. Cook hides matching flags, including optional ingredients. |
| Lead days | 1, 2, 3, or 7. Rewrites Use soon immediately. Does not turn reminders on. |
| Shop checkbox | “Got it” toggles checked and leaves the row. |
| Review checkbox | Include or exclude that line. Commit writes only included lines. |

## Validation

Save does not navigate if the draft has errors. The first error is associated with the field. Quick add of an empty name does nothing useful: the full form’s “Enter a name.” is the explicit error. A duplicate opens a dialog instead of saving twice.

## Confirmation

| Action | Confirm |
| --- | --- |
| Save new item | No extra confirm. The row appears. |
| Duplicate merge | Dialog. |
| Remove item, batch remove, batch consume, empty pantry, delete data | Dialog, danger button, autofocus on the destructive action so the keyboard user lands on it, with Cancel beside it. |
| Replace with sample | Dialog, because it overwrites items. |
| Cooked update | The whole screen is the confirm. |
| Shopping commit | The review screen is the confirm. |
| Barcode | The filled form is the confirm. Save is separate. |
| Receipt | Dialog with no capture. |
| Reminders | Allow or Don't allow. |

## Undo

Pantry writes that go through the notice helper store the previous persisted state. Undo writes it back. The cooked-skillet test expects spinach to return to 200 g and garlic to return. Dismiss drops the toast and the snapshot.

## Navigation and focus

- In-app links are hash links.
- After the first paint, a route change moves focus to `#main`.
- The first paint does not move focus.
- A dialog takes focus. Escape runs cancel.
- Disabled buttons do not activate.

## Keyboard and touch

The prototype is a document of buttons, links, and fields. Tab order follows the DOM: skip link, brand, settings, banner, main, then the bottom nav. At 960px the side nav is before the workspace in the DOM. There is no custom gesture. Batch select is an explicit mode, not a long-press, because long-press is invisible.

## Empty, error, offline

Specified in `04-wireframes/edge-cases.md`. Offline is a host flag. The UI does not retry a network call, because recipe data is bundled.

## Demo

`?demo=1` writes `sampleState()` only when the key is missing, then may set the hash to `#/pantry`. It is for review, not a hidden backdoor into someone else’s kitchen.
