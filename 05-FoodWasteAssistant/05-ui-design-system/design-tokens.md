# Design tokens

Source of truth: `prototype/styles.css` custom properties. The prototype does not generate a second token file. If a value changes, change the CSS and the contrast test together.

## Color

| Token | Value | Semantic role |
| --- | --- | --- |
| `--ink` | `#1c2822` | Primary text |
| `--ink-soft` | `#24312a` | Secondary text |
| `--paper` | `#f4efe6` | App background |
| `--surface` | `#fffcf7` | Cards, dialogs, inputs |
| `--line` | `#d9d0c3` | Borders |
| `--leaf` | `#215c40` | Primary button fill |
| `--leaf-ink` | `#f7fbf8` | Text on primary button |
| `--leaf-deep` | `#173f2c` | Link text on light surfaces |
| `--citrus-ink` | `#6b3208` | Use soon text |
| `--citrus-bg` | `#f8e7d4` | Use soon chip background |
| `--clay-ink` | `#6e2b26` | Date passed text, danger text |
| `--clay-bg` | `#f8e6e2` | Date passed chip, warning banner |
| `--mist` | `#e7eee8` | Neutral chip and selected row |
| `--focus` | `#0b5cab` | Focus outline |
| `--danger` | `#6e2b26` | Destructive actions, same hue as clay so danger is not a new idea |
| `--shadow` | `0 1px 0 rgba(28, 40, 34, 0.05), 0 10px 28px rgba(28, 40, 34, 0.06)` | Card elevation |

Side navigation at 960px uses `--ink` as its background and `#2d4036` for the current item. Current-item text is `--paper`. Focus on those links uses a paper-colored outline because the blue ring is for light surfaces.

## Typography

| Token | Value |
| --- | --- |
| `--font` | `"Segoe UI", "Helvetica Neue", sans-serif` |
| `--display` | `Georgia, "Iowan Old Style", Palatino, serif` |

Weights: 600 for display headings, 650 for labels, 700 for the current nav item. Body stays regular.

## Space, radius, elevation

| Token | Value | Use |
| --- | --- | --- |
| `--radius` | `14px` | Cards, dialogs, banners |
| Control radius | `10px` | Buttons and inputs |
| Page padding | `20px` mobile, `32px 40px` from 960px | Workspace |
| Stack gap | `8px` and `12px` | Actions, form rows |
| Nav height | min `48px` | Bottom and side links |
| Control height | min `44px` | Buttons, inputs, choices |

## Icons

No icon font. The brand mark is a CSS ring. Status is a text chip. Nav labels are words: Pantry, Cook, Shop, Plan. Do not replace those words with pictograms in the MVP. A pictogram would need a text alternative and would not be clearer.

## Breakpoints

| Width | Behavior |
| --- | --- |
| Under 960px | Bottom nav, single column |
| 960px and up | Side nav, bottom nav hidden, wider workspace |

## Contrast pairs asserted in tests

The test requires at least 4.5:1 for:

- `#1c2822` on `#fffcf7`
- `#1c2822` on `#f4efe6`
- `#24312a` on `#fffcf7`
- `#f7fbf8` on `#215c40`
- `#6b3208` on `#f8e7d4`
- `#6e2b26` on `#f8e6e2`
- `#f4efe6` on `#1c2822`
- `#173f2c` on `#fffcf7`

Focus `#0b5cab` on `#f4efe6` is asserted at least 3:1, as a non-text UI boundary. The test does not compute a rounded ratio in the docs. Re-run `npm test` after any color change.
