export type Importance = "core" | "supporting";
export type Proficiency = "exploring" | "practicing" | "comfortable" | "strong";
export type Confidence = "low" | "medium" | "high";
export type MatchStatus = "matched" | "partial" | "missing";
export type ActionStatus = "not-started" | "doing" | "done";
export type SkillSource = "self" | "confirmed-paste";
export type CompareFilter = "all" | "core" | "supporting" | "matched" | "partial" | "missing" | "extra";

export type SkillDef = {
  id: string;
  name: string;
  definition: string;
  phrases: string[];
  custom?: boolean;
};

export type Requirement = {
  skillId: string;
  importance: Importance;
  why: string;
  addedByUser?: boolean;
};

export type Resource = {
  provider: string;
  topic: string;
  url: string;
};

export type RoleProfile = {
  id: string;
  name: string;
  family: string;
  summary: string;
  source: string;
  updated: string;
  stretch: boolean;
  requirements: Requirement[];
  custom?: boolean;
};

export type UserSkill = {
  id: string;
  skillId: string;
  proficiency: Proficiency;
  confidence: Confidence;
  evidence: string;
  source: SkillSource;
  updatedAt: string;
};

export type RoleEdit = {
  hidden: string[];
  added: Requirement[];
};

export type Action = {
  id: string;
  roleId: string;
  skillId: string | null;
  title: string;
  outcome: string;
  firstStep: string;
  evidenceToCollect: string;
  why: string;
  resources: Resource[];
  status: ActionStatus;
  note: string;
  userEdited: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Persisted = {
  version: 1;
  acknowledgedLimits: boolean;
  displayName: string;
  usingSample: boolean;
  goalId: string | null;
  customRoles: RoleProfile[];
  skills: UserSkill[];
  extras: SkillDef[];
  edits: Record<string, RoleEdit>;
  actions: Action[];
  reflection: string;
  lastOpened: string;
};

export type Suggestion = {
  skillId: string;
  phrase: string;
  snippet: string;
  index: number;
  proficiency: Proficiency;
  confidence: Confidence;
};

export type ExtractResult =
  | { ok: true; suggestions: Suggestion[]; omitted: number }
  | { ok: false; error: string };

export type KeyValueStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};
