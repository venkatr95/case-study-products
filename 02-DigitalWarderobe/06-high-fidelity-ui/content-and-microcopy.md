# Content and microcopy — Rewear

## Principles

- Name the object and the result. “Outfit saved.” “Photo deleted.”
- Say what will change before a destructive confirm.
- Do not flatter, scold, or sell.
- “Dressiness,” “weather preference,” and “item” are the public words.
- If a number cannot be computed honestly, say what is missing.

## Voice examples

| Do | Don't |
| --- | --- |
| Create more outfits from clothes you already own. | Unlock your style journey. |
| The photo could not be saved. You can try again, or save the item without a photo. | Upload failed. Try again later. |
| Wear it once to start cost per wear. | Infinite cost per wear. |
| Shared pieces are listed once. | We optimized your suitcase. |
| Weather is a preference you choose. Rewear does not use your location. | Enable location for better outfits. |
| Dressiness is only used to match an occasion. It is not a rule about you. | How formal are you? |
| Suggestion dismissed. | Not your vibe. We'll learn. |

## Strings that must not drift

They are implemented in `prototype/src/ui/render.ts` and covered by render tests where noted.

- Look through a sample wardrobe
- Start with an empty wardrobe
- Your wardrobe is empty.
- No items match these filters.
- Save item
- Save outfit
- Show suggestions
- Why this was suggested
- Select at least two items, or a single dress.
- Build packing list
- Shared pieces are listed once.
- Mark worn today / Log another wear
- Delete this item?
- Currency symbol updated. Amounts are not converted.
- You're offline. Your wardrobe is saved on this device and still works.

## Suggestion factors

Written by `suggest.ts` as full sentences. They include:

- Which dressiness tags were allowed, and the occasion.
- Which seasons the weather preference allowed, or, for rain, that season was not used because rain is a layer.
- Whether an outer layer was included, or that none matched.
- A color sentence: neutrals, one statement color, or two statement colors.
- A boost when an item has no wears, and a rank note when an item was worn in the last three days.

Do not rewrite these into “perfect for you.”

## Empty, error, success

| Situation | Copy |
| --- | --- |
| No outfits | No outfits saved yet. Build one from your items, or ask for a suggestion that explains why it matches. |
| No trips | No trips yet. A packing list is built from outfits you have already saved. |
| No outfits when starting a trip | Create an outfit first. |
| Item saved | Item saved to your wardrobe. |
| Item updated | Item updated. Saved outfits use this version. |
| Item deleted | “[Name] deleted. Removed from N outfits.” |
| Outfit saved | Outfit saved. |
| Packing ready | Packing list ready. Shared items are listed once. |
| Storage failure | This browser could not save the latest change. It may disappear if you refresh. |

## Banned in product UI

Guilt, flattering, slay, unlock, curated just for you, eco score, carbon, you should buy, body type, hourglass, and any count of “impact.”
