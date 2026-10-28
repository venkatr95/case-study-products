import assert from "node:assert/strict";
import { test } from "node:test";
import { copy } from "../src/copy.js";
import {
  applyPreset,
  assessRoute,
  evidenceCounts,
  orderRoutes,
  resultsHeadline,
  statusLabels,
} from "../src/evaluate.js";
import { formatDistance, formatWhen } from "../src/format.js";
import { present } from "../src/render.js";
import {
  entranceById,
  resolveTrip,
  routeById,
  routes,
  segments,
  segmentsFor,
} from "../src/sample.js";
import { createMemoryStorage, createState, submitReport, validateReport, withdrawReport } from "../src/store.js";
import type { Entrance, Route, Segment } from "../src/types.js";

function route(id: string): Route {
  const found = routeById(id);
  if (!found) throw new Error(id);
  return found;
}

function entrance(id: string): Entrance {
  const found = entranceById(id);
  if (!found) throw new Error(id);
  return found;
}

function assess(id: string, preset: "step-free" | "gentle" | "stroller" | "custom" = "step-free") {
  const found = route(id);
  return assessRoute(found, segmentsFor(found), entrance(found.entranceId), applyPreset(preset));
}

test("step-free comparison separates a match, unknowns, and a conflict", () => {
  const prefs = applyPreset("step-free");
  const trip = resolveTrip("cal-anderson", "pike-first");
  assert.equal(trip.kind, "routes");
  if (trip.kind !== "routes") return;
  const assessments = trip.routes.map((item) =>
    assessRoute(item, segmentsFor(item), entrance(item.entranceId), prefs),
  );
  const byId = Object.fromEntries(assessments.map((item) => [item.routeId, item.fit]));
  assert.deepEqual(byId, { madison: "matches", "pike-seneca": "unknowns", pine: "conflicts" });
  const ordered = orderRoutes(trip.routes, assessments, "fit").map((item) => item.id);
  assert.deepEqual(ordered, ["madison", "pike-seneca", "pine"]);
  assert.match(resultsHeadline(assessments, prefs, "fit"), /at least one route matches/i);
  assert.equal(resultsHeadline(assessments, prefs, "fit").toLowerCase().includes("fully accessible"), false);
});

test("shortest sort does not hide a conflicting route", () => {
  const trip = resolveTrip("cal-anderson", "pike-first");
  assert.equal(trip.kind, "routes");
  if (trip.kind !== "routes") return;
  const prefs = applyPreset("step-free");
  const assessments = trip.routes.map((item) =>
    assessRoute(item, segmentsFor(item), entrance(item.entranceId), prefs),
  );
  const ordered = orderRoutes(trip.routes, assessments, "shortest").map((item) => item.id);
  assert.deepEqual(ordered, ["pine", "pike-seneca", "madison"]);
  assert.match(resultsHeadline(assessments, prefs, "shortest"), /shortest trip first/i);
});

test("unknown grade or curb ramp blocks a confirmed match", () => {
  const assessment = assess("pike-seneca");
  assert.equal(assessment.fit, "unknowns");
  assert.equal(assessment.label, "Some details are unknown");
  assert.ok(assessment.reasons.some((reason) => reason.text.includes("Grade on Pike Street: unknown")));
  assert.ok(assessment.reasons.some((reason) => reason.text.includes("Curb ramp on Seneca Street: unknown")));
});

test("a community report that a path is clear does not confirm it", () => {
  const segment: Segment = {
    ...segments[0],
    id: "community-clear",
    name: "Community clear block",
    stairs: { value: false, evidence: "community", source: "Community report", updated: "2026-10-01T12:00:00-07:00" },
    gradePercent: { value: 2, evidence: "confirmed", source: "Sample", updated: "2026-10-01T12:00:00-07:00" },
    curbRamp: { value: true, evidence: "confirmed", source: "Sample", updated: "2026-10-01T12:00:00-07:00" },
    surface: { value: "Concrete", evidence: "confirmed" },
    barriers: [],
  };
  const synthetic: Route = {
    id: "synthetic",
    name: "Synthetic",
    distanceMeters: 100,
    minutes: 2,
    segmentIds: [segment.id],
    entranceId: "pike-first",
  };
  const assessment = assessRoute(synthetic, [segment], entrance("pike-first"), applyPreset("step-free"));
  assert.equal(assessment.fit, "unknowns");
  assert.match(assessment.reasons.map((reason) => reason.text).join(" "), /not confirmed/i);
});

test("confirmed stairs and a steep grade conflict with step-free settings", () => {
  const assessment = assess("pine");
  assert.equal(assessment.fit, "conflicts");
  assert.match(assessment.reasons.map((reason) => reason.text).join(" "), /Stairs confirmed on Pine Street link/);
  assert.match(assessment.reasons.map((reason) => reason.text).join(" "), /10% confirmed/);
});

test("an unknown sidewalk surface does not block a match", () => {
  const assessment = assess("madison");
  assert.equal(assessment.fit, "matches");
  assert.equal(assessment.label, "Matches your preferences on confirmed data");
  assert.ok(assessment.reasons.some((reason) => reason.tone === "note" && reason.text.includes("Western Avenue")));
});

test("no route to Volunteer Park matches step-free settings", () => {
  const trip = resolveTrip("cal-anderson", "volunteer");
  assert.equal(trip.kind, "routes");
  if (trip.kind !== "routes") return;
  const prefs = applyPreset("step-free");
  const assessments = trip.routes.map((item) =>
    assessRoute(item, segmentsFor(item), entrance(item.entranceId), prefs),
  );
  assert.equal(assessments.every((item) => item.fit !== "matches"), true);
  assert.match(resultsHeadline(assessments, prefs, "fit"), /No route matches/);
});

