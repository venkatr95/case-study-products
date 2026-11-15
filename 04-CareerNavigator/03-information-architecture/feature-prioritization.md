# Feature prioritization

**Method:** MoSCoW from the PRD, then a second cut for what the prototype actually includes.
**Date:** 22 October 2026

Impact and effort below are design judgments for this portfolio build. They are not estimates from a team.

## MoSCoW

| Item | PRD | In the prototype | Why this cut |
| --- | --- | --- | --- |
| Goal selection and custom role | Must | Yes | FR-01. The job starts with a role. |
| Skills with proficiency and confidence | Must | Yes | FR-02. |
| Editable role profile with source | Must | Yes | FR-01 and the outdated-profile risk. |
| Comparison: matched, partial, missing, with definitions | Must | Yes | FR-03. Labels say "Not in your list." |
| Roadmap of small actions | Must | Yes, cap of 3 on the first save | FR-04 and the overwhelm risk. |
| Save, edit, complete, undo | Must | Yes | FR-05. |
| Limitations and delete | Must | Yes | Trust and NFR. |
| Resume paste with review | Should | Yes, phrase lexicon, cap 12 | FR-06. Not a model. |
| Labeled learning links | Should | Five examples; some actions have none | FR-07. "When available." |
| Progress and reflection | Should | Yes | One note, local. |
| Job listings | Could | No | Needs a licensed source. |
| Mentorship | Could | No | Trust and safety work not started. |
| Portfolio projects | Could | No | Easy to fake as advice. |
| Regional pay | Could | No | PRD requires a validated source first. |
| Match score | Not in PRD | Refused | Conflicts with the guardrail. |
| Employer ranking | Non-goal | Absent | Non-user. |
| Accounts and sync | Not in PRD | Absent | Browser storage is enough to test the job. |

## Requirement traceability

| ID | Acceptance criterion | Screens | How to tell it works |
| --- | --- | --- | --- |
| FR-01 | A listed or custom role shows a profile with its source or explanation. | S-02, S-03, S-04 | Source card includes the date. Custom roles say the person wrote them. |
| FR-02 | A skill with self-assessed proficiency can be saved, revised, and removed. | S-05, S-06 | List updates. Remove asks for confirmation. |
| FR-03 | Matched, partial, and missing skills show understandable definitions. | S-09, S-10 | Definitions are visible. Narrative has no percentage. Empty list is not a gap report. |
| FR-04 | Each roadmap action has an outcome and can be edited. | S-11, S-12 | Outcome field and first step. Custom action allowed. |
| FR-05 | Marking complete updates progress and can be undone or revised. | S-12, S-13 | Status buttons, toast undo, meter uses done/total. |
| FR-06 | Pasted text produces proposals. Nothing is saved without confirmation. | S-07, S-08 | Unchecked suggestions are dropped. Paste is not in the backup. |
| FR-07 | Available links name a provider and a topic and open separately. | S-12 | Anchor has provider, topic, and `target="_blank"` with `rel="noopener noreferrer"`. |

## Release checks from the PRD

| Check | Where |
| --- | --- |
| Goal and skills without a resume | Flow A |
| Gaps are explainable and editable | S-10 and S-04 |
| Actions are concrete and trackable | S-12 status |
| The tool does not predict hiring | S-01, banner, S-14, comparison copy |
| The plan feels actionable rather than overwhelming | Not confirmed. Usability scenario U4. |

## Impact / effort, for sequencing only

| Change | User impact if the hypothesis holds | Effort | Sequence |
| --- | --- | --- | --- |
| No-score comparison | High. It is the trust decision. | Already built | Keep |
| Three-action cap | High if overwhelm is real | Already built | Test before raising the cap |
| Practitioner-reviewed profiles | High if people treat illustrations as standards | External work | Next content step, not a UI step |
| Maintained resource catalog | Medium | External work | After profiles have an owner |
| Posting-specific comparison | Unknown until interviews | Large | Only if research says the job starts from a posting |

## Non-goals restated as acceptance

A build is wrong if it guarantees employment, ranks candidates, or infers protected characteristics. None of those paths exist in the prototype.
