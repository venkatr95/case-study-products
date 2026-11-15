# High-fidelity screen specifications

**UI:** The TypeScript prototype in `app/`. Paper theme, components in `05-ui-design-system/components.md`.
**Sample data:** Maya Chen is fictional. Profiles are illustrative, dated 22 Oct 2026.
**Date:** 22 October 2026

Desktop is a 1080px column. Below 720px, navigation wraps and role cards become one column. Every screen uses the header, the footer line "Guidance, not a hiring prediction…", and `data-screen`.

## S-01 Welcome

**Components:** Kicker, H1 (the UVP), lede, three bullets, card "What this is not," primary and ghost buttons, hint.
**Task:** Acknowledge the limit and choose a start.
**Primary:** Choose a role → `#/goals`. If they already have a goal or skills and have passed welcome once, the primary becomes Continue and uses `continueHash`.
**Secondary:** Explore with Maya's sample. If they already have work, the replace dialog opens.
**Responsive:** Narrow measure. The UVP wraps to three or four lines on a phone.
**States:** Form error if a transition fails. Sample note always visible.

## S-02 Goals

**Components:** H1, lede, role cards, custom-role card with two fields.
**Content:** Five roles from `app/src/data/roles.ts`. Stretch copy on junior data analyst. Current goal chip if one is selected.
**Primary per card:** Use this role, or Open this goal. Choosing a different role opens the change-goal dialog. Skills stay. Actions stay with the previous role.
**Secondary:** Read the profile → `#/goals/:id`.
**Validation:** Custom name and summary required. Failures stay in the fields.

## S-03 Role profile

**Components:** Kicker (Profile preview or Your goal), H1, family meta, summary, source card, ordered list of skill cards with importance chip, definition, and why.
**Task:** Decide whether this profile is the goal, and see who wrote it.
**Primary:** Preview uses "Use this as my goal." The saved goal uses "Compare with my skills."
**Secondary:** Edit this profile, Back to roles, Change role.
**Empty:** No role: "Choose a role first." Zero requirements: empty card pointing at edit.
**States:** Added-by-you meta on custom requirements.

## S-04 Edit profile

**Components:** Stack of requirement cards, Hide button, hidden list with Restore, add form (select, importance, why).
**Task:** Make the profile match the role they mean.
**Validation:** "Choose a skill." Why must be at least 8 characters. Values rehydrate.
**Copy:** Hiding does not delete the illustrative source or existing actions.

## S-05 Skills

**Components:** Skill cards (name, proficiency, confidence, evidence, source), Add a skill, Paste resume text.
**Task:** Build the inventory that the comparison will read.
**Empty:** Asks for skills they already use. Does not list gaps.
**Remove:** Dialog names the skill. Related actions are kept until removed separately.

## S-06 Skill form

**Components:** Skill select, or a preset from `?skill=`. Radio groups for proficiency and confidence. Optional evidence textarea.
**Task:** Record a self-assessment without a test.
**Primary:** Save skill → `#/skills`.
**Validation:** Skill, both ratings. Duplicate rejected. Custom skill name, if offered, needs a definition the person writes.
**Preset:** From a gap, the skill is selected and the person still must choose both ratings.

## S-07 Import

**Components:** Paste warning, textarea, Use the practice resume, Find suggestions.
**Task:** Offer text. Nothing is stored.
**Practice text:** Maya's fictional resume in `sample.ts`. It is labeled as practice.
**Errors:** Empty, too long (over 12,000 characters), or no known phrases. The page stays here.
**Offline:** Works. Extraction is local.

## S-08 Import review

**Components:** One card per suggestion. Unchecked checkbox. Snippet in quotes. Proficiency select defaulting to Practicing. Confidence select defaulting to Low. Disabled primary until a box is checked.
**Task:** Confirm. Unchecked rows are discarded. Checked rows save as `confirmed-paste`.
**Refresh:** The paste and the suggestions are gone. Empty state links back to paste.
**Omitted:** If more than 12 phrases matched, a sentence says the rest were not shown.

## S-09 Comparison

**Components:** Limitation banner. Narrative. Core line. "There is no match score." Definition list. Filter buttons. Row cards. Extra section.
**Task:** Understand the fit in words, then go to a plan.
**Primary:** Review a small plan.
**Maya fixture:** "You listed 7 skills. 1 matches this profile and 2 are partial. 6 profile skills are not in your list yet, including 4 core skills. 4 skills you listed are not in this profile, and they still count."
**Empty skills:** Limitation, empty card, add or paste, then a plain "This profile includes" list with no status chips.
**No role:** Empty card to choose a role.
**Filters:** All, core, supporting, matched, partial, not in your list, extras. Pressed state is `aria-pressed`.

## S-10 Gap

**Components:** Status chip, definition, why, the person's entry if any, evidence prompt from the action template, resource list if any.
**Primary:** Add this skill, Update my level, Add a learning action, or Open the action if one exists.
**Secondary:** "This is not part of the role I mean" hides the requirement. Back to the comparison.
**Missing template:** Still shows the why. Resource block says no example is attached when the template has none.

## S-11 Roadmap

**Components:** Limitation. Lede that mentions matched core skills, or warns that none are matched yet. Sentence that the first plan is three actions. Either an empty card with Save my first three actions, or an ordered list.
**After save:** Each card has a title, status chip, outcome, first step, Open action.
**More gaps:** "Next gaps you have not saved" and Add the next gap.
**Own action:** Add my own action → `#/roadmap/new`.
**No skills:** The save path is replaced by Add a skill so the plan is not built on an empty inventory.

## S-12 Action

**Components:** Status group when the action exists. Form: title, outcome, first step, evidence, note. Resource block with a keep checkbox defaulting to on. Remove.
**Task:** Make the action true, or mark it.
**Status:** Not started, Doing, Done. Toast "Marked …" and Undo. Undo returns the previous status.
**New:** "Add your own action." Outcome and first step are required and must be long enough to be a real step (the transition rejects empty and very short text).
**Link:** `provider: topic`, new tab, example note.

## S-13 Progress

**Components:** Limitation. Sentence "You marked N of M actions done." Meter with `aria-label="Actions you marked done"` and values as counts, not a displayed percentage. Rows with status word and Update. Reflection form.
**Empty:** "No actions to track yet" and a line that progress is not a score.
**Note limit:** 2,000 characters. Over that, the error shows and the previous note remains.

## S-14 Settings

**Components:** Name form (optional, 80 characters). What is saved, including the sample flag. Copy saved data. Limits card. Delete zone.
**Copy:** Opens a dialog with the JSON. The toast says the paste is not included. If the clipboard fails, the dialog still shows the JSON so they can copy it by hand.
**Delete:** Confirm dialog. Reset sample is a separate confirm when `usingSample` is true.

## S-15 Unreadable data

**Components:** H1, the validator or parser message, a sentence that the old value is still stored, one danger button.
**No nav forward** into a blank profile until they delete. Header hides primary nav on this screen.

## S-16 Not found

**Components:** H1, explanation, Go to the start. Primary nav is hidden so a bad link is not surrounded by a full app chrome that implies the route exists. Settings remains.

## Shared chrome states

| State | UI |
| --- | --- |
| Sample | Banner under the header on every screen except welcome. |
| Offline | "You are offline. Saved data on this browser still works. Resource links may not open." `navigator.onLine` drives it. |
| Toast | Status region. Undo when the last change was a status. |
| Footer | Source date and the hiring limit, on every screen including errors. |
