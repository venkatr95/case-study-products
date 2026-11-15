export type Route =
  | { name: "welcome" }
  | { name: "goals" }
  | { name: "preview"; id: string }
  | { name: "role" }
  | { name: "role-edit" }
  | { name: "skills" }
  | { name: "skill-form"; id: string | null; presetSkillId: string | null }
  | { name: "import" }
  | { name: "import-review" }
  | { name: "compare" }
  | { name: "gap"; skillId: string }
  | { name: "roadmap" }
  | { name: "action"; id: string | null; presetSkillId: string | null }
  | { name: "progress" }
  | { name: "settings" }
  | { name: "not-found" };

export function parseHash(raw: string): Route {
  const [pathPart, queryPart] = raw.replace(/^#/, "").split("?");
  const params = new URLSearchParams(queryPart ?? "");
  const parts = pathPart.split("/").filter(Boolean);
  const head = parts[0] ?? "welcome";
  const second = parts[1] ? decodeURIComponent(parts[1]) : null;
  if (head === "welcome") return { name: "welcome" };
  if (head === "goals" && second) return { name: "preview", id: second };
  if (head === "goals") return { name: "goals" };
  if (head === "role" && second === "edit") return { name: "role-edit" };
  if (head === "role") return { name: "role" };
  if (head === "skills" && second === "new") {
    return { name: "skill-form", id: null, presetSkillId: params.get("skill") };
  }
  if (head === "skills" && second) return { name: "skill-form", id: second, presetSkillId: null };
  if (head === "skills") return { name: "skills" };
  if (head === "import" && second === "review") return { name: "import-review" };
  if (head === "import") return { name: "import" };
  if (head === "compare" && second) return { name: "gap", skillId: second };
  if (head === "compare") return { name: "compare" };
  if (head === "roadmap" && second === "new") {
    return { name: "action", id: null, presetSkillId: params.get("skill") };
  }
  if (head === "roadmap" && second) return { name: "action", id: second, presetSkillId: null };
  if (head === "roadmap") return { name: "roadmap" };
  if (head === "progress") return { name: "progress" };
  if (head === "settings") return { name: "settings" };
  return { name: "not-found" };
}

export function continueHash(goalId: string | null, skillCount: number, actionCountForGoal: number): string {
  if (!goalId) return "#/goals";
  if (actionCountForGoal > 0) return "#/roadmap";
  if (skillCount > 0) return "#/compare";
  return "#/skills";
}
