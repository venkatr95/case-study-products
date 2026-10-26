# Wireframe specifications — Rewear

Frame size for the annotated boards: **390 × 844**. Grayscale. Regions are top bar, title, content, and bottom navigation (except Welcome). Primary action is the filled button. Secondary is outlined. Destructive is a separate button, never the only way forward.

Shared chrome: wordmark “Rewear,” screen title, and tabs Wardrobe, Outfits, Trips, You. Focus ring is part of the later visual system. Wireframes show tab order by reading order: title, primary content, primary action, navigation.

---

## W-01 Welcome

- **Goal:** Understand the promise and start without a photo.
- **Entry:** First launch, or “Show the introduction again.”
- **Exit:** Sample wardrobe → W-02. Empty → W-03. Storage link → W-14.
- **Hierarchy:** UVP as the title. One sentence on catalogue, occasion, trip, optional photos, no body comments. Primary “Look through a sample wardrobe.” Secondary “Start with an empty wardrobe.” Text link “How photos and data are stored.” Fine print that photos stay in this browser.
- **Actions:** those three. No skip-into-a-feed.
- **Validation:** none.
- **States:** the only state. No offline-only variant beyond the banner in W-16.
- **Accessibility:** title is the h1. Buttons are real buttons. Link is a link.
- **Requirements:** tone non-goals, setup mitigation.

## W-02 Wardrobe

- **Goal:** Scan items and narrow them.
- **Entry:** After start, or the Wardrobe tab.
- **Exit:** Card → W-07. Add item → W-05. Filters → W-04. Tabs to other sections.
- **Hierarchy:** Sample banner if sample data is loaded, with Dismiss. Search field. Category chips. Filters button. Match count. Two-column grid. Each card: image area, name, “Top · Navy · Autumn.”
- **Content:** Ivory oxford shirt, Navy merino knit, and the rest of the 12 sample names. Banner: “Sample wardrobe. These 12 items are illustrative…”
- **Actions:** search, chip toggle, Filters, Add item, open a card, Dismiss banner.
- **Validation:** none on the grid.
- **Empty:** W-03. No matches: “No items match these filters” and Clear filters.
- **Accessibility:** search has a visible placeholder and a screen-reader label. Chips are toggles. Grid is a list. Color is never the only label.
- **Requirements:** FR-01 entry, FR-03.

## W-03 Empty wardrobe

- **Goal:** Recover when nothing is catalogued.
- **Entry:** “Start with an empty wardrobe,” or after deleting everything.
- **Exit:** Add item, or load the sample.
- **Copy:** “Your wardrobe is empty.” “Add an item you already wear, or look through the sample wardrobe.”
- **Requirements:** empty state.

## W-04 Filters

- **Goal:** Narrow by color and season, or see archived items, and clear.
- **Entry:** Filters on W-02.
- **Exit:** Show results, Clear filters, Escape, or the scrim’s cancel behavior via Escape. Category chips stay on W-02, outside this dialog, because they are the frequent filter.
- **Content:** Explanation of AND across groups and OR inside a group, in one sentence. Color chips with names. Season chips. Checkbox “Show archived items instead.”
- **Requirements:** FR-03.

## W-05 Add or edit item

- **Goal:** Save a complete item.
- **Entry:** Add item, or Edit from W-07.
- **Exit:** Save item → W-07. Cancel → previous.
- **Fields:** Name (required). Category, Color, Season, Dressiness (selects, required by having a value). Notes optional. Price optional. Photo optional.
- **Helper:** “Dressiness is only used to match an occasion. It is not a rule about you.” Price helper: “Used only if you want cost per wear.”
- **Photo region:** illustration or preview, Choose a photo, Remove photo, the sentence that the picture is not scanned.
- **Validation:** empty name, name over 60 characters, notes over 280, price not a number from 0 to 100000. Errors sit at the top of the form in an alert.
- **Loading:** progress bar with percent while a photo is prepared. Save waits, and says so, if a read is in progress.
- **Requirements:** FR-01, FR-02.

## W-06 Photo failure

- **Same layout as W-05.** Alert: “The photo could not be saved. You can try again, or save the item without a photo.” Choose a photo remains. Save item remains. Reviewer tools are collapsed and are not part of the product story. They exist so a test can open the error without a broken file.
- **Requirements:** FR-01 guardrail, NFR progress/retry/failure.

