# Feature prioritization — Rewear

Method: MoSCoW from the PRD, with one documented override where the PRD contradicts itself, then a simple impact/effort note for what was actually built in the prototype.

Impact here means “how much this teaches us about the UVP in a usability test,” not revenue.

## MoSCoW

| ID | Capability | PRD | This case study | Effort in the prototype | Rationale |
| --- | --- | --- | --- | --- | --- |
| FR-01 | Add item, photo optional, manual if photo fails | Must | Built | Medium | Cannot test the wardrobe without it |
| FR-02 | Edit, archive, delete, outfits update | Must | Built | Medium | Trust and data integrity |
| FR-03 | Search and filter, clearable | Must | Built | Small | Finding is part of the job |
| FR-04 | Save and reopen an outfit of owned items | Must | Built | Medium | The value object |
| FR-05 | Occasion stored and visible | Must | Built, with weather preference on the same outfit | Small | Context |
| FR-06 | Packing list, duplicates consolidated | Should in the table, Must in scope and release checklist | Built | Medium | Core flow step 5 and the release checklist. Cut this before cutting FR-01–05 if scope slips. |
| FR-07 | Explained suggestions, dismiss or save | Should | Built, rules only | Medium | UVP demonstration. Not required for the manual task to pass. |
| — | Recently worn | Should | Built | Small | Makes “worn yesterday” a fact instead of a guess |
| — | Cost per wear | Should | Built, with strict preconditions | Small | Easy to do dishonestly. The strict version is the design. |
| — | Sample wardrobe | Risk mitigation | Built, 12 items, labeled | Small | Setup friction |
| — | Weather API | Could | Not built | — | Would need location or a city. Rejected for the MVP. |
| — | Image-assisted tagging | Could | Not built | — | PRD says confirm before saving detected tags. There is no detector. |
| — | Care and repair reminders | Could | Not built | — | Different job |
| — | Sharing | Could | Not built | — | Pulls toward a social closet |
| — | Feed, resale, body score, purchase tips, impact claims | Non-goals | Not built | — | |

## Impact / effort, only for in-scope work

| High impact, included | Lower impact, still included because cheap and specified |
| --- | --- |
| Manual outfit, suggestions with reasons, packing consolidation, add-without-photo | Cost per wear, text size, currency symbol, skipped colors |

Skipped colors are a preference that makes FR-07 dismissible in a durable way (“never suggest pink”) rather than only dismissing one combination. Small, and it respects taste without a model.

## Traceability

| Requirement | Screens | Acceptance in the prototype | Checked by |
| --- | --- | --- | --- |
| FR-01 | Add item, photo error, wardrobe grid | Saving with required fields adds the item. Photo failure still allows save. | Flow test saves an edited item. Render test shows the failure copy and Save item. |
| FR-02 | Edit, delete dialog, outfit detail | Edit changes the name inside the outfit. Delete confirms and removes the id from outfits. | Flow test |
| FR-03 | Wardrobe, filters | Query “navy” matches navy items. Clear filters exists. AND/OR covered in unit tests. | `filters` tests and flow test |
| FR-04 | Outfit builder, outfit detail | Two items save and reopen. A lone non-dress does not. A dress can. | `canSaveOutfit` test and flow test |
| FR-05 | Builder, detail, suggestion save | Occasion is on the outfit and on the card. | Render of outfit rows uses occasion labels. Flow saves Work. |
| FR-06 | New trip, packing list | Shared loafers appear once, with both outfit names. | Packing unit test and flow test |
| FR-07 | Suggestions | Work + Cold includes an outer layer and the factors mention work and cold. Dismiss control is in the UI. Active + Warm stays casual. | `suggest` tests and render test |
| NFR photos | Add item, settings | Progress role, error, retry via choosing again, delete photo, delete all photos. | Render test for the error. Delete-all is implemented, not separately unit-tested. |
| NFR no inference | Add item, settings | Copy states the photo is not scanned. No recognition code exists. | Code review of `photo.ts` |
| NFR deletion | Dialogs, settings | Item, photo, all photos, all data. | Item delete covered in the flow test |
| Privacy | Settings, trip notes, outfit form | No location field that is geocoded. Destination is a note. | Copy review |
| Release: manual wardrobe without AI | Add item | Required fields are typed by the person. | Prototype |
| Release: predictable filters | Wardrobe | Documented AND/OR and tests | Tests |
| Release: outfits editable if an item changes | Edit item | Ids, not copies | Flow test |
| Release: packing consolidates duplicates | Packing list | Union by item id | Tests |
| Release: usability identifies decision friction | Test plan | Not run | `08-usability-testing/` |

## Deliberately deferred

Laundry status, calendar, live weather, accounts, sync, background removal, catalog matching, sharing, and purchase gap analysis. Each one is either a non-goal or a Could. Building them in the prototype would have blurred the UVP.
