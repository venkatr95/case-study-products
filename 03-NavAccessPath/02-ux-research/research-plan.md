# Research plan

**Status:** Planned. No participants have been recruited and no sessions have been run.

## Purpose

Learn how people currently plan an unfamiliar walking trip when stairs, steepness, or step-free access matter, before treating AccessPath's screens as the answer.

## Research questions

1. On the last unfamiliar trip, what did the person check before leaving, and what did they find only after starting?
2. Which constraints did they actually set: stairs, grade, curb ramps, elevator status, entrance, weather, time, or companionship?
3. How do they treat missing information today? Do they read silence as "no problem"?
4. Do they want one recommended route, or a comparison that includes a route they will reject?
5. What would they need to see before trusting a community report?
6. For a companion or a temporary constraint, do they want a separate setup or a change to the usual one?

## Method

Semi-structured interviews, 45 minutes, remote or in person. Recent-behavior questions first. The prototype is not shown in the first half. A short concept discussion is allowed only after the past trip has been described.

This is not a usability test. Usability of the prototype is a separate plan in `08-usability-testing/`.

## Participants

5 to 8 people, matching the PRD discovery note.

- At least four who, in the last three months, planned a walking or transit-plus-walking trip in which stairs or steepness mattered for them.
- At least two who planned such a trip for someone else, or with a stroller, luggage, or a temporary injury.
- Mix of people who use a mobility aid and people who do not. Do not require a diagnosis.
- At least two who live in or have recently navigated the candidate pilot city, if Seattle remains the hypothesis.
- Exclude employees of the mapping products in the competitive review, to avoid expert bias in a first round.

**Sample-size rationale:** Five to eight interviews can surface repeated workarounds and language. They cannot estimate the 80% usability targets. Those need the separate prototype test.

## Logistics

- Screener: `screener.md`. Interview: `interview-guide.md`.
- Consent read aloud. Session recorded only with permission. Notes are enough if recording is declined.
- Incentive and vendor are not chosen. Do not store contact details in this repository.
- Hold sessions in a quiet place. Offer a phone interview if video is a barrier. Provide questions in advance on request.

## Privacy

- Collect the trip story, not medical history. If a person volunteers a diagnosis, do not require it and do not put it in the persona.
- Store notes without names. Use participant codes.
- Delete recordings after notes are checked, on a schedule written into the consent.
- Do not ask for home addresses. A neighborhood is enough.

## Analysis

After each session, tag notes to the research questions. Separate three columns:

- **Evidence:** what the person said they did, with a pointer to the note.
- **Interpretation:** what the team thinks it means.
- **Design implication:** what would change in AccessPath, or what would stay.

Hold a synthesis session after the fourth interview and again at the end. Disconfirming stories stay in the findings. Do not convert a single story into a percentage.

## What should change if findings disagree

| If we hear… | Then revisit… |
| --- | --- |
| "Just give me the step-free route." | Whether conflicts stay on the first screen. |
| "I don't know what confirmed means." | Chip language and the evidence explainer. |
| "Grade doesn't matter; stairs do." | Whether gentle grades remains a preset. |
| "I will not trust other people's reports." | Whether community notes are on the summary card. |
| "I need the elevator status or I won't go." | Moving the sample transit notice from Could to Should. |

The current screens are a hypothesis about these answers, not a record of them.
