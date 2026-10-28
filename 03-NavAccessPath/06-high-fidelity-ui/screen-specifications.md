# High-fidelity screen specifications

The high-fidelity UI is the working prototype, not a second set of pictures. Screenshots under `assets/screenshots/` were captured from that UI on 22 October 2026 at a 480px-wide viewport. Tall pages are clipped in some PNGs. The live page scrolls.

Visual rules: `05-ui-design-system/`. Copy: `content-and-microcopy.md`. Behavior: `interaction-specifications.md`.

## S01 Home

- **Components:** Masthead, sample banner, nav, preference panel, trip panel, evidence disclosure, recent list.
- **Content:** "Plan a route around your access needs." Empty recent state until a route is chosen.
- **Task:** Move the person into preferences or trip entry without implying a profile.
- **Responsive:** Panels stack. Nav wraps.

## S02 Preferences

- **Components:** Radios, checkboxes, select, primary and secondary buttons.
- **State:** Step-free selects avoid stairs, curb ramps, and under 8%. Gentle selects under 5% and leaves stairs and curbs off. Stroller selects stairs, curbs, and under 12%.
- **Task:** Produce the preference object the comparison will use.
- **Screenshot:** `assets/screenshots/preferences.png`.

## S03 Trip

- **Components:** Preference summary, two selects, location button, compare button.
- **Disabled:** Compare, until preferences and two different places exist.
- **Task:** Bind a preference set to a pair of places.

## S04 and S05 Results

- **Components:** Trip line, headline, tabs, sort, route cards, legend, evidence help.
- **Sample order at step-free, preference fit:** Madison gentle (match, about 2.0 mi, about 48 min), Pike and Seneca (unknowns, about 1.7 mi, about 41 min), Pine Street direct (conflict, about 1.2 mi, about 26 min).
- **Task:** Make the evidence difference the thing that is compared, with time still visible.
- **Wide:** Schematic and list side by side.

## S06 Detail

- **Components:** Status, counts, optional service notice, schematic, segment articles, entrance action, choose, report.
- **Madison:** Match remains true with the Western Avenue surface called out as unknown and not selected.
- **Station elevator route:** Conflict banner names "Sample transit feed" and the update time. Copy says it is not a live feed.

## S07 Entrance

- **First Avenue:** Step confirmed from a sample venue note, door described as a sample figure, elevator unknown.
- **South arcade:** Step unknown. Two pending reports. Merge sentence.

## S08 and S09 Report

- **Form:** Category, where, description.
- **Status:** Heading "Report pending review." Body says not verified. Withdraw.
- **Reports list:** User rows plus one sample verified report marked "Not yours."

## S10 Saved

- On/off list, edit, delete. Empty state if nothing is stored. States that there is no account.

## S11–S15 States

- No match, outside pilot, no data, routing error, offline, location dialog, loading. Each has a heading and a recovery action except loading, which resolves to results or to an error.
- None of these states draw a guessed accessible line.

## Sample data label

Every screen includes: "Illustrative Seattle sample. Distances, grades, and sources are not surveyed measurements."
