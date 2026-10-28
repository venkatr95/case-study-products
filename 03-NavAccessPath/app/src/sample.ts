import type {
  Entrance,
  Place,
  Route,
  Segment,
  Sourced,
  TripResolution,
} from "./types.js";

/**
 * Illustrative Seattle pilot data for the portfolio prototype.
 * Grades, distances, curb ramps, and source names are invented sample values.
 * They are not measurements from AccessMap, the City of Seattle, or a venue.
 */

const REVIEWED = "2026-08-14T12:00:00-07:00";
const SOURCE = "Sample sidewalk review";

function confirmed<T>(value: T, source = SOURCE, updated = REVIEWED): Sourced<T> {
  return { value, evidence: "confirmed", source, updated };
}

function unknown<T>(): Sourced<T> {
  return { value: null, evidence: "unknown" };
}

export const places: Place[] = [
  {
    id: "cal-anderson",
    name: "Cal Anderson Park",
    detail: "South path, 11th Ave",
    area: "Capitol Hill",
    inPilot: true,
  },
  {
    id: "pike-first",
    name: "Pike Place Market",
    detail: "First Avenue entrance",
    area: "Downtown",
    inPilot: true,
  },
  {
    id: "pike-south",
    name: "Pike Place Market",
    detail: "South arcade entrance",
    area: "Downtown",
    inPilot: true,
  },
  {
    id: "library",
    name: "Seattle Central Library",
    detail: "Fourth Avenue entrance",
    area: "Downtown",
    inPilot: true,
  },
  {
    id: "capitol-hill-station",
    name: "Capitol Hill Station",
    detail: "Broadway entrance",
    area: "Capitol Hill",
    inPilot: true,
  },
  {
    id: "volunteer",
    name: "Volunteer Park",
    detail: "Upper loop path",
    area: "Capitol Hill",
    inPilot: true,
  },
  {
    id: "bainbridge",
    name: "Bainbridge ferry terminal",
    detail: "Outside this sample",
    area: "Bainbridge Island",
    inPilot: false,
  },
];

