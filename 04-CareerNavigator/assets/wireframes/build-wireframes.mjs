import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
mkdirSync(dir, { recursive: true });

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function wrap(text, max) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function screen({ file, id, title, blocks, notes }) {
  const x0 = 56;
  const boxW = 340;
  const center = x0 + boxW / 2;
  const draw = [];
  let y = 168;
  const text = (x, yy, value, size, weight, fill, anchor = "start") => {
    draw.push(
      `<text x="${x}" y="${yy}" font-family="Segoe UI, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`,
    );
  };
  const serif = (x, yy, value, size) => {
    draw.push(
      `<text x="${x}" y="${yy}" font-family="Georgia, serif" font-size="${size}" fill="#111">${esc(value)}</text>`,
    );
  };
  for (const block of blocks) {
    if (block.kind === "gap") {
      y += block.n;
      continue;
    }
    if (block.kind === "kicker") {
      text(x0, y, block.text, 12, 700, "#333");
      y += 22;
    } else if (block.kind === "h1") {
      for (const line of wrap(block.text, 28)) {
        serif(x0, y, line, 24);
        y += 30;
      }
      y += 6;
    } else if (block.kind === "p" || block.kind === "meta") {
      const size = block.kind === "meta" ? 12 : 14;
      for (const line of wrap(block.text, block.kind === "meta" ? 48 : 42)) {
        text(x0, y, line, size, 400, "#222");
        y += size + 6;
      }
      y += 6;
    } else if (block.kind === "button" || block.kind === "ghost") {
      const fill = block.kind === "button" ? "#222" : "#fff";
      const color = block.kind === "button" ? "#fff" : "#111";
      draw.push(`<rect x="${x0}" y="${y}" width="${boxW}" height="44" rx="22" fill="${fill}" stroke="#222"/>`);
      text(center, y + 28, block.text, 15, 600, color, "middle");
      y += 56;
    } else if (block.kind === "card" || block.kind === "banner") {
      const lines = [];
      for (const item of block.lines) lines.push(...wrap(item, 40));
      const height = 18 + lines.length * 20;
      draw.push(`<rect x="${x0}" y="${y}" width="${boxW}" height="${height}" rx="10" fill="${block.kind === "banner" ? "#f3f3f1" : "#fff"}" stroke="#999"/>`);
      lines.forEach((line, index) => text(x0 + 12, y + 24 + index * 20, line, 13, index === 0 ? 700 : 400, "#222"));
      y += height + 12;
    } else if (block.kind === "field") {
      text(x0, y, block.label, 13, 700, "#222");
      y += 8;
      draw.push(`<rect x="${x0}" y="${y}" width="${boxW}" height="40" rx="8" fill="#fff" stroke="#999"/>`);
      text(x0 + 12, y + 26, block.value, 13, 400, "#555");
      y += 56;
    } else if (block.kind === "chips") {
      let x = x0;
      for (const chip of block.items) {
        const w = chip.length * 7 + 18;
        draw.push(`<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="#eee" stroke="#999"/>`);
        text(x + 9, y + 18, chip, 12, 600, "#222");
        x += w + 8;
      }
      y += 40;
    }
  }
  const phoneH = Math.max(844, y + 28);
  const canvasH = Math.max(980, phoneH + 150);
  const noteLines = notes.flatMap((note) => wrap(note, 48));
  const notesDraw = noteLines
    .map((line, index) => `<text x="470" y="${150 + index * 22}" font-family="Segoe UI, sans-serif" font-size="15" fill="#222">${esc(line)}</text>`)
    .join("");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="${canvasH}" viewBox="0 0 1120 ${canvasH}" role="img">
<title>${esc(id)} ${esc(title)}</title>
<rect width="1120" height="${canvasH}" fill="#f4f4f1"/>
<text x="36" y="42" font-family="Segoe UI, sans-serif" font-size="14" fill="#555">${esc(id)} · grayscale wireframe · 390 × ${phoneH}</text>
<text x="36" y="72" font-family="Segoe UI, sans-serif" font-size="22" font-weight="700" fill="#1c1c1c">${esc(title)}</text>
<rect x="36" y="92" width="390" height="${phoneH}" rx="28" fill="#fff" stroke="#222" stroke-width="3"/>
<text x="64" y="124" font-family="Georgia, serif" font-size="16" fill="#111">SkillBridge</text>
${draw.join("\n")}
<text x="470" y="120" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#111">Annotations</text>
${notesDraw}
<text x="36" y="${canvasH - 28}" font-family="Segoe UI, sans-serif" font-size="13" fill="#555">Responsive: one column under 720px. Primary navigation wraps. Touch targets are 44px. No match-score graphic.</text>
</svg>`;
  writeFileSync(join(dir, file), svg, "utf8");
}

const screens = [
  {
    file: "wf-01-welcome.svg",
    id: "WF-01",
    title: "Welcome — guidance, not a prediction",
    blocks: [
      { kind: "kicker", text: "Career navigator" },
      { kind: "h1", text: "Turn the skills you already have into a clear path to your next role." },
      { kind: "p", text: "Compare skills you choose to enter with a role profile, then keep a few small actions." },
      { kind: "banner", lines: ["What this is not", "Not a hiring, pay, or interview prediction.", "Not a tool for ranking candidates."] },
      { kind: "button", text: "Choose a role" },
      { kind: "ghost", text: "Explore with Maya's sample" },
      { kind: "meta", text: "Maya Chen is fictional. Sample data stays in this browser." },
    ],
    notes: [
      "1. The limit is visible before any comparison.",
      "2. There is no score, gauge, or hireability label.",
      "3. The sample is optional and named as fiction.",
      "4. Covers the release check that users can proceed without a resume.",
      "5. Screen S-01. Requirements: trust labeling, FR-03 framing.",
    ],
  },
  {
    file: "wf-02-goals.svg",
    id: "WF-02",
    title: "Choose a role",
    blocks: [
      { kind: "kicker", text: "Step 1 · Goal" },
      { kind: "h1", text: "Choose a role to explore" },
      { kind: "p", text: "Four roles are in customer, operations, and coordination work. Junior data analyst is a larger jump." },
      { kind: "card", lines: ["Product operations associate", "Keep requests, handoffs, and a weekly count moving.", "Read the profile    Use this role"] },
      { kind: "card", lines: ["Customer success associate", "Help a customer get value and leave a clear note.", "Read the profile    Use this role"] },
      { kind: "card", lines: ["Describe a role that is not listed", "Role name", "What the work is, in one sentence", "Save this role"] },
    ],
    notes: [
      "1. The role family is explicit. Profiles are labeled illustrative.",
      "2. People can read a profile before committing. FR-01.",
      "3. A custom role is allowed when the five profiles miss.",
      "4. The larger-jump role warns that many gaps are not a verdict.",
      "5. Screen S-02.",
    ],
  },
  {
    file: "wf-03-role-profile.svg",
    id: "WF-03",
    title: "Role profile with source",
    blocks: [
      { kind: "kicker", text: "Your goal" },
      { kind: "h1", text: "Product operations associate" },
      { kind: "meta", text: "Customer, operations, and coordination" },
      { kind: "banner", lines: ["Where this profile comes from", "Illustrative profile written 22 Oct 2026.", "Not an O*NET occupation or an employer posting.", "Last updated 22 Oct 2026."] },
      { kind: "card", lines: ["Stakeholder updates · Core", "The work breaks when a handoff is silent.", "From the illustrative profile."] },
      { kind: "card", lines: ["Requirements briefs · Core", "Requests arrive messy. The role makes them decidable."] },
      { kind: "button", text: "Compare with my skills" },
      { kind: "ghost", text: "Edit this profile" },
    ],
    notes: [
      "1. Source and date are on the profile, not in a footnote. FR-01.",
      "2. Core and supporting are words, not weights.",
      "3. Edit lets a person hide or add a requirement. FR-03 stays editable.",
      "4. Screen S-03. Edit is S-04.",
    ],
  },
  {
    file: "wf-04-skills.svg",
    id: "WF-04",
    title: "Skills inventory",
    blocks: [
      { kind: "kicker", text: "Step 2 · Skills you already have" },
      { kind: "h1", text: "Your skills" },
      { kind: "p", text: "Proficiency and confidence are self-assessments. You can revise or remove either." },
      { kind: "card", lines: ["Scheduling", "Comfortable. I do the routine work.", "Confidence: High. I can point to recent work.", "Example: I build the weekly floor schedule.", "You entered this.", "Edit     Remove"] },
      { kind: "button", text: "Add a skill" },
      { kind: "ghost", text: "Paste resume text" },
    ],
    notes: [
      "1. The list leads with what the person already claims. FR-02.",
      "2. Confidence is separate from proficiency, so a guess is not treated as a match.",
      "3. Resume import is optional and secondary.",
      "4. Remove is available on every skill.",
      "5. Screen S-05.",
    ],
  },
  {
    file: "wf-05-add-skill.svg",
    id: "WF-05",
    title: "Add or edit a skill",
    blocks: [
      { kind: "h1", text: "Add a skill" },
      { kind: "p", text: "This is your description of your own experience. It is not a test result." },
      { kind: "field", label: "Skill", value: "Spreadsheets" },
      { kind: "card", lines: ["What you can do", "Exploring  ·  Practicing", "Comfortable  ·  Strong"] },
      { kind: "card", lines: ["How sure you are", "Low  ·  Medium  ·  High"] },
      { kind: "field", label: "Where have you used this?", value: "Optional example" },
      { kind: "button", text: "Save skill" },
      { kind: "ghost", text: "Cancel" },
    ],
    notes: [
      "1. Both self-assessment questions are required. FR-02.",
      "2. Hints define the words so they are not a hidden rubric.",
      "3. A skill that is not listed can be named, with a one-sentence definition.",
      "4. Screen S-06.",
    ],
  },
  {
    file: "wf-06-import.svg",
    id: "WF-06",
    title: "Paste resume text",
    blocks: [
      { kind: "kicker", text: "Optional" },
      { kind: "h1", text: "Paste resume text" },
      { kind: "p", text: "Suggestions can be wrong. Nothing is saved until you check the skills that are true." },
      { kind: "meta", text: "Phone numbers and addresses are not needed. The paste stays in this tab only." },
      { kind: "field", label: "Resume text", value: "Paste one resume" },
      { kind: "button", text: "Review suggestions" },
      { kind: "ghost", text: "Use the practice resume" },
    ],
    notes: [
      "1. Import is a review step, not an automatic profile. FR-06.",
      "2. Raw paste is not written to saved data.",
      "3. The practice resume is fictional and disclosed.",
      "4. No file upload in this prototype.",
      "5. Screen S-07.",
    ],
  },
  {
    file: "wf-07-import-review.svg",
    id: "WF-07",
    title: "Review suggestions before saving",
    blocks: [
      { kind: "h1", text: "Check the skills that are true" },
      { kind: "p", text: "Each suggestion starts at Practicing, with low confidence. Unchecked skills are discarded." },
      { kind: "card", lines: ["[ ] Scheduling", "Found: I build the weekly floor schedule", "Suggested from pasted text. Not saved yet.", "Proficiency: Practicing", "Confidence: Low"] },
      { kind: "card", lines: ["[ ] Customer conversations", "Found: I talk with customers about returns", "Not saved until you check it."] },
      { kind: "button", text: "Add the skills I checked" },
      { kind: "ghost", text: "Delete pasted text" },
      { kind: "meta", text: "The save button stays off until one skill is checked." },
    ],
    notes: [
      "1. Nothing is pre-checked. Confirmation is the save. FR-06.",
      "2. The matched sentence is shown, so a bad guess can be rejected.",
      "3. Defaults admit uncertainty: practicing and low confidence.",
      "4. Delete discards the paste in this tab.",
      "5. Screen S-08.",
    ],
  },
  {
    file: "wf-08-comparison.svg",
    id: "WF-08",
    title: "Skill comparison without a score",
    blocks: [
      { kind: "kicker", text: "Product operations associate" },
      { kind: "h1", text: "Comparison" },
      { kind: "banner", lines: ["Guidance, not a hiring prediction", "This compares what you entered with a role profile.", "There is no match score."] },
      { kind: "p", text: "You listed 7 skills. 1 matches this profile and 2 are partial. 4 skills you listed are not in this profile, and they still count." },
      { kind: "meta", text: "Of 6 core skills: 0 matched, 2 partial, 4 not in your list yet." },
      { kind: "chips", items: ["All", "Core", "Partial", "Other"] },
      { kind: "card", lines: ["Stakeholder updates", "Not in your list · Core", "You have not added this skill.", "See why and what to do"] },
      { kind: "card", lines: ["Customer conversations", "Matched · Supporting", "You marked strong, confidence high."] },
      { kind: "card", lines: ["In your list, not in this profile", "Scheduling · Comfortable. These still count."] },
      { kind: "button", text: "Review a small plan" },
    ],
    notes: [
      "1. Counts are sentences. There is no percentage. FR-03 and the guardrail.",
      "2. Matched, partial, and missing use words plus a mark, not color alone.",
      "3. Skills outside the profile are framed as experience, not failures.",
      "4. An empty skill list does not render a wall of gaps. See WF-14.",
      "5. Screen S-09.",
    ],
  },
  {
    file: "wf-09-gap.svg",
    id: "WF-09",
    title: "Why a gap matters",
    blocks: [
      { kind: "kicker", text: "Product operations associate" },
      { kind: "h1", text: "Stakeholder updates" },
      { kind: "chips", items: ["Not in your list"] },
      { kind: "p", text: "This skill is not in your list yet. Add it if you already do it." },
      { kind: "card", lines: ["Why it is in the profile", "The work breaks when people who depend on a handoff do not hear what changed."] },
      { kind: "card", lines: ["A small way to practice", "Write one five-line update: status, change, blocker, ask, next check-in."] },
      { kind: "button", text: "Add this skill" },
      { kind: "ghost", text: "Add a learning action" },
      { kind: "meta", text: "This is not part of the role I mean" },
    ],
    notes: [
      "1. The status definition is repeated so the label is not a grade.",
      "2. The person can add the skill if the profile is wrong about them. FR-02, FR-03.",
      "3. Hiding a requirement is allowed when the role they mean is different.",
      "4. The practice step is one sitting, not a course. FR-04.",
      "5. Screen S-10.",
    ],
  },
  {
    file: "wf-10-roadmap.svg",
    id: "WF-10",
    title: "Three-action roadmap",
    blocks: [
      { kind: "h1", text: "A small plan" },
      { kind: "banner", lines: ["Guidance, not a hiring prediction", "None of the core skills are matched yet. Check the comparison before you treat these as gaps."] },
      { kind: "p", text: "The first plan is three actions. You can edit, remove, or add more." },
      { kind: "card", lines: ["1  Write one stakeholder update", "Not started", "A person who was not in the room can see what changed.", "Open action"] },
      { kind: "card", lines: ["2  Turn one request into a one-page brief", "Not started"] },
      { kind: "card", lines: ["3  Map one workflow you already know", "Not started"] },
      { kind: "ghost", text: "Add my own action" },
    ],
    notes: [
      "1. The first plan is capped at three so it does not become a curriculum. FR-04.",
      "2. Matched skills are acknowledged before the gaps.",
      "3. Actions are editable and removable.",
      "4. More gaps can be added later. They are not dumped at once.",
      "5. Screen S-11.",
    ],
  },
  {
    file: "wf-11-action.svg",
    id: "WF-11",
    title: "Action detail",
    blocks: [
      { kind: "h1", text: "Write one stakeholder update" },
      { kind: "p", text: "The work breaks when people who depend on a handoff do not hear what changed." },
      { kind: "chips", items: ["Not started", "Doing", "Done"] },
      { kind: "field", label: "What you will be able to do", value: "Someone outside the room can see the change, the blocker, and the ask." },
      { kind: "field", label: "First step", value: "Write five lines. Plan on 30 to 45 minutes." },
      { kind: "card", lines: ["plainlanguage.gov · Short, concrete writing", "Example link. Not an endorsement. Opens the provider site."] },
      { kind: "button", text: "Save changes" },
      { kind: "ghost", text: "Remove action" },
    ],
    notes: [
      "1. Status can be changed and undone. FR-05.",
      "2. Outcome, step, and note are editable. FR-04.",
      "3. The resource names the provider and the topic, and opens separately. FR-07.",
      "4. Removing the example link does not remove the action.",
      "5. Screen S-12.",
    ],
  },
  {
    file: "wf-12-progress.svg",
    id: "WF-12",
    title: "Progress you marked",
    blocks: [
      { kind: "h1", text: "Progress" },
      { kind: "banner", lines: ["Guidance, not a hiring prediction", "This is what you marked. It is not a score."] },
      { kind: "p", text: "You marked 1 of 3 actions done." },
      { kind: "card", lines: ["[ bar: one third ]", "Actions you marked done"] },
      { kind: "card", lines: ["Write one stakeholder update", "Done", "Update"] },
      { kind: "field", label: "What felt useful? What felt like too much?", value: "Optional note" },
      { kind: "button", text: "Save note" },
    ],
    notes: [
      "1. The bar describes actions the person marked, not skill or hireability. FR-05.",
      "2. The same limit is repeated here.",
      "3. The reflection note is private to this browser. Should-have progress and notes.",
      "4. Screen S-13.",
    ],
  },
  {
    file: "wf-13-settings.svg",
    id: "WF-13",
    title: "Settings and deletion",
    blocks: [
      { kind: "h1", text: "Settings and your data" },
      { kind: "p", text: "SkillBridge stores this profile in this browser only. It does not keep pasted resume text." },
      { kind: "field", label: "Name on this profile", value: "Maya Chen" },
      { kind: "card", lines: ["What is saved", "7 skills you entered or confirmed.", "3 roadmap actions.", "This profile started as Maya's fictional sample."] },
      { kind: "ghost", text: "Copy saved data" },
      { kind: "button", text: "Delete saved data on this browser" },
    ],
    notes: [
      "1. Collection is explained in place.",
      "2. Delete is permanent and confirmed in a dialog.",
      "3. A copy is offered before deletion. The paste is absent from it.",
      "4. Reset sample is separate from deleting a real profile.",
      "5. Screen S-14.",
    ],
  },
  {
    file: "wf-14-empty-comparison.svg",
    id: "WF-14",
    title: "Empty skill list is not a gap report",
    blocks: [
      { kind: "h1", text: "Comparison" },
      { kind: "banner", lines: ["Guidance, not a hiring prediction"] },
      { kind: "card", lines: ["Your skill list is empty", "Add the skills you already use. An empty list is not a gap report."] },
      { kind: "button", text: "Add a skill" },
      { kind: "ghost", text: "Paste resume text" },
      { kind: "p", text: "This profile includes" },
      { kind: "meta", text: "Stakeholder updates (core)" },
      { kind: "meta", text: "Requirements briefs (core)" },
      { kind: "meta", text: "Spreadsheets (core)" },
    ],
    notes: [
      "1. Missing chips are withheld until the person has claimed at least one skill.",
      "2. The profile is still visible, without a verdict.",
      "3. This is the main defense against the comparison feeling like a judgment.",
      "4. Variant of screen S-09.",
    ],
  },
  {
    file: "wf-15-unreadable-data.svg",
    id: "WF-15",
    title: "Saved data cannot be read",
    blocks: [
      { kind: "h1", text: "Saved data could not be read" },
      { kind: "p", text: "This browser has saved data SkillBridge cannot use." },
      { kind: "p", text: "Your previous data is still in this browser. Clearing it is permanent. SkillBridge will not overwrite it unless you ask." },
      { kind: "button", text: "Delete the unreadable data and start over" },
    ],
    notes: [
      "1. Corrupt data is not silently replaced.",
      "2. The only write is an explicit delete.",
      "3. Offline work still uses readable saved data. A banner covers offline separately.",
      "4. Screen S-15. Not-found is S-16.",
    ],
  },
];

for (const item of screens) screen(item);
console.log(`Wrote ${screens.length} wireframes to ${dir}`);
