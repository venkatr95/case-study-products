/** Domain types for the AccessPath prototype. Sample values are illustrative. */

export type Evidence = "confirmed" | "community" | "unknown";

export type PresetId = "step-free" | "gentle" | "stroller" | "custom";

export type Fit = "matches" | "unknowns" | "conflicts" | "unfiltered";

export type SortMode = "fit" | "shortest";

export type Presentation = "list" | "map";

export type ViewId =
  | "home"
  | "preferences"
  | "trip"
  | "results"
  | "detail"
  | "place"
  | "report"
  | "report-status"
  | "saved"
  | "reports";

export type DialogId = "none" | "location" | "delete-prefs" | "withdraw";

export type TextScale = "100" | "125" | "150";

export type BarrierCategory =
  | "stairs"
  | "steep-grade"
  | "missing-curb"
  | "blocked-sidewalk"
  | "elevator-outage"
  | "entrance-step"
  | "surface"
  | "other";

export type ReportCategory = BarrierCategory;

export interface Sourced<T> {
  value: T | null;
  evidence: Evidence;
  source?: string;
  updated?: string;
}

export interface Barrier {
  id: string;
  category: BarrierCategory;
  summary: string;
  evidence: Evidence;
  status: "pending" | "verified" | "withdrawn";
  updated: string;
  source: string;
}

export interface SegmentLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Segment {
  id: string;
  name: string;
  instruction: string;
  distanceMeters: number;
  minutes: number;
  stairs: Sourced<boolean>;
  gradePercent: Sourced<number>;
  curbRamp: Sourced<boolean>;
  surface: Sourced<string>;
  barriers: Barrier[];
  line: SegmentLine;
}

export interface ServiceAlert {
  summary: string;
  source: string;
  updated: string;
  illustrative: true;
}

export interface Route {
  id: string;
  name: string;
  distanceMeters: number;
  minutes: number;
  segmentIds: string[];
  entranceId: string;
  serviceAlert?: ServiceAlert;
}

export interface EntranceReport {
  id: string;
  summary: string;
  evidence: Evidence;
  status: "pending" | "verified" | "withdrawn";
  updated: string;
  source: string;
}

export interface Entrance {
  id: string;
  placeId: string;
  name: string;
  stepFree: Sourced<boolean>;
  door: Sourced<string>;
  elevator: Sourced<boolean>;
  reports: EntranceReport[];
}

export interface Place {
  id: string;
  name: string;
  detail: string;
  area: string;
  inPilot: boolean;
}

export interface Preferences {
  preset: PresetId;
  avoidStairs: boolean;
  requireCurbRamps: boolean;
  maxGradePercent: number | null;
}

export interface Reason {
  tone: "conflict" | "unknown" | "clear" | "note";
  text: string;
  segmentId?: string;
}

export interface Assessment {
  routeId: string;
  fit: Fit;
  label: string;
  reasons: Reason[];
}

export interface EvidenceCounts {
  confirmed: number;
  community: number;
  unknown: number;
}

export type TripResolution =
  | { kind: "routes"; routes: Route[] }
  | { kind: "outside"; placeName: string }
  | { kind: "no-data" };

export interface StoredReport {
  id: string;
  category: ReportCategory;
  subject: string;
  description: string;
  submittedAt: string;
  status: "pending" | "withdrawn";
}

export interface RecentTrip {
  id: string;
  originLabel: string;
  destinationLabel: string;
  routeName: string;
  fitLabel: string;
  chosenAt: string;
}

export interface ReportDraft {
  category: ReportCategory | "";
  subject: string;
  description: string;
  errors: string[];
}

export interface AppState {
  view: ViewId;
  history: ViewId[];
  preferences: Preferences | null;
  preferencesSaved: boolean;
  originId: string;
  destinationId: string;
  sort: SortMode;
  presentation: Presentation;
  selectedRouteId: string;
  selectedSegmentId: string;
  selectedEntranceId: string;
  textScale: TextScale;
  loading: boolean;
  offline: boolean;
  serviceError: boolean;
  locationNote: string;
  tripError: string;
  notice: string;
  dialog: DialogId;
  report: ReportDraft;
  lastReportId: string;
  chosenRouteId: string;
  returnView: ViewId;
}
