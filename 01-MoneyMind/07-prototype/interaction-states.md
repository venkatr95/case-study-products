# Interaction states

| Surface | Default | Empty | Loading | Error | Success | Disabled | Permission | Offline | Stale |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| First open | Explainer | No plan yet | Preview route only | Unreadable storage replaces the explainer | Balance saved → Home | — | — | Banner if the browser is offline | — |
| Home | Estimate with items | Flat number plus add prompt | Not on the real path | Blocked by the error screen | Toast after save | — | Alert banner does not need permission | Banner | Banner after 7 days |
| Item form | Fields and preview | Preview asks for name, amount, and date | — | Field alerts | Detail page and toast | Delete hidden on create | — | Save still writes locally | — |
| What-if | Empty amount, help text | Help to enter an amount | — | Messages when Add is pressed with bad input | Add to plan opens the item | Add to plan until valid | — | — | — |
| Alerts | Off until saved | No amount yet | — | Amount error if enabled and blank | “Alert saved.” | — | Four copy states | In-app status still shows | Uses the same forecast |
| Timeline | Ledger and table | One quiet stretch at the starting balance | — | — | — | — | — | Banner | Banner |
| Settings export | Button | — | — | Browser may block the download; the app does not claim the file was stored | Live announcement that the download started | — | — | File is still created locally | — |
| Delete all | Dialog | — | — | If storage throws, the announcement says it could not clear | Returns to explainer | — | — | — | — |

Sample is an extra state on top of Home, Timeline, Explanation, Plan, and Alerts. It is not an error.

The loading skeleton is real markup at `#/preview/loading`. Cold start does not artificially delay itself.
