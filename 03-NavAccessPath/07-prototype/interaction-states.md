# Interaction states

| Surface | Default | Loading | Empty | Error | Success | Disabled | Other |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Preferences | No radio until a set exists, or the saved set | — | — | — | Notice: saved, or used for this trip | — | Delete confirm |
| Trip | Empty selects | — | Preferences missing prompt | Same place. Missing fields if Compare is forced | — | Compare | Location dialog. Permission denied copy |
| Results | Three sample routes | "Comparing routes…" | Outside pilot. No data for the pair. No confirmed match, with cards | Routing unavailable. Offline | Choice notice lives on detail | — | Shortest sort warning |
| Detail | Segments | — | Missing route message | Service notice is a data state, not an error | Route chosen, with undo | — | Segment highlighted |
| Entrance | Attributes and reports | — | "No reports for this entrance in the sample." | — | — | — | Two pending reports |
| Report form | Place prefilled when opened from a segment | — | — | Validation summary. Offline refusal | Navigates to status | Submit still clickable so the error can be explained | Draft kept |
| Report status | Pending | — | No report selected | — | Withdrawn | — | Sample verified row is on the list, not on this screen |
| Saved | Stored set | — | Nothing saved | — | Delete notice | — | — |
| Location | Dialog | — | — | — | Sample start filled | — | Not now |

## Focus

- Navigation and dialogs move focus to the heading or the dialog's first button.
- Field changes restore focus to the control that has a stable id.
- Typing in the description does not rerender, so the cursor stays.

## Persistence

| Key | Content |
| --- | --- |
| `accesspath.preferences.v1` | Preference object |
| `accesspath.reports.v1` | Pending and withdrawn reports |
| `accesspath.recent.v1` | Up to five chosen routes |
| `accesspath.text-scale.v1` | 100, 125, or 150 |

Reset is in the prototype controls. It does not exist as a product setting beyond Delete preferences and Withdraw.
