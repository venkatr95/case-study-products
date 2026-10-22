# Prototype flow

The clickable artifact is the web app in `app/`. There is no Figma prototype.

## How to run

```powershell
Set-Location 01-MoneyMind\app
npm test
npm start
```

Open http://127.0.0.1:4173/. On an empty browser, http://127.0.0.1:4173/?sample=1#/home loads the illustrative plan.

`app/test/smoke.html` runs the journey below and prints PASS or FAIL. It was executed in headless Chrome on 2026-10-22.

## Primary journey, a few minutes

1. **Start** at `#/welcome`. Read that nothing connects to a bank and that the result is an estimate.
2. Choose **Explore with sample data**. If a plan already exists, confirm replacement.
3. **Home** shows safe to spend, the low-point date, the sample banner, and the disclaimer.
4. **See the calculation.** Check the formula, the items in the low point, and payday listed after it.
5. **Timeline.** Find the lowest-estimate marker and the table.
6. **Try a purchase.** Enter an amount. Compare Saved estimate and Scenario · not saved.
7. **Discard** or **Add to plan**. Adding opens the new item and changes the saved number.
8. **End:** Home again. The figure matches the choice in step 7. The header still says Estimate.

## Supporting stops on the same build

- Add an item with an empty name and see the rejection, then save a valid one.
- Edit and delete, including undo.
- Set the low-balance alert and read the notification limit.
- Download JSON and, if finished, delete all data.
- Set the balance date more than 7 days ago and read the stale banner.

## What “done” is for a demo

The person running the demo can point at the low point, say why later income is excluded, and show that a scenario does not stick until Add to plan. They should not claim a user test succeeded.
