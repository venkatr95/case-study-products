import { CONFIDENCE, EMPTY_SKILLS_COMPARE, PROFICIENCY, STATUS } from "../copy";
import { templateFor } from "../data/actions";
import { SAMPLE_RESUME } from "../data/sample";
import { catalogFor } from "../lib/role-resolve";
import { coreLine, narrative } from "../lib/compare";
import type { CompareFilter, Proficiency, Confidence } from "../types";
import {
  ACTION_STATUS,
  btn,
  confidenceGroup,
  empty,
  formError,
  importanceChip,
  limitation,
  link,
  meter,
  pasteWarning,
  proficiencyGroup,
  resources,
  statusButtons,
  statusChip,
  textField,
  areaField,
} from "./bits";
import { actions, h, page } from "./dom";
import type { View } from "./model";

const FILTERS: Array<{ id: CompareFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "core", label: "Core" },
  { id: "supporting", label: "Supporting" },
  { id: "matched", label: "Matched" },
  { id: "partial", label: "Partial" },
  { id: "missing", label: "Not in your list" },
  { id: "extra", label: "Your other skills" },
];

export function renderSkills(view: View): HTMLElement {
  const catalog = catalogFor(view.state);
  return page("S-05", "", [
    h("p", { class: "kicker", text: "Step 2 · Skills you already have" }),
    h("h1", { text: "Your skills" }),
    h("p", { class: "lede", text: "Add skills you use now. Proficiency and confidence are self-assessments. You can revise or remove either one." }),
    formError(view.formError),
    view.state.skills.length === 0
      ? empty("No skills yet", "Start with one skill you could explain to a teammate. You can also paste resume text and review suggestions before anything is saved.", [
          link("#/skills/new", "Add a skill", "primary"),
          link("#/import", "Paste resume text"),
        ])
      : h("ul", { class: "stack" }, view.state.skills.map((skill) => {
          const def = catalog.find((item) => item.id === skill.skillId);
          return h("li", { class: "card" }, [
            h("h2", { text: def?.name ?? "Skill" }),
            h("p", { text: def?.definition ?? "" }),
            h("p", { text: `${PROFICIENCY[skill.proficiency].label}. ${PROFICIENCY[skill.proficiency].hint}` }),
            h("p", { text: `Confidence: ${CONFIDENCE[skill.confidence].label}. ${CONFIDENCE[skill.confidence].hint}` }),
            skill.evidence ? h("p", { text: `Example: ${skill.evidence}` }) : null,
            h("p", { class: "meta", text: skill.source === "confirmed-paste" ? "You confirmed this from pasted text." : "You entered this." }),
            actions([
              link(`#/skills/${skill.id}`, "Edit"),
              btn("Remove", { "data-action": "ask-remove-skill", "data-id": skill.id, "data-name": def?.name ?? "this skill" }, "danger"),
            ]),
          ]);
        })),
    actions([
      link("#/skills/new", "Add a skill", "primary"),
      link("#/import", "Paste resume text"),
      view.state.goalId ? link("#/compare", "See the comparison") : link("#/goals", "Choose a role"),
    ]),
  ]);
}

