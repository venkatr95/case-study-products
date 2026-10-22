# Interaction specifications

## Navigation

Hash routes. The browser back button returns to the previous screen. Activating a navigation link moves focus to `main` after the new screen renders. Dialogs take focus instead, onto Cancel.

## Forms

- Submit with the primary button or Enter.
- Invalid submit does not clear the fields. Errors sit under the fields.
- Item and what-if previews update on input without a full save and without moving focus.
- The what-if “Add to plan” button enables when the preview can be calculated.
- Balance set-aside left blank saves as 0.
- Currency change does not convert existing cents.

## Save and undo

- Saving an item opens its detail and announces “Name saved. The estimate includes it.”
- Deleting an item confirms, then shows Undo once. Undo restores that item and announces the restore. A later save replaces the undo memory.
- Delete-all cannot be undone. The dialog says so.

## What-if

- Values survive moving to another screen and back during the same page load. They are not written to `localStorage`.
- Discard asks, then clears the fields and announces that the saved estimate is unchanged.
- Add to plan creates a normal one-time item and opens it.

## Alerts

- The in-app banner appears on forecast screens when the alert is on and any day’s low point is strictly below the amount. Equal to the amount does not alert.
- If notification permission is granted, one browser notification may fire per threshold and first date while a forecast screen is showing. Reloading can fire again because the session memory resets. The screen does not promise otherwise.
- Closing the tab stops device notifications. There is no service worker.

## Offline and storage

- `online` and `offline` events toggle the header pill and the banner.
- A failed `localStorage` read opens the unreadable-data screen and does not overwrite the raw text.
- Export builds a JSON file in the browser and clicks a download link. The filename starts with `moneymind-` and the date.

## Keyboard and pointer

- All actions are in tab order.
- Dialog Tab wraps from the last control to the first.
- Escape closes a dialog and does not delete.
- There is no gesture that has no button equivalent.
- The chart is not a control. Days are activated through the links on item names.

## Preview routes

`#/preview/loading`, `error`, `empty`, and `offline` are for review. They do not write the plan. The offline preview does not claim the browser is actually offline.

## Review shortcut

`?sample=1` loads the sample plan only when storage is empty. It does not overwrite an existing plan. A screen already named in the address stays open. With no screen named, it opens Home.

## Motion and feedback

No progress spinner is required for the math. It is synchronous. Confirmation is the toast and the live region, not an animation.
