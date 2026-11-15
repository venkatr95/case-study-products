# Edge cases

**Date:** 22 October 2026

| Case | Expected behavior | Where |
| --- | --- | --- |
| No skills, comparison opened | Empty state. Profile skill names appear as contents, with no match status. | S-09, `wf-14` |
| No role, comparison or roadmap opened | Ask for a role. Do not compare against an implied default. | S-03 empty, S-09 |
| Custom role with zero requirements | Profile explains that they need to add skills. Comparison has nothing to classify. | S-03, S-04 |
| All profile skills matched | Narrative says every profile skill matches something they entered, and that this is not a hiring decision. Extras still mentioned. | Comparison engine |
| Skill listed but exploring, or comfortable with low confidence | Partial, not matched. | `classify` |
| Comfortable or strong, with medium or high confidence | Matched. | `classify` |
| Skill not in the profile | Extra. Copy says it still counts. | S-09 |
| More than three gaps | The suggestion list stops at three. The person can add another action. | S-11 |
| No remaining gaps | No fake actions. Offer a custom action. | S-11 |
| Resume with no known phrases | Stay on paste. Tell them nothing was found. Do not invent skills. | S-07 |
| Resume longer than 12,000 characters | Reject with a message. Do not truncate silently. | S-07 |
| More than 12 phrase hits | Keep the first 12 suggestions. | Extractor |
| Suggestion left unchecked | Not saved. | S-08 |
| Paste includes a phone number | Warning tells them to delete it. The product does not parse or store contact fields. | S-07 |
| Duplicate skill | Reject. Keep the earlier row. | S-06 |
| Why text shorter than 8 characters | Reject the new requirement. | S-04 |
| Hide a requirement that has an action | Requirement leaves the comparison. The action remains. | S-04 |
| Change goal | Skills remain. Actions for the previous goal remain on that goal. | State |
| Load sample over real work | Confirm dialog. Cancel keeps the work. | S-01 |
| Edit Maya's skills | `usingSample` stays true until they delete or start their own profile. | Settings |
| Mark done, then undo | Status returns. Toast offers undo. Buttons expose pressed state. | S-12 |
| Reflection longer than the allowed note | The save result explains the limit. The rest of the profile is unchanged. | S-13 |
| Corrupt JSON in localStorage | S-15. Value not overwritten on load. | S-15 |
| Storage throws | Message that the change may disappear on refresh. | Save path |
| Unknown hash | S-16. State unchanged. | S-16 |
| Keyboard only | Skip link, visible focus, labeled fields, pressed toggles, dialog focus. | Accessibility doc |
| Reduced motion | CSS shortens transitions. | `styles.css` |
| Forced colors | System colors replace the paper theme. | `styles.css` |
| Very long skill note or role summary | Text wraps. It is not truncated with an ellipsis that hides the only copy. | Cards |
| Two roles in two tabs | Last write wins. There is no merge. Documented limitation. | Prototype review |
| Offline fonts | Palatino and Segoe UI. | `index.html` fallbacks |
| Example link | New tab, noopener, provider and topic visible. | S-12 |

## States the PRD asks for

| State | Decision |
| --- | --- |
| Loading | Not a network app. No skeleton screens. |
| Empty | Skills, comparison, roadmap, progress, and a custom profile. |
| Error | Form errors and the unreadable-data screen. |
| Success | Toast and the updated pressed button. |
| Permission | No accounts. Delete is the permission boundary, and it is confirmed. |
| Offline | Usable for saved data. Not a sync product. |

## What was not designed a screen for

A session timeout, a paywall, a share link, and a print report. They are out of scope. Adding them would imply an account or an audience the PRD excludes.
