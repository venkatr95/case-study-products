# AccessPath — routes for how you move

**Role:** Product design concept, sole author. Research, UX writing, visual design, and prototype.
**Timeline:** Proposed six-week concept. Built as a portfolio case study. Not a shipped product.
**Status:** Working browser prototype and design specification. Validation planned, not run.
**UVP:** Find routes that work for your mobility needs, not just the shortest route.

## Executive summary

AccessPath compares walking routes by the access settings a person chooses, and it shows how much of that comparison is actually known. A route can match on confirmed data, carry unknowns, or conflict with the settings. It is never called fully accessible.

The concept is a response to a specific failure: the shortest route can include stairs, a steep block, or a door nobody has described, and a single "wheelchair" or "step-free" switch often hides that uncertainty. Several real products already avoid stairs or rate places. AccessPath's bet is that the missing interface is the comparison itself: keep the failing route visible, and keep confirmed, community-reported, and unknown as different facts.

No travelers have been interviewed and no usability test has been run. The Seattle streets in the prototype are a labeled sample, not a survey. What exists is a traceable design, a TypeScript prototype that enforces the evidence rules, and a test plan for the claims that still need people.

## Problem and why it matters

A map that optimizes time assumes the traveler can use stairs and manage hills. When that assumption is wrong, the error shows up on the sidewalk. **Hypothesis:** people currently stitch together a general map, a step-free toggle if they can find it, a place rating, and a phone call, and they still get surprised.

The cost is not a number this case study can claim. The design response is to make the surprise visible earlier, and to refuse a badge that would overstate the data.

The PRD also sets a guardrail: never label a route fully accessible when required data is unknown. The interface goes one step past the guardrail and does not use that phrase at all.

## Target users and evidence status

**Primary, from the PRD:** people who need step-free or otherwise accessible routes.
**Secondary:** caregivers and people traveling for a while with luggage, an injury, or a stroller.

Three proto-personas (Maya, Andre, Priya) are hypotheses in `02-ux-research/personas.md`. They are not research. The design rule they protect is real in the UI: presets set stairs, curb ramps, and grade. They do not name a diagnosis. Needs are not assumed to be identical. The gentle-grade preset does not silently turn on stair avoidance. The stroller preset allows a steeper grade than the step-free preset. Both can be edited.

## Research approach and findings status

Discovery is planned: 5–8 interviews about the last unfamiliar trip, using recent behavior, with the prototype withheld until the story is done. The guide, screener, and an empty findings template are in `02-ux-research/`. There are no quotes. Journey pains are marked as hypotheses.

If interviews show that people only want one step-free line and do not want the failing route, the comparison screen should change. That possibility is written down so the current layout is not treated as a finding.

## Competitive landscape and opportunity

Reviewed 22 October 2026 from public pages. Detail and sources are in `01-product-analysis/competitive-analysis.md`.

- **AccessMap** already personalizes pedestrian routing, including steepness and stairs, with deep sidewalk work in Washington. It is why Seattle is the pilot hypothesis. It is also why AccessPath does not claim "preference routing" as an unused idea.
- **Google Maps** documents wheelchair place attributes and a wheelchair-accessible route option. Reporting describes a single switch and contributed data that can lag the street.
- **Citymapper** documents free step-free routes that avoid stairs, name station entrances, and accept issue reports.
- **Wheelmap** documents a place rating with an explicit grey "unknown." Unknown was not invented here. Wheelmap does not compare routes, and its main code is a traffic light.

The opening AccessPath takes is the combination: compare several routes, including the one that fails, and show evidence quality on the pieces the person asked about. Apple Maps, AXS Map, AccessNow, and Ezymob were not fully reviewed. They are listed as open checks, not as missing-feature claims.

## Product strategy and prioritization

Must-have scope is the comparison, the unknowns, the text detail, and an honest report. Saved preferences are built as browser storage and are not an account, so FR-06 is only partly met. A transit elevator notice is one sample record, so FR-07 is illustrated rather than integrated.

What was left out on purpose: turn-by-turn guidance, a multi-city launch, a live feed, and any score that collapses a route to "accessible." A score would feel decisive and would hide the product's only real advantage.

Default sort is preference fit, not shortest. Shortest remains, with a sentence that says to read the status. That tradeoff favors the UVP over habit. A test may overturn it.

## Information architecture and key flow

Home, preferences, trip, comparison, detail, entrance, report, status. The primary path is: set Step-free, enter Cal Anderson Park to Pike Place Market, read three routes, open the match, choose it.

On that sample trip the rules produce:

- **Madison gentle** — matches on confirmed data. About 2.0 miles and 48 minutes. Sidewalk surface on Western Avenue is unknown and does not break the match, because surface is not one of the settings.
- **Pike and Seneca** — some details are unknown. Grade on Pike Street and a curb ramp on Seneca have no data. A community note about uneven bricks stays a note.
- **Pine Street direct** — conflicts. Stairs are confirmed on the Pine Street link. Denny Way is about 10%, over the 8% limit. It is the shortest and it is listed last.

