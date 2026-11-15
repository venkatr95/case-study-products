# UVP and positioning

**Product:** SkillBridge
**Status:** Positioning hypothesis for a portfolio concept. Not tested with buyers or users.
**Date:** 22 October 2026

## UVP

Turn the skills you already have into a clear path to your next role.

The sentence is the PRD line. The prototype uses it as the welcome heading. It is a promise about clarity, not about getting hired.

## Positioning statement

For a career changer or an early-career person who is looking at one next role, SkillBridge is a private career navigator that compares skills they confirm with an editable role profile and turns the gaps into a few small actions. Unlike a resume matcher, it does not score a document against a posting. Unlike a long curriculum, it starts from what the person already claims and stops the first plan at three actions.

## What the product is

- A comparison of self-reported skills with one role profile.
- A short, editable plan.
- A record the person can correct, complete, or delete.

## What the product is not

- A hiring, pay, or interview prediction.
- A tool for recruiters or employers to rank candidates.
- An occupational encyclopedia, a job board, or a course catalog.
- A test of the person's worth.

This boundary is on the welcome screen, in the persistent limitation banner, and in Settings.

## Differentiation

| Alternative | What it optimizes | SkillBridge choice |
| --- | --- | --- |
| Jobscan, Teal | Resume versus one posting, summarized as a match rate or match score | Words: matched, partial, not in your list. No percentage. |
| roadmap.sh | A community curriculum for a developer role | A personal inventory first, then at most three actions. |
| CareerOneStop Skills Matcher | Ratings of generic skills mapped to many occupations, with wages and outlook | One chosen role. No wages. The person confirms each skill. |
| O*NET / My Next Move | Occupation reports with Importance and Level | The profile names a source and a date. It is not presented as O*NET. |
| A spreadsheet or notes | Full control, no structure | The same editability, with definitions and a fixed first-plan size. |

Sources for the alternatives are in `competitive-analysis.md`. The table describes the opportunity this concept takes. It does not claim those products cannot add a learning plan later.

## Design strategy

Prioritize, in this order:

1. Make the limit visible before any comparison.
2. Let the person choose a role and see its source.
3. Let them enter skills with proficiency and confidence, or confirm resume suggestions one by one.
4. Explain the comparison in sentences, and lead with what they already listed.
5. Offer three actions, each with an outcome and a first step they can rewrite.

Do not build, in this concept:

- A match percentage, even if people ask for one. Whether that refusal confuses people is a usability question, not a reason to add the number now.
- Employer-facing ranking.
- Job listings, salary, mentorship, or portfolio projects.
- A model that infers skills the person did not confirm.
- Arbitrary links the person or a third party can attach. Example resources are a fixed, labeled set.

## Message hierarchy

1. You already have skills. Name them.
2. Here is how they sit against this profile, in words.
3. Here are three small actions. Change them if they are wrong.
4. This is not a prediction about getting hired.

## Voice

Plain, specific, and calm. The interface says "not in your list" rather than "missing" or "failed." Counts describe entries. They are not a grade. Sample data is named as fiction (Maya Chen).
