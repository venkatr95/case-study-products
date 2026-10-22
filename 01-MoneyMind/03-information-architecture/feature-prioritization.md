# Feature prioritization

Method: MoSCoW from the PRD, then a second cut for what had to be in the prototype to make the UVP inspectable. Effort is a judgment about this prototype, not a team estimate.

## Must — in the prototype

| Item | Why it is must | Effort | Where it lives |
| --- | --- | --- | --- |
| Explainer before entry | Limits have to precede the number | Low | `#/welcome` |
| Balance, date, currency symbol, set-aside | FR-01. The estimate needs a start | Low | `#/start`, `#/balance` |
| Items with repeat rules | FR-02, FR-05 | Medium | Plan, detail, edit |
| 30-day ledger, chart, and table | FR-03. The table is there so the chart is not the only form | Medium | `#/timeline` |
| Safe-to-spend formula | FR-04. This is the UVP | Medium | `#/explain` |
| Stale, empty, unreadable storage | PRD acceptance | Low | Home banner, empty home, `#/error` |
| In-app low-balance alert | FR-06 | Low | `#/reminders` |
| Honest notification permission | FR-06 denied state | Low | `#/reminders` |

## Should — in the prototype because the story is incomplete without them

| Item | Why it was pulled into the build | Effort |
| --- | --- | --- |
| What-if, visually distinct, discard or add | The PRD’s step 5. A forecast you cannot poke is hard to trust | Medium |
| Category summary | PRD should. Kept from affecting the math | Low |
| Export JSON | PRD should, and it makes deletion less frightening | Low |
| Edit preview | Risk mitigation in the PRD, not a separate FR | Low |
| One-step undo after delete | Confirmation alone is easy to mis-tap | Low |
| Labeled sample plan | Manual-entry risk. Lets a reviewer see the trough | Low |

## Could — not built

| Item | Why it waited |
| --- | --- |
| Read-only bank connection | Needs a provider, security, consent, and legal review. Building a fake link would imply a capability the MVP must not have. |
| Shared household budgets | Changes privacy and the “one pool” model. |
| Savings-goal planning | A goal that auto-reduces safe to spend starts to look like advice. Left out until the set-aside is understood. |
| Income amount range | A range without a stated model would look scientific. Revisit only if research asks for a user-entered low and high. |

## Will not

Payments, transfers, lending, credit scoring, investing, product recommendations, bank passwords, and any sentence that calls the estimate a guarantee.

## Traceability

| ID | Priority | Screen | Acceptance in the prototype |
| --- | --- | --- | --- |
| FR-01 | Must | Starting balance | Valid cents and a non-future date save as the forecast start. Empty, non-numeric, and future dates show a message. Unit tests cover cents parsing. |
| FR-02 | Must | Add item, timeline | A saved item with amount, date, and type appears when its date is inside the window and changes the estimate. |
| FR-03 | Must | Home, timeline, explanation | Values are labeled estimates. Items can be opened from the ledger. |
| FR-04 | Must | Explanation | Shows starting balance, counted income and expenses, low point, set-aside, and assumptions. |
| FR-05 | Must | Edit, delete, undo | Save and delete update the stored plan and the next calculation. Delete confirms. Undo restores once. |
| FR-06 | Should | Alerts | Crossing below the amount shows in-app status. Denied or missing notification permission is explained. No background notification is claimed. |
| FR-07 | Should | What-if | Scenario column is separate. Discard does not write. Add to plan writes only after the button. |

## Cut line

If the prototype had to shrink, keep Home, the explanation, add/edit/delete, and the timeline table. Cut the chart before the table. Cut categories before what-if. Do not cut the disclaimer to save space.
