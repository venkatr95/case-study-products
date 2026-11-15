# Task analysis

**Highest-value task:** Read a comparison for a chosen role and save a small plan.
**Date:** 22 October 2026

This is the task the UVP names. Other tasks (paste, edit profile, delete) support it.

## Goal

Leave with a correct-enough account of which confirmed skills fit the profile, and with at most three actions the person is willing to keep.

## Preconditions

- The person has chosen a role, or written one and added at least one requirement.
- They have entered at least one skill, or they are looking at the empty state on purpose.
- They have seen the limitation. It stays on screen during the task.

## Steps in the prototype

| Step | Action | System response | Failure the design watches for |
| --- | --- | --- | --- |
| 1 | Open Comparison. | A sentence: "You listed N skills…" Then the core line. Then definitions. | They look for a percentage and stop. |
| 2 | Filter or open one row. | Filters are buttons with `aria-pressed`. A row opens S-10. | They think "not in your list" means they failed a test. |
| 3 | Read why the skill is in the profile. | The why is the profile text, plus their own proficiency if they have one. | They cannot tell profile text from their own note. |
| 4 | Open the plan. | Up to three suggestions, ordered missing core, partial core, missing supporting, partial supporting. | They think the list is every gap. |
| 5 | Save the three, or edit first. | Each action has an outcome and a first step. | The outcome is too vague to do. |
| 6 | Mark one done, then undo. | Status buttons and a toast. Progress counts only done items. | Undo is unclear, or Done feels permanent. |

## Objects the person must understand

| Object | Definition in the product |
| --- | --- |
| Skill | A named activity with a one-sentence definition. Not a trait and not a job title. |
| Proficiency | Exploring, Practicing, Comfortable, Strong. Self-assessed. |
| Confidence | Low, Medium, High. Separate from proficiency. |
| Matched | Comfortable or Strong, and Medium or High confidence. |
| Partial | Any listed skill that is not matched. |
| Not in your list | The profile includes it and the person has not added it. |
| Extra | A skill they listed that this profile does not include. It still counts. |
| Action | An outcome, a first step, a status, and sometimes one example link. |

## Illustrative result used to check the engine

Maya Chen, fictional, against Product operations associate:

- 7 skills listed.
- 1 match: customer conversations (supporting, strong, high confidence).
- Partial core: spreadsheets (practicing, medium), written updates (practicing, low).
- 6 profile skills not in her list, 4 of them core.
- 4 extras: scheduling, coaching teammates, handling complaints, inventory tracking.
- First three actions: stakeholder updates, requirements briefs, process mapping.

Customer success for the same inventory matches customer conversations and handling complaints as core. Its first three actions are onboarding customers, renewal signals, and written updates.

These rows are fixtures in `app/src/lib/engine.test.ts`. They are not user research.

## Cognitive load choices

- One role at a time. No multi-role dashboard.
- Counts are sentences, not a chart that needs a legend.
- The first plan is shorter than the gap list. The gap list remains available on the comparison.
- Missing skills use slate, not red. Red is reserved for destructive confirmation.

## Completion criteria

The task is done when a roadmap for the current goal contains at least one action, and the person can restate the limitation without using the word "score" as a number they earned.
