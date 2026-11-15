# Problem analysis

## Hypothesis

When someone considers a next role, they cannot easily see which of their current skills already count, which are thin, and what to practice next without taking on a whole curriculum. The PRD treats this as a hypothesis. No interviews have confirmed it.

## Who feels it

**Career changers.** Their evidence is attached to a previous job title. A posting uses different words. A generic roadmap ignores the overlap.

**Early-career workers.** They have some practice and a lot of uncertainty. A score treats that uncertainty as a miss. A long syllabus treats it as a reason to start over.

**Not the user.** A recruiter who wants to rank applicants. Serving that job would conflict with the guardrail against definitive scores and with the non-goal of automated screening.

## What they are trying to do

When I am considering a role, I want to understand which skills I already have and which I should develop next, so I can make a practical plan.

The situation is a specific role or direction, not a general desire to "upskill." The progress they want is a plan they believe, not a badge.

## Why current behavior falls short

These are design inferences from public product surfaces, not findings from users. They need interviews before they are treated as facts.

- **Score-first tools** answer "how close is my resume to this posting?" The number is easy to remember and hard to interpret. It invites people to stuff keywords. It does not say what to practice.
- **Full curricula** answer "what does a whole role require?" They are useful after a commitment. They are heavy when the person is still deciding.
- **Occupational references** answer "what does this job involve, and what does it pay?" They are careful about sources. They do not start from a skill the person confirms, and they do not leave the person with an editable action.

## Consequences if the hypothesis is true

- People over-study skills they already use, because those skills were named differently in the old job.
- People stall because the gap list is longer than a month of spare time.
- People treat a keyword score as a hiring forecast and either panic or game it.

## Consequences if the hypothesis is false

- The useful job may be "tailor this resume to this posting," which Jobscan and Teal already pursue.
- Or the useful job may be "show me careers I have not considered," which CareerOneStop's Skills Matcher and O*NET exploration already pursue.
- A comparison against one chosen role would then be a feature, not a product.

The research plan asks which of these jobs showed up the last time the person tried to make a move.

## Design tension

The PRD names the core design challenge: explain comparison data without making people feel judged.

A complete gap list is honest and harsh. A score is compact and easy to over-read. SkillBridge chooses a third shape:

- Lead with skills the person listed, including ones the profile does not require.
- Use matched, partial, and not in your list, each defined in a sentence.
- Withhold the gap presentation until they have listed at least one skill.
- Cap the first plan at three actions.
- Repeat that the result is not a hiring prediction.

## What "solved" would look like in a test

From the PRD's candidate targets, still unvalidated:

- Most prototype participants can name their top three gaps for the role they chose.
- Most save at least one learning action in the session.
- Most can say, in their own words, that the result is guidance rather than a hiring prediction.
- Participants describe the plan as something they could start, not as a pile.

Those targets are success criteria for a future test. They are not results.
