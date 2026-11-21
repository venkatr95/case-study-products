# Components

Implemented in `prototype/src/pages.ts` and `prototype/styles.css`. Variants below are the ones the prototype actually renders.

## App shell

- **Welcome:** Solo column, no nav.
- **Kitchen:** Top bar (brand, kitchen name, Settings), banners, main, bottom nav or side nav.
- **Main:** `id="main"` and `tabindex="-1"` so a route change can move focus. The first paint does not force that focus, so the page does not open with a focus ring around the whole page.

## Buttons

| Variant | Class | Use |
| --- | --- | --- |
| Primary | `button.primary` or `button.primary` | One per decision: Start, Save, Add selected, Update pantry |
| Default | `button` | Secondary actions and links styled as buttons |
| Danger | `button.danger` | Remove, delete data, erase |
| Disabled | `disabled` attribute | Empty batch, empty review commit, servings at 1 or 12 |

## Status chip

Text plus background. Kinds: Use soon (citrus), Date passed (clay), Opened (neutral), No date (neutral), Later (quiet). Match chips: Have, Short, Check, Missing, Staple, Optional. The match class is on the row so the status is not only a color.

## List row

Name on the first line, amount and location on the second. The grid is `minmax(0, 1fr) auto` so the chip does not collide with the name. Selecting a row adds a checkbox with a visually hidden “Select {name}.”

## Cards and heroes

Hero: the count on Pantry, the empty state. Card: grouped explanation. Banner: offline, sample, diet, warning. Banner-warn uses clay.

## Forms

Label above the control. Error text in `fieldError`, tied with `aria-invalid` and `aria-describedby`. Quantity uses `inputmode="decimal"`. Date uses a date input when a date type needs one.

## Dialog

`role="dialog"` `aria-modal="true"` `aria-labelledby="dialog-title"`. Rendered outside the inert shell. First focus goes to `[data-autofocus]`. Escape cancels. Used for duplicates, delete, reminders, receipt unavailable, batch confirm, sample replace.

## Toast

Confirms a write and offers Undo when a snapshot exists. Dismiss is explicit. Positioned above the bottom bar, and inset from the side nav at 960px.

## Recipe match row

Name, scaled amount, match word, pantry date chip if a pantry item was used, and a reason sentence.

## Navigation

Four links with `aria-current="page"` and a bar or inset rule, not color alone. Cook stays current on recipe and cooked. Shop stays current on review. Pantry stays current on add, edit, item, and use soon.

## Settings groups

Reminders, lead window, staples, diet, sample, export, delete. Each group is a card so a destructive control is not next to a checkbox by accident.

## What is not a component yet

- A data table. Lists are enough at this size.
- Charts. The product does not graph waste.
- A photo picker.
- Toasts stacked more than one deep. A new notice replaces the previous one.
