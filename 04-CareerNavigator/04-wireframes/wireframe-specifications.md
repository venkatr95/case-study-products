# Wireframe specifications

**Canvas:** 1120px wide. Phone frame at x=36, y=92, 390 × 844, 28px corner radius. Content column x=56, width 340, starting at y=168 so it clears the SkillBridge wordmark. Annotation column at x=470.
**Type in the frames:** Georgia for headings, Segoe UI for UI text. Grayscale only.
**Behavior at 720px and above:** The prototype, not the wireframe, widens cards into a wrapping grid. The wireframe shows the narrow column because that is where comparison text is most likely to feel like a verdict.
**Date:** 22 October 2026

Each screen uses realistic copy. Boxes are structure, not empty placeholders.

## S-01 Welcome — `wf-01-welcome.svg`

**Goal:** See the limit before any data.
**Regions:** Kicker, UVP, three-line explanation, "What this is not" card, primary "Choose a role," secondary "Explore with Maya's sample," fiction note.
**Primary action:** Choose a role.
**Validation:** None.
**States:** Returning visitors with a goal see Continue instead of Choose a role. That state is in the prototype, not a second frame.
**Accessibility:** The limit is text, not an icon. Sample control is a button, not a silent preload.

## S-02 Goals — `wf-02-goals.svg`

**Regions:** Step label, five role cards (four in the family, one stretch), custom-role form with name and one-sentence summary.
**Content:** Product operations associate, Customer success associate, Business analyst, Project coordinator, Junior data analyst. Stretch card says a long gap list is a description of the profile, not a verdict.
**Primary:** Use this role. **Secondary:** Read the profile.
**Validation:** Custom role needs a name and a summary. Empty submit stays on the form.
**Empty:** The list is never empty. The custom form is the escape.

## S-03 Role profile — `wf-03-role-profile.svg`

**Regions:** Name, family, summary, source card with the 22 Oct 2026 limitation, ordered skills with Core or Supporting and a why.
**Primary:** Compare with my skills, or Use this as my goal on a preview.
**Secondary:** Edit this profile. Change role.
**Loading:** Profiles are local. No spinner.
**Permission:** Anyone using the browser can edit their copy. They cannot publish over the illustrative source.

## S-04 Edit profile

**Not a separate SVG.** Layout follows S-03's list plus a form.
**Regions:** Each requirement has Hide. A hidden list has Restore. A form has skill, core or supporting, and why.
**Validation:** Skill required. Why at least 8 characters. Errors keep the typed why.
**Copy:** Hiding removes it from this comparison. It does not delete the original illustrative profile.

## S-05 Skills — `wf-04-skills.svg`

**Regions:** Inventory cards with proficiency, confidence, and evidence. Actions: Add a skill, Paste resume text.
**Empty:** Title asks them to add skills they already use. It does not say they have gaps.
**Row actions:** Edit. Remove opens a confirm.

## S-06 Add skill — `wf-05-add-skill.svg`

**Fields:** Skill (select), proficiency (four options with hints), confidence (three options with hints), optional recent-work note.
**Primary:** Save skill.
**Validation:** Skill, proficiency, and confidence required. Duplicate skill is rejected. The note is optional and local.
**Disabled:** Save is available; errors appear after submit so keyboard users are not blocked by a silent disabled button.

## S-07 Paste — `wf-06-import.svg`

**Regions:** Warning about phone, address, and date of birth. Textarea. Practice resume button. Find suggestions.
**Validation:** Empty text and text over 12,000 characters do not extract. The paste is not saved.
**Offline:** Extraction is local. It works offline.

## S-08 Review — `wf-07-import-review.svg`

**Regions:** One card per suggestion, checkbox, the phrase that matched, default Practicing and Low. Nothing is checked by default in the intended review. The person checks what is true.
**Primary:** Add the skills I checked. The button stays disabled until one checkbox is on.
**Secondary:** Delete pasted text, which confirms if text remains.
**Error:** A refresh drops the paste. The review page then says nothing is waiting and links back to paste. Unchecked rows are not saved.

## S-09 Comparison — `wf-08-comparison.svg`

**Regions:** Limitation line. Narrative sentence. Core line. Definitions for matched, partial, and not in your list. Filters. Rows. Extras that "still count."
**Primary:** Review a small plan.
**Content rule:** Lead with "You listed N skills." No gauge.
**Maya example in the frame:** The frame uses the same story as the engine: one match, partials, and extras that are not failures.

## S-09 empty — `wf-14-empty-comparison.svg`

**Regions:** Empty card. "An empty list is not a gap report." Links to add a skill or paste text. Below that, "This profile includes" lists skill names and core or supporting, with no match chips.
**Must not show:** Those skills marked "not in your list," and no red gap wall.

## S-10 Gap — `wf-09-gap.svg`

**Regions:** Skill name, status, definition, why it is in the profile, the person's own entry if any.
**Primary:** Add it to my skills, or Add an action, depending on status.
**Secondary:** Hide from my comparison.

## S-11 Roadmap — `wf-10-roadmap.svg`

**Regions:** Up to three proposed actions with outcome and first step. Save my first three actions. After save, the list is the saved plan with status.
**Primary:** Save, then Open action.
**Empty:** If the profile has no gaps left, the page says so and offers a custom action. It does not invent busywork.

## S-12 Action — `wf-11-action.svg`

**Fields:** Title, outcome, first step, status (Not started, Doing, Done), optional example link with provider and topic.
**Undo:** Toast after a status change.
**Resource absent:** The page says there is no example link for this action. It does not show a broken button.

## S-13 Progress — `wf-12-progress.svg`

**Regions:** "You marked N of M actions done." The meter is that fraction only. Each action shows the status word and an Update link. The three status buttons live on S-12. Reflection textarea, 2,000 characters.
**Empty:** No actions yet. Link to the roadmap. The note says progress is not a score.

## S-14 Settings — `wf-13-settings.svg`

**Regions:** Optional name. Counts of skills and actions. Sample flag. Copy saved data. Limits. Delete.
**Permission:** Delete is confirmed. There is no server copy to restore.

## S-15 Unreadable — `wf-15-unreadable-data.svg`

**Copy:** Previous data is still in this browser. Clearing it is permanent. SkillBridge will not overwrite it unless asked.
**Primary:** Delete the unreadable data and start over. One danger button. No second path that "repairs" unknown JSON.

## S-16 Not found

**Copy:** "That page is not in SkillBridge." The link may be mistyped. Saved profile is unchanged.
**Primary:** Go to the start.

## Shared states

| State | Treatment |
| --- | --- |
| Loading | Local data. Buttons do not show a spinner. Example links are ordinary anchors. |
| Success | Toast or the next screen. Status text is also in the button state, not only in color. |
| Disabled | Filters and status use `aria-pressed`, not a gray that is the only signal. |
| Offline | Shell and saved data work. Fonts fall back to Palatino and Segoe UI. |
| Error | Text next to the form, also announced in the polite live region. |
