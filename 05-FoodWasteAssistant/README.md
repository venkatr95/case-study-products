# FreshLoop

Know what to cook before your groceries go to waste.

FreshLoop is a mobile-first portfolio prototype. A person logs food they already have, sees which dates they entered are soon, and opens a recipe that shows what the pantry covers. The shopping list subtracts a quantity only when the units compare. The product does not decide whether food is safe.

**Status:** Design and prototype complete for review. No customer interviews or usability tests have been run. Every user problem, persona, and success target in this folder is a hypothesis until that research happens.

**Role in this folder:** End-to-end product design, UX writing, design system, and front-end prototype. Timeline is proposed, not a staffed engagement.

## Review the prototype

From `prototype/`:

```powershell
npm test
npm run dev
```

Open [http://localhost:5185/](http://localhost:5185/).

- `npm test` runs Vitest (logic and a happy-dom click-through).
- `npm run dev` serves the TypeScript app on port 5185.
- `npm run build` then `npm run preview` serves the production build on [http://localhost:4185/](http://localhost:4185/).
- Add `?demo=1` on a browser with no saved FreshLoop data to open the labeled sample kitchen. If the address has no screen, or is Welcome, it opens Pantry. A named screen stays open, for example `http://localhost:5185/?demo=1#/use-soon`.

Do not enter private or sensitive pantry notes. Entries stay in this browser’s `localStorage` under `freshloop.v1` and are not encrypted.

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
| `prototype/` | Working TypeScript prototype and tests |
| `assets/wireframes/` | Annotated grayscale SVG wireframes |
| `assets/screenshots/` | Browser captures of the prototype |
| `assets/diagrams/` | Core-flow diagram |
| `VALIDATION.md` | PRD coverage and what is still open |

Requirements traceability is a section of `03-information-architecture/feature-prioritization.md` rather than its own file, so each requirement sits next to its priority.

There is no Figma file. Figma was not available. The SVG wireframes and the browser prototype are the visual deliverables.

## Product decisions that shape the UI

- The home screen leads with Use soon, counted from best-before and use-by dates the person entered.
- Opened-on is never an expiry. There is no shelf-life table and no keep-or-discard verdict.
- Have, Short, Check, Missing, Staple, and Optional are written on the recipe.
- Shopping subtracts a pantry amount only when the units compare. A blank quantity or a mismatched unit stays on the list.
- A multi-recipe plan subtracts the pantry once.
- Salt, pepper, and water can be left off. The switch is visible. Olive oil is not assumed.
- Diet filters hide recipes by listed ingredient flags, including optional ones, and say they are not an allergen or medical judgment.
- Reminders are opt-in and in-app only while the page is open.
- One kitchen on this device. Sample food and sample recipes are fictional and labeled.

## Evidence status

| Topic | Status |
| --- | --- |
| Competitor behavior cited in `competitive-analysis.md` | Checked against the listed sources on 22 October 2026 |
| Interviews, personas, journey pains | Hypothesis only |
| Usability comprehension and task rates in the PRD | Targets to validate, not results |
| Match, date, and shopping rules | Unit tested and covered by a scripted click-through |
| Primary browser journey | Scripted in happy-dom. Screenshots are static loads of the built pages. See `VALIDATION.md`. |
| Screen reader, 320px zoom, real push, encrypted storage | Not done |

## Remaining validation

1. Interview 5–8 people using `02-ux-research/interview-guide.md` before treating the problem as confirmed.
2. Run the usability sessions in `08-usability-testing/` with the prototype. Do not fill the findings template with expected results.
3. Decide regional date labels, a licensed recipe source, and whether a shared kitchen is the real job before any production build. Replace `localStorage` before real household data is collected.
