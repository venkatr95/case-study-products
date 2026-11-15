import type { Persisted, UserSkill } from "../types";

export const SAMPLE_UPDATED = "2026-10-22T12:00:00.000Z";

export const SAMPLE_RESUME = `Maya Chen
Shift lead, North and Pine Market, 2022 to present

I build the weekly floor schedule for 18 people and adjust it when someone calls out.
I talk with customers about returns and complaints and agree on a next step before they leave.
I coach new cashiers on the register and the closing checklist.
I track inventory in Excel and flag items that are running out.
I write a short weekly update for the store manager. I am still learning how to keep it brief.
`;

function skill(
  id: string,
  skillId: string,
  proficiency: UserSkill["proficiency"],
  confidence: UserSkill["confidence"],
  evidence: string,
): UserSkill {
  return {
    id,
    skillId,
    proficiency,
    confidence,
    evidence,
    source: "self",
    updatedAt: SAMPLE_UPDATED,
  };
}

export function sampleState(): Persisted {
  return {
    version: 1,
    acknowledgedLimits: true,
    displayName: "Maya Chen",
    usingSample: true,
    goalId: "product-ops",
    customRoles: [],
    extras: [],
    edits: {},
    actions: [],
    reflection: "",
    lastOpened: SAMPLE_UPDATED,
    skills: [
      skill("user-scheduling", "scheduling", "comfortable", "high", "I build the weekly floor schedule for 18 people."),
      skill("user-customer", "customer-communication", "strong", "high", "I agree a next step with customers before they leave."),
      skill("user-coaching", "coaching", "comfortable", "medium", "I coach new cashiers on the register and the closing checklist."),
      skill("user-sheets", "spreadsheets", "practicing", "medium", "I track inventory in Excel. The formulas are basic."),
      skill("user-complaints", "complaint-handling", "comfortable", "high", "I handle returns and complaints on the floor."),
      skill("user-inventory", "inventory-tracking", "comfortable", "high", "I flag items that are running out."),
      skill("user-updates", "written-updates", "practicing", "low", "I write a weekly update and I am still learning to keep it brief."),
    ],
  };
}
