# Jobs to be done

**Status:** Hypothesis statements derived from the PRD. Not validated.

## Primary job

When I am deciding what to cook, I want to see which ingredients I should use soon and find a practical recipe, so I can waste less food and shop more intentionally.

That sentence is the PRD job. The product interpretation below is a design choice, not extra evidence.

**Product interpretation:** “Use soon” means a best-before or use-by date the person typed, inside a lead window they set (default 3 days). It does not mean the food is unsafe, and it does not include an opened-on date.

## Related jobs the MVP attempts

| Situation | Job hypothesis | How the prototype responds | Status |
| --- | --- | --- | --- |
| I have food and no plan | Show me a dish that uses what is dated soon, and show what is missing | Cook list sorted with Use soon matches first; recipe rows labeled Have, Short, Check, Missing, Staple, Optional | Hypothesis |
| I am about to shop | Do not make me buy what the pantry already covers | Review subtracts only comparable quantities; Check stays on the list | Hypothesis |
| I just cooked | Take the used amount off the pantry without making me edit every line | Cooked proposal, confirm, undo | Hypothesis |
| I am not sure I should log a date | Let me store the date I mean, and do not lecture me with a verdict | Date type is explicit; copy refuses keep-or-discard | Hypothesis |
| I avoid an ingredient | Hide recipes that list it, and do not claim I am safe | Diet filters on listed flags, including optional ingredients | Hypothesis |

## Jobs we explicitly do not take

| Job someone might expect | Why it is refused |
| --- | --- |
| Tell me if this is safe to eat | Dates and photos are not a safety verdict. FSIS dating guidance is linked, not applied. |
| Build me a medical meal plan | Non-goal in the PRD. |
| Buy the groceries for me | Non-goal. Shopping list stops at the list. |
| Keep a shared pantry in sync | Open question. One kitchen on this device until conflict rules exist. |
| Scan a receipt and trust the result | No OCR provider. The screen says so. |

## Forces hypothesis

This is a sketch for interviews, not a finding.

- **Push:** Forgotten food, a duplicate in the cart, a recipe that ignores the fridge.
- **Pull:** A short list of what needs attention, and a gap list that shows its arithmetic.
- **Habit:** Memory, a notes app, a recipe app that starts from the dish.
- **Anxiety:** Logging is a chore. An app that scolds, or that says “safe,” will be distrusted. A unit the app silently converts will be distrusted in a different way.

Interview question 12 in `interview-guide.md` is the check on habit versus anxiety.

## Switching moment to listen for

The moment they choose dinner, and the moment they stand in the shop. If those moments do not include “what is already at home,” the primary job is misstated and the home screen is wrong.
