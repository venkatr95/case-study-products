# High-fidelity screen specifications

The high-fidelity UI is the prototype in `app/`, not a second set of pictures. Tokens and components are the ones in `05-ui-design-system/`. Screenshots in `assets/screenshots/` are captures of that UI for the portfolio. If a screenshot and the running app disagree, the app wins.

Sample amounts below are the illustrative plan, labeled as sample in the product.

## Home

**Job step:** Read today’s decision.

**Components:** Banners, hero card, lowest-estimate card, ledger preview, disclaimer, navigation.

**Content:** Safe to spend as a serif figure in teal, or rust if the spendable display is $0 because of a shortfall. Sentence includes the set-aside amount and the low-point date. Primary link “See the calculation.” Secondary “Try a purchase.”

**Responsive:** One column on a phone. From 880px, the hero and the next items sit in two columns. The lowest-estimate card stays with the hero so the cause is not below the fold on a laptop.

**States:** Sample banner. Stale banner. Missing income. Missing bills. Alert banner when a day is below the saved threshold. Empty plan replaces the next-items ledger with an invitation to add a payday and the bills before it.

## Timeline

**Job step:** Inspect the path to the low point.

**Components:** Chart, ledger, table, disclaimer.

**Content:** Range in the kicker, for example the sample window starting on the balance date. Chart label states the lowest amount and date for assistive tech. Ledger rows show signed amounts. The lowest row has a text marker.

**Responsive:** Chart scales to the content width. The table scrolls sideways only if the viewport is narrower than the five columns.

## Explanation

**Job step:** Recompute the number.

**Components:** Formula card, two lists, assumption list, disclaimer.

**Content:** Six rows: starting balance, income counted, expenses counted, lowest estimate, set-aside, safe to spend. The safe-to-spend row can be negative. A following sentence tells the truth about the $0 shown on Home when there is a shortfall. Later items are listed even though they do not raise the number.

**Responsive:** Narrow reading column, including on desktop, so the formula is not stretched into a sparse dashboard.

## Add / edit item

**Job step:** Change the plan with a preview.

**Components:** Form fields, preview card, primary save, secondary cancel, danger delete when editing.

**Content:** Preview names the would-be low point and the current one. Monthly clamp note appears only when the day is 29, 30, or 31.

**Interaction:** Preview updates as the person types, without saving. Errors after submit are tied to fields.

## Item detail

**Job step:** Confirm what was saved.

**Components:** Kicker, title, signed figure, fact card, occurrence list, edit and delete.

**Content:** “In this 30-day window” followed by dates, or a sentence that no occurrence falls in the window.

## What-if

**Job step:** Test one purchase.

**Components:** Form, two formula cards, ledger of touched days, disclaimer.

**Content:** Left card “Saved estimate.” Right card “Scenario · not saved,” with a dashed edge. Delta sentence: lowers, raises, or does not change the lowest estimate. Outside-window banner when the date misses the 30 days.

**Responsive:** Cards stack, then sit side by side from 880px.

## Alerts

**Job step:** Set a threshold and learn the limit of notifications.

**Components:** Checkbox, amount field, status paragraph, permission paragraph, save.

**Content:** The status names a date when the estimate goes below the amount. The permission paragraph has four wordings: no API, denied, granted, or not yet asked. All of them say the in-app alert does not depend on a push.

## Settings, summary, privacy, explainer

Settings is a list of text links and two buttons, not a wall of switches. Summary is a total card and a table, introduced as not a grade. Privacy is prose. The explainer repeats the onboarding rules for people who already have a plan.

## Balance

Same form as onboarding step 2, with “Update the starting balance” when a plan exists and a back link.

## Error and loading

Error is a short article with download and erase. Loading is a heading plus skeleton bars, labeled as a preview when opened from Settings.