export function renderSkillForm(view: View): HTMLElement {
  const route = view.route;
  if (route.name !== "skill-form") return page("S-06", "narrow", []);
  const catalog = catalogFor(view.state);
  const existing = route.id ? view.state.skills.find((skill) => skill.id === route.id) : undefined;
  const preset = route.presetSkillId;
  const selected = existing?.skillId ?? preset ?? "";
  const select = h("select", { id: "skillChoice", name: "skillChoice" });
  select.append(h("option", { value: "", text: "Choose a skill" }));
  for (const skill of catalog) {
    const option = h("option", { value: skill.id, text: skill.name });
    if (skill.id === selected) option.selected = true;
    select.append(option);
  }
  select.append(h("option", { value: "custom", text: "A skill that is not listed" }));
  const customBox = h("div", { id: "custom-skill" }, [
    textField("custom-name", "customName", "Skill name", ""),
    areaField("custom-definition", "customDefinition", "Definition", "", "One sentence, so the comparison stays understandable."),
  ]);
  customBox.hidden = true;
  return page("S-06", "narrow", [
    h("h1", { text: existing ? "Edit a skill" : "Add a skill" }),
    h("p", { text: "This is your description of your own experience. It is not a test result." }),
    formError(view.formError),
    h("form", { id: "skill-form" }, [
      h("input", { type: "hidden", name: "existingId", value: existing?.id ?? "" }),
      h("div", { class: "field" }, [h("label", { for: "skillChoice", text: "Skill" }), select]),
      customBox,
      proficiencyGroup(existing?.proficiency ?? ""),
      confidenceGroup(existing?.confidence ?? ""),
      areaField("evidence", "evidence", "Where have you used this?", existing?.evidence ?? "", "Optional. A recent example helps you trust the entry later."),
      actions([
        btn(existing ? "Save changes" : "Save skill", { type: "submit" }, "primary"),
        link("#/skills", "Cancel"),
      ]),
    ]),
  ]);
}

export function renderImport(view: View): HTMLElement {
  const area = h("textarea", { id: "resume", name: "resume", rows: "12" });
  area.value = view.importText;
  return page("S-07", "narrow", [
    h("p", { class: "kicker", text: "Optional" }),
    h("h1", { text: "Paste resume text" }),
    h("p", { class: "lede", text: "SkillBridge looks for phrases it knows and suggests skills. Suggestions can be wrong. Nothing is saved until you review them and check the ones that are true." }),
    pasteWarning(),
    h("p", { class: "hint", text: "The paste stays in this tab only. Refreshing discards it. Confirmed skills are saved on this browser." }),
    formError(view.formError),
    h("form", { id: "import-form" }, [
      h("div", { class: "field" }, [h("label", { for: "resume", text: "Resume text" }), area]),
      actions([
        btn("Review suggestions", { type: "submit" }, "primary"),
        btn("Use the practice resume", { "data-action": "fill-practice" }),
      ]),
    ]),
    h("details", {}, [
      h("summary", { text: "What is the practice resume?" }),
      h("p", { text: "A fictional resume for Maya Chen, a retail shift lead. It is here so you can try the review step." }),
      h("pre", { class: "sample-resume", text: SAMPLE_RESUME }),
    ]),
    actions([link("#/skills", "Back to skills")]),
  ]);
}

