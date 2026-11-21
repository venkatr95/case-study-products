# Edge cases

| Case | User-visible result | Requirement |
| --- | --- | --- |
| No items | Empty pantry. Quick add. Sample kitchen offered. Cook explains it needs items. | Empty state |
| Blank name | “Enter a name.” | FR-01 |
| Quantity 0 | Rejected. Zero is not stored. | Honesty |
| Unit without a number | Rejected. “Will not assume.” | FR-05 guard |
| Same name, same location, compatible unit | Dialog offers to add to the existing item, or to save a separate item. | Duplicate |
| Same name, incompatible unit | Dialog refuses the merge. | Duplicate |
| Same name, other location | Note, not a block. | Duplicate |
| Opened-on date | Status Opened. Never Use soon or Date passed. | FR-03 |
| Date inside the lead window, including the boundary day | Use soon | FR-03 |
| Date before today, best-before or use-by | Date passed. Copy does not say unsafe or expired. | FR-03 |
| No date | No date. Still usable in recipes. | FR-01 |
| Lead window changed | Use soon recounts. Reminders can stay off. | NFR |
| Permission denied | Reminders stay off. Pantry remains. | Permission |
| Permission allowed | In-app notice only while the page is open. | NFR |
| Staples on | Salt, pepper, and water left off the shopping list. | FR-05 |
| Staples off | Those lines can be selected. | FR-05 |
| Optional ingredient missing | Optional, left off unless included. | FR-04 |
| Name alias | “Yogurt” can match “Plain yogurt.” | FR-04 |
| Loose substring | “Tomato” does not match “Canned tomatoes.” | FR-04 |
| Unit family mismatch | Check. Line stays. Nothing subtracted. | FR-05 |
| Two recipes share a pantry item | The plan subtracts the stock once. | FR-05 |
| Cooked amount greater than stock | The proposal does not invent negative food. The item is removed at zero. | FR-02 |
| Undo | Previous pantry snapshot returns. | FR-02 |
| Barcode hit | Form fills. Not saved. | FR-07 |
| Barcode miss | Nothing added. | FR-07 |
| Receipt | “Scan a receipt” explains that OCR is not connected. Nothing is captured. | Could, honest gap |
| Diet filter | Hidden recipes stay out. Disclaimer stays. Optional egg still hides a vegan recipe. | FR-06 |
| Corrupt JSON | Recovery. Raw download. Erase only when asked. | Error |
| Offline | Banner. Local pantry and sample recipes. | Offline |
| Delete kitchen | Confirm, then clear. Undo where the toast still holds the snapshot. | NFR |
| Demo query when data exists | Does not overwrite. | Demo |
| Unknown route | Missing page and a way back. | Error |
| Batch select | Move, remove, or mark the whole item consumed. Partial quantity is per item, not batch. | Should, partial |

## States required by the master prompt

| State | Where |
| --- | --- |
| Loading | Not a network step. Pantry reads local storage during the first paint. |
| Empty | WF-02 |
| Success | Toast after save, cook, or list commit |
| Disabled | Commit has nothing to add; diet-hidden recipes are not selectable |
| Permission denied | WF-13 |
| Error | Field errors, barcode miss, recovery |
| Offline | WF-16 |

## Copy that must not appear

safe to eat, unsafe to eat, throw it away, throw it out, guaranteed fresh, allergen-free, certified safe, still good to eat.

`hasSafetyVerdict` fails a test if those phrases are in `COPY` or in a date explanation.
