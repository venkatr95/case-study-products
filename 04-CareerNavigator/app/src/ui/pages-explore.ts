import { LIMITATION, SAMPLE_NOTE, UVP } from "../copy";
import { ROLES } from "../data/roles";
import { catalogFor, findRole } from "../lib/role-resolve";
import { continueHash } from "../lib/routes";
import type { Importance } from "../types";
import { IMPORTANCE, btn, empty, formError, importanceChip, link, textField, areaField } from "./bits";
import { actions, h, page } from "./dom";
import type { View } from "./model";

export function renderWelcome(view: View): HTMLElement {
  const actionCount = view.state.actions.filter((item) => item.roleId === view.state.goalId).length;
  const returning = view.state.acknowledgedLimits && (view.state.goalId !== null || view.state.skills.length > 0);
  const next = continueHash(view.state.goalId, view.state.skills.length, actionCount);
  return page("S-01", "narrow", [
    h("p", { class: "kicker", text: "Career navigator" }),
    h("h1", { text: UVP }),
    h("p", { class: "lede", text: "SkillBridge compares skills you choose to enter with a role profile, then turns the gaps into a few small actions." }),
    h("ul", { class: "points" }, [
      h("li", { text: "You say what you can already do, and how sure you are." }),
      h("li", { text: "You see matched, partial, and not in your list. There is no score." }),
      h("li", { text: "You keep a short plan, edit every action, and mark what you finish." }),
    ]),
    h("section", { class: "card", "aria-labelledby": "not-this" }, [
      h("h2", { id: "not-this", text: "What this is not" }),
      h("ul", {}, [
        h("li", { text: "A prediction that an employer will interview, hire, or pay you." }),
        h("li", { text: "A ranking tool for recruiters or employers." }),
        h("li", { text: "A test of your worth, or a place to infer sensitive personal details." }),
      ]),
      h("p", { text: LIMITATION }),
    ]),
    formError(view.formError),
    actions([
      returning ? btn("Continue", { "data-action": "continue", "data-href": next }, "primary") : btn("Choose a role", { "data-action": "go", "data-href": "#/goals" }, "primary"),
      view.state.usingSample
        ? btn("Start my own profile", { "data-action": "start-own" })
        : btn("Explore with Maya's sample", { "data-action": "use-sample" }),
    ]),
    h("p", { class: "hint", text: SAMPLE_NOTE }),
  ]);
}

export function renderGoals(view: View): HTMLElement {
  return page("S-02", "", [
    h("p", { class: "kicker", text: "Step 1 · Goal" }),
    h("h1", { text: "Choose a role to explore" }),
    h("p", { class: "lede", text: "Four roles sit in customer, operations, and coordination work. Junior data analyst is a larger jump, so you can see a wide gap without a score. Every profile is illustrative." }),
    formError(view.formError),
    h("div", { class: "cards" }, ROLES.map((role) => h("article", { class: "card role-card" }, [
      h("p", { class: "meta", text: role.family }),
      h("h2", { text: role.name }),
      view.state.goalId === role.id ? h("p", { class: "chip chip-matched", text: "Your current goal" }) : null,
      role.stretch ? h("p", { class: "hint", text: "Larger jump. A long list of gaps here is a description of this profile, not a verdict about you." }) : null,
      h("p", { text: role.summary }),
      actions([
        btn("Read the profile", { "data-action": "go", "data-href": `#/goals/${role.id}` }),
        btn(view.state.goalId === role.id ? "Open this goal" : "Use this role", { "data-action": "choose-goal", "data-id": role.id }, "primary"),
      ]),
    ]))),
    h("section", { class: "card", "aria-labelledby": "custom-role" }, [
      h("h2", { id: "custom-role", text: "Describe a role that is not listed" }),
      h("p", { text: "You write the profile. It is not a reviewed occupational standard. After you save it, add the skills you think the role needs." }),
      h("form", { id: "create-role" }, [
        textField("role-name", "name", "Role name", "", "For example, Studio coordinator."),
        areaField("role-summary", "summary", "What the work is, in one sentence", ""),
        actions([btn("Save this role", { type: "submit" }, "primary")]),
      ]),
    ]),
  ]);
}

