# Wireframe annotations

**Date:** 22 October 2026

The SVG files carry the same notes in the right-hand column. This page collects the design intent so a review does not depend on opening every file.

## Across the set

1. The limit is visible before a comparison, and it stays available after.
2. There is no score, gauge, or hireability label. Frames that mention a score do so only to say there is not one.
3. Maya Chen is optional and named as fiction.
4. A person can finish the core path without pasting a resume.
5. "Not in your list" is an inventory fact. The empty comparison frame exists so a blank profile is not a wall of gaps.
6. Extras are labeled as skills that still count.
7. The first plan shows three actions, each with an outcome and a first step.
8. Delete and unreadable-data frames make the destructive step explicit.
9. Touch targets in the frames are 44px. The note at the bottom of each SVG states the 720px behavior.
10. Color is not used in the wireframes. Status in the high-fidelity UI adds a word, not color alone.

## Frame-specific notes

| File | Note the annotation column is there to make |
| --- | --- |
| `wf-01-welcome.svg` | Limit before data. Sample is a choice. |
| `wf-02-goals.svg` | Stretch role is labeled as a larger jump. Custom role is on the same page. |
| `wf-03-role-profile.svg` | Source and date are a region, not a footnote. |
| `wf-04-skills.svg` | Evidence is something the person wrote. Remove is separate from edit. |
| `wf-05-add-skill.svg` | Proficiency and confidence are two questions. |
| `wf-06-import.svg` | The paste warning names data the product does not need. |
| `wf-07-import-review.svg` | Defaults are practicing and low confidence. Checkboxes are the save. |
| `wf-08-comparison.svg` | Sentence first, then rows. Plan is the primary forward action. |
| `wf-09-gap.svg` | The why belongs to the profile. The person can hide it. |
| `wf-10-roadmap.svg` | Three items. Save is explicit. |
| `wf-11-action.svg` | Status is a choice of three, with undo. Link is an example, not a course assignment. |
| `wf-12-progress.svg` | The meter is actions marked done, not skills mastered. |
| `wf-13-settings.svg` | Copy is a backup of saved profile data, not of the paste. |
| `wf-14-empty-comparison.svg` | Empty is not a failing grade. |
| `wf-15-unreadable-data.svg` | Corrupt data is preserved until a deliberate delete. |

## How to regenerate

From `04-CareerNavigator`:

```powershell
node assets/wireframes/build-wireframes.mjs
```

The script writes the SVG files next to itself. Edit the screen list in that script, then regenerate. Do not hand-tune a single SVG and expect the change to survive a rerun.
