# Product brief

## Vision

FreshLoop helps a household cook from the food already at home. The person adds what they have, sees which dates they entered are soon, and gets recipe ideas that use those ingredients. A shopping list then asks only for the gaps the pantry can confirm.

## One-line UVP

Know what to cook before your groceries go to waste.

## Target segment

**Primary hypothesis:** People who plan meals and shop for a household, and who already lose track of what is in the fridge, freezer, or cupboards.

**Secondary hypothesis:** Students and budget-conscious cooks with a smaller pantry, who feel the cost of a duplicate or a spoiled item more sharply.

**Out of scope for the MVP:** Shared households with simultaneous editors, retailers, clinicians, and anyone seeking a medical meal plan. Those needs are real for some people and are explicitly later or non-goals.

No segment has been confirmed with interviews. See `assumptions-and-risks.md`.

## Context

Recipe apps start from a dish and send the person shopping. A notes app can hold a list, but it does not compare that list with a recipe. Inventory apps often exist, and several already connect stock to recipes. The hypothesis is that the hard moment is still the decision: which ingredient should be used next, and what can be cooked without pretending the pantry quantity is known.

## Problem hypothesis

Households forget food, buy duplicates, and choose meals from recipes rather than from what is about to need attention. An inventory-first flow may reduce that friction. This is a hypothesis from the PRD, not observed behavior.

## User need and business value

The job in the PRD: when deciding what to cook, see which ingredients to use soon and find a practical recipe, so less food is wasted and the next shop is more intentional.

Business value is unresolved. This concept does not sell food, take a fee, or claim a waste-reduction percentage. A plausible reason to continue, still a hypothesis, is that the decision repeats several times a week. No pricing model is proposed as a fact.

## Differentiation

FreshLoop is the decision at the fridge, not a general recipe feed and not a safety authority.

- The home screen leads with Use soon, counted from dates the person entered.
- A recipe result shows Have, Short, Check, Missing, Staple, or Optional in words.
- The shopping list subtracts a pantry amount only when the units compare. A different unit stays on the list.
- A multi-day plan subtracts each pantry amount once.
- Opened-on is never turned into an expiry. The product refuses a keep-or-discard verdict.
- Manual entry works with no scanner and no account.

Competitive notes and sources are in `competitive-analysis.md`.

## MVP

Must, from the PRD, and present in the prototype:

- Add a pantry item with name, optional quantity, location, and optional date.
- Edit, consume, or remove items, including a cooked-recipe update with undo.
- Use soon list from user-entered dates and a configurable window.
- Recipe discovery from inventory, with dietary filters and a limitation statement.
- Recipe detail with ingredients and steps.
- Shopping list that can exclude confirmed available ingredients and can be edited.
- Empty, duplicate, reminder-permission, error, offline, and unreadable-data states.
- A labeled sample kitchen.

Should, also in the prototype, with the limits named in `VALIDATION.md`:

- Quantity units and a same-location duplicate check.
- Batch move, batch remove, and batch “mark consumed” (whole items only).
- A four-day dinner plan.
- Barcode lookup that fills a form and does not save until the person confirms. Receipt scan is an unavailable state, not a fake capture.

## Non-goals

- Guaranteeing that food is safe or unsafe from a date or a photo.
- Medical nutrition advice or treatment plans.
- Automatic grocery purchase.
- Applying a shelf-life table on the person’s behalf.
- Shared editing, retailer checkout, and image recognition. Those stay out of the MVP screens.

## Primary use case

“What should I cook from what needs attention?” The person sees Use soon, opens a recipe that uses one of those items, reviews what is covered and what is missing, and either shops the gap or marks the meal cooked.

## Secondary use cases

- Add the first items quickly, then fill in quantity and date.
- Confirm or reject a barcode guess before it enters the pantry.
- Plan several dinners and shop the combined gap once.
- Turn reminders on or off without losing the list.
- Export or delete the data stored on the device.

## Dependencies and constraints

- Recipe text in the prototype is original sample content. A production catalog would need a license and an accuracy check. That provider is not assumed.
- Barcode and receipt providers are dependencies. The prototype ships three sample codes and an explicit “not connected” receipt state.
- Dates and storage guidance vary by food and region. The pilot labels are best-before, use-by, and opened-on. That set is an assumption, not a regional decision.
- Data stays in this browser under `freshloop.v1`. It is not encrypted and not uploaded.

## Design strategy

Prioritize the loop the PRD names: add, notice, match, shop the gap, mark consumed. Do not build a safety score, a waste streak, or a silent quantity guess. Those would make the product feel more certain than the data is.