export function renderRole(view: View): HTMLElement {
  const preview = view.route.name === "preview";
  const role = view.role ?? (preview && view.route.name === "preview" ? findRole(view.state, view.route.id) : null);
  if (!role) {
    return page("S-03", "narrow", [
      h("h1", { text: "Choose a role first" }),
      empty("No role selected", "The comparison needs a role profile.", [link("#/goals", "Choose a role", "primary")]),
    ]);
  }
  const resolved = view.role;
  const requirements = resolved?.requirements ?? role.requirements;
  return page("S-03", "", [
    h("p", { class: "kicker", text: preview ? "Profile preview" : "Your goal" }),
    h("h1", { text: role.name }),
    h("p", { class: "meta", text: role.family }),
    role.stretch ? h("p", { class: "hint", text: "This is a larger jump than the other sample roles." }) : null,
    h("p", { class: "lede", text: role.summary }),
    h("section", { class: "card source-card", "aria-labelledby": "source-title" }, [
      h("h2", { id: "source-title", text: "Where this profile comes from" }),
      h("p", { text: role.source }),
      h("p", { class: "meta", text: `Last updated ${role.updated}.` }),
    ]),
    h("section", { "aria-labelledby": "needs" }, [
      h("h2", { id: "needs", text: "Skills in this profile" }),
      requirements.length === 0
        ? empty("No skills in this profile yet", "Add the skills you think the role needs before comparing.", [link("#/role/edit", "Edit this profile", "primary")])
        : h("ol", { class: "stack" }, requirements.map((requirement) => {
            const skill = catalogFor(view.state).find((item) => item.id === requirement.skillId);
            return h("li", { class: "card" }, [
              h("h3", { text: skill?.name ?? "Unknown skill" }),
              importanceChip(requirement.importance),
              h("p", { text: skill?.definition ?? "" }),
              h("p", { text: `Why it is in this profile: ${requirement.why}` }),
              requirement.addedByUser ? h("p", { class: "meta", text: "Added by you." }) : null,
            ]);
          })),
    ]),
    actions([
      preview ? btn("Use this as my goal", { "data-action": "choose-goal", "data-id": role.id }, "primary") : link("#/compare", "Compare with my skills", "primary"),
      preview ? link("#/goals", "Back to roles") : link("#/role/edit", "Edit this profile"),
      preview ? null : link("#/goals", "Change role"),
    ]),
  ]);
}

export function renderRoleEdit(view: View): HTMLElement {
  const role = view.role;
  if (!role || !view.state.goalId) {
    return page("S-04", "narrow", [h("h1", { text: "Choose a role first" }), link("#/goals", "Choose a role", "primary")]);
  }
  const catalog = catalogFor(view.state);
  const visible = new Set(role.requirements.map((item) => item.skillId));
  const available = catalog.filter((skill) => !visible.has(skill.id));
  const select = h("select", { id: "add-skill", name: "skillId" });
  select.append(h("option", { value: "", text: "Choose a skill" }));
  for (const skill of available) select.append(h("option", { value: skill.id, text: skill.name }));
  const importance = h("select", { id: "add-importance", name: "importance" });
  for (const key of Object.keys(IMPORTANCE) as Importance[]) {
    importance.append(h("option", { value: key, text: IMPORTANCE[key].label }));
  }
  return page("S-04", "", [
    h("p", { class: "kicker", text: "Edit role profile" }),
    h("h1", { text: role.name }),
    h("p", { text: "Hiding a skill removes it from your comparison. It does not delete it from the original illustrative profile. You can restore it." }),
    formError(view.formError),
    h("ol", { class: "stack" }, role.requirements.map((requirement) => {
      const skill = catalog.find((item) => item.id === requirement.skillId);
      return h("li", { class: "card" }, [
        h("h2", { text: skill?.name ?? requirement.skillId }),
        importanceChip(requirement.importance),
        h("p", { text: requirement.why }),
        requirement.addedByUser ? h("p", { class: "meta", text: "Added by you." }) : h("p", { class: "meta", text: "From the illustrative profile." }),
        btn("Hide from my comparison", { "data-action": "hide-requirement", "data-skill": requirement.skillId }),
      ]);
    })),
    role.hidden.length > 0
      ? h("section", { "aria-labelledby": "hidden-title" }, [
          h("h2", { id: "hidden-title", text: "Hidden from your comparison" }),
          h("ul", { class: "stack" }, role.hidden.map((skillId) => h("li", { class: "card" }, [
            h("p", { text: catalog.find((item) => item.id === skillId)?.name ?? skillId }),
            btn("Restore", { "data-action": "restore-requirement", "data-skill": skillId }),
          ]))),
        ])
      : null,
    h("section", { class: "card", "aria-labelledby": "add-req" }, [
      h("h2", { id: "add-req", text: "Add a skill this role needs" }),
      available.length === 0
        ? h("p", { text: "Every skill in the catalog is already in this profile." })
        : h("form", { id: "add-requirement" }, [
            h("div", { class: "field" }, [h("label", { for: "add-skill", text: "Skill" }), select]),
            h("div", { class: "field" }, [h("label", { for: "add-importance", text: "How central it is" }), importance]),
            areaField("add-why", "why", "Why this role needs it", "", "One sentence is enough."),
            actions([btn("Add to this profile", { type: "submit" }, "primary")]),
          ]),
    ]),
    actions([link("#/role", "Back to the profile"), link("#/compare", "See the comparison", "primary")]),
  ]);
}

