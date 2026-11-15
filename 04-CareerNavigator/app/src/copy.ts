import type { ActionStatus, Confidence, Importance, MatchStatus, Proficiency } from "./types";

export const PRODUCT = "SkillBridge";

export const UVP = "Turn the skills you already have into a clear path to your next role.";

export const LIMITATION =
  "This compares what you entered with a role profile. It does not predict hiring, pay, or interviews.";

export const NOT_A_SCORE =
  "There is no match score. These counts describe your entries. They are not a grade.";

export const SAMPLE_NOTE =
  "Maya Chen is fictional. This sample stays in this browser until you delete it.";

export const PROFICIENCY: Record<Proficiency, { label: string; hint: string }> = {
  exploring: { label: "Exploring", hint: "I am learning what this is. I have not used it on real work." },
  practicing: { label: "Practicing", hint: "I have used this a few times, with help." },
  comfortable: { label: "Comfortable", hint: "I do the routine work." },
  strong: { label: "Strong", hint: "I can handle the messy cases and show someone else." },
};

export const CONFIDENCE: Record<Confidence, { label: string; hint: string }> = {
  low: { label: "Low", hint: "I am guessing." },
  medium: { label: "Medium", hint: "I can think of an example." },
  high: { label: "High", hint: "I can point to recent work." },
};

export const IMPORTANCE: Record<Importance, { label: string; hint: string }> = {
  core: { label: "Core", hint: "The profile treats this as regular work in the role." },
  supporting: { label: "Supporting", hint: "Useful, and not the first thing the profile emphasizes." },
};

export const STATUS: Record<MatchStatus, { label: string; definition: string }> = {
  matched: {
    label: "Matched",
    definition: "You say you already do this at the level the profile describes, and you are fairly sure.",
  },
  partial: {
    label: "Partial",
    definition: "You have a start, or you are not sure yet. The profile treats this as regular work.",
  },
  missing: {
    label: "Not in your list",
    definition: "This skill is not in your list yet. Add it if you already do it.",
  },
};

export const ACTION_STATUS: Record<ActionStatus, string> = {
  "not-started": "Not started",
  doing: "Doing",
  done: "Done",
};

export const RESOURCE_NOTE = "Example link for this prototype. Not a complete course and not an endorsement.";

export const CURATED_SOURCE =
  "Illustrative profile written for this prototype on 22 Oct 2026. It is not an O*NET occupation, an employer job description, or a practitioner-reviewed standard. A production profile would name an editor and a review date.";

export const PROFILE_UPDATED = "22 Oct 2026";

export const ROLE_FAMILY = "Customer, operations, and coordination";

export const CUSTOM_SOURCE = "You wrote this profile. It is not a reviewed occupational standard.";

export const PASTE_WARNING =
  "If this paste includes a phone number, address, or date of birth, you can delete it after review. SkillBridge does not store the paste, and it does not need those details.";

export const EMPTY_SKILLS_COMPARE =
  "Add the skills you already use. Then this page sorts them into matched, partial, and not in your list. An empty list is not a gap report.";
