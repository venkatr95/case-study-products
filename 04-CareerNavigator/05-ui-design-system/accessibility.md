# Accessibility

**Target:** WCAG 2.2 AA for the prototype's web UI, as an intent and a partial check. Not a certification. Not a screen-reader user audit.
**Date:** 22 October 2026

## What was designed in

| Need | Implementation |
| --- | --- |
| Keyboard | Skip link to content. Controls are buttons and links. No click-only divs. |
| Focus | `:focus-visible` outline in `#0b4f9c`. Skip link becomes visible on focus. |
| Names | Fields have labels. Filter and status buttons have visible text. Proficiency selects on the review screen have `aria-label`s that include the skill name. |
| Not color alone | Chips include the words Matched, Partial, Not in your list. Action status is a word. `aria-pressed` exposes the selected filter and status. |
| Contrast | Pairs in `design-tokens.md` are unit-tested against the stated minimums. |
| Resize and reflow | Body is 17px. Headings use clamp. Layout wraps at 720px. Text is not in images. |
| Live region | `#live` is polite. Form errors and status toasts write there. |
| Dialog | Confirmations are in the page with an explicit cancel. They are not `window.confirm`. |
| Target size | Header links, nav, and buttons use a 44px minimum height. |
| Motion | `prefers-reduced-motion: reduce` cuts smooth scroll and transitions. |
| Forced colors | `forced-colors: active` drops the decorative shadow and uses system colors. |
| Language | `html lang="en"`. |
| Paste privacy | The warning is text, early on the paste screen. |

## Comparison is not a graphic

The PRD asks for accessible data visualizations if a visualization exists. The comparison is sentences and a list. The only bar is the progress meter, which repeats a fraction that is also a sentence. A screen-reader user gets the sentence.

## Known gaps

- No test with VoiceOver, NVDA, or TalkBack. Heading order and dialog focus were reviewed in code, not with a screen reader.
- Escape closes a dialog. Tab cycles when focus is already on the first or last control inside `.dialog`, and the cancel button takes focus when the dialog opens. The rest of the page is not `inert`. A pointer click outside the dialog can move focus into the page behind it. That is a remaining gap, not a missing keyboard path for the confirm and cancel buttons.
- The brand mark is decorative and unlabeled. The name SkillBridge is text beside it.
- Google Fonts is a third-party request. The fallbacks work if it is blocked. A production build should self-host the fonts.
- Contrast of placeholder-quality borders and of disabled buttons was not in the token pair list. Disabled controls are not the only way to read an error.
- Zoom at 400% was not manually measured in a browser for this pass. The layout is a single wrapping column, which is the intended reflow.

## Checks that did run

`npm test` includes contrast-ratio assertions for the pairs above, and the happy-dom journey checks that the comparison has no percentage. Those tests do not prove WCAG conformance.

## Content rules that support access

- "Not in your list" instead of a red X.
- Definitions on the comparison, not only in a legend.
- Errors say what to do ("Choose a skill.") rather than "Invalid."
- The unreadable-data screen is text, with one action.
