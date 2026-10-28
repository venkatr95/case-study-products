import { formatWhen } from "./format.js";
import type {
  Assessment,
  Barrier,
  BarrierCategory,
  Entrance,
  EvidenceCounts,
  Fit,
  Preferences,
  PresetId,
  Reason,
  Route,
  Segment,
  SortMode,
} from "./types.js";

const STATUS_LABEL: Record<Fit, string> = {
  matches: "Matches your preferences on confirmed data",
  unknowns: "Some details are unknown",
  conflicts: "Conflicts with your preferences",
  unfiltered: "No access preferences selected",
};

const KNOWN_BARRIER_LABEL = "A known barrier is on this route";

const BLOCKING: ReadonlySet<BarrierCategory> = new Set([
  "stairs",
  "blocked-sidewalk",
  "missing-curb",
  "elevator-outage",
  "entrance-step",
]);

export function statusLabels(): string[] {
  return [...Object.values(STATUS_LABEL), KNOWN_BARRIER_LABEL];
}

export function applyPreset(preset: PresetId): Preferences {
  if (preset === "step-free") {
    return { preset, avoidStairs: true, requireCurbRamps: true, maxGradePercent: 8 };
  }
  if (preset === "gentle") {
    return { preset, avoidStairs: false, requireCurbRamps: false, maxGradePercent: 5 };
  }
  if (preset === "stroller") {
    return { preset, avoidStairs: true, requireCurbRamps: true, maxGradePercent: 12 };
  }
  return { preset: "custom", avoidStairs: false, requireCurbRamps: false, maxGradePercent: null };
}

export function matchPreset(
  prefs: Pick<Preferences, "avoidStairs" | "requireCurbRamps" | "maxGradePercent">,
): PresetId {
  const ids: PresetId[] = ["step-free", "gentle", "stroller"];
  for (const id of ids) {
    const preset = applyPreset(id);
    if (
      preset.avoidStairs === prefs.avoidStairs &&
      preset.requireCurbRamps === prefs.requireCurbRamps &&
      preset.maxGradePercent === prefs.maxGradePercent
    ) {
      return id;
    }
  }
  return "custom";
}

export function withMatchedPreset(prefs: Preferences): Preferences {
  return { ...prefs, preset: matchPreset(prefs) };
}

function preferencesActive(prefs: Preferences): boolean {
  return prefs.avoidStairs || prefs.requireCurbRamps || prefs.maxGradePercent !== null;
}

function push(reasons: Reason[], tone: Reason["tone"], text: string, segmentId?: string): void {
  const reason: Reason = { tone, text };
  if (segmentId) reason.segmentId = segmentId;
  reasons.push(reason);
}

function assessStairs(segment: Segment, prefs: Preferences, reasons: Reason[]): void {
  const { value, evidence } = segment.stairs;
  const name = segment.name;
  if (!prefs.avoidStairs) {
    if (value === true) {
      push(reasons, "note", `Stairs on ${name}. Avoid stairs is off.`, segment.id);
    }
    return;
  }
  if (evidence === "unknown" || value === null) {
    push(reasons, "unknown", `Stairs on ${name}: unknown.`, segment.id);
    return;
  }
  if (value === true) {
    const text =
      evidence === "confirmed"
        ? `Stairs confirmed on ${name}.`
        : `Community report, not verified: stairs on ${name}.`;
    push(reasons, "conflict", text, segment.id);
    return;
  }
  if (evidence === "confirmed") {
    push(reasons, "clear", `No stairs confirmed on ${name}.`, segment.id);
    return;
  }
  push(
    reasons,
    "unknown",
    `A community report says there are no stairs on ${name}. This is not confirmed.`,
    segment.id,
  );
}

function assessGrade(segment: Segment, prefs: Preferences, reasons: Reason[]): void {
  const { value, evidence } = segment.gradePercent;
  const name = segment.name;
  const max = prefs.maxGradePercent;
  if (max === null) {
    if (evidence === "unknown" || value === null) {
      push(reasons, "note", `Grade on ${name}: unknown. Steepness limit is off.`, segment.id);
    } else {
      push(
        reasons,
        "note",
        `Grade on ${name}: about ${value}% (${evidence === "confirmed" ? "confirmed" : "community-reported"}). Steepness limit is off.`,
        segment.id,
      );
    }
    return;
  }
  if (evidence === "unknown" || value === null) {
    push(reasons, "unknown", `Grade on ${name}: unknown. Your limit is ${max}%.`, segment.id);
    return;
  }
  if (evidence === "community") {
    if (value > max) {
      push(
        reasons,
        "conflict",
        `Community report, not verified: grade on ${name} is about ${value}%, over your ${max}% limit.`,
        segment.id,
      );
    } else {
      push(
        reasons,
        "unknown",
        `A community report says the grade on ${name} is about ${value}%. Not confirmed, so it does not count as a match.`,
        segment.id,
      );
    }
    return;
  }
  if (value > max) {
    push(
      reasons,
      "conflict",
      `Grade on ${name} is about ${value}% confirmed, over your ${max}% limit.`,
      segment.id,
    );
    return;
  }
  push(
    reasons,
    "clear",
    `Grade on ${name} is about ${value}% confirmed, within your ${max}% limit.`,
    segment.id,
  );
}

