import type { KeyValueStorage, Persisted } from "../types";

export const STORAGE_KEY = "skillbridge.career-navigator.v1";

const PROFICIENCY = new Set(["exploring", "practicing", "comfortable", "strong"]);
const CONFIDENCE = new Set(["low", "medium", "high"]);
const IMPORTANCE = new Set(["core", "supporting"]);
const STATUS = new Set(["not-started", "doing", "done"]);
const SOURCE = new Set(["self", "confirmed-paste"]);

export function defaultState(): Persisted {
  return {
    version: 1,
    acknowledgedLimits: false,
    displayName: "",
    usingSample: false,
    goalId: null,
    customRoles: [],
    skills: [],
    extras: [],
    edits: {},
    actions: [],
    reflection: "",
    lastOpened: "",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown, max: number): value is string {
  return typeof value === "string" && value.length <= max;
}

export function validateState(value: unknown): string | null {
  if (!isRecord(value)) return "Saved data on this browser could not be read.";
  if (value.version !== 1) return "Saved data is from a different version of this prototype.";
  if (typeof value.acknowledgedLimits !== "boolean" || typeof value.usingSample !== "boolean") {
    return "Saved data on this browser could not be read.";
  }
  if (!isString(value.displayName, 80) || !isString(value.reflection, 4000) || !isString(value.lastOpened, 40)) {
    return "Saved data on this browser could not be read.";
  }
  if (value.goalId !== null && !isString(value.goalId, 80)) return "Saved data on this browser could not be read.";
  if (!Array.isArray(value.skills) || !Array.isArray(value.extras) || !Array.isArray(value.customRoles) || !Array.isArray(value.actions)) {
    return "Saved data on this browser could not be read.";
  }
  if (!isRecord(value.edits)) return "Saved data on this browser could not be read.";
  for (const skill of value.skills) {
    if (!isRecord(skill)) return "Saved data on this browser could not be read.";
    if (!isString(skill.id, 80) || !isString(skill.skillId, 80) || !isString(skill.evidence, 2000) || !isString(skill.updatedAt, 40)) {
      return "Saved data on this browser could not be read.";
    }
    if (!PROFICIENCY.has(String(skill.proficiency)) || !CONFIDENCE.has(String(skill.confidence)) || !SOURCE.has(String(skill.source))) {
      return "Saved data on this browser could not be read.";
    }
  }
  for (const action of value.actions) {
    if (!isRecord(action) || !STATUS.has(String(action.status))) return "Saved data on this browser could not be read.";
    if (!isString(action.id, 80) || !isString(action.roleId, 80) || !isString(action.title, 160)) {
      return "Saved data on this browser could not be read.";
    }
  }
  for (const role of value.customRoles) {
    if (!isRecord(role) || !isString(role.id, 80) || !isString(role.name, 80) || !Array.isArray(role.requirements)) {
      return "Saved data on this browser could not be read.";
    }
  }
  for (const edit of Object.values(value.edits)) {
    if (!isRecord(edit) || !Array.isArray(edit.hidden) || !Array.isArray(edit.added)) {
      return "Saved data on this browser could not be read.";
    }
    for (const requirement of edit.added) {
      if (!isRecord(requirement) || !IMPORTANCE.has(String(requirement.importance)) || !isString(requirement.skillId, 80)) {
        return "Saved data on this browser could not be read.";
      }
    }
  }
  return null;
}

export function loadState(storage: KeyValueStorage): { state: Persisted; problem: string | null } {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return { state: defaultState(), problem: "This browser blocked access to saved data." };
  }
  if (!raw) return { state: defaultState(), problem: null };
  try {
    const parsed: unknown = JSON.parse(raw);
    const problem = validateState(parsed);
    if (problem) return { state: defaultState(), problem };
    return { state: parsed as Persisted, problem: null };
  } catch {
    return { state: defaultState(), problem: "Saved data on this browser could not be read." };
  }
}

export function saveState(storage: KeyValueStorage, state: Persisted): string | null {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return null;
  } catch {
    return "Could not save on this browser. The change is on screen, and it may disappear if you refresh.";
  }
}

export function clearState(storage: KeyValueStorage): void {
  storage.removeItem(STORAGE_KEY);
}