test("a grade equal to the stroller limit is within the limit, and unknown stairs remain unknown", () => {
  const assessment = assess("volunteer-climb", "stroller");
  assert.equal(assessment.fit, "unknowns");
  assert.equal(assessment.reasons.some((reason) => reason.text.includes("over your 12%")), false);
});

test("gentle preset flags the 7% Broadway route and does not turn stairs on by itself", () => {
  const assessment = assess("broadway-surface", "gentle");
  assert.equal(assessment.fit, "conflicts");
  assert.match(assessment.reasons.map((reason) => reason.text).join(" "), /7% confirmed/);
  const prefs = applyPreset("gentle");
  assert.equal(prefs.avoidStairs, false);
});

test("verified elevator notice conflicts and names its source", () => {
  const assessment = assess("station-elevator");
  assert.equal(assessment.fit, "conflicts");
  const text = assessment.reasons.map((reason) => reason.text).join(" ");
  assert.match(text, /Sample transit feed/);
  assert.match(text, /Broadway elevator out of service/);
});

test("status labels never call a route fully accessible", () => {
  const banned = /fully accessible/i;
  for (const label of statusLabels()) assert.equal(banned.test(label), false);
  for (const item of routes) {
    for (const preset of ["step-free", "gentle", "stroller", "custom"] as const) {
      const assessment = assess(item.id, preset);
      assert.equal(banned.test(assessment.label), false);
    }
  }
});

test("outside pilot and missing pairs do not invent a route", () => {
  const outside = resolveTrip("cal-anderson", "bainbridge");
  assert.equal(outside.kind, "outside");
  const missing = resolveTrip("library", "volunteer");
  assert.equal(missing.kind, "no-data");
});

test("evidence counts keep unknown separate from confirmed", () => {
  const found = route("pike-seneca");
  const counts = evidenceCounts(found, segmentsFor(found), entrance(found.entranceId));
  assert.ok(counts.unknown >= 2);
  assert.ok(counts.community >= 1);
  assert.ok(counts.confirmed >= 1);
});

test("sample distances are the sum of their segments", () => {
  for (const item of routes) {
    const sum = segmentsFor(item).reduce((total, segment) => total + segment.distanceMeters, 0);
    assert.equal(sum, item.distanceMeters);
  }
  assert.equal(formatDistance(1931), "About 1.2 mi");
  assert.equal(formatWhen("2026-10-22T07:40:00-07:00"), "22 Oct 2026, 7:40 a.m.");
});

test("reports start pending, can be withdrawn, and stay distinct from verified", () => {
  const storage = createMemoryStorage();
  const errors = validateReport({ category: "", subject: "", description: "short" });
  assert.deepEqual(errors, [
    "Choose a report category.",
    "Choose where you found the barrier.",
    "Describe what you found in at least a short sentence.",
  ]);
  const report = submitReport(storage, {
    id: "report-1",
    category: "stairs",
    subject: "Pine Street link",
    description: "There is a stairway in the pedestrian link.",
    submittedAt: "2026-10-22T09:00:00-07:00",
  });
  assert.equal(report.status, "pending");
  const withdrawn = withdrawReport(storage, report.id);
  assert.equal(withdrawn?.status, "withdrawn");
});

test("results markup shows all three statuses and escapes report text", () => {
  const state = createState({
    view: "results",
    preferences: applyPreset("step-free"),
    preferencesSaved: true,
    originId: "cal-anderson",
    destinationId: "pike-first",
    history: ["trip"],
  });
  const html = present(state, { reports: [], recent: [] }).html;
  assert.match(html, /Matches your preferences on confirmed data/);
  assert.match(html, /Some details are unknown/);
  assert.match(html, /Conflicts with your preferences/);
  assert.match(html, /Routes in text/);
  assert.equal(/fully accessible/i.test(html), false);
  assert.match(html, /How to read confirmed, community-reported, and unknown/);

  const status = present(
    createState({ view: "report-status", lastReportId: "report-9", history: ["report"] }),
    {
      reports: [
        {
          id: "report-9",
          category: "stairs",
          subject: "Pine Street link",
          description: "<script>alert(1)</script>",
          submittedAt: "2026-10-22T09:00:00-07:00",
          status: "pending",
        },
      ],
      recent: [],
    },
  ).html;
  assert.match(status, /Pending review/);
  assert.match(status, /not verified/i);
  assert.match(status, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.equal(status.includes("<script>alert"), false);
});

test("preference and empty states explain themselves", () => {
  const trip = present(createState({ view: "trip", history: ["home"] }), { reports: [], recent: [] }).html;
  assert.match(trip, /Set preferences first/);
  assert.match(trip, /disabled/);
  const outside = present(
    createState({
      view: "results",
      preferences: applyPreset("step-free"),
      originId: "cal-anderson",
      destinationId: "bainbridge",
      history: ["trip"],
    }),
    { reports: [], recent: [] },
  ).html;
  assert.match(outside, /outside the Seattle sample area/);
  assert.match(outside, /does not draw a route/);
  const offline = present(
    createState({ view: "results", offline: true, history: ["trip"] }),
    { reports: [], recent: [] },
  ).html;
  assert.match(offline, /No route was guessed/);
});

test("south arcade keeps conflicting reports side by side", () => {
  const state = createState({ view: "place", selectedEntranceId: "pike-south", history: ["detail"] });
  const html = present(state, { reports: [], recent: [] }).html;
  assert.match(html, /One step at the door/);
  assert.match(html, /temporary ramp/i);
  assert.match(html, /does not merge them/);
  assert.match(html, /Unknown/);
});

test("copy does not promise a blanket access rating", () => {
  assert.equal(/fully accessible/i.test(JSON.stringify(copy)), false);
});
