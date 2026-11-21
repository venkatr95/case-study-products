# Wireframe annotations

The annotation column is part of each SVG. This file collects the decisions so a reviewer does not have to open all sixteen frames to see the pattern.

## Decisions repeated on the frames

1. The first number on Pantry is a count of Use soon, not a storage total. Storage is the list underneath.
2. Use soon, Date passed, Opened, and No date are words. Color and weight support the word.
3. Opened is visible and is not grouped with Date passed.
4. Recipe rows say Have, Short, Check, Missing, Staple, or Optional. They do not say “ready” as a single badge.
5. Review is its own step so a subtraction can be refused in public.
6. Staples are a setting, not a hidden assumption.
7. Barcode fill and receipt scan are different. One confirms. One is absent.
8. Recovery does not show an empty pantry over unreadable data.
9. Offline does not wipe the list.
10. Deny on reminders returns to the product.

## Frame-specific notes

| Frame | Annotation intent |
| --- | --- |
| WF-01 | One title, the UVP. The safety limit is the next sentence, not a footnote. |
| WF-02 | The empty state teaches quick add. It does not show a fake recipe. |
| WF-03 | Sample banner is inside the phone, because fictional data must be obvious in a screenshot. |
| WF-04 | Date type is a choice, not a single “expiry” field. |
| WF-05 | Merge is conditional on units. |
| WF-06 | The opened-on explanation is on the list, not only in settings. |
| WF-07 | Filters sit above recipes, with the limitation in the same region. |
| WF-08 | Steps are below the match. The decision happens before the method. |
| WF-09 | Two groups: to buy, and left off. |
| WF-10 | Checked lines remain visible. |
| WF-11 | The proposal is a question: “Update the pantry?” |
| WF-12 | Four days is the should-have scope, drawn as four slots, not a calendar product. |
| WF-13 | The close-the-page limit is in the dialog, not only in documentation. |
| WF-14 | Save is still required. |
| WF-15 | Download and erase are separate buttons. |
| WF-16 | The banner is above the list, not a blocking modal. |

## How the frames were made

`node assets/wireframes/build-wireframes.mjs` from `05-FoodWasteAssistant` writes the SVGs. Edit the script and rerun it. Do not hand-tune one SVG and leave the script behind.

Grayscale is intentional. Status color belongs to the high-fidelity UI, where it is paired with text. A colored wireframe would imply that color carries the state.
