# User flows — Rewear

The primary flow is the PRD’s core path. Alternate and failure paths are part of the same flow, not appendices that were skipped.

## 1. Primary: from nothing to a saved outfit

```mermaid
flowchart TD
  start[Open Rewear] --> choice{Start}
  choice -->|Sample wardrobe| grid[Wardrobe with 12 labeled items]
  choice -->|Empty wardrobe| empty[Empty wardrobe]
  empty --> add[Add item]
  add --> saveItem[Item saved]
  saveItem --> grid
  grid --> build[New outfit]
  build --> context[Occasion and weather preference]
  context --> pick[Select at least two items, or one dress]
  pick --> saveOutfit[Outfit saved]
  saveOutfit --> detail[Outfit detail]
```

**Done when:** the outfit detail shows the occasion, the weather preference, and the current items.

**Sample branch:** the reviewer or participant can reach an outfit without adding five items. The activation metric still requires a separate add task. Do not count the sample load as five items added.

## 2. Add item, including photo failure

```mermaid
flowchart TD
  form[Add item form] --> fields[Name, category, color, season, dressiness]
  fields --> photo{Photo?}
  photo -->|Skip| save[Save item]
  photo -->|Choose file| read[Read and compress, progress shown]
  read -->|Ready| save
  read -->|Too big, wrong type, or unreadable| fail[Error explains retry or save without photo]
  fail --> save
  fail --> retry[Choose a photo again]
  retry --> read
  save --> detail[Item appears in the wardrobe]
```

Manual entry is on the same form. It is not a second product behind an “advanced” link.

## 3. Find an item

```mermaid
flowchart TD
  grid[Wardrobe] --> search[Type a query]
  grid --> chips[Toggle category chips]
  grid --> more[Open Filters]
  more --> color[Color and season]
  more --> archived[Show archived instead]
  search --> results[Count of matches announced]
  chips --> results
  color --> results
  results --> clear[Clear filters]
  clear --> grid
  results -->|None| empty[No items match, with Clear filters]
```

Logic: category, color, and season groups combine with AND. Values inside one group combine with OR. Archived view replaces the active grid rather than mixing them. Search matches name, notes, category, color, season, and dressiness.

## 4. Suggestion, then save or dismiss

```mermaid
flowchart TD
  open[Suggestions] --> set[Occasion and weather preference]
  set --> rules{Can an anchor be made?}
  rules -->|No| gap[Say what is missing]
  rules -->|Yes| cards[Up to 3 suggestions]
  cards --> why[Each card lists why]
  why --> save[Save outfit]
  why --> dismiss[Dismiss this combination]
  save --> detail[Outfit detail keeps the reasons]
  dismiss --> cards
```

A combination that is already saved, or already dismissed, is not offered again until the wardrobe changes enough to make a different set.

## 5. Edit or delete an item that is in outfits

```mermaid
flowchart TD
  detail[Item detail] --> edit[Edit tags or photo]
  edit --> outfitsUpdate[Outfits keep the item id and show the new name, color, and photo]
  detail --> del[Delete]
  del --> confirm[Dialog names the outfits]
  confirm -->|Cancel| detail
  confirm -->|Delete| removed[Item is gone and removed from those outfits]
```

Archive is the softer path: the item leaves the active grid and the outfit builder, and remains inside outfits already saved, with an Archived label on the outfit.

## 6. Trip packing

```mermaid
flowchart TD
  trips[Trips] --> has{Any saved outfits?}
  has -->|No| block[Explain that an outfit comes first]
  has -->|Yes| form[Name, nights, optional note, pick outfits]
  form --> need{At least one outfit?}
  need -->|No| disabled[Build packing list stays disabled]
  need -->|Yes| list[Derived checklist]
  list --> once[Each item once, outfits named]
  once --> check[Check off while packing]
```

Nights are a label from 1 to 21. They do not multiply the items. A four-night trip with two outfits does not mean “pack the shirt four times.”

## 7. Offline and storage

The prototype is local. If the browser is offline after load, a banner says the wardrobe still works. If storage throws, a toast says the latest change may disappear on refresh. There is no queued sync, because there is no server.

## Keyboard and back paths

- Every form has Cancel returning to the parent.
- Delete dialogs have Cancel and a named destructive button. Escape closes the dialog.
- Filters dialog has Show results and Clear filters. Escape closes it.
- Focus moves to the screen title on navigation.
