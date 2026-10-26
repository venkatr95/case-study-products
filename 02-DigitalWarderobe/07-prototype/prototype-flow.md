# Prototype flow — Rewear

**Runnable app:** `prototype/`. There is no Figma prototype. Do not describe this as a clickable Figma file.

## What a three-minute demo covers

1. Open the app. Read the UVP.
2. Look through the sample wardrobe. Point at the banner so it is obvious the clothes are not a real person’s.
3. Search “navy” or filter to Tops.
4. Open Suggestions, Work and Cold. Read one factor list. Save or dismiss.
5. Or build Office day by hand from the merino, the trousers, and the loafers.
6. Create a trip, add a second outfit that shares the loafers, and show one packing row: “In 2 outfits.”
7. Open Settings and read that photos are not uploaded and location is not collected.

That sequence is the UVP: outfits from a wardrobe you can see, a reason, and a list that does not double-count.

## Setup

```text
cd prototype
npm install
npm run dev
```

Dev server: `http://localhost:5174/`.

```text
npm test
npm run build
npm run preview
```

Preview uses port 4174. Tests are Vitest. The build is a static Vite bundle.

## Demo data

“Look through a sample wardrobe” loads 12 items and no outfits. Prices are illustrative GBP. Wear dates are in the past so “recently worn” does not fire on the day of the review. The cream scarf has a price and zero wears, so cost per wear withholds the number. The olive chore jacket has wears and no price, so the other withhold is visible.

## Primary path map

Welcome → Wardrobe → Suggestions or New outfit → Outfit detail → New trip → Packing list.

Add item is the alternate start from the empty wardrobe, and the path a usability test must time.

## Known limitations

Listed in `prototype-review.md`. The short version: one browser, no accounts, no image recognition, no live weather, no screen-reader study yet.
