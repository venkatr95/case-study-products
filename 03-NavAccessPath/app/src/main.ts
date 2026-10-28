import { applyPreset, withMatchedPreset } from "./evaluate.js";
import { present } from "./render.js";
import { placeLabelFor, routingPlaceId } from "./sample.js";
import {
  addRecent,
  browserStorage,
  clearDemoData,
  clearPreferences,
  createState,
  loadPreferences,
  loadRecent,
  loadReports,
  loadTextScale,
  removeRecent,
  savePreferences,
  saveTextScale,
  submitReport,
  validateReport,
  withdrawReport,
} from "./store.js";
import type { Preferences, ReportCategory, TextScale, ViewId } from "./types.js";

const storage = browserStorage();
const savedPreferences = loadPreferences(storage);
const state = createState({
  preferences: savedPreferences,
  preferencesSaved: savedPreferences !== null,
  textScale: loadTextScale(storage),
});

const appNode = document.querySelector("#app");
const liveNode = document.querySelector("#live");
if (!(appNode instanceof HTMLElement) || !(liveNode instanceof HTMLElement)) {
  throw new Error("AccessPath shell is missing.");
}
const app: HTMLElement = appNode;
const live: HTMLElement = liveNode;

let loadTimer = 0;

function snapshot() {
  return { reports: loadReports(storage), recent: loadRecent(storage) };
}

function commit(focusHeading: boolean): void {
  const activeId = document.activeElement instanceof HTMLElement ? document.activeElement.id : "";
  const view = present(state, snapshot());
  app.innerHTML = view.html;
  document.title = `${view.title} — AccessPath`;
  document.documentElement.dataset.textScale = state.textScale;
  if (state.dialog !== "none") {
    const button = document.querySelector(".dialog .button");
    if (button instanceof HTMLElement) button.focus();
    live.textContent = view.title;
    return;
  }
  const heading = document.querySelector("#main h1");
  if (focusHeading && heading instanceof HTMLElement) {
    heading.focus();
    live.textContent = view.title;
    return;
  }
  if (activeId) document.getElementById(activeId)?.focus();
}

function go(view: ViewId): void {
  state.notice = "";
  state.dialog = "none";
  if (view === "home") {
    state.history = [];
    state.view = "home";
  } else if (state.view !== view) {
    state.history.push(state.view);
    state.view = view;
  }
  commit(true);
}

function back(): void {
  state.dialog = "none";
  state.view = state.history.pop() ?? "home";
  commit(true);
}

function activePreferences(): Preferences {
  return state.preferences ?? applyPreset("custom");
}

function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runCompare(): void {
  if (state.offline || state.serviceError) {
    state.loading = false;
    go("results");
    return;
  }
  state.loading = true;
  state.selectedRouteId = "";
  go("results");
  window.clearTimeout(loadTimer);
  loadTimer = window.setTimeout(() => {
    state.loading = false;
    commit(true);
  }, reducedMotion() ? 0 : 500);
}

function remember(saved: boolean): void {
  const prefs = withMatchedPreset(activePreferences());
  state.preferences = prefs;
  state.preferencesSaved = saved;
  if (saved) savePreferences(storage, prefs);
  const previous = state.history.at(-1);
  state.notice = saved
    ? "Preferences saved on this device. Later comparisons in this browser can use them."
    : "These preferences apply to this trip only and are not saved on this device.";
  if (previous === "results" || previous === "trip") {
    state.view = state.history.pop() ?? previous;
    commit(true);
    return;
  }
  commit(true);
}

function requireTrip(): boolean {
  if (!state.preferences) {
    state.tripError = "Set access preferences before comparing routes.";
    commit(true);
    return false;
  }
  if (!state.originId || !state.destinationId) {
    state.tripError = "Choose an origin and a destination.";
    commit(true);
    return false;
  }
  if (routingPlaceId(state.originId) === state.destinationId) {
    state.tripError = "Choose two different places.";
    commit(true);
    return false;
  }
  state.tripError = "";
  return true;
}

