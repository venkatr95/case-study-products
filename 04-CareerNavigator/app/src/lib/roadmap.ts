import { templateFor } from "../data/actions";
import { skillById } from "../data/skills";
import { bucketRank, type Comparison } from "./compare";
import type { Action, Importance, SkillDef } from "../types";

export type PlanSuggestion = {
  skillId: string;
  title: string;
  outcome: string;
  firstStep: string;
  evidenceToCollect: string;
  why: string;
  resources: Action["resources"];
  status: "partial" | "missing";
  importance: Importance;
};

export function suggestActions(comparison: Comparison, existing: Action[], roleId: string, limit = 3): PlanSuggestion[] {
  const taken = new Set(existing.filter((action) => action.roleId === roleId && action.skillId).map((action) => action.skillId));
  const ranked = [...comparison.rows]
    .filter((row) => row.status !== "matched" && !taken.has(row.skill.id))
    .sort((a, b) => bucketRank(a.status, a.requirement.importance) - bucketRank(b.status, b.requirement.importance) || a.index - b.index);
  return ranked.slice(0, limit).map((row) => {
    const template = templateFor(row.skill);
    const status = row.status === "partial" ? "partial" : "missing";
    return {
      skillId: row.skill.id,
      title: template.title,
      outcome: template.outcome,
      firstStep: template.firstStep,
      evidenceToCollect: template.evidenceToCollect,
      why: row.requirement.why,
      resources: template.resources,
      status,
      importance: row.requirement.importance,
    };
  });
}

export function actionFromSuggestion(suggestion: PlanSuggestion, roleId: string, id: string, now: string): Action {
  return {
    id,
    roleId,
    skillId: suggestion.skillId,
    title: suggestion.title,
    outcome: suggestion.outcome,
    firstStep: suggestion.firstStep,
    evidenceToCollect: suggestion.evidenceToCollect,
    why: suggestion.why,
    resources: suggestion.resources.map((resource) => ({ ...resource })),
    status: "not-started",
    note: "",
    userEdited: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function fallbackSkill(catalog: SkillDef[], skillId: string): SkillDef | undefined {
  return skillById(catalog, skillId);
}
