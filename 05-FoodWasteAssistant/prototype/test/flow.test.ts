// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { createApp, type Host } from "../src/app";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();
  get length(): number {
    return this.map.size;
  }
  clear(): void {
    this.map.clear();
  }
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

function mount(raw?: string) {
  document.body.innerHTML = '<div id="app"></div>';
  const root = document.querySelector("#app") as HTMLElement;
  const storage = new MemoryStorage();
  if (raw !== undefined) storage.setItem("freshloop.v1", raw);
  let hash = "/welcome";
  const listeners = new Set<() => void>();
  let online = true;
  let connectivity: (() => void) | null = null;
  const downloads: { filename: string; contents: string }[] = [];
  const host: Host = {
    storage,
    now: () => new Date(2026, 9, 22, 12, 0, 0),
    online: () => online,
    hash: () => hash,
    setHash: (next) => {
      const value = next.startsWith("/") ? next : `/${next}`;
      if (value === hash) return;
      hash = value;
      listeners.forEach((listener) => listener());
    },
    onHash: (listener) => listeners.add(listener),
    onConnectivity: (listener) => {
      connectivity = listener;
    },
    download: (filename, contents) => downloads.push({ filename, contents }),
  };
  createApp(root, host);
  return {
    root,
    storage,
    downloads,
    hash: () => hash,
    goOffline() {
      online = false;
      connectivity?.();
    },
  };
}

function clickAction(root: ParentNode, action: string): void {
  const button = root.querySelector<HTMLButtonElement>(`[data-action="${action}"]`);
  if (!button) throw new Error(`No control for ${action}`);
  button.click();
}

