# Design tokens — Rewear

Source of truth in code: `prototype/src/tokens.ts`. The same hex values are in `prototype/src/styles.css`. A unit test fails if they drift. Contrast ratios below were computed from those hex values on 22 October 2026 with the WCAG relative-luminance formula. They are not guesses.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| paper | `#F4EFE8` | Page and panel background |
| surface | `#FFFCF8` | Sheets, inputs, navigation |
| ink | `#1C1916` | Text, focus, wordmark |
| muted | `#5C534A` | Secondary text. Not for disabled-only use. |
| line | `#E0D5C8` | Borders, dividers |
| chip | `#F7F1EA` | Chips, banners, image wells |
| accent | `#8C3B16` | Primary button fill |
| accentInk | `#FFFCF8` | Text on accent |
| olive | `#234237` | Reserved for a positive status if one is added. Not a sustainability badge. |
| oliveInk | `#F4EFE8` | Text on olive |
| danger | `#8A2E28` | Destructive button |
| dangerInk | `#FFFCF8` | Text on danger |
| focus | `#1C1916` | Focus outline |

### Contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| Ink on paper | 15.30:1 | Body text |
| Ink on surface | 17.11:1 | Text on sheets |
| Muted on paper | 6.58:1 | Helper text |
| Muted on surface | 7.36:1 | Meta text on cards |
| Accent ink on accent | 7.46:1 | Primary buttons |
| Olive ink on olive | 9.63:1 | If olive is used for text |
| Danger ink on danger | 8.21:1 | Destructive buttons |
| Ink on chip | 15.60:1 | Banner text |

All of these clear WCAG 2.2 AA for normal text (4.5:1). Accent is not used for small text on paper. Links are ink and underlined.

Garment colors are illustrative fills, not UI text colors. Their names are always printed in ink.

## Type

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| Wordmark and h1 | Fraunces | 1.85rem title, 1.45rem wordmark | 560 |
| h2 | Fraunces | 1.25rem | 560 |
| UI, body, buttons | Figtree | 1rem body, 0.92rem fine print | 400 / 650 for names and buttons |
| Tab labels | Figtree | 0.78rem, 1rem on desktop nav | 650 when current |

The 100 / 120 / 140 text-size control sets the root font size. Spacing and type use rem, so the scale is the accessibility control, not a separate layout.

Fallback: Georgia for Fraunces, Segoe UI for Figtree.

## Space, radius, elevation

- Page padding: 20px.
- Stack gap: 8–12px.
- Card radius: 18px. Buttons: pill. Dialog: 20px.
- Grid gap: 12px. Two columns by default, three from 720px, four from 960px.
- Elevation: one shadow on the desktop shell only. Cards are flat on paper so the grid stays quiet.
- Focus: 3px ink outline, 2px offset. Focus is not color-only.

## Icons

Navigation icons are 22px strokes, `currentColor`, with a text label. They are not used without the word Wardrobe, Outfits, Trips, or You.

## Breakpoints

| Width | Behavior |
| --- | --- |
| Under 720px | 480px max column, bottom nav, dialogs as a bottom sheet |
| 720–959px | Centered sheet, 3-column grid, centered dialogs |
| 960px and up | 220px side nav, 4-column grid, max width 1120px |

## Motion

No decorative motion. `prefers-reduced-motion: reduce` disables transitions. The prototype barely animates, which is intentional.
