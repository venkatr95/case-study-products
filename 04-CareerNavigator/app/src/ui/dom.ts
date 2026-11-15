export type Child = Node | string | null | false | undefined;
export type Attrs = Record<string, string | boolean | null | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = String(value);
    else if (key === "text") node.textContent = String(value);
    else if (key === "checked" && node instanceof HTMLInputElement) node.checked = value === true;
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
}

export function page(screen: string, className: string, children: Child[]): HTMLElement {
  return h("article", { class: `page ${className}`, "data-screen": screen }, children);
}

export function actions(children: Child[]): HTMLElement {
  return h("div", { class: "actions" }, children);
}
