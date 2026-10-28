# Iteration log

**Actual test iterations:** None. No participant has used the prototype.

Design changes below were made by the author while building and self-reviewing. They are not responses to usability findings. When a study produces an issue, add a row that cites the finding ID and a retest criterion.

## Author changes before any test

| Date | Change | Why | Retest when a study exists |
| --- | --- | --- | --- |
| 2026-10-22 | Status labels never say fully accessible. The strongest positive label is "Matches your preferences on confirmed data." | PRD guardrail. | Task 3 and the closing question. Nobody should hear a guarantee. |
| 2026-10-22 | Community "all clear" does not confirm an attribute. | Stops a report from upgrading unknown data. | Ask participants what a community "no stairs" note allows them to assume. |
| 2026-10-22 | Conflicting entrance reports are listed and not merged. | Open question in the PRD, answered as a proposal. | Task around the south arcade, if added. People should not invent a winner the UI refused to pick. |
| 2026-10-22 | "Mark on the map" replaced "Highlighted on the schematic." | The schematic is hidden in narrow list view, so the old label pointed at nothing. | People can say the control does not choose the route. |
| 2026-10-22 | Disabled button contrast raised from 3.88:1 to 10.24:1. | Failed WCAG text contrast. | Check the disabled Compare button with the preference prompt. |
| 2026-10-22 | Sample banner is on every screen. | Stops the Seattle names from being read as a survey. | Closing question: would they follow this on a real street? The hoped-for answer is no. |

## How a future finding maps to a change

| If the finding is… | Change to try | Retest criterion |
| --- | --- | --- |
| People choose the shortest route and miss the conflict. | Put the status sentence above the time, which is already true. Next: collapse reasons until the status is acknowledged, only if a test shows the sentence is skipped. | Unassisted task 2 success for at least 4 of 5. |
| People treat unknown as safe. | Move unknown reasons above distance on that card. Add an explicit "Do not treat unknown as step-free" line on the card, not only in the footer. | Comprehension score 2, and they do not call Pike and Seneca a match. |
| Presets feel like diagnoses. | Remove preset names and keep the three settings. | Task 1 still succeeds, and nobody describes the screen as labeling them. |
| Pending is read as verified. | Disable any wording near the button that sounds complete. Keep the heading. | Task 5: zero "already checked" explanations. |
| The list is too long to use outside. | Show one comparison row, with details on demand. | Time-to-choice drops without task 2 errors rising. |

## Retest rule

A fix is not accepted because it matches this table. It is accepted when the retest criterion is observed with new participants, or when the team records why the criterion was changed.
