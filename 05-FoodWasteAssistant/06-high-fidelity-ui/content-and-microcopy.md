# Content and microcopy

## Voice

Plain, specific, and a little formal. Short sentences. The product names what it did and what it refused to do. It does not cheer, scold, or diagnose.

## Principles

1. Use the status words exactly: Use soon, Date passed, Opened, No date, Have, Short, Check, Missing, Staple, Optional.
2. Say “you entered” when a date is on screen.
3. Say what was left off, and why.
4. Say when a provider is absent.
5. Do not say expired, unsafe, throw it away, safe to eat, allergen-free, or guaranteed fresh.

## Canonical lines

| Moment | Line | Source |
| --- | --- | --- |
| Promise | Know what to cook before your groceries go to waste. | `COPY.uvp` |
| Limit | Dates you enter are reminders. FreshLoop does not decide whether food is safe. | `COPY.safety` |
| Longer limit | A best-before date, a use-by date, or an opened-on date is stored exactly as you type it. FreshLoop does not compare it with a shelf-life table and does not tell you to keep or discard food. | `COPY.safetyLong` |
| Diet | Filters compare your choices with ingredients listed on each sample recipe, including optional ingredients. They do not check cross-contact, and they are not an allergen or medical judgment. | `COPY.dietDisclaimer` |
| Staples | Salt, pepper, and water are left off the list when this is on. Olive oil and other ingredients are included unless they are in the pantry. | `COPY.staplesNote` |
| Reminders | Reminders in this prototype appear while the page is open. FreshLoop cannot notify you after you close it. | `COPY.reminderLimit` |
| Barcode | Check this result before saving. A barcode match is not in your pantry until you save it. | `COPY.barcodeConfirm` |
| Barcode miss | No sample product uses that code. Nothing was added. This prototype has no grocery database. | `COPY.barcodeMiss` |
| Receipt | Receipt scanning is not connected. There is no OCR provider in this prototype. Add each item yourself. | `COPY.receiptUnavailable` |
| Quantities | FreshLoop subtracts only amounts it can confirm. A different unit, or a blank quantity, stays on the shopping list. | `COPY.quantityHonesty` |
| Sample | Sample kitchen. These items are fictional. | `COPY.sampleBanner` |
| Offline | You are offline. The pantry stays on this device. Recipe search uses the sample catalog stored in the app. | `COPY.offline` |
| Recipe source | Original sample recipe written for this prototype. It is not from a licensed recipe service. | `COPY.sourceNote` |
| Blank name | Enter a name. | Validation |
| Zero | Rejected with a reason that names zero. | Validation |
| Assumed amount | A unit without a quantity tells the person the app will not assume an amount. | Validation |

## Links out

- FSIS food product dating: `https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating`
- FoodKeeper: `https://www.foodsafety.gov/keep-food-safe/foodkeeper-app`

Link text should say these are outside FreshLoop and that FreshLoop does not apply their storage times.

## Button labels

Start my kitchen. Try the sample kitchen. Open the use-soon list. Shop for what's missing. I cooked this. Add selected items to my list. Update pantry. Find sample product. Scan a receipt. Add items myself. Allow reminders. Don't allow. Download the saved text. Erase and start over. Download a JSON copy. Delete data on this device.

## Words we almost used and did not

| Rejected | Why |
| --- | --- |
| Expired | Sounds like a safety verdict. |
| Expiring soon | Same problem. Use soon is about the date they entered. |
| You can make this | Hides Short and Check. |
| Waste saved | No measured waste. |
| Smart list | The list is arithmetic, not a model. |
| Allergen safe | The filter cannot know that. |

## Sample recipes

Seven original recipes. Titles: Spinach and chickpea skillet, Lemon chicken tray, Ginger carrot soup, Pea and rice skillet, Tomato toast, Yogurt oat bowl, Chickpea herb salad. Do not describe them as community recipes or as scraped content.
