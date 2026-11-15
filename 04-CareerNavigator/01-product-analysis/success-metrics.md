# Success metrics

**Status:** Targets from the draft PRD. They are hypotheses. They are not results.
**Date:** 22 October 2026

No participant has used the prototype in a moderated session. Do not read the numbers below as performance.

## North-star outcome

A person can look at one role and leave with a short plan that reflects skills they are willing to claim.

The outcome is understanding plus a saved action. It is not an interview, an offer, or a pay change. Those are non-goals.

## Metric tree

```text
North star: a person leaves a session with a role, a confirmed skill list, and a plan they understand
├── Comprehension: they can name their top gaps in the product's words
├── Activation: they save at least one action
├── Trust: they can say the result is not a hiring prediction
└── Return (after a real launch only): they come back and update a skill or an action
```

## PRD targets, restated as study criteria

| ID | Hypothesis to test | Proposed measure | Not a result |
| --- | --- | --- | --- |
| M1 | 80% of prototype participants can identify their top three skill gaps for a chosen role. | After the comparison, ask them to name three skills the profile emphasizes that they have not marked as already comfortable and sure. Score against the comparison they just saw. | No sessions yet. |
| M2 | 70% create at least one learning action in a prototype session. | Count participants who save an action without moderator help on the click path. Editing the generated text still counts. | No sessions yet. |
| M3 | 80% understand that matches are guidance, not a hiring prediction. | After the task, ask what an employer would learn from this screen. A correct answer says the product does not tell an employer anything, or that it is not a hiring chance. | No sessions yet. |

Sample size for an early concept test is 5 participants, which cannot support an 80% claim. The percentages are release criteria for a later round. The first round looks for repeated confusion, not for a percentage that clears 80.

## Guardrails

| Guardrail | How to notice a breach |
| --- | --- |
| Do not present inferred skill scores as objective. | Any percentage, grade, "hireability," or unlabeled bar is a defect. Unit tests reject score language in the comparison narrative. |
| Do not make the person feel ranked. | Severity rises if participants describe the comparison as a verdict about them. The design challenge in the PRD is this feeling. |
| Do not store resume text. | Paste lives in tab memory. A copied backup from Settings must not contain the paste. |
| Do not collect sensitive attributes for the job. | Name is optional. Phone, address, and date of birth are called out as unnecessary on the paste screen. |
| Do not overwhelm. | If most participants ask for the whole gap list before they will save one action, the three-action cap needs a clearer "you can add more" path, not a longer default. |

## What to instrument later

Only after there is a product with consent and a purpose for the data:

- Goal chosen, including custom versus listed.
- Skills saved, and how many came from confirmed paste versus typed entry.
- Comparison opened with an empty list (should show the empty state).
- Plan saved, actions edited, actions marked done, undos.
- Return visit that changes a skill or an action.
- Deletes.

The prototype does not send analytics. Baselines do not exist. The PRD says to establish baselines before production targets for completion and return use. That instruction still stands.

## How a study would be scored

Definitions for M1–M3 live in `08-usability-testing/test-scenarios.md`. Findings stay in the empty template until a session happens.
