/** User-facing strings. Status labels live in evaluate.ts so tests can allow-list them. */

export const copy = {
  product: "AccessPath",
  tagline: "Routes for how you move.",
  sampleBanner:
    "Illustrative Seattle sample. Distances, grades, and sources are not surveyed measurements.",
  pilotChip: "Seattle sample",
  noBlanket:
    "AccessPath does not give a route a blanket access rating. A match only means the details you asked about are confirmed and within your settings.",
  notGuarantee:
    "A match is not a guarantee that the path is barrier-free.",
  unknownRule:
    "Unknown means we have no data. AccessPath does not treat a missing detail as step-free, level, or open.",
  communityRule:
    "A community report is not a confirmation. It stays pending until a reviewer checks it, and it never upgrades an unknown detail to confirmed.",
  locationBody:
    "A production app would use your location only to fill the start of this trip, then keep the point for that plan. This prototype does not read or upload your device location. Continuing fills a sample start near Cal Anderson Park.",
  locationDeny: "Location stays off. Type a start place.",
  offlineTitle: "You're offline",
  offlineBody:
    "Route comparison needs a connection in this prototype. Saved preferences on this device are still available. No route was guessed.",
  errorTitle: "Route comparison is unavailable",
  errorBody:
    "The sample routing service did not return a trip. AccessPath did not substitute a shorter route or guess that a path is step-free.",
  outsideTitle: "No pilot data for this trip",
  noDataTitle: "No compared route for this pair",
  noDataBody:
    "This sample only includes a few Capitol Hill and downtown trips. That is not a claim that the walk is impossible.",
  reportPendingTitle: "Report pending review",
  reportPendingBody:
    "This report is not verified. Other people will not see it as a confirmed access detail. Status can change to Verified only after review. This prototype does not send the report to a moderator.",
  reportWithdrawnBody:
    "You withdrew this report. It stays in your list so you can see the status change. It will not be reviewed.",
  chooseNote:
    "Chosen for this trip and saved to recent trips on this device. AccessPath does not start turn-by-turn guidance.",
  deletePrefs:
    "Delete saved preferences? Routes you compare after this will not use them until you save a new set. This only affects this browser.",
  withdrawConfirm:
    "Withdraw this report? It stays in your list as withdrawn. It will not be reviewed.",
  evidenceHelp: {
    confirmed: "Confirmed: a named sample source includes this detail and a date.",
    community:
      "Community-reported: a person reported this. The review status is shown. It is not treated as confirmed.",
    unknown: "Unknown: the detail is missing. It is not assumed to be fine.",
  },
} as const;
