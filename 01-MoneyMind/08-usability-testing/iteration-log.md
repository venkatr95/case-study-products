# Iteration log

No usability findings exist yet, so there are no design changes logged as responses to tests.

The decisions below were made while building the prototype, before any participant session. They are design rationale, not iterations on evidence.

| Date | Change | Why, before research | What a later test would have to show |
| --- | --- | --- | --- |
| 2026-10-22 | Safe to spend uses the lowest point minus a user-set amount, not a calendar-month leftover. | Matches the PRD job of avoiding a shortfall. | Participants can explain the date of the low point. If they expect “left this month,” revisit the definition. |
| 2026-10-22 | Same-day bills are applied before same-day income. | Avoids hiding a dip behind a paycheck on the same date. | Participants can find that rule on the explanation without calling it a trick. |
| 2026-10-22 | No statistical range. | A band without a model would look more certain. | Only add a range if people enter their own low and high and still understand both are assumptions. |
| 2026-10-22 | Set-aside defaults to an explicit zero rather than a recommended cushion. | A recommended percent would be advice. | Check whether zero is heard as “you don’t need a cushion.” |
| 2026-10-22 | What-if is unsaved until Add to plan. | FR-07. | Scenario 3 in the test plan. |
| 2026-10-22 | Notifications do not claim a background schedule. | The browser prototype cannot do it. | Scenario 6. If copy still fails, shorten the alert screen until the limit is the first sentence. |
| 2026-10-22 | Day rows and the 30-day table stay inside a 390px screen. The table scrolls inside its own region. | A wide amount line and the open table were stretching the page and clipping sentences. | The smoke page checks that width. A phone session should not need to scroll the whole page sideways. |

## When a real issue arrives

Copy the issue ID from the findings template. Write the change. Write the retest criterion in the same row. Do not mark it retested until a new session meets that criterion. Example format:

| Issue | Change made | Retest criterion | Retested |
| --- | --- | --- | --- |
| EX-01 is not real | No change | — | No |
