# Usability test plan — Rewear

**Status:** Plan only. No sessions have been run. Do not fill the findings template with imagined results.

## Goals

Learn whether a person can:

1. Add an item without a photo.
2. Find an item with search or filters.
3. Save an outfit for a named occasion.
4. Understand why a suggestion appeared, and refuse it.
5. Build a packing list where a shared item appears once.

These map to the PRD’s prototype targets: five items added, an outfit for a specified occasion, and time to a first outfit. Five items in one session may be tiring. The plan asks for **one** full add, then lets them duplicate the action or stop. The 70% / five-item target should be measured in a separate pass or by asking them to add five only if the first add is easy. Forcing five bad adds teaches us nothing new after the second failure. Record that deviation if you use it.

## Questions

- Where do they hesitate on the add form?
- Do they notice the occasion on the saved outfit without being asked to look for it?
- Do they read the suggestion factors or only the clothes?
- Do they believe the packing list dropped a duplicate, or do they think an item is missing?
- Do any words feel like a judgment?

## Participants

5 people, matching the PRD’s prototype-test note. Same life situations as the screener: recent getting-dressed friction, and at least 2 who packed a short trip recently. Not only wardrobe-app power users. 18 or older. Incentive paid if they stop early.

Five people can find large breaks. They cannot prove the 70% or 80% targets. Those percentages need a larger sample. Report task success as “3 of 5” if that is what happened, and do not convert it into the PRD percentage.

## Method

Moderated, 40 minutes, remote screen share or in person on a phone-width browser. The prototype is the build in `prototype/` with a fresh browser profile so no one sees the moderator’s wardrobe.

Order:

1. Consent and think-aloud instructions. No demo.
2. Tasks below, sample wardrobe **not** preloaded, so the add task is real. After the add task, the moderator may load the sample so later tasks are not blocked by an empty closet. Say that out loud: “I’m loading example clothes so we can look at outfits. They are not yours.”
3. Three debrief questions. No “did you like it?”

If the research question is only the outfit and the packing list, a second round can start from the sample. Do not mix those results with the activation metric.

## Measures

| Measure | How |
| --- | --- |
| Completion | Finished the task’s success state without moderator rescue |
| Rescue | Moderator had to point at a control. Note the exact prompt. |
| Error | Wrong path they could not leave, or a result they misread |
| Time | Start when the task is read, stop at the success state. Median across completed attempts. |
| Confidence | After each task, “How sure are you that you finished? 1 to 5.” |
| Comprehension | For the suggestion and the packing list, ask them to explain the screen before moving on. |

## Severity

| Level | Meaning | Example bar |
| --- | --- | --- |
| 1 | Cosmetic, they proceed | A label they reread once |
| 2 | Delay or annoyance, they recover | They open the wrong tab, then find it |
| 3 | Task fails or they need rescue | They cannot save without a photo, contrary to the design |
| 4 | They quit or misread a destructive action | They think delete removed nothing, or the reverse |

## Moderator script, neutral

“I’m going to ask you to do a few things in a prototype. It may be incomplete. I didn’t design a test of you. Please talk through what you’re looking at. I won’t tell you where to click unless you’re stuck and I need to move us on. Start whenever you’re ready.”

Do not say “the app suggests outfits” before the suggestion task. Read the task wording in `test-scenarios.md` as written.

## Consent and privacy

- What is recorded, who sees it, when it is deleted.
- They may use fictional item names. They should not upload a photo of their body. The task says a photo is optional and this task skips it.
- Do not require a real price.
- Portfolio use of a clip needs separate consent. This case study has none.

## After the round

Each issue gets a severity, a screen, a proposed change, and a retest task in the iteration log. Empty templates are the deliverable until then.
