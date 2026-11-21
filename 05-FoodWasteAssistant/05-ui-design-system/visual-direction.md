# Visual direction

## Mood

A warm paper notebook on a kitchen table. Forest green is the action color. Citrus and clay are status colors, always with a label. The display face is Georgia, the text face is Segoe UI. Nothing looks like a delivery app or a medical device.

## Why this and not a neutral dashboard

The job happens next to food, often on a phone, often in a hurry. A cold analytics skin would make the date labels feel like a compliance tool. Paper and a serif title keep the UVP readable as a sentence. Green is reserved for the primary action so it is not also the color of “fresh” or “safe.” Status never uses that green.

## Color roles

| Role | Token | Use |
| --- | --- | --- |
| Ink | `--ink` `#1c2822` | Body text |
| Soft ink | `--ink-soft` `#24312a` | Secondary text |
| Paper | `--paper` `#f4efe6` | Page background |
| Surface | `--surface` `#fffcf7` | Cards, sheets, inputs |
| Line | `--line` `#d9d0c3` | Borders |
| Action | `--leaf` `#215c40` on `--leaf-ink` `#f7fbf8` | Primary buttons |
| Deep leaf | `--leaf-deep` `#173f2c` | Links on paper |
| Use soon | `--citrus-ink` `#6b3208` on `--citrus-bg` `#f8e7d4` | Use soon chip |
| Date passed | `--clay-ink` `#6e2b26` on `--clay-bg` `#f8e6e2` | Date passed chip |
| Focus | `--focus` `#0b5cab` | Focus ring |

Opened and No date use the neutral surface and a text label. They do not borrow the clay color. Clay is only Date passed, so “needs a look” is not visually the same as “the printed date is past.”

## Type

| Use | Face | Size |
| --- | --- | --- |
| Titles | Georgia, Iowan Old Style, Palatino, serif | `clamp(1.7rem, 7vw, 2.15rem)` for h1 |
| Section | Same serif | 1.25rem |
| UI and body | Segoe UI, Helvetica Neue, sans-serif | 1rem, line-height 1.45 |
| Quiet | Same sans | 0.95rem |

System fonts only. No webfont download. The h1 wraps, because the UVP is a full sentence.

## Layout

- Mobile first. Content column max 760px, 20px padding, 96px bottom padding so the bar does not cover the last action.
- At 960px the shell becomes a 232px side column plus the workspace. The bottom bar hides. Workspace padding becomes 32px 40px.
- Radius 14px on cards. Shadow is a hairline plus a soft lift, enough to separate a card from paper, not enough to look like a marketing tile.
- Touch targets at least 44px on buttons, inputs, and choices.

## Brand mark

A broken ring in leaf green: a loop that is not closed. It is decorative and `aria-hidden`. The word FreshLoop is the accessible name.

## Sample and status banners

Fictional data uses a normal card, not a festive badge. Offline and diet warnings use the clay banner so they are not mistaken for a primary action.

## Motion

Almost none. `prefers-reduced-motion: reduce` removes transitions. The product does not animate food or celebrate a cooked meal.
