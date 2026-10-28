import type {
  AppState,
  Preferences,
  RecentTrip,
  ReportCategory,
  StoredReport,
  TextScale,
} from "./types.js";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const KEYS = {
  preferences: "accesspath.preferences.v1",
  reports: "accesspath.reports.v1",
  recent: "accesspath.recent.v1",
  text: "accesspath.text-scale.v1",
} as const;

export function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

export function browserStorage(): StorageLike {
  return window.localStorage;
}

function readJson<T>(storage: StorageLike, key: string): T | null {
  const raw = storage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadPreferences(storage: StorageLike): Preferences | null {
  const parsed = readJson<Preferences>(storage, KEYS.preferences);
  if (!parsed) return null;
  if (typeof parsed.avoidStairs !== "boolean") return null;
  if (typeof parsed.requireCurbRamps !== "boolean") return null;
  if (parsed.maxGradePercent !== null && typeof parsed.maxGradePercent !== "number") return null;
  return parsed;
}

export function savePreferences(storage: StorageLike, prefs: Preferences): void {
  storage.setItem(KEYS.preferences, JSON.stringify(prefs));
}

export function clearPreferences(storage: StorageLike): void {
  storage.removeItem(KEYS.preferences);
}

export function loadReports(storage: StorageLike): StoredReport[] {
  const parsed = readJson<StoredReport[]>(storage, KEYS.reports);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveReports(storage: StorageLike, reports: StoredReport[]): void {
  storage.setItem(KEYS.reports, JSON.stringify(reports));
}

export function validateReport(input: {
  category: ReportCategory | "";
  subject: string;
  description: string;
}): string[] {
  const errors: string[] = [];
  if (!input.category) errors.push("Choose a report category.");
  if (!input.subject.trim()) errors.push("Choose where you found the barrier.");
  if (input.description.trim().length < 12) {
    errors.push("Describe what you found in at least a short sentence.");
  }
  return errors;
}

export function submitReport(
  storage: StorageLike,
  input: { category: ReportCategory; subject: string; description: string; submittedAt: string; id: string },
): StoredReport {
  const report: StoredReport = {
    id: input.id,
    category: input.category,
    subject: input.subject,
    description: input.description.trim(),
    submittedAt: input.submittedAt,
    status: "pending",
  };
  const reports = loadReports(storage);
  reports.unshift(report);
  saveReports(storage, reports);
  return report;
}

export function withdrawReport(storage: StorageLike, id: string): StoredReport | null {
  const reports = loadReports(storage);
  const report = reports.find((item) => item.id === id);
  if (!report) return null;
  report.status = "withdrawn";
  saveReports(storage, reports);
  return report;
}

export function loadRecent(storage: StorageLike): RecentTrip[] {
  const parsed = readJson<RecentTrip[]>(storage, KEYS.recent);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveRecent(storage: StorageLike, recent: RecentTrip[]): void {
  storage.setItem(KEYS.recent, JSON.stringify(recent.slice(0, 5)));
}

export function addRecent(storage: StorageLike, trip: RecentTrip): void {
  const recent = loadRecent(storage).filter((item) => item.id !== trip.id);
  recent.unshift(trip);
  saveRecent(storage, recent);
}

export function removeRecent(storage: StorageLike, id: string): void {
  saveRecent(
    storage,
    loadRecent(storage).filter((item) => item.id !== id),
  );
}

export function loadTextScale(storage: StorageLike): TextScale {
  const value = storage.getItem(KEYS.text);
  if (value === "125" || value === "150" || value === "100") return value;
  return "100";
}

export function saveTextScale(storage: StorageLike, scale: TextScale): void {
  storage.setItem(KEYS.text, scale);
}

export function clearDemoData(storage: StorageLike): void {
  clearPreferences(storage);
  storage.removeItem(KEYS.reports);
  storage.removeItem(KEYS.recent);
}

export function createState(partial: Partial<AppState> = {}): AppState {
  return {
    view: "home",
    history: [],
    preferences: null,
    preferencesSaved: false,
    originId: "",
    destinationId: "",
    sort: "fit",
    presentation: "list",
    selectedRouteId: "",
    selectedSegmentId: "",
    selectedEntranceId: "",
    textScale: "100",
    loading: false,
    offline: false,
    serviceError: false,
    locationNote: "",
    tripError: "",
    notice: "",
    dialog: "none",
    report: { category: "", subject: "", description: "", errors: [] },
    lastReportId: "",
    chosenRouteId: "",
    returnView: "detail",
    ...partial,
  };
}
