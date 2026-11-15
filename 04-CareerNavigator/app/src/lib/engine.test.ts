import { describe, expect, it } from "vitest";
import { CONTRAST_PAIRS } from "../tokens";
import { SAMPLE_RESUME, sampleState } from "../data/sample";
import { SKILLS } from "../data/skills";
import { classify, compareSkills, containsScoreLanguage, coreLine, narrative } from "./compare";
import { contrastRatio } from "./contrast";
import { extractSkills } from "./extract";
import { suggestActions } from "./roadmap";
import { parseHash } from "./routes";
import { comparisonFor } from "./role-resolve";
import { clearState, defaultState, loadState, saveState } from "./store";
import {
  addGeneratedActions,
  addRequirement,
  applySample,
  confirmSuggestions,
  createCustomRole,
  hasUserWork,
  hideRequirement,
  saveSkill,
  setActionStatus,
  setGoal,
} from "./transitions";
import type { KeyValueStorage } from "../types";

function memory(): KeyValueStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

describe("contrast", () => {
  it("meets the stated ratios for the design tokens", () => {
    for (const pair of CONTRAST_PAIRS) {
      expect(contrastRatio(pair.fg, pair.bg), pair.name).toBeGreaterThanOrEqual(pair.min);
    }
  });
});

describe("classification", () => {
  const base = sampleState().skills[0];
  it("matches a solid self-assessment when confidence is not low", () => {
    expect(classify({ ...base, proficiency: "comfortable", confidence: "medium" })).toBe("matched");
    expect(classify({ ...base, proficiency: "strong", confidence: "high" })).toBe("matched");
  });
  it("stays partial when the person is unsure or still practicing", () => {
    expect(classify({ ...base, proficiency: "strong", confidence: "low" })).toBe("partial");
    expect(classify({ ...base, proficiency: "practicing", confidence: "high" })).toBe("partial");
    expect(classify({ ...base, proficiency: "exploring", confidence: "medium" })).toBe("partial");
  });
  it("treats an absent skill as not in the list", () => {
    expect(classify(undefined)).toBe("missing");
  });
});

describe("Maya's product operations comparison", () => {
  const state = sampleState();
  const view = comparisonFor(state, state.goalId);
  it("leads with words and refuses a score", () => {
    expect(view).not.toBeNull();
    const text = narrative(view!.comparison);
    const line = coreLine(view!.comparison);
    expect(text).toBe(
      "You listed 7 skills. 1 matches this profile and 2 are partial. 6 profile skills are not in your list yet, including 4 core skills. 4 skills you listed are not in this profile, and they still count.",
    );
    expect(line).toBe("Of 6 core skills: 0 matched, 2 partial, 4 not in your list yet.");
    expect(containsScoreLanguage(text)).toBe(false);
    expect(containsScoreLanguage(line)).toBe(false);
  });
  it("orders the first three actions as missing core skills", () => {
    const suggestions = suggestActions(view!.comparison, [], "product-ops", 3);
    expect(suggestions.map((item) => item.skillId)).toEqual([
      "stakeholder-updates",
      "requirements-briefs",
      "process-mapping",
    ]);
  });
  it("shows a kinder core match when the goal changes to customer success", () => {
    const changed = setGoal(state, "customer-success");
    expect(changed.ok).toBe(true);
    if (!changed.ok) return;
    const next = comparisonFor(changed.state, "customer-success");
    const matched = next!.comparison.rows.filter((row) => row.status === "matched").map((row) => row.skill.id);
    expect(matched).toContain("customer-communication");
    expect(matched).toContain("complaint-handling");
    const suggestions = suggestActions(next!.comparison, [], "customer-success", 3);
    expect(suggestions.map((item) => item.skillId)).toEqual([
      "onboarding-customers",
      "renewal-signals",
      "written-updates",
    ]);
  });
});

describe("resume paste", () => {
  it("suggests skills from Maya's practice resume and saves nothing by itself", () => {
    const result = extractSkills(SAMPLE_RESUME, SKILLS);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.suggestions.map((item) => item.skillId)).toEqual([
      "scheduling",
      "customer-communication",
      "complaint-handling",
      "coaching",
      "inventory-tracking",
      "spreadsheets",
      "written-updates",
    ]);
    expect(result.suggestions.every((item) => item.proficiency === "practicing" && item.confidence === "low")).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/phone|gender|salary/i);
  });
  it("rejects an empty paste and a dump that is too long", () => {
    expect(extractSkills("   ", SKILLS).ok).toBe(false);
    expect(extractSkills("word ".repeat(4000), SKILLS).ok).toBe(false);
  });
  it("caps the review list", () => {
    const skills = Array.from({ length: 14 }, (_, index) => ({
      id: `s${index}`,
      name: `Skill ${index}`,
      definition: "A skill.",
      phrases: [`alpha${index}`],
    }));
    const text = skills.map((skill) => skill.phrases[0]).join(" ");
    const result = extractSkills(text, skills);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.suggestions).toHaveLength(12);
    expect(result.omitted).toBe(2);
  });
});

