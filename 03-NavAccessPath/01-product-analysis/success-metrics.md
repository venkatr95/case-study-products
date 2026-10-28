# Success metrics

Targets below come from the PRD. They are evaluation criteria for a future study, not results. No participant has used this prototype for measurement.

## North star — hypothesis

A person can choose a route that matches their stated access settings, and can say what the product does not know.

The prototype's north-star behavior is the step-free comparison from Cal Anderson Park to Pike Place Market: Madison gentle matches on confirmed data, Pike and Seneca has unknowns, and Pine Street direct conflicts. That fixture is how the product behavior is tested in code. It is not a user-success result.

## Metric tree

| Metric | PRD target | How it would be measured | Guardrail |
| --- | --- | --- | --- |
| Preference setup and suitable choice | 80% of prototype participants configure a preference and select a suitable route | Moderated task. Success: save or apply a preset, open comparison, and choose the route whose status matches the settings they set. See `08-usability-testing/`. | Do not count a choice as success if the person cannot say why the other routes were worse. |
| Evidence comprehension | 80% correctly distinguish confirmed, community-reported, and unknown | After the comparison task, ask them to explain one chip of each kind in their own words. Score with a rubric, not a feeling. | A correct definition that still leads them to treat unknown as safe is a fail. |
| Selection errors versus a baseline | Fewer route-selection errors than a baseline task | Give the same trip once in a shortest-first list with barriers buried, once in AccessPath. Define an error as choosing a route that conflicts with the stated preference. | The baseline must be fair and documented. This case study does not invent a delta. |
| Overclaim | Never label a route fully accessible when required data is unknown | Interface audit plus the automated check that status labels do not use that phrase. Unknown on a selected setting yields "Some details are unknown," not a match. | Also refuse the phrase when every selected fact is confirmed. The product does not offer a blanket rating. |

## Other signals to collect later

- Time to a choice, as a secondary measure. Speed is not the goal if it comes from skipping unknown rows.
- Whether people open route detail before choosing. **Hypothesis:** detail opens are a sign the summary is not enough, which may be desirable.
- Report completion and withdraw rate, only after a real reporting flow exists.
- How often people change a preset. High change may mean presets are useful or that the default was wrong.

## What this prototype already checks

Unit tests assert the metric definitions that can be checked without participants:

- A selected unknown blocks a match.
- A community "all clear" does not confirm.
- A confirmed stair or an over-limit grade conflicts.
- An unknown surface does not block a match when surface is not selected.
- Status strings do not say "fully accessible."
- Outside-pilot and missing pairs produce no invented route.
- A submitted report is pending and can become withdrawn.

Those tests do not estimate the 80% targets.
