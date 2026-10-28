# Design tokens

Calculated on 22 October 2026 with the WCAG 2 relative-luminance formula. Ratios are for the stated pair. The implementation lives in `app/styles.css` as custom properties.

## Color

| Token | Hex | Role | Contrast checked |
| --- | --- | --- | --- |
| paper | `#F4F0E6` | Page | — |
| paper-raised | `#FFFCF7` | Cards, dialogs | — |
| ink | `#14202B` | Headings and body | 14.52 on paper, 16.14 on raised |
| soft | `#3A4654` | Secondary text | 8.45 on paper |
| meta | `#4E5B6A` | Hints | 6.09 on paper, 6.78 on raised |
| line | `#D5CDBF` | Borders | Decorative, not text |
| teal | `#0C5C4E` | Primary button fill | White text 7.91 |
| teal-deep | `#08483D` | Secondary button text, pressed emphasis | 10.24 on raised |
| confirmed-bg | `#E5F4EF` | Match and confirmed chip | Teal text `#0C5C4E` is 6.97 |
| community | `#6E4500` | Community text | 7.58 on `#FFF3D8` |
| community-bg | `#FFF3D8` | Community chip | — |
| unknown | `#243140` | Unknown text | 11.21 on `#E7EDF3` |
| unknown-bg | `#E7EDF3` | Unknown chip and sample banner | — |
| barrier | `#7E2424` | Conflict text and destructive button | 8.16 on `#F8E8E6`. White on the button is 9.70 |
| barrier-bg | `#F8E8E6` | Conflict chip | — |
| focus | `#0A4F86` | Focus ring and text buttons | 7.45 on paper. White on this blue is 8.48 |
| disabled-bg | `#E7E2D8` | Disabled primary button | `#243140` text is 10.24 |

An earlier disabled pair, `#4E5B6A` on `#C8C1B5`, was 3.88 and was replaced.

## Typography

| Token | Value |
| --- | --- |
| font-display | Fraunces, Georgia, serif |
| font-ui | Atkinson Hyperlegible, Segoe UI, sans-serif |
| size-body | 100% of the user default |
| size-h1 | 2.15rem |
| size-h2 | 1.45rem |
| size-h3 | 1.2rem |
| line-height | 1.5 for UI, 1.15 for headings |
| text-scale | 100, 125, 150 via `html[data-text-scale]` |

## Space, radius, elevation

| Token | Value |
| --- | --- |
| space | 1rem base. Gaps use 0.45rem, 0.75rem, 0.9rem |
| radius | 16px cards, 999px buttons and chips, 10px fields |
| shadow | `0 1px 0 rgb(20 32 43 / 4%), 0 16px 40px rgb(20 32 43 / 6%)` |
| focus | 3px solid focus color, 3px offset |
| target | min-height 44px on buttons, selects, and checks |

## Icons

Inline SVG, `currentColor`, `aria-hidden` because a text label is always next to them. No icon font.

## Breakpoints

| Name | Width | Behavior |
| --- | --- | --- |
| narrow | under 960px | One column. List mode hides the schematic. |
| wide | 960px and up | Comparison is two columns. Schematic stays available. |

## Motion

No decorative motion. The comparison wait is 500ms and is removed under `prefers-reduced-motion`. `prefers-contrast: more` thickens borders.
