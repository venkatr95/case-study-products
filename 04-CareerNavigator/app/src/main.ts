import { SAMPLE_RESUME } from "./data/sample";
import { SKILLS } from "./data/skills";
import { ACTION_STATUS } from "./copy";
import { extractSkills } from "./lib/extract";
import { suggestActions } from "./lib/roadmap";
import { comparisonFor, findRole } from "./lib/role-resolve";
import { parseHash } from "./lib/routes";
import { clearState, loadState, saveState } from "./lib/store";
import {
  acknowledge,
  addActionForSkill,
  addGeneratedActions,
  addRequirement,
  applySample,
  confirmSuggestions,
  createCustomAction,
  createCustomRole,
  hasUserWork,
  hideRequirement,
  removeAction,
  removeSkill,
  restoreRequirement,
  saveActionFields,
  saveSkill,
  setActionStatus,
  setDisplayName,
  setGoal,
  setReflection,
  touchOpened,
  type ActionInput,
} from "./lib/transitions";
import type { ActionStatus, Confidence, Importance, KeyValueStorage, Proficiency } from "./types";
import type { DialogModel, ToastModel, View } from "./ui/model";
import { renderApp } from "./ui/render";
import "./styles.css";

export type StartOptions = {
  document: Document;
  root: HTMLElement;
  live: HTMLElement;
  storage: KeyValueStorage;
  getHash: () => string;
  setHash: (hash: string) => void;
};

const PROFICIENCY = new Set<Proficiency>(["exploring", "practicing", "comfortable", "strong"]);
const CONFIDENCE = new Set<Confidence>(["low", "medium", "high"]);

let controller: AbortController | null = null;

