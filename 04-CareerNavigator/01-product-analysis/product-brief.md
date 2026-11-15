# Product brief

**Product:** SkillBridge
**Case study folder:** CareerNavigator
**Status:** Portfolio concept. Draft PRD, not a validated specification.
**Platform:** Responsive web app
**Date of this brief:** 22 October 2026

## Vision

A person who is changing careers, or who is early in a career, can see which of their self-reported skills already fit a role they choose, which are only partial, and which small actions are worth doing next.

## One-line UVP

Turn the skills you already have into a clear path to your next role.

## Target segment

**Primary:** Career changers and early-career professionals exploring a next role.
**Secondary:** Learners planning skill development around a specific job goal.
**Not for:** Recruiters making hiring decisions, or employers screening candidates.

The first content set is a hypothesis, not a researched segment cut: people moving within customer, operations, and coordination work. A fifth profile, junior data analyst, is included as a larger jump so the interface can be judged when most skills are gaps. See `assumptions-and-risks.md`.

## Context

People in this situation already meet three kinds of tools:

- A resume-to-posting matcher that returns a score.
- A long, role-wide curriculum.
- An occupational encyclopedia that describes jobs, wages, and skill ratings without starting from what the person confirms about themselves.

SkillBridge sits in the gap between those. It starts from skills the person is willing to claim, compares them with one editable role profile, and stops at a short plan.

## Problem hypothesis

Career changers and early-career workers struggle to translate experience they already have into the language of a role, and broad learning advice makes the next step feel endless. A transparent comparison and a small plan may make exploration concrete.

This problem statement is a hypothesis from the PRD. It has not been tested with participants.

## User needs the design serves

- See existing skills treated as evidence, not as a deficit.
- Understand a role's skills in plain language, with a source and a date.
- Tell "I do this" from "I am unsure" without a hidden rubric.
- Leave with a few actions that fit in one sitting.
- Correct the profile, the skill, or the action when the product is wrong.
- Know the result is not a prediction about hiring.

## Business value hypothesis

If the comparison is trustworthy, a person returns to update a skill or finish an action. That return use is the value to measure later. This concept does not assume a business model. Pricing, ads, and employer licensing are out of scope until the user job is real.

## MVP

Must have, and present in the prototype:

- Goal selection, including a role the person describes.
- Skills with proficiency and confidence.
- An editable role profile with a visible source.
- A side-by-side comparison using matched, partial, and not in your list.
- A prioritized roadmap of small actions.
- Save, edit, complete, and undo.
- Visible limits, and deletion of saved data.

Should have, and present in a limited form:

- Pasted resume text with review before save.
- Example learning links labeled with provider and topic.
- A progress view and a reflection note.

Could have later, and not built:

- Job listings, mentorship, portfolio projects, regional pay.

## Non-goals

- Guaranteeing employment, pay, or interviews.
- Ranking candidates for employers.
- Inferring protected characteristics or using them in recommendations.
- Showing a single match score.

## Primary use case

Maya is a fictional retail shift lead exploring product operations. She confirms skills she already uses. The comparison shows customer conversations as matched, spreadsheets and written updates as partial, and several core skills as not in her list. She saves three actions and can mark one done.

## Secondary use cases

- Someone adds skills with no resume.
- Someone pastes resume text, rejects bad suggestions, and saves the rest.
- Someone hides a requirement that does not belong to the role they mean.
- Someone writes a role that is not in the five profiles.
- Someone switches goals. Skills stay. Actions for the previous goal remain stored.

## Dependencies and constraints

- Role content must be attributable and dated. The prototype uses author-written illustrations.
- External course or job data would need a license, a freshness check, and a citation. The prototype does not call those services.
- Self-assessment is the only proficiency signal. There is no test and no employer verification.
- Data stays in the browser. There is no account.
- If extraction is ever replaced by a model, suggestions must stay distinct from confirmed skills.

## Design strategy

Prioritize the comparison and the three-action plan. Explain every label. Let the person edit every input that affects the result.

Do not build a score, a job board, or an employer mode. Those would pull the product toward judgment and away from the UVP.

## Open decisions

- Is customer, operations, and coordination the right first family?
- Who edits production profiles, and how often?
- Which evidence, besides a self-report, should count later?
- Which learning links can be recommended and kept current?

Until those are answered, the interface labels profiles as illustrative and links as examples.