export const segments: Segment[] = [
  {
    id: "denny",
    name: "Denny Way hill",
    instruction: "Head west on Denny Way from the south path.",
    distanceMeters: 480,
    minutes: 6,
    stairs: confirmed(false),
    gradePercent: confirmed(10),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 8, y1: 18, x2: 30, y2: 12 },
  },
  {
    id: "melrose",
    name: "Melrose Avenue",
    instruction: "Turn south on Melrose Avenue.",
    distanceMeters: 320,
    minutes: 5,
    stairs: unknown(),
    gradePercent: confirmed(4),
    curbRamp: unknown(),
    surface: unknown(),
    barriers: [],
    line: { x1: 30, y1: 12, x2: 48, y2: 20 },
  },
  {
    id: "pine-link",
    name: "Pine Street link",
    instruction: "Take the Pine Street pedestrian link toward downtown.",
    distanceMeters: 800,
    minutes: 11,
    stairs: confirmed(true),
    gradePercent: confirmed(3),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 48, y1: 20, x2: 74, y2: 16 },
  },
  {
    id: "first-approach",
    name: "First Avenue approach",
    instruction: "Continue to the First Avenue entrance.",
    distanceMeters: 331,
    minutes: 4,
    stairs: confirmed(false),
    gradePercent: confirmed(2),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 74, y1: 16, x2: 92, y2: 28 },
  },
  {
    id: "eleventh",
    name: "11th Avenue",
    instruction: "Go south on 11th Avenue toward Pike Street.",
    distanceMeters: 700,
    minutes: 10,
    stairs: confirmed(false),
    gradePercent: confirmed(6),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 8, y1: 36, x2: 32, y2: 34 },
  },
  {
    id: "pike-st",
    name: "Pike Street",
    instruction: "Head west on Pike Street.",
    distanceMeters: 1100,
    minutes: 16,
    stairs: confirmed(false),
    gradePercent: unknown(),
    curbRamp: confirmed(true),
    surface: unknown(),
    barriers: [
      {
        id: "bricks",
        category: "surface",
        summary: "Uneven bricks near 3rd Avenue. Not verified.",
        evidence: "community",
        status: "pending",
        updated: "2026-10-18T15:04:00-07:00",
        source: "Community report",
      },
    ],
    line: { x1: 32, y1: 34, x2: 62, y2: 40 },
  },
  {
    id: "seneca",
    name: "Seneca Street",
    instruction: "Continue on Seneca Street.",
    distanceMeters: 600,
    minutes: 9,
    stairs: confirmed(false),
    gradePercent: confirmed(3),
    curbRamp: unknown(),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 62, y1: 40, x2: 80, y2: 36 },
  },
  {
    id: "first-seneca",
    name: "First Avenue from Seneca",
    instruction: "Turn onto First Avenue and continue to the entrance.",
    distanceMeters: 336,
    minutes: 6,
    stairs: confirmed(false),
    gradePercent: confirmed(2),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 80, y1: 36, x2: 92, y2: 28 },
  },
  {
    id: "union",
    name: "Union Street",
    instruction: "Leave the park south, then head west on Union Street.",
    distanceMeters: 800,
    minutes: 12,
    stairs: confirmed(false),
    gradePercent: confirmed(4),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 8, y1: 54, x2: 34, y2: 52 },
  },
  {
    id: "minor",
    name: "Minor Avenue",
    instruction: "Go south on Minor Avenue.",
    distanceMeters: 700,
    minutes: 10,
    stairs: confirmed(false),
    gradePercent: confirmed(3),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 34, y1: 52, x2: 52, y2: 58 },
  },
  {
    id: "madison",
    name: "Madison Street",
    instruction: "Head west on Madison Street.",
    distanceMeters: 900,
    minutes: 14,
    stairs: confirmed(false),
    gradePercent: confirmed(4),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 52, y1: 58, x2: 76, y2: 50 },
  },
  {
    id: "western",
    name: "Western Avenue",
    instruction: "Finish north along Western Avenue to the entrance.",
    distanceMeters: 819,
    minutes: 12,
    stairs: confirmed(false),
    gradePercent: confirmed(2),
    curbRamp: confirmed(true),
    surface: unknown(),
    barriers: [],
    line: { x1: 76, y1: 50, x2: 92, y2: 28 },
  },
  {
    id: "station-elevator",
    name: "Broadway elevator",
    instruction: "Leave the station by the Broadway elevator, then walk to the library.",
    distanceMeters: 1448,
    minutes: 22,
    stairs: confirmed(false),
    gradePercent: confirmed(1),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 10, y1: 24, x2: 88, y2: 40 },
  },
  {
    id: "broadway-surface",
    name: "Broadway surface street",
    instruction: "Use the Broadway street exit and stay on the surface streets to Fourth Avenue.",
    distanceMeters: 2253,
    minutes: 34,
    stairs: confirmed(false),
    gradePercent: confirmed(7),
    curbRamp: confirmed(true),
    surface: confirmed("Concrete"),
    barriers: [],
    line: { x1: 10, y1: 46, x2: 88, y2: 56 },
  },
  {
    id: "volunteer-climb",
    name: "Volunteer Park climb",
    instruction: "Head north and climb toward the upper loop path.",
    distanceMeters: 1287,
    minutes: 20,
    stairs: unknown(),
    gradePercent: confirmed(12),
    curbRamp: confirmed(true),
    surface: unknown(),
    barriers: [],
    line: { x1: 12, y1: 58, x2: 86, y2: 16 },
  },
];

export const entrances: Entrance[] = [
  {
    id: "pike-first",
    placeId: "pike-first",
    name: "First Avenue entrance",
    stepFree: confirmed(true, "Sample venue note", "2026-08-14T12:00:00-07:00"),
    door: confirmed("About 36 inches clear. Sample figure.", "Sample venue note", "2026-08-14T12:00:00-07:00"),
    elevator: unknown(),
    reports: [],
  },
  {
    id: "pike-south",
    placeId: "pike-south",
    name: "South arcade entrance",
    stepFree: unknown(),
    door: unknown(),
    elevator: unknown(),
    reports: [
      {
        id: "south-step",
        summary: "One step at the door.",
        evidence: "community",
        status: "pending",
        updated: "2026-09-01T11:20:00-07:00",
        source: "Community report",
      },
      {
        id: "south-ramp",
        summary: "A temporary ramp was in place.",
        evidence: "community",
        status: "pending",
        updated: "2026-10-02T16:05:00-07:00",
        source: "Community report",
      },
    ],
  },
  {
    id: "library-4th",
    placeId: "library",
    name: "Fourth Avenue entrance",
    stepFree: confirmed(true, "Sample venue note", "2026-07-02T12:00:00-07:00"),
    door: confirmed("Power door. Sample note.", "Sample venue note", "2026-07-02T12:00:00-07:00"),
    elevator: unknown(),
    reports: [],
  },
  {
    id: "station-broadway",
    placeId: "capitol-hill-station",
    name: "Broadway entrance",
    stepFree: confirmed(true, "Sample transit feed", "2026-10-22T07:40:00-07:00"),
    door: unknown(),
    elevator: {
      value: false,
      evidence: "confirmed",
      source: "Sample transit feed",
      updated: "2026-10-22T07:40:00-07:00",
    },
    reports: [],
  },
  {
    id: "volunteer-loop",
    placeId: "volunteer",
    name: "Upper loop path",
    stepFree: unknown(),
    door: unknown(),
    elevator: unknown(),
    reports: [],
  },
  {
    id: "cal-anderson-south",
    placeId: "cal-anderson",
    name: "South path",
    stepFree: confirmed(true),
    door: unknown(),
    elevator: unknown(),
    reports: [],
  },
];

