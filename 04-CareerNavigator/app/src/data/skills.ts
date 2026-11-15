import type { SkillDef } from "../types";

/** Illustrative skill language for the prototype. Not an occupational standard. */
export const SKILLS: SkillDef[] = [
  {
    id: "customer-communication",
    name: "Customer conversations",
    definition: "Talk with a customer about a problem and agree on a next step.",
    phrases: ["customer service", "talk with customers", "talked with customers", "helped customers", "with customers"],
  },
  {
    id: "scheduling",
    name: "Scheduling",
    definition: "Plan people's time so the work gets covered.",
    phrases: ["scheduling", "shift plan", "schedule"],
  },
  {
    id: "coaching",
    name: "Coaching teammates",
    definition: "Help a teammate get better at a task.",
    phrases: ["coaching", "coached", "coach"],
  },
  {
    id: "spreadsheets",
    name: "Spreadsheets",
    definition: "Organize rows of information and answer a question with a filter, a count, or a total.",
    phrases: ["google sheets", "spreadsheet", "spreadsheets", "excel"],
  },
  {
    id: "complaint-handling",
    name: "Handling complaints",
    definition: "Stay with an unhappy customer until there is a fair next step.",
    phrases: ["complaints", "complaint"],
  },
  {
    id: "inventory-tracking",
    name: "Inventory tracking",
    definition: "Know what is on hand and what is running out.",
    phrases: ["inventory", "stock count"],
  },
  {
    id: "written-updates",
    name: "Written updates",
    definition: "Write a short status someone else can act on without asking you to explain it.",
    phrases: ["weekly update", "status update", "written update"],
  },
  {
    id: "stakeholder-updates",
    name: "Stakeholder updates",
    definition: "Tell the people who depend on the work what changed, what is blocked, and what you need.",
    phrases: ["stakeholder update", "stakeholder"],
  },
  {
    id: "requirements-briefs",
    name: "Requirements briefs",
    definition: "Turn a request into a short brief: who is affected, the problem, what done looks like, and what is out.",
    phrases: ["one-page brief", "user story", "requirements"],
  },
  {
    id: "metric-definition",
    name: "Defining a metric",
    definition: "Name the number that shows whether a change worked, including what is counted and what is not.",
    phrases: ["kpi", "metric"],
  },
  {
    id: "process-mapping",
    name: "Process mapping",
    definition: "Draw the steps of a repeated workflow, including who does each step and where the work waits.",
    phrases: ["process map", "workflow", "standard operating"],
  },
  {
    id: "prioritization",
    name: "Prioritization",
    definition: "Choose what goes first when several requests compete, and say why something waits.",
    phrases: ["prioritize", "prioritisation", "prioritization", "triage"],
  },
  {
    id: "sql-basics",
    name: "SQL basics",
    definition: "Ask a table for filtered rows and a count, and say the question in a sentence.",
    phrases: ["postgresql", "postgres", "bigquery", "mysql", "sql"],
  },
  {
    id: "interview-notes",
    name: "Interview notes",
    definition: "Have a short conversation with a customer or teammate and capture what they said, separate from what you concluded.",
    phrases: ["customer interview", "user interview", "interview notes"],
  },
  {
    id: "experimentation",
    name: "Trying one change",
    definition: "Change one thing, keep the rest still, and read what happened.",
    phrases: ["a/b test", "experiment"],
  },
  {
    id: "ticket-hygiene",
    name: "Clear task writing",
    definition: "Write a task so someone else can see the outcome, the owner, and when it is done.",
    phrases: ["jira", "backlog", "ticket"],
  },
  {
    id: "onboarding-customers",
    name: "Customer onboarding",
    definition: "Help a new customer finish the first task that makes the product useful.",
    phrases: ["customer onboarding", "onboarding"],
  },
  {
    id: "renewal-signals",
    name: "Renewal signals",
    definition: "Notice when a customer is stuck, quiet, or ready for a wider conversation.",
    phrases: ["renewal", "churn"],
  },
  {
    id: "workshop-facilitation",
    name: "Workshop facilitation",
    definition: "Lead a meeting that ends with a decision, an owner, and a next step.",
    phrases: ["facilitated", "facilitation", "workshop"],
  },
  {
    id: "dashboard-reading",
    name: "Reading a dashboard",
    definition: "Look at a chart and say what changed, not only the total.",
    phrases: ["dashboard"],
  },
];

export function skillById(skills: SkillDef[], id: string): SkillDef | undefined {
  return skills.find((skill) => skill.id === id);
}
