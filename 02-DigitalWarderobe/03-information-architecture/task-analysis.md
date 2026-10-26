# Task analysis — save an outfit for a named occasion

This is the highest-value task in the PRD: create an outfit the person can reopen, with the occasion attached.

## Goal

Save an outfit for Work on a Cold day, using only clothes already in the wardrobe, and be able to reopen it and see the occasion.

## Actors and preconditions

- Person who has either loaded the sample wardrobe or added items.
- At least two compatible items, or one dress. For Work + Cold in the sample set, the navy merino, charcoal trousers, brown loafers, and navy overcoat are eligible.
- No account. No network required after the app has loaded.

## Happy path — build by hand

| Step | Action | System response | Requirement |
| --- | --- | --- | --- |
| 1 | Open Outfits, choose New outfit | Builder shows occasion, weather preference, and wardrobe items | FR-04 |
| 2 | Leave name blank or type “Office day” | Name is optional. Blank becomes “Work · Cold” on save | Content rule |
| 3 | Select occasion Work | Dressiness is not filtered in the manual builder. The person can pick anything they own. Suggestions are the filtered path. | FR-05 |
| 4 | Select weather Cold | Stored on the outfit. No location prompt. | FR-05, privacy |
| 5 | Select merino, trousers, loafers | Selected list updates. Remove is on each row. | FR-04 |
| 6 | Save outfit | Detail screen shows the name, Work, Cold, and the live items | FR-04, FR-05 |

**Why manual selection is not auto-filtered by occasion:** a person may know that a casual jacket belongs in a work outfit. The suggestion engine is strict. The builder is not. Forcing the same filter on both would block the override the PRD asks for when it says suggestions can be dismissed and outfits are built from owned items.

## Alternate path — suggestion

| Step | Action | System response | Requirement |
| --- | --- | --- | --- |
| 1 | Open Show suggestions | Occasion and weather default to Work and Cold, which is the demo’s clearest case | FR-07 |
| 2 | Read “Why this was suggested” | Factors name dressiness, season rule, outer layer, and color | FR-07 |
| 3 | Save outfit | Outfit is stored with source suggestion and the same factors | FR-04, FR-07 |
| 4 | Or dismiss | That exact set is not shown again | FR-07 |

## Alternate path — item changes later

| Step | Action | System response | Requirement |
| --- | --- | --- | --- |
| 1 | Rename the merino | Outfit detail shows the new name because it stores the id, not a copy of the name | FR-02 |
| 2 | Delete the merino | Confirm names the outfit. After confirm, the outfit no longer lists it. | FR-02 |
| 3 | Archive the loafers | They remain on the saved outfit and are marked Archived. They disappear from the builder. | Design decision |

## Failure and edge paths

| Condition | Response |
| --- | --- |
| One top and nothing else | Save is blocked. “Select at least two items, or a single dress.” |
| A dress alone | Save is allowed. A dress is treated as a complete anchor. |
| Two bottoms | A note says so. Save is still allowed. |
| No items in the wardrobe | Builder explains that items come first and links to Add item. |
| Suggestion cannot form an anchor | Gap text tells them to add a bottom or a dress, or to clear a skipped color. It does not invent an outfit. |
| All combinations already saved or dismissed | Gap text says so and points at the manual builder. |

## Time and errors we would watch

- Time from New outfit or Show suggestions to the saved confirmation. PRD candidate: median under 3 minutes for the *first* outfit, including setup. This task alone should be much shorter on the sample wardrobe.
- Whether they can say, unprompted, what occasion is on the outfit after they reopen it.
- Whether they think a suggestion is a command. The dismiss button and the factor list are the design’s answer. Untested.

## Cognitive load

The builder asks for two decisions (occasion, weather) and then a selection. Category is visible on each row so they do not rely on the illustration. Illustrations are flat garments, not bodies, including in the sample set where there is no photo.
