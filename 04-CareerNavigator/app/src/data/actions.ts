import { RESOURCE_NOTE } from "../copy";
import type { Resource, SkillDef } from "../types";

export type ActionTemplate = {
  title: string;
  outcome: string;
  firstStep: string;
  evidenceToCollect: string;
  resources: Resource[];
};

const plain: Resource = {
  provider: "plainlanguage.gov",
  topic: "Short, concrete writing",
  url: "https://www.plainlanguage.gov/guidelines/",
};

const excel: Resource = {
  provider: "Microsoft",
  topic: "Excel help",
  url: "https://support.microsoft.com/excel",
};

const sqlbolt: Resource = {
  provider: "SQLBolt",
  topic: "Introduction to SQL queries",
  url: "https://sqlbolt.com/",
};

const interviews: Resource = {
  provider: "Nielsen Norman Group",
  topic: "Interviewing users",
  url: "https://www.nngroup.com/articles/interviewing-users/",
};

const blueprint: Resource = {
  provider: "Nielsen Norman Group",
  topic: "How a service blueprint shows handoffs",
  url: "https://www.nngroup.com/articles/service-blueprints-definition/",
};

const TEMPLATES: Record<string, ActionTemplate> = {
  "stakeholder-updates": {
    title: "Write one stakeholder update",
    outcome: "A person who was not in the room can see what changed, what is blocked, and what you need.",
    firstStep: "Pick a situation from this week, real or practice. Write five lines: status, change, blocker, ask, and the next check-in. Plan on 30 to 45 minutes.",
    evidenceToCollect: "The five-line note.",
    resources: [plain],
  },
  "requirements-briefs": {
    title: "Turn one request into a one-page brief",
    outcome: "Someone else can tell whether the request is done without asking you to retell it.",
    firstStep: "Take a request you have heard. Use four headings: who is affected, the problem, what done looks like, and what is out of scope. Plan on 45 to 60 minutes.",
    evidenceToCollect: "The one-page brief.",
    resources: [plain],
  },
  "process-mapping": {
    title: "Map one workflow you already know",
    outcome: "You can show the steps, the handoffs, and one place the work waits.",
    firstStep: "Pick a workflow from work you know, such as a return or a weekly order. List 6 to 10 steps and who does each. Mark one wait. Plan on 45 minutes.",
    evidenceToCollect: "The step list with one wait marked.",
    resources: [blueprint],
  },
  prioritization: {
    title: "Rank five requests and defer one",
    outcome: "You can say what goes first and what waits, with a reason other than who spoke loudest.",
    firstStep: "Write five real or sample requests. Sort them with one rule: customer impact, deadline, or effort. Write one sentence for the item you deferred. Plan on 30 minutes.",
    evidenceToCollect: "The ranked list and the deferral sentence.",
    resources: [],
  },
  spreadsheets: {
    title: "Answer one question with a spreadsheet",
    outcome: "You can filter a list and compute a count or total you can explain.",
    firstStep: "Put about 15 rows in a sheet, or use a list you already have. Add one filter and one SUM or COUNT. Write the question that number answers. Plan on 45 minutes.",
    evidenceToCollect: "The question and the number, plus a note on what you excluded.",
    resources: [excel],
  },
  "written-updates": {
    title: "Rewrite one update in six lines",
    outcome: "A reader can see the point, the context, and the ask without a follow-up message.",
    firstStep: "Take a message you sent or a practice note. Rewrite it as point, context, and ask. Cut it to six lines. Plan on 20 minutes.",
    evidenceToCollect: "The six-line version.",
    resources: [plain],
  },
  "metric-definition": {
    title: "Define one metric in a sentence",
    outcome: "You can say what is counted, what is excluded, the time window, and the decision the number supports.",
    firstStep: "Pick a number people already mention, such as late orders. Write the decision, the count, the time window, and one thing you will not count. Plan on 30 minutes.",
    evidenceToCollect: "The four-part definition.",
    resources: [],
  },
  "ticket-hygiene": {
    title: "Rewrite one task so someone else can finish it",
    outcome: "A teammate can see the outcome, the owner, and how to tell it is done.",
    firstStep: "Take a vague task such as 'fix the handoff.' Rewrite it with outcome, owner, and done-when. Plan on 20 minutes.",
    evidenceToCollect: "The rewritten task.",
    resources: [],
  },
  "customer-communication": {
    title: "Practice one customer conversation with a next step",
    outcome: "You can close a conversation with a next step the customer could repeat back.",
    firstStep: "Write a six-line practice dialogue: the customer's problem, your question, their answer, your restatement, the next step, and when it happens. Plan on 25 minutes.",
    evidenceToCollect: "The dialogue.",
    resources: [],
  },
  "onboarding-customers": {
    title: "Write the first success for one new customer",
    outcome: "You can name the first useful task and the check that shows they finished it.",
    firstStep: "Pick a product you know, even a store loyalty card. Write the first task, the steps, and the signal that it worked. Plan on 30 minutes.",
    evidenceToCollect: "The first-task note.",
    resources: [],
  },
  "complaint-handling": {
    title: "Write one complaint through to a next step",
    outcome: "You can acknowledge the problem, restate it, and offer a next step without blaming the customer.",
    firstStep: "Use a complaint you have handled or a practice one. Write what they said, what you understood, what you offered, and what happens next. Plan on 25 minutes.",
    evidenceToCollect: "The four-part note.",
    resources: [],
  },
  "renewal-signals": {
    title: "Name the signal for three customers",
    outcome: "You can tell stuck, quiet, and ready-to-expand apart, and say what you would do next for one of them.",
    firstStep: "Make three short fictional or real account notes. Label each signal and write one next step for the riskiest one. Plan on 30 minutes.",
    evidenceToCollect: "The three labels and one next step.",
    resources: [],
  },
  "interview-notes": {
    title: "Capture one conversation as notes, not a verdict",
    outcome: "A reader can see what the person said, separate from what you think it means.",
    firstStep: "Talk with one person for 15 minutes about a task they do, or use a published interview. Write five things they said and one conclusion, labeled as yours. Plan on 45 minutes.",
    evidenceToCollect: "The notes with the conclusion labeled.",
    resources: [interviews],
  },
  "sql-basics": {
    title: "Write one question a table can answer",
    outcome: "You can filter rows and count them, and say the question in a sentence above the query.",
    firstStep: "Use a public SQL lesson. Write one SELECT with a WHERE and a COUNT. Put the question in a sentence above it. Plan on 45 to 60 minutes.",
    evidenceToCollect: "The sentence and the query.",
    resources: [sqlbolt],
  },
  "workshop-facilitation": {
    title: "Plan a 25-minute decision meeting",
    outcome: "You can open a meeting with the decision needed and end it with an owner.",
    firstStep: "Write the decision, the three questions you will ask, and the closing sentence that names the owner. Plan on 30 minutes.",
    evidenceToCollect: "The meeting plan.",
    resources: [],
  },
  coaching: {
    title: "Coach one task in a single sitting",
    outcome: "A teammate can finish a task after you show it once and they try it once.",
    firstStep: "Pick a task you know well. Write the show-then-try steps and the one mistake you will watch for. Plan on 30 minutes.",
    evidenceToCollect: "The coaching outline.",
    resources: [],
  },
  scheduling: {
    title: "Build one coverage plan with a gap called out",
    outcome: "You can show who covers the work and name one hour that is still thin.",
    firstStep: "Sketch a one-week coverage plan for a team you know, using initials rather than full names if you prefer. Mark one gap and one option. Plan on 40 minutes.",
    evidenceToCollect: "The plan with the gap marked.",
    resources: [],
  },
  "inventory-tracking": {
    title: "Flag what is running out",
    outcome: "You can look at a list and say what needs a reorder and what can wait.",
    firstStep: "Use 10 items you know. Note on-hand, a reorder point, and which three you would act on. Plan on 30 minutes.",
    evidenceToCollect: "The short list with three actions.",
    resources: [],
  },
  "dashboard-reading": {
    title: "Explain one change on a chart",
    outcome: "You can say what changed, the comparison, and one thing the chart does not prove.",
    firstStep: "Find a public chart or sketch a simple one. Write three sentences: what changed, compared with what, and what you cannot tell. Plan on 25 minutes.",
    evidenceToCollect: "The three sentences.",
    resources: [],
  },
  experimentation: {
    title: "Describe one change worth trying",
    outcome: "You can name the change, what you will hold still, and what you will read afterward.",
    firstStep: "Pick one small change. Write what changes, what stays, the number you will read, and how long you will wait. Plan on 30 minutes.",
    evidenceToCollect: "The one-change note.",
    resources: [],
  },
};

export function templateFor(skill: SkillDef): ActionTemplate {
  return (
    TEMPLATES[skill.id] ?? {
      title: `Practice ${skill.name}`,
      outcome: `You can do one small piece of ${skill.name} well enough to show someone.`,
      firstStep: `Spend 45 minutes on one example of ${skill.name} from work you know, or from a practice scenario. Write what you did and what you would repeat.`,
      evidenceToCollect: "A short note describing the example.",
      resources: [],
    }
  );
}

export { RESOURCE_NOTE };
