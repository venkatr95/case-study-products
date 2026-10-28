# Feature prioritization

Method: MoSCoW from the PRD, then a check that the Must items are what make the UVP visible. Effort is judged for this prototype, not for a production routing stack.

| Item | Priority | Impact on the UVP | Effort in this prototype | Decision |
| --- | --- | --- | --- | --- |
| Preference presets and settings | Must | High | Built | Ship in the concept |
| Route comparison with time, distance, barriers, confidence | Must | High | Built | Ship in the concept |
| Unknown left unknown | Must | High | Built | Ship in the concept |
| Segment and entrance text | Must | High | Built | Ship in the concept |
| Map and list | Must | High | Schematic plus list | Ship as a schematic, not a basemap |
| Barrier report and pending status | Must | High | Built, local only | Ship in the concept |
| Saved preferences | Should | Medium | Browser storage | Built, with the account gap documented |
| Recent routes | Should | Medium | Browser storage | Built |
| Community timestamps and review state | Should | High | Sample plus new pending reports | Built as a status model, not a queue |
| Verified elevator notice | Could | Medium | One sample alert | Illustrated, not integrated |
| Live transit | Could | High later | Not started | Hold |
| Offline route notes | Could | Medium | Offline state only | Hold the notes |
| Accounts | Implied by FR-06 | Medium | Not started | Hold |
| Turn-by-turn | Non-goal | Negative if it overclaims | Not started | Do not build |
| Multi-city | Non-goal for now | — | Not started | Do not build |
| Blanket "fully accessible" score | Forbidden by the guardrail | Harm | Test forbids the label | Do not build |

## Why the shortest route is not the default

If the list led with Pine Street direct, the product would repeat the problem it describes. Preference fit is the default. Shortest remains, with a warning to read the status. **To validate:** which control people actually use.

## Requirements traceability

| ID | Requirement | Screens | Acceptance in the prototype |
| --- | --- | --- | --- |
| FR-01 | Configure preferences. Results reflect them, or explain no match. | S02, S04, S10, S11 | Step-free, gentle, and stroller change the Volunteer and Broadway outcomes. No-match headline is tested. |
| FR-02 | Compare distance, time, barriers, confidence. | S04, S05, S06 | Each card shows miles, minutes, reasons, and confirmed / community / unknown counts. |
| FR-03 | Missing data is unknown, not assumed accessible. | S04, S06, S07 | Unknown grade or curb blocks a match. Test covers a community "all clear" too. |
| FR-04 | Segments and notes in text, not only on the map. | S05, S06 | The list is present in Map view. The schematic is `aria`-described as secondary. |
| FR-05 | Report gets a status. Pending is distinct from verified. | S08, S09, Reports | Submit creates Pending review. A sample verified report is labeled not yours. Withdraw works. |
| FR-06 | Signed-in save, change, delete. | S02, S10 | Change and delete work locally. **Gap:** no signed-in user. |
| FR-07 | Trusted outage feed with source and time. | Station elevator route, detail | **Gap:** one illustrative notice. Not a feed. |
| NFR | Text alternative to the map | S05, S06 | List of segments with the same attributes. |
| NFR | Uncertainty language and timestamps | S04, S07, S09 | Chips, source lines, formatted Pacific time. |
| NFR | Minimize location retention | S14 | Disclosure. No Geolocation API call. Sample start is a label. |
| NFR | Moderation before public reports | S08, S09 | Copy says the report is not public and not verified. No public feed is implemented. |
| NFR | WCAG 2.2 AA aim | Design system and prototype | Contrast pairs recorded. Keyboard, focus, names, text scale. Not a formal audit. |

## Release checklist from the PRD

| Check | Prototype status |
| --- | --- |
| Set preferences and compare | Works on the sample trips. |
| Missing data represented honestly | Works for the coded attributes. |
| Essential information without the map | Works. |
| Reports show status and time | Works locally. |
| Pilot data-quality and safety review | Not done. Required before any public launch. |
