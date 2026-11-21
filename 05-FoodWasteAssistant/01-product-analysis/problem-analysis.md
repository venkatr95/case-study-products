# Problem analysis

## The decision the product is for

The moment that matters is standing in the kitchen, or looking at a shop list, and not knowing which of the food already bought should be used next. A recipe search answers “what could I make?” An inventory answers “what did I record?” FreshLoop tries to answer both in one pass: what needs attention, what can be cooked with it, and what is still missing.

## Hypothesis, not a finding

The PRD states that households forget ingredients, buy duplicates, and that meal tools often start from recipes. Those statements are **hypotheses**. This folder does not contain interviews, diary studies, or waste measurements. Do not cite them as user evidence.

## Where the friction is assumed to sit

| Stage | Assumed friction | Why it matters to the design |
| --- | --- | --- |
| After shopping | Food is put away and not written down. | Entry has to be fast, and quantity can be blank. |
| During the week | Dates on packages are ambiguous, and memory is worse. | The person names the date type. The app does not infer safety. |
| Choosing a meal | Recipe apps ignore the fridge, or inventory apps bury the “use this first” decision. | Use soon is the first module on the pantry. |
| Making a list | “I have yogurt” is treated as “I have enough yogurt.” | Different units and blank amounts stay on the list. |
| After cooking | The inventory is now wrong, so the next decision is worse. | Cooked updates are proposed, editable, and undoable. |

## What would make the hypothesis false

The design should change if research shows any of these:

- People do not lose track of food. They waste it because they cooked too much or disliked the meal. An inventory would not help.
- The burden of logging is higher than the cost of the waste. Quick add would still be too much, and the MVP would fail its own maintenance test.
- People already solve this with a shared note or a retailer app, and the gap is not the decision screen.
- The dates they care about are not best-before or use-by. The pilot labels would be wrong.
- “Use soon” increases anxiety or causes people to discard food that was still fine. The guardrail on safety language would be insufficient.

## Harms to avoid while exploring the problem

- A confident “safe” or “throw it out” label can cause someone to eat unsafe food or to waste edible food. FreshLoop does not make that call.
- A diet filter that says “allergen-free” can be believed as a medical check. The copy says the filter only sees listed sample ingredients.
- A shame-based waste score is easy to draw and hard to justify. No baseline exists, so the MVP has no score.

## Design implication

Build the smallest loop that lets a person add food, see their own dates, match a recipe, and correct the inventory. Hold every claim of reduced waste until a pilot measures self-reported discards against a baseline, as the PRD asks.
