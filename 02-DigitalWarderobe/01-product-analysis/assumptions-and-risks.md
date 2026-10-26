# Assumptions and risks — Rewear

Assumptions are ranked by how badly the design breaks if they are wrong. Confidence is about the PRD and the competitive review, not about users. No participant has confirmed these.

## Assumptions

| Rank | Assumption | Confidence | If it is wrong | How the design stays reversible |
| --- | --- | --- | --- | --- |
| 1 | People will tag category, color, season, and dressiness in order to get an outfit. | Low | Suggestions and filters feel like homework. | The manual outfit builder does not need the suggestion engine. Research asks which attributes they already use in their head. |
| 2 | A useful outfit can be judged from those tags plus “recently worn,” without pattern, fabric, or brand. | Low | Matches look naive. | Factors are visible, so a bad rule can be spotted. Pattern and brand are not in the MVP schema. |
| 3 | Manual entry is acceptable for a first test. Photo recognition is not required to learn whether the job is real. | Medium | The prototype under-tests the capture flow people would actually use. | Photo attach, failure, and retry are still in the flow. Recognition stays a later question, with confirmation before any detected tag is saved. |
| 4 | Occasion plus a four-value weather preference is enough context. | Low | People want a calendar and a real forecast. | Both fields are on the outfit and can be joined to a forecast later without rewriting the outfit model. Location stays opt-in if that day comes. |
| 5 | Packing belongs in the MVP even though FR-06 is marked Should in the requirements table. | Medium, as a scope reading | The prototype is larger than a strict reading of the table. | It is one flow, not a separate product. The conflict is documented rather than silently ignored. |
| 6 | Twelve varied sample items are enough to demonstrate value. The PRD success metric still asks participants to add five of their own. | Medium | The sample impresses reviewers and tells us nothing about setup. | Usability tasks include adding an item without a photo. The sample is labeled. |
| 7 | People do not want a social feed inside this job. | Medium, from the PRD non-goals and from how crowded social closets already are | A private tool feels lonely next to Whering. | Sharing is a non-goal, not a hidden screen. |
| 8 | Showing cost per wear only after a price and a wear are both present is clearer than showing a price as the cost. | Medium | People expect to see the purchase price labeled as cost per wear immediately. | The detail screen shows the entered price separately from the per-wear line. |
| 9 | A dress can be saved as a complete outfit. Two or more items can also be saved, even if they are not a “full” anchor. | Medium, interpretation of FR-04 | A strict reading wants two items always. | The two-item case is supported. The dress case is an explicit interpretation so a dress is not blocked. |
| 10 | Keeping photos in `localStorage` is an acceptable prototype of “you can delete them.” | High for a prototype, low as a production design | It teaches the right control and the wrong architecture. | Settings say the prototype does not upload. A production design would need a real deletion policy. That policy is not invented here. |

## Product risks from the PRD, and what was done

| Risk | Mitigation in this case study | Residual risk |
| --- | --- | --- |
| Setup friction | Sample wardrobe, quick add, photo optional | Untested whether five real items feel acceptable |
| Poor recommendations | Tag rules, written factors, dismiss, and a manual builder | Rules may still produce odd color mixes. Two statement colors are allowed and described, not blocked. |
| Photo privacy | No upload in the prototype. Delete photo, delete all photos, delete the wardrobe. Copy says photos are not scanned. | A future hosted product needs a real retention story. Not designed beyond the principle. |
| Moralizing tone | Copy review against a short banned list: guilt, flattering, planet, should buy | A visual system can still feel preachy if it turns into eco-green clichés. The palette avoids that on purpose. |

## PRD inconsistency

Section 5 lists a trip packing list as **Must**. Section 7 marks FR-06 as **Should**. The core flow and the release checklist both include the packing list and duplicate consolidation.

**Decision:** build packing in the prototype and the specs. Record FR-06 as Should in the prioritization table, and as included so the core flow can be tested. If a team later cuts scope, packing is the first Should to remove, not search or the manual outfit.

FR-07 (suggestions), recently worn, and cost per wear are Should and are included because they are small and they are how the UVP is demonstrated. The manual outfit remains the path that must work if suggestions are distrusted.

## Open questions, with working answers

These answers are for the prototype. They are not research findings.

| PRD question | Working answer | Still to validate |
| --- | --- | --- |
| Which attributes matter most for matching? | Category, color, season, dressiness. Notes are searchable and not matched. | Interview question  on the last outfit they assembled, and which facts they actually used. |
| Is manual tagging acceptable? | Yes for this test. Photo-assisted tagging is out. | Task: add one item with no photo. Watch where people hesitate. |
| Rules or a generated model? | Rules, with the factors shown. | If people ignore the factors, the explanation is not earning its space. |
| Minimum useful wardrobe? | The engine needs a dress, or a top and a bottom, inside the occasion and weather tags. The demo uses 12 items so the result is not a single forced outfit. The test target remains “add five.” | Five may be too few to feel magic and too many to finish in a session. The usability plan times it. |

## Unresolved decisions

- Account and sync. Out of prototype. Needed before any claim that a photo “stays deleted” across devices.
- Currency conversion. The prototype changes the symbol only and says so. It does not convert GBP sample prices into USD.
- Whether archived items should remain on a packing list. Current rule: yes, because the person still owns them. The line does not currently say “archived” on the checklist. **Known gap.**
- Laundry state. A public Whering review mentioned dirty clothes still being suggested. Rewear does not model laundry. That may matter more than another styling rule. **To validate**, not built.
- One item per category. The builder allows two bottoms and warns. Suggestions pick one top and one bottom, or one dress, plus optional layer, shoes, and one extra.
