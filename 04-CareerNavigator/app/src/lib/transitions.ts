import { sampleState } from "../data/sample";
import { SKILLS } from "../data/skills";
import { actionFromSuggestion, suggestActions } from "./roadmap";
import { compareSkills } from "./compare";
import { catalogFor, findRole, resolveRole } from "./role-resolve";
import type {
  Action,
  ActionStatus,
  Confidence,
  Importance,
  Persisted,
  Proficiency,
  Requirement,
  SkillDef,
  SkillSource,
  UserSkill,
} from "../types";

export type Result = { ok: true; state: Persisted } | { ok: false; error: string };

function clone(state: Persisted): Persisted {
  return structuredClone(state);
}

export function hasUserWork(state: Persisted): boolean {
  return !state.usingSample && (state.skills.length > 0 || state.actions.length > 0 || state.customRoles.length > 0 || state.displayName.trim() !== "");
}

export function applySample(now: string): Persisted {
  const sample = sampleState();
  sample.lastOpened = now;
  return sample;
}

export function acknowledge(state: Persisted): Persisted {
  const next = clone(state);
  next.acknowledgedLimits = true;
  return next;
}

export function setDisplayName(state: Persisted, name: string): Result {
  const trimmed = name.trim();
  if (trimmed.length > 80) return { ok: false, error: "Use 80 characters or fewer for the name." };
  const next = clone(state);
  next.displayName = trimmed;
  return { ok: true, state: next };
}

export function setGoal(state: Persisted, goalId: string): Result {
  if (!findRole(state, goalId)) return { ok: false, error: "That role is not available." };
  const next = clone(state);
  next.goalId = goalId;
  next.acknowledgedLimits = true;
  return { ok: true, state: next };
}

export function createCustomRole(state: Persisted, name: string, summary: string, id: string, now: string): Result {
  const trimmedName = name.trim();
  const trimmedSummary = summary.trim();
  if (trimmedName.length < 2 || trimmedName.length > 80) return { ok: false, error: "Name the role in 2 to 80 characters." };
  if (trimmedSummary.length < 10 || trimmedSummary.length > 280) {
    return { ok: false, error: "Describe the work in one sentence, from 10 to 280 characters." };
  }
  const role = {
    id,
    name: trimmedName,
    family: "A role you described",
    summary: trimmedSummary,
    source: "You wrote this profile. It is not a reviewed occupational standard.",
    updated: now.slice(0, 10),
    stretch: false,
    custom: true,
    requirements: [],
  };
  const next = clone(state);
  next.customRoles.push(role);
  next.goalId = id;
  next.acknowledgedLimits = true;
  return { ok: true, state: next };
}

function editBucket(state: Persisted, roleId: string) {
  if (!state.edits[roleId]) state.edits[roleId] = { hidden: [], added: [] };
  return state.edits[roleId];
}

export function hideRequirement(state: Persisted, roleId: string, skillId: string): Persisted {
  const next = clone(state);
  const edit = editBucket(next, roleId);
  if (!edit.hidden.includes(skillId)) edit.hidden.push(skillId);
  return next;
}

export function restoreRequirement(state: Persisted, roleId: string, skillId: string): Persisted {
  const next = clone(state);
  const edit = editBucket(next, roleId);
  edit.hidden = edit.hidden.filter((id) => id !== skillId);
  return next;
}

export function addRequirement(state: Persisted, roleId: string, skillId: string, importance: Importance, why: string): Result {
  const reason = why.trim();
  if (!skillId) return { ok: false, error: "Choose a skill." };
  if (reason.length < 8) return { ok: false, error: "Say why this role needs the skill, in a short sentence." };
  const resolved = resolveRole(state, roleId);
  if (!resolved) return { ok: false, error: "Choose a role before editing its profile." };
  if (resolved.requirements.some((item) => item.skillId === skillId && !resolved.hidden.includes(skillId))) {
    return { ok: false, error: "That skill is already in this profile." };
  }
  const next = clone(state);
  const edit = editBucket(next, roleId);
  edit.hidden = edit.hidden.filter((id) => id !== skillId);
  edit.added = edit.added.filter((item) => item.skillId !== skillId);
  const requirement: Requirement = { skillId, importance, why: reason, addedByUser: true };
  edit.added.push(requirement);
  return { ok: true, state: next };
}

