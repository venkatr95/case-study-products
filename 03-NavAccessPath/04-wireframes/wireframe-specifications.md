# Wireframe specifications

Shared chrome: AccessPath wordmark, Seattle sample chip, sample-data banner, and Home / Plan / Preferences / Reports. Back appears when there is a previous screen. Primary button is filled. Secondary is an outline. Phone frames are 360 × 680 inside a 1240 × 760 board.

## S01 Home

- **Goal:** Start setup or start a trip.
- **Entry:** First open. **Exit:** Preferences, Plan, or Reports.
- **Regions:** Preference summary or empty prompt. Compare-a-trip panel. Evidence explainer. Recent routes.
- **Primary:** Set access preferences, until a set exists. **Secondary:** Enter origin and destination.
- **Empty:** "No recent routes yet."
- **PRD:** Entry to FR-01 and the core flow.

## S02 Preference setup

- **Goal:** Set stairs, curb ramps, and steepness.
- **Entry:** Home, Plan, or Edit on results. **Exit:** Save, or use for this trip.
- **Content:** Step-free, Gentle grades, Stroller or luggage, Custom. Checkboxes and a grade select: no limit, under 5%, under 8%, under 12%.
- **Validation:** All-off custom is allowed and produces "No access preferences selected" on results. The trip screen blocks compare until a set exists, including that explicit custom set.
- **Notes:** Presets do not name a person. Hint states that unknown is not treated as step-free.
- **PRD:** FR-01, FR-06.

## S03 Origin and destination

- **Goal:** Name the trip.
- **Fields:** Origin, Destination, both required and different. Button: Use current location.
- **Primary:** Compare routes, disabled until ready.
- **Errors:** Same place. Missing preferences, with a link back to S02.
- **PRD:** Flow steps 1–2.

## S04 Route comparison

- **Goal:** Judge routes by fit and evidence.
- **Content per card:** Status sentence, name, distance, time, evidence counts, up to three reasons, Mark on the map, View details.
- **Sort:** Preference fit (default) or Shortest.
- **Statuses:** Matches your preferences on confirmed data. Some details are unknown. Conflicts with your preferences. A known barrier is on this route. No access preferences selected.
- **Footer:** A match is not a guarantee. A community report is not a confirmation.
- **PRD:** FR-02, FR-03.

## S05 Map and list

- **Goal:** See the same facts drawn and written.
- **Map:** Schematic. Solid, dashed, and marked lines. Legend in text. Start and End labels.
- **List:** Always present under or beside the drawing.
- **PRD:** Map/list alternative. NFR on not relying on the map.

## S06 Route detail

- **Goal:** Read segments, then choose or report.
- **Regions:** Status, distance, time, counts, service notice if any, schematic of this route, segment articles, entrance, Choose, Report.
- **Segment:** Instruction, distance, time, stairs, grade, curb ramp, surface, evidence chip, reasons.
- **Success:** "Chosen for this trip…" and Undo.
- **PRD:** FR-04, FR-07 when a notice exists.

## S07 Entrance

- **Goal:** Read one door without a blended score.
- **Content:** Step, door, elevator, source and date or a line that no source exists, report list.
- **South arcade:** Two pending reports and the sentence that they are not merged. Step remains Unknown.
- **PRD:** Place/entrance, FR-03, FR-05 context.

## S08 Barrier report

- **Goal:** Submit a description.
- **Fields:** Category, Where, What you found.
- **Errors:** Listed at the top. Empty category, empty place, description under a short sentence.
- **Primary:** Submit report.
- **PRD:** FR-05.

## S09 Report status

- **Goal:** Understand the report was not verified.
- **Content:** Pending review or Withdrawn, timestamp, category, place, description, explanation, Withdraw.
- **PRD:** FR-05.

## S10 Saved preferences

- **Goal:** Review, edit, delete.
- **Empty:** Nothing saved, with a path to set some.
- **Destructive:** Delete opens a confirm dialog.
- **PRD:** FR-06, with the account gap.

## S11 No confirmed match

- **Goal:** Understand that the settings excluded every route.
- **Content:** Headline, then the conflicting or unknown routes, then Edit preferences.
- **Example:** Cal Anderson to Volunteer Park under step-free. Grade about 12% conflicts. Stairs unknown.
- **PRD:** FR-01 acceptance, "explain why no match is available."

## S12 Routing unavailable

- **Goal:** See a failure without a fake route.
- **Primary:** Try again.
- **PRD:** Error state.

## S13 Offline

- **Goal:** Know comparison and submission are paused.
- **Secondary:** Review saved preferences.
- **PRD:** Offline state.

## S14 Location disclosure

- **Goal:** Decide before a start place is filled.
- **Actions:** Use sample start. Not now.
- **PRD:** Location minimization.

## S15 Loading

- **Goal:** Know the comparison is running.
- **Content:** "Comparing routes for your preferences…"
- **PRD:** Loading state.

## S16 Your reports

- **Goal:** See one's own pending or withdrawn reports beside one labeled sample verified report.
- **Entry:** Reports in the nav.
- **PRD:** FR-05 distinction.

## S17 Outside pilot and no data

- **Outside:** Bainbridge ferry terminal. No line is drawn.
- **No data:** An in-pilot pair the sample does not contain. Copy says that is not a claim the walk is impossible.
- **PRD:** Empty states. Do not invent coverage.

## S18 Permission denied

- **Where:** S03, after Not now.
- **Copy:** "Location stays off. Type a start place."
- **PRD:** Permission-denied state.
