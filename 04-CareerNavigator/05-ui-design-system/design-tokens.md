# Design tokens

**Source of truth in code:** `app/src/tokens.ts` and `app/src/styles.css`. They are kept in sync by review. Contrast pairs in `tokens.ts` are checked by unit tests.
**Date:** 22 October 2026

## Color

| Token | Hex | Role |
| --- | --- | --- |
| ink | `#1b1914` | Primary text |
| ink-soft | `#4e463c` | Secondary text, hints |
| paper | `#f3eee4` | Page background |
| paper-2 | `#e7dfd2` | Quiet fills. CSS only. |
| card | `#fffcf8` | Cards, header, fields |
| line | `#d9d0c3` | Borders |
| teal | `#0c5c46` | Primary button, links, matched text, current nav |
| teal-ink | `#f4fbf8` | Text on teal |
| teal-soft | `#e5f3ee` | Matched chip background, current nav background |
| amber | `#6b4308` | Partial text |
| amber-soft | `#f8ecd4` | Partial chip background |
| slate | `#243140` | "Not in your list" text |
| slate-soft | `#e7edf2` | Missing chip background |
| danger | `#8c2f2f` | Destructive button |
| danger-ink | `#fff8f7` | Text on danger |
| danger-soft | `#f8e8e6` | Destructive zone fill. CSS only. |
| focus | `#0b4f9c` | Focus ring |

There is no token for a score, a rank, or a "poor match."

## Contrast pairs under test

The test requires these minimums. It does not print the measured ratio in the docs.

| Pair | Minimum |
| --- | --- |
| Ink on paper, ink on card | 7:1 |
| Ink-soft on paper, ink-soft on card | 4.5:1 |
| Teal-ink on teal | 4.5:1 |
| Teal on card, teal on teal-soft | 4.5:1 |
| Amber on amber-soft | 4.5:1 |
| Slate on slate-soft | 4.5:1 |
| Danger-ink on danger | 4.5:1 |
| Focus blue on card | 4.5:1 |

Line `#d9d0c3` on paper is a border, not a text pair. Do not set body text in the line color.

## Type

| Style | Family | Size | Notes |
| --- | --- | --- | --- |
| Body | Atkinson Hyperlegible, Segoe UI | 17px | Line height 1.5 |
| H1 | Fraunces, Palatino | clamp(2rem, 4vw, 3.1rem) | Weight 560, line height 1.2 |
| H2 | Fraunces | 1.45rem | |
| H3 | Fraunces | 1.15rem | |
| Lede | Body | 1.15rem | Max about 68ch |
| Kicker | Body | 0.78rem | Uppercase, 0.08em tracking, teal |
| Hint | Body | 0.95rem | Ink-soft |

Fonts load from Google Fonts in `index.html`. Offline, the stacks fall back to Palatino and Segoe UI. That fallback is a different look and still readable. It was not contrast-tested as a separate theme.

## Space, radius, grid

- Base space: 8px. Card padding is 16px by 18px. Header padding is 14px by 20px.
- Radius: 14px on cards. Pills use a full round.
- Grid: role cards `repeat(auto-fit, minmax(260px, 1fr))`, gap 12px.
- Breakpoint: 720px. Below it, navigation wraps and multi-column clusters stack.
- Page measure: 1080px maximum, 32px gutter.

## Elevation

`--shadow: 0 1px 0 rgba(27, 25, 20, 0.04), 0 16px 40px rgba(27, 25, 20, 0.06)` on cards and the dialog.

## Theme

Paper only. `forced-colors: active` lets the system replace these colors. Do not add a dark theme without a new contrast set.
