# Interaction states

**Date:** 22 October 2026

States below are implemented in the prototype unless a row says otherwise.

## Global

| State | Behavior |
| --- | --- |
| First visit | Welcome. Primary is Choose a role. |
| Return with a goal or skills | Primary is Continue. Destination follows the continue rule. |
| Sample loaded | Banner on screens other than welcome. Settings offers reset and delete. |
| Offline | Status banner. Saved data still renders. |
| Online again | Banner drops when the browser fires online. |
| Save throws | Alert text: the change is on screen and may disappear on refresh. |
| Corrupt storage | S-15 only. Primary nav hidden. Data not overwritten. |
| Unknown route | S-16. Data unchanged. |
| Dialog open | Cancel focused. Escape cancels. Tab cycles at the ends. |
| Toast | Polite live region, placed above the page content so it does not cover the next card. Undo only for a status change. A route change clears it. The status buttons remain. |

## Per step

| Step | Empty | Error | Success |
| --- | --- | --- | --- |
| Goals | The five roles are always listed. Custom form can be blank. | Name or summary missing. | Goal saved. Change later asks first. |
| Role edit | No requirements: the add form is the page. | Choose a skill. Why under 8 characters. | List updates. Hidden group appears. |
| Skill form | Selects and radios unset. | Missing choice. Duplicate skill. | Returns to the list with the new row. |
| Paste | Textarea empty. | Empty, over 12,000 characters, or no phrases. | Review screen. |
| Review | After refresh: nothing to review. | Primary stays disabled with zero checks. | Checked skills appear on the list as confirmed from paste. |
| Comparison | No role, or no skills. | None beyond those empties. | Narrative plus rows. |
| Roadmap | No actions: save three, or add a skill first if the list is empty. | Action fields too short if they write their own. | Ordered cards. |
| Action status | Not started is the generated default. | Remove asks. | Toast "Marked …" and pressed Done, Doing, or Not started. |
| Progress | No actions: explanation that this is not a score. | Note over 2,000 characters. | "You marked N of M actions done." |
| Settings | "Nothing meaningful is saved yet." | Name over 80 characters. | Copy dialog. Delete returns to an empty welcome. |

## Disabled

The import confirm button is disabled until a checkbox is on. A hint says so. It is not the only instruction.

Filter and status controls are never disabled. The current one is pressed.

## Permission

There is no signed-in permission. The danger zone is the permission boundary: delete and reset require a second click. Cancel is the default focus so Enter does not destroy data immediately on open. Confirm is a separate button.

## Not implemented

A skeleton loader, a retry for a failed font request, a conflict dialog for two tabs, and a dark theme.
