# SkillBridge — Career Navigator

**UVP:** Turn the skills you already have into a clear path to your next role.

| | |
| --- | --- |
| Product | SkillBridge. This case study lives in the CareerNavigator folder. |
| Role | Product design and prototype implementation for a portfolio concept. |
| Timeline | Proposed study, assembled 22 October 2026. Not a shipped product timeline. |
| Status | Concept prototype and design narrative. Validation planned. No participant results. |

## Executive summary

Career changers and early-career people are often handed either a match rate against a job posting or a long curriculum. SkillBridge is a different bet: start from skills the person is willing to claim, compare them in words with one editable role profile, and stop the first plan at three actions.

The prototype does that in a browser. It includes goal selection, self-assessed skills, a resume paste that saves nothing until the person checks a box, a comparison with no percentage, and a roadmap they can edit, complete, and undo. Five role profiles are labeled as illustrations dated 22 October 2026. They are not occupational standards.

Interviews and usability sessions have not been run. The 80%, 70%, and 80% targets in the PRD are hypotheses. Competitor notes come from public pages opened on 22 October 2026.

## Problem and why it matters

The PRD's problem is a hypothesis: people struggle to translate experience they already have into the language of a role, and broad learning advice makes the next step feel endless.

That matters only if the next step is actually a skill plan. It might instead be a conversation, a rewritten resume, or a decision not to switch. The research plan asks about the last real search before this product is treated as the answer. Until those interviews exist, the problem statement stays a hypothesis.

What the design can still do, honestly, is refuse two common harms: a number that looks like a hiring chance, and a plan too long to start.

## Target users and evidence status

**Primary, from the PRD:** Career changers and early-career professionals exploring a next role.

**Secondary:** Learners planning skill development around a specific job goal.

**Not for:** Recruiters or employers screening candidates.

Two proto-personas in `02-ux-research/personas.md` are sketches, marked as hypotheses. Maya Chen, the in-product sample, is fiction for the demo path. She is not a persona and not evidence.

No interviews have been conducted. No quotes in this case study come from users.

## Research approach and findings status

The discovery plan in the PRD asks for 5–8 recent-behavior interviews, a review of 3–5 alternatives, and a prototype test with 5 people.

The alternative review is written and cited. The interview guide, screener, and findings template are ready and empty. The usability plan has five tasks and an empty findings table. An example row in that table is labeled as a formatting sample, not a result.

Findings status: **none.**

## Competitive landscape and opportunity

Reviewed 22 October 2026 from public pages. Detail and URLs are in `01-product-analysis/competitive-analysis.md`.

Jobscan documents a resume-to-posting match rate. Its help text says the rate weighs hard skills, then education when an advanced degree is in the posting, job title, soft skills, and other keywords, and it recommends aiming near 75%. Teal's pricing page lists a free plan and Teal+ at $13 / 7 days, $29 / 30 days, and $79 / 90 days, with a Match Score on the paid tier. roadmap.sh publishes community developer roadmaps and progress. CareerOneStop's Skills Matcher rates skills and returns occupations with wages and outlook. O*NET reports Importance and Level for occupations. LinkedIn's signed-in job tools were not walked through, so they are not described screen by screen.

The opportunity this concept takes: a personal inventory, one role, words instead of a rate, and a three-action plan. That is a choice about the job to be done. It is not a claim that those products are badly made, or that they lack a feature on a page that was not opened.

## Product strategy and prioritization

Must-have scope from the PRD is in the prototype: goal, skills with confidence, editable profile with a source, comparison, roadmap, save and complete, limits and deletion. Should-have scope is in a limited form: paste with review, five example links, progress and a reflection note. Could-have scope (jobs, mentors, portfolio projects, regional pay) was not built.

The strategy is written in `01-product-analysis/uvp-and-positioning.md`. The prioritization table and the requirement trace are in `03-information-architecture/feature-prioritization.md`.

Trade-off: people who want a match percentage will not get one. If usability testing shows they cannot act without a number, the next change is a clearer explanation. Adding the number would break the guardrail the PRD names.

## Information architecture and key flow

Five sections: Goal, Skills, Comparison, Roadmap, Progress. Settings sits outside the tabs. Welcome has no tab.

The primary flow is: see the limit, choose a role, add skills or confirm a paste, read the comparison, save three actions, mark one done and undo it. A diagram is in `assets/diagrams/primary-flow.svg`.

Changing goals keeps skills. Actions stay attached to the role they were saved for. A custom role starts empty until the person adds requirements.

## Early wireframes and rationale

Fifteen grayscale SVGs, 390 × 844 phone frames on a 1120-wide canvas, with an annotation column. Files are in `assets/wireframes/`. Specifications are in `04-wireframes/`.

The frames exist to lock hierarchy before color: the limit before data, the source on the profile, proficiency separate from confidence, a sentence before the rows, three actions, and an empty comparison that is not a wall of failures. Edit-profile and not-found are specified and built. They do not have their own SVG. That deviation is noted in the screen inventory.

