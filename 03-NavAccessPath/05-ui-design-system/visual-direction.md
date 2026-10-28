# Visual direction

## Intent

AccessPath should feel like a careful printed guide: warm paper, a serif headline, and a highly legible body. It should not feel like a hospital, a sports tracker, or a default maps skin.

The two-path mark, one solid and one dashed, is the logo and the map legend at the same time.

## Type

- **Fraunces** for the wordmark and headings. Optical size is left to the browser. Weight 560–650. It is expressive enough to be remembered and still serious.
- **Atkinson Hyperlegible** for UI text, chosen because it was designed for legibility at small sizes. If the fonts do not load, the fallbacks are Georgia and Segoe UI.
- Body size follows the browser default, with an in-product step to 125% and 150%.

Fonts are loaded from Google Fonts in the prototype. Offline, the fallbacks still hold the hierarchy.

## Color idea

Paper `#F4F0E6`, ink `#14202B`, action green `#0C5C4E`. Evidence tints are pale: green for confirmed, sand for community, blue-gray for unknown, and a clay red for conflicts. The tints carry text that has been contrast-checked. They are not the only encoding.

## Shape

- Confirmed: filled circle.
- Community-reported: diamond.
- Unknown: dashed square.
- Match: circle and check.
- Unknown route: dashed circle.
- Conflict: triangle.

Route cards repeat the idea in the left border: solid, dashed, or double.

## Elevation

Cards sit on paper with a 1px line and a soft shadow. Dialogs use the same surface plus a dimmed page. No glass, no blur.

## Photography and illustration

None in the MVP. Street photography would imply a real survey. The schematic is deliberately abstract.

## Responsive

The page is a single column until 960px, then the comparison becomes two columns. Touch targets stay at least 44px at the default font size. At 150% text, controls grow with the font rather than clipping.
