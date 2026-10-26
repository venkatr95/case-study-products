# Accessibility — Rewear

**Target:** WCAG 2.2 AA for the web prototype. **Status:** designed and implemented against that target. Not certified. Not tested with a screen reader, a switch, or a participant with low vision. The contrast pairs in `design-tokens.md` were calculated and locked with a unit test.

## What the prototype does

- Skip link to main content.
- One h1 per screen. The h1 receives focus on navigation and is in the tab order via `tabindex="-1"`.
- Visible focus, 3px, not only a color shift.
- Buttons and links have names. Icons are hidden from assistive tech.
- Form fields have labels. Hints are in the label. Errors use `role="alert"`.
- Filter chips expose pressed state.
- Match counts update a polite live region.
- Toasts use `role="status"`.
- Dialogs are modal, labelled, focus-trapped, and dismissible with Escape and Cancel.
- Text can be set to 120% and 140%, and the layout is rem-based. Browser zoom still applies.
- Color filters include the color name. Garment color is never the only way to identify an item.
- Touch targets are at least 44px for buttons, chips, nav, and choice rows.
- `prefers-reduced-motion` is respected. There is little motion anyway.
- The offline banner and sample banner are text, not color alone.
- Photos that exist have alt text of the item name on the detail screen. Grid images are decorative because the link text includes the name.

## Known gaps

- The live region announces filter counts on each keystroke in search. That can be noisy. A debounce is a likely usability fix after a screen-reader pass.
- Dialog focus return to the invoking control is not implemented. Focus goes to the title or the dialog action. **To fix** before calling the UI certified.
- Packing checkboxes are labelled. The category heading is visual structure. A screen-reader test should confirm the group is understandable.
- Third-party fonts (Fraunces, Figtree) can fail offline on first load. Fallbacks are Georgia and Segoe UI. The product still has to be readable in the fallback, and the CSS does not depend on the webfont for layout.
- No high-contrast theme beyond the AA pairs. Windows forced-colors was not tested.
- Reviewer tools inside the photo field are a `<details>` disclosure. They should stay collapsed in a usability session so they are not mistaken for the product.

## Content accessibility

- Dressiness is defined in one sentence so it is not a judgment.
- Cost is a full sentence, including when the number is withheld.
- Delete dialogs name the consequence.
- The UVP and empty states are plain language. Reading age was not formally scored.

## Privacy as an access issue

People who do not want a camera still have a complete path. That is an access decision as much as a privacy one.