export type SkillInput = {
  existingId: string | null;
  skillId: string | null;
  customName: string;
  customDefinition: string;
  proficiency: Proficiency | "";
  confidence: Confidence | "";
  evidence: string;
};

export function saveSkill(state: Persisted, input: SkillInput, ids: { user: string; extra: string }, now: string): Result {
  if (input.proficiency === "" || input.confidence === "") {
    return { ok: false, error: "Choose a proficiency and how sure you are. Both are self-assessments." };
  }
  const evidence = input.evidence.trim();
  if (evidence.length > 600) return { ok: false, error: "Keep the example under 600 characters." };
  const next = clone(state);
  let skillId = input.skillId;
  if (!skillId) {
    const name = input.customName.trim();
    const definition = input.customDefinition.trim();
    if (name.length < 2) return { ok: false, error: "Name the skill." };
    if (definition.length < 8) return { ok: false, error: "Add a one-sentence definition so the comparison stays understandable." };
    const extra: SkillDef = { id: ids.extra, name, definition, phrases: [], custom: true };
    next.extras.push(extra);
    skillId = extra.id;
  }
  const catalog = catalogFor(next);
  if (!catalog.some((skill) => skill.id === skillId)) return { ok: false, error: "Choose a skill from the list or describe a new one." };
  const duplicate = next.skills.find((skill) => skill.skillId === skillId && skill.id !== input.existingId);
  if (duplicate) {
    return { ok: false, error: "That skill is already in your list. Edit it instead of adding it twice." };
  }
  const current = input.existingId ? next.skills.find((skill) => skill.id === input.existingId) : undefined;
  const record: UserSkill = {
    id: current?.id ?? ids.user,
    skillId,
    proficiency: input.proficiency,
    confidence: input.confidence,
    evidence,
    source: current?.source ?? "self",
    updatedAt: now,
  };
  if (current) next.skills = next.skills.map((skill) => (skill.id === current.id ? record : skill));
  else next.skills.push(record);
  return { ok: true, state: next };
}

export function removeSkill(state: Persisted, userSkillId: string): Persisted {
  const next = clone(state);
  next.skills = next.skills.filter((skill) => skill.id !== userSkillId);
  return next;
}

export function confirmSuggestions(
  state: Persisted,
  picks: Array<{ skillId: string; proficiency: Proficiency; confidence: Confidence }>,
  idFor: (skillId: string) => string,
  now: string,
): Result {
  if (picks.length === 0) return { ok: false, error: "Check at least one skill. Nothing is saved until you do." };
  const next = clone(state);
  let added = 0;
  for (const pick of picks) {
    if (!SKILLS.some((skill) => skill.id === pick.skillId) && !next.extras.some((skill) => skill.id === pick.skillId)) continue;
    const existing = next.skills.find((skill) => skill.skillId === pick.skillId);
    const source: SkillSource = "confirmed-paste";
    if (existing) {
      existing.proficiency = pick.proficiency;
      existing.confidence = pick.confidence;
      existing.source = source;
      existing.updatedAt = now;
      if (!existing.evidence) existing.evidence = "Confirmed from pasted text.";
    } else {
      next.skills.push({
        id: idFor(pick.skillId),
        skillId: pick.skillId,
        proficiency: pick.proficiency,
        confidence: pick.confidence,
        evidence: "Confirmed from pasted text.",
        source,
        updatedAt: now,
      });
      added += 1;
    }
  }
  if (added === 0 && picks.length > 0) {
    const anyKnown = picks.some((pick) => next.skills.some((skill) => skill.skillId === pick.skillId));
    if (!anyKnown) return { ok: false, error: "Those suggestions could not be saved. Add the skill manually." };
  }
  return { ok: true, state: next };
}

