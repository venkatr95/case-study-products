import {
  ACTION_STATUS,
  CONFIDENCE,
  IMPORTANCE,
  LIMITATION,
  NOT_A_SCORE,
  PASTE_WARNING,
  PROFICIENCY,
  RESOURCE_NOTE,
  STATUS,
} from "../copy";
import type { ActionStatus, Confidence, Importance, MatchStatus, Proficiency, Resource } from "../types";
import { h, type Attrs, type Child } from "./dom";

export function btn(label: string, attrs: Attrs = {}, variant: "primary" | "ghost" | "danger" = "ghost"): HTMLButtonElement {
  return h("button", { type: "button", class: `btn btn-${variant}`, ...attrs, text: label });
}

export function link(hash: string, label: string, variant?: "primary" | "ghost"): HTMLAnchorElement {
  return h("a", { href: hash, class: variant ? `btn btn-${variant}` : undefined, text: label });
}

export function limitation(): HTMLElement {
  return h("aside", { class: "banner banner-limit" }, [
    h("h2", { class: "banner-title", text: "Guidance, not a hiring prediction" }),
    h("p", { text: LIMITATION }),
    h("p", { text: NOT_A_SCORE }),
  ]);
}

export function statusChip(status: MatchStatus): HTMLElement {
  return h("p", { class: `chip chip-${status}` }, [
    h("span", { class: `mark mark-${status}`, "aria-hidden": "true" }),
    STATUS[status].label,
  ]);
}

export function importanceChip(importance: Importance): HTMLElement {
  return h("p", { class: "meta", text: `${IMPORTANCE[importance].label}. ${IMPORTANCE[importance].hint}` });
}

export function choiceGroup(
  name: string,
  legend: string,
  options: Record<string, { label: string; hint: string }>,
  selected: string,
): HTMLElement {
  const set = h("fieldset", { class: "choices" }, [h("legend", { text: legend })]);
  for (const [value, option] of Object.entries(options)) {
    const id = `${name}-${value}`;
    const input = h("input", { type: "radio", name, id, value, required: true });
    if (value === selected) input.checked = true;
    const label = h("label", { class: "choice", for: id }, [
      input,
      h("span", {}, [h("span", { class: "choice-label", text: option.label }), h("span", { class: "hint", text: option.hint })]),
    ]);
    set.append(label);
  }
  return set;
}

export function proficiencyGroup(selected: Proficiency | ""): HTMLElement {
  return choiceGroup("proficiency", "What you can do", PROFICIENCY, selected);
}

export function confidenceGroup(selected: Confidence | ""): HTMLElement {
  return choiceGroup("confidence", "How sure you are", CONFIDENCE, selected);
}

export function textField(id: string, name: string, label: string, value: string, hint?: string): HTMLElement {
  const input = h("input", { id, name, type: "text", value, autocomplete: "off" });
  return h("div", { class: "field" }, [h("label", { for: id, text: label }), hint ? h("p", { class: "hint", id: `${id}-hint`, text: hint }) : null, input]);
}

export function areaField(id: string, name: string, label: string, value: string, hint?: string): HTMLElement {
  const area = h("textarea", { id, name, rows: "5" });
  area.value = value;
  if (hint) area.setAttribute("aria-describedby", `${id}-hint`);
  return h("div", { class: "field" }, [h("label", { for: id, text: label }), hint ? h("p", { class: "hint", id: `${id}-hint`, text: hint }) : null, area]);
}

export function formError(message: string | null): Child {
  if (!message) return null;
  return h("p", { class: "error", role: "alert", text: message });
}

export function resources(items: Resource[]): HTMLElement {
  if (items.length === 0) {
    return h("p", { text: "No example resource is attached. You can still do the first step." });
  }
  return h("ul", { class: "resources" }, items.map((item) => h("li", {}, [
    h("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", text: `${item.provider}: ${item.topic}` }),
    h("span", { class: "hint", text: ` ${RESOURCE_NOTE} Opens the provider site.` }),
  ])));
}

export function empty(title: string, body: string, children: Child[] = []): HTMLElement {
  return h("section", { class: "empty card" }, [h("h2", { text: title }), h("p", { text: body }), ...children]);
}

export function meter(done: number, total: number): HTMLElement {
  const width = total === 0 ? 0 : Math.round((done / total) * 100);
  const bar = h("span", { class: "meter-bar" });
  bar.style.width = `${width}%`;
  return h("div", {
    class: "meter",
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": String(total),
    "aria-valuenow": String(done),
    "aria-label": "Actions you marked done",
  }, [bar]);
}

export function statusButtons(actionId: string, current: ActionStatus): HTMLElement {
  const group = h("div", { class: "segmented", role: "group", "aria-label": "Action status" });
  for (const status of ["not-started", "doing", "done"] as ActionStatus[]) {
    group.append(btn(ACTION_STATUS[status], {
      "data-action": "set-status",
      "data-id": actionId,
      "data-status": status,
      "aria-pressed": status === current ? "true" : "false",
      class: status === current ? "btn btn-primary" : "btn btn-ghost",
    }));
  }
  return group;
}

export function pasteWarning(): HTMLElement {
  return h("p", { class: "hint", text: PASTE_WARNING });
}

export { PROFICIENCY, CONFIDENCE, STATUS, IMPORTANCE, ACTION_STATUS };
