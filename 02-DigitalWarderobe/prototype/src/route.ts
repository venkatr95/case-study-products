import type { Route } from "./types";

export function parseHash(hash: string): Route | null {
  const path = decodeURIComponent(hash.replace(/^#/, "").replace(/^\/+/, ""));
  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0 || parts[0] === "welcome") return { name: "welcome" };
  if (parts[0] === "wardrobe") return { name: "wardrobe" };
  if (parts[0] === "settings") return { name: "settings" };
  if (parts[0] === "suggest") return { name: "suggest" };
  if (parts[0] === "outfits" && parts.length === 1) return { name: "outfits" };
  if (parts[0] === "trips" && parts.length === 1) return { name: "trips" };
  if (parts[0] === "items" && parts[1] === "new") return { name: "item-form", id: null };
  if (parts[0] === "items" && parts[1] && parts[2] === "edit") {
    return { name: "item-form", id: parts[1] };
  }
  if (parts[0] === "items" && parts[1]) return { name: "item", id: parts[1] };
  if (parts[0] === "outfits" && parts[1] === "new") return { name: "outfit-form", id: null };
  if (parts[0] === "outfits" && parts[1] && parts[2] === "edit") {
    return { name: "outfit-form", id: parts[1] };
  }
  if (parts[0] === "outfits" && parts[1]) return { name: "outfit", id: parts[1] };
  if (parts[0] === "trips" && parts[1] === "new") return { name: "trip-form", id: null };
  if (parts[0] === "trips" && parts[1] && parts[2] === "edit") {
    return { name: "trip-form", id: parts[1] };
  }
  if (parts[0] === "trips" && parts[1]) return { name: "trip", id: parts[1] };
  return null;
}

export function hrefFor(route: Route): string {
  switch (route.name) {
    case "welcome":
      return "#/welcome";
    case "wardrobe":
      return "#/wardrobe";
    case "settings":
      return "#/settings";
    case "suggest":
      return "#/suggest";
    case "outfits":
      return "#/outfits";
    case "trips":
      return "#/trips";
    case "item":
      return `#/items/${encodeURIComponent(route.id)}`;
    case "item-form":
      return route.id ? `#/items/${encodeURIComponent(route.id)}/edit` : "#/items/new";
    case "outfit":
      return `#/outfits/${encodeURIComponent(route.id)}`;
    case "outfit-form":
      return route.id ? `#/outfits/${encodeURIComponent(route.id)}/edit` : "#/outfits/new";
    case "trip":
      return `#/trips/${encodeURIComponent(route.id)}`;
    case "trip-form":
      return route.id ? `#/trips/${encodeURIComponent(route.id)}/edit` : "#/trips/new";
  }
}

export function screenTitle(route: Route): string {
  switch (route.name) {
    case "welcome":
      return "Welcome";
    case "wardrobe":
      return "Wardrobe";
    case "settings":
      return "Settings";
    case "suggest":
      return "Suggestions";
    case "outfits":
      return "Outfits";
    case "trips":
      return "Trips";
    case "item":
      return "Item";
    case "item-form":
      return route.id ? "Edit item" : "Add item";
    case "outfit":
      return "Outfit";
    case "outfit-form":
      return route.id ? "Edit outfit" : "New outfit";
    case "trip":
      return "Packing list";
    case "trip-form":
      return route.id ? "Edit trip" : "New trip";
  }
}
