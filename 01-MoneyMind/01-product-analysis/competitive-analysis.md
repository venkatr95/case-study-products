# Competitive analysis

Access date for this review: **2026-10-22**. Observations are limited to the pages and help articles listed. A feature is not called “missing” unless a cited source says so or the product’s own description makes the boundary clear. Pricing that was not opened on the vendor’s pricing page is marked unverified.

## The set

| Alternative | Why it is in the set |
| --- | --- |
| PocketGuard | Markets a “safe to spend” / Leftover number after bills and goals. Closest promise. |
| Quicken Simplifi | Markets projected cash flow, a spending plan, and what-if language. |
| Copilot Money | Strong upcoming-bills and “free to spend” budget model on Apple and web. |
| Monarch Money | Recurring bills plus a separate long-range forecasting tool. |
| YNAB | Influential method that refuses to budget expected income. Useful contrast. |
| Bank balance, calendar, spreadsheet | The substitute workflow the MVP has to beat without a bank link. |

## PocketGuard

Sources: [pocketguard.com](https://pocketguard.com/), retrieved 2026-10-22.

PocketGuard’s homepage describes linking accounts, tracking spending, and knowing what is safe to spend after bills, debt payments, savings, and goals. Leftover is “how much money you have left to spend after budgeting for necessities.” Pace uses spending history and current habits to forecast how much will be left at the end of the month. The site lists web, iOS, Apple Watch, and Android, and says connections use Plaid, Finicity, and Salt Edge with read-only access across the US, Canada, and the UK. A company marketing claim of “more than 1,700,000 people” is the company’s own statement, not an independent measurement.

The homepage did not show a public price on the page that was fetched. A secondary review, Wealthy Pot (18 October 2026), reports $12.99 a month, $74.99 a year, or $149.99 lifetime and says it checked PocketGuard’s pricing page. **That price was not re-opened for this case study.**

Secondary write-ups disagree about the exact Leftover formula (income minus bills minus goals, versus a daily split, versus a balance-based “In My Pocket”). Those formulas are not treated as PocketGuard’s specification here.

**Opportunity:** MoneyMind can show a dated low point and the items in it without requiring a linked account. It should not claim PocketGuard has no safe-to-spend concept. PocketGuard already promises that. The difference to test is explanation and timing: a 30-day trough built from entered items, versus a leftover figure that depends on linked accounts and budgets.

## Quicken Simplifi

Sources:

- [quicken.com/products/simplifi](https://www.quicken.com/products/simplifi/), retrieved 2026-10-22. The page showed a promotional **$3.99** and a **$6.99** per month price, billed annually. It describes projected balances from income and spending habits against bills, and says people can run what-if scenarios.
- [Spending Plan help](https://support.simplifi.quicken.com/en/articles/4212702-understanding-your-spending-plan), updated 11 June 2026. The plan tracks the current month’s income, bills, planned spend, other spend, and goals. The help note says the Spending Plan focuses on the current month’s transactions and **does not include existing account balances**.
- [Projected Cash Flow on mobile](https://support.simplifi.quicken.com/en/articles/5274786-using-projected-cash-flow-on-the-mobile-app), updated 16 October 2026. Projections use upcoming reminders and future-dated transactions. The article says Projected Cash Flow **does not include Planned Spend items** from the Spending Plan.

**Opportunity:** Simplifi already forecasts cash and already has what-if language, so MoneyMind cannot claim to have invented either idea. A documented gap is that planned variable spending and the projected balance are separated, and the spending plan ignores the current balance. MoneyMind puts the balance, bills, and planned expenses on one 30-day estimate and explains the lowest point. Simplifi’s depth (institutions, investments, goals, sharing) is intentionally out of MoneyMind’s MVP.

## Copilot Money

Sources, help center articles retrieved via their public pages on 2026-10-22:

- [Cash Flow tab](https://help.copilot.money/en/articles/9682232-cash-flow-tab-overview). Cash flow compares income, spending, and net income for ranges such as month-to-date and year-to-date. The article says cash flow looks at what happened up until today and **does not include unpaid recurrings or future transactions**.
- [Dashboard](https://help.copilot.money/en/articles/6045480-dashboard-tab-overview). Free to Spend is the amount that can still be spent without going over the month’s budget. Recurring transactions expected later in the month are not included in that spending chart. Upcoming recurrings are listed separately.
- [Recurrings FAQ](https://help.copilot.money/en/articles/10244751-recurrings-faq). Recurring income is not supported. A recurring can only be created from an existing transaction.
- [Notifications](https://help.copilot.money/en/articles/10671399-notifications). The low-balance alert described there fires when a checking or savings account drops below $100. It is not described as a projection.
- Homepage pricing content retrieved 2026-10-22 from [copilot.money](https://www.copilot.money/): **$95 a year** (shown as $7.92 a month) or **$13 a month**. Re-check the live toggle before quoting this in a portfolio talk.

Copilot’s site and help center describe iPhone, iPad, Mac, and web. This review did not confirm or deny an Android app.

**Opportunity:** Copilot is excellent at organizing what already happened and what is recurring, and its free-to-spend number is a budget pace, not a projected trough. MoneyMind’s job starts at future dated items, including income, which Copilot’s recurring FAQ says it does not support as recurrings. MoneyMind should not pretend to match Copilot’s transaction cleanup or investment tracking.

## Monarch Money

Sources:

- [Forecasting in Monarch](https://help.monarch.com/hc/en-us/articles/48344305092244-Forecasting-in-Monarch), updated 20 October 2026. Forecasting projects net worth and cash flow from account data, spending history, and life events such as retirement or buying a home. The help page marks it as a **Monarch Plus** feature. The annual price of Plus was **not** confirmed on Monarch’s pricing page in this pass.
- [Bill Sync](https://help.monarch.com/hc/en-us/articles/29446697869076-Using-Bill-Sync), updated 20 October 2026. Statement balances and due dates for credit cards and loans, with reminders.

**Opportunity:** Monarch’s forecast is a long-horizon planning model. MoneyMind’s forecast is the next 30 days of entered cash items. They can both be called “forecasts” and still answer different questions. MoneyMind does not compete on household collaboration or net worth in this MVP.

## YNAB

Sources:

- [YNAB pricing](https://www.ynab.com/pricing), content retrieved 2026-10-22: **$109 a year** (shown as $9.08 a month) or **$14.99 a month**, plus tax where applicable.
- USA Today review, 17 June 2026, describes the same monthly and annual prices and the zero-based method: give every dollar a job. A separate 2026 review of YNAB’s method notes that income you expect next week is not money you can assign today.

YNAB is a method product. It will not treat next week’s paycheck as spendable. MoneyMind also refuses to treat income after the low point as spendable. The difference is that MoneyMind shows that future income on the timeline and uses dated bills to find the dip. YNAB assigns only cash already on hand. MoneyMind should not claim to replace the YNAB method for someone who wants every dollar assigned.

## Spreadsheet, calendar, and the bank app

These were not vendor-tested. As workflows they are real substitutes:

- A spreadsheet can compute income minus bills for a pay period. It rarely explains a mid-window dip, monthly clamping, or a stale starting balance unless the person builds that.
- A phone calendar holds due dates and not a running balance.
- A bank app shows a posted or available balance and sometimes scheduled payments. This review did not audit a specific bank’s bill-pay forecast, so no bank is accused of lacking one.

**Opportunity:** MoneyMind has to be faster to trust than a spreadsheet the person already understands. The explanation screen is the case for that. If a usability participant says the spreadsheet is clearer, the formula UI has failed.

## Comparison

|  | Audience signal | Core promise observed | Onboarding burden | Shortfall view | Accessibility notes from this pass | Price verified here |
| --- | --- | --- | --- | --- | --- | --- |
| PocketGuard | People who want a budget and a leftover number | Safe to spend / Leftover after necessities, goals, bills | Bank link is the intended start | Month-end pace, plus leftover | Not assessed from marketing pages | Not re-verified |
| Simplifi | People who want a plan and projections in one subscription | Spending plan and projected cash flow | Bank connection and reminders | Projected balances; planned spend excluded from cash-flow projection | Not assessed | $3.99 promo / $6.99 per month, billed annually, on the product page |
| Copilot | Apple-first budgeters | Free to spend against the month’s budget; upcoming recurrings | Transactions and recurrings from existing activity | Cash flow is backward-looking | Not assessed | $95/year or $13/month on homepage content |
| Monarch | Households and long-range planners | Bills, cash flow, plus Plus forecasting over years | Account connection | Long-range model, separate from a 30-day purchase decision | Not assessed | Plus price not opened |
| YNAB | People learning zero-based budgeting | Assign money you already have | Method plus accounts | Not a future-balance forecast | Not assessed | $109/year or $14.99/month |
| MoneyMind MVP | Hypothesis: people timing bills against pay | Lowest 30-day point and safe to spend | Type a balance and a few items, or open labeled sample data | Dated trough with the items listed | WCAG 2.2 AA target; see accessibility notes | No price. Not a commercial offer |

Accessibility of competitor products was not audited. Do not describe them as inaccessible.

## Design strategy from the gaps

Build the explanation of a 30-day low point from manual items, including planned expenses and income. Do not build another month-to-date spending chart, another envelope system, or a long-range net-worth model.

Do not ship bank linking in the concept. The competitors that already link banks also carry the trust and setup cost MoneyMind is trying to avoid until the manual explanation is understood. Linking later would need a regulated provider, consent, and a legal review, as the PRD requires.

Do not copy a single “you’re fine” number. PocketGuard’s Leftover and Copilot’s Free to Spend already occupy that space. MoneyMind’s difference is the visible trough, the same-day ordering rule, and the unsaved what-if.
