# Components — Rewear

Build screens from these. Do not invent a one-off button for a single flow.

## Button

- **Primary:** accent fill, accentInk text, pill, min-height 44px. One primary per screen region.
- **Secondary:** surface fill, ink text, line border.
- **Danger:** danger fill. Only for delete confirms and the delete triggers.
- **Text button / link:** underlined, no fill, still 44px hit area.
- **Disabled:** opacity 0.45, not a color change alone. Used for Build packing list when no outfit is selected. The reason is a sentence under the button.

## Text field, select, textarea

Label above the control. Hint under it in muted text. Error in danger, `role="alert"`, at the top of the form as well as next to the logic that failed. Inputs are at least 44px tall and full width. Placeholder is not the label. Search has an extra screen-reader label.

## Choice group

Fieldset and legend for occasion, weather, text size, and trip outfits. Radios and checkboxes are 1.1rem with a 44px row. The selected value is the control’s state, not a color dot alone.

## Chip

Toggle button, `aria-pressed`. Used for category, color, season, and skipped colors. Pressed state is ink fill and surface text, which is the ink/surface pair reversed and still high contrast.

## Item card

Link. Illustration or photo, then name, then “Category · Color · Season.” Optional Archived pill. The image is decorative when the text is in the link. On detail, the photo has an alt of the item name.

## Outfit row and pick row

Horizontal: thumbnail, name, meta. Pick rows are buttons with `aria-pressed` when selected.

## Panel

Paper rounded region for wear stats, factors, privacy, and packing groups. Heading is an h2 or h3 in reading order.

## Banner

Sample banner and offline banner. Not dismissible for offline. Sample banner can be dismissed.

## Toast

Ink panel, status role, Close, and Undo only when a photo was just deleted. Sits above the bottom nav.

## Dialog

`role="dialog"`, `aria-modal="true"`, labelled by the h2. Focus moves to the primary action. Tab cycles inside. Escape cancels. Scrim is not a click-to-dismiss, so a misplaced tap does not delete anything. Cancel is explicit.

## Progress

`role="progressbar"` with valuenow while a photo is prepared. Percent is also text.

## Navigation

Four links, `aria-current="page"` on the active section. Item and outfit screens keep the parent tab current.

## Empty state

Short heading sentence, one line of what to do, then the actions. No illustration that competes with the next button.

## Garment

SVG silhouette. `aria-hidden` when the name is adjacent. Not a component people configure.
