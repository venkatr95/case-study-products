# Usability test plan

**Status:** Planned. No sessions have been run. Do not fill the findings with expected results.

## Goals

Learn whether people can set a preference, tell the three evidence states apart, and choose a route that matches the settings they set. Also learn whether the interface ever sounds like a guarantee.

## Questions

1. Can a participant configure a preference and select a suitable route? PRD bar: 80% in a later sample. This plan does not pretend the bar has been met.
2. Can they explain confirmed, community-reported, and unknown without using the product's sentences verbatim?
3. Do they choose a conflicting route anyway, and why?
4. Do they notice that a match is not a guarantee?
5. Can they tell a pending report from the sample verified report?

## Participants

Five people for a first concept test. Same constraints as the screener, with one extra: they have not been interviewed in the discovery round, so the concept is new.

Include at least one person who uses a screen reader and at least one who will try the session at 150% text, if recruiting allows. If it does not, record the gap rather than skipping the criterion silently.

## Method

Moderated remote or in-person session, 40 minutes, on the prototype at a phone width. The facilitator does not demonstrate the happy path first.

## Measures

| Measure | Definition |
| --- | --- |
| Completion | The task's success rule, scored 1 or 0. |
| Error | A choice or explanation that contradicts the settings or the evidence rule. |
| Time | Secondary. Note if they rush the first card. |
| Confidence | One question, 1 to 5, after each choice: how sure are you this route fits the settings? |
| Comprehension | Their restatement of the three evidence words, scored against the rubric below. |

**Comprehension rubric:** 2 = distinguishes all three and says unknown is not an all-clear. 1 = distinguishes two, or defines all three but treats unknown as safe. 0 = cannot separate them.

## Severity for issues

| Level | Meaning | Retest? |
| --- | --- | --- |
| 1 | Blocks the route choice or causes a false guarantee | Yes, before any wider test |
| 2 | Causes a wrong route or a missed unknown with a workaround available | Yes |
| 3 | Slows or confuses, choice still correct | Fix, retest if cheap |
| 4 | Wording nit | Batch |

## Moderator stance

Read `test-scenarios.md`. Do not say "the green one is best." Do not explain chips unless the task asks for their own words and they are stuck after a silent wait. If they are stuck, note it and give a nudge only to reach a later task. Mark nudged tasks as assisted.

## Consent and privacy

Explain the prototype uses sample Seattle data and is not guidance for a real trip. Ask consent to record. Store notes by code. Do not collect location. Do not require a diagnosis. Offer to stop. The prototype's location button does not read the device. Say that before the trip task so the dialog is not a surprise threat.

## Analysis

Score tasks the same day. Separate observation, quote, and recommended change. Put results in `findings-template.md`. Put design responses in `iteration-log.md`. Do not edit this plan's targets after seeing results without marking the change.
