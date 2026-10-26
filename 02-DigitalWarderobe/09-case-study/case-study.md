# Rewear — case study

**Create more outfits from clothes you already own.**

| | |
| --- | --- |
| Role | Product design, UX writing, and prototype implementation for a portfolio concept. Not a shipped product and not a client engagement. |
| Timeline | Built as a case study. Proposed discovery and usability rounds are not done. |
| Status | Design and working browser prototype complete. Validation planned. |
| Platform | Mobile-first web prototype. Desktop layout is a wider version of the same screens. |

## Executive summary

Rewear is a private wardrobe for people who want to get dressed, or pack, from clothes they already own. The work turns a draft PRD into a screen system and a TypeScript prototype: add an item with or without a photo, find it, save an outfit for an occasion and a weather preference, read or dismiss an explained suggestion, and pack a trip so a shared item appears once.

The category is crowded. Whering, Stylebook, Acloset, Indyx, and Cladwell already catalogue clothes and help with outfits. Rewear’s bet is narrower: no social feed, no shop, no body reading, no location, and no suggestion that cannot show its tags. That bet is a design position. It is not a claim that users prefer it. No interviews or usability sessions have been run.

## Problem and why it matters

People can own enough clothes and still lose the morning, because the pieces and the combinations are hard to see. Buying another item is sometimes easier than finding a combination. Packing has the same shape: outfits in one place, a list in another, duplicates in the bag.

This is a hypothesis from the PRD. If interviews show the real break is laundry, or a dress code the tags cannot express, the grid is the wrong first build. The interview guide asks for the last annoying morning before it mentions an app.

The product refuses a second, tempting problem: reforming the person’s consumption or body. Those readings would make the interface a lecture. The PRD forbids that, and the copy rules follow.

## Target users and evidence status

**Primary, hypothesis:** someone with a recurring reason to get dressed who is tired of the decision, not someone building a public aesthetic.

**Secondary, hypothesis:** someone packing a trip of a few nights.

Proto-personas Maya and Sam live in `02-ux-research/personas.md` and are labeled as unvalidated. They are lenses for critique, not research.

## Research approach and findings status

Planned: six interviews about recent behavior, then five moderated prototype sessions. Done: a competitive review on 22 October 2026 using vendor and store pages. Not done: any participant research. There are no quotes. Findings that guided the UI are marked as hypotheses in `research-findings.md`.

## Competitive landscape and opportunity

The useful observation is what not to pretend is missing. Packing lists, cost per wear, outfit shuffles, and non-photo capture are all publicly described by at least one of the products reviewed. Live weather and location show up in Whering’s October 2026 Play listing and in Acloset’s widget note. Human styling and resale-adjacent services show up at Indyx. Color analysis and “see it on me” show up at Cladwell’s paid tier.

The opening Rewear takes is a private, explained, manual-first decision tool:

- Weather is a preference, so the app does not need location.
- A suggestion lists the tags it used and can be dismissed.
- A photo is an attachment. It is not scanned, and the form can be saved when it fails.
- A packing row says which outfits share the item.

That is a trade. The prototype will feel less automatic than a weather widget. The trade is intentional.

## Product strategy and prioritization

Must-have catalogue, search, and manual outfits are the spine. Packing is Must in the PRD’s scope list and Should in the requirements table. It is included because the core flow and the release checklist both depend on duplicate consolidation, and the conflict is documented. Suggestions, recently worn, and cost per wear are Should and are in the prototype because they are how the UVP is shown without a model. Weather APIs, image recognition, sharing, care reminders, a feed, and a shop are out.

Cost per wear is the sharpest small decision. The number appears only when a price and at least one wear both exist. A new scarf with a price and zero wears does not display a cost. Dividing by zero would have been a fake insight.

## Information architecture and key flow

Four tabs: Wardrobe, Outfits, Trips, You. Welcome has no tabs. Settings is reachable before any photo, because storage is a first-screen question.

The key flow is: start with a labeled sample or an empty wardrobe → add or find items → save an outfit with an occasion and a weather preference → optionally read a suggestion → turn outfits into one packing list. Delete confirms name the outfits that will change. Archive hides an item from new outfits and leaves it in old ones.

## Early wireframes and rationale

