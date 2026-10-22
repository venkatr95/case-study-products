# Current-state journey map

**Status:** Hypothesis. This map is a design tool for finding where an estimate might help. It is not a map of observed customers. There are no quotes on it.

**Actor sketch:** Hypothesis A, the payday-gap planner, in the week before a large monthly bill. If interviews describe a different week, replace this map.

## Stages

| Stage | What they might be doing | Thinking, as a hypothesis | Pain to test | Opportunity for MoneyMind |
| --- | --- | --- | --- | --- |
| 1. Payday lands | Checks the bank balance. Feels the number is the spending pool. | “I have $1,840.” | The balance does not subtract the bill that is four days away. | Ask for that balance as a starting point, with the date. |
| 2. Ordinary expense appears | Groceries, transit, or a social plan. Decides from the balance or from memory. | “It’s only $40.” | Small items before the bill are easy to ignore one at a time. | Put those items on the same timeline as rent. |
| 3. The bill posts | Rent leaves. The balance drops. | “I knew rent was coming.” | Knowing the name of the bill is not the same as seeing the date against payday. | Show the low point on the bill’s date or the next expense after it, before payday. |
| 4. Gap before next pay | Avoids or regrets a purchase. May move money, pay late, or just worry. | “I should have waited.” | The useful moment was before stage 2, not after stage 3. | Safe to spend is computed from the future low point, so the later paycheck does not inflate it. |
| 5. Next payday | Balance recovers. The scare fades. | “I’ll be more careful.” | No record of which items caused the dip, so the next cycle repeats. | Keep the items editable. Mark the balance stale if they do not update it. |

## Emotional line

Not measured. The only rule used in design is to avoid shame at stage 3 and stage 4. The interface names a shortfall and the items. It does not grade the person.

## Moments that matter

1. **Before the purchase**, not after the overdraft. The prototype’s home and what-if screens exist for this moment.
2. **The first time the balance date is old.** A confident estimate on a stale balance is a false-confidence bug. The stale banner exists for this.
3. **The paycheck after the dip.** If the product adds that paycheck into safe to spend, it recreates the original mistake. The explanation has a section called “After the low point” so this can be tested.

## Service gaps outside the product

Bank posting times, holds, and pending card charges are invisible in a manual MVP. The assumptions list says unentered spending is missing. Do not design copy that implies pending transactions were included.

## Opportunity statement

If the map is roughly true, the intervention belongs between stage 1 and stage 2: turn the balance plus the known bill and the next payday into a low point the person can inspect before they spend. That is the prototype’s primary path.