export function renderSettings(view: View): HTMLElement {
  const saved = view.state.skills.length + view.state.actions.length + view.state.customRoles.length > 0 || view.state.displayName !== "";
  return page("S-14", "narrow", [
    h("h1", { text: "Settings and your data" }),
    h("p", { class: "lede", text: "SkillBridge stores this profile in this browser only. It does not have an account, and it does not keep pasted resume text." }),
    formError(view.formError),
    h("form", { id: "name-form", class: "card" }, [
      textField("display-name", "displayName", "Name on this profile", view.state.displayName, "Optional. It stays on this browser."),
      actions([btn("Save name", { type: "submit" }, "primary")]),
    ]),
    h("section", { class: "card", "aria-labelledby": "stored" }, [
      h("h2", { id: "stored", text: "What is saved" }),
      h("ul", {}, [
        h("li", { text: `${view.state.skills.length} skills you entered or confirmed.` }),
        h("li", { text: `${view.state.actions.length} roadmap actions.` }),
        h("li", { text: view.state.usingSample ? "This profile started as Maya's fictional sample." : "This profile was not loaded from the sample." }),
        h("li", { text: saved ? "A copy includes this saved profile and not any resume paste." : "Nothing meaningful is saved yet." }),
      ]),
      actions([btn("Copy saved data", { "data-action": "copy-backup" })]),
    ]),
    h("section", { class: "card", "aria-labelledby": "limits" }, [
      h("h2", { id: "limits", text: "Limits" }),
      h("p", { text: LIMITATION }),
      h("p", { text: "Role profiles in this prototype were written on 22 Oct 2026 as illustrations. They are not employer requirements." }),
    ]),
    h("section", { class: "card danger-zone", "aria-labelledby": "delete-title" }, [
      h("h2", { id: "delete-title", text: "Delete" }),
      view.state.usingSample ? btn("Reset Maya's sample", { "data-action": "ask-reset-sample" }) : null,
      btn("Delete saved data on this browser", { "data-action": "ask-delete" }, "danger"),
    ]),
  ]);
}

export function renderProblem(view: View): HTMLElement {
  return page("S-15", "narrow", [
    h("h1", { text: "Saved data could not be read" }),
    h("p", { text: view.loadProblem ?? "This browser has saved data SkillBridge cannot use." }),
    h("p", { text: "Your previous data is still in this browser. Clearing it is permanent. SkillBridge will not overwrite it unless you ask." }),
    actions([btn("Delete the unreadable data and start over", { "data-action": "clear-unreadable" }, "danger")]),
  ]);
}

export function renderNotFound(): HTMLElement {
  return page("S-16", "narrow", [
    h("h1", { text: "That page is not in SkillBridge" }),
    h("p", { text: "The link may be mistyped. Your saved profile is unchanged." }),
    actions([link("#/welcome", "Go to the start", "primary")]),
  ]);
}
