// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { start } from "../main";
import type { KeyValueStorage } from "../types";

function memory(): KeyValueStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

function click(label: string): void {
  const found = [...document.querySelectorAll("button, a")].find((node) => node.textContent?.includes(label));
  if (!(found instanceof HTMLElement)) throw new Error(`Missing control: ${label}`);
  found.click();
}

function pressed(label: string): string | null {
  const found = [...document.querySelectorAll("button")].find((node) => node.textContent === label);
  return found?.getAttribute("aria-pressed") ?? null;
}

describe("prototype journey", () => {
  it("walks Maya from the sample to a saved action without a score", () => {
    document.body.innerHTML = '<div id="app"></div><div id="live"></div>';
    let hash = "#/welcome";
    const root = document.getElementById("app");
    const live = document.getElementById("live");
    if (!(root instanceof HTMLElement) || !(live instanceof HTMLElement)) throw new Error("missing root");
    start({
      document,
      root,
      live,
      storage: memory(),
      getHash: () => hash,
      setHash: (value) => {
        hash = value;
      },
    });
    click("Explore with Maya's sample");
    const text = document.body.textContent ?? "";
    expect(text).toContain("You listed 7 skills");
    expect(text).toContain("does not predict hiring");
    expect(text).toContain("There is no match score");
    expect(text).not.toMatch(/\d+%/);
    click("Review a small plan");
    click("Save my first three actions");
    expect(document.body.textContent).toContain("Write one stakeholder update");
    click("Open action");
    click("Done");
    expect(document.body.textContent).toContain("Marked Done");
    expect(pressed("Done")).toBe("true");
    click("Undo");
    expect(pressed("Done")).toBe("false");
    expect(pressed("Not started")).toBe("true");
    expect(hash.startsWith("#/roadmap/")).toBe(true);
  });
});
