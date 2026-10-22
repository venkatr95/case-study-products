# Product brief

## Vision

MoneyMind helps a person see a near-term cash shortfall before they spend into it. The product is a 30-day estimate built only from what they type: a starting balance, income, bills, and planned expenses. The signature output is safe to spend, with every input visible.

## One-line UVP

Know when you may run short of money before it happens.

## Target segment

**Primary hypothesis:** Adults who manage their own month-to-month cash and want to avoid a surprise before a bill or between paydays.

**Secondary hypothesis:** People with irregular income or several recurring bills, who can still use the MVP if they enter the dates and amounts they expect.

**Out of scope:** Professional traders, financial advisers, and business accounting teams. Also out of scope for the MVP: households that need a shared ledger, and anyone whose main job is investing, lending, or credit scoring.

No segment has been confirmed with interviews. See `assumptions-and-risks.md`.

## Context

A checking balance says what is in the account now. It does not say what is already promised to rent, a phone bill, or a planned grocery trip, and it does not say whether the next paycheck arrives before those items. Calendar-month budgets answer a different question: “What did I assign this month?” MoneyMind answers: “If I spend this today, what is the lowest point in the next 30 days?”

## Problem hypothesis

People with variable bills or pay timing make spending decisions from a balance that is already partly spoken for. The hypothesis is that an explainable 30-day estimate, plus a way to try one purchase without saving it, will make that decision clearer. This is not yet observed behavior.

## User need and business value

The user job in the PRD: when deciding whether they can afford a purchase, they want to understand upcoming commitments and the likely balance.

Business value is unresolved. This concept does not sell financial products, take a fee, or monetize data. A plausible reason to continue, still a hypothesis, is that the decision is repeated every week, so a trustworthy estimate could earn a habit without a bank connection. No pricing, retention, or acquisition model is proposed as a fact.

## Differentiation

MoneyMind is the explanation of a trough, not a retrospective chart and not a zero-based envelope.

- The number is defined as distance between the lowest estimated point and a set-aside the person chooses.
- Planned one-time expenses sit on the same timeline as bills.
- The prototype works with no bank connection, so the value can be tested before any credential or aggregator decision.
- Estimates are labeled on the decision screen. The product refuses certainty language.

Competitive notes and sources are in `competitive-analysis.md`.

## MVP

Must, from the PRD, and present in the prototype:

- Onboarding that states data sources and limits.
- Manual balance, income, bills, and planned expenses.
- 30-day timeline and a labeled estimate.
- Safe-to-spend math with assumptions.
- Add, edit, and delete, with the estimate updating.
- Low-balance threshold with an in-app alert and an honest notification state.
- Empty, error, and stale states.

Should, also in the prototype:

- What-if purchase, visually distinct, discardable, and only saved on an explicit action.
- Categories and a simple 30-day total. It is not a grade.
- Export of entered data as a local JSON file.

## Non-goals

- Payments, transfers, lending, credit scores, investing, or product recommendations.
- Claiming a future balance is certain.
- Storing bank credentials.
- Read-only bank linking, shared household budgets, and savings-goal planning. Those are later ideas and are not designed as MVP screens.

## Primary use case

“Can I afford this?” The person sees safe to spend, opens the calculation, tries the purchase as a scenario, and either discards it or adds it to the plan.

## Secondary use cases

- Build the first plan: balance, next payday, bills before that payday.
- Inspect the low point and the items that create it.
- Change or remove an item and see the estimate move.
- Set a personal low-balance amount and understand whether the device will notify them.
- Export or delete everything stored on the device.

## Dependencies and constraints

- The prototype is a static web app. Calculations run in the browser.
- Storage is `localStorage`. That is not acceptable for production financial data.
- One currency symbol per plan. No foreign exchange. The open country question is unresolved; the demo uses USD.
- Notification permission cannot create background alerts in this prototype.
- Accessibility target for the web prototype is WCAG 2.2 AA for the flows that were built. Details are in `05-ui-design-system/accessibility.md`.
- Forecast code is deterministic and covered by unit tests.

## Design strategy

Prioritize comprehension of the low point and the safe-to-spend math. Make manual entry fast enough to reach three items, and keep sample data available so a reviewer can see the story without typing. Do not build bank sync, advice, goals, or household sharing until the core explanation survives a usability test.

## Open product decisions

- Which segment feels cash-flow uncertainty most often.
- Whether the set-aside should stay fully user-chosen. The prototype does not recommend an amount.
- Countries, currencies, and retention. The in-product privacy screen describes only this prototype.
