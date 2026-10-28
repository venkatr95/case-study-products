# Prototype review

**Reviewed:** 22 October 2026, by the author of the concept. This is not a usability study.

## What a reviewer can do

Complete the primary flow on sample data. Open every PRD state from the prototype controls or from `?shot=`. Save, edit, and delete preferences. Submit and withdraw a report. Raise text size. Use the keyboard through the dialogs and the List/Map tabs.

## Checks already run

- `npm test` in `app/`: TypeScript compile plus 19 node tests. They cover fit rules, sort, headlines, empty coverage, report status, HTML escaping, and the absence of "fully accessible" in status labels and copy.
- Chrome headless screenshots of the wireframe boards and the main prototype states. Images are in `assets/wireframes/png/` and `assets/screenshots/`.
- Contrast math for the token pairs, including a fix to the disabled button after a pair measured 3.88:1.

## Issues found while building

| Issue | Change |
| --- | --- |
| "Highlighted on the schematic" pointed at a drawing List view hides on a phone. | Button is now "Mark on the map." |
| Disabled button text was 3.88:1. | Darker ink on a light fill, 10.24:1. |
| Date-only stamps shifted to the previous evening in Pacific time. | Sample timestamps include an offset. |

## Still rough

- The results page is long on a phone. Three full cards may be more than a glance. A test should ask whether people stop at the first card.
- Summary reasons put notes ahead of "all clear" lines, so Madison's card leads with the unknown surface. That is honest and also easy to misread as a problem. Worth a comprehension question.
- The schematic is sparse. It teaches the legend and does not help someone recognize a street.
- Prototype controls make demos easy and must not be mistaken for the product. Shot links hide them. The normal page does not.
- No assistive-technology pass was listened to.

## Author conclusion

The prototype is enough to walk the UVP and to fail in the states the PRD names. It is not enough to claim people understand it.
