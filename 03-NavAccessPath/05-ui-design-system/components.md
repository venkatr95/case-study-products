# Components

Components are documented here and implemented in `app/styles.css` and `app/src/render.ts`. There is no separate component library.

## Chrome

- **Skip link.** Visible on focus. Targets `#main`.
- **Wordmark and mark.** AccessPath plus the solid/dashed path.
- **Sample banner.** Always visible. Says the Seattle numbers are not a survey.
- **Primary nav.** Home, Plan, Preferences, Reports. Current page uses `aria-current="page"`.
- **Text size.** Cycles 100, 125, 150 and announces the change.
- **Back.** Shown when history exists.

## Actions

- **Primary button.** Teal fill, white label. One main action per region.
- **Secondary button.** Transparent, teal border and text.
- **Destructive button.** Barrier red. Used for delete and withdraw, after a dialog.
- **Text button.** Underlined focus color, for Back, Edit, and Swap.
- **Disabled primary.** Pale paper fill, ink text, visible border. Not gray-on-gray.

## Preferences

- **Preset radio.** Label, one-sentence consequence, native radio.
- **Checkbox row.** Avoid stairs. Prefer curb ramps.
- **Grade select.** No limit, under 5%, under 8%, under 12%.

## Evidence

- **Chip.** Word plus shape: Confirmed, Community-reported, Unknown.
- **Status pill.** Icon plus the full status sentence. Four fits: matches, unknowns, conflicts, unfiltered.
- **Evidence count.** "Evidence: N confirmed · N community-reported · N unknown."
- **Reason list.** Conflict and unknown lines before notes.

## Route card

Status, name, distance, time, counts, reasons, Mark on the map, View details. Left border encodes fit with a solid, dashed, or double line in addition to the text.

## Segment

Heading, instruction, distance, time, definition list of stairs, grade, curb ramp, and surface. Highlight and Report.

## Schematic

SVG with a text legend. `role="img"` and a label that points to the list. Not a basemap.

## Form

Label above control. Error summary in `role="alert"` at the top of the report form. `aria-invalid` on the category and place when those errors exist.

## Dialog

Location, delete, and withdraw. `role="dialog"`, `aria-modal="true"`, labelled heading, focus moved to the first button, Tab wrapped, Escape cancels.

## Feedback

- **Notice.** Status line after a save, choice, or delete.
- **Loading.** One sentence in `role="status"`.
- **Alert panel.** Offline and routing errors.
- **Empty panel.** No saved preferences, no reports, no route data.

## Prototype controls

A dashed region at the bottom, labeled "Prototype controls" and "not part of the product." Hidden when the page is opened with `?shot=`.
