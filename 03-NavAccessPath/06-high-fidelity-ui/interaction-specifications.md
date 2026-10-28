# Interaction specifications

## Preferences

- Selecting Step-free, Gentle grades, or Stroller replaces the three settings with that preset.
- Selecting Custom keeps whatever settings are already on screen.
- Toggling a checkbox or the grade select recomputes the preset. If the trio matches a preset, that radio selects itself. Otherwise the preset becomes Custom.
- Save writes `localStorage` and, if the person came from the trip or the results, returns there and recalculates.
- Use for this trip only updates the session set and does not write. A later refresh reloads the previously saved set, if one exists.
- Delete asks, then clears storage.

## Trip entry

- Compare stays disabled until preferences exist and the two places differ.
- Use current location opens the dialog. Use sample start sets the origin label to the Cal Anderson sample and does not call geolocation. Not now sets the status "Location stays off. Type a start place."
- Swap exchanges the fields. A sample start swaps back to the Cal Anderson place id.

## Comparison

- A 500ms status, "Comparing routes for your preferences…", then the list. The wait is 0ms when reduced motion is requested.
- Default sort is preference fit. Shortest reorders and appends a warning to the headline.
- List / Map: arrow keys when a tab is focused. The list is never removed. The schematic is hidden on narrow list view and shown otherwise.
- Mark on the map sets `aria-pressed` and thickens that route. The first route is marked initially.
- Edit preferences returns to results with the new settings.

## Detail

- Highlight this segment toggles a selected article and thickens its line.
- Choose writes a recent item and shows an undo region. Undo removes that item.
- Report a barrier opens the form with the segment or entrance filled in.
- Another entrance on First Avenue links to the south arcade so the conflicting reports are one action away.

## Report

- Submit validates, then stores status `pending` and opens the status screen.
- Withdraw confirms, then sets `withdrawn`.
- Offline sets an error and does not store.
- Description is kept in memory while typing and escaped when rendered.

## Global

- Back pops history.
- Primary nav pushes a new view. Home clears history.
- Text size persists in `localStorage`.
- Dialogs trap focus. Escape and the scrim cancel.
- View changes move focus to the h1 and update the polite live region and the document title.

## Prototype controls

Reviewers can fill the sample trip, open results, show no match, show outside the pilot, show a pair with no data, simulate a routing error, toggle offline, clear those flags, and reset demo storage. They are not a product feature.