export function start(options: StartOptions): void {
  controller?.abort();
  controller = new AbortController();
  const { document, root, live, storage, getHash, setHash } = options;
  const signal = controller.signal;
  const loaded = loadState(storage);
  let state = loaded.state;
  let problem = loaded.problem;
  let online = typeof navigator === "undefined" ? true : navigator.onLine;
  let toast: ToastModel | null = null;
  let dialog: DialogModel | null = null;
  let filter: View["filter"] = "all";
  let formError: string | null = null;
  let importText = "";
  let importResult: View["importResult"] = null;
  let held: Record<string, string> | null = null;
  let toastTimer = 0;

  if (!problem) {
    state = touchOpened(state, now());
    const saveError = saveState(storage, state);
    if (saveError) toast = { message: saveError };
  }

  function persist(next: typeof state): void {
    state = next;
    if (problem) return;
    const saveError = saveState(storage, state);
    if (saveError) toast = { message: saveError };
  }

  let toastHash = "";

  function showToast(next: ToastModel): void {
    toast = next;
    toastHash = getHash();
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast = null;
      toastHash = "";
      root.querySelector(".toast")?.remove();
    }, 8000);
  }

  function go(hash: string): void {
    const next = hash.startsWith("#") ? hash : `#${hash}`;
    formError = null;
    held = null;
    dialog = null;
    setHash(next);
    render();
  }

  function capture(form: HTMLFormElement): Record<string, string> {
    const record: Record<string, string> = {};
    for (const [key, value] of new FormData(form).entries()) {
      if (typeof value === "string") record[key] = value;
    }
    return record;
  }

  function fail(form: HTMLFormElement, message: string): void {
    held = capture(form);
    formError = message;
    render();
  }

  function view(): View {
    const route = parseHash(getHash() || "#/welcome");
    const roleId = route.name === "preview" ? route.id : state.goalId;
    const resolved = comparisonFor(state, roleId);
    const sameGoal = Boolean(resolved && state.goalId && resolved.role.id === state.goalId);
    return {
      route,
      state,
      online,
      loadProblem: problem,
      toast,
      dialog,
      filter,
      formError,
      importText,
      importResult,
      role: resolved?.role ?? null,
      comparison: resolved?.comparison ?? null,
      suggestions: sameGoal && resolved ? suggestActions(resolved.comparison, state.actions, resolved.role.id, 3) : [],
      roleActions: state.actions.filter((action) => action.roleId === state.goalId),
    };
  }

  function applyHeld(): void {
    if (!held) return;
    for (const [key, value] of Object.entries(held)) {
      const fields = root.querySelectorAll(`[name="${CSS.escape(key)}"]`);
      for (const field of fields) {
        if (field instanceof HTMLInputElement && (field.type === "radio" || field.type === "checkbox")) {
          field.checked = field.value === value || (field.type === "checkbox" && value === "on");
        } else if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.value = value;
        }
      }
    }
    held = null;
    const choice = root.querySelector("#skillChoice");
    const box = root.querySelector("#custom-skill");
    if (choice instanceof HTMLSelectElement && box instanceof HTMLElement) box.hidden = choice.value !== "custom";
  }

  function render(): void {
    const route = parseHash(getHash() || "#/welcome");
    const hash = getHash() || "#/welcome";
    if (toast && toastHash && toastHash !== hash) {
      toast = null;
      toastHash = "";
      window.clearTimeout(toastTimer);
    }
    if (!problem && !state.acknowledgedLimits && route.name !== "welcome") {
      state = acknowledge(state);
      const saveError = saveState(storage, state);
      if (saveError) toast = { message: saveError };
    }
    root.replaceChildren(renderApp(view()));
    applyHeld();
    const heading = root.querySelector("h1");
    document.title = heading?.textContent ? `${heading.textContent} · SkillBridge` : "SkillBridge";
    const initial = root.querySelector("[data-dialog-initial]");
    if (initial instanceof HTMLElement) initial.focus();
    if (toast) live.textContent = toast.message;
    else if (formError) live.textContent = formError;
  }

  function chooseGoal(id: string): void {
    const role = findRole(state, id);
    if (!role) return;
    if (state.goalId && state.goalId !== id && state.actions.some((action) => action.roleId === state.goalId)) {
      dialog = { type: "change-goal", id, from: findRole(state, state.goalId)?.name ?? "your current role", to: role.name };
      render();
      return;
    }
    const result = setGoal(state, id);
    if (!result.ok) {
      formError = result.error;
      render();
      return;
    }
    persist(result.state);
    go("#/role");
  }

  function readAction(form: HTMLFormElement): ActionInput {
    const data = new FormData(form);
    const hasKeep = form.querySelector("[name=keepResources]") instanceof HTMLInputElement;
    return {
      title: String(data.get("title") ?? ""),
      outcome: String(data.get("outcome") ?? ""),
      firstStep: String(data.get("firstStep") ?? ""),
      evidenceToCollect: String(data.get("evidence") ?? ""),
      note: String(data.get("note") ?? ""),
      keepResources: hasKeep ? data.get("keepResources") !== null : true,
    };
  }

  function onClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element) || !root.contains(target)) return;
    const anchor = target.closest("a[href^='#/']");
    if (anchor instanceof HTMLAnchorElement) {
      event.preventDefault();
      go(anchor.getAttribute("href") ?? "#/welcome");
      return;
    }
    const control = target.closest("[data-action]");
    if (!(control instanceof HTMLElement)) return;
    const action = control.dataset.action;
    if (action === "go" && control.dataset.href) go(control.dataset.href);
    else if (action === "continue" && control.dataset.href) go(control.dataset.href);
    else if (action === "use-sample") {
      if (hasUserWork(state)) {
        dialog = { type: "load-sample" };
        render();
      } else {
        persist(applySample(now()));
        go("#/compare");
      }
    } else if (action === "start-own") {
      if (state.usingSample || hasUserWork(state)) {
        dialog = { type: "start-fresh" };
        render();
      } else go("#/goals");
    } else if (action === "choose-goal" && control.dataset.id) chooseGoal(control.dataset.id);
    else if (action === "close-dialog") {
      dialog = null;
      render();
    } else if (action === "confirm-dialog") confirmDialog();
    else if (action === "clear-unreadable") {
      clearState(storage);
      problem = null;
      state = acknowledge({ ...loadState(storage).state });
      persist(state);
      go("#/welcome");
    } else if (action === "hide-requirement" && control.dataset.skill && state.goalId) {
      persist(hideRequirement(state, state.goalId, control.dataset.skill));
      if (parseHash(getHash()).name === "gap") go("#/compare");
      else render();
    } else if (action === "restore-requirement" && control.dataset.skill && state.goalId) {
      persist(restoreRequirement(state, state.goalId, control.dataset.skill));
      render();
    } else if (action === "ask-remove-skill" && control.dataset.id) {
      dialog = { type: "remove-skill", id: control.dataset.id, name: control.dataset.name ?? "this skill" };
      render();
    } else if (action === "ask-remove-action" && control.dataset.id) {
      dialog = { type: "remove-action", id: control.dataset.id, title: control.dataset.title ?? "this action" };
      render();
    } else if (action === "ask-delete") {
      dialog = { type: "delete-all" };
      render();
    } else if (action === "ask-reset-sample") {
      dialog = { type: "reset-sample" };
      render();
    } else if (action === "discard-paste") {
      if (importText.trim()) {
        dialog = { type: "discard-paste" };
        render();
      } else {
        importResult = null;
        go("#/import");
      }
    } else if (action === "fill-practice") {
      importText = SAMPLE_RESUME;
      formError = null;
      render();
      const area = root.querySelector("#resume");
      if (area instanceof HTMLTextAreaElement) area.focus();
    } else if (action === "set-filter" && control.dataset.filter && isFilter(control.dataset.filter)) {
      filter = control.dataset.filter;
      render();
      const pressed = root.querySelector(`[data-filter="${CSS.escape(filter)}"]`);
      if (pressed instanceof HTMLElement) pressed.focus();
    } else if (action === "open-plan") go("#/roadmap");
    else if (action === "build-roadmap" && state.goalId) {
      const before = state.actions.length;
      persist(addGeneratedActions(state, state.goalId, [id("act"), id("act"), id("act")], now()));
      showToast({ message: state.actions.length === before ? "No open gaps to add. You can write your own action." : "Saved the actions. You can edit every one." });
      render();
    } else if (action === "add-gap" && control.dataset.skill && state.goalId) addGap(control.dataset.skill);
    else if (action === "add-next-gap" && state.goalId) {
      const resolved = comparisonFor(state, state.goalId);
      const nextGap = resolved ? suggestActions(resolved.comparison, state.actions, state.goalId, 1)[0] : undefined;
      if (nextGap) addGap(nextGap.skillId);
    } else if (action === "set-status" && control.dataset.id && isStatus(control.dataset.status)) {
      setStatus(control.dataset.id, control.dataset.status);
    } else if (action === "undo-toast" && toast?.undoId && toast.undoStatus) {
      persist(setActionStatus(state, toast.undoId, toast.undoStatus, now()));
      toast = null;
      render();
    } else if (action === "copy-backup") void copyBackup();
  }

  function addGap(skillId: string): void {
    if (!state.goalId) return;
    const actionId = id("act");
    const result = addActionForSkill(state, state.goalId, skillId, actionId, now());
    if (!result.ok) {
      formError = result.error;
      render();
      return;
    }
    persist(result.state);
    go(`#/roadmap/${actionId}`);
  }

  function setStatus(actionId: string, status: ActionStatus): void {
    const form = root.querySelector("#action-form");
    if (form instanceof HTMLFormElement) {
      const saved = saveActionFields(state, actionId, readAction(form), now());
      if (!saved.ok) {
        fail(form, saved.error);
        return;
      }
      state = saved.state;
    }
    const previous = state.actions.find((action) => action.id === actionId)?.status;
    if (!previous || previous === status) {
      persist(state);
      render();
      return;
    }
    persist(setActionStatus(state, actionId, status, now()));
    showToast({ message: `Marked ${ACTION_STATUS[status]}.`, undoId: actionId, undoStatus: previous });
    render();
  }

  function confirmDialog(): void {
    const current = dialog;
    dialog = null;
    if (!current) return;
    if (current.type === "delete-all" || current.type === "start-fresh") {
      clearState(storage);
      importText = "";
      importResult = null;
      state = current.type === "start-fresh" ? acknowledge(loadState(storage).state) : loadState(storage).state;
      persist(state);
      go(current.type === "start-fresh" ? "#/goals" : "#/welcome");
      return;
    }
    if (current.type === "load-sample" || current.type === "reset-sample") {
      persist(applySample(now()));
      go("#/compare");
      return;
    }
    if (current.type === "change-goal") {
      const result = setGoal(state, current.id);
      if (!result.ok) {
        formError = result.error;
        render();
        return;
      }
      persist(result.state);
      go("#/role");
      return;
    }
    if (current.type === "remove-skill") {
      persist(removeSkill(state, current.id));
      go("#/skills");
      return;
    }
    if (current.type === "remove-action") {
      persist(removeAction(state, current.id));
      go("#/roadmap");
      return;
    }
    if (current.type === "discard-paste") {
      importText = "";
      importResult = null;
      go("#/import");
      return;
    }
    render();
  }

  function onSubmit(event: Event): void {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !root.contains(form)) return;
    event.preventDefault();
    const data = new FormData(form);
    if (form.id === "create-role") {
      const result = createCustomRole(state, String(data.get("name") ?? ""), String(data.get("summary") ?? ""), id("role"), now());
      if (!result.ok) return fail(form, result.error);
      persist(result.state);
      go("#/role/edit");
      return;
    }
    if (form.id === "add-requirement" && state.goalId) {
      const result = addRequirement(
        state,
        state.goalId,
        String(data.get("skillId") ?? ""),
        String(data.get("importance") ?? "supporting") as Importance,
        String(data.get("why") ?? ""),
      );
      if (!result.ok) return fail(form, result.error);
      persist(result.state);
      formError = null;
      render();
      return;
    }
    if (form.id === "skill-form") {
      const choice = String(data.get("skillChoice") ?? "");
      if (!choice) return fail(form, "Choose a skill.");
      const proficiency = String(data.get("proficiency") ?? "");
      const confidence = String(data.get("confidence") ?? "");
      const result = saveSkill(
        state,
        {
          existingId: String(data.get("existingId") ?? "") || null,
          skillId: choice && choice !== "custom" ? choice : null,
          customName: String(data.get("customName") ?? ""),
          customDefinition: String(data.get("customDefinition") ?? ""),
          proficiency: PROFICIENCY.has(proficiency as Proficiency) ? (proficiency as Proficiency) : "",
          confidence: CONFIDENCE.has(confidence as Confidence) ? (confidence as Confidence) : "",
          evidence: String(data.get("evidence") ?? ""),
        },
        { user: id("user"), extra: id("extra") },
        now(),
      );
      if (!result.ok) return fail(form, result.error);
      persist(result.state);
      showToast({ message: "Saved the skill." });
      go("#/skills");
      return;
    }
    if (form.id === "import-form") {
      importText = String(data.get("resume") ?? "");
      const result = extractSkills(importText, [...SKILLS, ...state.extras]);
      if (!result.ok) return fail(form, result.error);
      importResult = result;
      formError = null;
      go("#/import/review");
      return;
    }
    if (form.id === "import-review" && importResult?.ok) {
      const picks = [...form.querySelectorAll("input[name=pick]:checked")].flatMap((node) => {
        if (!(node instanceof HTMLInputElement)) return [];
        const proficiency = String(data.get(`proficiency-${node.value}`) ?? "practicing");
        const confidence = String(data.get(`confidence-${node.value}`) ?? "low");
        if (!PROFICIENCY.has(proficiency as Proficiency) || !CONFIDENCE.has(confidence as Confidence)) return [];
        return [{ skillId: node.value, proficiency: proficiency as Proficiency, confidence: confidence as Confidence }];
      });
      const result = confirmSuggestions(state, picks, (skillId) => id(`user-${skillId}`), now());
      if (!result.ok) return fail(form, result.error);
      const count = picks.length;
      importText = "";
      importResult = null;
      persist(result.state);
      showToast({ message: `Saved ${count} ${count === 1 ? "skill" : "skills"} you confirmed. The pasted text was discarded.` });
      go("#/skills");
      return;
    }
    if (form.id === "action-form") {
      const route = parseHash(getHash());
      const input = readAction(form);
      if (route.name === "action" && route.id) {
        const result = saveActionFields(state, route.id, input, now());
        if (!result.ok) return fail(form, result.error);
        persist(result.state);
        showToast({ message: "Saved the action." });
        render();
        return;
      }
      if (!state.goalId) return fail(form, "Choose a role before adding an action.");
      const actionId = id("act");
      const result = createCustomAction(state, state.goalId, input, actionId, now());
      if (!result.ok) return fail(form, result.error);
      persist(result.state);
      showToast({ message: "Saved your action." });
      go(`#/roadmap/${actionId}`);
      return;
    }
    if (form.id === "reflection-form") {
      const result = setReflection(state, String(data.get("reflection") ?? ""));
      if (!result.ok) return fail(form, result.error);
      persist(result.state);
      showToast({ message: "Saved your note." });
      render();
      return;
    }
    if (form.id === "name-form") {
      const result = setDisplayName(state, String(data.get("displayName") ?? ""));
      if (!result.ok) return fail(form, result.error);
      persist(result.state);
      showToast({ message: "Saved the name." });
      render();
    }
  }

  function onChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof Element) || !root.contains(target)) return;
    if (target instanceof HTMLSelectElement && target.id === "skillChoice") {
      const box = root.querySelector("#custom-skill");
      if (box instanceof HTMLElement) box.hidden = target.value !== "custom";
    }
    const form = target.closest("#import-review");
    if (form instanceof HTMLFormElement) {
      const button = form.querySelector("[data-confirm-import]");
      const any = form.querySelector("input[name=pick]:checked");
      if (button instanceof HTMLButtonElement) button.disabled = !any;
    }
  }

  function onKey(event: KeyboardEvent): void {
    if (event.key === "Escape" && dialog) {
      dialog = null;
      render();
      return;
    }
    if (event.key !== "Tab" || !dialog) return;
    const node = root.querySelector(".dialog");
    if (!(node instanceof HTMLElement)) return;
    const items = [...node.querySelectorAll<HTMLElement>("button, a, input, textarea, select")].filter((item) => !item.hasAttribute("disabled"));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function copyBackup(): Promise<void> {
    const json = JSON.stringify(state, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      showToast({ message: "Copied saved data. Pasted resume text is not included." });
      render();
    } catch {
      dialog = { type: "backup", json };
      render();
    }
  }

  document.addEventListener("click", onClick, { signal });
  document.addEventListener("submit", onSubmit, { signal });
  document.addEventListener("change", onChange, { signal });
  document.addEventListener("keydown", onKey, { signal });
  window.addEventListener("online", () => {
    online = true;
    render();
  }, { signal });
  window.addEventListener("offline", () => {
    online = false;
    render();
  }, { signal });
  window.addEventListener("hashchange", () => render(), { signal });
  render();
}

function isFilter(value: string): value is View["filter"] {
  return ["all", "core", "supporting", "matched", "partial", "missing", "extra"].includes(value);
}

function isStatus(value: string | undefined): value is ActionStatus {
  return value === "not-started" || value === "doing" || value === "done";
}

function now(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

const bootRoot = document.getElementById("app");
const bootLive = document.getElementById("live");
if (bootRoot instanceof HTMLElement && bootLive instanceof HTMLElement) {
  start({
    document,
    root: bootRoot,
    live: bootLive,
    storage: window.localStorage,
    getHash: () => window.location.hash,
    setHash: (hash) => {
      if (window.location.hash !== hash) window.location.hash = hash;
    },
  });
}
