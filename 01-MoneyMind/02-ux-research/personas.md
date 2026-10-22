# Proto-personas

**These are hypotheses for design discussion. They are not people who were interviewed. They have no quotes. Do not present them as research.**

Two sketches are enough until interviews collapse or split them. Attributes that are not needed for the cash-timing job (age, city, income dollar amount, personality) are omitted on purpose.

## Hypothesis A — Payday-gap planner

**Situation to design for:** Paid every two weeks. At least one large bill is monthly, so some pay periods contain the bill and some do not. They check a balance on their phone before an ordinary purchase.

**Job sketch:** When a purchase comes up before the next payday, know whether the balance still has to cover the bill.

**What the prototype assumes they need:**

- The next payday and the bill on one timeline.
- A safe-to-spend number that does not treat the later paycheck as already spendable.
- A what-if for one discretionary purchase.
- Plain language, because they are deciding quickly.

**What would make this sketch wrong:** They already move the bill or the purchase with a calendar reminder and do not want a balance forecast. Or the stress is shared with a partner, which this MVP does not support.

The sample plan in the prototype (rent before the next payday, a small set-aside, transit and groceries) is an **illustrative story for this hypothesis**, not a claim that a person like this was observed. The fixture is tested in `app/test/forecast.test.ts`.

## Hypothesis B — Irregular-income planner

**Situation to design for:** Deposits arrive on uneven dates. They can often name the next expected deposit and the bills that cannot move. They cannot honestly name a single “monthly income.”

**Job sketch:** When a bill date is fixed and the next deposit is not, see the lowest point if that deposit lands on the day they currently expect.

**What the prototype can do for them now:** They enter the deposit as income on a date. If the date moves, they edit it and the estimate updates. The number is still a point estimate.

**What the prototype refuses to pretend:** It does not invent a low and a high from history. A range without a variance model would look more certain than it is. If research says a range is essential, the person would have to enter a low amount themselves, and the UI would have to label both ends as assumptions.

**What would make this sketch wrong:** They do not know the next deposit date even roughly, so a dated forecast cannot start. The honest empty state is “no income in this window,” which the prototype already shows, and it may be the whole product for them until a deposit is entered.

## Who is not represented

Traders, advisers, bookkeepers, and couples who need a shared plan. Adding them would change scope. The PRD lists them as out of scope or as later ideas (shared budgets).

## How to retire these sketches

After interviews, replace this file with segments grounded in the findings table. Keep the word “proto-persona” if the evidence is still thin. Delete demographic flavor if someone adds it later without a source.
