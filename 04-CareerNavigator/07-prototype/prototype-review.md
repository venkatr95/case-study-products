# Prototype review

**Date:** 22 October 2026
**Build reviewed:** `npm test` (19 passed) and `npm run build` (typecheck and Vite build, exit 0).
**Browser:** System Chrome, headless, driven with puppeteer-core. Served from `vite preview` on `http://127.0.0.1:4184/` because port 4174 was already taken by another local case study. The app's default preview port is still 4174.

## What was exercised

A fresh storage path and Maya's sample path, in the browser:

| Check | Result |
| --- | --- |
| Welcome shows the UVP and the hiring limit | Passed. Screenshot `01-welcome-desktop.png`. Mobile `02-welcome-mobile.png`. |
| Goals and a profile with a source | Passed. `03-goals.png`, `04-role-profile.png`. |
| Empty comparison has no match chips | Passed. The page lists profile skills as contents and says an empty list is not a gap report. `05-empty-comparison.png`. |
| Maya comparison has the 7-skill sentence, the no-score sentence, and no `\d+%` | Passed in the page text during capture. `08-comparison-desktop.png`, `09-comparison-mobile.png`. |
| Gap, roadmap save, action, Done | Passed. First saved action is "Write one stakeholder update." Done is pressed and Undo is on the page. `10` through `14`. |
| Progress, settings, role edit, paste review, not found | Passed. Screens `15` through `19`. |
| Corrupt JSON | Passed after a real reload. `20-unreadable.png` is S-15. A hash-only navigation does not reread storage. |
| Console and page errors during capture | None recorded on the second pass. |

`data-screen` on each capture matched the screen id in `04-wireframes/screen-inventory.md`.

## Bug found in the browser and fixed

The status toast was `position: fixed` at the bottom of the viewport. On the roadmap it covered the second action. It also stayed on screen for eight seconds after a route change, so the import review opened with "Marked Done" on top of a form.

The toast now sits at the top of the content and clears when the hash changes. Status buttons still change and undo the action. Screenshots `12`, `14`, and `18` are from after that fix. Tests were run again: 19 passed, and the production build succeeded.

## What was not verified

- A person using a screen reader. Keyboard behavior was reviewed in code: skip link, labels, `aria-pressed`, dialog Tab cycle, Escape to cancel. The page behind a dialog is not `inert`.
- Zoom at 400% with a ruler. The layout is a wrapping column; that is not a measurement.
- Forced colors and reduced motion in an OS session. The CSS is present.
- Two tabs writing at once.
- A signed-in or hosted deploy. This was local only.
- Figma. There is no Figma file.
- Any participant. Usability findings are empty on purpose.

## Screenshot index

Files in `assets/screenshots/`:

| File | Screen |
| --- | --- |
| `01-welcome-desktop.png` | S-01 at 1280 |
| `02-welcome-mobile.png` | S-01 at 390 |
| `03-goals.png` | S-02 |
| `04-role-profile.png` | S-03 |
| `05-empty-comparison.png` | S-09 with a role and no skills |
| `06-skill-form.png` | S-06 |
| `07-import.png` | S-07 |
| `08-comparison-desktop.png` | S-09, Maya |
| `09-comparison-mobile.png` | S-09, Maya, 390 |
| `10-gap.png` | S-10 |
| `11-roadmap-before-save.png` | S-11 |
| `12-roadmap-saved.png` | S-11 after save |
| `13-action.png` | S-12 |
| `14-action-done.png` | S-12 with Done pressed |
| `15-progress.png` | S-13 |
| `16-settings.png` | S-14 |
| `17-role-edit.png` | S-04 |
| `18-import-review.png` | S-08, practice resume, nothing checked |
| `19-not-found.png` | S-16 |
| `20-unreadable.png` | S-15 |
| `21-skills.png` | S-05, Maya's inventory |

Wireframes are separate files in `assets/wireframes/`. They are grayscale SVGs, not screenshots of this UI.
