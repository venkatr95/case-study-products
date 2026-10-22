# Edge cases

| Case | Behavior | Where |
| --- | --- | --- |
| No saved plan | Explainer, then balance. No empty dashboard of zeros that looks like a real forecast. | `#/welcome` |
| Balance saved, no items | Flat safe-to-spend is balance minus set-aside. Banners say income and bills are absent. | Home |
| Amount blank, 0, or “abc” on an item | Save is blocked. Message names an example such as 25.00. | Item form |
| More than two decimal places | Rejected. Cents are exact integer math, not floating point. | Parser, tested |
| Negative item amount | Rejected. Direction comes from income vs expense. | Item form |
| Negative starting balance | Allowed. Shortfall is stated. Safe to spend displays as $0 and the shortfall is separate. | Balance, explanation |
| Set-aside blank | Treated as 0 on the balance form. | Balance |
| Balance date in the future | Rejected: “Choose today or a past date.” | Balance |
| Balance date more than 7 days ago | Estimate still shows. Banner says spending since that date is missing. | Home and other forecast screens |
| Item anchor before the balance date | Occurrences before the balance date are not applied again. Help text says they are treated as already in the balance. | Item form, engine tests |
| Item entirely outside the 30 days | Saved. Detail says it does not fall in this window. | Detail |
| Monthly day 31 in February | Clamped to the last day of February, then returns to the 31st when the month has one. Does not overflow into March. | Engine tests, conditional help |
| Weekly or biweekly anchor before the window | Steps forward. Earlier dates are not added on top of the balance. | Engine tests |
| Same-day bill and paycheck | Low point uses the balance after the bill and before the paycheck. The paycheck is marked not counted in that low point. | Explanation, tests |
| Two days share the same low value | The earliest date is the one explained. | Engine tests |
| What-if date outside the window | Message that the saved estimate does not change. Add to plan can still save it for later. | What-if |
| Discard scenario | Confirm, then clear fields. Stored items untouched. | What-if |
| Delete item | Confirm, then one undo. | Dialog, toast |
| Delete all data | Second confirm. Cannot undo. Returns to the explainer. | Settings |
| Storage text cannot be parsed | Not erased. Download raw text, or erase after confirm. | Error |
| Storage throws | Same error screen. Download is hidden if there is no raw text. | Error |
| Notification API missing | Say so. In-app alert still works. | Alerts |
| Permission denied | Say notifications are blocked and the in-app alert remains. Do not pretend a schedule exists. | Alerts |
| Permission granted | A browser notification can fire once per threshold and date while the page is open. | Alerts |
| Offline | Banner. No queued sync, because there is no server. | Banner |
| Sample data | Persistent banner. Removing it deletes the plan after confirm. Editing sample numbers does not silently drop the banner. | Home |
| Currency | Symbol only. Switching it does not convert amounts. | Balance help |
| Very long item name | Limited to 60 characters. | Validation |
| Note over 280 characters | Rejected with a shorten message. | Validation |
| Duplicate rapid saves | Each save rewrites the record and the derived snapshot. The math is deterministic for the same inputs. | Engine |

Loading is specified as a preview because reading `localStorage` is synchronous and usually instant. The preview exists so a slow or empty first paint still has a designed state.
