# Problem analysis — Rewear

**Evidence status:** The problem is a product hypothesis from the PRD. This file separates what the PRD claims, what this case study decided, and what is still unknown. Nothing here is a measured user finding.

## The job, restated

When I am getting dressed or packing, I want to see combinations that already exist in my wardrobe, so I can decide faster and buy less by accident.

“Buy less” is an outcome the person might want. The product does not lecture them into it. The interface helps them see what they own. Whether that changes purchasing is a **metric to validate**, not a promise.

## Where the friction actually sits

Hypothesis, in the order a design should care about it:

1. **Recall.** People forget pieces that are stored out of sight. A grid with name, category, color, and season is a memory aid. A photo helps recognition but is not required for recall if the name and color are specific.
2. **Coordination.** Remembering a single shirt is not the same as seeing a shirt, a bottom, a layer, and shoes that share an occasion. The outfit, not the item, is the decision.
3. **Context.** “What should I wear?” is underspecified. Occasion and a weather preference make the question answerable without pretending the app knows the sky or the calendar.
4. **Packing drift.** Choosing outfits and then packing garment-by-garment produces duplicates and last-minute extras. Consolidating items across chosen outfits is the trip version of the same job.
5. **Setup cost.** If the first outfit requires photographing the whole closet, many people will stop. A sample wardrobe and a manual add form are the mitigation, not a growth trick.

## What this is not

- It is not “people own too much.” Some do, some do not. The copy does not diagnose that.
- It is not “people lack style.” Suggestions are combinations of their tags, not a taste judgment.
- It is not a sustainability score. The PRD forbids impact guarantees. Cost per wear is a personal arithmetic, shown only when price and wears are both provided. A price with zero wears does not display a cost. Dividing by zero would invent a story the data does not support.

## Current alternatives, before any app

These are substitute workflows, not researched frequencies.

| Substitute | What it does well | Where it breaks |
| --- | --- | --- |
| Standing in front of the closet | Immediate, physical, no setup | Hard to remember what is in the wash or in another room. Repeats recent outfits. |
| Laying clothes on the bed | Makes a combination visible | Does not travel. Does not become a packing list. |
| Camera roll of mirror photos | Real outfits, real memory | Hard to search by color or occasion. Mixes clothes with everything else. |
| Notes app list for a trip | Fast text | No link back to which outfit needed the item. Duplicates are easy to type twice. |
| Asking someone else | A second opinion | Depends on another person. Easy to drift into buying advice. |

Rewear has to beat the bed and the camera roll on a small wardrobe, not only beat other apps. If adding five items feels slower than laying out tomorrow’s clothes, the product fails the PRD’s time target even if the UI is polished.

## Consequences if the problem is real

**For the person:** less morning indecision, fewer “I have nothing to wear” moments that are really “I cannot see it,” and a packing list that matches outfits they already accepted.

**For a business, hypothesis only:** a reason to return on outfit days and before trips. The PRD says weekly outfit saves and repeat use are post-launch indicators, not proven. This case study does not invent a revenue model. The prototype has no paywall. A future model would have to avoid selling attention to a shop, because purchase recommendations are a non-goal.

## Consequences of designing the wrong problem

- If the real pain is laundry, not coordination, a wardrobe grid will not help. The research guide asks about the last time getting dressed was annoying, before mentioning an app.
- If the real pain is not knowing whether colors suit them, Rewear’s refusal to do color analysis will feel incomplete. That is an accepted trade against body and identity inference.
- If people will not tag dressiness and season, suggestions will be thin. The manual outfit builder still has to work. Suggestions are Should, not the only path.

## Design implications already taken

- The wardrobe is a grid of the person’s items, with text under every picture, because color alone is a poor label.
- Outfit builder and suggestions sit next to each other. Neither is hidden behind the other.
- Packing starts from outfits, not from a blank checklist.
- Empty states teach the next action: add an item, or open the sample wardrobe.
- Delete and archive say what happens to outfits. Deleting an item removes it from outfits after a confirmation that names those outfits. Archiving hides it from the wardrobe and from new outfits, and leaves it inside outfits already saved.
