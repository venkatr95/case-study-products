# Jobs to be done

**Status:** From the PRD, restated as hypotheses. Not validated.
**Date:** 22 October 2026

## Primary job

When I am considering a role, I want to understand which skills I already have and which I should develop next, so I can make a practical plan.

**Success the product can support:** The person can point to matched skills, partial skills, and a few next actions, and can correct any of them.

**Success the product must not promise:** An interview, an offer, a salary, or a judgment that they are qualified.

## Related jobs the prototype also serves

| Job | Screen | Why it is in scope |
| --- | --- | --- |
| When I read a role profile, I want to know who wrote it and when, so I can decide how much to trust it. | S-03 Role profile | NFR: explain source and limitations. |
| When I am unsure how good I am, I want to say so without failing a test. | S-06 Skill form | Confidence is separate from proficiency. |
| When a tool pulls skills from my resume, I want to reject the ones that are wrong before they are saved. | S-08 Import review | FR-06. |
| When a plan is wrong, I want to rewrite the action or remove it. | S-12 Action | FR-04 and FR-05. |
| When I am done looking, I want the data gone from this browser. | S-14 Settings | NFR: deletion. |

## Jobs the product refuses

| Job | Why it is refused |
| --- | --- |
| When I am hiring, I want to rank these people. | Non-user. No employer workflow. |
| When I want to know my chances, I want a match percentage. | Guardrail against scores that look objective. |
| When I want a course for every gap tonight, I want the full catalog. | The first plan is three actions. Resources are examples, and some actions have none. |
| When I want local pay, I want a salary range. | Could-have later, and only after a data source is validated. Not built. |

## Forces, as hypotheses

**Push:** A posting uses words that do not match the person's job title, so they cannot tell what they already do.

**Pull:** A short list with definitions, and a plan small enough to finish one item.

**Habit:** Rewrite the resume until a scanner shows a higher number. Jobscan's own help text, reviewed 22 Oct 2026, recommends aiming near a 75% match rate. That habit is the behavior this concept chooses not to reinforce.

**Anxiety:** A gap list feels like a verdict. The comparison leads with "You listed N skills" and uses "not in your list" so absence is an inventory fact, not a grade.

These forces are design reasoning. They are not findings.
