# Product brief — Rewear

**Status:** Portfolio concept. Decisions below are design decisions for this case study, not evidence that the product should be funded.
**Source:** `02-rewear-digital-wardrobe.md` (PRD v1.0, draft).
**Working name and folder:** Rewear, in `02-DigitalWarderobe/`.

## Vision

Rewear is a mobile-first wardrobe you can search, so getting dressed or packing starts from clothes you already own.

**UVP:** Create more outfits from clothes you already own.

## Who it is for

**Primary segment, hypothesis:** People who already own enough clothes for the week, and still lose time in the morning because they cannot see workable combinations.

**Secondary segment, hypothesis:** People who pack for short trips and either overpack or forget a piece that makes an outfit work.

The PRD excludes shaming people about how much they buy or about body shape. That is a product constraint, not a slogan. The interface does not score bodies, comment on fit, or recommend purchases.

## Problem worth designing for

The wardrobe is a memory problem and a coordination problem. Pieces live in drawers, laundry, and photos. A new purchase is sometimes easier than finding a combination that already works. Rewear tests whether a small catalogue plus an explained outfit is enough to make that second path faster.

This problem is a **hypothesis**. No interviews were run for this case study. See `02-ux-research/`.

## What “good” feels like

A person can add a piece without a photo, find it again, save an outfit for a named occasion and a weather preference, and turn two outfits into one packing list where a shared pair of shoes appears once.

The first useful moment should not require a full closet. The sample wardrobe (12 illustrative items) exists so the outfit and packing value can be tried before any personal cataloguing. It is labeled as sample data.

## MVP that this case study actually designed

| In the prototype | Priority in the PRD | Why it is in the prototype |
| --- | --- | --- |
| Add, edit, archive, delete items | Must, FR-01, FR-02 | Core catalogue |
| Photo with progress, failure, retry, and a manual path | Must, FR-01, NFRs | Photo must never be the only way in |
| Search and filters, clearable | Must, FR-03 | Finding a piece is part of the job |
| Build and reopen an outfit | Must, FR-04 | The outfit is the unit of value |
| Occasion and weather preference on the outfit | Must, FR-05 | Context without a weather API or location |
| Trip packing list, duplicates consolidated | Must in the scope list and the core flow; **Should** on FR-06 | Treated as in scope because the release checklist requires consolidation. The table conflict is recorded in assumptions. |
| Explained tag-based suggestions, save or dismiss | Should, FR-07 | The executive summary promises suggestions. They are rules, not a model, so they can be evaluated honestly. |
| Recently worn and cost per wear | Should | Small, and only when the person logs wears and, for cost, a price |
| Sample wardrobe and empty states | Risk mitigation in the PRD | Setup friction is the main adoption risk |

## Explicit non-goals

Not designed, and not stubbed as if they exist:

- Social feed, friend wardrobes, or sharing outfits
- Resale or a marketplace
- Body scoring, “flattering” analysis, or size inference
- Automatic purchase recommendations or “you should buy this”
- Claims that using the app reduces environmental impact
- Live weather, GPS, or a calendar sync
- Image recognition that writes tags. A photo is a picture the person attaches. Rewear does not read it.

## Primary use cases

1. **Weekday outfit.** Choose occasion Work and weather Cold. Either pick items or accept an explained suggestion. Save it. Mark it worn.
2. **Add what you actually wear.** Add one item by hand in under a minute. Photo optional.
3. **Short trip.** Select two saved outfits. Get one checklist. A shoe that appears in both outfits is one line.

## Secondary use cases

- Find a navy piece while getting dressed.
- Archive a piece that is out of season without losing the outfits that use it.
- Delete a photo, or every photo, without deleting the catalogue.
- See cost per wear only after a price and at least one wear are both present.

## Dependencies and constraints

- **Prototype constraint:** one browser, `localStorage`, no account and no server. Photos are compressed on device and can hit storage limits. That is an honest limitation, not a privacy claim about a future production backend.
- **Platform:** mobile-first layout, usable on a desktop browser for review. The PRD asks for small screens, dynamic text, and screen readers. The prototype aims at WCAG 2.2 AA for the web UI it actually draws.
- **Content constraint:** no moralizing copy. Outcomes are speed, memory, and choice.
- **Data constraint:** do not collect exact location. Weather is a preference the person picks: Mild, Warm, Cold, or Rain.

## Design strategy in one paragraph

Prioritize the path from “I own this” to “I can wear this combination” and then to “this is what I pack.” Do not spend the first release on a social graph, a shop, or a stylist persona. Make the manual catalogue as careful as the photo path, and make every suggestion say which tags it used. Those choices are how Rewear stays distinct from closets that are also feeds, marketplaces, or AI stylists. The comparison is in `competitive-analysis.md`.
