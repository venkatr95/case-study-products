# Rewear — digital wardrobe case study

**Product:** Rewear, a mobile-first wardrobe and outfit planner.  
**Folder:** `02-DigitalWarderobe` (assignment spelling). The product name is Rewear.  
**UVP:** Create more outfits from clothes you already own.  
**Status:** Portfolio concept. Documentation, grayscale wireframes, and a local TypeScript prototype are implemented. Interviews and usability tests are planned and have not been run. No Figma file exists.

This is not a commercial app. The prototype stores data in this browser only. It does not create an account, read location, or scan pictures. Sample clothes are small catalog photos. Upload on an item, or on New outfit, replaces one of those photos. The file stays in this browser.

## How to review it

1. Read [09-case-study/case-study.md](09-case-study/case-study.md) for the decisions.
2. Open [assets/wireframes/wireframes.html](assets/wireframes/wireframes.html) for the annotated low-fidelity frames (390 × 844, grayscale).
3. Run the prototype and walk the path below.
4. Read [VALIDATION.md](VALIDATION.md) for the 22 October 2026 test run, the Edge click-through, and what is still open. Screenshots from that pass are in `assets/screenshots/`. A print of the wireframe page is `assets/wireframes/wireframes.pdf`.

## Run the prototype

From this folder:

```powershell
Set-Location prototype
npm install
npm run dev
```

Open `http://127.0.0.1:5174`. The dev server uses port 5174 and will not fall over to another port.

```powershell
npm test
npm run build
npm run preview
```

`npm test` runs the domain and journey tests. `npm run build` typechecks, then writes `prototype/dist`. `npm run preview` serves that build on port 4174.

Demo path, about three minutes:

1. **Look through a sample wardrobe.** The twelve items are labeled examples, not a real closet.
2. Search `navy`. Two items match. Clear the search.
3. Open **Outfits**, then **Show suggestions**. Occasion defaults to Work and weather to Cold. Read **Why this was suggested**.
4. **Save outfit** on two suggestions.
5. Open **Trips**, **New trip**, name it, set nights, select both outfits, and **Build packing list**. Shared items are one line, with “In 2 outfits” when a piece is in both.

Add an item with no photo from **Add item** to see the manual path. **Reviewer tools** on that form previews a failed upload without a real file. Collapse that disclosure during a usability session.

## Evidence status

| Claim | Status |
| --- | --- |
| Competitor pages cited in `01-product-analysis/competitive-analysis.md` | Checked 22 October 2026. Prices and features are only those on the cited pages. |
| Personas, journey, and problem framing | **Hypothesis.** No interviews have been run. |
| Success rates in the PRD (70%, 80%, under 3 minutes) | Candidate test targets. Not measured. |
| Usability findings | Empty template only. Example rows are marked as examples. |
| Accessibility | Implemented toward WCAG 2.2 AA. Contrast pairs were calculated. Not a screen-reader audit. |

## Folder guide

| Path | What it is |
| --- | --- |
| `01-product-analysis/` | Brief, problem, competitors, positioning, risks, metrics |
| `02-ux-research/` | Plan, screener, guide, hypotheses, proto-personas, jobs, journey |
| `03-information-architecture/` | Sitemap, flows, task analysis, MoSCoW and traceability |
| `04-wireframes/` | Inventory, specifications, annotations, edge cases |
| `05-ui-design-system/` | Principles, visual direction, tokens, components, accessibility |
| `06-high-fidelity-ui/` | Screen specs, microcopy, interactions. The hi-fi UI is the prototype. |
| `07-prototype/` | Demo script, state matrix, designer-engineer review |
| `08-usability-testing/` | Plan and tasks. Findings are blank on purpose. |
| `09-case-study/` | Narrative, eight-slide outline, portfolio card |
| `assets/diagrams/` | Static SVG flows. Editable sources are the Mermaid blocks in the IA docs. |
| `assets/wireframes/` | Visual wireframe page |
| `assets/screenshots/` | Browser captures from the validation pass, when present |
| `prototype/` | Vite + TypeScript app and Vitest tests. Separate from the docs. |
| `VALIDATION.md` | PRD coverage, commands run, and incomplete items |

Source PRD: `../02-rewear-digital-wardrobe.md`. Execution spec: `../master_prompt_implement_product_case_studies.md`.

## Product decisions that affect the build

- Packing is in the prototype. The PRD scope list marks it Must, and the requirements table marks FR-06 Should. The conflict is documented, and the list is implemented because the core flow and release checklist require it.
- Suggestions, recently worn, and cost per wear are included so the UVP can be evaluated. If suggestions fail, the manual outfit builder still works.
- A single dress can be saved as an outfit. Two other items are required otherwise. This is an explicit reading of “at least two compatible items.”
- Occasions and weather are choices. There is no weather API and no GPS.
- Photos are attachments. They are not scanned. Manual entry is on the same form.
- Currency changes the symbol only. Amounts are not converted.
- There is no laundry state. Archived items stay on an existing packing list and are not labeled “archived” there.

## Remaining validation

Run the interview guide, then the five usability tasks in `08-usability-testing/`. Do not treat this prototype’s sample wardrobe as evidence that people will catalogue their clothes. See `VALIDATION.md` for the engineering checks already done.
