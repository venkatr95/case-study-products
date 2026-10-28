# Task analysis

**Task:** Compare routes for a step-free walk from Cal Anderson Park's south path to the Pike Place Market First Avenue entrance, then choose one.

This is the highest-value task in the PRD. The sample data is illustrative.

## Preconditions

- The person can read the screen or use a screen reader.
- They can operate buttons by pointer, keyboard, or both.
- They do not yet need an account.

## Steps

| Step | Action | System response | Difficulty hypothesis |
| --- | --- | --- | --- |
| 1 | Open preferences. | Four presets and three settings. | Low if the preset names match their words. |
| 2 | Choose Step-free and save. | Avoid stairs on, curb ramps on, grades under 8%. Stored on the device. | Low. |
| 3 | Set origin and destination. | Compare enables. | Low. Place names are a closed sample list. |
| 4 | Compare. | Loading text, then three routes. | Medium. Three statuses must be learned. |
| 5 | Read Madison gentle. | Match on confirmed data. About 2.0 mi, about 48 min. Surface on Western Avenue unknown, called out as not one of the settings. | Medium. They must accept a longer route. |
| 6 | Read Pike and Seneca. | Unknown grade on Pike Street and unknown curb ramp on Seneca. A pending note about uneven bricks. | Medium. Unknown must not be read as safe. |
| 7 | Read Pine Street direct. | Conflict. Stairs confirmed on the Pine Street link. Grade about 10% on Denny Way. | Low if the conflict copy is literal. |
| 8 | Open Madison and choose it. | Recent trip saved. No guidance starts. | Low. |

## Decision rule the interface encodes

A route matches only when every selected check is confirmed and inside the limit.

- Stairs: confirmed absent.
- Curb ramps: confirmed present, if that setting is on.
- Grade: confirmed and less than or equal to the limit, if a limit is on.
- A blocking barrier or a verified outage on the route forces a conflict even when the attributes look clear.

## Errors worth watching in a test

- Choosing Pine because it is 26 minutes and the status was not read.
- Treating Pike and Seneca as a match because most chips are confirmed.
- Stopping at step 4 and never opening detail, then being unable to say what is unknown.
- Assuming the choice started navigation.

## Cognitive load

The card shows status, name, distance, time, an evidence count, and up to three reasons. That is dense. The reasons are ordered conflict, unknown, note, then clear, so a problem is not buried under "no stairs" lines. Whether the density is acceptable is a test question, not a settled claim.

## Environment

Phone, outdoors, possibly one-handed, sometimes with glare. Targets are at least 44px. Text can be raised to 125% and 150% in the product, and the browser zoom still applies. The task does not require color vision: status is a word plus an icon and a border pattern.
