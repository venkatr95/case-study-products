# Screen inventory — Rewear

**Visual frames:** `assets/wireframes/wireframes.html`. Open it in a browser. Frames are 390 × 844 CSS pixels, grayscale, mobile. Annotations sit beside each phone. They are the low-fidelity visuals. They are not a Figma file. No Figma file was created.

**High-fidelity behavior:** the TypeScript prototype in `prototype/`. The wireframes and the prototype use the same nouns and the same primary actions.

| ID | Screen | Prototype route | User goal | PRD |
| --- | --- | --- | --- | --- |
| W-01 | Welcome | `#/welcome` | Choose a sample wardrobe or an empty one, and see how photos are treated | Setup risk |
| W-02 | Wardrobe | `#/wardrobe` | See items and start a search or an add | FR-01, FR-03 |
| W-03 | Empty wardrobe | `#/wardrobe` with no items | Know the next step | Empty state |
| W-04 | Filters | Dialog on the wardrobe | Set color, season, archived, and clear them | FR-03 |
| W-05 | Add or edit item | `#/items/new`, `#/items/:id/edit` | Save tags, photo optional | FR-01, FR-02 |
| W-06 | Photo failure | Same form, error state | Continue without a photo | FR-01, NFR |
| W-07 | Item detail | `#/items/:id` | Read tags, wears, cost, outfits; edit or remove | FR-02 |
| W-08 | Outfit builder | `#/outfits/new` | Select owned items for an occasion | FR-04, FR-05 |
| W-09 | Suggestions | `#/suggest` | Read why a combination matched; save or dismiss | FR-07 |
| W-10 | Saved outfits | `#/outfits` | Reopen an outfit | FR-04 |
| W-11 | Outfit detail | `#/outfits/:id` | Confirm occasion, items, and reasons | FR-04, FR-05, FR-07 |
| W-12 | New trip | `#/trips/new` | Pick outfits and a duration | FR-06 |
| W-13 | Packing list | `#/trips/:id` | See each item once and check it off | FR-06 |
| W-14 | Settings | `#/settings` | Text size, privacy, deletion | NFR, a11y |
| W-15 | Delete item | Dialog | Confirm, knowing which outfits change | FR-02 |
| W-16 | Offline | Banner on any screen | Trust that local data still works | NFR |

## Responsive intent

- **Below 720px:** one column, bottom navigation, dialogs as a bottom sheet.
- **720–959px:** the same screens in a centered column, three wardrobe columns, dialogs centered.
- **960px and up:** left navigation, four-column wardrobe. This is a review layout, not a separate desktop product.

Wireframes draw the small-screen hierarchy. The prototype implements the wider grids.

## What the frames include

Realistic names from the sample wardrobe, real button labels, and the error sentence for a failed photo. They do not include a body, a face, or a fashion photograph. Garments are blank rectangles with a category word, which is the correct low-fidelity choice. The prototype replaces those rectangles with flat illustrations or the person’s photo.
