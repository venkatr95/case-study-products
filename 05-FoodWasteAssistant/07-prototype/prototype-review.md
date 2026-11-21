# Prototype review

Reviewed against the PRD and the master prompt. This is a design and engineering review of the artifact, not a usability result.

## What a hiring manager can click

The loop from sample pantry to an explained shopping gap and a cooked update, including undo. The trust states: date language, diet disclaimer, barcode confirm, receipt refusal, reminder refusal, corrupt storage, offline.

## Decisions that should survive a critique

- Home is a count of user-entered dates, not a recipe feed.
- Check is a successful honest result, not an error style.
- A plan subtracts shared pantry items once. The sample makes that visible with lemon and garlic.
- Opened-on cannot become Use soon by changing the lead window.
- The app links to FSIS and FoodKeeper and does not encode their tables.

## Decisions a critique should pressure

- Quick add may still be too much work. A1 is untested.
- Four dinners may be the wrong plan shape.
- Hiding filtered recipes, instead of showing them dimmed with the reason on the card, may hide why the list got shorter. The count and the disclaimer are present. A usability task should check whether that is enough.
- “Scan a receipt” as a button could imply a camera exists. The dialog corrects it. The label is a risk.
- Georgia plus a long UVP must wrap on a 320px width. The CSS uses clamp and overflow-wrap. A 320px pass is still worth doing by hand.

## Defects fixed in this build

- Pantry rows put the name and the amount on separate lines so the chip does not collide with the name.
- Welcome no longer repeats the UVP under the h1.
- The first paint does not focus the whole main region.

## Not defects

- No push notifications.
- No real barcode database.
- No shared kitchen.
- Batch quantity edit is absent on purpose and listed as a partial Should.

## Evidence

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` in `prototype/` | Passed after the layout edits |
| `npm test` | 17 tests passed (12 logic, 5 flow) |
| Wireframes | 16 SVGs |
| Browser screenshots | See `assets/screenshots/` and `VALIDATION.md` for what was captured after the rebuild |
| Figma | Not created |
| Interviews and usability sessions | Not run |
