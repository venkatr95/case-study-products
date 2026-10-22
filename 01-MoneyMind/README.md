# MoneyMind

Know when you may run short of money before it happens.

MoneyMind is a mobile-first portfolio prototype. A person enters a current balance, expected income, and upcoming bills. The app builds a 30-day cash estimate and a safe-to-spend figure, then shows the math. It does not connect to a bank, move money, or give financial advice.

**Status:** Design and prototype complete for review. No customer interviews or usability tests have been run. Every user problem, persona, and success target in this folder is a hypothesis until that research happens.

**Role in this folder:** End-to-end product design, UX writing, design system, and front-end prototype. Timeline is proposed, not a staffed engagement.

## Review the prototype

From `app/`:

```powershell
npm test
npm start
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/).

- `npm test` typechecks the TypeScript sources, then runs the deterministic forecast tests with Node’s built-in test runner.
- `npm start` compiles `app/src` to `app/dist` and serves the app on port 4173. TypeScript is a build-time dependency. The page itself is the compiled script, with no UI framework.
- Add `?sample=1` on a browser with no saved MoneyMind data to open the labeled sample plan. A screen already in the address stays open, for example `http://127.0.0.1:4173/?sample=1#/explain`. With no screen named, it opens Home.
- The browser smoke page is `http://127.0.0.1:4173/test/smoke.html`. It walks onboarding, sample data, the explanation, the timeline, a what-if, validation, save, reminders, export, and a stale balance.

Do not enter bank passwords or full account numbers. Entries stay in this browser’s `localStorage` under `moneymind.v1` and are not encrypted.

## Folder guide

| Path | What it is |
| --- | --- |
| `01-product-analysis/` | Brief, problem, competitors, positioning, risks, metrics |
| `02-ux-research/` | Plan, screener, interview guide, hypotheses, empty findings |
| `03-information-architecture/` | Sitemap, flows, task analysis, prioritization, PRD traceability |
| `04-wireframes/` | Screen inventory, specifications, annotations, edge cases |
| `05-ui-design-system/` | Principles, visual direction, tokens, components, accessibility |
| `06-high-fidelity-ui/` | Screen specs, microcopy, interaction specs |
| `07-prototype/` | Click path, states, review notes |
| `08-usability-testing/` | Test plan, scenarios, blank findings, iteration log |
| `09-case-study/` | Portfolio narrative, slide outline, short summary |
| `app/` | Working prototype and unit tests |
| `assets/wireframes/` | Annotated grayscale SVG wireframes |
| `assets/screenshots/` | Browser captures of the prototype |
| `VALIDATION.md` | PRD coverage and what is still open |

There is no Figma file. Figma was not available. The SVG wireframes and the browser prototype are the visual deliverables.

## Product decisions that shape the UI

- Safe to spend is the lowest estimated balance in the next 30 days, minus a set-aside the person chooses. It is not “what is left this calendar month.”
- On any day, bills are counted before income. A paycheck later the same day does not hide the dip.
- Income that arrives after the low point stays on the timeline and is excluded from safe to spend.
- The result is a single labeled estimate. The product does not invent a probability range.
- A what-if purchase is visually separate and is not saved until the person adds it.
- Low-balance alerts always have an in-app state. This prototype cannot send notifications after the page is closed.

The worked example used in tests and in the sample plan (balance $1,840, set-aside $100, rent before payday) produces a lowest estimate of $190 and safe to spend of $90 when the dates line up with that fixture. That is an illustrative calculation, not a research result. See `app/test/forecast.test.ts`.

## Evidence status

| Topic | Status |
| --- | --- |
| Competitor behavior cited in `competitive-analysis.md` | Checked against the listed sources on 2026-10-22 |
| Interviews, personas, journey pains | Hypothesis only |
| Usability comprehension and task rates in the PRD | Targets to validate, not results |
| Forecast math | Unit tested |
| Primary browser journey | Exercised with headless Chrome on 2026-10-22 |
| Production security, bank linking, retention law | Not done. Blockers, not implied approvals |

## Remaining validation

1. Interview 5–8 people using `02-ux-research/interview-guide.md` before treating the problem as confirmed.
2. Run the usability sessions in `08-usability-testing/` with the prototype. Do not fill the findings template with expected results.
3. Decide currency, retention, and whether a reserve should stay fully user-set before any production build. Replace `localStorage` before real financial data is collected.
