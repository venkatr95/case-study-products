# Prototype review — Rewear

**Reviewed as a local build on 22 October 2026.** This is a designer-engineer review of the implementation, not a usability study.

## What works

- The core path in `test/flow.test.ts` loads the sample, filters “navy,” saves an outfit, renames an item and sees the new name on the outfit, deletes the item and sees it leave the outfit, then builds a trip where shared loafers are one line.
- Suggestion rules, packing, cost per wear, filters, save rules, and contrast tokens have unit tests. On 22 October 2026, `npm test` passed 18 tests and `npm run build` wrote `dist/assets/index-CGitU9fw.js`.
- Photo read, compress, progress, and failure exist in the client. The failure copy is rendered in a test. A real file was not dragged through a browser in the automated suite.
- Copy states that photos are not scanned and that location is not used. There is no recognition call and no geolocation call in the source.

## Limitations

- Data lives in `localStorage` for one origin. Quota, private browsing, and two tabs are fragile. The toast for a failed write is the only guard.
- No account, no export, no import.
- Suggestions are deliberately simple. They will make ordinary outfits, not interesting ones. Two statement colors are described and allowed.
- Two suggestions saved for the same occasion and weather both take the name “Work · Cold”. The packing line still counts them separately (“In 2 outfits: Work · Cold and Work · Cold”). Names are not made unique.
- Archived items on a packing list are not labeled archived. Noted in assumptions.
- Focus does not return to the button that opened a dialog.
- Search announces every keystroke.
- Fonts load from Google Fonts. Offline first visit uses fallbacks. The wardrobe data itself does not need the network.
- “Reviewer tools → Preview a failed upload” is a prototype affordance. Collapse it during tests.
- Sample prices are GBP figures. Changing currency relabels them. The UI says so.
- Not tested in VoiceOver, NVDA, TalkBack, or with keyboard-only on a physical phone. Desktop keyboard behavior is implemented.
- No Figma file.

## Browser check

On 22 October 2026 the production build was opened in headless Edge at `http://127.0.0.1:4174`. The click-through covered welcome, the sample wardrobe, a navy search, an item saved with no photo, two explained suggestions, a Lisbon packing list with a shared coat, the photo-failure message, the offline banner, and the settings privacy copy. Screenshots are in `assets/screenshots/`. Details and what was not exercised are in `VALIDATION.md`.

## Should a team rebuild this?

Only after the interview round. The prototype is enough to run the five usability tasks. It is not a production architecture. If research says laundry state matters more than color, change the model before polishing the grid.
