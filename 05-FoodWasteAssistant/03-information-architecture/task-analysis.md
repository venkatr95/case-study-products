# Task analysis

**Task:** Decide what to cook from food already at home, then shop only the confirmed gap.

This is the highest-value task in the PRD. The steps below are the prototype’s task, with the sample kitchen as the worked example. They are not a claim about how people cook today.

## Goal

Leave the session with either a cooked update or a shopping list whose omissions are explained.

## Preconditions

- One kitchen on this device.
- At least the items the person cares about, even if some have no quantity.
- Lead window set (default 3 days).
- Sample catalog of seven original recipes. A licensed catalog is a future dependency.

## Steps

| Step | User action | System response | Failure if this is wrong |
| --- | --- | --- | --- |
| 1 | Opens Pantry | Counts items whose best-before or use-by falls inside the window, and counts Date passed separately | If the count includes Opened, the product has invented an expiry |
| 2 | Opens Use soon | Lists those items in words: Use soon, Date passed, Opened, No date | Color-only dots fail WCAG and the PRD |
| 3 | Opens Cook | Ranks sample recipes by how they use attention items. Diet filters hide listed flags | A feed that ignores the pantry fails the UVP |
| 4 | Opens a recipe | Each ingredient is Have, Short, Check, Missing, Staple, or Optional, with the reason | A single “you can make this” badge hides the gap |
| 5 | Reviews the gap | Lines to buy start checked only when the pantry did not cover them. Staples and optional ingredients start off | Silent subtraction of a mismatched unit fails the release checklist |
| 6a | Commits the list | Shop holds editable lines. Checking a line does not delete it | |
| 6b | Or marks cooked | Proposal prefers the soonest dated match. Person confirms. Undo restores the snapshot | A wrong subtraction with no undo trains people to abandon the list |

## Worked example, sample kitchen, 22 October 2026

Clock is local noon on that date in tests. Lead window is 3.

1. Pantry: 4 Use soon (spinach use-by +1, chicken +2, milk +3, bread best-before today). 1 Date passed (yogurt best-before yesterday, stored as 1 piece). Ginger opened four days ago stays Opened.
2. Spinach and chickpea skillet, 2 servings: spinach 150 g of 200 g is Have. Cumin is optional and missing. Salt and pepper are staples. Review: nothing selected to buy.
3. Yogurt oat bowl: yogurt 150 g versus 1 piece is Check. Yogurt stays on the review list.
4. Plan: skillet on 22 October and lemon chicken on 23 October, 2 servings each. Combined need is 2 lemons and 2 garlic. Pantry has 1 of each, so the gap is 1 lemon and 1 garlic. Spinach is still covered and is not a shopping line.
5. Cook the skillet: spinach becomes 50 g. Garlic and lemon are removed because the proposal uses the whole piece. Undo restores 200 g, garlic, and lemon.

## Cognitive load

The person should hold one decision at a time: what needs attention, whether this dish is covered, what to buy, what left the pantry. The review screen exists so step 5 is not hidden inside step 4.

## What this task analysis does not cover

- Time-on-task from real people. Not measured.
- A week of maintenance. That is research question A1, not this task.
- Shared edits. Out of scope until the open question is answered.
