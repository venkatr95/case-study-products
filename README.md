# Case study products

Portfolio case studies published from this repository. Each top-level folder is one product: the design record, the prototype, and the overview shown on [pmbyven collections](https://www.pmbyven.com/collections).

Three studies are here.

| Folder | Product | Collections page | Live demo |
| --- | --- | --- | --- |
| [01-MoneyMind](01-MoneyMind/) | MoneyMind | [collections/moneymind](https://www.pmbyven.com/collections/moneymind) | [pmbyven-moneymind.vercel.app](https://pmbyven-moneymind.vercel.app) |
| [02-DigitalWarderobe](02-DigitalWarderobe/) | Rewear | [collections/rewear](https://www.pmbyven.com/collections/rewear) | [pmbyven-rewear.vercel.app](https://pmbyven-rewear.vercel.app) |
| [03-NavAccessPath](03-NavAccessPath/) | AccessPath | [collections/accesspath](https://www.pmbyven.com/collections/accesspath) | [pmbyven-accesspath.vercel.app](https://pmbyven-accesspath.vercel.app) |

The collections page reads `overview.md` in each folder. **Visit live demo** opens the Vercel app. The GitHub link on that page points at the folder in this repository.

## MoneyMind

Know when you may run short of money before it happens.

A person types a current balance, expected income, and upcoming bills. The prototype builds a 30-day cash estimate and a safe-to-spend figure, then shows the math. It does not connect to a bank, move money, or give financial advice. Entries stay in this browser.

- Record and how to run it: [01-MoneyMind/README.md](01-MoneyMind/README.md)
- Overview: [01-MoneyMind/overview.md](01-MoneyMind/overview.md)
- Prototype: `01-MoneyMind/app` (`npm test`, then `npm start`, opens `http://127.0.0.1:4173/`)
- Vercel project `pmbyven-moneymind`, root directory `01-MoneyMind/app`
- Report: `01-MoneyMind/09-case-study/case-study-report.docx` and `case-study-report.pdf`

## Rewear

Create more outfits from clothes you already own.

The folder name is `02-DigitalWarderobe`. The product name is Rewear. The prototype is a private wardrobe: catalogue, search, outfits, explained suggestions, cost per wear, and packing. The sample wardrobe uses small catalog photos in `prototype/public/sample/`. On **New outfit** (`#/outfits/new`) each piece has an Upload control. A chosen photo stays in this browser and is not scanned.

- Record and how to run it: [02-DigitalWarderobe/README.md](02-DigitalWarderobe/README.md)
- Overview: [02-DigitalWarderobe/overview.md](02-DigitalWarderobe/overview.md)
- Prototype: `02-DigitalWarderobe/prototype` (`npm install`, `npm test`, `npm run dev` on port 5174)
- Vercel project `pmbyven-rewear`, root directory `02-DigitalWarderobe/prototype`
- Report: `02-DigitalWarderobe/case-study-report.docx` and `case-study-report.pdf`

## AccessPath

Find routes that work for your mobility needs, not just the shortest route.

The folder name is `03-NavAccessPath`. The product name is AccessPath. The prototype compares sample walks by stairs, curb ramps, and steepness, and keeps confirmed, community-reported, and unknown as separate facts. It is not a navigation service. Seattle streets in the demo are illustrative.

- Record and how to run it: [03-NavAccessPath/README.md](03-NavAccessPath/README.md)
- Overview: [03-NavAccessPath/overview.md](03-NavAccessPath/overview.md)
- Prototype: `03-NavAccessPath/app` (`npm test`, then `npm start`, opens `http://127.0.0.1:4175`)
- Vercel project `pmbyven-accesspath`, root directory `03-NavAccessPath/app`
- Report: `03-NavAccessPath/09-case-study/case-study-report.docx` and `case-study-report.pdf`

## What each study contains

Each folder uses the same numbered record:

| Path | What it is |
| --- | --- |
| `01-product-analysis/` | Brief, problem, competitors, positioning, risks, metrics |
| `02-ux-research/` | Plan, screener, interview guide, hypotheses, jobs, journey |
| `03-information-architecture/` | Sitemap, flows, task analysis, prioritization |
| `04-wireframes/` | Screen inventory, specifications, annotations, edge cases |
| `05-ui-design-system/` | Principles, visual direction, tokens, components, accessibility |
| `06-high-fidelity-ui/` | Screen specs, microcopy, interaction specs |
| `07-prototype/` | Click path, states, review notes |
| `08-usability-testing/` | Test plan and scenarios. Findings are left blank until a real session. |
| `09-case-study/` | Narrative, portfolio summary, slide outline |
| `overview.md` | Executive summary used on the collections page |
| `VALIDATION.md` | What was checked, and what is still open |
| `assets/` | Diagrams, screenshots, and wireframes |

MoneyMind’s runnable app is `app/`. Rewear’s runnable app is `prototype/`. Rewear also keeps `overview-summary.md` next to `overview.md`.

## Evidence

Interviews and usability tests have not been run. Personas, problem statements, and success targets in these folders are hypotheses. Competitor notes are dated inside each study. Prototype checks are recorded in each `VALIDATION.md`.

The live demos are portfolio prototypes. Each one serves `robots.txt` with `Disallow: /` and a noindex header.
