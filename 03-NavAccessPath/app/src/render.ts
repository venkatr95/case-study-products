import { copy } from "./copy.js";
import {
  assessRoute,
  entranceReportNote,
  evidenceCounts,
  orderRoutes,
  resultsHeadline,
  segmentPattern,
  summaryReasons,
} from "./evaluate.js";
import { evidenceWord, escapeHtml, formatDistance, formatMinutes, formatWhen, preferenceSummary, presetName } from "./format.js";
import {
  SAMPLE_ORIGIN_LABEL,
  entranceById,
  entrances,
  placeById,
  places,
  reportCategories,
  resolveTrip,
  routingPlaceId,
  segmentsFor,
} from "./sample.js";
import type {
  AppState,
  Assessment,
  Entrance,
  Evidence,
  Fit,
  Preferences,
  RecentTrip,
  Route,
  Segment,
  StoredReport,
  TripResolution,
} from "./types.js";

export interface PresentData {
  reports: StoredReport[];
  recent: RecentTrip[];
}

export interface Presentation {
  title: string;
  html: string;
}

function esc(value: string): string {
  return escapeHtml(value);
}

function placeLabel(id: string): string {
  if (id === "sample-location") return SAMPLE_ORIGIN_LABEL;
  const place = placeById(id);
  if (!place) return "";
  return `${place.name}, ${place.detail}`;
}

function prefsOf(state: AppState): Preferences | null {
  return state.preferences;
}

function resolutionFor(state: AppState): TripResolution | null {
  if (!state.originId || !state.destinationId) return null;
  return resolveTrip(routingPlaceId(state.originId), state.destinationId);
}

function chip(evidence: Evidence): string {
  const kind = evidence === "confirmed" ? "confirmed" : evidence === "community" ? "community" : "unknown";
  return `<span class="chip chip-${kind}"><span class="shape" aria-hidden="true"></span>${evidenceWord(evidence)}</span>`;
}