export const routes: Route[] = [
  {
    id: "pine",
    name: "Pine Street direct",
    distanceMeters: 1931,
    minutes: 26,
    segmentIds: ["denny", "melrose", "pine-link", "first-approach"],
    entranceId: "pike-first",
  },
  {
    id: "pike-seneca",
    name: "Pike and Seneca",
    distanceMeters: 2736,
    minutes: 41,
    segmentIds: ["eleventh", "pike-st", "seneca", "first-seneca"],
    entranceId: "pike-first",
  },
  {
    id: "madison",
    name: "Madison gentle",
    distanceMeters: 3219,
    minutes: 48,
    segmentIds: ["union", "minor", "madison", "western"],
    entranceId: "pike-first",
  },
  {
    id: "station-elevator",
    name: "Station elevator",
    distanceMeters: 1448,
    minutes: 22,
    segmentIds: ["station-elevator"],
    entranceId: "library-4th",
    serviceAlert: {
      summary: "Broadway elevator out of service.",
      source: "Sample transit feed",
      updated: "2026-10-22T07:40:00-07:00",
      illustrative: true,
    },
  },
  {
    id: "broadway-surface",
    name: "Broadway surface",
    distanceMeters: 2253,
    minutes: 34,
    segmentIds: ["broadway-surface"],
    entranceId: "library-4th",
  },
  {
    id: "volunteer-climb",
    name: "Volunteer Park climb",
    distanceMeters: 1287,
    minutes: 20,
    segmentIds: ["volunteer-climb"],
    entranceId: "volunteer-loop",
  },
];

const TRIPS: Record<string, string[]> = {
  "cal-anderson>pike-first": ["pine", "pike-seneca", "madison"],
  "capitol-hill-station>library": ["station-elevator", "broadway-surface"],
  "cal-anderson>volunteer": ["volunteer-climb"],
};

export function placeById(id: string): Place | undefined {
  return places.find((place) => place.id === id);
}

export function placeLabelFor(id: string): string {
  if (id === "sample-location") return SAMPLE_ORIGIN_LABEL;
  const place = placeById(id);
  if (!place) return "Chosen place";
  return `${place.name}, ${place.detail}`;
}

export function entranceById(id: string): Entrance | undefined {
  return entrances.find((entrance) => entrance.id === id);
}

export function segmentById(id: string): Segment | undefined {
  return segments.find((segment) => segment.id === id);
}

export function routeById(id: string): Route | undefined {
  return routes.find((route) => route.id === id);
}

export function segmentsFor(route: Route): Segment[] {
  return route.segmentIds
    .map((id) => segmentById(id))
    .filter((segment): segment is Segment => Boolean(segment));
}

export function resolveTrip(originId: string, destinationId: string): TripResolution {
  const origin = placeById(originId);
  const destination = placeById(destinationId);
  if (!origin || !destination) return { kind: "no-data" };
  if (!origin.inPilot || !destination.inPilot) {
    return { kind: "outside", placeName: destination.inPilot ? origin.name : destination.name };
  }
  const ids = TRIPS[`${originId}>${destinationId}`];
  if (!ids) return { kind: "no-data" };
  const found = ids
    .map((id) => routeById(id))
    .filter((route): route is Route => Boolean(route));
  return { kind: "routes", routes: found };
}

export function routingPlaceId(originId: string): string {
  return originId === "sample-location" ? "cal-anderson" : originId;
}

export const SAMPLE_ORIGIN_LABEL = "Current location sample, near Cal Anderson Park";

export const reportCategories: { id: Segment["barriers"][number]["category"]; label: string }[] = [
  { id: "stairs", label: "Stairs or a step" },
  { id: "steep-grade", label: "Steep segment" },
  { id: "missing-curb", label: "Missing curb ramp" },
  { id: "blocked-sidewalk", label: "Blocked sidewalk" },
  { id: "elevator-outage", label: "Elevator outage" },
  { id: "entrance-step", label: "Entrance step" },
  { id: "surface", label: "Uneven or broken surface" },
  { id: "other", label: "Something else" },
];