function fillTrip(originId: string, destinationId: string, prefs?: Preferences): void {
  if (prefs) {
    state.preferences = prefs;
    state.preferencesSaved = false;
  }
  state.originId = originId;
  state.destinationId = destinationId;
  state.serviceError = false;
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const control = target.closest("[data-action]");
  if (!(control instanceof HTMLElement)) return;
  const action = control.dataset.action ?? "";
  const view = control.dataset.view as ViewId | undefined;
  const id = control.dataset.id ?? "";

  if (action === "back") back();
  else if (action === "nav" && view) go(view);
  else if (action === "text-scale") {
    const next: Record<TextScale, TextScale> = { "100": "125", "125": "150", "150": "100" };
    state.textScale = next[state.textScale];
    saveTextScale(storage, state.textScale);
    state.notice = `Text size is ${state.textScale} percent.`;
    commit(false);
    live.textContent = state.notice;
  } else if (action === "save-prefs") remember(true);
  else if (action === "use-prefs") remember(false);
  else if (action === "location-open") {
    state.dialog = "location";
    commit(false);
  } else if (action === "location-allow") {
    state.originId = "sample-location";
    state.locationNote = "Sample start filled near Cal Anderson Park. This prototype did not read your device location.";
    state.dialog = "none";
    commit(true);
  } else if (action === "location-deny") {
    state.locationNote = "Location stays off. Type a start place.";
    state.dialog = "none";
    commit(true);
  } else if (action === "dialog-dismiss") {
    state.dialog = "none";
    commit(true);
  } else if (action === "swap") {
    const origin = state.originId === "sample-location" ? "cal-anderson" : state.originId;
    state.originId = state.destinationId;
    state.destinationId = origin;
    commit(false);
  } else if (action === "compare") {
    if (requireTrip()) runCompare();
  } else if (action === "retry") {
    state.serviceError = false;
    if (requireTrip()) runCompare();
  } else if (action === "presentation") {
    state.presentation = control.dataset.presentation === "map" ? "map" : "list";
    commit(false);
  } else if (action === "highlight") {
    state.selectedRouteId = id;
    commit(false);
  } else if (action === "open-route") {
    state.selectedRouteId = id;
    state.selectedSegmentId = "";
    go("detail");
  } else if (action === "open-entrance") {
    state.selectedEntranceId = id;
    go("place");
  } else if (action === "segment") {
    state.selectedSegmentId = state.selectedSegmentId === id ? "" : id;
    commit(false);
  } else if (action === "choose-route") {
    const routeName = document.querySelector("#main h1")?.textContent ?? "Route";
    state.chosenRouteId = id;
    addRecent(storage, {
      id: `recent-${id}`,
      originLabel: placeLabelFor(state.originId),
      destinationLabel: placeLabelFor(state.destinationId),
      routeName,
      fitLabel: document.querySelector(".status span")?.textContent ?? "",
      chosenAt: new Date().toISOString(),
    });
    state.notice = "Route saved to recent trips on this device.";
    commit(true);
  } else if (action === "undo-choice") {
    removeRecent(storage, `recent-${state.chosenRouteId}`);
    state.chosenRouteId = "";
    state.notice = "Removed from recent trips.";
    commit(true);
  } else if (action === "open-report") {
    state.report = {
      category: "",
      subject: control.dataset.subject ?? "",
      description: "",
      errors: [],
    };
    state.returnView = state.view;
    go("report");
  } else if (action === "submit-report") {
    if (state.offline) {
      state.report.errors = ["You're offline. This report was not submitted."];
      commit(true);
      return;
    }
    const errors = validateReport(state.report);
    if (errors.length > 0 || !state.report.category) {
      state.report.errors = errors.length > 0 ? errors : ["Choose a report category."];
      commit(true);
      return;
    }
    const report = submitReport(storage, {
      id: `report-${Date.now()}`,
      category: state.report.category,
      subject: state.report.subject,
      description: state.report.description,
      submittedAt: new Date().toISOString(),
    });
    state.lastReportId = report.id;
    state.notice = "";
    go("report-status");
  } else if (action === "withdraw-open") {
    state.dialog = "withdraw";
    commit(false);
  } else if (action === "withdraw-confirm") {
    withdrawReport(storage, state.lastReportId);
    state.dialog = "none";
    state.notice = "Report withdrawn. It was not verified.";
    commit(true);
  } else if (action === "delete-open") {
    state.dialog = "delete-prefs";
    commit(false);
  } else if (action === "delete-confirm") {
    clearPreferences(storage);
    state.preferences = null;
    state.preferencesSaved = false;
    state.dialog = "none";
    if (state.view !== "saved") {
      state.history.push(state.view);
      state.view = "saved";
    }
    state.notice = "Saved preferences deleted from this browser.";
    commit(true);
  } else if (action === "open-status") {
    state.lastReportId = id;
    go("report-status");
  } else if (action === "proto-sample-trip") {
    fillTrip("cal-anderson", "pike-first");
    go("trip");
  } else if (action === "proto-sample-results") {
    fillTrip("cal-anderson", "pike-first", state.preferences ?? applyPreset("step-free"));
    runCompare();
  } else if (action === "proto-no-match") {
    fillTrip("cal-anderson", "volunteer", applyPreset("step-free"));
    runCompare();
  } else if (action === "proto-outside") {
    fillTrip("cal-anderson", "bainbridge", state.preferences ?? applyPreset("step-free"));
    runCompare();
  } else if (action === "proto-no-data") {
    fillTrip("library", "volunteer", state.preferences ?? applyPreset("step-free"));
    runCompare();
  } else if (action === "proto-error") {
    fillTrip("cal-anderson", "pike-first", state.preferences ?? applyPreset("step-free"));
    state.serviceError = true;
    runCompare();
  } else if (action === "proto-offline") {
    state.offline = !state.offline;
    state.notice = state.offline ? "Offline simulation is on." : "Offline simulation is off.";
    commit(false);
  } else if (action === "proto-clear-flags") {
    state.offline = false;
    state.serviceError = false;
    state.notice = "Offline and routing error cleared.";
    commit(true);
  } else if (action === "proto-reset") {
    clearDemoData(storage);
    state.preferences = null;
    state.preferencesSaved = false;
    state.originId = "";
    state.destinationId = "";
    state.chosenRouteId = "";
    state.lastReportId = "";
    state.offline = false;
    state.serviceError = false;
    state.history = [];
    state.view = "home";
    state.notice = "Saved demo data was cleared from this browser.";
    commit(true);
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
    return;
  }
  const field = target.dataset.field ?? "";
  if (field === "origin") state.originId = target.value;
  else if (field === "destination") state.destinationId = target.value;
  else if (field === "sort") state.sort = target.value === "shortest" ? "shortest" : "fit";
  else if (field === "preset" && target instanceof HTMLInputElement) {
    const preset = target.dataset.preset;
    if (preset === "step-free" || preset === "gentle" || preset === "stroller") {
      state.preferences = applyPreset(preset);
      state.preferencesSaved = false;
    } else if (preset === "custom") {
      state.preferences = { ...activePreferences(), preset: "custom" };
      state.preferencesSaved = false;
    }
  } else if (field === "avoid-stairs" && target instanceof HTMLInputElement) {
    state.preferences = withMatchedPreset({ ...activePreferences(), avoidStairs: target.checked });
    state.preferencesSaved = false;
  } else if (field === "curb-ramps" && target instanceof HTMLInputElement) {
    state.preferences = withMatchedPreset({ ...activePreferences(), requireCurbRamps: target.checked });
    state.preferencesSaved = false;
  } else if (field === "grade") {
    const maxGradePercent = target.value === "none" ? null : Number(target.value);
    state.preferences = withMatchedPreset({ ...activePreferences(), maxGradePercent });
    state.preferencesSaved = false;
  } else if (field === "category") {
    state.report.category = target.value as ReportCategory | "";
    return;
  } else if (field === "subject") {
    state.report.subject = target.value;
    return;
  } else if (field === "description" && target instanceof HTMLTextAreaElement) {
    state.report.description = target.value;
    return;
  } else return;
  commit(false);
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLTextAreaElement && target.dataset.field === "description") {
    state.report.description = target.value;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.dialog !== "none") {
    state.dialog = "none";
    commit(true);
    return;
  }
  if (state.dialog !== "none" && event.key === "Tab") {
    const dialog = document.querySelector(".dialog");
    if (!dialog) return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>("button, [href], input, select, textarea")].filter(
      (element) => !element.hasAttribute("disabled"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && document.activeElement instanceof HTMLElement) {
    if (document.activeElement.getAttribute("role") !== "tab") return;
    event.preventDefault();
    state.presentation = event.key === "ArrowRight" ? "map" : "list";
    commit(false);
    document.getElementById(state.presentation === "map" ? "tab-map" : "tab-list")?.focus();
  }
});

