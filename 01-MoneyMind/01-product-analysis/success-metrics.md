# Success metrics

The numbers below are the PRD’s hypotheses. They are not baseline measurements and not prototype results.

## North-star outcome

A person can look at the next 30 days, say whether spending today would push the lowest point under the cushion they chose, and explain that the answer is an estimate.

**North-star metric (hypothesis):** At least 70% of prototype participants correctly interpret the forecast and the safe-to-spend explanation.

“Correct” has to be defined before the test, not after. The proposed definition is in `08-usability-testing/test-scenarios.md`: the participant can state the safe-to-spend amount’s meaning, point to the low-point date, and say the result is not guaranteed.

## Metric tree

```text
North star: correct interpretation of the estimate
├── Activation: first session becomes a real plan
│   └── 60% of new test users add at least three upcoming or recurring items
├── Task: the afford decision
│   └── 80% complete “Can I afford this?” without moderator help
├── Trust guardrail
│   └── Fewer than 10% believe a forecast is a guaranteed outcome
└── Safety guardrail
    └── No screen presents a forecast as financial advice or as a guaranteed balance
```

Supporting signals to collect in a test, not as success claims:

- Whether the participant can name one item that creates the low point.
- Whether they can tell a scenario from the saved plan.
- Whether a validation message tells them how to fix an amount.
- Whether they notice a stale balance date.
- Confidence rating after the task, separate from correctness. High confidence plus a wrong reading is a failure.

## Guardrails already enforced in the prototype

These are design constraints, not measured outcomes.

- Decision screens include “Estimate only. Not a guarantee, a bank balance, or financial advice.”
- Safe to spend can be shown as $0 with the shortfall stated beside it. The negative math is not silently replaced.
- Sample data is labeled “not your finances.”
- What-if copy says “Not saved.”
- The privacy screen says storage is local and not encrypted.
- The alert screen says device notifications stop when the page is closed.

## What this prototype can measure today

- Forecast correctness against fixtures, via `npm test`.
- Whether the primary path can be completed in a browser, via `app/test/smoke.html`.

## What it cannot measure yet

- Comprehension rate.
- Activation rate.
- Task success without a moderator.
- Whether anyone returns before a real bill.
- Any business metric. None is defined.

## How a later test should be instrumented

For a moderated test, a researcher records completion, errors, time, and a short confidence score per task. For an unmoderated build, log only product events that match the job: balance saved, item saved, explanation opened, scenario discarded, scenario added, alert saved, export, delete. Do not add advertising or unrelated profile fields. Event names should wait until the research plan is approved, because the prototype currently stores no analytics.
