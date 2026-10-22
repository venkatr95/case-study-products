# Task analysis

**Task:** Decide whether an optional expense fits before the next cash low point.

This is the highest-value task in the PRD flow. The analysis lists what the person must know, what the interface must supply, and where it can fail. It is not a usability result.

## Goal

Leave knowing one of these, and knowing it is an estimate:

- There is an amount they could spend today without pushing the lowest point under their set-aside.
- There is no such amount, and by how much the estimate is short, on which date.

## Preconditions

- A starting balance and date are saved.
- The bills and income they believe matter are entered. If not, the task includes adding them.
- They can read the currency symbol they chose.

## Steps and interface support

| Step | Cognitive demand | What the UI does | Failure if missing |
| --- | --- | --- | --- |
| 1. Orient | “Is this my money or a demo?” | Sample banner and “On this device.” | They treat sample math as personal advice. |
| 2. Read the number | Parse a currency figure as spendable today. | Large safe-to-spend figure, sentence with the set-aside and the date. | A bare number is heard as the bank balance. |
| 3. Check the caveat | Hold “estimate” in mind. | Header pill plus disclaimer. | They leave believing a guarantee. The trust guardrail fails. |
| 4. Find the cause | Connect the number to a bill. | “Lowest estimate” card and the explanation’s item list. | They cannot say why the number moved. |
| 5. Separate later income | Do not add the next paycheck into today’s spend. | “After the low point” section. | Safe to spend silently includes future pay. |
| 6. Test the purchase | Imagine one extra expense. | What-if, dashed scenario, saved column unchanged. | The plan changes without consent. |
| 7. Commit or leave | Choose save or discard. | Two explicit buttons. | Typing is mistaken for saving. |

## Information the person must not need

- A category taxonomy. Category does not change the number. The summary says so.
- A probability. No range is shown.
- A recommended cushion. Set-aside copy says the amount is their choice.
- A bank login.

## Environment

Phone is the primary size because the decision often happens away from a desk. The same task works at desktop width with the navigation on the left. The task does not require hover.

## Time expectation

A prepared plan should support steps 2–7 in a few minutes. The first-time version includes onboarding and item entry and will take longer. Neither duration has been measured with participants. The smoke script only checks that the path can be operated.

## Acceptance mapping

| PRD ask | Task step |
| --- | --- |
| New user creates a forecast without a bank | Preconditions via manual entry or labeled sample |
| Inputs and limits are discoverable | Steps 1, 3, and 5 |
| Add, edit, delete update the forecast | Step 6 when they add the scenario, plus the edit flow |
| Critical screens have loading, empty, and error states | Empty plan, unreadable storage, stale banner |
| Users understand projections are not guarantees | Steps 3 and the usability script |