function assessCurb(segment: Segment, prefs: Preferences, reasons: Reason[]): void {
  const { value, evidence } = segment.curbRamp;
  const name = segment.name;
  if (!prefs.requireCurbRamps) {
    if (value === false) {
      push(reasons, "note", `No curb ramp recorded on ${name}. Curb ramps are not one of your preferences.`, segment.id);
    }
    return;
  }
  if (evidence === "unknown" || value === null) {
    push(reasons, "unknown", `Curb ramp on ${name}: unknown.`, segment.id);
    return;
  }
  if (value === false) {
    const text =
      evidence === "confirmed"
        ? `No curb ramp confirmed on ${name}.`
        : `Community report, not verified: no curb ramp on ${name}.`;
    push(reasons, "conflict", text, segment.id);
    return;
  }
  if (evidence === "confirmed") {
    push(reasons, "clear", `Curb ramp confirmed on ${name}.`, segment.id);
    return;
  }
  push(
    reasons,
    "unknown",
    `A community report says there is a curb ramp on ${name}. This is not confirmed.`,
    segment.id,
  );
}

function assessSurface(segment: Segment, reasons: Reason[]): void {
  if (segment.surface.evidence === "unknown") {
    push(
      reasons,
      "note",
      `Sidewalk surface on ${nameOf(segment)}: unknown. Surface is not one of your preferences.`,
      segment.id,
    );
  }
}

function nameOf(segment: Segment): string {
  return segment.name;
}

function barrierTone(category: BarrierCategory, prefs: Preferences): "conflict" | "note" {
  if (category === "surface" || category === "other") return "note";
  if (category === "steep-grade") return prefs.maxGradePercent !== null ? "conflict" : "note";
  if (BLOCKING.has(category)) return "conflict";
  return "note";
}

function assessBarrier(barrier: Barrier, prefs: Preferences, segment: Segment, reasons: Reason[]): void {
  if (barrier.status === "withdrawn") return;
  const tone = barrierTone(barrier.category, prefs);
  const status =
    barrier.status === "verified" || barrier.evidence === "confirmed"
      ? "Verified"
      : "Community report, pending review";
  push(reasons, tone, `${status}: ${barrier.summary}`, segment.id);
}

function assessEntrance(entrance: Entrance, prefs: Preferences, reasons: Reason[]): void {
  const { value, evidence } = entrance.stepFree;
  const name = entrance.name;
  if (!prefs.avoidStairs) {
    if (value === false) {
      push(reasons, "note", `A step is recorded at ${name}. Avoid stairs is off.`);
    }
    return;
  }
  if (evidence === "unknown" || value === null) {
    push(reasons, "unknown", `Step at ${name}: unknown.`);
    return;
  }
  if (value === false) {
    const text =
      evidence === "confirmed"
        ? `A step is confirmed at ${name}.`
        : `Community report, not verified: a step at ${name}.`;
    push(reasons, "conflict", text);
    return;
  }
  if (evidence === "confirmed") {
    push(reasons, "clear", `No step confirmed at ${name}.`);
    return;
  }
  push(reasons, "unknown", `A community report says ${name} has no step. This is not confirmed.`);
}