export function renderImportReview(view: View): HTMLElement {
  const result = view.importResult;
  if (!result || !result.ok) {
    return page("S-08", "narrow", [
      h("h1", { text: "Review suggestions" }),
      empty("Nothing to review", result && !result.ok ? result.error : "Paste resume text first. The paste is not kept after a refresh.", [
        link("#/import", "Paste resume text", "primary"),
      ]),
    ]);
  }
  const catalog = catalogFor(view.state);
  return page("S-08", "", [
    h("h1", { text: "Check the skills that are true" }),
    h("p", { class: "lede", text: "Each suggestion starts at Practicing, with low confidence, because pasted text is a weak signal. Change either value before you save. Unchecked skills are discarded." }),
    pasteWarning(),
    result.omitted > 0 ? h("p", { text: `${result.omitted} more phrases were found and are not shown. Add those skills yourself if they matter.` }) : null,
    formError(view.formError),
    h("form", { id: "import-review" }, [
      h("ul", { class: "stack" }, result.suggestions.map((suggestion) => {
        const skill = catalog.find((item) => item.id === suggestion.skillId);
        const prof = h("select", { id: `prof-${suggestion.skillId}`, name: `proficiency-${suggestion.skillId}`, "aria-label": `Proficiency for ${skill?.name ?? "skill"}` });
        for (const key of Object.keys(PROFICIENCY) as Proficiency[]) {
          const option = h("option", { value: key, text: PROFICIENCY[key].label });
          if (key === "practicing") option.selected = true;
          prof.append(option);
        }
        const conf = h("select", { id: `conf-${suggestion.skillId}`, name: `confidence-${suggestion.skillId}`, "aria-label": `Confidence for ${skill?.name ?? "skill"}` });
        for (const key of Object.keys(CONFIDENCE) as Confidence[]) {
          const option = h("option", { value: key, text: CONFIDENCE[key].label });
          if (key === "low") option.selected = true;
          conf.append(option);
        }
        return h("li", { class: "card" }, [
          h("label", { class: "check" }, [
            h("input", { type: "checkbox", name: "pick", value: suggestion.skillId }),
            h("span", { text: skill?.name ?? suggestion.skillId }),
          ]),
          h("p", { text: skill?.definition ?? "" }),
          h("p", { text: `Found: “${suggestion.snippet}”` }),
          h("p", { class: "meta", text: "Suggested from pasted text. Not saved until you check it and confirm." }),
          h("div", { class: "split" }, [
            h("div", { class: "field" }, [h("label", { for: `prof-${suggestion.skillId}`, text: "Proficiency" }), prof]),
            h("div", { class: "field" }, [h("label", { for: `conf-${suggestion.skillId}`, text: "Confidence" }), conf]),
          ]),
        ]);
      })),
      actions([
        btn("Add the skills I checked", { type: "submit", "data-confirm-import": "true", disabled: true }, "primary"),
        btn("Delete pasted text", { "data-action": "discard-paste" }, "danger"),
      ]),
    ]),
    h("p", { class: "hint", text: "The button stays off until you check at least one skill." }),
  ]);
}

