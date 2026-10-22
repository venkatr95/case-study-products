# Components

Built in `app/src/main.ts` and `app/styles.css` as semantic elements, not a separate component library. The browser loads the compiled `app/dist/main.js`. Variants below are the ones the screens use.

## Header

Wordmark link, Estimate pill, Sample pill when needed, On this device or Offline, Settings or Privacy link.

## Bottom / side navigation

Links: Home, Timeline, What-if, Plan, and Settings at wide widths. `aria-current="page"` on the active item. Item detail and the item form count as Plan.

## Buttons

| Variant | Use |
| --- | --- |
| Primary | One commit: save, continue, see the calculation |
| Secondary | Alternate path: sample data, cancel, try a purchase |
| Danger | Delete item, delete all data, load sample over a real plan |
| Ghost | Dismiss a toast |

Disabled primary actions stay visible and explain themselves in the nearby help (the what-if add button until the amount is valid).

## Banner

| Variant | Use |
| --- | --- |
| Info on teal-soft | Missing income or bills, prototype preview |
| Amber | Sample data, stale balance, alert status |
| Rust-soft | Future balance date if one is ever stored |

Banners that include an action put a real button inside, as the sample banner does.

## Formula and key-value rows

Label on the left, amount on the right, wrapping if the width is tight. The last formula row is emphasized. Used for safe to spend, item facts, scenario columns, and the summary.

## Ledger day

Date, low, end of day, optional “Lowest estimate” marker, then events. Quiet stretches collapse. Scenario events are dashed and linked back to What-if rather than to a saved item.

## Event row

Name links to the item. Category or “Scenario · not saved.” Signed amount with plus or minus in the text.

## Chart

SVG polyline of each day’s low point and a dot on the lowest day. `role="img"` and an accessible name that states the lowest amount and date. The table is the full alternative.

## Table

Caption, column headers with `scope="col"`, row headers with `scope="row"`. Horizontal scroll wrapper if needed. Used on the timeline and the category summary.

## Form field

Label, control, help, and an error with `role="alert"` when invalid. `aria-invalid` and `aria-describedby` point at the help and the error. Controls are text, date, select, textarea, radio, or checkbox. Money inputs use `inputmode="decimal"` and `autocomplete="off"`.

## Dialog

`role="dialog"`, `aria-modal="true"`, labelled by the heading. Cancel is the first button and receives focus. Tab cycles inside. Escape closes. Used for delete, replace with sample, discard scenario, and erase storage.

## Toast

Confirmation text plus Dismiss, and Undo when an item was deleted. The polite live region also announces the same news so it is not only visual. The toast itself is not a second live region.

## Skeleton

Three bars and a heading, only on the loading preview.

## Disclaimer

A paragraph under decision content: “Estimate only. Not a guarantee, a bank balance, or financial advice.”

## What is not a component yet

There is no icon button, no tabs widget, no toast stack, and no data grid. Add them only when a task needs them.
