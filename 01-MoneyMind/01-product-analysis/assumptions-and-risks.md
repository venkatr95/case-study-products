# Assumptions and risks

Confidence is a design judgment, not evidence. Nothing in this table has been confirmed with participants.

| Rank | Assumption | Confidence | Risk if wrong | What would change the design |
| --- | --- | --- | --- | --- |
| 1 | The job is “will I run short before more money arrives,” not “how did I spend last month.” | Low | The whole information architecture is aimed at the wrong task. | Re-scope around whatever job interviews actually show. |
| 2 | People will type a balance and at least a few dated items. | Low | Manual entry never reaches a useful estimate. | Shorten entry further, or stop claiming value without a bank feed. Do not add a bank feed only to hide this. |
| 3 | Showing the formula increases trust instead of creating false precision. | Medium | People either skip it or treat the arithmetic as proof. | Test comprehension. If labels fail, the number cannot ship as a decision tool. |
| 4 | A user-chosen set-aside, defaulting to zero, is safer than a recommended cushion. | Medium | Users wanted guidance and read zero as “no need for a cushion.” | Keep zero available, but test whether an optional example is heard as advice. |
| 5 | Counting same-day bills before same-day income matches how people think about a dip. | Low | The rule feels like a trick. | Explain it earlier, or offer a clearly labeled alternate once research shows the mental model. |
| 6 | 30 days is the right horizon. | Low | The stressful gap is the next paycheck, or a full quarter. | Make the horizon follow the next income date, or let the person choose a window. |
| 7 | One cash pool and one currency are enough to learn. | Medium | The real shortfall is across accounts. | Stay manual, but ask which pool the decision uses. Do not imply the number covers every account. |
| 8 | A what-if that is not saved is understandable. | Medium | People think the scenario changed their plan. | The visual split and “not saved” label exist to test this. |
| 9 | In-app alerts are enough to learn the threshold behavior. | High for the prototype | A production reminder that only works while the app is open will be judged as broken. | Do not market background alerts until a real notification design exists. |

## Product risks from the PRD

**False confidence.** Mitigations in the prototype: the word “Estimate” in the header, the disclaimer on decision screens, the full formula, and a usability guardrail that fewer than 10% of testers should believe the forecast is guaranteed. That rate is a target, not a result.

**Manual-entry burden.** Mitigations: two-step onboarding, a live preview before save, and labeled sample data. These are untested.

**Sensitive data exposure.** The prototype stores entries in `localStorage` without encryption and says so before the person types. That is an honest prototype limit, not a security control. Production needs a reviewed storage design. Bank credentials are not collected.

**Recurrence mistakes.** Monthly dates use the anchor day and clamp only in shorter months. Day 31 does not roll into the next month. The rule is documented in the engine, covered by tests, and mentioned in the form when the anchor day is 29, 30, or 31. Past occurrences are not added on top of the starting balance.

## Unresolved decisions

- Segment with the most frequent cash uncertainty.
- Whether users should control the reserve. The prototype lets them, including zero, and does not recommend a number.
- Countries and currencies in scope. The symbol list is USD, CAD, GBP, EUR, and AUD for display only.
- Retention and deletion policy beyond “delete the record in this browser.”

## Design responses that are still provisional

If interviews contradict assumption 1 or 2, stop polishing the visual system and change the job. The prototype is cheap to throw away. The formula should not be defended as correct if people cannot explain it.
