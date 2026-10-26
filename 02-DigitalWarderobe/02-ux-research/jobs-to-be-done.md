# Jobs to be done — Rewear

The primary job is copied from the PRD and kept intact. The others are **hypotheses** that explain the screens. They are not validated jobs.

## Primary job

When I am getting dressed or packing, I want to see workable combinations from my own clothes, so I can decide faster and avoid unnecessary purchases.

**Design test:** Can someone reach a saved outfit for a named occasion without buying anything and without a social feed?

## Job stories used to scope the MVP

### 1. Remember a specific item

When I know I own something and I cannot see it, I want to search or filter by what I remember (a color, a category, a season, a word in the name), so I can decide if it is in the outfit.

**Screens:** wardrobe, filters, item detail.
**Requirement:** FR-03.

### 2. Record an item I intend to use

When I am ready to track a piece, I want to save its name and the tags that make it matchable, with or without a photo, so the wardrobe is useful even if the picture fails.

**Screens:** add item, photo failure.
**Requirement:** FR-01.

### 3. Keep the record truthful

When a piece changes or leaves my wardrobe, I want edit, archive, or delete to update the outfits that include it, with a clear confirmation, so I am not styling a ghost.

**Screens:** edit item, delete confirm, outfit detail.
**Requirement:** FR-02.

### 4. Decide an outfit for a context

When I know the kind of day and the kind of weather I care about, I want to assemble items I own and save that outfit, so tomorrow I do not start from zero.

**Screens:** outfit builder, outfit detail.
**Requirements:** FR-04, FR-05.

### 5. See a combination I did not line up myself

When I am stuck, I want a few combinations of my own tags, each with a reason, so I can save one or reject it without wondering what the app used.

**Screens:** suggestions.
**Requirement:** FR-07. Should, included.

### 6. Pack the outfits, not a second guess

When I have outfits for a trip, I want one list of the items those outfits require, with shared items once, so I can check them off as I pack.

**Screens:** new trip, packing list.
**Requirement:** FR-06. Priority conflict resolved in favor of building it. See assumptions.

### 7. Know what “worn” and “cost” mean

When I choose to log a wear, and if I also entered a price, I want a simple cost per wear, so the number is mine. If I have not worn it, I do not want a made-up cost.

**Screens:** item detail.
**Requirement:** Should, not a launch blocker.

### 8. Stay in control of pictures

When I no longer want a photo stored, I want to delete that photo or all photos without losing the written wardrobe, so storage is a choice.

**Screens:** item detail, settings.
**Requirement:** NFR on deletion.

## Jobs we are not hiring the product for

- Tell me who I am stylistically.
- Tell me what my body should wear.
- Sell me the missing piece.
- Show me other people’s closets.
- Prove I reduced my environmental impact.
- Track laundry. **Hypothesis that this might be a real job.** It is intentionally not in the MVP. The interview guide listens for it.

## Forces, hypothesized

| Pull toward a catalogue | Push away |
| --- | --- |
| A trip next week with a too-heavy bag | The chore of photographing a closet |
| Repeating the same three outfits and feeling bored of them | Fear that photos are analyzed or shared |
| Wanting a list that matches the outfits | An app that then tries to sell clothes |
| Curiosity about an explained combination | A suggestion that scolds recent repeats without letting them override it |

The product leans into the pulls it can honestly serve, and removes the pushes it can: no scan, no shop, dismiss is allowed, manual entry is always there. It cannot remove the chore of the first five items. That is why the sample wardrobe exists, and why the usability test times the real add.
