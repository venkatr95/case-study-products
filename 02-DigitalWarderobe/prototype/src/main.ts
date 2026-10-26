import { perform, updateField } from "./actions";
import { readPhotoFile } from "./photo";
import { parseHash } from "./route";
import { applyRoute, boot, consumeHeadingFocus, getState, subscribe, update } from "./store";
import { renderApp } from "./ui/render";

const appNode = document.querySelector("#app");
const liveNode = document.querySelector("#live");
if (!(appNode instanceof HTMLElement) || !(liveNode instanceof HTMLElement)) {
  throw new Error("Rewear shell is missing.");
}
const app: HTMLElement = appNode;
const live: HTMLElement = liveNode;

function draw(): void {
  const heading = consumeHeadingFocus();
  const active = document.activeElement;
  const snapshot =
    !heading && active instanceof HTMLElement && active.id
      ? {
          id: active.id,
          start: active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement ? active.selectionStart : null,
          end: active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement ? active.selectionEnd : null,
        }
      : null;
  app.innerHTML = renderApp(getState());
  const state = getState();
  document.documentElement.style.fontSize = `${state.prefs.textScale}%`;
  if (state.announcement) live.textContent = state.announcement;
  const title = document.getElementById("screen-title");
  if (heading && title instanceof HTMLElement) {
    title.focus();
    window.scrollTo(0, 0);
    return;
  }
  if (snapshot) {
    const next = document.getElementById(snapshot.id);
    if (next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement) {
      next.focus();
      if (snapshot.start != null && snapshot.end != null) next.setSelectionRange(snapshot.start, snapshot.end);
      return;
    }
    if (next instanceof HTMLElement) {
      next.focus();
      return;
    }
  }
  const dialog = app.querySelector(".dialog");
  const primary = dialog?.querySelector<HTMLElement>("#dialog-primary, #filter-close");
  primary?.focus();
}

subscribe(draw);
boot();
if (typeof navigator !== "undefined" && navigator.onLine === false) {
  update((current) => ({ ...current, offline: true }));
}

window.addEventListener("hashchange", () => {
  const route = parseHash(location.hash);
  if (!route) {
    update((current) => ({
      ...current,
      toast: "That page is not in the prototype.",
      announcement: "That page is not in the prototype.",
    }));
    return;
  }
  applyRoute(route);
});

window.addEventListener("online", () => update((current) => ({ ...current, offline: false, announcement: "Back online." })));
window.addEventListener("offline", () =>
  update((current) => ({
    ...current,
    offline: true,
    announcement: "You're offline. Your wardrobe is saved on this device and still works.",
  })),
);

app.addEventListener("click", (event) => {
  const target = (event.target as Element | null)?.closest("[data-action]");
  if (!(target instanceof HTMLElement)) return;
  if (target instanceof HTMLInputElement) return;
  if (target instanceof HTMLButtonElement && target.type === "submit") return;
  perform(target.dataset.action ?? "", target);
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitter = (event as SubmitEvent).submitter;
  const action = submitter?.getAttribute("data-action");
  if (action && submitter) perform(action, submitter);
});

app.addEventListener("input", onField);
app.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const action = target.getAttribute("data-action");
  if (action) perform(action, target);
  onField(event);
});

function onField(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const field = target.getAttribute("data-field");
  if (field) updateField(field, target);
}

app.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.id !== "photo-input") return;
  const file = target.files?.[0];
  if (!file) return;
  update((current) => ({ ...current, upload: { phase: "reading", progress: 4, message: "" } }));
  const result = await readPhotoFile(file, (progress) => {
    update((current) => ({ ...current, upload: { phase: "reading", progress, message: "" } }));
  });
  if (!result.ok || !result.dataUrl) {
    update((current) => ({
      ...current,
      upload: { phase: "error", progress: 0, message: result.message },
    }));
    return;
  }
  update((current) =>
    current.draft?.mode === "item"
      ? {
          ...current,
          upload: { phase: "idle", progress: 100, message: result.message },
          draft: { ...current.draft, photoDataUrl: result.dataUrl },
        }
      : current,
  );
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const current = getState();
    if (current.dialog) update((state) => ({ ...state, dialog: null }));
    else if (current.filtersOpen) update((state) => ({ ...state, filtersOpen: false }));
  }
  if (event.key !== "Tab") return;
  const dialog = app.querySelector(".dialog");
  if (!dialog) return;
  const focusable = [...dialog.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, summary")].filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