## Visual direction and design system

The direction is a field notebook: Fraunces for titles, Atkinson Hyperlegible for reading, warm paper, one teal for the action and for matched, amber for partial, slate for "not in your list," red only for destructive confirmation. Tokens, components, and contrast minimums are in `05-ui-design-system/`. There is no dark theme.

The system serves the UVP by making the comparison a reading task. A gauge would have fought the copy.

## Final screen walkthrough

Screenshots of the running UI are in `assets/screenshots/`. The styled app, not the wireframes, is the high-fidelity UI.

1. **Welcome** states the UVP and says the product does not predict hiring, pay, or interviews.
2. **Goals** offers four roles in customer, operations, and coordination work, plus junior data analyst marked as a larger jump, plus a role the person describes.
3. **Role profile** shows each skill, whether it is core or supporting, why it is there, and the source dated 22 Oct 2026.
4. **Skills** hold proficiency, confidence, and an optional example. The form is two questions, not a test.
5. **Comparison** leads with "You listed N skills." Maya's fixture lists 7, with 1 match, 2 partial, 6 profile skills not in her list (4 core), and 4 extras that "still count."
6. **Gap** repeats the why and offers a small practice step. The person can say the skill is not part of the role they mean.
7. **Roadmap** saves three actions. The first three for Maya against product operations are stakeholder updates, requirements briefs, and process mapping.
8. **Action** can be rewritten, marked done, and undone. Example links name a provider and a topic. Some actions have none.
9. **Progress** counts actions marked done. It says it is not a score.
10. **Settings** copies JSON that does not include a paste, and deletes local data after a confirm.
11. **Unreadable data** appears when saved JSON cannot be used. The app does not overwrite it until the person deletes it.

## Key interaction

The comparison rule is visible under "How matching works":

- Matched: comfortable or strong, and confidence medium or high.
- Partial: exploring, practicing, or a solid level with low confidence.
- Not in your list: the profile includes it and they have not added it.

Resume suggestions default to practicing and low confidence, so a phrase match cannot arrive as a matched skill. The person has to raise both ratings themselves.

Undo is a toast after a status change, and the status buttons stay on the action. Delete has no undo and says so.

## Accessibility, edge cases, and trust

The target is WCAG 2.2 AA as an intent. Keyboard access, visible focus, labels, contrast pairs under unit test, a 720px wrap, reduced motion, and forced colors are in the prototype. A screen-reader user has not audited it. The dialog cycles Tab at its ends and does not mark the page behind it as inert. Those limits are in `05-ui-design-system/accessibility.md`.

Trust decisions that are easy to undo in code and were kept anyway:

- No percentage, including when the progress bar uses a CSS width. The accessible value is a count of actions.
- Empty skill list: no match chips.
- Paste discarded on refresh. Backup copy says the paste is not included.
- Illustrative profiles say they are not O*NET and not an employer description.
- The product does not ask for protected characteristics. The paste warning names phone, address, and date of birth as unnecessary.

## Usability validation status and iterations

**Validation planned.** No sessions, no severity counts, no iteration caused by a participant.

Build decisions made before research are logged in `08-usability-testing/iteration-log.md` and labeled as such. The test plan asks five people to choose a role, add skills, name gaps in the product's words, save and undo an action, and find delete. Success criteria are in `test-scenarios.md`.

## Success metrics and how they would be measured

| Hypothesis | How a later study would score it |
| --- | --- |
| 80% can identify their top three gaps | After the comparison, they name partial or absent skills that match the rows they saw. |
| 70% create at least one action | They save an action without a moderator click. |
| 80% understand this is not a hiring prediction | They do not describe the screen as an employer's decision. |

Five concept-test participants cannot carry those percentages. The first round looks for repeated confusion. Baselines for return use do not exist. The prototype sends no analytics.

Guardrail: do not represent inferred skill scores as objective. The narrative is tested so it does not contain a percentage.

## Limitations, learnings, and next steps

**Limitations.** The role family is a hypothesis. Profiles have no practitioner reviewer. Learning links are five public examples, not a catalog with an owner. The extractor is a phrase list. There is no account. This case study does not report a user outcome.

**What the work decided, without claiming it was validated.** The comparison should talk about entries, not readiness. The first plan should be shorter than the gap list. A source and a date belong on the profile, especially when the profile is made up for a prototype. Sample data should be obviously fictional.

**Next steps.**

1. Run the interview guide with people who recently looked at a different role. Change the role family if their answers do not match it.
2. Give any profile that remains a named editor, a cited source, and a review date.
3. Replace the example links with a maintained set, or remove links rather than leave stale ones.

Until those happen, SkillBridge is a portfolio prototype that demonstrates a flow and a set of refusals. It is not evidence that the flow helps anyone get a job. The product says that on the first screen.