A route matches only when every selected fact is confirmed and inside the limit. A community report that the way is clear does not count. A community report of stairs does count as a conflict, and the words say it is not verified.

## Early wireframes and rationale

Fifteen grayscale boards, 360 × 680 phone frames with notes, are in `assets/wireframes/png/`. They were drawn in HTML so the labels would stay exact, then screenshotted.

The wireframes commit to a few choices before visual design: the failing route stays on the comparison, unknown is a chip, the map has a legend in words, and the report status says pending rather than thank-you. Those choices survived into the prototype.

## Visual direction and design system

The UI is warm paper, ink, and a deep green used as the action color, not as a safety light. Fraunces carries the name and the headings. Atkinson Hyperlegible carries the interface. Evidence uses a word plus a shape: circle, diamond, dashed square. Route cards repeat that with a solid, dashed, or double edge.

Contrast pairs were calculated and are listed in `05-ui-design-system/design-tokens.md`. A disabled button that measured 3.88:1 was darkened to 10.24:1 before this write-up.

## Final screen walkthrough

1. **Preferences.** Step-free is a filled-in set of controls, not a locked mode.
2. **Trip.** The active settings sit above the places. Location asks first and, in this prototype, does not read the device.
3. **Comparison.** Status, distance, time, and an evidence count. The headline says a match is not a guarantee.
4. **Detail.** Every segment is a definition list. Choose saves a recent trip and does not start guidance.
5. **South arcade entrance.** "One step at the door" and "a temporary ramp was in place" are both pending. The step attribute stays unknown. The screen says the reports are not merged.
6. **Report status.** "Report pending review." The body says other people will not see it as a confirmed fact. Withdraw is the undo.

Screenshots: `assets/screenshots/`.

## Prototype

TypeScript, compiled, no UI framework. `npm test` runs the compiler and 19 tests that lock the evidence rules, the empty states, report status, and HTML escaping. `npm start` serves `http://127.0.0.1:4175`.

The schematic is not a city map. It exists so the list can be checked against a drawing with the same three line patterns. A production map would need a license and a data review this concept does not have.

## Accessibility, edge cases, and trust

The list is the accessible alternative to the drawing. Status is never color alone. Focus is visible. Dialogs trap the keyboard. Text can be set to 125% or 150%. User-written reports are escaped.

Trust decisions:

- No blanket access rating.
- Unknown blocks a match when the person asked about that fact.
- Sources and times are attached to confirmed sample facts, and the banner says the sources are invented.
- Outside the sample area, the app draws nothing.
- A routing error does not fall back to the shortest walk.
- Location copy says the prototype does not upload coordinates.

A screen-reader pass was not listened to. That is an open validation task, not a claim of conformance. The target remains WCAG 2.2 AA.

## Usability validation and iterations

Validation is planned: five concept-test participants, five tasks, a comprehension rubric, and an empty findings log. See `08-usability-testing/`.

Author changes made while building are logged separately from findings, because there are no findings. The important ones are the ban on a blanket label, the rule that community notes cannot confirm, the decision to show conflicting reports side by side, and the rename to "Mark on the map" after the old label pointed at a hidden schematic.

## Success metrics

The PRD's bars — 80% can set a preference and choose a suitable route, 80% can distinguish the three evidence states, fewer selection errors than a baseline, and zero overclaims — are the future study's targets. They are not outcomes. The automated tests check the overclaim rule and the logic a human task would depend on. They do not estimate the percentages.

## Limitations, learnings, and next steps

**Limitations.** No participants. No licensed sidewalk data. No account. No live transit. No basemap. Seattle may be the wrong pilot. The evidence rules are a proposal for the open questions in the PRD, especially how a conflict between reports gets resolved: the UI refuses to average them and leaves the policy to a reviewer who does not exist yet.

**Learning.** The hardest design problem was not the layout. It was deciding what a "match" is allowed to ignore. An unknown surface can sit on a matching route, because the person did not ask about surface. An unknown grade cannot, if they set a grade limit. That distinction is the product. If a test shows people treat every unknown as a failure, or every unknown as permission, the rule needs to change in public, not in a footnote.

**Next steps.**

1. Run the five discovery interviews before adding features.
2. Run the five-person concept test against the tasks already written.
3. Only then pick a pilot city and a data license. AccessMap and OS-CONNECT make Seattle a serious candidate. They do not make it a decision.

## Portfolio visuals

| Visual | File | Caption |
| --- | --- | --- |
| Preference setup, high fidelity | `assets/screenshots/preferences.png` | Presets fill settings. They do not label a person. |
| Route comparison | `assets/screenshots/results.png` | The longest route matches. The shortest conflicts. |
| Map and list | `assets/screenshots/map.png` | The drawing repeats the list. It does not replace it. |
| Entrance conflict | `assets/screenshots/place.png` | Two reports, no blended answer. |
| Report pending | `assets/screenshots/status.png` | Submitted is not verified. |
| No match | `assets/screenshots/nomatch.png` | The app explains instead of relaxing the setting. |
| Low-fidelity comparison | `assets/wireframes/png/s04-results.png` | The status order was decided before color. |