## W-07 Item detail

- **Goal:** Trust the record and maintain it.
- **Hierarchy:** Back. Large image or illustration. Name as the title. Chips for category, color, season, dressiness. Notes. If sample, a line that the price is illustrative GBP. Wear panel: count, last worn, cost sentence, Mark worn today. Outfits that include it. Edit, Archive or Restore, Delete photo if any, Delete item.
- **Cost copy:** “£17.00 per wear” only when price and wears exist. “Add a price to see cost per wear.” “Wear it once to start cost per wear.” The entered price is a separate sentence so it is not confused with the quotient.
- **Requirements:** FR-02, Should metrics, deletion NFR.

## W-08 Outfit builder

- **Goal:** Select owned items and attach occasion and weather.
- **Fields:** Optional name. Occasion radios. Weather radios. Fine print that location is not used. Selected list with Remove. Warning if save is not yet possible. Note if there are two bottoms or two dresses. Search within the wardrobe. Rows with category.
- **Primary:** Save outfit. Disabled only by the save rule at submit time, not by hiding the button. If the rule fails, the error is in the selected panel.
- **Requirements:** FR-04, FR-05.

## W-09 Suggestions

- **Goal:** See up to three combinations and the reasons.
- **Content:** Occasion and weather radios. Gap paragraph if nothing can be built. Cards with item names, a row of garments, heading “Why this was suggested,” a bulleted factor list, Save outfit, Dismiss.
- **Link:** “Build an outfit yourself.”
- **Requirements:** FR-07.

## W-10 Saved outfits

- **Goal:** Reopen an outfit.
- **Empty:** “No outfits saved yet.” New outfit and Show suggestions.
- **Filled:** New outfit, Show suggestions, rows with name, occasion, weather, item count.
- **Requirements:** FR-04.

## W-11 Outfit detail

- **Goal:** Use or revise a saved outfit.
- **Content:** Occasion · weather · “Saved from a suggestion” when relevant. Item rows linking to W-07. Archived badge if needed. Factor list if it was a suggestion. Mark outfit worn today. Edit items. Add to a trip. Delete outfit.
- **Requirements:** FR-02, FR-04, FR-05, FR-07.

## W-12 New trip

- **Goal:** Choose outfits to pack.
- **Fields:** Trip name, nights (1–21), notes with the location disclaimer, outfit checkboxes.
- **Primary:** Build packing list, disabled until one outfit is checked, with “Select at least one outfit to build the list.”
- **If no outfits exist:** the trips empty state sends them to create an outfit instead of an empty checklist.
- **Requirements:** FR-06.

## W-13 Packing list

- **Goal:** Pack without duplicate lines.
- **Content:** “4 nights · 0 of 6 packed.” “Shared pieces are listed once.” Groups by category. Each row: checkbox, item name, “In Office day and Dinner” or “In Office day.” Outfit links. Edit trip. Delete trip.
- **Requirements:** FR-06.

## W-14 Settings

- **Goal:** Adjust reading size and understand storage.
- **Content:** Text size 100, 120, 140. Currency symbol with the non-conversion warning. Colors to skip. Privacy paragraphs. Replace with sample, Delete all photos, Delete all wardrobe data. About, including what is not included. Show the introduction again.
- **Requirements:** a11y, privacy, non-goals.

## W-15 Delete item

- **Dialog title:** “Delete this item?”
- **Body:** item name, then either “It will be removed from the wardrobe” or “It is in 2 outfits: Office day, Dinner. Those outfits will update.”
- **Actions:** Delete item, Cancel.
- **Requirements:** FR-02.

## W-16 Offline

- **Banner above the title:** “You're offline. Your wardrobe is saved on this device and still works.”
- The rest of the current screen stays interactive.
- **Requirements:** offline state.

## Shared behaviors not drawn as separate phones

- **Loading a photo:** the photo region shows a progressbar and a percent. The rest of the form stays.
- **Success:** a toast, for example “Outfit saved.” Undo appears only for a single photo delete.
- **Permission denied:** there is no camera permission step. The file picker is the platform’s. If the person cancels it, the form is unchanged. That is not an error.
- **Disabled:** Build packing list when no outfit is selected. Save item is not disabled. It validates instead, so the error is announced.
