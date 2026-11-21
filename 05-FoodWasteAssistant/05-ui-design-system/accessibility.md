# Accessibility

Target: WCAG 2.2 AA for the prototype’s web UI. This is an intent plus the checks below. It is not a completed audit and not a certification.

## What the prototype does

- Skip link as the first focusable control. It becomes visible on focus.
- One `h1` per screen. The welcome `h1` is the UVP.
- Nav has `aria-label="Primary"`. Current page uses `aria-current="page"` and a weight plus an inset bar.
- Form fields have visible labels. Errors set `aria-invalid` and `aria-describedby`.
- Dialogs are modal, labeled, and focused. Escape closes them.
- Status text is in the chip. Color is redundant.
- Contrast pairs in `design-tokens.md` are asserted in `prototype/test/logic.test.ts`.
- Focus visible is a 3px outline, offset 2px, color `#0b5cab` on light surfaces and paper-colored on the dark side nav.
- Touch and click targets for controls are at least 44px. Body text can scale with the browser; the layout uses normal flow rather than fixed text heights.
- `prefers-reduced-motion: reduce` disables transitions.
- Buttons are `button` or links with hrefs. The hash router updates the location.
- Decorative brand mark is `aria-hidden`.
- The diet limitation and the date limitation are text on the relevant screens, not only in a tooltip.

## What has not been verified

- A pass with NVDA, VoiceOver, or TalkBack.
- 200% zoom on every route.
- Forced-colors / Windows high contrast.
- Screen reader announcement of the toast and the live count. The cook result uses `role="status"` for the “Showing N recipes” line. Other toasts are visual plus text in the DOM. A session should check whether that is enough.

## Content rules that are accessibility rules

- Do not use “expired” as a status. Date passed is specific and does not smuggle a safety verdict.
- Do not encode Have versus Check by color alone.
- Do not put the only copy of a limitation in placeholder text.

## Known gaps

- The main region is focused on later route changes. The first paint leaves focus at the top of the document so the skip link still works.
- Batch checkboxes include a visually hidden name. The visible row is also a link. A screen-reader user should hear both. That pairing needs a session.
- Date input format follows the browser locale. The open question about regional date labels is also an accessibility question: the visible words best-before and use-by must match what the person thinks those words mean.

## Check before a public pilot

1. Re-run the contrast test after any CSS change.
2. Complete one keyboard-only pass of welcome, add, duplicate, recipe, review, cooked, settings, recovery.
3. Complete one screen-reader pass of the same path.
4. Confirm focus is not trapped when a dialog closes.