export function renderCompare(view: View): HTMLElement {
  if (!view.state.goalId || !view.role || !view.comparison) {
    return page("S-09", "narrow", [
      h("h1", { text: "Comparison" }),
      empty("Choose a role first", "The comparison needs a role profile and the skills you enter.", [link("#/goals", "Choose a role", "primary")]),
    ]);
  }
  if (view.state.skills.length === 0) {
    return page("S-09", "", [
      h("p", { class: "kicker", text: view.role.name }),
      h("h1", { text: "Comparison" }),
      limitation(),
      empty("Your skill list is empty", EMPTY_SKILLS_COMPARE, [link("#/skills/new", "Add a skill", "primary"), link("#/import", "Paste resume text")]),
      h("section", { "aria-labelledby": "includes" }, [
        h("h2", { id: "includes", text: "This profile includes" }),
        h("ul", {}, view.role.requirements.map((requirement) => {
          const skill = catalogFor(view.state).find((item) => item.id === requirement.skillId);
          return h("li", { text: `${skill?.name ?? requirement.skillId} (${requirement.importance})` });
        })),
      ]),
    ]);
  }
  const rows = view.comparison.rows.filter((row) => {
    if (view.filter === "extra") return false;
    if (view.filter === "core" || view.filter === "supporting") return row.requirement.importance === view.filter;
    if (view.filter === "matched" || view.filter === "partial" || view.filter === "missing") return row.status === view.filter;
    return true;
  });
  const showExtras = view.filter === "all" || view.filter === "extra";
  return page("S-09", "", [
    h("p", { class: "kicker", text: view.role.name }),
    h("h1", { text: "Comparison" }),
    limitation(),
    h("p", { class: "lede", text: narrative(view.comparison) }),
    h("p", { text: coreLine(view.comparison) }),
    h("div", { class: "segmented", role: "group", "aria-label": "Filter the comparison" }, FILTERS.map((filter) => btn(filter.label, {
      "data-action": "set-filter",
      "data-filter": filter.id,
      "aria-pressed": view.filter === filter.id ? "true" : "false",
      class: view.filter === filter.id ? "btn btn-primary" : "btn btn-ghost",
    }))),
    h("ul", { class: "legend" }, (Object.keys(STATUS) as Array<keyof typeof STATUS>).map((key) => h("li", {}, [
      h("strong", { text: `${STATUS[key].label}. ` }),
      STATUS[key].definition,
    ]))),
    h("details", {}, [
      h("summary", { text: "How matching works" }),
      h("p", { text: "Matched means comfortable or strong, and your confidence is medium or high." }),
      h("p", { text: "Partial means exploring, practicing, or a solid level with low confidence." }),
      h("p", { text: "Not in your list means the profile includes the skill and you have not added it." }),
      h("p", { text: "Your self-assessment is the only input. SkillBridge does not score you." }),
    ]),
    rows.length === 0 && view.filter !== "extra"
      ? h("p", { text: "Nothing in this view. Choose All to see the whole comparison." })
      : null,
    rows.length > 0
      ? h("section", { "aria-labelledby": "profile-skills" }, [
          h("h2", { id: "profile-skills", text: "Skills in this role profile" }),
          h("ol", { class: "stack" }, rows.map((row) => h("li", { class: "card compare-item" }, [
            h("div", { class: "compare-top" }, [h("h3", { text: row.skill.name }), statusChip(row.status)]),
            importanceChip(row.requirement.importance),
            h("p", { text: row.skill.definition }),
            h("p", { text: `Why it is in the profile: ${row.requirement.why}` }),
            h("p", { text: row.user ? `You marked ${PROFICIENCY[row.user.proficiency].label.toLowerCase()}, confidence ${CONFIDENCE[row.user.confidence].label.toLowerCase()}.` : "You have not added this skill." }),
            row.user?.evidence ? h("p", { text: `Example: ${row.user.evidence}` }) : null,
            link(`#/compare/${row.skill.id}`, "See why and what to do"),
          ]))),
        ])
      : null,
    showExtras
      ? h("section", { "aria-labelledby": "extras" }, [
          h("h2", { id: "extras", text: "In your list, not in this profile" }),
          h("p", { text: "These still count as experience. The profile does not require them. They are not failures." }),
          view.comparison.extras.length === 0
            ? h("p", { text: "Every skill you listed is in this profile." })
            : h("ul", { class: "stack" }, view.comparison.extras.map((extra) => h("li", { class: "card" }, [
                h("h3", { text: extra.skill.name }),
                h("p", { text: `${PROFICIENCY[extra.user.proficiency].label}. Confidence: ${CONFIDENCE[extra.user.confidence].label}.` }),
                link(`#/compare/${extra.skill.id}`, "See this skill"),
              ]))),
        ])
      : null,
    actions([
      btn("Review a small plan", { "data-action": "open-plan" }, "primary"),
      link("#/skills", "Edit my skills"),
      link("#/role/edit", "Edit this role profile"),
    ]),
  ]);
}

