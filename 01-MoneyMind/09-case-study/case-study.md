# MoneyMind — case study

**Know when you may run short of money before it happens.**

| | |
| --- | --- |
| Product | MoneyMind, a mobile-first cash-timing concept |
| Role | Product design, UX writing, and prototype implementation for a portfolio case |
| Timeline | Proposed solo case. Built as a complete concept, not a staffed release |
| Status | Prototype and specification ready for review. Validation planned. No user sessions have been run |

## Executive summary

Bank balances show what is present, not what is already promised to a bill that posts before the next paycheck. MoneyMind turns a typed balance, income, and bills into a 30-day estimate and a safe-to-spend figure defined as the lowest point in that window minus a cushion the person chooses.

The case argues for showing that dip, and the items that cause it, instead of another retrospective chart or a single “you’re fine” number. The argument is implemented: a working browser prototype, tested forecast math, annotated wireframes, and a usability plan. It is not implemented as evidence. Interviews and usability tests are specified and unrun. Competitor notes are sourced. Personas are hypotheses.

## Problem and why it matters

People make ordinary spending decisions from a number that has not subtracted next week’s rent. If that hypothesis is true, the expensive moment is before the purchase, not in a month-end report. A tool that sounds certain and is wrong is worse than no tool, because it can cause the spending it was meant to prevent.

MoneyMind is scoped to that moment. It does not pay bills, score credit, or recommend products. Those non-goals are in the PRD and in the interface: the first screen says nothing connects to a bank, and every decision screen says the result is an estimate, not a guarantee or financial advice.

The problem statement is still a hypothesis. The research plan asks for recent episodes rather than opinions about this solution. If those interviews show a different job, this structure should be revised instead of defended.

## Target users and evidence status

**Primary hypothesis:** adults who manage their own cash and want to avoid a surprise between pay and bills.

**Secondary hypothesis:** irregular income, as long as the person can enter a dated expectation. The prototype will not invent a range for them.

**Not the audience:** traders, advisers, and business accounting teams.

No one has been interviewed. The two proto-personas in `02-ux-research/personas.md` are labeled as sketches. The sample plan — rent before payday, a $100 set-aside, safe to spend of $90 in the fixed test fixture — is an illustration of the first sketch, checked by unit tests, not a customer story.

## Research approach and findings status

Discovery is planned as 5–8 interviews about the last time someone was unsure they could afford a purchase, plus a separate 5-person usability test on this prototype. Findings file: empty on purpose. There are no quotes to put in this case study.

What did inform the design, with sources, is the competitive review: PocketGuard already sells a leftover or safe-to-spend idea tied to linked accounts; Quicken Simplifi projects cash but its help center says planned spend is not in projected cash flow and the spending plan does not include the current balance; Copilot’s cash-flow help says the tab looks backward and excludes unpaid recurrings, and its recurring FAQ says recurring income is not supported. MoneyMind does not claim those products lack forecasting. It takes the narrower job they do not center: an explainable 30-day trough from numbers the person typed.

## Competitive landscape and opportunity

The crowded promise is “one number for what you can spend,” usually after a bank link and a monthly budget. The open question is whether a person can see *when* they would run short, and *which entered item* causes it, without handing over credentials.

YNAB is the methodological opposite in one useful way: it will not let you assign pay you do not have yet. MoneyMind also refuses to treat income after the low point as spendable, and it shows that income on the timeline so the refusal is visible. That parallel is a design choice, not a claim of equivalence.

Spreadsheets remain the honest substitute. If a later test shows a spreadsheet is clearer than the explanation screen, the explanation has failed.

## Product strategy and prioritization

Must-have scope from the PRD is in the prototype: onboarding, manual entry, the 30-day estimate, the formula, edit and delete, a low-balance alert with an honest permission state, and empty, error, and stale states.

Should-have scope is in the prototype as well, because the story cannot be judged without it: what-if, a category summary that does not affect the math, and a local export.

Bank linking, shared budgets, and savings goals stayed out. A fake bank button would have implied a capability the PRD forbids until a provider and a legal review exist. A recommended cushion stayed out because it would be advice. A decorative probability band stayed out because it would look more certain than a single labeled estimate.

## Information architecture and key flow

Four persistent places: Home, Timeline, What-if, and Plan. The explanation, the alert, and settings are reached from the decision rather than added to an already crowded phone bar.

The primary flow is the PRD’s flow:

1. Read how an estimate works.
2. Enter a balance or open labeled sample data.
3. Read safe to spend and the low-point date.
4. Open the calculation and see what is excluded because it happens later.
5. Try one purchase without saving it.
6. Discard it, or add it and see the saved estimate move.

## Early wireframes and rationale

Grayscale annotated frames at 390 × 844 cover onboarding, balance, home, timeline, explanation, add item, detail, what-if, alerts, settings, empty, and unreadable data. They are SVGs in `assets/wireframes/`, not a Figma file. Figma was not available.