export function assessRoute(
  route: Route,
  segments: Segment[],
  entrance: Entrance,
  prefs: Preferences,
): Assessment {
  const reasons: Reason[] = [];
  const byId = new Map(segments.map((segment) => [segment.id, segment]));
  for (const segmentId of route.segmentIds) {
    const segment = byId.get(segmentId);
    if (!segment) continue;
    assessStairs(segment, prefs, reasons);
    assessGrade(segment, prefs, reasons);
    assessCurb(segment, prefs, reasons);
    assessSurface(segment, reasons);
    for (const barrier of segment.barriers) assessBarrier(barrier, prefs, segment, reasons);
  }
  assessEntrance(entrance, prefs, reasons);
  if (route.serviceAlert) {
    push(
      reasons,
      "conflict",
      `Verified notice: ${route.serviceAlert.summary} Source: ${route.serviceAlert.source}. Updated ${formatWhen(route.serviceAlert.updated)}. Sample feed, not live.`,
    );
  }

  const prefOn = preferencesActive(prefs);
  const hasConflict = reasons.some((reason) => reason.tone === "conflict");
  const hasUnknown = reasons.some((reason) => reason.tone === "unknown");
  let fit: Fit;
  let label: string;
  if (hasConflict && prefOn) {
    fit = "conflicts";
    label = STATUS_LABEL.conflicts;
  } else if (hasConflict) {
    fit = "conflicts";
    label = KNOWN_BARRIER_LABEL;
  } else if (hasUnknown && prefOn) {
    fit = "unknowns";
    label = STATUS_LABEL.unknowns;
  } else if (prefOn) {
    fit = "matches";
    label = STATUS_LABEL.matches;
  } else {
    fit = "unfiltered";
    label = STATUS_LABEL.unfiltered;
  }
  return { routeId: route.id, fit, label, reasons };
}

export function evidenceCounts(route: Route, segments: Segment[], entrance: Entrance): EvidenceCounts {
  const counts: EvidenceCounts = { confirmed: 0, community: 0, unknown: 0 };
  const bump = (evidence: Segment["stairs"]["evidence"]) => {
    counts[evidence] += 1;
  };
  const byId = new Map(segments.map((segment) => [segment.id, segment]));
  for (const segmentId of route.segmentIds) {
    const segment = byId.get(segmentId);
    if (!segment) continue;
    bump(segment.stairs.evidence);
    bump(segment.gradePercent.evidence);
    bump(segment.curbRamp.evidence);
    for (const barrier of segment.barriers) {
      if (barrier.status === "withdrawn") continue;
      bump(barrier.evidence);
    }
  }
  bump(entrance.stepFree.evidence);
  if (route.serviceAlert) counts.confirmed += 1;
  return counts;
}

const FIT_RANK: Record<Fit, number> = {
  matches: 0,
  unknowns: 1,
  unfiltered: 2,
  conflicts: 3,
};

export function orderRoutes(
  routes: Route[],
  assessments: Assessment[],
  sort: SortMode,
): Route[] {
  const byId = new Map(assessments.map((item) => [item.routeId, item]));
  return [...routes].sort((a, b) => {
    if (sort === "shortest") return a.minutes - b.minutes || a.distanceMeters - b.distanceMeters;
    const left = byId.get(a.id);
    const right = byId.get(b.id);
    const rank = FIT_RANK[left?.fit ?? "conflicts"] - FIT_RANK[right?.fit ?? "conflicts"];
    if (rank !== 0) return rank;
    return a.minutes - b.minutes;
  });
}

export function resultsHeadline(assessments: Assessment[], prefs: Preferences, sort: SortMode): string {
  const prefOn = preferencesActive(prefs);
  const anyMatch = assessments.some((item) => item.fit === "matches");
  let headline: string;
  if (!prefOn) {
    headline = "You have not selected access preferences. Barriers we know about are still listed.";
  } else if (anyMatch) {
    headline =
      "At least one route matches your preferences on confirmed data. That is not a guarantee the path is barrier-free.";
  } else {
    headline =
      "No route matches your preferences on confirmed data. You can inspect each route or change a preference.";
  }
  if (sort === "shortest") {
    headline += " Showing the shortest trip first. Read the access status before you choose.";
  }
  return headline;
}

export function summaryReasons(reasons: Reason[], limit = 3): Reason[] {
  const rank = { conflict: 0, unknown: 1, note: 2, clear: 3 };
  return [...reasons].sort((a, b) => rank[a.tone] - rank[b.tone]).slice(0, limit);
}

export function segmentPattern(
  reasons: Reason[],
  segmentId: string,
): "conflict" | "unknown" | "clear" {
  const mine = reasons.filter((reason) => reason.segmentId === segmentId);
  if (mine.some((reason) => reason.tone === "conflict")) return "conflict";
  if (mine.some((reason) => reason.tone === "unknown")) return "unknown";
  return "clear";
}

export function entranceReportNote(entrance: Entrance): string | null {
  const visible = entrance.reports.filter((report) => report.status !== "withdrawn");
  if (visible.length < 2) return null;
  return "AccessPath lists each report. It does not merge them into a single access status.";
}