export function renderGap(view: View): HTMLElement {
  if (view.route.name !== "gap" || !view.role || !view.comparison) {
    return page("S-10", "narrow", [h("h1", { text: "Skill detail" }), empty("Choose a role and add skills first", "Then open a skill from the comparison.", [link("#/goals", "Choose a role", "primary")])]);
  }
  const skillId = view.route.skillId;
  const row = view.comparison.rows.find((item) => item.skill.id === skillId);
  const extra = view.comparison.extras.find((item) => item.skill.id === skillId);
  if (!row && !extra) {
    return page("S-10", "narrow", [h("h1", { text: "That skill is not in this comparison" }), link("#/compare", "Back to the comparison", "primary")]);
  }
  if (extra && !row) {
    return page("S-10", "narrow", [
      h("h1", { text: extra.skill.name }),
      h("p", { class: "lede", text: "This is in your list and not in this role profile. It is not a gap." }),
      h("p", { text: extra.skill.definition }),
      h("p", { text: `${PROFICIENCY[extra.user.proficiency].label}. Confidence: ${CONFIDENCE[extra.user.confidence].label}.` }),
      extra.user.evidence ? h("p", { text: `Example: ${extra.user.evidence}` }) : null,
      actions([link("#/compare", "Back to the comparison"), link(`#/skills/${extra.user.id}`, "Edit this skill")]),
    ]);
  }
  if (!row) return page("S-10", "narrow", []);
  const existingAction = view.roleActions.find((action) => action.skillId === row.skill.id);
  const template = templateFor(row.skill);
  return page("S-10", "narrow", [
    h("p", { class: "kicker", text: view.role.name }),
    h("h1", { text: row.skill.name }),
    statusChip(row.status),
    h("p", { text: STATUS[row.status].definition }),
    importanceChip(row.requirement.importance),
    h("h2", { text: "Why it is in the profile" }),
    h("p", { text: row.requirement.why }),
    h("h2", { text: "What you entered" }),
    h("p", { text: row.user ? `${PROFICIENCY[row.user.proficiency].label}. Confidence: ${CONFIDENCE[row.user.confidence].label}.` : "You have not added this skill. Add it if you already do it." }),
    row.user?.evidence ? h("p", { text: `Example: ${row.user.evidence}` }) : null,
    h("h2", { text: "A small way to practice" }),
    h("p", { text: template.outcome }),
    h("p", { text: template.firstStep }),
    h("p", { text: `Evidence you could keep: ${template.evidenceToCollect}` }),
    resources(template.resources),
    actions([
      row.user ? link(`#/skills/${row.user.id}`, "Update my level") : link(`#/skills/new?skill=${row.skill.id}`, "Add this skill", "primary"),
      existingAction ? link(`#/roadmap/${existingAction.id}`, "Open the action") : btn("Add a learning action", { "data-action": "add-gap", "data-skill": row.skill.id }, "primary"),
      btn("This is not part of the role I mean", { "data-action": "hide-requirement", "data-skill": row.skill.id }),
      link("#/compare", "Back to the comparison"),
    ]),
  ]);
}

export function renderRoadmap(view: View): HTMLElement {
  if (!view.state.goalId || !view.role || !view.comparison) {
    return page("S-11", "narrow", [h("h1", { text: "Roadmap" }), empty("Choose a role first", "The plan is tied to one role profile.", [link("#/goals", "Choose a role", "primary")])]);
  }
  const matchedCore = view.comparison.rows.filter((row) => row.requirement.importance === "core" && row.status === "matched").length;
  return page("S-11", "", [
    h("p", { class: "kicker", text: view.role.name }),
    h("h1", { text: "A small plan" }),
    limitation(),
    h("p", { class: "lede", text: matchedCore === 0
      ? "None of the core skills are matched yet. That can happen when your experience uses different words. Check the comparison before you treat these as gaps."
      : `You already matched ${matchedCore} core ${matchedCore === 1 ? "skill" : "skills"}. These actions cover the next gaps.` }),
    h("p", { text: "The first plan is three actions. You can edit, remove, or add more." }),
    formError(view.formError),
    view.roleActions.length === 0
      ? empty("No actions saved yet", view.state.skills.length === 0 ? "Add skills before building a plan, so the plan can see what you already do." : "Save three actions from the highest-priority gaps, or write your own.", [
          view.state.skills.length === 0 ? link("#/skills/new", "Add a skill", "primary") : btn("Save my first three actions", { "data-action": "build-roadmap" }, "primary"),
          link("#/roadmap/new", "Add my own action"),
        ])
      : h("ol", { class: "stack" }, view.roleActions.map((action, index) => h("li", { class: "card" }, [
          h("p", { class: "meta", text: `Action ${index + 1}` }),
          h("h2", { text: action.title }),
          h("p", { class: "chip", text: ACTION_STATUS[action.status] }),
          h("p", { text: action.outcome }),
          h("p", { text: `First step: ${action.firstStep}` }),
          link(`#/roadmap/${action.id}`, "Open action"),
        ]))),
    view.roleActions.length > 0 && view.suggestions.length > 0
      ? h("section", { class: "card" }, [
          h("h2", { text: "Next gaps you have not saved" }),
          h("ul", {}, view.suggestions.map((item) => h("li", { text: item.title }))),
          btn("Add the next gap", { "data-action": "add-next-gap" }),
        ])
      : null,
    actions([link("#/compare", "Back to the comparison"), link("#/roadmap/new", "Add my own action"), link("#/progress", "See progress")]),
  ]);
}

