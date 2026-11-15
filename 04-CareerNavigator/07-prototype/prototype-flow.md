# Prototype flow

**Build:** Vite + TypeScript in `app/`. No Figma prototype exists.
**Date:** 22 October 2026

## What a reviewer can do in a few minutes

1. Open the app. Read the UVP and "What this is not."
2. Choose **Explore with Maya's sample**. Maya Chen is fictional. The app opens the comparison with Product operations associate.
3. Read the sentence that starts "You listed 7 skills." Confirm there is no percentage.
4. Open one skill ("See why and what to do") and read the profile's why.
5. Choose **Review a small plan**, then **Save my first three actions**.
6. Open the first action, mark **Done**, then **Undo**.
7. Open Progress and Settings. Delete is available and asks first.

That path is the UVP: skills the person (here, a labeled sample) already has, a verbal comparison, and a short plan.

## Start and end

| | State |
| --- | --- |
| Start | Empty browser storage. Welcome. No goal, no skills. |
| End of the sample path | Goal is Product operations associate. Seven skills. Three actions. One may be done or undone. Data is in `localStorage` only. |
| End of the own-data path | A role they chose, skills they saved, and at least one action. |

## Routes used

`#/welcome` → `#/compare` (sample) → `#/compare/:skillId` → `#/roadmap` → `#/roadmap/:id` → `#/progress` → `#/settings`

The no-resume path inserts `#/goals`, `#/goals/:id`, and `#/skills/new` before the comparison.

## Rules the flow depends on

- Matched only when proficiency is comfortable or strong and confidence is medium or high.
- First plan: at most three actions, missing core first.
- Paste is not stored. Suggestions save only when checked.
- Empty skills do not render match chips.

## Known limitations of this prototype

- Five illustrative roles plus roles the person writes. Not the labor market. Not O*NET.
- Phrase lexicon, not a model. It misses paraphrases and can false-positive on a short word.
- No account, no sync, last tab wins.
- Example links can rot. Some actions have none.
- No practitioner has signed the profiles.
- Dialog background is not `inert`.
- Paper theme only.
- The progress meter uses a CSS width. The accessible value is a count. The page does not print a match percentage.

## How to run

From `app/`: `npm install`, `npm test`, `npm run dev` at `http://127.0.0.1:5174/`. `npm run build` writes `app/dist`. The default preview port in config is 4174. If that port is taken by another case study, pass another port.

## What was not built

A Figma file, a backend, analytics, accounts, job listings, salary, mentorship, and employer login.
