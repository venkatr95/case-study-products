# Assumptions and risks

Confidence is about the assumption, not about how polished the prototype looks. Nothing in this table has been confirmed with participants.

| # | Assumption | Confidence | Risk if wrong | Mitigation in the concept |
| --- | --- | --- | --- | --- |
| A1 | People want to see the route that fails, not only the route that fits. | Medium | The comparison feels noisy. | Default sort is preference fit. Shortest is one control away. Test which order people use. |
| A2 | "Unknown" is understandable and preferable to a blank attribute. | Medium | People read unknown as "probably fine." | Unknown is defined on the results page. A match cannot include an unknown answer to a selected setting. |
| A3 | Separate stair, curb, and grade settings are worth the extra controls. | Low | Setup feels like a form. | Three presets fill the settings. The settings stay visible so they are not a hidden mode. |
| A4 | Seattle has enough sidewalk data for a credible pilot after licensing. | Low | The pilot city is wrong. | The prototype is labeled a sample. City choice stays an open question. |
| A5 | Community reports are useful if they cannot become "confirmed" by themselves. | Medium | Reports feel pointless, or reviewers are overwhelmed. | Pending versus verified is visible. Withdraw exists. No public queue is simulated. |
| A6 | A text list can carry the decision without a production basemap. | Medium | People do not trust a schematic. | The list is specified as complete. The schematic is marked as a prototype stand-in. |
| A7 | On-device preferences are enough to test the job. | High for a test, low for a product | People expect an account. | The saved screen says there is no account. FR-06's signed-in criterion is unmet. |
| A8 | Refusing the phrase "fully accessible" increases trust. | Low | Some people want a simple yes. | Usability task checks whether people can restate the match label. |

## Product risks from the PRD

| Risk | What the design does |
| --- | --- |
| Incomplete data | Unknown is a first-class status. Evidence counts are on the card. |
| Harm from an incorrect claim | No route is labeled fully accessible. Copy says a match is not a guarantee. The service-error and empty states do not invent a path. |
| Low-quality reports | New reports are pending. Verified is a separate sample status. Conflicting reports are not merged. |
| Preference complexity | Four presets, three settings, and an explicit custom state. |

## Open decisions

- Which city has data that can be licensed and is dense enough to test. Seattle is the working hypothesis only.
- Which source may confirm an attribute: a city survey, a transit feed, a venue, or a reviewed community report. The prototype's rule is a proposal: confirmed requires a named source. A community report never supplies that by itself.
- How conflicting reports are resolved after review. The interface proposal is to keep both visible until a reviewer changes the attribute. The resolution policy is not built.
- What to do when the only match is much longer. The concept shows time and distance and lets the person choose. No automatic cutoff is set.

## Safety review before any public launch

The PRD requires a pilot-area data-quality and safety review before launch. This case study does not complete that review. The prototype uses invented grades and invented source names so it cannot be mistaken for guidance about Seattle streets.
