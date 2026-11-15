import { ROLES } from "../data/roles";
import { SKILLS } from "../data/skills";
import { compareSkills, type Comparison } from "./compare";
import type { Persisted, RoleProfile, SkillDef } from "../types";

export type ResolvedRole = RoleProfile & { hidden: string[] };

export function catalogFor(state: Persisted): SkillDef[] {
  return [...SKILLS, ...state.extras];
}

export function findRole(state: Persisted, roleId: string | null): RoleProfile | undefined {
  if (!roleId) return undefined;
  return ROLES.find((role) => role.id === roleId) ?? state.customRoles.find((role) => role.id === roleId);
}

export function resolveRole(state: Persisted, roleId: string | null): ResolvedRole | null {
  const role = findRole(state, roleId);
  if (!role) return null;
  const edit = state.edits[role.id] ?? { hidden: [], added: [] };
  const hidden = [...edit.hidden];
  const base = role.requirements.filter((requirement) => !hidden.includes(requirement.skillId));
  const added = edit.added.filter(
    (requirement) => !hidden.includes(requirement.skillId) && !base.some((item) => item.skillId === requirement.skillId),
  );
  return { ...role, requirements: [...base, ...added], hidden };
}

export function comparisonFor(state: Persisted, roleId: string | null): { role: ResolvedRole; comparison: Comparison } | null {
  const role = resolveRole(state, roleId);
  if (!role) return null;
  return { role, comparison: compareSkills(role.requirements, state.skills, catalogFor(state)) };
}
