# Accessibility

**Target:** WCAG 2.2 AA for the web prototype, as far as a concept can be checked without an audit.
**Status:** Designed and partly tested. Not certified.

## What the product treats as core

The PRD says accessibility is the product requirement, not a compliance pass at the end. The evidence model is part of that: a route must be understandable without color and without the map.

## Implemented

- Skip link, landmarks (`header`, `nav`, `main`, `aside`), and one `h1` per view.
- Native buttons, radios, checkboxes, selects, and textareas.
- Visible focus, 3px, not only a color change on the control.
- Labels on every field. Status text next to every icon. Chips include the word, not a color alone.
- Schematic has an accessible name that points people to the list. The list is in the page in Map view.
- Text scale 100 / 125 / 150, plus browser zoom. Copy uses rem.
- `aria-live="polite"` on view changes and text-size changes.
- Dialogs are modal, labelled, dismissed with Escape, and trap Tab.
- List/Map uses tabs. Arrow keys move between them.
- `aria-pressed` on Mark and Highlight segment.
- `aria-invalid` and an error summary on the report form.
- User text is escaped.
- `prefers-reduced-motion` removes the comparison delay and CSS animation.
- `prefers-contrast: more` thickens borders.
- Contrast pairs in `design-tokens.md` meet 4.5:1 for the text sizes used. The disabled button was corrected after a 3.88:1 pair failed.

## Not yet done

- A pass with NVDA, JAWS, or VoiceOver. Semantics were written for them and not listened to.
- A 200% zoom pass recorded screen by screen. The layout is fluid. It was not measured at 200% in this session.
- A formal WCAG audit, including target size at 150% text on a 320px-wide screen.
- Captions or audio. The product has no audio.
- Language other than English.

## Keyboard path for the core task

1. Skip to content.
2. Tab to Set access preferences. Activate.
3. Arrow between presets. Tab to Save.
4. Tab through origin, destination, and Compare.
5. On results, tab through cards. Arrow between List and Map if focus is on a tab.
6. Open details, tab to Choose or Report.
7. On the report, tab through fields. Errors are announced in a role of alert.

## Screen reader notes

The status sentence is in the accessibility tree, not only in an SVG. Evidence counts are a sentence. The sample banner is ordinary text, so it is read. Prototype controls are in a named aside so they can be skipped. In shot mode that aside is removed from the layout.

## Cognitive

One task per screen. The same three evidence words are used on routes and entrances. The product does not introduce a score from 0 to 100.
