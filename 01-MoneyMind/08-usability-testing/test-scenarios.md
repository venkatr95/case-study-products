# Test scenarios and moderator script

Six tasks. That is enough for a 30-minute concept test of the primary job plus the main ways it can be misunderstood. Do not add a bank-linking task. The product does not do that.

Say at the start:

“I’m going to ask you to use a prototype. I didn’t write a trick into it, and I’m not timing you for a score I’ll show anyone else. Please think aloud. The numbers on screen may be sample data, not a real person’s finances. You can’t break anything I can’t reset.”

If using the sample plan, point at the banner once: “This banner means the figures are fictional. The tasks are still about reading them.”

## Scenario 1 — What is this number?

**Setup:** Sample plan, Home.

**Task:** “Without clicking yet, what would you say this large number means for someone standing in a store?”

**Then:** “What would you click to see why it is that amount? Go ahead.”

**Success:** They say, in their own words, that it is what could be spent today while still leaving the set-aside at the lowest point, or they reach that after opening the explanation. They mention it is not guaranteed, or they agree it is not guaranteed when asked “Does the app know this will happen?” A “yes, it will happen” is a trust failure even if they liked the screen.

**Comprehension checks:** Meaning of the number. Low-point date. Not a guarantee.

**PRD link:** Primary metric and trust guardrail.

## Scenario 2 — Why is it lowest there?

**Task:** “What is one bill or paycheck that explains the lowest point, and is there money arriving after that point that is not included?”

**Success:** They name an expense on or before the low point, and they can find later income in “After the low point” or on the timeline and say it does not raise safe to spend.

**PRD link:** FR-04.

## Scenario 3 — Can I afford this?

**Task:** “You want to spend $150 on a dinner on the date before the large bill. See what that would do. Do not change the saved plan.”

**Success:** They open What-if, enter the amount and a date, and can say whether the scenario is saved. Discarding or simply leaving without Add to plan both count. Pressing Add to plan fails the “do not change the saved plan” instruction.

**PRD link:** Task-success metric, FR-07.

## Scenario 4 — Add a real item

**Task:** “The phone bill is missing. Add it as $65 on a date you choose, repeating monthly, and make sure it is actually saved.”

**Success:** The detail screen shows Phone or whatever name they used, and they can get back to a place where the plan includes it. If they only fill the form and stop, that is incomplete.

**Probe if they hit an error:** say nothing until they try once.

**PRD link:** Activation behavior and FR-02. One item is not the 60% activation metric; it only checks that saving is understandable.

## Scenario 5 — Change your mind

**Task:** “Remove the item you just added, then put it back if the prototype lets you.”

**Success:** They delete with the confirm step and find Undo, or they add it again if they miss Undo. Missing Undo is not a failure for them. It is a note for us if nobody sees it.

**PRD link:** FR-05.

## Scenario 6 — The alert

**Task:** “Set an alert for when the estimate goes below $250. Then tell me what you think the app will do tonight if this page is closed.”

**Success:** They can save an amount and the status matches the forecast. The correct belief about tonight is that this prototype will not notify them while the page is closed. If they think a push will arrive at night, the copy failed, even if the control was easy.

**PRD link:** FR-06.

## Optional seventh, if time remains

**Task:** “The balance was last updated three weeks ago. What on the screen tells you whether to trust today’s number?”

Only if the facilitator first sets the balance date back. Success is noticing the stale banner.

## Hints

Give a hint only after they say they are stuck, and mark the task as assisted. The first hint is “What would you tap?” not “Open What-if.”

## Closing

“What felt unclear? What would you want before you typed your own bills into something like this?”

Do not ask “did you like it?” as the main question.
