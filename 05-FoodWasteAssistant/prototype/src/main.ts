import { createApp, type Host } from "./app";
import { STORAGE_KEY, sampleState } from "./store";

const params = new URLSearchParams(window.location.search);
if (params.get("demo") === "1" && !localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleState()));
  if (!window.location.hash || window.location.hash === "#/welcome") {
    window.location.hash = "/pantry";
  }
}

const root = document.querySelector<HTMLElement>("#app");
if (!root) throw new Error("FreshLoop could not find #app.");

const host: Host = {
  storage: localStorage,
  now: () => new Date(),
  online: () => navigator.onLine,
  hash: () => window.location.hash.replace(/^#/, "") || "/welcome",
  setHash: (hash) => {
    const next = hash.startsWith("/") ? hash : `/${hash}`;
    if ((window.location.hash.replace(/^#/, "") || "/welcome") === next) return;
    window.location.hash = next;
  },
  onHash: (listener) => window.addEventListener("hashchange", listener),
  onConnectivity: (listener) => {
    window.addEventListener("online", listener);
    window.addEventListener("offline", listener);
  },
  download: (filename, contents) => {
    const blob = new Blob([contents], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  },
};

createApp(root, host);
