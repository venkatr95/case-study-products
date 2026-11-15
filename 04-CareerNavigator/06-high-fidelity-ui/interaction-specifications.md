# Interaction specifications

**Date:** 22 October 2026

## Navigation

- Hash routes. `parseHash` in `app/src/lib/routes.ts` is the map.
- Anchors that start with `#/` are handled in the page. The app calls `history` through the hash setter and re-renders.
- Unknown hashes render S-16 without changing saved data.
- Back and forward use the browser history because the route is the hash.
- There is no multi-step wizard lock. People can open Comparison before they have skills. They get the empty state.

## Input

- Click and tap use the same controls. Targets are at least 44px.
- Forms submit on Enter inside a text field. The skill, role, action, reflection, and import forms each have their own id.
- Radios and selects are native.
- A failed submit copies `FormData` back onto the new DOM so values survive the re-render.
- Import review enables "Add the skills I checked" only when at least one checkbox is on.

## Match rule

| Person's entry | Result |
| --- | --- |
| No row | Not in your list |
| Exploring or Practicing, any confidence | Partial |
| Comfortable or Strong, and Low confidence | Partial |
| Comfortable or Strong, and Medium or High confidence | Matched |

The rule is in `classify`. The screen shows the words, not the boolean.

## Roadmap generation

Order: missing core, partial core, missing supporting, partial supporting. The first save takes at most three that are not already actions. Later, "Add the next gap" takes one. The person can also write an action that is not in the suggestion list.

## Confirmation and undo

- Status change writes a toast at the top of the content and stores the previous status for Undo. The toast clears when the route changes. The status buttons remain.
- Undo sets that status again and the pressed button follows.
- Removes, deletes, sample replacement, goal change, and paste discard use the dialog. Escape and the cancel button abort. Confirm runs the change.
- There is no undo for delete-all. The dialog says it cannot be undone.

## Focus

- On dialog open, the cancel button (or Close, for the backup) receives focus.
- Tab and Shift+Tab cycle inside the dialog when focus is on an end control.
- Escape closes the dialog without confirming.
- After a filter change, focus returns to the pressed filter button.
- The practice-resume control focuses the textarea.

## Keyboard map

| Key | Result |
| --- | --- |
| Tab | Next control. Cycles inside an open dialog when at either end. |
| Shift+Tab | Previous control. |
| Enter | Activates the focused button or submits the focused form. |
| Space | Toggles the focused checkbox, radio, or button. |
| Escape | Closes a dialog if one is open. |

## Touch

The same controls. No swipe navigation, no drag-and-drop ranking, no horizontal carousel. The roadmap order is the priority order, not a manual sort. People reorder by editing or removing.

## Loading, empty, error

- No loading spinner. Data is local.
- Empty components are specified per screen in `screen-specifications.md`.
- Errors use `role="alert"` and the polite live region.
- Offline shows a status line when `navigator.onLine` is false. The line clears when the browser reports online again. Resource links can still fail if the network is down while the flag is stale. That limit is accepted.

## Persistence

- Key: `skillbridge.career-navigator.v1`.
- Resume text and the suggestion list are variables in the page session. A refresh clears them.
- Corrupt JSON loads S-15 and is not rewritten until delete.
- Two tabs can overwrite each other. Last save wins. There is no conflict UI.

## What is intentionally not interactive

- No drag to reorder skills.
- No inline edit of a comparison row's status. Status comes from the skill form.
- No way to type an arbitrary resource URL.
- No animation that carries the meaning of a state change.
