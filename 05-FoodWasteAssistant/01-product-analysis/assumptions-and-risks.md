# Assumptions and risks

Confidence is about the design bet, not about evidence. Nothing in this table has been confirmed with participants.

| # | Assumption | If wrong | Confidence | Risk if we ignore it |
| --- | --- | --- | --- | --- |
| A1 | Household meal planners will enter food if quick add is only a name. | The product never has data to match. | Low | High. Maintenance burden is the PRD’s first risk. |
| A2 | Best-before, use-by, and opened-on are enough labels for an English-language pilot. | People cannot record the date they mean. | Low | High. Open question in the PRD. |
| A3 | People want recipes chosen from what is dated soon, not from a feed. | Use soon is the wrong home module. | Low | High. It is the UVP. |
| A4 | Showing a quantity gap is more useful than hiding “I might have it.” | The review screen feels like homework. | Medium as a design principle, low as a user preference | Medium. |
| A5 | Salt, pepper, and water are fair staples. Oil is not. | Lists are noisy, or a needed staple is missing. | Medium | Low. The switch is visible. |
| A6 | A four-day, one-dinner plan is enough to test combined shopping. | People plan lunches or a full week. | Low | Medium. The screen is a should-have. |
| A7 | In-app reminders are an honest MVP because background push is easy to overclaim. | The habit fails when the page is closed. | High that the limit is real; low that the reminder is valuable | Medium. |
| A8 | Diet filters must hide optional listed ingredients too. | Vegetarian users miss recipes they would adapt. | Medium | Medium. The reason is shown. |
| A9 | One kitchen on one device is enough to learn. | The real job is shared. | Low | High for a later release, not for this test. |
| A10 | Original sample recipes are enough to evaluate the interaction. | People judge the catalog, not the match rules. | High | Medium. The source note has to stay visible in tests. |

## Product risks and mitigations

| Risk from the PRD | Mitigation in this concept |
| --- | --- |
| Inventory is too much work | Quick add with no quantity. Details are optional. Batch move and remove. Cooked update proposes amounts and can undo. |
| Date ambiguity | The person picks best-before, use-by, opened-on, or no date. Opened-on is not an expiry. |
| Food-safety harm | No keep-or-discard verdict. Links to FSIS dating and FoodKeeper. The app does not apply those tables. |
| Recipe mismatch | Have, Short, Check, Missing are written out. A plan subtracts stock once. |
| Allergen overclaim | Filters describe listed ingredients, including optional ones, and say they are not a medical judgment. |
| Reminder fatigue or a blocked app | Reminders are off until allowed. Denial leaves the list intact. Off is one control. |
| Silent data loss | Unreadable storage is not wiped. Export exists. Delete is confirmed, with undo in the prototype. |

## Unresolved decisions

- Which date labels a specific pilot region needs.
- Whether quick add, batch add, or a confirmed scan is the entry method people will keep using.
- Which licensed recipe source is acceptable.
- How a shared household should merge two edits. Not designed, because the conflict rules are unknown.
- Whether the use-soon window default of 3 days is the right pilot default. It is a starting value, not a finding.
- Currency of “waste” — item count, meals, or self-reported discards. The PRD points at self-reported frequency. That choice stands until research says otherwise.

## Open questions carried into research

See `02-ux-research/research-plan.md`. The highest-priority question is A1: will anyone keep the inventory current for a week?
