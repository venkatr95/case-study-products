# Prototype review

## What works

- A new plan can be created without a bank connection.
- The sample plan shows a low point before the next payday when the dates are generated from “today” with the offsets in `app/src/sample.ts`.
- Safe to spend, the formula, and the later-income list are on a real screen.
- Add, invalid add, edit preview, delete, and one-level undo update the stored plan.
- What-if stays unsaved until Add to plan, and the columns are visually distinct.
- Stale balances, unreadable storage, empty plans, offline copy, and notification denial have specified states.
- Forecast math is unit tested, including monthly clamping, same-day ordering, and the rent-before-payday fixture.
- A headless Chrome smoke script completed the primary journey on 2026-10-22.

## Known limitations

- `localStorage` is not encrypted and is not a production store. The UI says so. Do not enter real secrets.
- No service worker. Offline use works only for assets the browser has already cached, and only for data already on the device.
- Device notifications do not fire when the page is closed.
- One currency, no conversion, no multiple accounts.
- No income range. Point estimate only.
- No accounts, sync, or multi-user state.
- Sample data stays labeled even if someone edits it, until they remove the sample. That avoids a half-real plan that looks personal, and it also means a serious edit of the sample is still called sample.
- Focus management is basic. Dialogs and route changes were checked in code and in the smoke script, not with a screen reader.
- Screenshots are viewport captures, not full-page scrolls.
- No analytics. Success metrics cannot be computed from this build.

## Not claimed

- A Figma file or Figma prototype.
- Interview findings or usability pass rates.
- That the 70% comprehension target has been met.
- That competitor prices beyond the cited pages were rechecked.
- WCAG certification.

## Review checklist

- Open the explainer and confirm there is no bank field.
- Load sample data and read the banner before reading the number.
- Open the calculation and find the paycheck under “After the low point.”
- Enter a what-if and refresh the comparison without saving.
- Submit an empty item and read the error.
- Set the balance date to last month and read the stale banner.
- Open Settings → Privacy and read the storage paragraph.
