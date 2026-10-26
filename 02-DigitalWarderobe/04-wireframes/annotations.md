# Annotations — Rewear wireframes

These notes explain decisions a reviewer should see on `assets/wireframes/wireframes.html`. They are not user-facing copy.

## A1 — The first screen is the UVP, not a tutorial carousel

Welcome is one decision: sample wardrobe or empty wardrobe. A carousel would delay the only thing the prototype can prove, which is an outfit from existing clothes. The storage link is present before any photo is taken, because privacy questions show up before trust.

## A2 — Sample data is labeled in the interface, not only in a footnote

The banner says the 12 items are illustrative. Item detail repeats it for prices. Dismiss hides the banner and does not delete the items. Replacing or deleting data is a confirmed action in settings.

## A3 — Category chips are outside the filter dialog

Color and season are numerous. Category is the first cut people make (“a top”). Putting category on the wardrobe keeps the frequent control one tap away. The dialog still explains that a category, a color, and a season must all match.

## A4 — Every card has words

A gray rectangle plus “Navy merino knit” and “Top · Navy · Autumn” is readable without the illustration. The later visual design may be prettier. It is not allowed to remove the words.

## A5 — Photo failure does not change screens

The error replaces the progress area and leaves Save item where it was. A separate “manual mode” screen would teach people that typing is a fallback. The PRD says manual entry remains available. Same form, same save.

## A6 — Dressiness helper is doing trust work

The field exists so suggestions can respect an occasion. Without the helper, it reads like a judgment. The sentence is short on purpose: it is not a dress code for the person.

## A7 — Cost per wear is a sentence, not a hero number

A large “£17” would look like a score. The wear panel leads with the count and the last date, then the cost sentence, including the cases where the number is withheld.

## A8 — Suggestions are articles, not a single mystery outfit

Up to three, each with a heading “Why this was suggested,” Save, and Dismiss. One giant “Wear this” would copy the products Rewear is not trying to be. Dismiss is visually secondary and still a full-size button.

## A9 — The builder does not hide “wrong” clothes

Suggestion rules are strict. The builder lists the active wardrobe. People override tags. A warning for two bottoms is information, not a block, except for the minimum save rule.

## A10 — Packing is grouped and explicit about duplicates

“Shared pieces are listed once” is on the screen, and the row says “In 2 outfits: …”. A silent dedupe would be impossible to trust in a test. Category groups match the order outerwear, top, dress, bottom, shoes, bag, accessory.

## A11 — Delete names the damage

The confirm dialog lists outfit names. Archive is the alternative when the person still owns the item. Those are different verbs and different buttons.

## A12 — Settings holds the non-goals

The about text lists what the prototype does not do: weather forecasts, image recognition, care reminders, sharing, a social feed, resale, and purchase recommendations. That keeps a portfolio demo from being narrated as a bigger product than it is.

## A13 — Offline is a banner, not a dead page

Because the data is local, offline is not an error. The banner says the wardrobe still works. A full-screen offline illustration would be theatrical and wrong.

## A14 — No bodies in the frames

Low-fidelity blocks and, later, flat garment illustrations avoid implying a fit, a size, or a person. That is the visual version of the PRD’s rule against body scoring.
