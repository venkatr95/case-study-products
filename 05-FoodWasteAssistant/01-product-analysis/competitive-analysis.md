# Competitive analysis

Reviewed 22 October 2026. Observations are limited to the pages cited. A feature is not described as missing unless the reviewed page was silent on it, and that silence is labeled as unverified.

## Set

| Alternative | Role in this review |
| --- | --- |
| NoWaste | Dedicated household food inventory |
| Samsung Food | Recipes, food list, and shopping list |
| SuperCook | Ingredient-first recipe search |
| The Pantry (thepantry.app) | Fast capture plus recipe match |
| USDA FoodKeeper and FSIS dating guidance | Authoritative substitute for storage questions, not a pantry |
| Memory, a paper list, or a notes app | The behavior FreshLoop has to beat on effort |

Kitche is discussed only as a historical source. Its current 2026 feature set was not rechecked in a live app.

## NoWaste

Sources, accessed 22 October 2026:

- https://www.nowasteapp.com/home/
- https://www.nowasteapp.com/post/best-food-inventory-app-for-households
- https://play.google.com/store/apps/details?id=com.khcreations.nowaste&hl=en_US (store listing updated 4 October 2026)

What those pages support:

- Household inventory across pantry, fridge, and freezer, on iPhone, Android, and the web.
- Add by hand, barcode, photo, or receipt.
- Shopping lists, recipes, and meal plans. The homepage FAQ says each location can have them.
- Free plan: one location, no ads, pantry/fridge/freezer lists, scanning, shopping lists, recipe books, expiry calendar, household invites. Pro is listed as $29.99 once or $6.99 per year, and the same FAQ says expiry reminders are Pro only.
- The homepage states that users have tracked over 5.6 million foods with a 3.29% waste rate. That is the company’s claim, not an independent measurement, and it is not evidence for FreshLoop.

Opportunity FreshLoop still has room for, without claiming NoWaste lacks a feature: the reviewed pages lead with household sharing and capture. They do not, on the pages read, spell out a rule that a quantity is left on the shopping list when units do not match, or that an opened-on date is kept distinct from an expiry. Those are FreshLoop’s explicit rules. Whether NoWaste already behaves that way needs a product pass, not a homepage conclusion.

## Samsung Food

Sources, accessed 22 October 2026:

- https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List (15 May 2025)
- https://support.samsungfood.com/hc/en-us/articles/18369342052372-Getting-Started-with-Samsung-Food-Create-and-Manage-Shopping-Lists (15 October 2026)
- https://www.samsung.com/us/support/answer/ANS10006833/ (Family Hub meal planner, 10 February 2026)

What those pages support:

- A Food List for fridge, freezer, pantry, and other locations.
- Finishing an item, and moving items to a shopping list.
- “Made it” can suggest removing used ingredients from the Food List. The help page says this is part of Food+.
- Adding a recipe to a shopping list lets the person choose ingredients. The help page says Samsung Food will alert them to items they might already have, and they can deselect those items.
- Family Hub can send a recipe’s missing ingredients toward a shopping list. The page describes purchase from that list. FreshLoop’s MVP does not purchase.

Opportunity: Samsung Food is a recipe product with an inventory attached. FreshLoop inverts the entry: the dated pantry is the start of the session. The “might already have” alert is a useful comparison. FreshLoop’s version has to show the arithmetic, including when it refused to subtract.

## SuperCook

Source, accessed 22 October 2026: https://www.supercook.com/

The page describes a pantry of ingredients the person selects, and states: “The only ingredients we assume you have are salt, pepper and water.” Recipes update as ingredients are added. The page reviewed does not describe a dated inventory, a use-soon window, or quantity units. That absence is limited to the page reviewed. It is not a claim that no SuperCook surface has dates.

Design consequence borrowed honestly: salt, pepper, and water can be treated as already at home, and the assumption is visible and switchable. Oil and other ingredients are not assumed.

## The Pantry

Source, accessed 22 October 2026: https://thepantry.app/

The marketing page describes barcode, receipt photo, voice, and typing; recipes matched to shelves; and cooking that removes ingredients from inventory. It cites “400,000+ recipes” and “~4 seconds” to read a receipt. Those are the product’s claims. FreshLoop does not compete on catalog size or capture speed in this prototype. It competes on whether a person can trust the subtraction.

## USDA FoodKeeper and FSIS dating

Sources, accessed 22 October 2026:

- https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating
- https://www.foodsafety.gov/keep-food-safe/foodkeeper-app
- USDA Food Safety & Inspection Service pointed readers to FoodKeeper on 9 March 2026: https://x.com/USDAFoodSafety/status/2031001054570234272

FSIS states that, except for infant formula, dates are not an indicator of product safety and are not required by federal law. The page also says manufacturers use dates to help judge quality, and recommends “Best if Used By” to reduce confusion and waste. FoodKeeper is the public lookup for storage times.

FreshLoop links to both pages and does not copy their tables into rules. Applying a generic storage time to a specific item would be a safety decision the PRD forbids.

## Notes and memory

A note or a paper list is fast and has no false certainty. It also does not compare quantities with a recipe or keep a date window. FreshLoop is only worth the logging cost if that comparison is honest and the entry stays short. That tradeoff is untested.

## Kitche, historical only

- TapSmart review, 14 October 2020: https://www.tapsmart.com/apps/food-drinks/review-kitche/
- Kitche blog, January 2023: https://kitche.co/2023/01/ready-steady-kitche/
- Agency case study, page dated 27 September 2026, describing the product: https://www.rst.software/case-studies/kitche

Those sources describe receipt confirmation, stock tracking, and recipe suggestions. The 2026 page is a vendor case study, not a live audit. Current availability was not verified. Do not use Kitche as a present-tense competitor without a new check.

## Opportunity FreshLoop is designed around

1. Lead with the dated items, not with a recipe feed.
2. Show the match and the refusal to match.
3. Subtract shared pantry stock once when several meals are planned.
4. Keep date language typed by the person, with opened-on outside the expiry groups.
5. Make manual entry complete. Treat scan and receipt as confirm-first and optional.

## What not to claim

Do not claim competitors lack barcodes, meal plans, or shopping lists. NoWaste, Samsung Food, and The Pantry describe those capabilities on the pages above. FreshLoop’s difference is the honesty of the quantity and date rules, which still needs a side-by-side product test.