function clickLink(root: ParentNode, contains: string): void {
  const link = [...root.querySelectorAll("a")].find((anchor) => anchor.textContent?.includes(contains));
  if (!link) throw new Error(`No link containing ${contains}`);
  link.click();
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("primary kitchen flow", () => {
  it("walks from the sample pantry to a checked shopping list and a cooked update", () => {
    const app = mount();
    expect(app.root.textContent).toContain("Dates you enter are reminders");
    clickAction(app.root, "start-sample");
    expect(app.root.textContent).toContain("Sample kitchen. These items are fictional.");
    expect(app.root.textContent).toContain("4 items are marked Use soon.");
    expect(app.root.textContent).toContain("1 item is marked Date passed.");
    expect(app.hash()).toBe("/pantry");

    clickLink(app.root, "Open the use-soon list");
    expect(app.root.textContent).toContain("Opened is not an expiry");
    expect(app.root.textContent).toContain("Ginger");
    expect(app.root.textContent).toContain("Plain yogurt");

    clickLink(app.root, "Cook");
    clickLink(app.root, "Spinach and chickpea skillet");
    expect(app.root.textContent).toContain("The pantry covers this amount.");
    expect(app.root.textContent).toContain("Optional, and it is not in the pantry");
    clickAction(app.root, "open-review-recipe");
    expect(app.root.textContent).toContain("Nothing is selected to buy");
    expect(app.root.textContent).toContain("Left off as staples");

    clickLink(app.root, "Cook");
    clickLink(app.root, "Yogurt oat bowl");
    expect(app.root.textContent).toContain("Nothing was subtracted");
    clickAction(app.root, "open-review-recipe");
    const toBuy = app.root.innerHTML.split("Left off because")[0];
    expect(toBuy).toContain("Yogurt");

    clickLink(app.root, "Plan");
    const first = app.root.querySelector<HTMLSelectElement>("#plan-2026-10-22");
    expect(first).toBeTruthy();
    first!.value = "spinach-chickpea-skillet";
    first!.dispatchEvent(new Event("change", { bubbles: true }));
    const second = app.root.querySelector<HTMLSelectElement>("#plan-2026-10-23");
    expect(second).toBeTruthy();
    second!.value = "lemon-chicken-tray";
    second!.dispatchEvent(new Event("change", { bubbles: true }));
    clickAction(app.root, "open-review-plan");
    const planBuy = app.root.innerHTML.split("Left off because")[0];
    expect(planBuy).toContain("Lemon");
    expect(planBuy).toContain("Garlic");
    expect(planBuy).not.toContain(">Spinach<");
    clickAction(app.root, "commit-review");
    expect(app.hash()).toBe("/shop");
    expect(app.root.textContent).toContain("Lemon");

    clickLink(app.root, "Cook");
    clickLink(app.root, "Spinach and chickpea skillet");
    clickLink(app.root, "I cooked this");
    expect(app.root.textContent).toContain("Update the pantry?");
    clickAction(app.root, "apply-cooked");
    expect(app.root.textContent).toContain("50 g");
    expect(app.root.textContent).not.toContain("Garlic");
    clickAction(app.root, "undo");
    expect(app.root.textContent).toContain("200 g");
    expect(app.root.textContent).toContain("Garlic");
  });

  it("blocks a duplicate quick add, confirms a barcode, and validates a blank name", () => {
    const app = mount();
    clickAction(app.root, "start-sample");
    const quick = app.root.querySelector<HTMLInputElement>("#quick-name");
    quick!.value = "Spinach";
    quick!.dispatchEvent(new Event("input", { bubbles: true }));
    const form = app.root.querySelector<HTMLFormElement>('[data-action="quick-add"]');
    form!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(app.root.textContent).toContain("already in the fridge");
    clickAction(app.root, "cancel-dialog");

    clickLink(app.root, "Add quantity, location, or a date");
    const save = app.root.querySelector<HTMLFormElement>('[data-action="save-item"]');
    save!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    expect(app.root.textContent).toContain("Enter a name.");

    const barcode = app.root.querySelector<HTMLInputElement>("#draft-barcode");
    barcode!.value = "000000111111";
    barcode!.dispatchEvent(new Event("input", { bubbles: true }));
    clickAction(app.root, "lookup-barcode");
    expect(app.root.textContent).toContain("not in your pantry until you save");
    expect(app.root.querySelector<HTMLInputElement>("#draft-name")?.value).toBe("Oat milk");
    clickLink(app.root, "Pantry");
    expect(app.root.textContent).not.toContain("Oat milk");
  });

  it("keeps reminders off when permission is denied and hides meat for a vegan filter", () => {
    const app = mount();
    clickAction(app.root, "start-sample");
    clickLink(app.root, "Settings");
    clickAction(app.root, "open-permission");
    expect(app.root.textContent).toContain("cannot notify you after you close it");
    clickAction(app.root, "deny-reminders");
    expect(app.root.textContent).toContain("Reminders stay off");

    clickLink(app.root, "Cook");
    const vegan = app.root.querySelector<HTMLInputElement>('[data-diet="vegan"]');
    vegan!.checked = true;
    vegan!.dispatchEvent(new Event("change", { bubbles: true }));
    expect(app.root.textContent).not.toContain("Lemon chicken tray");
    expect(app.root.textContent).toContain("Spinach and chickpea skillet");
    expect(app.root.textContent).toContain("not an allergen");
  });

  it("does not erase unreadable saved data until asked", () => {
    const app = mount("{not-json");
    expect(app.root.textContent).toContain("could not be read");
    expect(app.storage.getItem("freshloop.v1")).toBe("{not-json");
    clickAction(app.root, "download-corrupt");
    expect(app.downloads[0]?.contents).toBe("{not-json");
    clickAction(app.root, "erase-corrupt");
    expect(app.storage.getItem("freshloop.v1")).toBeNull();
    expect(app.root.textContent).toContain("Know what to cook");
  });

  it("shows an offline banner without dropping the pantry", () => {
    const app = mount();
    clickAction(app.root, "start-sample");
    app.goOffline();
    expect(app.root.textContent).toContain("You are offline");
    expect(app.root.textContent).toContain("Spinach");
  });
});
