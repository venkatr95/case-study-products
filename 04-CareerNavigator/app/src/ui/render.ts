import { PRODUCT } from "../copy";
import type { Route } from "../lib/routes";
import { btn } from "./bits";
import { h } from "./dom";
import type { DialogModel, View } from "./model";
import { renderGoals, renderNotFound, renderProblem, renderRole, renderRoleEdit, renderSettings, renderWelcome } from "./pages-explore";
import {
  renderAction,
  renderCompare,
  renderGap,
  renderImport,
  renderImportReview,
  renderProgress,
  renderRoadmap,
  renderSkillForm,
  renderSkills,
} from "./pages-work";

const NAV = [
  { id: "goals", href: "#/goals", label: "Goal" },
  { id: "skills", href: "#/skills", label: "Skills" },
  { id: "compare", href: "#/compare", label: "Comparison" },
  { id: "roadmap", href: "#/roadmap", label: "Roadmap" },
  { id: "progress", href: "#/progress", label: "Progress" },
];

function navId(route: Route): string | null {
  switch (route.name) {
    case "goals":
    case "preview":
    case "role":
    case "role-edit":
      return "goals";
    case "skills":
    case "skill-form":
    case "import":
    case "import-review":
      return "skills";
    case "compare":
    case "gap":
      return "compare";
    case "roadmap":
    case "action":
      return "roadmap";
    case "progress":
      return "progress";
    default:
      return null;
  }
}

function pageBody(view: View): HTMLElement {
  if (view.loadProblem) return renderProblem(view);
  switch (view.route.name) {
    case "welcome":
      return renderWelcome(view);
    case "goals":
      return renderGoals(view);
    case "preview":
    case "role":
      return renderRole(view);
    case "role-edit":
      return renderRoleEdit(view);
    case "skills":
      return renderSkills(view);
    case "skill-form":
      return renderSkillForm(view);
    case "import":
      return renderImport(view);
    case "import-review":
      return renderImportReview(view);
    case "compare":
      return renderCompare(view);
    case "gap":
      return renderGap(view);
    case "roadmap":
      return renderRoadmap(view);
    case "action":
      return renderAction(view);
    case "progress":
      return renderProgress(view);
    case "settings":
      return renderSettings(view);
    default:
      return renderNotFound();
  }
}

function dialogNode(dialog: DialogModel): HTMLElement {
  if (dialog.type === "backup") {
    const area = h("textarea", { readonly: "true", rows: "12" });
    area.value = dialog.json;
    return h("div", { class: "backdrop" }, [
      h("div", { class: "dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "dialog-title" }, [
        h("h2", { id: "dialog-title", text: "Saved data on this browser" }),
        h("p", { text: "Resume text is not included, because SkillBridge does not store the paste." }),
        area,
        btn("Close", { "data-action": "close-dialog", "data-dialog-initial": "true" }, "primary"),
      ]),
    ]);
  }
  const copy = dialogContent(dialog);
  return h("div", { class: "backdrop" }, [
    h("div", { class: "dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "dialog-title" }, [
      h("h2", { id: "dialog-title", text: copy.title }),
      h("p", { text: copy.body }),
      h("div", { class: "actions" }, [
        btn(copy.cancel, { "data-action": "close-dialog", "data-dialog-initial": "true" }),
        btn(copy.confirm, { "data-action": "confirm-dialog" }, copy.danger ? "danger" : "primary"),
      ]),
    ]),
  ]);
}

function dialogContent(dialog: Exclude<DialogModel, { type: "backup" }>): { title: string; body: string; confirm: string; cancel: string; danger: boolean } {
  switch (dialog.type) {
    case "delete-all":
      return { title: "Delete saved data?", body: "This removes your skills, roadmap, and notes from this browser. It cannot be undone.", confirm: "Delete saved data", cancel: "Keep my data", danger: true };
    case "remove-skill":
      return { title: `Remove ${dialog.name}?`, body: "It leaves your skill list. A roadmap action that mentioned it stays until you remove that action.", confirm: "Remove skill", cancel: "Keep skill", danger: true };
    case "remove-action":
      return { title: "Remove this action?", body: `“${dialog.title}” leaves the roadmap. You can add it again later.`, confirm: "Remove action", cancel: "Keep action", danger: true };
    case "load-sample":
      return { title: "Replace your profile with Maya's sample?", body: "Your skills and actions on this browser will be replaced. Maya is fictional.", confirm: "Use the sample", cancel: "Keep my profile", danger: true };
    case "start-fresh":
      return { title: "Start your own profile?", body: "This deletes the profile saved on this browser. It cannot be undone.", confirm: "Delete and start over", cancel: "Keep this profile", danger: true };
    case "reset-sample":
      return { title: "Reset Maya's sample?", body: "Edits you made to the sample skills, role, and actions will be replaced with the original sample.", confirm: "Reset sample", cancel: "Keep my edits", danger: true };
    case "change-goal":
      return { title: `Change your goal to ${dialog.to}?`, body: `Your skills stay. Actions for ${dialog.from} stay saved and show again if you switch back.`, confirm: "Change goal", cancel: "Keep the current goal", danger: false };
    case "discard-paste":
      return { title: "Delete the pasted text?", body: "The paste is only in this tab. Confirmed skills are not affected.", confirm: "Delete pasted text", cancel: "Keep the paste", danger: true };
  }
}

export function renderApp(view: View): HTMLElement {
  const shell = h("div", { class: "shell" });
  const header = h("header", { class: "site-header" }, [
    h("a", { class: "brand", href: "#/welcome" }, [h("span", { class: "brand-mark", "aria-hidden": "true" }), h("span", { text: PRODUCT })]),
  ]);
  if (!view.loadProblem && view.route.name !== "not-found") {
    const current = navId(view.route);
    const nav = h("nav", { class: "nav", "aria-label": "Primary" }, NAV.map((item) => {
      const anchor = h("a", { href: item.href, text: item.label });
      if (item.id === current) anchor.setAttribute("aria-current", "page");
      return anchor;
    }));
    header.append(nav);
  }
  header.append(h("div", { class: "header-tools" }, [
    view.state.displayName ? h("p", { class: "who", text: view.state.displayName }) : null,
    view.loadProblem ? null : h("a", { href: "#/settings", text: "Settings" }),
  ]));
  shell.append(header);
  const main = h("main", { id: "main", class: "wrap" });
  if (view.toast) {
    main.append(h("div", { class: "toast", role: "status" }, [
      h("p", { text: view.toast.message }),
      view.toast.undoId ? btn("Undo", { "data-action": "undo-toast" }, "primary") : null,
    ]));
  }
  if (!view.online) {
    main.append(h("p", { class: "banner offline", role: "status", text: "You are offline. Saved data on this browser still works. Resource links may not open." }));
  }
  if (view.state.usingSample && !view.loadProblem && view.route.name !== "welcome") {
    main.append(h("p", { class: "banner sample", text: "Sample profile. This started from fictional data for Maya Chen and stays in this browser until you delete it." }));
  }
  main.append(pageBody(view));
  shell.append(main);
  shell.append(h("footer", { class: "site-footer" }, [
    h("p", { text: "Guidance, not a hiring prediction. Sample role profiles are illustrative and were written for this prototype on 22 Oct 2026." }),
  ]));
  if (view.dialog) shell.append(dialogNode(view.dialog));
  return shell;
}
