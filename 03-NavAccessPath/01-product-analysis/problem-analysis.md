# Problem analysis

**Evidence status:** The problem is a product hypothesis. No interviews have been run for this case study. Behavioral claims below are marked.

## The job

When a person is planning a trip, they want to compare routes against their access requirements so they can choose a path with fewer surprises. The surprise is the failure: a stairway, a steep block, a curb, a closed sidewalk, or a door that the map never described.

## Why shortest-first fails — hypothesis

General routing optimizes time or distance and assumes a traveler can use stairs and manage steep grades. **Hypothesis:** For someone who cannot, the top result is often the one they must reject, and the rejection happens too late if the barrier is not in the summary.

A step-free filter improves that, and several products already ship one. The remaining problem is not only "find a route that avoids stairs." It is:

- The filter hides the route that failed, so the person cannot see why.
- Missing data is omitted instead of labeled unknown, which reads as "no problem noted."
- One wheelchair or step-free switch stands in for different needs: no stairs, limited grade, a stroller, a walking aid, a companion's constraints.
- A crowd rating and a surveyed attribute look the same in the interface.
- Place pages and route pages do not share one evidence language.

## Who feels it — hypothesis

The PRD's primary audience is people who need step-free or otherwise accessible routes. Secondary audiences include caregivers and people temporarily traveling with luggage, an injury, or a stroller. **Hypothesis:** These groups share the job and do not share a profile. A parent with a stroller may accept a moderate slope and still need to avoid stairs. A person limiting grade may not need curb-ramp filtering that day.

**Non-assumption:** Disabled people do not have one shared route preference. The interface therefore starts from settings, not from a named diagnosis.

## Current workaround — hypothesis, to validate

A plausible current sequence, not an observed one:

1. Ask a map for walking directions.
2. Turn on a wheelchair or step-free option if it can be found.
3. Cross-check a place on a crowd map or by phone.
4. Look at street-level imagery for a curb or a step.
5. Leave, and still meet a barrier the sources did not agree on.

The cost is time before the trip and the chance of a trip that cannot be finished. This case study does not claim a measured time or a measured failure rate.

## What "good" is not

Good is not a badge that says a route is fully accessible. The PRD guardrail forbids that label when required data is unknown. AccessPath goes further and never uses the label at all. The strongest positive sentence is: "Matches your preferences on confirmed data." The next sentence says that is not a guarantee.

## Design implications

- Show the short route when it conflicts. Explain the conflict.
- Count confirmed, community-reported, and unknown separately.
- Let a person edit the preset. Do not infer a profile from a disability category.
- Put the same facts in a list that a schematic shows.
- Make report status literal: pending review is not verified.

## What would change this analysis

Five to eight interviews about the last unfamiliar trip, plus a competitive check of the current map UIs in Seattle, would confirm or retire the workaround sequence. If people already trust a step-free toggle and do not ask about evidence, the comparison screen should lead with the chosen route and tuck the evidence model. That is a research question, not a decision already made.
