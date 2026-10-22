# Design tokens

Implemented as custom properties in `app/styles.css`. Contrast ratios were calculated against the paper or the named background on 2026-10-22. Body text needs 4.5:1. The large figure qualifies as large text, and its pairs also clear 4.5:1.

## Color

| Token | Value | Role | Contrast on its background |
| --- | --- | --- | --- |
| `--paper` | `#F3EFE6` | App background | — |
| `--paper-deep` | `#E7E0D2` | Quiet fills | — |
| `--surface` | `#FBFAF6` | Cards, fields, nav | — |
| `--ink` | `#17202B` | Body text | 14.32:1 on paper |
| `--ink-soft` | `#3E4C5E` | Help text | 7.62:1 on paper |
| `--line` | `#D5CBBA` | Rules and borders | Decorative, not text |
| `--teal` | `#0E4F4C` | Actions, links, non-shortfall figure | 8.16:1 on paper |
| `--teal-soft` | `#E4F0EE` | Informational banner | Teal text on this is 8.03:1 |
| `--rust` | `#7A2E2A` | Shortfall text and destructive button | 8.13:1 on paper |
| `--rust-soft` | `#F6E6E2` | Shortfall banner | Rust text 7.70:1 on this |
| `--amber` | `#6A4B16` | Sample and stale text | 6.96:1 on paper, 6.45:1 on `--amber-soft` |
| `--amber-soft` | `#F3E6C8` | Sample and stale banners | — |
| Light text `#FBFAF6` | on teal | Primary button label | 8.97:1 |

Do not place `--ink-soft` on `--amber-soft` without rechecking. Help text inside an amber banner should use `--amber` or `--ink`.

Focus ring: 3px `--teal`, 2px offset, `:focus-visible` only.

## Type

| Use | Family | Size | Weight |
| --- | --- | --- | --- |
| Body | Atkinson Hyperlegible, Segoe UI, sans-serif | 1.0625rem | 400 |
| UI label | Same | 1rem | 700 |
| Screen title | Fraunces, Georgia, serif | clamp(2rem, 4vw, 3.1rem) | 560 |
| Safe-to-spend figure | Fraunces, Georgia, serif | clamp(3rem, 8vw, 4.6rem) | 560 |
| Section title | Body family | 1.35rem | 700 |
| Help | Body family | 0.95rem | 400 |

Line height for body is 1.5. Figures use a tighter line height and `font-variant-numeric: tabular-nums`.

If the Google fonts request fails, the fallbacks still meet the same sizes and the same contrast. The product does not depend on the webfont to be understandable.

## Space, radius, elevation

| Token | Value | Use |
| --- | --- | --- |
| Base step | 8px | Gaps are multiples: 8, 12, 16, 24 |
| Page padding | 1.1rem, 1.25rem | Increases at 880px |
| `--radius` | 14px | Cards |
| Buttons | 999px radius | At least 44px tall |
| Fields | 10px radius | At least 44px tall |
| Shadow | `0 1px 0 rgba(23, 32, 43, 0.04)` | Separation from paper only |

No stacked elevations. Dialogs use a 45% ink scrim instead of a bigger shadow.

## Grid

- Below 880px: one column, bottom navigation height `4.5rem` plus the safe-area inset.
- 880px and up: `15rem` navigation column and a fluid content column, content max `68rem`.
- Reading measure for explanatory paragraphs: about 65 characters via `max-width: 65ch` on the lede.

## Icons

Almost unused. The lowest day uses a text marker. Amounts use a plus or a minus glyph in the text, not color alone. Do not add an icon font for categories.

## Currency

Formatted with `Intl.NumberFormat` for the selected code. Stored as integer cents. The symbol is presentation, not a conversion.
