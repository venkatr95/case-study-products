# Assumptions and risks

**Status:** Hypotheses and design decisions. None of the user assumptions have been confirmed in interviews.
**Date:** 22 October 2026

Confidence is how willing this concept is to proceed on the assumption. Risk is the damage if the assumption is wrong. Both are judgments, not measurements.

## Assumptions

| ID | Assumption | Confidence | Risk if wrong | How the design treats it now | What would change it |
| --- | --- | --- | --- | --- | --- |
| A1 | Career changers and early-career people want a skill comparison before a long course list. | Low | The product solves a problem people do not have. | Built as the core flow. | 5–8 recent-behavior interviews. See `02-ux-research/research-plan.md`. |
| A2 | The first useful role family is customer, operations, and coordination work. | Low | Profiles miss the roles people actually consider. | Four roles in that family, plus junior data analyst labeled as a larger jump. Custom roles are allowed. | Interview answers about the last role someone considered. |
| A3 | People will self-assess proficiency and confidence if the words are concrete. | Medium | Inventories stay empty, or people pick the highest option. | Four proficiency labels and three confidence labels, each with an example. No test. | Usability sessions on the skill form. |
| A4 | A score would be read as a judgment or a hiring chance. | Medium | People feel lost without a number and abandon the page. | No percentage, grade, or gauge. Copy says there is no match score. | Comprehension task in the usability plan. If people cannot act without a number, revise the explanation before adding a score. |
| A5 | Three actions are enough to start and few enough to avoid overwhelm. | Low | People want the full list, or three still feels like too much. | The generated plan is capped at three. The person can add more. | Session observation of whether people save, edit, or ignore the cap. |
| A6 | Evidence for this concept is a self-report plus an optional note about recent work. Confidence is separate from proficiency. | Medium | People treat the form as a test, or notes leak sensitive detail. | No quiz. Notes are optional and local. The paste warning names phone, address, and date of birth as unnecessary. | Privacy review and interview probes. |
| A7 | A small set of labeled example links is enough to show FR-07. | High for the prototype, low for production | A production catalog goes stale or looks like an endorsement. | Five public example links. Some actions have none. Users cannot paste a new URL. | A named maintainer, license check, and freshness date. |
| A8 | People will trust a profile that states it is illustrative. | Low | They treat the list as an employer standard anyway. | Source card on every profile, dated 22 Oct 2026, says it is not O*NET and not a job description. | Practitioner review, then a named editor and review date. |
| A9 | Keeping data in the browser is acceptable for a prototype. | High for the prototype | A real product would need an account, sync, and a deletion story that survives a new device. | localStorage key `skillbridge.career-navigator.v1`. Settings can copy JSON and delete. | Out of scope until the job is validated. |
| A10 | Resume paste is useful only if the person reviews every suggestion. | Medium | People confirm a wall of suggestions without reading them. | Suggestions default to practicing and low confidence. Nothing is saved until a checkbox is confirmed. Cap of 12. | Watch the review screen in a usability session. |

## Product risks from the PRD

| Risk | Mitigation in this concept |
| --- | --- |
| Misleading skill scores | Match status is a rule on proficiency and confidence, shown in words. The rule is documented in `07-prototype/prototype-flow.md`. |
| Overwhelming plans | First generated set is at most three actions, ordered missing core, partial core, missing supporting, partial supporting. |
| Outdated role requirements | Every curated profile shows the date 22 Oct 2026 and the source sentence. The person can hide, restore, or add a requirement. |
| Extraction errors | Phrase lexicon only. Review screen. Manual add and remove. Paste is not stored. |

## Unresolved decisions

These are the PRD's open questions. The prototype picks a temporary answer so the flow can be tried. The temporary answer is not a decision to ship.

| Question | Temporary answer | Still unresolved |
| --- | --- | --- |
| Which role family? | Customer, operations, and coordination, plus one labeled stretch role. | Whether that family is the one people ask about. |
| Who maintains profiles, and how often? | No owner. Profiles are illustrative. | A named editor, a cited source, and a review cadence. |
| What evidence counts? | Self-report. Optional recent-work note. Confidence is separate. No assessment. | Whether employers, courses, or work samples should ever count. This concept does not add them. |
| Which learning resources? | Five public examples, not endorsements. | License, maintainer, and what to do when a link breaks. |

## Trust decisions locked for the prototype

- Changing the goal keeps skills and earlier actions. Actions stay tied to the role they were saved for.
- Replacing real work with Maya's sample requires confirmation.
- A sample badge remains if Maya's data is edited, until the person deletes or starts their own profile.
- Hiding a requirement does not delete the curated profile or existing actions.
- An empty skill list does not render a wall of "not in your list."
- The progress meter counts only actions the person marked done.
- Corrupt saved JSON is left in place until the person deletes it.
- The interface does not infer or store protected characteristics.
