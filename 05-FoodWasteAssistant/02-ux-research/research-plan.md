# Research plan

**Status:** Planned. No interviews have been run. This document is the protocol, not a report of findings.

**Product:** FreshLoop. UVP: Know what to cook before your groceries go to waste.

**Access date for the competitive pages already reviewed:** 22 October 2026. That review is not a substitute for participant research.

## Why this research exists

The PRD treats the problem, the personas, and the success targets as hypotheses. The highest-risk assumption (A1 in `01-product-analysis/assumptions-and-risks.md`) is that someone will keep a pantry list current if the first add is only a name. If that is false, recipe matching has nothing honest to match against.

A second risk is date language. Best-before, use-by, and opened-on may be the wrong set for the pilot region. The product must not invent a regional standard.

## Research questions

1. In the last two weeks, when did someone notice food they had forgotten, or buy a duplicate of food they already had? What did they do next?
2. How do they decide dinner when time is short? Where does a recipe app, a notes list, or memory enter that decision?
3. What dates, if any, do they record or notice on food, and what do those words mean to them?
4. What would make a pantry list feel worth updating after one week? What made a previous list die?
5. How do they treat “I might have it” when building a shopping list? Do they want the app to guess?
6. Who else shops or cooks in the household, and where do two lists conflict?
7. What would feel like an unsafe or overconfident claim about food, allergens, or health?

Questions 1–4 are about recent behavior. Questions 5–7 test the design bets only after the behavior is described. Do not open with FreshLoop.

## Method

| Round | Method | Purpose |
| --- | --- | --- |
| 1 | 45-minute remote interviews, recent-behavior | Answer questions 1–7. Do not demo the product in the first 30 minutes. |
| 2 | 5 moderated usability sessions on the prototype | After interviews, if the problem still looks real. Protocol in `08-usability-testing/`. |
| Competitive review | Already drafted | `01-product-analysis/competitive-analysis.md`. Re-check any page before citing it again. |

No diary study and no survey in this round. A diary would be useful later for A1, after the interview language is stable.

## Participants

**Primary:** Adults who plan meals and shop for a household at least twice a month, and who cook at least three times a week.

**Secondary:** Students or other budget-conscious cooks who shop for themselves and have a small fridge.

**Exclude:** People whose job is professional recipe development or food-safety inspection, for this first round. Their expertise would skew the language. They are a later expert review, not the primary segment.

**Sample size:** 6 interviews (at least 4 primary, up to 2 secondary). The PRD asks for 5–8. Six is enough to hear whether the maintenance burden is widespread before spending the usability sessions. It is not enough to estimate a percentage. Do not turn six interviews into a rate.

**Recruiting:** Screener in `screener.md`. Aim for a mix of household sizes and of people who do and do not currently keep a food list. Pay for the time. State that in the invite.

## Logistics

- Video call, camera optional. Recording only with consent.
- Moderator uses `interview-guide.md`. A note-taker writes behavior, not interpretations, in the participant’s words.
- No prototype on screen until the optional last 10 minutes, and only if the person asks what is being designed. If shown, label it as a concept.
- Do not ask for photographs of their fridge unless they offer. If they offer, do not store the image with their name.

## Consent and privacy

- Say the session is for a portfolio concept, not a live product.
- Say recording is optional and can be stopped.
- Do not collect full names in the analysis file. Use P1, P2.
- Do not ask for medical history, income figures, or exact addresses.
- Store notes locally. Delete recordings after notes are checked, unless the person agrees to a longer keep.
- Do not put quotes in the case study until a real session produced them and the person allowed use.

## Analysis

1. Code each note to the research question, not to a feature.
2. Separate three layers in `research-findings.md`: evidence (what they said or did), interpretation (what we think it means), design implication (what would change).
3. A finding needs at least two participants, or one participant plus a cited competitive or standards source. A single anecdote stays in the appendix.
4. Update assumptions A1–A10 only when a finding meets that bar. Until then they stay hypotheses.
5. If interviews say people will not log food, stop and redesign entry before usability-testing the recipe match. Do not “validate” a flow nobody would feed.

## What should change after real findings

| If we learn | Then change |
| --- | --- |
| People will not type a name | Drop the recipe match as the hero. Test a shorter capture, or stop. |
| Date words differ by region | Replace the four labels. Do not add a shelf-life table to paper over the gap. |
| The decision starts in a recipe app | Keep inventory, but enter from the recipe they already opened, not from a pantry home. |
| Shared editing is the actual job | Do not ship one-device as the product story. Design conflict rules before more screens. |
| “Check” lines feel like a failure | Rewrite the reason. Do not start subtracting mismatched units. |

## Out of scope for this plan

- Measuring the 75% and 70% PRD targets. Those belong to the usability test, after this round.
- Food-safety expert review of date copy. Needed before any public pilot, not before the first interviews.
- Pricing research. No price is proposed.
