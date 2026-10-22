# Validation against the PRD

Reviewed 2026-10-22 against `01-moneymind-predictive-finance.md` and the master implementation prompt.

## Functional requirements

| ID | In flows | In screens | In the prototype | Tests |
| --- | --- | --- | --- | --- |
| FR-01 Starting balance and date | Flow 2 | WF-02 | `#/start`, `#/balance` | Amount parsing. Future dates rejected in the form. |
| FR-02 Create income and expenses | Flows 1–2 | WF-04, WF-06, WF-07 | Plan, detail, timeline | Rent fixture changes the ledger. Outside-window item has no effect. |
| FR-03 Labeled estimate and inspectable items | Flow 1 | WF-03, WF-04 | Home, timeline, links to items | Smoke script opened home, timeline, and the table. |
| FR-04 Safe-to-spend explanation | Flow 1 | WF-05 | `#/explain` | Identity check: start + counted income − counted expenses = low point. |
| FR-05 Edit and delete | Flow 3 | WF-06, WF-07 | Edit preview, confirm, one undo | Editing rent in the fixture changes the low point. UI undo checked in code, not a separate automated UI test. |
| FR-06 Threshold reminders | Flow 4 | WF-09 | In-app status, permission copy | Strict “below” check is unit tested. Background notification is intentionally absent and labeled. |
| FR-07 What-if | Flow 1 | WF-08 | Separate column, discard, add to plan | Scenario does not mutate items. $150 dinner fixture matches the hand check. Smoke script saw both columns. |

## Release checklist

| Check | Status |
| --- | --- |
| A new user can create a useful forecast without a bank | Met in the prototype, including labeled sample data. Not met as a user-proven outcome. |
| Inputs and limitations are discoverable | Met in onboarding, explanation, assumptions, and privacy. |
| Add, edit, and delete update the forecast | Met. |
| Critical screens have loading, empty, and error states | Met, with loading as an explicit preview because storage reads are synchronous. Offline and stale are included. |
| Prototype testing confirms users understand projections are not guarantees | **Not met.** The test plan exists. No participants have been run. |

## Non-functional and privacy

| Requirement | Status |
| --- | --- |
| No bank credentials | Met. Copy tells people not to type them. |
| No forecast as advice or a guaranteed balance | Met in copy. Not proven understood. |
| Timestamp and stale inputs | Balance date is shown. Older than 7 days raises a banner. Snapshot stores `generatedAt` on save. |
| Deterministic calculations and unit tests | Met. `npm test` in `app/`. |
| Neutral copy | Met by the microcopy guide and a pass over the UI strings. |
| WCAG 2.2 AA | Designed toward it. Not formally audited. |
| Secure storage appropriate to production | **Not met, on purpose.** `localStorage` is disclosed as unencrypted. This blocks any real financial launch. |
| Retention policy | **Open.** The prototype can delete its own key. A legal retention policy is not written. |

## Design deliverables the PRD named as Figma pages

Figma was not available. Substitutes:

| Requested page | Substitute |
| --- | --- |
| Discovery | `01-product-analysis/`, `02-ux-research/` |
| IA and flows | `03-information-architecture/` |
| Low-fi wireframes | `assets/wireframes/*.svg` and `04-wireframes/` |
| Design system | `05-ui-design-system/` |
| High-fi UI | `app/` and `06-high-fidelity-ui/` |
| Prototype | `app/` and `07-prototype/` |
| Usability findings | Plan and empty template. No fake findings. |

## Master-prompt folder check

Required directories `01` through `09`, `README.md`, and `assets/` are present and filled. Extra file: this validation note. Application code lives in `app/`, separate from the case-study markdown.

## Still incomplete

- No interviews, so personas, the journey map, and the problem remain hypotheses.
- No usability results, so PRD success metrics are unmeasured.
- Competitor accessibility was not audited. Some prices were not reopened on vendor pricing pages and are marked that way in the competitive analysis.
- Screenshot capture was rerun after a narrow-width overflow fix. The files in `assets/screenshots/` are viewport captures, not full-page scrolls. Wireframes do not depend on them.
- No production threat model, encryption, or regulated bank provider.
- Countries and currencies beyond a display symbol are undecided.
- The smoke script does not cover undo, export file contents, or a screen reader.

## Verification run on 2026-10-22

- `npm test` in the prototype, after the TypeScript conversion: 18 tests passed. The same headless smoke page passed against the compiled `app/dist` bundle.
- Headless Chrome on `app/test/smoke.html`: the logged checks passed, including onboarding, sample home, explanation, timeline table and chart, what-if columns, item validation, save, reminder copy, export control, stale balance, and a sample deep link that stays on the requested screen.
- The same smoke run checks that onboarding, home, the explanation, the timeline, and the sample explanation fit a 390px frame without horizontal scrolling.
- Viewport screenshots in `assets/screenshots/` were recaptured after that width fix. Each measured `scrollWidth` matched the viewport (390px mobile, 1280px desktop).
- Manual browser tools beyond headless Chrome were not available. Keyboard order was not walked by a person in this pass.
