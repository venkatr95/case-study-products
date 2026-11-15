# SkillBridge — Career Navigator

SkillBridge helps a person compare skills they choose to enter with a role profile, then turn the gaps into a few small actions.

**UVP:** Turn the skills you already have into a clear path to your next role.

This folder is the CareerNavigator case study. The product name in the interface is SkillBridge, which is the name in the source PRD. The work is a portfolio concept. It is not a validated product, and it does not predict hiring, pay, or interviews.

## Status

| Area | State |
| --- | --- |
| Product analysis, flows, and screen specs | Written for this concept |
| Competitor review | Based on public pages opened 22 October 2026. See citations in `01-product-analysis/competitive-analysis.md`. |
| Interviews and usability tests | Planned. No participants have been recruited. No results are invented. |
| Role profiles | Five illustrative profiles dated 22 October 2026. Not O*NET records and not employer postings. |
| Wireframes | 15 annotated grayscale SVGs in `assets/wireframes/`. |
| Prototype | Working TypeScript app in `app/`. Comparison, roadmap, and resume-review rules are unit tested. Production build succeeds. |
| Browser check | 22 October 2026, system Chrome. Screenshots in `assets/screenshots/`. Notes in `07-prototype/prototype-review.md`. |
| Figma | Not created. This environment has no Figma file. |

## How to review

1. Read `09-case-study/case-study.md` for the decisions.
2. Read `01-product-analysis/product-brief.md` for scope.
3. Open the wireframes in `assets/wireframes/`.
4. Run the prototype and walk the sample path below.
5. Use `08-usability-testing/` when real sessions happen. Do not fill it with imagined results.

## Run the prototype

From `app/`:

```powershell
npm install
npm test
npm run dev
```

Open `http://127.0.0.1:5174/`. Choose **Explore with Maya's sample**. Maya Chen is fictional. The app compares her skills with Product operations associate, then a three-action plan can be saved, edited, and marked done.

`npm run build` typechecks and writes a static build to `app/dist/`. `npm run preview` serves that build on port 4174. If 4174 is already in use, run `npm run preview -- --port 4184`.

Saved data uses `localStorage` key `skillbridge.career-navigator.v1` in this browser only. Pasted resume text is not stored. Delete it from Settings.

## Primary flow

1. Read the limit: this is guidance, not a hiring prediction.
2. Choose a role, or describe one.
3. Add skills, or review resume suggestions and confirm them.
4. Read the comparison in words. There is no match score.
5. Save up to three actions, edit them, and mark progress.

## Folder guide

| Path | Contents |
| --- | --- |
| `01-product-analysis/` | Brief, problem, competitors, positioning, risks, metrics |
| `02-ux-research/` | Plan, screener, interview guide, hypotheses, empty findings |
| `03-information-architecture/` | Sitemap, flows, task analysis, prioritization, requirement trace |
| `04-wireframes/` | Inventory, specifications, annotations, edge cases |
| `05-ui-design-system/` | Principles, visual direction, tokens, components, accessibility |
| `06-high-fidelity-ui/` | Screen specs, microcopy, interactions |
| `07-prototype/` | Flow, states, what was tested |
| `08-usability-testing/` | Plan, tasks, blank findings, iteration log |
| `09-case-study/` | Narrative, slide outline, portfolio card |
| `app/` | TypeScript prototype |
| `assets/wireframes/` | SVG wireframes and the generator |
| `assets/diagrams/` | Primary-flow diagram |
| `assets/screenshots/` | PNG captures of the running UI, 22 October 2026 |
| `IMPLEMENTATION-REPORT.md` | What was built, how it was checked, what is still open |

## Requirement coverage

| ID | Where it is exercised |
| --- | --- |
| FR-01 Select a goal | Goals, role profile, custom role. Source and date are on the profile. |
| FR-02 Add and edit skills | Skills list and skill form. Proficiency and confidence are self-assessed. |
| FR-03 Compare | Comparison and gap detail. Matched, partial, and not in your list are defined in words. |
| FR-04 Roadmap | Three initial actions, each with an outcome and an editable first step. |
| FR-05 Track progress | Status buttons, undo, and the progress page. |
| FR-06 Resume paste | Paste, review, explicit check, then save. The paste is discarded. |
| FR-07 Resources | Example links name a provider and a topic and open separately. Some actions have none. |

## Decisions already made for the prototype

- The first role family is customer, operations, and coordination work, plus one labeled larger jump into junior data analysis. This is a hypothesis.
- Matching uses the person's proficiency and confidence. Comfortable or strong, with medium or high confidence, is matched. Anything weaker or less sure is partial. Absence is "not in your list."
- The interface does not show a percentage, a grade, or a hiring chance.
- An empty skill list does not render a wall of gaps.
- Resume extraction is a phrase list, not a model. Suggestions default to practicing and low confidence.
- The first roadmap contains at most three actions.

## Still incomplete

- No interviews, contextual inquiries, or usability sessions have been run.
- Role profiles have not been reviewed by practitioners. The open question of who maintains them is unanswered.
- Learning links are examples. There is no maintained catalog, license review, or freshness process.
- The prototype covers five roles plus a role the person writes. It does not cover the labor market.
- There is no account, sync, or server. Offline use is limited to data already in the browser.
- Regional pay, job listings, mentorship, and portfolio projects are out of scope, as the PRD says.
- Screenshots from 22 October 2026 are in `assets/screenshots/`. A screen-reader user has not audited the UI. See `07-prototype/prototype-review.md`.
- WCAG 2.2 AA was designed for and checked on token contrast. It was not audited by a screen-reader user.

## Source

The PRD is `../04-skillbridge-career-navigator.md`. The execution spec is `../master_prompt_implement_product_case_studies.md`.
