# Content and microcopy

**Source:** `app/src/copy.ts` and the page strings in `app/src/ui/`.
**Date:** 22 October 2026

## Principles

- Say what the product did with their entries. Do not say what an employer will do.
- Use "not in your list" for absence. Use "partial" for a start or for low confidence. Use "matched" only for comfortable or strong plus medium or high confidence.
- Counts are sentences. "There is no match score. These counts describe your entries. They are not a grade."
- Name fiction. Maya Chen is fictional. Profiles are illustrative.
- Button labels are verbs with an object: "Add a skill," "Save my first three actions," "Delete saved data."
- Errors name the fix. "Choose a skill." "Keep the note under 2000 characters."
- Do not use: hireability, match rate, top applicant, you failed, missing skills as a red headline, guaranteed, or "AI found."

## Strings that must stay stable

| Key | String |
| --- | --- |
| Product | SkillBridge |
| UVP | Turn the skills you already have into a clear path to your next role. |
| Limitation | This compares what you entered with a role profile. It does not predict hiring, pay, or interviews. |
| Not a score | There is no match score. These counts describe your entries. They are not a grade. |
| Sample | Maya Chen is fictional. This sample stays in this browser until you delete it. |
| Curated source | Illustrative profile written for this prototype on 22 Oct 2026. It is not an O*NET occupation, an employer job description, or a practitioner-reviewed standard. A production profile would name an editor and a review date. |
| Custom source | You wrote this profile. It is not a reviewed occupational standard. |
| Paste | If this paste includes a phone number, address, or date of birth, you can delete it after review. SkillBridge does not store the paste, and it does not need those details. |
| Empty comparison | Add the skills you already use. Then this page sorts them into matched, partial, and not in your list. An empty list is not a gap report. |
| Resource | Example link for this prototype. Not a complete course and not an endorsement. |
| Footer | Guidance, not a hiring prediction. Sample role profiles are illustrative and were written for this prototype on 22 Oct 2026. |

## Ratings

| Proficiency | Hint |
| --- | --- |
| Exploring | I am learning what this is. I have not used it on real work. |
| Practicing | I have used this a few times, with help. |
| Comfortable | I do the routine work. |
| Strong | I can handle the messy cases and show someone else. |

| Confidence | Hint |
| --- | --- |
| Low | I am guessing. |
| Medium | I can think of an example. |
| High | I can point to recent work. |

| Status | Definition |
| --- | --- |
| Matched | You say you already do this at the level the profile describes, and you are fairly sure. |
| Partial | You have a start, or you are not sure yet. The profile treats this as regular work. |
| Not in your list | This skill is not in your list yet. Add it if you already do it. |

## Destructive confirms

| Dialog | Confirm | Cancel |
| --- | --- | --- |
| Delete saved data? | Delete saved data | Keep my data |
| Remove skill | Remove skill | Keep skill |
| Remove action | Remove action | Keep action |
| Replace with Maya's sample? | Use the sample | Keep my profile |
| Start your own profile? | Delete and start over | Keep this profile |
| Reset Maya's sample? | Reset sample | Keep my edits |
| Change goal | Change goal | Keep the current goal |
| Delete the pasted text? | Delete pasted text | Keep the paste |

Change goal is the one confirm that is not danger-colored. The body says skills stay and previous actions remain available if they switch back.

## Voice examples

**Do:** "4 skills you listed are not in this profile, and they still count."

**Do:** "None of the core skills are matched yet. That can happen when your experience uses different words. Check the comparison before you treat these as gaps."

**Do not:** "You are 18% qualified for product operations."

**Do not:** "AI extracted 7 skills from your resume." The review screen says a phrase was found and that it is not saved until they check it.
