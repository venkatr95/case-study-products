# Validation

Checked against `05-freshloop-food-waste-assistant.md` and `master_prompt_implement_product_case_studies.md`. Date of this pass: 22 October 2026.

## Requirement coverage

| ID | Requirement | Where it is designed | Where it is exercised | Gap |
| --- | --- | --- | --- | --- |
| FR-01 | Add pantry item | Add, quick add, Pantry | Flow test: blank name blocked. Logic test: zero and unit-without-amount rejected. | Speed of entry is not timed with users. |
| FR-02 | Update inventory | Item, batch, cooked | Flow test: skillet cook leaves 50 g spinach, undo restores 200 g and garlic. | Batch edit changes location or removes the whole item. It does not edit a batch quantity. Partial consume is per item. |
| FR-03 | Highlight use-soon | Pantry, Use soon, Settings | Logic test: sample classification, lead-day boundary, opened-on stays Opened. Copy test rejects verdict phrases. | Real reminders after the page closes are out of scope. |
| FR-04 | Recipes by inventory | Cook, Recipe | Logic test: Have, staple, optional. Flow test: skillet covered, yogurt Check. | Catalog is seven original recipes, not a licensed source. |
| FR-05 | Shopping list | Review, Shop, Plan | Flow test: skillet review selects nothing. Plan review expects lemon and garlic and not spinach. | A static screenshot of Shop is the empty list. The committed list is in the click-through test. |
| FR-06 | Dietary preferences | Cook, Settings, Plan selects | Flow test: vegan hides lemon chicken. Logic test: optional egg hides pea skillet. Disclaimer is on the page. | Not an allergen dataset. |
| FR-07 | Scan then confirm | Add | Flow test: `000000111111` fills Oat milk and is absent after leaving without save. | Two fictional codes. Receipt is an unavailable dialog. |
| NFR manual entry | Quick add and one form | Implemented | Not user-timed | |
| NFR color | Words plus color | Chips | Contrast pairs asserted | No assistive-tech session |
| NFR reminders | Opt-in, easy off | Settings | Flow test: deny leaves “Reminders stay off” | Simulated permission |
| NFR diet limits | Disclaimer | Cook and recipe | Asserted in the flow test | |
| NFR export and delete | Settings, Recovery | Flow test: corrupt text downloaded and erased only on request | Storage is not encrypted |
| Empty, duplicate, permission, error, offline | Wireframes WF-02, WF-05, WF-13, WF-15, WF-16 | Flow tests for duplicate, permission, corrupt, offline | Loading state is synchronous |

## Release checklist

| Check | Result |
| --- | --- |
| Add and update without scanning | Met in the prototype |
| Matching and missing ingredients shown | Met |
| Shopping list editable and does not assume quantities | Met in the review and shop screens |
| Reminders configurable and not a safety guarantee | Met, with the in-app limit stated |
| Usability test of inventory maintenance | Not run. Protocol is written. |

## PRD screens

| PRD screen | Present |
| --- | --- |
| Onboarding | `#/welcome` |
| Pantry overview | `#/pantry` |
| Add/edit item | `#/add`, `#/edit/:id` |
| Use-soon view | `#/use-soon` |
| Recipe discovery | `#/cook` |
| Recipe detail | `#/recipe/:id` |
| Meal plan | `#/plan` |
| Shopping list | `#/shop` and `#/review` |
| Item consumed confirmation | `#/cooked/:id` and item consume |
| Settings | `#/settings` |
| Error states | Recovery, missing route, field errors, barcode miss |
| No-inventory empty state | Pantry and Cook |
| Quick demo mode | `?demo=1` seeds only when storage is empty |

## Open questions still open

- Which date labels and food categories a pilot region needs.
- Which entry method people will keep using.
- Which recipe source is licensed and accurate.
- How shared household edits should conflict.

## Master-prompt deliverables

| Deliverable | Status |
| --- | --- |
| Folder set `01` through `09` | Written |
| README and this file | Written |
| Annotated wireframes | 16 SVG files from `assets/wireframes/build-wireframes.mjs` |
| Working prototype | `prototype/`, TypeScript |
| Usability findings | Template only. Example row labeled as an example. |
| Case study | Written. Outcomes not invented. |
| Figma | Not created |

Filename deviation: traceability is inside `03-information-architecture/feature-prioritization.md`.

## Automated checks

From `prototype/` on 22 October 2026, after the pantry-row, welcome, and focus edits:

- `npx tsc --noEmit` completed with no errors.
- `npm test`: 17 tests passed (12 in `logic.test.ts`, 5 in `flow.test.ts`).

happy-dom clicks the primary journey. It does not layout CSS and it is not Chrome.

## Browser checks

On 22 October 2026 the production build was opened in headless Chrome with a device viewport, not a cropped window. At 390×844 and at 1280×900, `clientWidth` matched `scrollWidth` on welcome, pantry, use soon, cook, the spinach skillet, plan, settings, add, and shop. The sample kitchen showed 4 items marked Use soon, and the skillet showed Have plus Use soon on spinach. Shop, before any review is committed, shows an empty list.

A plain `--window-size=390,844` capture is not a 390px layout in this Chrome: the layout width stayed 500 and the bitmap cropped it. The files in `assets/screenshots/` were retaken with `Emulation.setDeviceMetricsOverride`.

Screenshots do not click. Duplicate handling, undo, the barcode confirm, the vegan filter, and corrupt recovery are in `prototype/test/flow.test.ts`. No screen reader was used. There is no browser MCP in this session.

## Incomplete on purpose

- Background push notifications.
- Receipt OCR and a live barcode database.
- Licensed recipes.
- Shared households, retailer purchase, image recognition.
- Encrypted or server-side storage.
- A measured waste reduction.
- Screen-reader certification.
- Regional date-label research.

## Incomplete that should be done next

1. Interviews.
2. The five usability tasks.
3. A keyboard and screen-reader pass of the built UI, including 320px width.