describe("roadmap edits", () => {
  it("caps the first plan at three and can undo a done mark", () => {
    const state = addGeneratedActions(sampleState(), "product-ops", ["a", "b", "c", "d"], "2026-10-22T00:00:00.000Z");
    expect(state.actions).toHaveLength(3);
    const again = addGeneratedActions(state, "product-ops", ["e"], "2026-10-22T00:00:00.000Z");
    expect(again.actions).toHaveLength(3);
    const done = setActionStatus(state, "a", "done", "2026-10-22T01:00:00.000Z");
    expect(done.actions[0]?.status).toBe("done");
    const undone = setActionStatus(done, "a", "not-started", "2026-10-22T02:00:00.000Z");
    expect(undone.actions[0]?.status).toBe("not-started");
  });
  it("keeps a hidden requirement out of the comparison until it is restored", () => {
    const hidden = hideRequirement(sampleState(), "product-ops", "spreadsheets");
    const view = comparisonFor(hidden, "product-ops");
    expect(view!.comparison.rows.some((row) => row.skill.id === "spreadsheets")).toBe(false);
  });
});

describe("confirmation and storage", () => {
  it("does not add a suggestion until it is confirmed", () => {
    const empty = defaultState();
    const saved = confirmSuggestions(
      empty,
      [{ skillId: "scheduling", proficiency: "practicing", confidence: "low" }],
      (skillId) => `user-${skillId}`,
      "2026-10-22T00:00:00.000Z",
    );
    expect(saved.ok).toBe(true);
    if (!saved.ok) return;
    expect(saved.state.skills).toHaveLength(1);
    expect(saved.state.skills[0]?.source).toBe("confirmed-paste");
    expect(JSON.stringify(saved.state)).not.toContain(SAMPLE_RESUME);
  });
  it("round-trips state and refuses unreadable JSON without overwriting it", () => {
    const storage: KeyValueStorage = memory();
    const state = applySample("2026-10-22T00:00:00.000Z");
    expect(saveState(storage, state)).toBeNull();
    expect(loadState(storage).state.displayName).toBe("Maya Chen");
    storage.setItem("skillbridge.career-navigator.v1", "{");
    const broken = loadState(storage);
    expect(broken.problem).toMatch(/could not be read/i);
    expect(storage.getItem("skillbridge.career-navigator.v1")).toBe("{");
    clearState(storage);
    expect(loadState(storage).problem).toBeNull();
  });
  it("does not treat the sample as the user's own work", () => {
    expect(hasUserWork(sampleState())).toBe(false);
    expect(hasUserWork(defaultState())).toBe(false);
    const named = defaultState();
    named.displayName = "Alex";
    expect(hasUserWork(named)).toBe(true);
  });
});

describe("custom role and skill", () => {
  it("creates a role the person wrote and adds a requirement they can compare", () => {
    const created = createCustomRole(defaultState(), "Studio coordinator", "Keep the studio week moving and written down.", "custom-1", "2026-10-22T00:00:00.000Z");
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const withSkill = saveSkill(
      created.state,
      {
        existingId: null,
        skillId: "scheduling",
        customName: "",
        customDefinition: "",
        proficiency: "comfortable",
        confidence: "high",
        evidence: "I build the weekly plan.",
      },
      { user: "u1", extra: "e1" },
      "2026-10-22T00:00:00.000Z",
    );
    expect(withSkill.ok).toBe(true);
    if (!withSkill.ok) return;
    const edited = addRequirement(withSkill.state, "custom-1", "scheduling", "core", "The week falls over without a plan.");
    expect(edited.ok).toBe(true);
    if (!edited.ok) return;
    const view = comparisonFor(edited.state, "custom-1");
    expect(view!.comparison.rows[0]?.status).toBe("matched");
    expect(view!.role.source).toMatch(/You wrote this profile/);
    const text = narrative(view!.comparison);
    expect(containsScoreLanguage(text)).toBe(false);
  });
});

describe("routes", () => {
  it("parses the prototype paths", () => {
    expect(parseHash("")).toEqual({ name: "welcome" });
    expect(parseHash("#/skills/new?skill=sql-basics")).toEqual({ name: "skill-form", id: null, presetSkillId: "sql-basics" });
    expect(parseHash("#/compare/spreadsheets")).toEqual({ name: "gap", skillId: "spreadsheets" });
    expect(parseHash("#/nope")).toEqual({ name: "not-found" });
  });
});

describe("direct compare helper", () => {
  it("counts an empty profile without inventing a percentage", () => {
    const comparison = compareSkills([], [], SKILLS);
    expect(narrative(comparison)).toMatch(/not added any skills/i);
    expect(containsScoreLanguage(coreLine(comparison))).toBe(false);
  });
});
