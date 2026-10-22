# Problem analysis

## The decision the product is for

The moment that matters is small and frequent: a person is about to spend, and the balance on the screen is not the money that is actually free. Rent, a subscription, or a planned expense may already be timed to leave before more money arrives.

MoneyMind treats that as a cash-timing problem. It is not “where did my money go last month,” and it is not “give every dollar a job.”

## What a balance fails to say

A single balance collapses four different facts:

- Cash that is already committed to a dated bill.
- Cash that is only committed if the person keeps a cushion.
- Income that has not arrived.
- Spending that nobody has written down.

Those facts pull in different directions. A large balance can still be unsafe if rent posts before payday. A small balance can be safe if the only dip is above the cushion the person chose. Showing only the balance forces the person to do that arithmetic in their head, often at the point of purchase.

## Hypothesis, not a finding

The PRD states the problem as a hypothesis: people with variable expenses or pay cycles find it hard to know whether the available balance will cover upcoming commitments, and an explainable forecast plus light planning tools would help. No interviews have been run for this case study. The design should be ready to change if research shows a different job, for example “I need last month’s categories” or “I only trust a number that comes from my bank.”

## Why the failure is costly when it is real

If the hypothesis holds, the cost of a miss is practical: an overdraft or a late bill, a weekend of moving money between accounts, or a purchase that has to be undone. The cost of a tool that sounds certain is also practical. A false “you are fine” is worse than no forecast. That is why the estimate is labeled, the formula is visible, and the success metrics include a guardrail that people do not treat the number as guaranteed.

## Scope of the problem this MVP will test

The MVP can test decisions that can be expressed with:

- One pool of cash.
- Dated income and expenses the person is willing to type.
- A 30-day horizon.
- A cushion they set themselves, including zero.

It cannot honestly test problems that require live bank data, multiple accounts, other people’s spending, or a probability of variable income. Those are named as limits in the interface rather than approximated with a decorative range.

## Shame is part of the design problem

Money products often mark a low point as a personal failure. That framing makes people hide the number instead of inspecting it. The copy rules forbid scolding. A shortfall is described as the estimate going under the set-aside, with the date and the items that cause it.

## What would falsify the problem framing

Change the product if research shows any of these:

- People already answer “can I afford this?” confidently with a calendar or a bank app, and the gap is somewhere else.
- People will not type more than a balance, so a manual forecast never becomes useful.
- People interpret any forecast as a promise no matter how it is labeled, and comprehension stays below the guardrail.
- The real pain is shared household spending or debt payoff, which this MVP refuses.

Until those questions are answered, the screens are a testable argument, not evidence that the problem is common.