function statusIcon(fit: Fit): string {
  if (fit === "matches") {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M7 12.5 10.2 16 17 8.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  if (fit === "unknowns") {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2.4"/></svg>`;
  }
  if (fit === "conflicts") {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 21 20 H3 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 10 v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
}

function statusBlock(assessment: Assessment): string {
  return `<p class="status status-${assessment.fit}">${statusIcon(assessment.fit)}<span>${esc(assessment.label)}</span></p>`;
}

function countsLine(route: Route, entrance: Entrance): string {
  const counts = evidenceCounts(route, segmentsFor(route), entrance);
  return `<p class="counts">Evidence: ${counts.confirmed} confirmed · ${counts.community} community-reported · ${counts.unknown} unknown</p>`;
}

function backButton(label = "Back"): string {
  return `<button type="button" class="text-button" data-action="back">${esc(label)}</button>`;
}

function schematic(routeList: Route[], assessments: Assessment[], selectedId: string): string {
  const byAssessment = new Map(assessments.map((item) => [item.routeId, item]));
  const lines = routeList
    .flatMap((route) => {
      const assessment = byAssessment.get(route.id);
      const selected = route.id === selectedId;
      return segmentsFor(route).map((segment) => {
        const pattern = assessment ? segmentPattern(assessment.reasons, segment.id) : "clear";
        return `<line class="seg seg-${pattern}${selected ? " is-selected" : ""}" x1="${segment.line.x1}" y1="${segment.line.y1}" x2="${segment.line.x2}" y2="${segment.line.y2}" />`;
      });
    })
    .join("");
  return `<figure class="schematic">
    <svg viewBox="0 0 100 70" role="img" aria-label="Schematic of the routes. Solid, dashed, and marked lines match the legend. The list has the same details in text.">
      <rect x="0" y="0" width="100" height="70" class="schematic-ground"></rect>
      ${lines}
      <text x="8" y="68" class="map-label">Start</text>
      <text x="78" y="68" class="map-label">End</text>
    </svg>
    <figcaption>
      <ul class="legend">
        <li><span class="swatch swatch-clear" aria-hidden="true"></span> Solid: no conflict on your preferences</li>
        <li><span class="swatch swatch-unknown" aria-hidden="true"></span> Dashed: an unknown detail you asked about</li>
        <li><span class="swatch swatch-conflict" aria-hidden="true"></span> Marked: conflicts with a preference or a known barrier</li>
      </ul>
    </figcaption>
  </figure>`;
}

function evidenceHelp(): string {
  return `<details class="help">
    <summary>How to read confirmed, community-reported, and unknown</summary>
    <ul>
      <li>${esc(copy.evidenceHelp.confirmed)}</li>
      <li>${esc(copy.evidenceHelp.community)}</li>
      <li>${esc(copy.evidenceHelp.unknown)}</li>
    </ul>
    <p>${esc(copy.noBlanket)}</p>
  </details>`;
}

function shell(title: string, main: string, state: AppState, dialogHtml: string): string {
  return `<header class="masthead">
    <div class="brand-row">
      <div class="brand">
        <span class="mark" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M8 34 C16 34 18 14 28 14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8 34 C20 34 22 26 40 18" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="4 3"/></svg></span>
        <div>
          <p class="wordmark">${esc(copy.product)}</p>
          <p class="tagline">${esc(copy.tagline)}</p>
        </div>
      </div>
      <div class="mast-actions">
        <p class="pilot">${esc(copy.pilotChip)}</p>
        <button type="button" class="text-button" data-action="text-scale" aria-describedby="text-note">Text size: ${esc(state.textScale)}%</button>
      </div>
    </div>
    <p id="text-note" class="banner">${esc(copy.sampleBanner)}</p>
    <nav class="primary-nav" aria-label="Primary">
      <button type="button" data-action="nav" data-view="home" ${state.view === "home" ? "aria-current=\"page\"" : ""}>Home</button>
      <button type="button" data-action="nav" data-view="trip" ${state.view === "trip" || state.view === "results" ? "aria-current=\"page\"" : ""}>Plan</button>
      <button type="button" data-action="nav" data-view="saved" ${state.view === "saved" || state.view === "preferences" ? "aria-current=\"page\"" : ""}>Preferences</button>
      <button type="button" data-action="nav" data-view="reports" ${state.view === "reports" || state.view === "report" || state.view === "report-status" ? "aria-current=\"page\"" : ""}>Reports</button>
    </nav>
  </header>
  <main id="main" tabindex="-1">
    ${backRow(state)}
    <h1 tabindex="-1">${esc(title)}</h1>
    ${state.notice ? `<p class="notice" role="status">${esc(state.notice)}</p>` : ""}
    ${main}
  </main>
  ${aside(state)}
  ${dialogHtml}`;
}

function backRow(state: AppState): string {
  if (state.view === "home" || state.history.length === 0) return "";
  return `<p class="back-row">${backButton("Back")}</p>`;
}

function aside(state: AppState): string {
  return `<aside class="prototype" aria-label="Prototype controls">
    <h2>Prototype controls</h2>
    <p>These controls are for review. They are not part of the product.</p>
    <div class="proto-grid">
      <button type="button" data-action="proto-sample-trip">Fill the sample trip</button>
      <button type="button" data-action="proto-sample-results">Open sample results</button>
      <button type="button" data-action="proto-no-match">Show a trip with no confirmed match</button>
      <button type="button" data-action="proto-outside">Show outside the pilot</button>
      <button type="button" data-action="proto-no-data">Show a pair with no route data</button>
      <button type="button" data-action="proto-error">Simulate a routing error</button>
      <button type="button" data-action="proto-offline">${state.offline ? "Connection is off" : "Simulate offline"}</button>
      <button type="button" data-action="proto-clear-flags">Clear offline and error</button>
      <button type="button" data-action="proto-reset">Reset saved demo data</button>
    </div>
  </aside>`;
}

function dialog(state: AppState): string {
  if (state.dialog === "none") return "";
  let title = "";
  let body = "";
  let actions = "";
  if (state.dialog === "location") {
    title = "Use location for the start place?";
    body = `<p>${esc(copy.locationBody)}</p>`;
    actions = `<button type="button" class="button" data-action="location-allow">Use sample start</button>
      <button type="button" class="button button-secondary" data-action="location-deny">Not now</button>`;
  } else if (state.dialog === "delete-prefs") {
    title = "Delete saved preferences?";
    body = `<p>${esc(copy.deletePrefs)}</p>`;
    actions = `<button type="button" class="button button-danger" data-action="delete-confirm">Delete preferences</button>
      <button type="button" class="button button-secondary" data-action="dialog-dismiss">Keep preferences</button>`;
  } else {
    title = "Withdraw this report?";
    body = `<p>${esc(copy.withdrawConfirm)}</p>`;
    actions = `<button type="button" class="button button-danger" data-action="withdraw-confirm">Withdraw report</button>
      <button type="button" class="button button-secondary" data-action="dialog-dismiss">Keep pending</button>`;
  }
  return `<div class="backdrop" data-action="dialog-dismiss"></div>
    <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <h2 id="dialog-title">${esc(title)}</h2>
      ${body}
      <div class="actions">${actions}</div>
    </div>`;
}

function home(state: AppState, data: PresentData): string {
  const prefs = prefsOf(state);
  let prefBlock = `<section class="panel"><h2>Access preferences</h2><p>No access preferences yet. Route results wait until you set some.</p>
    <button type="button" class="button" data-action="nav" data-view="preferences">Set access preferences</button></section>`;
  if (prefs && state.preferencesSaved) {
    prefBlock = `<section class="panel"><h2>Saved on this device</h2><p>${esc(presetName(prefs.preset))}</p><p>${esc(preferenceSummary(prefs))}</p>
      <div class="actions">
        <button type="button" class="button button-secondary" data-action="nav" data-view="preferences">Edit preferences</button>
        <button type="button" class="button button-secondary" data-action="delete-open">Delete preferences</button>
      </div></section>`;
  } else if (prefs) {
    prefBlock = `<section class="panel"><h2>Preferences for this session</h2><p>${esc(presetName(prefs.preset))}. ${esc(preferenceSummary(prefs))}</p>
      <p>Not saved on this device.</p>
      <button type="button" class="button button-secondary" data-action="nav" data-view="preferences">Edit preferences</button></section>`;
  }
  const recent = data.recent.length
    ? `<ul class="stack">${data.recent
        .map(
          (trip) =>
            `<li class="panel"><h3>${esc(trip.routeName)}</h3><p>${esc(trip.originLabel)} to ${esc(trip.destinationLabel)}</p><p>${esc(trip.fitLabel)}</p><p>Chosen ${esc(formatWhen(trip.chosenAt))}</p></li>`,
        )
        .join("")}</ul>`
    : `<p>No recent routes yet. A route you choose is kept on this device.</p>`;
  return `${prefBlock}
    <section class="panel hero-actions">
      <h2>Compare a trip</h2>
      <p>Enter a start and an end. Results lead with preference fit, and every route shows what is confirmed, community-reported, or unknown.</p>
      <button type="button" class="button" data-action="nav" data-view="trip">Enter origin and destination</button>
    </section>
    ${evidenceHelp()}
    <section><h2>Recent routes</h2>${recent}</section>`;
}

function preferences(state: AppState): string {
  const prefs = state.preferences ?? {
    preset: "custom" as const,
    avoidStairs: false,
    requireCurbRamps: false,
    maxGradePercent: null,
  };
  const checked = (id: Preferences["preset"]) => (state.preferences?.preset === id ? "checked" : "");
  const grade = prefs.maxGradePercent === null ? "none" : String(prefs.maxGradePercent);
  return `<p class="lede">Presets are starting points. They do not describe a person, and every setting stays editable.</p>
    <fieldset>
      <legend>Start from a preset</legend>
      ${presetChoice("step-free", "Step-free", "Avoid stairs, prefer curb ramps, and keep grades under 8%.", checked("step-free"))}
      ${presetChoice("gentle", "Gentle grades", "Keep grades under 5%. Stairs and curb ramps stay off until you turn them on.", checked("gentle"))}
      ${presetChoice("stroller", "Stroller or luggage", "Avoid stairs and prefer curb ramps. Moderate slopes under 12% are allowed.", checked("stroller"))}
      ${presetChoice("custom", "Custom", "Choose each setting yourself.", checked("custom"))}
    </fieldset>
    <fieldset>
      <legend>Settings used for this trip</legend>
      <label class="check"><input id="avoid-stairs" type="checkbox" data-field="avoid-stairs" ${prefs.avoidStairs ? "checked" : ""}/> Avoid stairs</label>
      <label class="check"><input id="curb-ramps" type="checkbox" data-field="curb-ramps" ${prefs.requireCurbRamps ? "checked" : ""}/> Prefer curb ramps where they are known</label>
      <label for="grade">Steepness limit</label>
      <select id="grade" data-field="grade">
        <option value="none" ${grade === "none" ? "selected" : ""}>No steepness limit</option>
        <option value="5" ${grade === "5" ? "selected" : ""}>Keep grades under 5%</option>
        <option value="8" ${grade === "8" ? "selected" : ""}>Minimize steep segments (under 8%)</option>
        <option value="12" ${grade === "12" ? "selected" : ""}>Allow moderate slopes (under 12%)</option>
      </select>
      <p class="hint">If you change a setting, the preset becomes Custom. ${esc(copy.unknownRule)}</p>
    </fieldset>
    <div class="actions">
      <button type="button" class="button" data-action="save-prefs">Save preferences</button>
      <button type="button" class="button button-secondary" data-action="use-prefs">Use for this trip only</button>
    </div>
    <p class="hint">Saved preferences stay in this browser. This prototype has no account.</p>`;
}

function presetChoice(id: Preferences["preset"], label: string, hint: string, checked: string): string {
  return `<label class="choice">
    <input id="preset-${id}" type="radio" name="preset" data-field="preset" data-preset="${id}" ${checked}/>
    <span><strong>${esc(label)}</strong><span class="hint">${esc(hint)}</span></span>
  </label>`;
}

function placeOptions(selected: string): string {
  const sample =
    selected === "sample-location"
      ? `<option value="sample-location" selected>${esc(SAMPLE_ORIGIN_LABEL)}</option>`
      : "";
  const options = places
    .map((place) => {
      const label = `${place.name} — ${place.detail}${place.inPilot ? "" : " (outside sample)"}`;
      return `<option value="${esc(place.id)}" ${place.id === selected ? "selected" : ""}>${esc(label)}</option>`;
    })
    .join("");
  return `<option value="">Choose a place</option>${sample}${options}`;
}

function trip(state: AppState): string {
  const prefs = prefsOf(state);
  const same =
    state.originId &&
    state.destinationId &&
    routingPlaceId(state.originId) === state.destinationId;
  return `<p class="lede">The start and end are places in the sample. Comparison uses the preferences below.</p>
    ${
      prefs
        ? `<section class="panel"><h2>Preferences for this comparison</h2><p>${esc(presetName(prefs.preset))}. ${esc(preferenceSummary(prefs))}</p>
            <p>${state.preferencesSaved ? "Saved on this device." : "Not saved on this device."}</p>
            <button type="button" class="button button-secondary" data-action="nav" data-view="preferences">Edit preferences</button></section>`
        : `<section class="panel" role="status"><h2>Set preferences first</h2><p>Route results stay unavailable until you choose how stairs, curb ramps, and steepness should be treated.</p>
            <button type="button" class="button" data-action="nav" data-view="preferences">Set access preferences</button></section>`
    }
    <div class="fields">
      <label for="origin">Origin</label>
      <select id="origin" data-field="origin">${placeOptions(state.originId)}</select>
      <button type="button" class="button button-secondary" data-action="location-open">Use current location</button>
      ${state.locationNote ? `<p id="location-status" role="status">${esc(state.locationNote)}</p>` : ""}
      <button type="button" class="text-button" data-action="swap">Swap origin and destination</button>
      <label for="destination">Destination</label>
      <select id="destination" data-field="destination">${placeOptions(state.destinationId)}</select>
    </div>
    ${same ? `<p role="alert">Choose two different places.</p>` : ""}
    ${state.tripError ? `<p role="alert">${esc(state.tripError)}</p>` : ""}
    <button type="button" class="button" data-action="compare" ${prefs && state.originId && state.destinationId && !same ? "" : "disabled"}>Compare routes</button>`;
}

function loading(): string {
  return `<p role="status" class="loading">Comparing routes for your preferences…</p>`;
}

function offline(): string {
  return `<section class="panel panel-alert" role="alert"><h2>${esc(copy.offlineTitle)}</h2><p>${esc(copy.offlineBody)}</p></section>
    <button type="button" class="button" data-action="nav" data-view="saved">Review saved preferences</button>`;
}

function errorScreen(): string {
  return `<section class="panel panel-alert" role="alert"><h2>${esc(copy.errorTitle)}</h2><p>${esc(copy.errorBody)}</p></section>
    <button type="button" class="button" data-action="retry">Try again</button>`;
}

function outside(placeName: string): string {
  return `<section class="panel"><h2>${esc(copy.outsideTitle)}</h2>
    <p>${esc(placeName)} is outside the Seattle sample area. AccessPath does not draw a route when it has no sidewalk data.</p>
    <button type="button" class="button" data-action="nav" data-view="trip">Change the trip</button></section>`;
}

function noData(): string {
  return `<section class="panel"><h2>${esc(copy.noDataTitle)}</h2><p>${esc(copy.noDataBody)}</p>
    <button type="button" class="button" data-action="nav" data-view="trip">Change the trip</button></section>`;
}

function routeCard(route: Route, assessment: Assessment, selected: boolean): string {
  const entrance = entranceById(route.entranceId);
  const reasons = summaryReasons(assessment.reasons)
    .map((reason) => `<li>${esc(reason.text)}</li>`)
    .join("");
  return `<article class="route route-${assessment.fit}" aria-labelledby="route-${esc(route.id)}-title">
    ${statusBlock(assessment)}
    <h3 id="route-${esc(route.id)}-title">${esc(route.name)}</h3>
    <p class="meta">${esc(formatDistance(route.distanceMeters))} · ${esc(formatMinutes(route.minutes))}</p>
    ${entrance ? countsLine(route, entrance) : ""}
    <ul>${reasons}</ul>
    <div class="actions">
      <button type="button" id="highlight-${esc(route.id)}" class="button button-secondary" data-action="highlight" data-id="${esc(route.id)}" aria-pressed="${selected ? "true" : "false"}">${selected ? "Marked on the map" : "Mark on the map"}</button>
      <button type="button" class="button" data-action="open-route" data-id="${esc(route.id)}">View details</button>
    </div>
  </article>`;
}

function results(state: AppState): string {
  const prefs = prefsOf(state) ?? {
    preset: "custom" as const,
    avoidStairs: false,
    requireCurbRamps: false,
    maxGradePercent: null,
  };
  const resolution = resolutionFor(state);
  if (!resolution || resolution.kind === "no-data") return noData();
  if (resolution.kind === "outside") return outside(resolution.placeName);
  const assessments = resolution.routes.map((route) => {
    const entrance = entranceById(route.entranceId);
    if (!entrance) throw new Error(`Missing entrance ${route.entranceId}`);
    return assessRoute(route, segmentsFor(route), entrance, prefs);
  });
  const ordered = orderRoutes(resolution.routes, assessments, state.sort);
  const selected = ordered.some((route) => route.id === state.selectedRouteId)
    ? state.selectedRouteId
    : (ordered[0]?.id ?? "");
  const cards = ordered
    .map((route) => {
      const assessment = assessments.find((item) => item.routeId === route.id);
      if (!assessment) return "";
      return routeCard(route, assessment, route.id === selected);
    })
    .join("");
  return `<p class="trip-line">${esc(placeLabel(state.originId))} to ${esc(placeLabel(state.destinationId))}</p>
    <p>${esc(preferenceSummary(prefs))}. <button type="button" class="text-button" data-action="nav" data-view="preferences">Edit preferences</button></p>
    <p class="lede">${esc(resultsHeadline(assessments, prefs, state.sort))}</p>
    <div class="toolbar">
      <div role="tablist" aria-label="Route presentation">
        <button type="button" role="tab" id="tab-list" aria-selected="${state.presentation === "list" ? "true" : "false"}" aria-controls="route-list" data-action="presentation" data-presentation="list">List</button>
        <button type="button" role="tab" id="tab-map" aria-selected="${state.presentation === "map" ? "true" : "false"}" aria-controls="route-map" data-action="presentation" data-presentation="map">Map</button>
      </div>
      <label for="sort">Sort</label>
      <select id="sort" data-field="sort">
        <option value="fit" ${state.sort === "fit" ? "selected" : ""}>Preference fit</option>
        <option value="shortest" ${state.sort === "shortest" ? "selected" : ""}>Shortest</option>
      </select>
    </div>
    <div class="results-layout presentation-${state.presentation}">
      <div id="route-map" role="tabpanel" aria-labelledby="tab-map">
        ${schematic(ordered, assessments, selected)}
      </div>
      <div id="route-list" role="tabpanel" aria-labelledby="tab-list">
        <h2>Routes in text</h2>
        <div class="stack">${cards}</div>
      </div>
    </div>
    ${evidenceHelp()}
    <p class="hint">${esc(copy.notGuarantee)} ${esc(copy.communityRule)}</p>`;
}

function detail(state: AppState): string {
  const routeId = state.selectedRouteId;
  const route = resolutionRoutes(state).find((item) => item.id === routeId);
  const prefs = prefsOf(state);
  if (!route || !prefs) {
    return `<p>Choose a route from the comparison.</p><button type="button" class="button" data-action="nav" data-view="results">Back to routes</button>`;
  }
  const entrance = entranceById(route.entranceId);
  if (!entrance) return `<p>Entrance data is missing for this sample route.</p>`;
  const assessment = assessRoute(route, segmentsFor(route), entrance, prefs);
  const segments = segmentsFor(route)
    .map((segment) => segmentBlock(segment, assessment, state.selectedSegmentId === segment.id))
    .join("");
  const chosen = state.chosenRouteId === route.id;
  const otherEntrance =
    entrance.id === "pike-first"
      ? `<button type="button" class="text-button" data-action="open-entrance" data-id="pike-south">Compare another entrance: south arcade</button>`
      : "";
  return `${statusBlock(assessment)}
    <p class="meta">${esc(formatDistance(route.distanceMeters))} · ${esc(formatMinutes(route.minutes))}</p>
    ${countsLine(route, entrance)}
    ${
      route.serviceAlert
        ? `<section class="panel panel-alert"><h2>Service notice</h2><p>${esc(route.serviceAlert.summary)}</p><p>Source: ${esc(route.serviceAlert.source)}. Updated ${esc(formatWhen(route.serviceAlert.updated))}.</p><p>Sample feed, not a live transit integration.</p></section>`
        : ""
    }
    ${schematic([route], [assessment], route.id)}
    <h2>Segments</h2>
    <div class="stack">${segments}</div>
    <section class="panel">
      <h2>Destination entrance</h2>
      <p>${esc(entrance.name)}</p>
      <button type="button" class="button button-secondary" data-action="open-entrance" data-id="${esc(entrance.id)}">View entrance details</button>
      ${otherEntrance}
    </section>
    <div class="actions">
      <button type="button" class="button" data-action="choose-route" data-id="${esc(route.id)}">Choose this route</button>
      <button type="button" class="button button-secondary" data-action="open-report" data-subject="${esc(entrance.name)}">Report a barrier</button>
    </div>
    ${
      chosen
        ? `<section class="panel" role="status"><h2>Route chosen</h2><p>${esc(copy.chooseNote)}</p>
            <button type="button" class="button button-secondary" data-action="undo-choice">Undo choice</button></section>`
        : ""
    }`;
}

function resolutionRoutes(state: AppState): Route[] {
  const resolution = resolutionFor(state);
  if (!resolution || resolution.kind !== "routes") return [];
  return resolution.routes;
}

function segmentBlock(segment: Segment, assessment: Assessment, selected: boolean): string {
  const reasons = assessment.reasons.filter((reason) => reason.segmentId === segment.id);
  const items = reasons.map((reason) => `<li>${esc(reason.text)}</li>`).join("");
  return `<article class="segment ${selected ? "is-selected" : ""}" id="segment-${esc(segment.id)}">
    <h3>${esc(segment.name)}</h3>
    <p>${esc(segment.instruction)}</p>
    <p class="meta">${esc(formatDistance(segment.distanceMeters))} · ${esc(formatMinutes(segment.minutes))}</p>
    <dl class="attrs">
      ${attrRow("Stairs", segment.stairs.evidence, stairsText(segment))}
      ${attrRow("Grade", segment.gradePercent.evidence, gradeText(segment))}
      ${attrRow("Curb ramp", segment.curbRamp.evidence, curbText(segment))}
      ${attrRow("Surface", segment.surface.evidence, segment.surface.value ?? "Not recorded")}
    </dl>
    ${items ? `<ul>${items}</ul>` : ""}
    <button type="button" id="segment-btn-${esc(segment.id)}" class="button button-secondary" data-action="segment" data-id="${esc(segment.id)}" aria-pressed="${selected ? "true" : "false"}">${selected ? "Highlighted" : "Highlight this segment"}</button>
    <button type="button" class="text-button" data-action="open-report" data-subject="${esc(segment.name)}">Report a barrier here</button>
  </article>`;
}

function attrRow(label: string, evidence: Evidence, value: string): string {
  return `<div><dt>${esc(label)}</dt><dd>${chip(evidence)} ${esc(value)}</dd></div>`;
}

function stairsText(segment: Segment): string {
  if (segment.stairs.evidence === "unknown" || segment.stairs.value === null) return "Not recorded";
  return segment.stairs.value ? "Stairs present" : "No stairs recorded";
}

function gradeText(segment: Segment): string {
  if (segment.gradePercent.evidence === "unknown" || segment.gradePercent.value === null) return "Not recorded";
  return `About ${segment.gradePercent.value}%`;
}

function curbText(segment: Segment): string {
  if (segment.curbRamp.evidence === "unknown" || segment.curbRamp.value === null) return "Not recorded";
  return segment.curbRamp.value ? "Curb ramp recorded" : "No curb ramp recorded";
}

function place(state: AppState): string {
  const entrance =
    entranceById(state.selectedEntranceId) ??
    entrances.find((item) => item.placeId === state.selectedEntranceId);
  if (!entrance) {
    return `<p>Choose an entrance from a route.</p>`;
  }
  const placeRecord = placeById(entrance.placeId);
  const note = entranceReportNote(entrance);
  const reports = entrance.reports
    .map(
      (report) => `<li class="panel">
        <p>${chip(report.evidence)} <strong>${esc(report.status === "verified" ? "Verified" : report.status === "pending" ? "Pending review" : "Withdrawn")}</strong></p>
        <p>${esc(report.summary)}</p>
        <p class="meta">${esc(report.source)} · ${esc(formatWhen(report.updated))}</p>
      </li>`,
    )
    .join("");
  const step =
    entrance.stepFree.evidence === "unknown" || entrance.stepFree.value === null
      ? "Not recorded"
      : entrance.stepFree.value
        ? "No step recorded"
        : "A step is recorded";
  const elevator =
    entrance.elevator.evidence === "unknown" || entrance.elevator.value === null
      ? "Not recorded"
      : entrance.elevator.value
        ? "Elevator recorded as available"
        : "Elevator recorded as unavailable";
  return `<p class="lede">${esc(placeRecord?.area ?? "")}</p>
    <p>${esc(placeRecord?.name ?? "")}. ${esc(entrance.name)}.</p>
    <dl class="attrs">
      ${attrRow("Step at the door", entrance.stepFree.evidence, step)}
      ${attrRow("Door", entrance.door.evidence, entrance.door.value ?? "Not recorded")}
      ${attrRow("Elevator", entrance.elevator.evidence, elevator)}
    </dl>
    ${
      entrance.stepFree.source
        ? `<p class="meta">Step detail source: ${esc(entrance.stepFree.source)}${entrance.stepFree.updated ? ` · ${esc(formatWhen(entrance.stepFree.updated))}` : ""}.</p>`
        : `<p class="meta">No source is recorded for the step at this entrance, so the status stays unknown.</p>`
    }
    <h2>Reports about this entrance</h2>
    ${note ? `<p>${esc(note)}</p>` : ""}
    ${reports ? `<ul class="stack">${reports}</ul>` : `<p>No reports for this entrance in the sample.</p>`}
    <button type="button" class="button" data-action="open-report" data-subject="${esc(entrance.name)}">Report a barrier at this entrance</button>`;
}

function reportSubjectOptions(state: AppState): string {
  const route = resolutionRoutes(state).find((item) => item.id === state.selectedRouteId);
  const labels = new Set<string>();
  if (route) {
    for (const segment of segmentsFor(route)) labels.add(segment.name);
    const entrance = entranceById(route.entranceId);
    if (entrance) labels.add(entrance.name);
  }
  if (state.selectedEntranceId) {
    const entrance = entranceById(state.selectedEntranceId);
    if (entrance) labels.add(entrance.name);
  }
  if (state.report.subject) labels.add(state.report.subject);
  const options = [...labels]
    .map(
      (label) =>
        `<option value="${esc(label)}" ${label === state.report.subject ? "selected" : ""}>${esc(label)}</option>`,
    )
    .join("");
  return `<option value="">Choose a segment or entrance</option>${options}`;
}

function reportForm(state: AppState): string {
  const errors = state.report.errors;
  const errorList = errors.length
    ? `<div role="alert"><h2>Fix the report before submitting</h2><ul>${errors
        .map((error) => `<li>${esc(error)}</li>`)
        .join("")}</ul></div>`
    : "";
  const categories = reportCategories
    .map(
      (category) =>
        `<option value="${category.id}" ${state.report.category === category.id ? "selected" : ""}>${esc(category.label)}</option>`,
    )
    .join("");
  return `<p class="lede">Tell a reviewer what you found. Submitting does not verify the detail, and other people will not see it as confirmed.</p>
    ${state.offline ? `<p role="alert">You're offline. This report cannot be submitted until the connection returns. Your draft stays on this screen.</p>` : ""}
    ${errorList}
    <div class="fields">
      <label for="category">Category</label>
      <select id="category" data-field="category" aria-invalid="${errors.some((error) => error.includes("category")) ? "true" : "false"}">
        <option value="">Choose a category</option>
        ${categories}
      </select>
      <label for="subject">Where</label>
      <select id="subject" data-field="subject" aria-invalid="${errors.some((error) => error.includes("where")) ? "true" : "false"}">
        ${reportSubjectOptions(state)}
      </select>
      <label for="description">What you found</label>
      <textarea id="description" data-field="description" rows="4">${esc(state.report.description)}</textarea>
    </div>
    <button type="button" class="button" data-action="submit-report">Submit report</button>
    <p class="hint">The report is stored in this browser only.</p>`;
}

function reportStatus(state: AppState, data: PresentData): string {
  const report = data.reports.find((item) => item.id === state.lastReportId);
  if (!report) {
    return `<p>No report is selected.</p><button type="button" class="button" data-action="nav" data-view="reports">Your reports</button>`;
  }
  const pending = report.status === "pending";
  return `<p class="status ${pending ? "status-unknowns" : "status-unfiltered"}">${pending ? chip("unknown").replace("Unknown", "Pending review") : chip("community").replace("Community-reported", "Withdrawn")}</p>
    <p class="meta">Submitted ${esc(formatWhen(report.submittedAt))}</p>
    <dl class="attrs">
      <div><dt>Status</dt><dd>${pending ? "Pending review" : "Withdrawn"}</dd></div>
      <div><dt>Category</dt><dd>${esc(categoryLabel(report.category))}</dd></div>
      <div><dt>Where</dt><dd>${esc(report.subject)}</dd></div>
      <div><dt>Description</dt><dd>${esc(report.description)}</dd></div>
    </dl>
    <p>${esc(pending ? copy.reportPendingBody : copy.reportWithdrawnBody)}</p>
    <div class="actions">
      ${pending ? `<button type="button" class="button button-secondary" data-action="withdraw-open">Withdraw report</button>` : ""}
      <button type="button" class="button" data-action="nav" data-view="${esc(state.returnView)}">Back</button>
    </div>`;
}

function categoryLabel(id: string): string {
  return reportCategories.find((category) => category.id === id)?.label ?? id;
}

function saved(state: AppState): string {
  if (!state.preferences || !state.preferencesSaved) {
    return `<section class="panel"><h2>Nothing is saved on this device</h2>
      <p>You can still set preferences for one trip. Saving keeps them in this browser so the next comparison can use them. There is no account in this prototype.</p>
      <button type="button" class="button" data-action="nav" data-view="preferences">Set access preferences</button></section>`;
  }
  const prefs = state.preferences;
  return `<section class="panel">
      <h2>${esc(presetName(prefs.preset))}</h2>
      <p>${esc(preferenceSummary(prefs))}</p>
      <ul>
        <li>Avoid stairs: ${prefs.avoidStairs ? "On" : "Off"}</li>
        <li>Curb ramps: ${prefs.requireCurbRamps ? "On" : "Off"}</li>
        <li>Steepness limit: ${prefs.maxGradePercent === null ? "Off" : `Under ${prefs.maxGradePercent}%`}</li>
      </ul>
      <div class="actions">
        <button type="button" class="button" data-action="nav" data-view="preferences">Edit preferences</button>
        <button type="button" class="button button-danger" data-action="delete-open">Delete preferences</button>
      </div>
    </section>
    <p class="hint">Deleting removes them from this browser only.</p>`;
}

function reports(data: PresentData): string {
  const yours = data.reports.length
    ? `<ul class="stack">${data.reports
        .map(
          (report) => `<li class="panel">
            <h3>${esc(categoryLabel(report.category))}</h3>
            <p class="status ${report.status === "pending" ? "status-unknowns" : "status-unfiltered"}">${report.status === "pending" ? "Pending review" : "Withdrawn"}</p>
            <p>${esc(report.subject)}</p>
            <p>${esc(report.description)}</p>
            <p class="meta">${esc(formatWhen(report.submittedAt))}</p>
            <button type="button" class="button button-secondary" data-action="open-status" data-id="${esc(report.id)}">View status</button>
          </li>`,
        )
        .join("")}</ul>`
    : `<p>You have not submitted a report from this browser.</p>`;
  return `<section><h2>Your reports</h2>${yours}</section>
    <section class="panel">
      <h2>Sample verified report</h2>
      <p class="status status-matches">Verified</p>
      <p>Not yours. Illustrative, so you can see a verified status beside a pending one.</p>
      <p>Missing curb ramp at a sample crossing.</p>
      <p class="meta">Sample sidewalk review · 2 Oct 2026, 9:00 a.m.</p>
    </section>
    <button type="button" class="button" data-action="nav" data-view="trip">Plan a route</button>`;
}

function mainContent(state: AppState, data: PresentData): { title: string; body: string } {
  if (state.view === "home") {
    return { title: "Plan a route around your access needs", body: home(state, data) };
  }
  if (state.view === "preferences") {
    return { title: "How should this route treat access?", body: preferences(state) };
  }
  if (state.view === "trip") {
    return { title: "Where are you going?", body: trip(state) };
  }
  if (state.view === "results") {
    if (state.offline) return { title: copy.offlineTitle, body: offline() };
    if (state.serviceError) return { title: copy.errorTitle, body: errorScreen() };
    if (state.loading) return { title: "Comparing routes", body: loading() };
    const resolution = resolutionFor(state);
    if (resolution?.kind === "outside") return { title: copy.outsideTitle, body: outside(resolution.placeName) };
    if (!resolution || resolution.kind === "no-data") return { title: copy.noDataTitle, body: noData() };
    return { title: "Compare routes", body: results(state) };
  }
  if (state.view === "detail") {
    const route = resolutionRoutes(state).find((item) => item.id === state.selectedRouteId);
    return { title: route?.name ?? "Route details", body: detail(state) };
  }
  if (state.view === "place") {
    const entrance = entranceById(state.selectedEntranceId);
    const placeRecord = entrance ? placeById(entrance.placeId) : undefined;
    return {
      title: placeRecord ? `${placeRecord.name}` : "Entrance details",
      body: place(state),
    };
  }
  if (state.view === "report") return { title: "Report a barrier", body: reportForm(state) };
  if (state.view === "report-status") {
    return { title: copy.reportPendingTitle, body: reportStatus(state, data) };
  }
  if (state.view === "saved") return { title: "Saved preferences", body: saved(state) };
  return { title: "Your reports", body: reports(data) };
}

export function present(state: AppState, data: PresentData): Presentation {
  const content = mainContent(state, data);
  const title =
    state.view === "report-status" && data.reports.find((item) => item.id === state.lastReportId)?.status === "withdrawn"
      ? "Report withdrawn"
      : content.title;
  return {
    title,
    html: shell(title, content.body, state, dialog(state)),
  };
}

