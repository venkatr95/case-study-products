# Edge cases

| Case | Behavior | Where |
| --- | --- | --- |
| No preferences | Compare is disabled. The trip screen explains why. | S03 |
| Custom with every setting off | Allowed after an explicit save. Routes use "No access preferences selected" and still list known barriers. | S02, S04 |
| Same place twice | Alert: choose two different places. | S03 |
| Sample current location swapped | Treated as Cal Anderson Park so the destination is a real place id. | S03 |
| Outside the pilot | No geometry. The place is named. | S17 |
| In the pilot, no sample path | No geometry. Copy refuses to call the walk impossible. | S17 |
| All routes conflict | Headline says nothing matches on confirmed data. Cards remain. | S11 |
| Grade equal to the limit | Within the limit. 12% does not conflict with a 12% stroller cap. | Volunteer climb |
| Grade unknown and limit on | Unknown status. Not a match. | Pike Street |
| Community says "no stairs" | Unknown, copy says it is not confirmed. | Rule, covered by a unit test |
| Community says "stairs" or files a blocking barrier | Conflict, labeled not verified. | Rule |
| Uneven surface report | Note. Does not change fit, because surface is not a setting. | Pike and Seneca |
| Unknown surface on an otherwise clean route | Note. Match can stand. | Western Avenue |
| Two entrance reports | Both shown. Attribute stays unknown if no confirmed source. | South arcade |
| Verified elevator outage | Conflict plus source, time, and "sample feed, not live." | Station elevator route |
| Report too short | Error summary. Nothing stored. | S08 |
| Offline submit | Error. Draft kept. | S08, S13 |
| Offline compare | Offline screen. No cards. | S13 |
| Service error | Error screen. No cards. | S12 |
| Withdraw | Status becomes Withdrawn. Row remains. | S09 |
| Delete preferences | Confirm dialog. Storage cleared. | S10 |
| Large text | 125% and 150% root size. Controls remain at least 44px at default. | Chrome |
| Keyboard | Buttons and forms are native controls. Tabs move List/Map. Escape closes dialogs. Focus wraps inside a dialog. | Prototype |
| HTML in a report | Escaped when rendered. | Tested |
| Reduced motion | Comparison delay dropped to zero. | Prototype |
| Refresh | Returns home. Saved preferences, reports, and recent trips remain in the browser. The in-memory trip does not. | Known limit |

## Not handled

- Real GPS, real routing, conflicting-report resolution by a moderator, sync across devices, and a screen-reader pass with VoiceOver or NVDA. The last is listed as validation still to do.
