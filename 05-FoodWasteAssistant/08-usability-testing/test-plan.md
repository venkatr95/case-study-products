# Usability test plan

**Status:** Planned. Do not fill `findings-template.md` with expected results.

## Goals

Learn whether a person can keep the honesty rules straight while doing the core task.

1. Can they add an item and open a recipe that uses food they marked as needing attention?
2. Can they build a shopping list that leaves out only what the pantry covers, and can they explain a Check line?
3. Do they describe dates as reminders, or do they think the app judged the food?
4. After marking a meal cooked, can they see what changed and undo it?

These map to the PRD targets of 75% and 70%, plus the safety guardrail. The percentages are success criteria for this test, not forecasts.

## Participants

5 people, after the interviews in `02-ux-research/` if those interviews still support the problem. At least 3 match the primary screener (cook and shop for a household). Up to 2 match the secondary screener.

The PRD asks for 5 representative users. Five can find repeated blockers. Five cannot estimate a population rate with a tight interval. Report counts (3 of 5), not a false-precision percentage, and compare that count with the 75% and 70% targets honestly.

Exclude people who have already seen this prototype.

## Logistics

- 45 minutes remote or in a kitchen if the participant prefers. Their own phone if possible, otherwise a provided phone at 390px wide and one laptop pass.
- Prototype URL with a fresh browser profile. Moderator loads the sample kitchen only for tasks that say so. Tasks that say “your items” start from an empty kitchen.
- Recording only with consent. No fridge photos required.
- Pay for the session.

## Consent and privacy

- Portfolio concept, not a commercial pilot.
- They may stop.
- Do not collect full name in the notes.
- The prototype stores data in the browser. Ask them not to enter anything they consider private. Offer to clear site data at the end.
- Quotes need separate permission before they appear in a portfolio.

## Moderator stance

Read `test-scenarios.md`. Do not say “use soon,” “check,” or “staples” before the participant does. Do not explain a miss until the task has ended. After each task, ask what the screen claimed about the food.

## Measures

| Measure | How |
| --- | --- |
| Completion | Met the success definition without a hint |
| Assisted completion | Met it after one hint |
| Errors | Wrong save, missed Check, treated Opened as expired, could not undo |
| Time | Note start and end. Do not set a time limit. A very long add is a finding about A1 |
| Confidence | Ask “How sure are you that the list left the right things off?” 1 to 5, after the shop task |
| Comprehension | Their words for what a date means and what Check means |

## Severity

| Level | Meaning | Retest |
| --- | --- | --- |
| 1 Blocker | Cannot finish, or believes the app certified the food as safe or unsafe | Fix and rerun the task with new participants |
| 2 Major | Finishes with a wrong list or a wrong pantry and does not notice | Fix and rerun that task |
| 3 Minor | Hesitation, then the right outcome | Optional rerun |
| 4 Idea | Comment, no task failure | Park |

## Stop rules

- If two people in a row believe the app told them the food was safe, stop and rewrite the date copy before more sessions.
- If nobody can add an item without help, stop. Do not continue into recipes.

## Mapping findings to changes

Each row in the findings template needs a proposed change and a retest criterion. A change that is not retested stays in the iteration log as untested.