The wireframes already contain the product choices, not blank boxes: the formula on the first screen, the lowest-estimate marker, the dashed scenario column, and the “download the raw text before erase” error. Hierarchy was settled before color so the number, the date, and the disclaimer would survive a plain layout.

## Visual direction and design system

The direction is a clear ledger: warm paper, ink, a teal action color that is not “profit green,” and a rust used only with words when the estimate is short of the set-aside. The safe-to-spend figure is a serif. Body text is Atkinson Hyperlegible when it loads, and Segoe UI when it does not. Contrast for the text pairs was calculated above 4.5:1.

The system is small because the product is small: banner, formula row, ledger day, table, dialog, toast, field. Category icons and a second theme were not added. A dark theme that had not been checked would have been a contrast risk, so only the light theme is specified.

## Final screen walkthrough

**Onboarding** states the data source, the same-day rule, the definition of safe to spend, and that this prototype stores entries without encryption.

**Balance** takes one pool of cash, the date it was true, a currency symbol, and an optional set-aside. Future dates are rejected. Zero set-aside is valid.

**Home** leads with the figure and a sentence that includes the cushion and the date. A shortfall displays as $0 and states the gap, so the negative result is not hidden. Sample data wears a banner.

**Timeline** is a ledger first and a chart second. The chart has a name for assistive technology. A table lists all 30 days. Quiet days collapse, and if the low point has no items that day, the group still says so.

**Explanation** shows starting balance, counted income, counted expenses, the low point, the set-aside, and safe to spend. Paychecks after the dip are listed under “After the low point.”

**What-if** puts Saved estimate beside Scenario · not saved. Add to plan is a separate button.

**Alerts** say what the in-app status is doing and say that a closed page will not send a device notification.

## Key interaction

The interaction that carries the UVP is the unsaved scenario. Typing $150 does not change Home. The comparison updates in place. Discard leaves the plan. Add to plan writes one item and confirms by opening it. That split is the difference between “playing with a number” and “changing my bills.”

A second interaction matters for trust: delete confirms, focuses Cancel, and offers one undo. Delete-all does not offer undo, and says so.

## Accessibility, edge cases, and trust

The prototype is built toward WCAG 2.2 AA: labeled controls, visible focus, dialog behavior, a text marker for the low point, a data table beside the chart, and contrast-checked tokens. It has not had a screen-reader user test. The accessibility note says “designed toward,” not “certified.”

Edge cases that protect trust are specified and mostly implemented: stale balances older than seven days, unreadable storage that is not silently wiped, same-day bills before same-day income, monthly day 31 clamped to the end of a short month instead of overflowing, and items before the balance date not applied twice.

The privacy screen names the storage key and the lack of encryption. That is a prototype limit, not a security design. Production would need a different store before real financial data.

## Usability validation status

**Validation planned.** The test has six tasks: interpret the number, find the cause, try a $150 dinner without saving it, add a bill, remove it, and say what the alert will do tonight if the page is closed. Success, confidence, and a guarantee probe are defined in advance so the 70% and 10% PRD targets cannot be reinterpreted after the fact.

No participant has completed them. The iteration log records pre-test design choices only. An example findings row is marked as an example and is not data.

What was verified on 2026-10-22 is narrower: 18 unit tests for the engine, and a headless Chrome script that completed onboarding, sample home, explanation, timeline, what-if, invalid and valid item save, reminders, export, and a stale balance.

## Success metrics and how they would be measured

| Hypothesis from the PRD | How it would be measured | Current value |
| --- | --- | --- |
| 70% interpret the forecast and safe to spend | Usability scenario 1, counted, not estimated from opinions | Not measured |
| 60% add three items in a first session | A later instrumented test with people entering their own plan | Not measured |
| 80% finish “Can I afford this?” without help | Scenario 3 completion | Not measured |
| Fewer than 10% think it is guaranteed | Direct probe. With five people, report the fraction honestly | Not measured |
| Never presented as advice or a guaranteed balance | Copy review of the shipped screens | Enforced in the prototype copy, not proven to be understood |

There is no revenue metric. Charging for this concept was not part of the PRD, and none is invented here.

## Limitations, learnings, and next steps

**Limitations.** One cash pool. One point estimate. No bank feed. No background notifications. No encrypted storage. No evidence that anyone wants to type their bills into it.

**What the work clarified anyway.** The product is the definition of the number. “Safe to spend” only stays different from PocketGuard’s leftover, Copilot’s free-to-spend, and Simplifi’s month plan if it is tied to a dated trough and if later income is visibly excluded. The explanation screen is not documentation. It is the product.

**Next steps.**

1. Run the interview guide with 5–8 people. Stop or reshape the concept if the job is not cash timing.
2. Run the six usability tasks on this prototype, including one keyboard-only session, and log real issues in the findings template.
3. Only after those, decide currency, retention, and whether any production build replaces `localStorage`. Do not start bank linking first.

## Portfolio visuals

Suggested exports and captions are in `portfolio-summary.md`. The slide outline is in `presentation-outline.md`.
