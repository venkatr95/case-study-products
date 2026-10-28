import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

const screens = [
  {
    id: "s01-home",
    code: "S01",
    name: "Home",
    goal: "Choose whether to set access preferences or start a trip.",
    phone: `
      <div class="bar"><strong>AccessPath</strong><span>Seattle sample</span></div>
      <p class="banner">Illustrative sample. Not surveyed measurements.</p>
      <h2>Plan a route around your access needs</h2>
      <div class="card"><span class="call">1</span><strong>Access preferences</strong><p>No access preferences yet.</p></div>
      <div class="btn">Set access preferences</div>
      <div class="card"><span class="call">2</span><strong>Compare a trip</strong><p>Results lead with preference fit, not the shortest walk.</p></div>
      <div class="btn secondary">Enter origin and destination</div>
      <p class="muted">Recent routes: none yet.</p>`,
    notes: [
      "Preferences are required before a comparison. The home screen does not assume a disability profile.",
      "The primary job starts at trip entry. Recent routes appear only after a real choice on this device.",
      "The sample banner stays visible so illustrative Seattle data is not mistaken for a survey.",
    ],
  },
  {
    id: "s02-preferences",
    code: "S02",
    name: "Preference setup",
    goal: "Save stairs, curb-ramp, and steepness settings.",
    phone: `
      <div class="bar"><strong>AccessPath</strong><span>Back</span></div>
      <h2>How should this route treat access?</h2>
      <p>Presets are starting points. Every setting stays editable.</p>
      <div class="choice"><span class="call">1</span><strong>Step-free</strong><p>Avoid stairs. Prefer curb ramps. Grades under 8%.</p></div>
      <div class="choice">Gentle grades — under 5%. Stairs stay off until you turn them on.</div>
      <div class="choice">Stroller or luggage — avoid stairs, slopes under 12%.</div>
      <div class="choice">Custom</div>
      <div class="card"><span class="call">2</span>Avoid stairs · Prefer curb ramps · Under 8%</div>
      <div class="btn">Save preferences</div>
      <div class="btn secondary">Use for this trip only</div>`,
    notes: [
      "FR-01. Saving writes the settings used by the next comparison. Use-for-this-trip does not write the browser store.",
      "Changing a control switches the preset to Custom. Gentle grades does not silently turn on every access control.",
      "Copy avoids a blanket access rating. Unknown details are not treated as step-free.",
    ],
  },
  {
    id: "s03-trip",
    code: "S03",
    name: "Origin and destination",
    goal: "Name the trip that preferences will judge.",
    phone: `
      <div class="bar"><strong>AccessPath</strong><span>Back</span></div>
      <h2>Where are you going?</h2>
      <div class="card"><span class="call">1</span>Step-free · Avoid stairs · Grades under 8%<p>Saved on this device. Edit preferences</p></div>
      <div class="field">Origin<br>Cal Anderson Park — South path</div>
      <div class="btn secondary"><span class="call">2</span>Use current location</div>
      <div class="field">Destination<br>Pike Place Market — First Avenue entrance</div>
      <div class="btn">Compare routes</div>`,
    notes: [
      "Compare stays unavailable until preferences and two different places exist.",
      "Location opens a disclosure first. This prototype fills a sample start and does not read the device.",
      "Choosing the same place, or a place outside the sample, is explained instead of drawing a guessed route.",
    ],
  },
  {
    id: "s04-results",
    code: "S04",
    name: "Route comparison",
    goal: "Compare routes by preference fit and evidence.",
    phone: `
      <div class="bar"><strong>List</strong><span>Map</span></div>
      <h2>Compare routes</h2>
      <p>Cal Anderson Park to Pike Place, First Avenue.</p>
      <p>At least one route matches on confirmed data. That is not a guarantee.</p>
      <div class="card solid"><span class="call">1</span><strong>Matches on confirmed data</strong><p>Madison gentle · About 2.0 mi · About 48 min</p><p>Evidence: confirmed, community-reported, and unknown counted separately.</p></div>
      <div class="card dashed"><strong>Some details are unknown</strong><p>Pike and Seneca · About 1.7 mi · About 41 min</p><p>Grade on Pike Street: unknown. Curb ramp on Seneca: unknown.</p></div>
      <div class="card double"><span class="call">2</span><strong>Conflicts with your preferences</strong><p>Pine Street direct · About 1.2 mi · About 26 min</p><p>Stairs confirmed. Grade about 10%.</p></div>`,
    notes: [
      "FR-02 and FR-03. Default sort is preference fit. Shortest remains available and does not hide conflicts.",
      "The shortest route is last here because confirmed stairs and a 10% grade conflict with step-free settings.",
      "Status uses words plus a solid, dashed, or double rail. Color is not the only signal.",
    ],
  },
  {
    id: "s05-map",
    code: "S05",
    name: "Map and list",
    goal: "Inspect the same evidence on a schematic and in text.",
    phone: `
      <div class="bar"><span>List</span><strong>Map</strong></div>
      <h2>Compare routes</h2>
      <div class="card"><span class="call">1</span><strong>Schematic</strong><p>Solid line: no conflict. Dashed: unknown detail you asked about. Marked: conflict or known barrier.</p><p>Start · three paths · End</p></div>
      <div class="card"><span class="call">2</span><strong>Routes in text</strong><p>The list stays on the page. Highlighting a route thickens its line.</p></div>
      <p class="muted">Essential facts never live only in the drawing.</p>`,
    notes: [
      "The prototype schematic is not a licensed basemap. Segment text is the complete alternative.",
      "On a phone, List hides the drawing and Map shows it above the same list. Wide screens show both.",
      "Line pattern repeats the status, so the drawing can be read without color.",
    ],
  },
  {
    id: "s06-detail",
    code: "S06",
    name: "Route detail",
    goal: "Read every segment before choosing.",
    phone: `
      <h2>Madison gentle</h2>
      <p><strong>Matches on confirmed data</strong></p>
      <p>About 2.0 mi · About 48 min</p>
      <div class="seg"><span class="call">1</span><strong>Union Street</strong><p>No stairs confirmed. Grade about 4%. Curb ramp confirmed.</p></div>
      <div class="seg"><strong>Western Avenue</strong><p>Surface: unknown. Not one of your preferences, so the match still stands.</p></div>
      <div class="card"><span class="call">2</span>Destination entrance: First Avenue. No step confirmed.</div>
      <div class="btn">Choose this route</div>
      <div class="btn secondary">Report a barrier</div>`,
    notes: [
      "FR-04. Every segment has instruction, distance, time, stairs, grade, curb ramp, and surface in text.",
      "An unknown surface is disclosed and does not fail a match when surface is not a selected preference.",
      "Choosing saves a recent trip on this device. The prototype does not start turn-by-turn guidance.",
    ],
  },
  {
    id: "s07-entrance",
    code: "S07",
    name: "Entrance detail",
    goal: "See what is known about a door, without merging reports.",
    phone: `
      <h2>Pike Place Market</h2>
      <p>South arcade entrance</p>
      <div class="card"><span class="call">1</span>Step at the door <strong>Unknown</strong><p>No source is recorded, so this is not treated as step-free.</p></div>
      <div class="card">Door Unknown</div>
      <div class="card">Elevator Unknown</div>
      <p><span class="call">2</span>Reports are listed. They are not merged.</p>
      <div class="card">Pending review · One step at the door. 1 Sep 2026.</div>
      <div class="card">Pending review · A temporary ramp was in place. 2 Oct 2026.</div>`,
    notes: [
      "Conflicting community reports stay side by side with timestamps. Newest does not win.",
      "A missing attribute stays Unknown. The screen does not average the two reports into one answer.",
      "Report a barrier starts from this entrance so the place is already filled in.",
    ],
  },
  {
    id: "s08-report",
    code: "S08",
    name: "Barrier report",
    goal: "Describe a barrier without implying it is verified.",
    phone: `
      <h2>Report a barrier</h2>
      <p>Submitting does not verify the detail.</p>
      <div class="field"><span class="call">1</span>Category<br>Stairs or a step</div>
      <div class="field">Where<br>Pine Street link</div>
      <div class="field">What you found<br>A stairway is in the pedestrian link.</div>
      <div class="btn">Submit report</div>
      <p class="muted"><span class="call">2</span>Stored in this browser only. Offline submission is refused.</p>`,
    notes: [
      "FR-05. Category, place, and a short description are required. Errors are named in text.",
      "The draft explains that other people will not see the report as a confirmed fact.",
      "If the prototype is offline, the draft is kept and nothing is submitted.",
    ],
  },
  {
    id: "s09-status",
    code: "S09",
    name: "Report status",
    goal: "Show pending review as distinct from verified.",
    phone: `
      <h2>Report pending review</h2>
      <p class="banner"><span class="call">1</span>Pending review · 22 Oct 2026, 9:15 a.m.</p>
      <div class="card">Category: Stairs or a step</div>
      <div class="card">Where: Pine Street link</div>
      <p>This report is not verified. Other people will not see it as a confirmed access detail.</p>
      <div class="btn secondary"><span class="call">2</span>Withdraw report</div>
      <p class="muted">A sample verified report lives in Your reports so the two statuses can be compared.</p>`,
    notes: [
      "Pending and verified use different labels. This screen never says the new report was checked.",
      "Withdraw is the undo. The report remains in the list as Withdrawn.",
      "The prototype does not send the report to a moderator. That limit is stated in the body copy.",
    ],
  },
  {
    id: "s10-saved",
    code: "S10",
    name: "Saved preferences",
    goal: "Review, edit, or delete the stored settings.",
    phone: `
      <h2>Saved preferences</h2>
      <div class="card"><span class="call">1</span><strong>Step-free</strong><p>Avoid stairs: On</p><p>Curb ramps: On</p><p>Steepness limit: Under 8%</p></div>
      <div class="btn">Edit preferences</div>
      <div class="btn secondary">Delete preferences</div>
      <p class="muted"><span class="call">2</span>Deleting removes them from this browser only. There is no account.</p>`,
    notes: [
      "FR-06 is implemented as on-device storage, not a signed-in account. The screen says so.",
      "Delete asks for confirmation before clearing the saved set.",
      "An empty state explains that a trip can still use unsaved preferences.",
    ],
  },
  {
    id: "s11-no-match",
    code: "S11",
    name: "No confirmed match",
    goal: "Explain a trip that fails the saved preferences.",
    phone: `
      <h2>Compare routes</h2>
      <p class="banner"><span class="call">1</span>No route matches your preferences on confirmed data.</p>
      <p>Cal Anderson Park to Volunteer Park, upper loop.</p>
      <div class="card double"><strong>Conflicts with your preferences</strong><p>Volunteer Park climb · About 0.8 mi · About 20 min</p><p>Grade about 12%, over the 8% limit. Stairs: unknown.</p></div>
      <div class="btn secondary"><span class="call">2</span>Edit preferences</div>`,
    notes: [
      "FR-01 empty outcome. The conflicting route stays visible so the person can inspect why it failed.",
      "Unknown stairs are still named. The conflict on grade takes the status because a confirmed problem outranks a gap.",
      "The screen does not offer a made-up alternative outside the sample data.",
    ],
  },
  {
    id: "s12-error",
    code: "S12",
    name: "Routing unavailable",
    goal: "Fail without guessing a route.",
    phone: `
      <h2>Route comparison is unavailable</h2>
      <div class="card"><span class="call">1</span>The sample routing service did not return a trip.</div>
      <p>AccessPath did not substitute a shorter route or guess that a path is step-free.</p>
      <div class="btn"><span class="call">2</span>Try again</div>`,
    notes: [
      "The error is specific. It does not show a spinner forever or a blank map.",
      "Retry runs the same trip again. Offline and error can be cleared from the prototype controls.",
      "No route card is rendered in this state.",
    ],
  },
  {
    id: "s13-offline",
    code: "S13",
    name: "Offline",
    goal: "Say what still works without a connection.",
    phone: `
      <h2>You're offline</h2>
      <div class="card"><span class="call">1</span>Route comparison needs a connection in this prototype.</div>
      <p>Saved preferences on this device are still available. No route was guessed.</p>
      <div class="btn secondary">Review saved preferences</div>
      <p class="muted"><span class="call">2</span>A barrier report can be drafted, not submitted.</p>`,
    notes: [
      "Offline blocks new comparisons and new submissions.",
      "Saved preferences remain readable because they are stored in the browser.",
      "The message refuses to invent a path while the network is gone.",
    ],
  },
  {
    id: "s14-location",
    code: "S14",
    name: "Location disclosure",
    goal: "Ask before filling a start place.",
    phone: `
      <h2>Where are you going?</h2>
      <div class="card"><strong>Use location for the start place?</strong>
        <p><span class="call">1</span>A production app would use location only to fill the start of this trip.</p>
        <p>This prototype does not read or upload your device location. Continuing fills a sample start near Cal Anderson Park.</p>
        <div class="btn">Use sample start</div>
        <div class="btn secondary"><span class="call">2</span>Not now</div>
      </div>`,
    notes: [
      "The disclosure appears before any location control. Not now leaves the origin empty and says location stays off.",
      "Allow fills a labeled sample point. It does not call the Geolocation API.",
      "Focus moves into the dialog, and Escape dismisses it.",
    ],
  },
  {
    id: "s15-loading",
    code: "S15",
    name: "Loading",
    goal: "Show that comparison is in progress.",
    phone: `
      <h2>Comparing routes</h2>
      <p class="banner"><span class="call">1</span>Comparing routes for your preferences…</p>
      <p class="muted">The status is text, not a spinner alone. Reduced motion skips the delay.</p>`,
    notes: [
      "Loading replaces the route list. It does not flash a previous trip's routes.",
      "The delay is 500 milliseconds in the prototype, or none when reduced motion is requested.",
      "Failure after loading becomes the routing-unavailable or offline screen.",
    ],
  },
];

function page(screen) {
  const notes = screen.notes.map((note) => `<li>${note}</li>`).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${screen.code} ${screen.name} — AccessPath wireframe</title>
  <link rel="stylesheet" href="wireframes.css">
</head>
<body>
  <article class="board">
    <div class="phone">${screen.phone}</div>
    <div class="meta">
      <p class="kicker">${screen.code} · Low fidelity · 360 × 680 phone frame</p>
      <h1>${screen.name}</h1>
      <p><strong>User goal.</strong> ${screen.goal}</p>
      <ol class="notes">${notes}</ol>
    </div>
  </article>
</body>
</html>`;
}

await mkdir(join(root, "frames"), { recursive: true });
const links = [];
for (const screen of screens) {
  const file = `${screen.id}.html`;
  await writeFile(join(root, file), page(screen));
  links.push(`<li><a href="${file}">${screen.code} ${screen.name}</a></li>`);
}
await writeFile(
  join(root, "index.html"),
  `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>AccessPath wireframes</title></head><body><h1>AccessPath low-fidelity wireframes</h1><p>Grayscale frames for the Seattle sample. Open a frame for the annotated board.</p><ul>${links.join("")}</ul></body></html>`,
);
console.log(`Wrote ${screens.length} wireframe boards.`);
