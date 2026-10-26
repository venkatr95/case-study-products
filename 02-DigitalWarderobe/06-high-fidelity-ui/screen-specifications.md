# High-fidelity screen specifications — Rewear

The high-fidelity UI is the prototype, not a second set of pictures. These notes say how each screen uses the design system and how it moves the task. Tokens, type, and components are in `05-ui-design-system/`.

## Welcome

Paper page, Fraunces h1 set to the UVP, Figtree lede. Primary and secondary buttons stacked, full width on a phone. Text link to settings. No navigation, so the decision is not competing with tabs. Desktop: a narrow column, not a marketing hero with a fake phone.

## Wardrobe

Top bar with wordmark and “Portfolio prototype · stays on this device.” Sample banner when needed. Toolbar: search grows, Filters and Add item stay 44px. Category chips wrap. Count line in muted ink. Grid of cards on paper. From 960px, four columns and the side nav, which is the “visually strong grid” the PRD asked to demonstrate.

## Filters dialog

Surface sheet, ink title, chip toggles, one checkbox, Show results as primary, Clear filters as secondary. The AND/OR sentence is fine print above the groups so the results are predictable.

## Add and edit item

Single column form. Selects use the same field component. Photo well is a paper square with the garment silhouette until a photo exists, then the photo with alt text. Progress replaces the idle hint. Error uses danger text and an alert. Reviewer tools stay inside a closed disclosure.

## Item detail

Hero well, meta chips, wear panel, outfit list, action row that wraps. Mark worn today is the primary. Delete item is danger and opens a dialog rather than acting immediately. Sample items add one muted sentence about illustrative GBP prices.

## Outfits list and detail

Rows instead of a second grid, so an outfit reads as a set, not as another closet. Detail repeats occasion and weather in the lede. Factors, when present, are a panel titled “Why this was suggested,” the same words as the suggestion card, so the reason survives the save.

## Outfit builder

Radios for occasion and weather, not dropdowns, because there are six and four options and they are the point of the screen. Selected items are a plain list with Remove. The wardrobe below is a pick list with pressed state. A search field filters that list only.

## Suggestions

Same radios, so switching from Cold to Rain recomputes immediately. Each result is a panel, not a modal. Save uses the primary button. Dismiss is secondary. Gap explanations are panels too, so “add a bottom” does not look like an error toast that vanishes.

## Trips and packing

Trip rows show nights and “3 of 8 packed.” The checklist groups by category with h2s. The duplicate sentence is body text, not a tooltip. Checked state is stored on the trip.

## Settings

The quiet screen. Radios, one select, skip-color chips, two prose panels, then destructive actions separated in their own panel so they are not beside text size.

## Responsive behavior worth defending

The bottom nav becomes a side nav at 960px. Titles do not change. A reviewer on a laptop is not using a different product. They are using the same tasks with a wider grid.

## Sample data

Twelve items in `prototype/src/sample.ts`. Names, prices, and wear counts are illustrative. The UI says so. Do not replace them with scraped catalog photos of real brands.
