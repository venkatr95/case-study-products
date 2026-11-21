export type Route =
  | { name: "welcome" }
  | { name: "pantry" }
  | { name: "use-soon" }
  | { name: "add" }
  | { name: "edit"; id: string }
  | { name: "item"; id: string }
  | { name: "cook" }
  | { name: "recipe"; id: string }
  | { name: "review" }
  | { name: "shop" }
  | { name: "plan" }
  | { name: "settings" }
  | { name: "cooked"; id: string }
  | { name: "recovery" }
  | { name: "missing" };

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, "").split("?")[0] || "/welcome";
  const parts = path.split("/").filter(Boolean);
  const head = parts[0] ?? "welcome";
  switch (head) {
    case "welcome":
      return { name: "welcome" };
    case "pantry":
      return { name: "pantry" };
    case "use-soon":
      return { name: "use-soon" };
    case "add":
      return { name: "add" };
    case "edit":
      return parts[1] ? { name: "edit", id: decodeURIComponent(parts[1]) } : { name: "missing" };
    case "item":
      return parts[1] ? { name: "item", id: decodeURIComponent(parts[1]) } : { name: "missing" };
    case "cook":
      return { name: "cook" };
    case "recipe":
      return parts[1] ? { name: "recipe", id: decodeURIComponent(parts[1]) } : { name: "missing" };
    case "review":
      return { name: "review" };
    case "shop":
      return { name: "shop" };
    case "plan":
      return { name: "plan" };
    case "settings":
      return { name: "settings" };
    case "cooked":
      return parts[1] ? { name: "cooked", id: decodeURIComponent(parts[1]) } : { name: "missing" };
    case "recovery":
      return { name: "recovery" };
    default:
      return { name: "missing" };
  }
}

export function routeKey(route: Route): string {
  if ("id" in route) return `${route.name}:${route.id}`;
  return route.name;
}

export function navKey(route: Route): string {
  switch (route.name) {
    case "recipe":
    case "cooked":
      return "cook";
    case "review":
      return "shop";
    case "add":
    case "edit":
    case "item":
    case "use-soon":
      return route.name === "use-soon" ? "use-soon" : "pantry";
    default:
      return route.name;
  }
}
