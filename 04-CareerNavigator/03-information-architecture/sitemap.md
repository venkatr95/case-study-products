# Sitemap

**Product:** SkillBridge
**Navigation:** Hash routes in a single page. Five primary items, plus Settings and the wordmark home.
**Date:** 22 October 2026

```mermaid
flowchart TD
  welcome["S-01 Welcome #/welcome"]
  goals["S-02 Goals #/goals"]
  preview["S-03 Profile preview #/goals/:id"]
  role["S-03 Your goal #/role"]
  edit["S-04 Edit profile #/role/edit"]
  skills["S-05 Skills #/skills"]
  form["S-06 Skill form #/skills/new and #/skills/:id"]
  import["S-07 Paste #/import"]
  review["S-08 Review #/import/review"]
  compare["S-09 Comparison #/compare"]
  gap["S-10 Gap #/compare/:skillId"]
  roadmap["S-11 Roadmap #/roadmap"]
  action["S-12 Action #/roadmap/:id and #/roadmap/new"]
  progress["S-13 Progress #/progress"]
  settings["S-14 Settings #/settings"]
  bad["S-15 Unreadable data"]
  missing["S-16 Not found"]

  welcome --> goals
  welcome --> compare
  goals --> preview
  preview --> role
  goals --> role
  role --> edit
  role --> compare
  skills --> form
  skills --> import
  import --> review
  review --> skills
  compare --> gap
  compare --> roadmap
  roadmap --> action
  gap --> action
```

## Primary navigation

| Label | Route | Current when |
| --- | --- | --- |
| Goal | `#/goals` | Goals, preview, role, edit |
| Skills | `#/skills` | Skills, skill form, import, review |
| Comparison | `#/compare` | Comparison, gap |
| Roadmap | `#/roadmap` | Roadmap, action |
| Progress | `#/progress` | Progress |

Settings is a text link in the header, not a sixth tab. Welcome has no tab selected. The header shows the display name when one is saved.

## Continue rule

`continueHash` sends a returning person to the next unfinished step:

- No goal → `#/goals`
- Goal and no skills → `#/skills`
- Goal, skills, and no actions for that goal → `#/compare`
- Actions already saved for the goal → `#/roadmap`

## Not in the map

There is no account, no public profile, no employer area, and no resource catalog page. Example links open in a new tab from the action.

A diagram of the same primary path is in `assets/diagrams/primary-flow.svg`.
