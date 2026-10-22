# Usability test plan

**Status:** Ready to run. Not run. Do not fill `findings-template.md` with expected answers.

## Goals

1. Can a participant explain safe to spend, including that it is not guaranteed?
2. Can they complete “Can I afford this?” on the prototype without help?
3. Where do the estimate label, the low point, the what-if, or item entry fail?

## Questions

- After Home, what do they think the large number is?
- Can they find the date of the lowest point and one item that affects it?
- Do they believe the later paycheck is already included in safe to spend?
- Can they tell the scenario from the saved plan?
- What do they do with an invalid amount?
- What do they think will happen if they close the page after allowing notifications?

## Participants

5 people for a first concept test, recruited with `02-ux-research/screener.md` plus the usability add-on. Five is enough to see repeated blockers on a single path. It is not a sample for the 70% target as a stable rate. Treat that target as something a later, slightly larger round could estimate. If only three can be scheduled, run them and report the count. Do not pad with teammates who built the prototype.

Include at least one keyboard-only session and, if a participant is available, one screen-reader session. Those can be part of the five.

## Setup

- The researcher runs `npm start` and opens the sample plan, or asks the participant to enter a tiny plan if the research question is about entry burden. Say which protocol before the session. Do not mix them in one study without labeling the tasks.
- Phone-sized window first, unless the participant says they would do this on a computer.
- Record the screen with consent. Do not record a personal bank app.

## Consent and privacy

Same rules as the interview plan. Add: “This is a prototype stored in this browser. Please use the sample plan or approximate numbers. Do not type passwords or real account numbers.”

Participants may stop. Incentive is stated in the invite before they arrive. No incentive amount is fixed in this folder.

## Moderator stance

Read the script in `test-scenarios.md`. Do not explain the formula before the tasks. After the tasks, answer questions honestly, including the notification limit and the lack of encryption.

## Measures

| Measure | How |
| --- | --- |
| Completion | Finished the task’s end state without a hint. Partial is noted. |
| Errors | Wrong screen, misread number, saved a scenario by mistake, or needed a correction. |
| Time | Start when they see the task, stop at the end state. Not a success cutoff by itself. |
| Confidence | 1–5 after each task: “How sure are you?” High confidence and a wrong answer is a severe issue. |
| Comprehension | The three checks in scenario 1. |
| Guarantee belief | Scenario 1, last probe. This is the trust guardrail. |

## Severity

| Level | Meaning | Retest |
| --- | --- | --- |
| 1 | Blocks the afford decision or creates false certainty | Must retest on the same task |
| 2 | Completes with a wrong reason, or cannot find the cause | Retest that step |
| 3 | Hesitation, extra taps, recoverable misunderstanding | Retest if the copy or layout changes |
| 4 | Preference or polish | Optional |

## Analysis

One row per issue in the findings template, with the task ID, severity, and a quote if they said it. Then an iteration row: the change, and the retest criterion. No issue is “fixed” in the case study until a retest is actually done.
