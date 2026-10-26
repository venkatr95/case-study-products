# Research plan — Rewear

**Status:** Planned. No interviews, diary studies, or usability sessions have been run. Findings in `research-findings.md` are hypotheses and desk research, labeled as such.

## Why this round exists

The PRD asks for 5–8 interviews before implementation commitment, a review of 3–5 alternatives, and a prototype test with 5 people. The competitive review is done and dated. The interviews and the usability test are not. This plan is the interview round. The prototype test is specified separately in `08-usability-testing/` so the two methods are not collapsed into one conversation.

## Research questions

1. The last time getting dressed took too long, what was the person actually doing, and what did they decide?
2. How do they remember clothes that are not in front of them (laundry, storage, another bag)?
3. When they pack for a short trip, do they choose outfits first or items first?
4. Which facts do they use to decide that two items go together: color, season, occasion, fabric, “I wore this yesterday,” something else?
5. What have they already tried (photos, notes, another app), and where did they stop?
6. What would they refuse to photograph, and why?

The questions are about recent behavior. They do not ask “would you use an app that suggests outfits?”

## Method

**Semi-structured interviews, 45 minutes, remote or in person.** One recent getting-dressed story and, if they traveled in the last six months, one packing story. Optional last 5 minutes: show nothing, or show a paper sketch only if the stories have already been told. Do not open the prototype in this round. That belongs to usability testing, where the task is observable.

**Sample size:** 6 participants, with a stop rule at 8 if new stories are still appearing and a floor of 5 matching the PRD. Six is enough to hear whether manual tagging and trip packing show up more than once. It is not a market estimate.

**Mix, hypothesis segments:**

- 4 people who get dressed for a recurring context (work, study, or a school run) and feel the morning decision is harder than it should be.
- 2 people who packed for a trip of 2–7 nights in the last six months.

Do not recruit only people who already love wardrobe apps. They will describe product features, not the job.

## Participant criteria

See `screener.md`. Exclusions: people under 18, and anyone who cannot comfortably talk about ordinary clothes. Do not screen for body size, gender presentation, or income. If a quota is needed so the sample is not only one gender, set it in recruiting and say so in the write-up. It is not a product requirement that Rewear is “for women.”

## Logistics

- Moderator plus a note-taker, or a recording with consent.
- Session length 45 minutes. Incentive stated before the session, paid even if they stop.
- Notes template: story, quotes, objects they mentioned, workarounds, contradictions. No scores during the interview.
- Analysis: affinity on behaviors and breakdowns, not on feature requests. Separate observation, inference, and design implication, using the table in `research-findings.md`.

## Consent and privacy

- Say what will be recorded, who will see it, and when it will be deleted.
- Do not ask them to show a camera roll of their body. If they offer a photo of a garment, they can describe it instead.
- Do not collect exact home address. A city is enough if travel stories need a climate, and it is optional.
- Quotes in a portfolio need a second, specific consent. This case study has no quotes.

## What would change the design

| If we hear | Design response to consider |
| --- | --- |
| People choose outfits from laundry state, not from color | Add a clean / in the wash state before any smarter matcher. Not in the prototype. |
| Nobody will type season or dressiness | Drop those from required fields and keep them optional. Suggestions get weaker on purpose. |
| Packing is “throw in extras,” not “choose outfits” | Keep outfit-first packing but add a clearly named extras list. Not in the prototype. |
| The pain is shopping, not getting dressed | The PRD non-goal stands. Do not add a shop. Re-scope the product instead of bending it. |
| Photos are the only way they will catalogue | Photo-assisted tagging becomes a Must, with confirmation before save, per the PRD. |

Until those sessions exist, the prototype follows the working answers in `assumptions-and-risks.md`.
