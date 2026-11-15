# Usability test plan

**Status:** Planned. No sessions have been run. No findings are recorded.
**Date:** 22 October 2026

## Goals

Learn whether a person can complete the core job on the prototype without treating the comparison as a grade.

## Questions

1. Can they name three skills the profile emphasizes that they have not marked as comfortable and sure?
2. Do they save an action without being told which button to press?
3. After the task, do they describe the result as guidance rather than a hiring chance?
4. Does "not in your list" feel like an inventory fact or like a failure?
5. Is the three-action cap clear, including that they can add more?
6. Can they undo Done and find Delete?

## Participants

Five people who pass the screener in `02-ux-research/screener.md`. At least two career changers and two early-career participants if recruiting allows. Do not fill empty seats with teammates who built the prototype.

Five people cannot support the PRD's 80% and 70% targets. This round looks for repeated breakdowns. A later round can try to measure the percentages.

## Setup

- Local prototype, fresh storage, their own browser profile or a private window.
- 45 minutes. 5 minutes consent, 30 minutes tasks, 10 minutes debrief.
- Moderator script below. Do not say "there is no score" before the comprehension question.
- Record only with consent. Do not put resume text into the findings file.
- At the end, delete data from Settings and close the tab.

## Moderator script

"We are looking at an early design. It is not a test of you, and it is not a job application. I will ask you to try tasks and to say what you are thinking. I will not tell you the 'right' click unless you are stuck for a while. Some of the content is sample content. Please use a role you actually care about if one is listed. You do not have to paste a resume."

If they go silent: "What are you looking at?"

If they ask whether they are qualified: "The design should answer that for itself. What do you think it is saying?"

## Measures

| Measure | How |
| --- | --- |
| Completion | Finished the task without a moderator click. Partial if they finished after one hint. |
| Errors | Wrong control, or a statement that contradicts the screen (for example, reading a percentage that is not there). |
| Time | Note start and end. Do not set a pass/fail time for this round. |
| Confidence | After each task, "How sure are you that you finished it?" Low, medium, high. Their word. |
| Comprehension | The hiring question and the top-three-gaps question. |

## Severity

| Level | Meaning | Example shape |
| --- | --- | --- |
| 1 | Blocks the task or creates a false belief about hiring | They believe the page says they will not be hired. |
| 2 | They finish only with help, or they misread a status | They cannot tell partial from matched. |
| 3 | Hesitation, extra click, wording they dislike | They want a number but can still save an action. |
| 4 | Comment, no observed struggle | They prefer another typeface. |

## Consent

Same points as the research plan: voluntary, skippable, no sensitive details in notes, quotes need a second yes, delete local data afterward.

## What this plan will not claim

A market, a conversion rate, or that the PRD targets were met.
