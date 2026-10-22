# Annotations

The numbered notes on each SVG are the review comments. This file collects the decisions those notes are pointing at, so a wireframe can be discussed without opening the prototype.

## Trust annotations

- The header pill says Estimate on every in-app screen, including empty and sample states.
- The disclaimer is a sentence under the decision, not a footer link.
- Sample data is a banner with a remove action, not a watermark that fails contrast.
- The scenario column is dashed and labeled “Not saved.” The saved column keeps its title “Saved estimate.”

## Math annotations

- Safe to spend is defined on the first screen, before a balance is requested, so the later number is not a surprise.
- The explanation lists income that was not counted when it falls on the low-point day after bills.
- “After the low point” exists so a later paycheck is visible and excluded on purpose.
- Quiet days still announce the lowest estimate if it sits in a stretch with no items. A flat plan’s low point is the first day.

## Entry annotations

- Amount errors say what to type, for example “Use dollars and up to two cents, such as 25.00.”
- Future balance dates are rejected. Item dates in the past are allowed and explained as already inside the starting balance.
- Delete focuses Cancel first. Undo is offered once for an item delete, not for “delete all data.”

## Responsive annotations

- Below 880px the primary four destinations are a bottom bar. Settings stays in the header so the bar stays readable.
- At 880px and above the bar becomes a left column and Settings moves there.
- The home hero and the next-items list sit side by side only at that wider size.
- The what-if comparison stacks on a phone and sits in two columns when there is room.

## What the wireframes deliberately omit

- A bank picker.
- A red “danger” illustration of the person.
- A sparkline with no table.
- Category icons that would be the only label.
- A recommended emergency-fund percentage.