export function addGeneratedActions(state: Persisted, roleId: string, ids: string[], now: string, limit = 3): Persisted {
  const resolved = resolveRole(state, roleId);
  if (!resolved) return state;
  const comparison = compareSkills(resolved.requirements, state.skills, catalogFor(state));
  const existing = state.actions.filter((action) => action.roleId === roleId);
  const room = Math.max(0, limit - existing.length);
  if (room === 0) return state;
  const suggestions = suggestActions(comparison, state.actions, roleId, room);
  const next = clone(state);
  suggestions.forEach((suggestion, index) => {
    const id = ids[index] ?? `act-${suggestion.skillId}-${index}`;
    next.actions.push(actionFromSuggestion(suggestion, roleId, id, now));
  });
  return next;
}

export function addActionForSkill(state: Persisted, roleId: string, skillId: string, id: string, now: string): Result {
  if (state.actions.some((action) => action.roleId === roleId && action.skillId === skillId)) {
    return { ok: false, error: "An action for that skill is already on this roadmap." };
  }
  const resolved = resolveRole(state, roleId);
  if (!resolved) return { ok: false, error: "Choose a role before adding an action." };
  const comparison = compareSkills(resolved.requirements, state.skills, catalogFor(state));
  const suggestions = suggestActions(comparison, state.actions, roleId, 20);
  const suggestion = suggestions.find((item) => item.skillId === skillId);
  if (!suggestion) return { ok: false, error: "That skill is not an open gap on this profile." };
  const next = clone(state);
  next.actions.push(actionFromSuggestion(suggestion, roleId, id, now));
  return { ok: true, state: next };
}

export type ActionInput = {
  title: string;
  outcome: string;
  firstStep: string;
  evidenceToCollect: string;
  note: string;
  keepResources: boolean;
};

export function saveActionFields(state: Persisted, actionId: string, input: ActionInput, now: string): Result {
  const title = input.title.trim();
  const outcome = input.outcome.trim();
  const firstStep = input.firstStep.trim();
  if (title.length < 3) return { ok: false, error: "Name the action." };
  if (outcome.length < 8) return { ok: false, error: "Say what you will be able to do when this action is done." };
  if (firstStep.length < 8) return { ok: false, error: "Describe the first step so it can be done in one sitting." };
  const next = clone(state);
  const action = next.actions.find((item) => item.id === actionId);
  if (!action) return { ok: false, error: "That action is no longer on the roadmap." };
  action.title = title;
  action.outcome = outcome;
  action.firstStep = firstStep;
  action.evidenceToCollect = input.evidenceToCollect.trim();
  action.note = input.note.trim().slice(0, 600);
  if (!input.keepResources) action.resources = [];
  action.userEdited = true;
  action.updatedAt = now;
  return { ok: true, state: next };
}

export function createCustomAction(state: Persisted, roleId: string, input: ActionInput, id: string, now: string): Result {
  if (!resolveRole(state, roleId)) return { ok: false, error: "Choose a role before adding an action." };
  const draft: Action = {
    id,
    roleId,
    skillId: null,
    title: "Draft",
    outcome: "Draft outcome",
    firstStep: "Draft step",
    evidenceToCollect: "",
    why: "You added this action yourself.",
    resources: [],
    status: "not-started",
    note: "",
    userEdited: true,
    createdAt: now,
    updatedAt: now,
  };
  const next = clone(state);
  next.actions.push(draft);
  const saved = saveActionFields(next, id, input, now);
  return saved;
}

export function setActionStatus(state: Persisted, actionId: string, status: ActionStatus, now: string): Persisted {
  const next = clone(state);
  const action = next.actions.find((item) => item.id === actionId);
  if (!action) return state;
  action.status = status;
  action.updatedAt = now;
  return next;
}

export function removeAction(state: Persisted, actionId: string): Persisted {
  const next = clone(state);
  next.actions = next.actions.filter((action) => action.id !== actionId);
  return next;
}

export function setReflection(state: Persisted, reflection: string): Result {
  const note = reflection.trim();
  if (note.length > 2000) return { ok: false, error: "Keep the note under 2000 characters." };
  const next = clone(state);
  next.reflection = note;
  return { ok: true, state: next };
}

export function touchOpened(state: Persisted, now: string): Persisted {
  const next = clone(state);
  next.lastOpened = now;
  return next;
}
