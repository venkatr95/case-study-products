# Interaction states

| Screen | Empty | Success | Error | Disabled | Permission | Offline |
| --- | --- | --- | --- | --- | --- | --- |
| Welcome | Not empty. It is the start. | Navigates to Pantry | None | None | None | Safety copy still renders |
| Pantry | Hero: nothing logged. Quick add and sample. | Toast after add | Duplicate dialog | Batch buttons when nothing is selected | Reminder banner if denied or allowed | Banner above the count |
| Add | Blank form | Row on Pantry | Field errors, barcode miss, receipt dialog | Save still submits and then shows errors | None | Form works locally |
| Use soon | Explains that nothing is inside the window | — | — | — | Copy still explains Opened | List remains |
| Cook | “Nothing to match yet” until the person browses anyway | Recipe cards | Hidden-count note | — | — | Sample catalog remains |
| Recipe | “Recipe not found” | Match rows | Hidden-filter banner if opened directly | Fewer at 1 serving, More at 12 | — | Steps remain |
| Review | “Nothing is selected to buy” | Commit navigates to Shop | — | Commit when nothing is included | — | Draft is in memory |
| Shop | “Nothing to buy yet” | Lines editable | — | Move into pantry when nothing is checked | — | Lines remain |
| Plan | Four empty slots | Opens Review | Filtered recipes marked in the select | — | — | Works locally |
| Cooked | “Choose a recipe first” | Toast and updated pantry | Proposal refuses a negative leftover | Update if there is no recipe | — | Applies locally |
| Settings | Defaults: reminders off, lead 3, staples on | Export downloads JSON | Delete confirm | — | Allow / Don't allow | Settings remain |
| Recovery | Shown only when parse fails | Download of raw text | Erase is the destructive success back to Welcome | — | — | Still local |

## Loading

There is no spinner. The first paint reads storage synchronously. A corrupt value routes to Recovery instead of a loading error.

## Focus and keyboard

Documented in `06-high-fidelity-ui/interaction-specifications.md`. Dialogs trap attention by being outside an inert shell. Escape cancels.

## Sample clock

Tests freeze 22 October 2026 at local noon. A reviewer’s real today will move Use soon. That is correct. The demo is not a screenshot frozen in code except inside the tests.