const shot = new URLSearchParams(window.location.search).get("shot");
if (shot) document.body.classList.add("is-shot");
if (shot === "preferences") {
  state.preferences = applyPreset("step-free");
  state.view = "preferences";
  state.history = ["home"];
} else if (shot === "trip") {
  state.preferences = applyPreset("step-free");
  state.preferencesSaved = true;
  state.originId = "cal-anderson";
  state.destinationId = "pike-first";
  state.view = "trip";
  state.history = ["home"];
} else if (shot === "results" || shot === "map") {
  state.preferences = applyPreset("step-free");
  state.preferencesSaved = true;
  state.originId = "cal-anderson";
  state.destinationId = "pike-first";
  state.presentation = shot === "map" ? "map" : "list";
  state.view = "results";
  state.history = ["trip"];
} else if (shot === "detail") {
  state.preferences = applyPreset("step-free");
  state.originId = "cal-anderson";
  state.destinationId = "pike-first";
  state.selectedRouteId = "madison";
  state.view = "detail";
  state.history = ["results"];
} else if (shot === "place") {
  state.selectedEntranceId = "pike-south";
  state.view = "place";
  state.history = ["detail"];
} else if (shot === "report") {
  state.view = "report";
  state.selectedRouteId = "pine";
  state.originId = "cal-anderson";
  state.destinationId = "pike-first";
  state.report.subject = "Pine Street link";
  state.history = ["detail"];
} else if (shot === "status") {
  const existing = loadReports(storage).find((item) => item.id === "shot-report");
  if (!existing) {
    submitReport(storage, {
      id: "shot-report",
      category: "stairs",
      subject: "Pine Street link",
      description: "A stairway is in the pedestrian link. Sample report for review.",
      submittedAt: "2026-10-22T09:15:00-07:00",
    });
  }
  state.lastReportId = "shot-report";
  state.view = "report-status";
  state.history = ["report"];
} else if (shot === "saved") {
  state.preferences = applyPreset("step-free");
  state.preferencesSaved = true;
  savePreferences(storage, state.preferences);
  state.view = "saved";
  state.history = ["home"];
} else if (shot === "nomatch") {
  state.preferences = applyPreset("step-free");
  state.originId = "cal-anderson";
  state.destinationId = "volunteer";
  state.view = "results";
  state.history = ["trip"];
} else if (shot === "outside") {
  state.preferences = applyPreset("step-free");
  state.originId = "cal-anderson";
  state.destinationId = "bainbridge";
  state.view = "results";
  state.history = ["trip"];
} else if (shot === "error") {
  state.preferences = applyPreset("step-free");
  state.originId = "cal-anderson";
  state.destinationId = "pike-first";
  state.serviceError = true;
  state.view = "results";
  state.history = ["trip"];
} else if (shot === "offline") {
  state.offline = true;
  state.view = "results";
  state.history = ["trip"];
} else if (shot === "location") {
  state.view = "trip";
  state.dialog = "location";
  state.history = ["home"];
} else if (shot === "loading") {
  state.preferences = applyPreset("step-free");
  state.originId = "cal-anderson";
  state.destinationId = "pike-first";
  state.loading = true;
  state.view = "results";
  state.history = ["trip"];
}

commit(false);
