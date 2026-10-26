# Validation — Rewear

**Date:** 22 October 2026.  
**Compared with:** `../02-rewear-digital-wardrobe.md` (PRD v1.0) and `master_prompt_implement_product_case_studies.md`.  
**Evidence rule:** nothing below is a usability result. The browser pass is an engineering click-through of the production build.

## Commands

From `prototype/`:

| Command | Result |
| --- | --- |
| `npm test` | 18 passed (17 domain, 1 journey). Vitest 3.2.7. |
| `npm run build` | `tsc --noEmit` passed. Vite wrote `dist/assets/index-CGitU9fw.js` (66.37 kB) and `dist/assets/index-BcKHUkQN.css`. |
| Preview | `http://127.0.0.1:4174/` served that `dist`. |

The domain tests include the contrast pairs in `src/tokens.ts` against the same hex values in `src/styles.css`. Ratios are recorded in `05-ui-design-system/design-tokens.md`.

## Browser click-through

Headless Edge, production build, storage key `rewear.v1` cleared first. Log: `assets/screenshots/smoke-log.json` (`failed: 0`).

| Step | What happened |
| --- | --- |
| Welcome | Title is the UVP. Copy says the product does not comment on your body. Screenshot `01-welcome.png`. |
| Sample wardrobe | **Look through a sample wardrobe** at a 390×844 viewport. “12 items of 12 active” and Navy merino knit. Screenshot `02-wardrobe-mobile.png`. |
| Search | At 1100px, query `navy`. Live region: “2 items match.” Visible count: “2 items of 12 active.” Navy merino knit and Navy overcoat. Black tee was not shown. Screenshot `03-search-navy.png`. |
| Manual add | **Add item**, name “Grey scarf”, no photo. Detail title “Grey scarf”, “Not worn yet”, and no **Delete photo** control. |
| Suggestions | **Outfits → Show suggestions**. Work and Cold were selected. The card includes **Why this was suggested**. Screenshot `04-suggestions.png`. |
| Save | Two suggestions saved. Each detail says “Saved from a suggestion” and keeps the factors. |
| Packing | Trip “Lisbon”, 4 nights, both outfits selected, **Build packing list**. “Shared pieces are listed once.” Navy overcoat: “In 2 outfits: Work · Cold and Work · Cold”. Screenshot `05-packing.png`. |
| Photo failure | **Reviewer tools → Preview a failed upload**. The form stays on Add item. Copy: “The photo could not be saved. You can try again, or save the item without a photo.” **Save item** remains. Screenshot `06-photo-failure.png`. |
| Offline | `offline` event. Banner: “You're offline. Your wardrobe is saved on this device and still works.” Screenshot `07-offline.png`. |
| Settings | “location is not collected” and “does not scan photos”. |

The first automated attempt selected both trip outfits inside one script loop. The app replaces the form on each change, so the second checkbox node was already gone. Clicking one outfit, then the next, selected both. That is how a person uses the control. It is not a failed user path.

## What the browser pass did not do

- No real image file. Failure was the reviewer-tool preview. Progress and retry for a real file were not watched.
- No VoiceOver, NVDA, TalkBack, or keyboard-only pass on a phone.
- Filters dialog, archive, delete confirmation, mark worn, text size, and currency were not clicked. Domain tests cover filters, delete-from-outfits, cost per wear, and save rules.
- No second browser tab. Last write wins in `localStorage`.
- HEIC was not tried. Accepted types are jpeg, png, webp, and gif.

## Requirement trace

| ID | PRD priority | In the prototype | Checked by |
| --- | --- | --- | --- |
| FR-01 Add item | Must | Name, category, color, season, dressiness, optional notes, price, photo. Manual save if the photo fails. | Domain render test, browser add, browser failure copy |
| FR-02 Edit and remove | Must | Edit, archive, delete. Delete names affected outfits, then removes the item from them. | `test/flow.test.ts`, `wardrobe` unit test. Delete dialog not clicked in the browser. |
| FR-03 Search and filter | Must | Query, category chips, color, season, archived. Clear filters. AND across groups, OR within. | Domain filter test, browser navy search |
| FR-04 Build outfit | Must | Two items, or one dress. Reopen from Outfits. | Flow test and browser suggestion save |
| FR-05 Occasion | Must | Occasion and weather preference on the outfit and on its detail. | Flow test, suggestion detail in the browser |
| FR-06 Packing | Should in the table, Must in the scope list | Implemented. One line per item. Shared lines name every outfit. | Domain packing test, flow test, browser Lisbon list |
| FR-07 Suggest | Should | Rules, written factors, save, dismiss. | Domain suggestion tests, browser cards |
| Recently worn | Should | Mark worn today / log another wear. | Implemented. Not clicked in the browser. |
| Cost per wear | Should | Hidden until price and at least one wear exist. | Domain test |
| Photo progress, retry, failure | NFR | Progress while reading. Error with retry or save. | Render test and browser error. Real-file progress not watched. |
| Delete photos and records | NFR | Delete photo with undo. Delete all photos. Delete all wardrobe data. | Implemented. Not clicked in the browser. |
| Small screens, text, screen readers | NFR | 390px layout in the browser. Text size 100/120/140. Labels, live region, focus to the heading. | Mobile screenshot. Not a screen-reader audit. |
| No sensitive inference | NFR | No recognition call. Copy says photos are not scanned. | Source review and settings copy in the browser |
| No exact location | NFR | No geolocation. Weather is a preference. | Source review and settings copy |
| Manual alternative for photo actions | Must | Add, edit, and save do not require a photo. | Browser add |
| Release: manual wardrobe | Checklist | Empty start and add form. | Welcome and add form |
| Release: predictable search | Checklist | Tagged match count. | Browser and filter tests |
| Release: outfits follow item edits | Checklist | Rename and delete update outfits. | Flow test |
| Release: packing consolidates | Checklist | Shared coat listed once. | Browser and packing test |
| Release: usability test of decision friction | Checklist | Plan and blank findings only. Not run. | `08-usability-testing/` |

Could-have items are not built: weather API, image-assisted tagging, care and repair, sharing. Non-goals are absent: social feed, resale, body scoring, purchase recommendations, environmental-impact claims.

## Wireframes

Visual frames, 390×844, grayscale, annotated: `assets/wireframes/wireframes.html`. A print is `assets/wireframes/wireframes.pdf` (page 1 title checked).

Drawn: W-01, W-02, W-03, W-05, W-06, W-08, W-09, W-13, W-15, W-16.

Specified in `04-wireframes/wireframe-specifications.md` and built in the prototype, not drawn as extra phones: W-04 Filters, W-07 Item detail, W-10 Saved outfits, W-11 Outfit detail, W-12 New trip, W-14 Settings.

No Figma file.

## Still incomplete

- No interviews. Personas and the journey are hypotheses.
- No moderated usability test. PRD rates (70%, 80%, under 3 minutes) are not measurements.
- Not a WCAG audit. Known gaps: dialog focus does not return to the opener, search announces every keystroke, Google Fonts may be absent offline, forced colors and a screen reader were not tested.
- Packing lines do not say when an item is archived.
- No laundry state.
- Currency changes the symbol only.
- Two suggestions for the same occasion and weather share one generated name.
- `localStorage` is not a production deletion or sync design.
- Sample wardrobe prices are illustrative GBP figures.

## Folder check

Every directory in the master prompt is present, including `assets/diagrams/`, `assets/wireframes/`, and `assets/screenshots/`. The app lives in `prototype/`, separate from the docs.
