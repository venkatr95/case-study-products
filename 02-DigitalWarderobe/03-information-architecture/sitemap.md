# Sitemap — Rewear

Mobile-first. Four destinations after the introduction. Settings is the “You” tab so privacy controls are not buried, and it is also reachable before onboarding.

```mermaid
flowchart TD
  welcome[Welcome]
  welcome --> wardrobe[Wardrobe]
  welcome --> settings[Settings]
  wardrobe --> itemNew[Add item]
  wardrobe --> filters[Filters dialog]
  wardrobe --> item[Item detail]
  item --> itemEdit[Edit item]
  item --> deleteItem[Delete item confirm]
  outfits[Outfits]
  outfits --> outfitNew[New outfit]
  outfits --> suggest[Suggestions]
  outfits --> outfit[Outfit detail]
  outfit --> outfitEdit[Edit outfit]
  outfit --> deleteOutfit[Delete outfit confirm]
  trips[Trips]
  trips --> tripNew[New trip]
  trips --> trip[Packing list]
  trip --> tripEdit[Edit trip]
  trip --> deleteTrip[Delete trip confirm]
  settings --> privacy[Photos and privacy]
  settings --> danger[Delete data confirms]
```

## Navigation

| Tab | Contains | Not in this tab |
| --- | --- | --- |
| Wardrobe | Search, category chips, filters, grid, add item | Outfits |
| Outfits | Saved outfits, new outfit, suggestions | The trip checklist |
| Trips | Trip list and packing lists | A free-form item pack that ignores outfits |
| You | Text size, currency symbol, colors to skip, photo privacy, delete, sample reset, about | A profile photo or a social graph |

The introduction has no tab bar. Settings is linked from it so someone can read the storage explanation before they add anything.

## URL map in the prototype

| Hash | Screen |
| --- | --- |
| `#/welcome` | Introduction |
| `#/wardrobe` | Wardrobe |
| `#/items/new` | Add item |
| `#/items/:id` | Item detail |
| `#/items/:id/edit` | Edit item |
| `#/outfits` | Saved outfits |
| `#/outfits/new` | Outfit builder |
| `#/outfits/:id` | Outfit detail |
| `#/outfits/:id/edit` | Edit outfit |
| `#/suggest` | Suggestions |
| `#/trips` | Trips |
| `#/trips/new` | New trip |
| `#/trips/:id` | Packing list |
| `#/trips/:id/edit` | Edit trip |
| `#/settings` | Settings |

Unknown hashes show a toast: “That page is not in the prototype.”

## Object model

```mermaid
erDiagram
  ITEM ||--o{ OUTFIT_ITEM : appears_in
  OUTFIT ||--|{ OUTFIT_ITEM : contains
  TRIP ||--o{ TRIP_OUTFIT : packs
  OUTFIT ||--o{ TRIP_OUTFIT : included_in
  ITEM {
    string name
    string category
    string color
    string season
    string dressiness
    string notes
    number price_or_null
    number wearCount
    date lastWorn_or_null
    image photo_or_null
    boolean archived
  }
  OUTFIT {
    string name
    string occasion
    string weatherPreference
    string source
  }
  TRIP {
    string name
    number nights
    string notes
  }
```

Packing lines are not stored as their own records. They are derived from the outfits on the trip, so a deleted item disappears from the list and a shared item cannot be double-counted. Packed checkboxes are stored as item ids on the trip.

## Labels that must stay stable

Wardrobe, Outfits, Trips, You, Add item, Save item, New outfit, Save outfit, Show suggestions, Why this was suggested, New trip, Build packing list, Mark worn today, Archive, Delete item, Delete photo.
