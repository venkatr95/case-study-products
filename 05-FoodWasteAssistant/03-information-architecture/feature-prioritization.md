# Feature prioritization and requirements traceability

Method: MoSCoW from the PRD, then a second cut for what this prototype can do honestly. Must means the core value proposition cannot be tested without it. A Must that would require a fake provider was redesigned, not dropped in silence.

Traceability lives in this file rather than a separate document, so priority and acceptance stay on the same row.

## MoSCoW

| Item | PRD | Prototype decision | Why |
| --- | --- | --- | --- |
| Manual add with name, quantity, location, optional date | Must | In | The reliable path. Scanning is optional. |
| Edit, consume, remove | Must | In, with undo | Inventory that cannot be corrected will be abandoned. |
| Use soon from user-entered dates and a lead window | Must | In | This is the home decision. |
| Reminders opt-in, easy off | Must / NFR | In, in-app only | Background push would overclaim. |
| Recipe match with missing ingredients | Must | In, sample catalog | Original recipes, source noted. |
| Dietary filters with a limitation | Should | In | Hides listed flags, including optional. Says it is not medical. |
| Shopping list that can exclude available items | Must | In | Excludes only comparable quantities. |
| Empty, duplicate, permission, error | Must | In | See `04-wireframes/edge-cases.md`. |
| Quantity units | Should | In | Mass converts. Volume converts. Count units do not. |
| Batch edit | Should | Partial | Move, remove, and mark consumed for whole selected items. No batch quantity edit. |
| Meal plan | Should | In, four dinners | Enough to test “subtract the pantry once.” |
| Barcode with confirm | Could | Partial | Two fictional codes fill a form. No database. |
| Receipt assist | Could | Unavailable state | No OCR. The screen says so. |
| Shared household | Could | Out | Open question. One kitchen. |
| Retailer purchase | Non-goal | Out | |
| Image recognition | Could | Out | A photo must not become a safety claim. |
| Regional safety reference links | Could | In, as links only | FSIS dating and FoodKeeper. Times are not copied into rules. |
| Shelf-life table | Not requested | Out | Would turn the app into a verdict machine. |

## Impact and effort, for the next build

| Bet | Impact on the UVP | Effort | Sequence |
| --- | --- | --- | --- |
| Keep the match honest | High | Already spent in the prototype | Hold |
| Learn whether people log food | High | Research, not code | Next |
| Licensed recipes | High if the catalog is the objection | External dependency | After research |
| Real barcode provider | Medium | Contract and confirm-step UX | After manual entry is shown to stick |
| Shared kitchen | Unknown | High, and the rules are undefined | Not until interviews |
| Background notifications | Medium | Platform permissions, easy to get wrong | Not in this prototype |

## Requirements traceability

| ID | Priority | Acceptance from the PRD | Screens | Prototype evidence |
| --- | --- | --- | --- | --- |
| FR-01 | Must | Named item with optional quantity, location, and date appears as entered | Welcome, Pantry, Add, Edit | `validateItemDraft`; flow test saves only after a name; quick add |
| FR-02 | Must | Consume or edit updates inventory and shopping suggestions | Item, Cooked, Shop, Review | `proposeCookedUpdates`, undo restores spinach to 200 g |
| FR-03 | Must | Approaching user-entered date is highlighted and described as not a safety guarantee | Pantry, Use soon, Settings | `classifyItem`; copy test rejects verdict phrases; opened-on is not use-soon |
| FR-04 | Must | Recipes show matching and missing ingredients | Cook, Recipe | `matchRecipe`; skillet Have vs cumin optional; salad missing cilantro |
| FR-05 | Must | List can exclude available ingredients; user can adjust | Review, Shop | Plan test expects lemon and garlic, not spinach; lines are editable |
| FR-06 | Should | Saved preferences filter recipes and avoid an allergen-safety claim | Cook, Settings | Vegan hides lemon chicken and pea skillet; disclaimer is on the page |
| FR-07 | Could | Scan result is confirmed or edited before it enters inventory | Add | Code `000000111111` fills Oat milk and does not save until the person saves |

## Non-functional traceability

| NFR | Where it is honored | Limit |
| --- | --- | --- |
| Manual entry is fast and reliable | Quick add is one name. The full form is one screen. | Speed is not measured with users. |
| Do not use color alone for urgency | Status chip text plus a distinct shape treatment in the UI | Automated contrast checks cover pairs, not a full audit. |
| Reminders opt-in and easy to disable | Settings, default off. Deny does not block the app. | No notification after the tab closes. |
| Diet data shows limitations | `COPY.dietDisclaimer` on Cook | Flags are only as good as the sample recipes. |
| Deletion and export | Settings export and confirmed delete. Recovery download. | `localStorage` is not encrypted. |
| WCAG 2.2 AA intent | Labels, focus, skip link, contrast pairs in tests | No screen reader session has been run. |
| Empty, error, offline, permission, success | Edge-case wireframes and prototype states | Loading is local and immediate. There is no network spinner for recipes. |

## Release checklist from the PRD

| Check | Status in this folder |
| --- | --- |
| Add and update without scanning | Implemented and covered by tests |
| Results show matching and missing | Implemented |
| Shopping list editable; no silent quantity assumption | Implemented |
| Date reminders configurable; no safety guarantee | Implemented, in-app only |
| Usability test shows inventory updates are maintainable | Not run. Plan is in `08-usability-testing/`. |

## Open questions left open

- Pilot date labels and food categories.
- Which entry method people will keep using.
- Which recipe source is licensed and accurate.
- How shared edits should conflict.

None of these are answered by the prototype.
