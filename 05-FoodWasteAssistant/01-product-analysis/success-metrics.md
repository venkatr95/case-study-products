# Success metrics

Every number below is a **target or a candidate measure**. None has been observed. The PRD’s 75% and 70% are usability targets for a future test, not results.

## North star candidate

Self-reported discarded-food frequency, compared with a baseline and a follow-up in a pilot.

This matches the PRD. It is slow, and it is the outcome that matters. It is a poor metric for a single prototype session, so the session uses the leading targets below.

## Metric tree

```text
Self-reported discards over a pilot (outcome, later)
└── Meals cooked from items the person had marked Use soon (leading, product)
    ├── Can add an item and open a relevant use-first recipe
    ├── Can build a shopping list that excludes only confirmed pantry amounts
    └── Can update the pantry after cooking without abandoning the list
```

## Prototype session targets, from the PRD

| Target | Definition to use in a test | Guard |
| --- | --- | --- |
| 75% add an item and find a relevant use-first recipe | Success: the item is saved with the typed details, and the person opens a recipe that lists that item or an item they marked Use soon. “Relevant” is judged with them, not by us after the fact. | They can explain that the date is not a safety check. |
| 70% create a shopping list that excludes ingredients already marked available | Success: the list omits at least one ingredient the pantry quantity covers, and the person can point at a line that was left off on purpose. | A Check line (unknown or mismatched unit) is still on the list, or they can say why it was not subtracted. |

If either target is missed, change the flow before adding capture methods.

## Leading product metrics for a later build

| Metric | Why it is only a candidate |
| --- | --- |
| Share of sessions that open a recipe from Use soon | Could rise because the button is large, not because the decision improved. |
| Median time to log one item | Useful against A1. A fast log of a wrong item is not success. |
| Share of cooked updates that are undone or edited | High edits may mean the proposal is wrong. Low edits may mean people do not look. |
| Seven-day return with at least one inventory change | A hypothesis for habit. Not a goal to optimize with streaks. |

## Guardrail metrics

| Guardrail | Failure looks like |
| --- | --- |
| No safety verdict in the interface | Copy or a label says food is safe, unsafe, or should be discarded based on a date or image. |
| Reminders can be refused and turned off in one step | Denial blocks the pantry, or off is buried. |
| Diet filters are understood as list filters | A participant thinks a recipe is safe for an allergy because it was shown. |
| Quantity is not invented | A blank or mismatched unit disappears from the shopping list. |
| Data can be exported and deleted | Either control is missing, or delete has no confirmation. |

Reminder opt-in rate is not a success metric. Raising it is not a goal.

## What this prototype already measures

Automated checks, not people:

- Date classification, including the lead-day boundary and opened-on.
- Match, short, and unit-mismatch behavior.
- Combined-plan subtraction.
- Cooked decrement and removal at zero.
- Diet-filter hiding.
- Contrast of the core text pairs at or above 4.5:1.
- A scripted browser-level walk of the sample kitchen through shop and undo.

Those checks are in `prototype/test/`. They do not replace the 75% and 70% targets.
