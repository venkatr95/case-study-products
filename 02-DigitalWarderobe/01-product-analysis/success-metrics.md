# Success metrics — Rewear

The numbers below are the PRD’s **candidate targets for moderated prototype testing**. They are not baseline measurements. Nothing in this case study has been measured with participants.

## North star

**More outfits assembled from clothes the person already owns, with less time spent deciding.**

A practical prototype version of that star: the person leaves a session with at least one saved outfit they consider wearable, built from items they recognize as theirs or, in the demo, from the labeled sample.

## Metric tree

```text
North star: a saved outfit the person would wear, from items they own
├── Activation
│   ├── Share of participants who add at least 5 items with the capture flow
│   │     PRD target: 70%
│   │     Guardrail: manual entry still works if the photo fails
│   └── Median time to the first usable outfit
│         PRD target: under 3 minutes
├── Task success
│   └── Share who can find or generate an outfit for a specified occasion
│         PRD target: 80%
└── Post-launch indicators, not prototype targets
    ├── Weekly outfit saves
    └── Repeat use
          Do not treat either as proven until instrumented
```

## Guardrails

| Guardrail | Why | How this prototype supports measuring it |
| --- | --- | --- |
| Manual entry if photo recognition or upload fails | PRD guardrail. The product cannot collapse when the camera does. | Failure state is reachable from “Reviewer tools” and from a real file error. Save stays available. |
| No sensitive inference from photos | NFR | The client never sends the image to a model. Copy says it is not scanned. |
| Deletion is real | Trust | Delete photo, delete all photos, delete wardrobe. Undo exists for a single photo delete in the session. |
| Suggestions can be refused | Trust in FR-07 | Dismiss stores the combination so it does not immediately return. The manual builder remains. |
| No invented environmental impact | Non-goal | No impact counter exists. |

## Definitions for a future test

| Measure | Definition | Not this |
| --- | --- | --- |
| Item added | A saved item with name, category, color, season, and dressiness. Photo may be empty. | Opening the form |
| Usable outfit | Participant says they could wear it, or saves it without saying it is nonsense. Record their words. Do not score it yourself as “stylish.” | The mere existence of a suggestion |
| Found or generated | They either filter/search to the items and save an outfit, or they save a suggestion, for the occasion the moderator names. | Wandering the grid with no outfit |
| Time to first outfit | From the moment they choose sample or empty, to the outfit saved confirmation. | Including the consent script |
| Error | A wrong filter they cannot clear, a dead end, or a save they think succeeded and did not. | A preference (“I would not wear brown”). |

## What the prototype can count later, and does not count now

Local events that would be worth logging in a hosted build:

- `item_saved` with `has_photo`
- `photo_failed`
- `outfit_saved` with `source = manual | suggestion`
- `suggestion_dismissed`
- `packing_built` with `outfit_count` and `line_count`
- `item_deleted` and `photo_deleted`

This prototype does not send analytics. Counting them here would be fake telemetry.

## How we would know the design failed

- Fewer than the PRD’s 70% can add five items, and the failures are about the form rather than about not owning five items. Recruiting has to allow people to add sample-like stand-ins if they did not bring clothes. **That recruiting choice must be written into the test, or the 70% target is not interpretable.**
- People can save an outfit and still cannot explain the occasion on it. FR-05 failed even if the click succeeded.
- Packing lists show the same item twice. FR-06 failed.
- People describe the tone as a lecture. The non-goal failed even if the tasks passed.

## Business metrics

Not defined. The PRD does not set revenue, retention cohorts, or a price. Inventing a conversion rate would violate the evidence rule. If a later brief adds a price, put it next to Cladwell’s published stylist price and Stylebook’s one-time price only as context, not as a Rewear forecast.
