# Interaction specifications — Rewear

## Global

- Hash routing. The back button returns to the previous screen.
- Navigation moves focus to the h1 and scrolls to the top.
- Text inputs keep focus and the caret across re-renders.
- Chips, picks, and radios keep focus when they have stable ids.
- Escape closes a dialog first, then the filter sheet.
- Tab inside a dialog cycles.
- Toasts stay until Close, or until Undo, which only restores the last deleted photo.
- Offline and online events toggle the banner and a live announcement.

## Add item

1. Person edits fields. Draft is in memory. Refresh loses an unsaved draft. That limitation is accepted for the prototype.
2. Choose a photo. The file is checked, read with progress, drawn to a canvas no wider than 1200px, and stored as a JPEG data URL if it is under the cap.
3. Failure sets an alert and leaves every field. Save item still submits the text.
4. Save validates, writes the item, toasts, and opens the detail.
5. Editing keeps wear count, last worn, archived, sample flag, and created time. Changing the name updates every outfit that points at the id.

## Outfit builder

- Tap a row to toggle it. Pressed state is visible and exposed.
- Remove in the selected list drops that id.
- Save checks the rule, then writes. A blank name becomes “Occasion · Weather.”
- Editing the item set of a suggestion clears the stored factors and marks the outfit manual, because the old explanation would be a lie.

## Suggestions

- Changing a radio recomputes immediately. No separate Apply button, because the inputs are the request.
- Save copies items and factors onto a new outfit and opens it.
- Dismiss stores the sorted id signature.

## Packing

- Checkboxes write the packed ids. They do not invent quantities.
- Editing the trip keeps checks for items that are still on the list and drops checks for items that left.

## Wear

- Mark worn today adds one wear and sets last worn to the local date.
- If last worn is already today, the button reads Log another wear.
- Mark outfit worn applies that once to each item in the outfit.

## Destructive

| Action | Confirm | Result | Undo |
| --- | --- | --- | --- |
| Delete item | Yes, names outfits | Removes item and ids on outfits | No |
| Delete photo | Yes | Clears that photo | Yes, from the toast |
| Delete outfit | Yes | Items remain | No |
| Delete trip | Yes | Outfits remain | No |
| Delete all photos | Yes | Tags remain | No |
| Delete all data | Yes | Returns to welcome | No |
| Replace with sample | Yes if the wardrobe is not empty | Replaces items, clears outfits and trips | No |

## Filters

- Category, color, and season toggles update the grid and the live count.
- Clear filters resets query, chips, colors, seasons, and archived.
- Show archived is exclusive of the active grid.

## What is intentionally not interactive

- No drag to reorder the grid.
- No pinch, no collage canvas.
- No swipe to delete.
- No pull to refresh. There is nothing to refresh from.
