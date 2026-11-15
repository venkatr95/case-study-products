# Components

**Implemented in:** `app/src/ui/bits.ts`, `app/src/ui/dom.ts`, `app/src/styles.css`
**Date:** 22 October 2026

Build screens from these. Do not invent a one-off control for a single page.

## Page

`page(screenId, className, children)` sets `data-screen` to S-01 through S-16. Narrow pages add the `narrow` class (720px measure).

## Header and nav

Wordmark links home. Five links: Goal, Skills, Comparison, Roadmap, Progress. The current section sets `aria-current="page"`. Settings is outside the tab list. Optional display name sits in the header.

## Button and text link

Variants: primary (teal), ghost (line), danger. Minimum height 44px. Navigation that changes the hash uses either an anchor `#/...` or a button with `data-action="go"` and `data-href`.

## Banner

`limitation()` renders the LIMITATION sentence with the visible word LIMITATION. It is not dismissible. Welcome also has a longer "What this is not" card.

## Chip

Text plus a class: matched (teal), partial (amber), missing (slate), or a plain status word for action state. The label is the accessible name. Color is redundant.

## Choice group

Proficiency and confidence are radio groups with a hint under each label. A selected radio is required before a clean save.

## Field

Label tied with `for`. Hint text under the control. Error paragraph above the actions, also copied to the polite live region on render.

## Filter and status groups

Buttons with `aria-pressed`. Filters: all, core, supporting, matched, partial, missing, extra. Status: Not started, Doing, Done.

## Card and stack

Cards hold a role, a skill, a comparison row, or an action. Stacks are lists, not divs, when the order matters (profile skills, roadmap).

## Empty

Title, body, and one or two actions. Used for no role, no skills, no suggestions, no actions.

## Meter

A bar whose width is done/total, plus the sentence "You marked N of M actions done." The bar is `aria` labeled by that meaning in the surrounding text. It is not a skill score. If total is zero the meter is not shown.

## Dialog

Confirmations: load sample over real work, start fresh, remove skill, remove action, delete all, reset sample, discard paste. Focus moves into the dialog. Confirm and cancel are explicit. Danger confirm uses the danger button.

## Toast

One line in `#live` (`aria-live="polite"`) plus an Undo control when the change was a status. Example: marking Done.

## Resource list

Provider, topic, and a link that opens in a new tab with `rel="noopener noreferrer"`. The note says the link is an example for this prototype, not a complete course and not an endorsement. If the list is empty, the block is omitted.

## Form rehydrate

If validation fails, the render keeps the submitted values so the person does not retype the why, the note, or the action.

## What is not a component

A chart library, a data table, a score ring, a stepper wizard, a cookie banner, and a rich-text editor. Comparison rows are cards. The step kicker ("Step 1 · Goal") is text.
