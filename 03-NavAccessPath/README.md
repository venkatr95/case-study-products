# AccessPath (NavAccessPath)

Portfolio case study for an inclusive city-navigation concept. The unique value proposition is: **Find routes that work for your mobility needs, not just the shortest route.**

This folder is a design and prototype record. It is not a navigation service, a licensed map, or a claim that the concept has been tested with participants.

**Source:** `../03-accesspath-inclusive-navigation.md` (PRD v1.0).
**Executed:** 22 October 2026, against `../master_prompt_implement_product_case_studies.md`.

## What the prototype shows

Someone sets access preferences (step-free, gentle, stroller, or custom). They compare a few sample walks. Each route is one of:

- Matches your preferences on confirmed data
- Some details are unknown
- Conflicts with your preferences
- No access preferences selected

Unknown stays unknown. A community report can raise a concern. It cannot confirm a fact. Conflicting reports stay listed side by side. Nothing in the interface is called fully accessible. A submitted barrier report is pending review.

The default sample is Cal Anderson Park to Pike Place Market with step-free preferences. Pine Street direct is shorter and conflicts. Madison is longer and matches on confirmed data. Pike and Seneca sits between them with unknowns.

**Pilot city is a hypothesis:** Seattle, because published sidewalk-network work exists there (AccessMap, OS-CONNECT). The streets, grades, entrances, and reports in `app/src/sample.ts` are invented and labeled illustrative. They are not a data license and not directions for the street.

## Folder guide

| Path | What it holds |
| --- | --- |
| `01-product-analysis/` | Brief, problem, cited competitive scan, positioning, assumptions, success metrics. Metrics from the PRD are targets, not results. |
| `02-ux-research/` | Plan, screener, interview guide, empty findings template, hypothesis personas, jobs, hypothetical journey. No interviews were run. |
| `03-information-architecture/` | Sitemap, flows, task analysis, MoSCoW and FR-01–FR-07 traceability. |
| `04-wireframes/` | Inventory, specifications, annotations, edge cases. Visual boards are in `assets/wireframes/`. |
| `05-ui-design-system/` | Principles, visual direction, tokens with contrast pairs, components, accessibility notes. |
| `06-high-fidelity-ui/` | Screen specs, microcopy, interaction specs. The high-fidelity UI is the browser prototype. |
| `07-prototype/` | Flow, states, author review. The review is not a usability study. |
| `08-usability-testing/` | Test plan, five scenarios, empty findings template, author iteration log. |
| `09-case-study/` | Narrative, eight-slide outline, portfolio summary and export list. |
| `assets/diagrams/` | Evidence-model diagram. |
| `assets/wireframes/` | Annotated HTML boards and PNG captures (`png/s01`–`s15`). Open `index.html` in a browser. |
| `assets/screenshots/` | Headless Chrome captures of the prototype review states. |
| `app/` | TypeScript prototype. Documentation stays outside this directory. |

## Run the prototype

From this folder:

```text
cd app
npm install
npm test
npm start
```

Open `http://127.0.0.1:4175`. `npm test` compiles TypeScript and runs the node tests. The page loads `app/dist`. If you change `app/src`, run `npm test` or `npm run build` again. `npm start` serves the files with Node’s HTTP server. Default port is 4175 (`PORT` overrides it).

Review links hide the prototype controls. Append one of these to the origin:

`?shot=home`, `preferences`, `trip`, `results`, `map`, `detail`, `place`, `report`, `status`, `saved`, `nomatch`, `outside`, `error`, `offline`, `location`, `loading`.

`shot=status` and `shot=saved` write into that browser’s `localStorage`. Preferences, reports, recent routes, and text scale otherwise persist only in this browser under keys `accesspath.preferences.v1`, `accesspath.reports.v1`, `accesspath.recent.v1`, and `accesspath.text-scale.v1`. Refresh returns to Home and drops the in-memory trip.

## Artifact status

| Deliverable | Status |
| --- | --- |
| Product analysis, IA, design system, screen specs, case study | Written. Hypotheses are labeled. Competitor claims that were checked cite the page and the access date 22 October 2026. |
| Research findings and usability findings | Templates only. Example rows in the findings template are marked as not findings. |
| Personas and journey | Hypothesis tools for interview design. Not evidence. |
| Low-fidelity wireframes | 15 HTML boards and 15 PNGs. |
| High-fidelity screens | Working prototype, plus 16 PNG review captures. |
| Figma | Not created. No Figma file is claimed. |
| Automated tests | Fit rules, sort, headlines, report pending and withdraw, HTML escaping, and a ban on the phrase "fully accessible" in status labels, copy, and rendered results HTML. |

## PRD coverage and remaining gaps

| Requirement | In this folder |
| --- | --- |
| FR-01 Preferences change results, or the screen explains no match | Built and tested on the sample trips. |
| FR-02 Distance, time, barriers, confidence | On every route card. |
| FR-03 Unknown is explicit | Unknown blocks a match. Community "all clear" does not confirm. |
| FR-04 Place and entrance detail | Text segments and entrance pages. |
| FR-05 Report a barrier | Pending review. Withdraw stays local. Not sent to a moderator. |
| FR-06 Saved preferences for a signed-in user | Save, change, and delete work in `localStorage`. There is no account. The signed-in acceptance criterion is unmet. |
| FR-07 Verified service alerts | One sample elevator notice labeled "Sample feed, not live." Not a feed. |
| Map and list, information not by color alone | List is complete. Schematic uses stroke pattern as well as color. |
| Location minimized and disclosed | No Geolocation API call. The location dialog explains the sample start. |
| Non-goals | No guarantee, no emergency replacement, no multi-city launch, no turn-by-turn. |

Also unfinished, and documented in the case study:

- No participant interviews and no usability sessions. The PRD’s 80% targets are not measured.
- No screen reader pass with NVDA, JAWS, or VoiceOver, and no measured 200% zoom session.
- No licensed basemap, live transit, or offline route notes.
- Screenshot PNGs are a fixed phone-width viewport. Long screens can be clipped at the bottom of the PNG even when the page itself scrolls.
- AXS Map, AccessNow, Apple Maps, and Ezymob were not fully verified in the competitive scan. Unverified products are named as such.

## Validation performed on 22 October 2026

- `npm test` in `app/` (TypeScript compile and node:test). Re-run after the last source change before treating the served page as current.
- Headless Chrome captures of the wireframe boards and the `?shot=` states. Those captures confirm render, not a full click-through. No browser automation tool was available for an interactive pass.
- Contrast ratios in `05-ui-design-system/design-tokens.md` were computed with the WCAG relative-luminance formula. The disabled button was changed from a 3.88:1 pair to `#243140` on `#E7E2D8` (10.24:1). That pair was calculated, not certified by an audit tool.
- Author review in `07-prototype/prototype-review.md`. It is not participant evidence.
