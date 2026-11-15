import { CURATED_SOURCE, PROFILE_UPDATED, ROLE_FAMILY } from "../copy";
import type { RoleProfile } from "../types";

const source = CURATED_SOURCE;
const updated = PROFILE_UPDATED;

/** Illustrative role profiles for the prototype. Not validated occupational data. */
export const ROLES: RoleProfile[] = [
  {
    id: "product-ops",
    name: "Product operations associate",
    family: ROLE_FAMILY,
    summary: "Keep a product team's requests, handoffs, and weekly count moving. The work is coordination with a written record.",
    source,
    updated,
    stretch: false,
    requirements: [
      { skillId: "stakeholder-updates", importance: "core", why: "The work breaks when people who depend on a handoff do not hear what changed." },
      { skillId: "requirements-briefs", importance: "core", why: "Requests arrive messy. The role turns them into something a teammate can accept or challenge." },
      { skillId: "process-mapping", importance: "core", why: "The role looks at a repeated workflow and finds the step where work waits." },
      { skillId: "prioritization", importance: "core", why: "Several teams ask at once. The role has to say what goes first and what waits." },
      { skillId: "spreadsheets", importance: "core", why: "A queue or a weekly count often lives in a sheet before it lives in a dedicated tool." },
      { skillId: "written-updates", importance: "core", why: "The role leaves a record so the work does not depend on a hallway conversation." },
      { skillId: "metric-definition", importance: "supporting", why: "Someone will ask whether a change helped. One agreed number is enough to start." },
      { skillId: "ticket-hygiene", importance: "supporting", why: "Work gets lost when a task has no owner and no definition of done." },
      { skillId: "customer-communication", importance: "supporting", why: "Many operations problems start as a customer moment. The role should be able to restate it fairly." },
    ],
  },
  {
    id: "customer-success",
    name: "Customer success associate",
    family: ROLE_FAMILY,
    summary: "Help a customer get value early, notice when they are stuck, and leave a clear note for the next person.",
    source,
    updated,
    stretch: false,
    requirements: [
      { skillId: "customer-communication", importance: "core", why: "The role is a conversation with a customer that ends in a next step." },
      { skillId: "onboarding-customers", importance: "core", why: "The first useful task matters more than a tour of every feature." },
      { skillId: "complaint-handling", importance: "core", why: "A complaint is often the moment a customer decides whether to stay." },
      { skillId: "written-updates", importance: "core", why: "The next teammate needs the history without calling you." },
      { skillId: "renewal-signals", importance: "core", why: "Silence, repeated friction, and expansion questions are different signals. The role names which one it is seeing." },
      { skillId: "spreadsheets", importance: "supporting", why: "A simple list of accounts and last-contact dates is often the first tracking system." },
      { skillId: "interview-notes", importance: "supporting", why: "A short conversation is more useful when what the customer said is separate from your conclusion." },
      { skillId: "ticket-hygiene", importance: "supporting", why: "A follow-up that is not written down does not reliably happen." },
    ],
  },
  {
    id: "business-analyst",
    name: "Business analyst",
    family: ROLE_FAMILY,
    summary: "Turn a fuzzy request into a brief, a workflow, and a number someone can use to decide.",
    source,
    updated,
    stretch: false,
    requirements: [
      { skillId: "requirements-briefs", importance: "core", why: "The role's main artifact is a brief other people can build from or reject." },
      { skillId: "process-mapping", importance: "core", why: "The brief is weaker if nobody can see the current steps." },
      { skillId: "stakeholder-updates", importance: "core", why: "People disagree. The role records the decision and who needs to hear it." },
      { skillId: "metric-definition", importance: "core", why: "A requirement without a way to tell that it worked is still a wish." },
      { skillId: "workshop-facilitation", importance: "core", why: "The role often has to get a decision out of a room, not only out of a document." },
      { skillId: "spreadsheets", importance: "supporting", why: "Examples and counts often start in a sheet the group can edit together." },
      { skillId: "sql-basics", importance: "supporting", why: "Some questions are already in a table. A simple filter beats exporting everything first." },
      { skillId: "written-updates", importance: "supporting", why: "Decisions need a short record after the meeting." },
    ],
  },
  {
    id: "project-coordinator",
    name: "Project coordinator",
    family: ROLE_FAMILY,
    summary: "Keep a plan, the owners, and the status visible so a project does not live in one person's head.",
    source,
    updated,
    stretch: false,
    requirements: [
      { skillId: "scheduling", importance: "core", why: "The role keeps dates honest when people and work collide." },
      { skillId: "ticket-hygiene", importance: "core", why: "A plan made of vague tasks cannot be tracked." },
      { skillId: "stakeholder-updates", importance: "core", why: "Sponsors need changes, blockers, and asks, not a diary." },
      { skillId: "written-updates", importance: "core", why: "Status has to survive a week when people miss the meeting." },
      { skillId: "prioritization", importance: "core", why: "Dates slip. The role helps the group say what still ships." },
      { skillId: "spreadsheets", importance: "supporting", why: "A simple tracker is enough for owners, dates, and status." },
      { skillId: "workshop-facilitation", importance: "supporting", why: "Kickoffs and replans need a decision before the meeting ends." },
      { skillId: "coaching", importance: "supporting", why: "New teammates often need the tracker demonstrated once, not a policy document." },
    ],
  },
  {
    id: "junior-data-analyst",
    name: "Junior data analyst",
    family: "Early-career data work",
    summary: "Answer a question with a sheet or a simple query, define the number, and write what changed.",
    source,
    updated,
    stretch: true,
    requirements: [
      { skillId: "spreadsheets", importance: "core", why: "A lot of first analysis jobs still start by cleaning a sheet and computing a count." },
      { skillId: "sql-basics", importance: "core", why: "The role is expected to filter a table instead of asking someone else to export it." },
      { skillId: "metric-definition", importance: "core", why: "A chart without a counting rule invites an argument about the number." },
      { skillId: "dashboard-reading", importance: "core", why: "The role explains a change. It does not only read the largest number aloud." },
      { skillId: "written-updates", importance: "core", why: "The finding has to travel to someone who was not in the data." },
      { skillId: "process-mapping", importance: "supporting", why: "Knowing where the data comes from prevents a clean chart of the wrong thing." },
      { skillId: "stakeholder-updates", importance: "supporting", why: "The person who asked the question needs the limit of the answer, not only the answer." },
      { skillId: "experimentation", importance: "supporting", why: "Some questions are about one change. The role should not claim more than the comparison shows." },
    ],
  },
];

export function roleById(id: string): RoleProfile | undefined {
  return ROLES.find((role) => role.id === id);
}
