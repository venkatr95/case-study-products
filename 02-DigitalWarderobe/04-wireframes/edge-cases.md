# Edge cases — Rewear

| Case | Designed behavior | In the prototype |
| --- | --- | --- |
| Photo file is not JPEG, PNG, WEBP, or GIF | Error names the accepted types and save-without-photo | Yes, `photo.ts` |
| Photo over 8 MB | Error, form remains | Yes |
| Photo cannot be decoded or compressed | Error, form remains | Yes |
| Compressed photo is still too large for the local cap | Error that the browser cannot store it | Yes, about 1.5 MB data-URL cap |
| Storage quota throws on save | Toast that the change may disappear on refresh | Yes |
| Person cancels the file picker | No error | Yes, browser behavior |
| Save while a photo is still reading | Toast to wait or remove the photo | Yes |
| Name blank or too long | Alert, item not saved | Yes |
| Price blank | Allowed. Cost per wear asks for a price later | Yes |
| Price zero | Allowed. Cost per wear is 0 after at least one wear | Yes |
| Price negative or not a number | Alert | Yes |
| Wear count zero | “Wear it once to start cost per wear.” No division | Yes |
| Mark worn twice the same day | Button becomes “Log another wear” so the second tap is deliberate. Each tap adds one wear. | Yes |
| Search with no matches | Empty message and Clear filters | Yes |
| Filters contradict each other | Empty message, filters stay visible so they can be cleared | Yes |
| Archived view | Replaces the active grid. Chips still apply. | Yes |
| Archived item inside a saved outfit | Stays, labeled Archived. Hidden from new selection. | Yes |
| Deleted item inside outfits | Confirmation lists outfits. Ids removed. Toast counts them. | Yes |
| Outfit left with no items | Outfit remains and says it has no pieces. Person can delete it. | Yes |
| One item that is not a dress | Cannot save | Yes |
| One dress | Can save | Yes |
| Two statement colors in a suggestion | Allowed, factor says it may feel loud | Yes |
| No outer layer for cold or rain | Suggestion still returns if an anchor exists, and says to add a jacket or coat | Yes |
| Rain | Season is not used as a filter. An outer layer is preferred. | Yes |
| Skipped color | Item stays in the wardrobe and leaves suggestions | Yes |
| Suggestion equals a saved outfit | Not offered | Yes |
| Dismissed suggestion | Not offered again | Yes |
| No outfits, open Trips | Empty state points to New outfit, not an empty pack list | Yes |
| Trip with zero outfits selected | Button disabled and the reason is written | Yes |
| Nights blank, 0, or over 21 | Alert | Yes |
| Same item in two outfits | One checklist row, both names | Yes |
| Outfit deleted while it is on a trip | Row says “Removed outfit.” Edit the trip to refresh. | Yes |
| Currency switch | Symbol only. Toast says amounts are not converted. | Yes |
| Text size 120% and 140% | Root font size changes. Layout uses the same components. | Yes |
| Offline after load | Banner, data still editable | Yes |
| Unknown URL | Toast, no blank crash | Yes |
| Not onboarded, deep link | Introduction, except Settings | Yes |
| Sample load when the person already has their own items or outfits | Confirm before replace | Yes |
| “Start with an empty wardrobe” when data already exists | Does not wipe. Toast says the wardrobe is still there. Wipe is a separate confirm. | Yes |
| Screen reader on the grid | Cards are links in a list. Count updates in a polite live region. | Implemented. Not tested with a real screen reader in this case study. |
| Keyboard | Skip link, visible focus, dialog focus trap, Escape | Implemented in the prototype. Not formally audited. |

## Not handled

- Multiple devices or a deleted photo that still exists on a server. There is no server.
- HEIC photos from some phones. The error asks for JPEG, PNG, WEBP, or GIF.
- Laundry, lent-out, or “at the cleaners.”
- Time zones for “worn today.” The date is the browser’s local date.
- Concurrent tabs. Last write to `localStorage` wins.
