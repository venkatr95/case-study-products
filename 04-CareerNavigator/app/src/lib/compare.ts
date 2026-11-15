import { skillById } from "../data/skills";
import type { Importance, MatchStatus, Requirement, SkillDef, UserSkill } from "../types";

export type ComparisonRow = {
  requirement: Requirement;
  skill: SkillDef;
  user: UserSkill | undefined;
  status: MatchStatus;
  index: number;
};

export type Comparison = {
  rows: ComparisonRow[];
  extras: Array<{ skill: SkillDef; user: UserSkill }>;
  userSkillCount: number;
};

export function classify(user: UserSkill | undefined): MatchStatus {
  if (!user) return "missing";
  const solid = user.proficiency === "comfortable" || user.proficiency === "strong";
  const sure = user.confidence === "medium" || user.confidence === "high";
  if (solid && sure) return "matched";
  return "partial";
}

export function compareSkills(
  requirements: Requirement[],
  users: UserSkill[],
  catalog: SkillDef[],
): Comparison {
  const rows: ComparisonRow[] = [];
  const used = new Set<string>();
  requirements.forEach((requirement, index) => {
    const skill = skillById(catalog, requirement.skillId);
    if (!skill) return;
    const user = users.find((item) => item.skillId === requirement.skillId);
    if (user) used.add(user.skillId);
    rows.push({
      requirement,
      skill,
      user,
      status: classify(user),
      index,
    });
  });
  const extras = users
    .filter((user) => !used.has(user.skillId))
    .map((user) => {
      const skill = skillById(catalog, user.skillId);
      return skill ? { skill, user } : null;
    })
    .filter((item): item is { skill: SkillDef; user: UserSkill } => item !== null);
  return { rows, extras, userSkillCount: users.length };
}

export function coreCounts(comparison: Comparison): { matched: number; partial: number; missing: number; total: number } {
  const core = comparison.rows.filter((row) => row.requirement.importance === "core");
  return {
    total: core.length,
    matched: core.filter((row) => row.status === "matched").length,
    partial: core.filter((row) => row.status === "partial").length,
    missing: core.filter((row) => row.status === "missing").length,
  };
}

export function coreLine(comparison: Comparison): string {
  const counts = coreCounts(comparison);
  if (counts.total === 0) return "This role profile has no core skills yet.";
  return `Of ${counts.total} core skills: ${counts.matched} matched, ${counts.partial} partial, ${counts.missing} not in your list yet.`;
}

function skillWord(count: number): string {
  return count === 1 ? "skill" : "skills";
}

export function narrative(comparison: Comparison): string {
  const listed = comparison.userSkillCount;
  if (listed === 0) {
    return "You have not added any skills yet. Add skills you already use before reading this as a gap report.";
  }
  const matched = comparison.rows.filter((row) => row.status === "matched").length;
  const partial = comparison.rows.filter((row) => row.status === "partial").length;
  const missing = comparison.rows.filter((row) => row.status === "missing").length;
  const missingCore = comparison.rows.filter((row) => row.status === "missing" && row.requirement.importance === "core").length;
  const extra = comparison.extras.length;
  const allCovered = missing === 0 && partial === 0;

  const matchClause =
    matched === 0 ? "None match this profile" : matched === 1 ? "1 matches this profile" : `${matched} match this profile`;
  const partialClause = partial === 0 ? "none are partial" : partial === 1 ? "1 is partial" : `${partial} are partial`;
  const coreBit =
    missingCore === 0
      ? "none of them core"
      : missingCore === 1
        ? "including 1 core skill"
        : `including ${missingCore} core skills`;
  const missingClause =
    missing === 0
      ? "Nothing in the profile is absent from your list."
      : `${missing} profile ${skillWord(missing)} ${missing === 1 ? "is" : "are"} not in your list yet, ${coreBit}.`;
  const extraClause =
    extra === 0
      ? "Every skill you listed is in this profile."
      : extra === 1
        ? "1 skill you listed is not in this profile, and it still counts."
        : `${extra} skills you listed are not in this profile, and they still count.`;

  if (allCovered) {
    return `You listed ${listed} ${skillWord(listed)}. Every skill in this profile matches something you entered. ${extraClause} That is not a hiring decision.`;
  }
  return `You listed ${listed} ${skillWord(listed)}. ${matchClause} and ${partialClause}. ${missingClause} ${extraClause}`;
}

export function containsScoreLanguage(value: string): boolean {
  return /%|\bscore\b|\bgrade\b|\bhireability\b/i.test(value);
}

export function bucketRank(status: MatchStatus, importance: Importance): number {
  if (status === "matched") return 9;
  if (importance === "core" && status === "missing") return 0;
  if (importance === "core" && status === "partial") return 1;
  if (importance === "supporting" && status === "missing") return 2;
  return 3;
}
