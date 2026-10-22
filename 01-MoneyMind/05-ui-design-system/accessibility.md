# Accessibility

Target for this web prototype: **WCAG 2.2 AA** for the screens that exist. This is a design and implementation target, not a formal audit and not a conformance certificate.

## What was built to that target

- HTML language is English. The page has one h1. Home’s visible title is the safe-to-spend heading; an h1 “Your next 30 days” is provided for the page.
- Skip link points at `main`, which is focused on navigation.
- Buttons and links are native. The primary navigation is a `nav` with a label.
- Focus is visible with a 3px teal outline on `:focus-visible`.
- Dialogs are modal, labelled, and trap Tab. Escape dismisses. The first control is Cancel on destructive confirms.
- Form fields have visible labels, help text, `aria-invalid`, and errors in `role="alert"`.
- The chart has an accessible name that includes the lowest amount and date. A data table repeats every day.
- The lowest day has a text marker. Amount signs are characters, not color alone.
- Status banners use text. Sample, stale, and shortfall are not distinguished only by color.
- Contrast for the token pairs in `design-tokens.md` was calculated and clears 4.5:1 for text.
- Touch targets for buttons, nav items, and fields are at least 44px tall.
- Text can scale with the browser. Titles use `clamp` but body text uses rem.
- `prefers-reduced-motion: reduce` disables transitions.
- Nothing required is hover-only.
- The live region announces saves, deletes, and blocked fields.

## Known limits

- Not tested with VoiceOver, NVDA, or a keyboard-only participant. The smoke script used headless Chrome and did not prove screen-reader order.
- Date inputs rely on the browser’s native control. Quality varies.
- The webfont is optional. Fallback metrics differ, so line wrapping will not match screenshots exactly when the font is blocked.
- Light theme only. Forcing a dark user preference into this palette was rejected rather than shipping an unchecked dark theme.
- Color contrast of placeholder text does not arise much because fields use real values or labels outside the field. Empty inputs do not use placeholder-only instructions.
- Zoom at 400% was not manually verified in this pass. Layout is a single column on a narrow viewport, which is the intended reflow, but that is not a completed 1.4.10 test.
- The prototype does not offer a session timeout, and it should not: there is no account. If a production login is added later, timeout warnings become required.

## Content accessibility

- Reading level is plain but not childish. Terms of art (set-aside, low point, estimate) are explained on the first screen.
- Abbreviations are avoided. “USD — US dollar” spells the currency out in the control.
- The 30-day table is long on purpose. It sits in a disclosure that is open by default so the numbers are in the page, and it can be collapsed.

## Before calling the product accessible

Run the usability plan with at least one participant who uses a screen reader and one who uses only a keyboard, on the primary task. Fix what they hit. Until then, say “designed toward WCAG 2.2 AA,” not “certified.”
