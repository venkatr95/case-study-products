# Visual direction

**Name:** Field notebook
**Date:** 22 October 2026

## Rationale

The audience is deciding what to do next with work they already know how to do. The interface should feel like a notebook a coordinator would keep, not like an applicant-tracking dashboard and not like a motivational poster.

A serif headline (Fraunces) carries the UVP and the screen titles. Body text is Atkinson Hyperlegible, chosen because the product is a reading experience: definitions, whys, and limits. The page color is warm paper (`#f3eee4`) with an off-white card (`#fffcf8`). One green (`#0c5c46`) marks the action and the matched state. It is the color of a check in a ledger, not a success celebration.

## What this direction refuses

- Dark theme. Not designed. Forced-colors mode is the high-contrast path.
- Gauges, rings, and big numerals that read as a grade.
- Red rows for skills the person has not listed.
- Stock photography of handshakes or graduates.
- A second accent that means "you are behind."

## Layout

- Content width: `min(1080px, 100% - 32px)`.
- Reading column on welcome, forms, and settings: 720px.
- Role cards wrap with `minmax(260px, 1fr)`.
- Below 720px the header stacks and the card grid becomes one column.
- Page padding below the header is 32px, with 72px at the bottom so the last action is not on the edge.

## Elevation

Cards use a 1px line (`#d9d0c3`) and a soft shadow: `0 1px 0 rgba(27, 25, 20, 0.04), 0 16px 40px rgba(27, 25, 20, 0.06)`. Dialogs use the same card. Nothing else floats.

## Icon rule

Almost none. The brand mark is a small tilted ring in the header, decorative, with the word SkillBridge beside it. Status is a text chip. Do not add icon-only buttons. If an icon is added later, it needs a visible text label.

## Motion

The stylesheet sets a short default. `prefers-reduced-motion: reduce` removes smooth scrolling and shortens transitions. Status changes do not depend on animation. The toast remains in the live region.

## Sample and fiction

When the profile is Maya's, the header can show her name and Settings says the profile started as a fictional sample. The visual does not get a special "demo watermark" banner across every control. The sentence is enough.

## Relationship to the wireframes

Wireframes are grayscale structure. This direction is what the prototype CSS implements. Do not treat the SVG phone frames as the final visual.
