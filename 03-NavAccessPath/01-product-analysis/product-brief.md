# Product brief — AccessPath

**Status:** Portfolio concept. Not a validated product specification.
**Platform:** Mobile-first web prototype, responsive from a narrow phone to a wide browser.
**Pilot hypothesis:** Seattle. Published sidewalk-network work makes a data conversation possible there. AccessPath has not licensed that data.

## Vision

AccessPath helps someone compare a few routes by the access conditions they actually need, and by how much of that information is known. The shortest walk is allowed to lose.

**UVP:** Find routes that work for your mobility needs, not just the shortest route.

## Who it is for

- **Primary:** People who need step-free travel or who need to limit stairs and steep segments. Needs differ. The product does not collapse them into one profile.
- **Secondary:** People comparing a route for someone else, or for a temporary constraint such as a stroller, luggage, or an injury.
- **Not the user to optimize first:** Drivers, cyclists, or people who only want the fastest multimodal itinerary.

## Problem

A route that looks short can include stairs, a steep block, a missing curb ramp, or an entrance that has not been described. People often discover that after they have started. Mainstream maps now offer a wheelchair or step-free option in some cities. Those options still tend to return "the accessible route" without showing, segment by segment, what was confirmed, what a person reported, and what nobody knows.

## What the prototype decides

1. Preferences are explicit: avoid stairs, prefer known curb ramps, and an optional grade limit. Presets fill those settings and stay editable.
2. Every compared route gets one of four statuses: matches on confirmed data, some details are unknown, conflicts with the preferences, or no access preferences selected.
3. Unknown is a status. It is never treated as step-free, level, or open.
4. A community report can raise a concern. It cannot promote an unknown detail to confirmed.
5. Two reports about one entrance stay listed. They are not averaged.
6. The text list is complete. The schematic is a second view of the same segments.
7. A submitted barrier report is pending review. The confirmation says it is not verified.

## MVP

Must have, and present in the prototype:

- Configurable preferences and route results that use them, or an explanation when nothing matches.
- Comparison of distance, time, known barriers, and evidence counts.
- Unknown data left unknown.
- Segment and entrance detail in text.
- A barrier report with a visible pending status, timestamp, and withdraw action.
- A list that does not depend on reading the map.

Should have, partially present:

- Saved preferences and recent routes, stored in the browser. There is no signed-in account.
- Community reports with timestamps and a pending or verified label. Moderation is described, not operated.

Could have, illustrated only:

- One sample elevator notice with a source and an update time. It is not a live transit feed.

## Non-goals

- Guaranteeing a barrier-free route.
- Replacing emergency services or official accessibility guidance.
- Turn-by-turn navigation in this concept.
- Launching beyond one pilot city before data quality is reviewed.
- A medical or diagnostic intake.

## Primary use case

Before leaving, compare walking routes from a known origin to a known destination, see which one agrees with saved access preferences on confirmed data, inspect the segments, and choose with the gaps still visible.

## Secondary use cases

- Change a preset because today's constraint is a stroller, not the usual step-free settings.
- Open an entrance and read conflicting reports without being told which one "wins."
- Report a stairway or a blocked sidewalk and see that the report is pending, not verified.
- Recover when the trip is outside the pilot, the pair has no data, the service fails, or the phone is offline.

## Business value — hypothesis

The value to test is trust and task success, not a claimed market size. A navigation product that will not say "fully accessible" over missing data may be useful to people who have been stranded, and to the organizations that would otherwise carry the cost of a bad recommendation. Pricing, a city contract, and licensing are unresolved. No revenue model is asserted here.

## Design strategy

Prioritize evidence quality, editable preferences, and a text-complete route. Do not build a second general map, a live transit product, or a single accessibility score. Those already exist, and a score would hide the uncertainty this product exists to show.