export function renderAction(view: View): HTMLElement {
  const route = view.route;
  if (route.name !== "action") return page("S-12", "narrow", []);
  const creating = route.id === null;
  const action = creating ? null : view.roleActions.find((item) => item.id === route.id) ?? view.state.actions.find((item) => item.id === route.id);
  if (!creating && !action) {
    return page("S-12", "narrow", [h("h1", { text: "That action is not on your roadmap" }), link("#/roadmap", "Back to the roadmap", "primary")]);
  }
  const keep = h("input", { type: "checkbox", name: "keepResources", id: "keep-resources" });
  keep.checked = true;
  return page("S-12", "narrow", [
    h("p", { class: "kicker", text: "Action" }),
    h("h1", { text: action?.title ?? "Add your own action" }),
    action ? h("p", { text: action.why }) : h("p", { text: "Write an action you can finish in one sitting." }),
    formError(view.formError),
    action ? statusButtons(action.id, action.status) : null,
    h("form", { id: "action-form" }, [
      textField("action-title", "title", "Action", action?.title ?? ""),
      areaField("action-outcome", "outcome", "What you will be able to do", action?.outcome ?? ""),
      areaField("action-step", "firstStep", "First step", action?.firstStep ?? "", "Make it small enough for one sitting."),
      areaField("action-evidence", "evidence", "Evidence to keep", action?.evidenceToCollect ?? "", "Optional. A note, a brief, or a screenshot description."),
      areaField("action-note", "note", "Your note", action?.note ?? ""),
      action && action.resources.length > 0
        ? h("div", {}, [
            h("h2", { text: "Example resource" }),
            resources(action.resources),
            h("label", { class: "check", for: "keep-resources" }, [keep, h("span", { text: "Keep the example link on this action" })]),
          ])
        : null,
      actions([
        btn(creating ? "Save action" : "Save changes", { type: "submit" }, "primary"),
        link("#/roadmap", "Back to the roadmap"),
        action ? btn("Remove action", { "data-action": "ask-remove-action", "data-id": action.id, "data-title": action.title }, "danger") : null,
      ]),
    ]),
  ]);
}

export function renderProgress(view: View): HTMLElement {
  const actionsForRole = view.roleActions;
  const done = actionsForRole.filter((action) => action.status === "done").length;
  const reflection = h("textarea", { id: "reflection", name: "reflection", rows: "5" });
  reflection.value = view.state.reflection;
  return page("S-13", "narrow", [
    h("h1", { text: "Progress" }),
    limitation(),
    actionsForRole.length === 0
      ? empty("No actions to track yet", "Save a plan first. Progress here is only what you mark. It is not a score.", [link("#/roadmap", "Go to the roadmap", "primary")])
      : h("section", {}, [
          h("p", { class: "lede", text: `You marked ${done} of ${actionsForRole.length} ${actionsForRole.length === 1 ? "action" : "actions"} done.` }),
          meter(done, actionsForRole.length),
          h("ul", { class: "stack" }, actionsForRole.map((action) => h("li", { class: "card" }, [
            h("h2", { text: action.title }),
            h("p", { text: ACTION_STATUS[action.status] }),
            link(`#/roadmap/${action.id}`, "Update"),
          ]))),
        ]),
    h("form", { id: "reflection-form", class: "card" }, [
      h("div", { class: "field" }, [
        h("label", { for: "reflection", text: "What felt useful? What felt like too much?" }),
        reflection,
      ]),
      actions([btn("Save note", { type: "submit" }, "primary")]),
    ]),
    view.state.lastOpened ? h("p", { class: "hint", text: `Last opened ${view.state.lastOpened.slice(0, 10)}.` }) : null,
    actions([link("#/roadmap", "Back to the roadmap")]),
  ]);
}
