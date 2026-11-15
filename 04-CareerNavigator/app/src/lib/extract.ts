import type { ExtractResult, SkillDef, Suggestion } from "../types";

const MAX_CHARS = 12_000;
const MAX_SUGGESTIONS = 12;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findPhrase(text: string, phrase: string): { index: number; match: string } | null {
  const pattern = new RegExp(`(?:^|[^A-Za-z0-9])(${escapeRegExp(phrase)})(?=$|[^A-Za-z0-9])`, "i");
  const found = pattern.exec(text);
  if (!found || found[1] == null) return null;
  const match = found[1];
  const index = found.index + found[0].indexOf(match);
  return { index, match };
}

function lineAround(text: string, index: number): string {
  const start = text.lastIndexOf("\n", Math.max(0, index - 1)) + 1;
  const next = text.indexOf("\n", index);
  const end = next === -1 ? text.length : next;
  let line = text.slice(start, end).trim();
  if (line.length > 220) {
    const local = Math.max(0, index - start);
    const from = Math.max(0, local - 80);
    const slice = line.slice(from, local + 100).trim();
    line = `${from > 0 ? "…" : ""}${slice}${local + 100 < line.length ? "…" : ""}`;
  }
  return line;
}

export function extractSkills(text: string, skills: SkillDef[]): ExtractResult {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "Paste resume text before reviewing it." };
  if (trimmed.length > MAX_CHARS) {
    return { ok: false, error: "That paste is too long for this review. Paste one resume, then try again." };
  }
  const found: Suggestion[] = [];
  for (const skill of skills) {
    let best: { index: number; match: string } | null = null;
    const phrases = [...skill.phrases].sort((a, b) => b.length - a.length);
    for (const phrase of phrases) {
      const hit = findPhrase(trimmed, phrase);
      if (!hit) continue;
      if (!best || hit.index < best.index) best = hit;
    }
    if (!best) continue;
    found.push({
      skillId: skill.id,
      phrase: best.match,
      snippet: lineAround(trimmed, best.index),
      index: best.index,
      proficiency: "practicing",
      confidence: "low",
    });
  }
  found.sort((a, b) => a.index - b.index);
  const suggestions = found.slice(0, MAX_SUGGESTIONS);
  return { ok: true, suggestions, omitted: found.length - suggestions.length };
}