Grayscale frames at 390 × 844 are in `assets/wireframes/wireframes.html`, with notes in `04-wireframes/`. They use the sample’s real names and the real button labels. The structural choices to defend:

- One welcome decision, not a carousel.
- Words on every wardrobe card.
- Photo failure on the same form as save.
- Suggestion reasons on the card, with dismiss beside save.
- Packing copy that admits the dedupe instead of hiding it.
- No bodies in the frames.

## Visual direction and design system

“Morning paper”: Fraunces and Figtree, warm paper `#F4EFE8`, ink `#1C1916`, terracotta `#8C3B16` for the primary action. Not fashion-gloss and not eco-green. Contrast pairs used for text were calculated. Ink on paper is 15.30:1. Muted on paper is 6.58:1. White-on-terracotta is 7.46:1. A test fails if the CSS hex values drift from the token file.

Flat garment silhouettes stand in when there is no photo, in the item’s color, with the name always set in type. The grid becomes four columns beside a side nav at 960px so a laptop review still shows a wardrobe, not a stretched phone.

## Final screen walkthrough

1. **Welcome** states the UVP and offers the sample or an empty wardrobe.
2. **Wardrobe** searches, filters, and adds. The sample banner is part of the UI.
3. **Add item** asks for name, category, color, season, and dressiness. Price and photo are optional. The dressiness hint says it is not a rule about the person.
4. **Item** shows wears, last worn, and an honest cost sentence.
5. **Outfit builder** stores occasion and weather preference and selects owned items. It does not hide items that would fail a suggestion rule. People are allowed to override.
6. **Suggestions** show up to three combinations and a factor list.
7. **Packing list** groups by category and writes “In 2 outfits” when a piece is shared.
8. **Settings** holds text size, the currency-symbol warning, skipped colors, and deletion.

## Prototype flow

Run `npm install` and `npm run dev` in `prototype/`. In a few minutes a reviewer can load the sample, filter to navy, save a cold-weather work outfit or a suggestion, and pack two outfits that share the brown loafers. An automated flow test covers that sequence. It is a local prototype, not a synced product.

## Accessibility, edge cases, and trust

The target is WCAG 2.2 AA. Implemented: skip link, focus rings, labels, pressed states, live counts, dialog focus trap, 44px targets, 120% and 140% text, and text that does not rely on color. Not done: a screen-reader session. Known gaps include noisy search announcements and focus not returning to the control that opened a dialog.

Trust behaviors that are easy to skip and were not skipped: delete confirms, photo delete with undo, delete-all, no geolocation, no image inference, and copy that says the prototype keeps data in the browser.

## Usability validation and iterations

**Validation planned.** The test plan has five tasks, a severity scale, and empty findings. The iteration log records decisions made before testing, not results. Success targets from the PRD (70% add five items, 80% reach an outfit, median under three minutes) are candidate criteria for a moderated test. Five qualitative sessions cannot honestly produce those percentages. The plan says to report “3 of 5” rather than borrow the PRD’s number.

## Success metrics

North star: a saved outfit the person would actually wear, from items they own. Activation, task success, and time sit under it. Weekly saves and repeat use are post-launch indicators and are not measured. There is no revenue metric because the PRD does not set a price, and this case study does not invent one.

## Limitations, learnings, and next steps

**Limitations.** No users. Competitor prices that were not on a first-party price screen are labeled that way. The prototype will lose data if the browser clears storage. Suggestions are plain rules and will sometimes be dull. That dullness is preferable to a confident wrong outfit with no explanation.

**Learnings from the design, not from users.** The hard product decision was what to leave out. A digital wardrobe can absorb a shop, a feed, a stylist, and a climate API until it no longer answers “what can I wear that I already own?” Writing the suggestion factors forced the matching rules to stay small enough to explain. The PRD’s own priority table disagrees with its scope list on packing. Resolving that in the open matters more than picking a side quietly.

**Next.** Run the interview guide. Only then decide whether laundry, fabric, or live weather earns a place. Run the five tasks with five people. Fix severity 3 issues and retest those tasks. Do not add sharing or a shop unless the problem statement changes.

## Portfolio visuals to export

Listed in `portfolio-summary.md` with captions.
