# Competitive analysis

**Reviewed:** 22 October 2026
**Method:** Public product and help pages. This is not a full product teardown, a user study, or a claim that a feature is absent from a surface I did not open.
**Rule:** Marketing numbers are quoted as the vendor's claims, not as verified outcomes.

## Set

| Product | Why it is in the set | Primary page |
| --- | --- | --- |
| Jobscan | Resume-to-posting match rate and skill gaps | https://www.jobscan.co/ |
| Teal | Job search workspace with keyword match and a match score | https://www.tealhq.com/pricing |
| roadmap.sh | Role and skill roadmaps with progress | https://roadmap.sh/about |
| CareerOneStop Skills Matcher | Self-ratings compared with O*NET occupations | https://www.careeronestop.org/Toolkit/Skills/skills-matcher-help.aspx |
| O*NET / My Next Move | Occupational skill reports and interest-based exploration | https://www.onetonline.org/help/onet/mynextmove and https://www.onetonline.org/help/online/summary |

LinkedIn is a partial sixth. LinkedIn Help describes job recommendations from preferences and profile, and a Premium "top applicant" treatment (https://www.linkedin.com/help/linkedin/answer/a512279/searching-for-jobs-on-linkedin, page marked updated within days of this review). Separately, LinkedIn has published Career Explorer material that maps skills across titles (public explainer at https://linkedin.github.io/career-explorer/). I did not complete a signed-in walkthrough of either surface on 22 October 2026, so I do not describe their current screens in detail.

## Jobscan

**Audience and promise.** Individual job seekers and, on a separate page, career teams. The homepage promise is an ATS-specific resume optimization. The page also markets "3x more interview callbacks" and says 99% of Fortune 500 companies use an ATS. Those are Jobscan's claims. I did not verify them.

**Core flow, as Jobscan documents it.** Upload a resume and paste a job listing. Jobscan reports a match rate and missing skills or keywords. Its help text says the match rate is based, in order, on hard skills, education level when an advanced degree is in the posting, job title, soft skills, and other keywords. The same help text says the team recommends a 75% match rate and warns that stuffing keywords can over-optimize. Source: Jobscan homepage FAQ, reviewed 22 October 2026.

**Strength.** The comparison is tied to one real posting, and the vendor explains which factors move the number.

**Friction for this PRD.** The output is a rate. The job to be done is closer to "pass a screen" than "decide what to learn." A learning plan is not the documented outcome.

**Accessibility.** Not assessed. I did not run an audit.

**Opportunity.** A person can need the next skill, not the next keyword. SkillBridge does not compete on ATS formatting.

## Teal

**Audience and promise.** Job seekers who track applications and tailor resumes. The pricing page, reviewed 22 October 2026, lists a free plan and Teal+.

**Price, from that page.** Free. Teal+ is listed at $13 every 7 days, $29 every 30 days, and $79 every 90 days. I am not repeating testimonial claims on that page as evidence.

**Core flow.** Free keyword matching is described as the top 5 keywords. Teal+ is described as unlocking all keywords and a Match Score against a job description. The same page describes a job tracker, resume analysis, and AI writing credits. The free tracker is part of the product's own pitch, not something I measured.

**Strength.** Search logistics and resume tailoring live together. The free tier is explicit.

**Friction for this PRD.** The match is between a resume and a posting. It is a writing aid. It does not keep a practice plan, and the score is the summary.

**Opportunity.** SkillBridge can refuse the score and still be specific, because the unit is a skill with a definition rather than a keyword count.

## roadmap.sh

**Audience and promise.** Developers choosing what to learn. The about page says the site holds community-curated, role-based and skill-based roadmaps, with resources on nodes, suggested changes, and progress tracking.

**Scale, as the about page displayed it.** On 22 October 2026 the page showed figures including hundreds of thousands of GitHub stars and millions of registered users. Those are the site's own figures. I did not audit them.

**Strength.** The path is visual, editable by a community, and scoped to learning rather than to an application. Progress is marked by the learner.

**Friction for this PRD.** The roadmaps are for developers. They start from the role's body of knowledge, not from a confirmed inventory of the person's current work. A frontend roadmap with dozens of nodes is a curriculum. The PRD's risk is that a large plan overwhelms.

**Opportunity.** Keep the "mark what you have done" behavior. Start from the person's skills. Cap the first list.

## CareerOneStop Skills Matcher

**Audience and promise.** Job seekers and students exploring careers. The help page says the person rates 40 skills and receives careers that match those ratings.

**How it says it works.** A statistical formula compares the 40 ratings with knowledge, skill, and ability ratings for more than 900 O*NET occupations. The result list can show median wages, typical education, and an outlook label. The help page cites O*NET 31.0, BLS OEWS May 2025 wage estimates, BLS education assignments for 2024, and outlook designations based on 2024–34 projections.

**Strength.** The data source is named. The person can change answers. The tool is explicit that uniform ratings produce a poor match. It is free and public.

**Friction for this PRD.** The output is a career list, not a practice plan for one chosen role. The skills are a fixed set of 40 broad areas. Compare Occupations, described on CareerOneStop's compare-occupations help page, compares two occupations with each other, including skill gaps between those occupations. That is still not "my confirmed skills versus this role."

**Opportunity.** Borrow the habit of citing the source and the vintage. Do not borrow the wage and outlook modules until a data owner exists. The PRD lists regional pay as a later item that needs validation.

## O*NET OnLine and My Next Move

**Audience and promise.** My Next Move is described by O*NET as a streamlined explorer for job seekers and students, with tasks, skills, and pay for hundreds of careers, plus an interest profiler (https://www.onetonline.org/help/onet/mynextmove, page dated in the O*NET help set I opened on 22 October 2026). O*NET OnLine summary reports add tasks, technology skills, work activities, skills, knowledge, and education (https://www.onetonline.org/help/online/summary).

**Scales.** O*NET documents separate Importance and Level ratings, and warns that the same skill can matter in two jobs at different levels (https://www.onetonline.org/help/online/scales). That distinction is relevant: "I have used spreadsheets" is not the same as "this role needs spreadsheets at a particular level."

**Strength.** The taxonomy is public, maintained, and careful about what a rating means.

**Friction for this PRD.** A summary report does not know which skills the reader claims. It cannot produce their plan. Using official O*NET scores in this prototype would imply a validation this concept has not done.

**Opportunity.** A later profile could map to an O*NET-SOC code, show the vintage, and still let the person correct it. The prototype does not pretend its five profiles are that database.

## LinkedIn, with a limited look

Job recommendations are framed as fits to preferences and profile text. Premium adds a "top applicant" framing, which is close to a hiring prediction and is exactly the claim SkillBridge refuses. Career Explorer's public explainer describes similarity between titles from a skills graph. Both are adjacent. Neither was walked through while signed in, so this row is incomplete.

## Comparison

|  | Jobscan | Teal | roadmap.sh | CareerOneStop | SkillBridge prototype |
| --- | --- | --- | --- | --- | --- |
| Starts from | Resume plus one posting | Resume plus postings and a tracker | A role curriculum | 40 self-ratings | Skills the person confirms |
| Summary | Match rate | Match score on the paid tier | A map of topics | A career list | Sentences: matched, partial, not in your list |
| Next step | Edit the resume | Tailor and track the application | Study the next node | Read a career, wages, outlook | Three editable actions |
| Source of the role | The posting | The posting | Community roadmap | O*NET, with vintage | Illustrative profile with a date, or a profile the person writes |
| Hiring claim | Marketed as improving interviews | Marketed around applications | Learning, not hiring | Career information, including pay | States that it does not predict hiring |

## Gaps worth designing for

- A comparison that can be read without a percentage.
- A plan that is shorter than a curriculum and more personal than a generic roadmap.
- Source and date on the role, without pretending the prototype profiles are official statistics.
- A confirmation step before any extracted skill is saved.

## What not to copy

- A recommended match-rate threshold.
- Wages or outlook beside the comparison. The prototype has no licensed, current source, and the number would dominate the skills.
- A "top applicant" label.
- An auto-apply or employer ranking mode.

## What still needs checking

- Signed-in flows for Jobscan, Teal, and LinkedIn, including empty, error, and mobile states.
- Whether roadmap.sh's personalization features change the "starts from the curriculum" point. The about page confirms role roadmaps, resources, and progress. Newer AI features were visible on marketing pages in search results and were not the basis of this comparison.
- Accessibility of each product, which was not audited.
- Prices other than the Teal figures copied from the pricing page. Jobscan's consumer price was not taken from a pricing table in the pages I opened, so it is omitted.
