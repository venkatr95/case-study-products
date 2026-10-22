# User flows

Primary path first. Alternate and error paths are included where a wrong turn would change the estimate or the person’s trust.

## 1. Primary: can I afford this?

```mermaid
flowchart TD
  A["Open Home"] --> B{"Items in the 30 days?"}
  B -->|No| C["Empty state: add payday and bills"]
  B -->|Yes| D["Read safe to spend and low-point date"]
  D --> E["Open the calculation"]
  E --> F["See items counted and items after the low point"]
  F --> G["Try a purchase"]
  G --> H{"Keep it?"}
  H -->|Discard| I["Saved estimate unchanged"]
  H -->|Add to plan| J["Item saved, estimate updates, detail confirms"]
```

**Start:** A plan with a balance. Sample data is an allowed start for a demo, if the banner is visible.

**End:** The person can say whether the purchase stays a scenario or is now part of the plan, and the home number matches that choice.

**Covers:** FR-03, FR-04, FR-07, and the core PRD flow steps 3–6.

## 2. First estimate without a bank

```mermaid
flowchart TD
  A["Explainer"] --> B{"Sample or own numbers?"}
  B -->|Sample| C["Confirm only if a plan already exists"]
  C --> H["Home with sample banner"]
  B -->|Own numbers| D["Balance, date, currency, set-aside"]
  D --> E{"Valid?"}
  E -->|No| F["Field message, focus stays in the form"]
  F --> D
  E -->|Yes| G["Home, flat if no items yet"]
  G --> I["Add item with preview"]
  I --> J["Detail confirms it is included"]
```

**Covers:** FR-01, FR-02, onboarding acceptance, empty state.

## 3. Edit or delete

```mermaid
flowchart TD
  A["Plan or timeline"] --> B["Item detail"]
  B --> C["Edit"]
  C --> D["Preview of the new low point"]
  D --> E{"Save?"}
  E -->|Save| F["Detail plus confirmation the estimate includes it"]
  E -->|Cancel| B
  B --> G["Delete"]
  G --> H["Confirm. Cancel is focused first"]
  H -->|Delete| I["Plan. Undo once"]
  I -->|Undo| J["Item restored, estimate updated"]
```

**Covers:** FR-05. The risk note about edit previews is the preview on the form.

## 4. Low-balance alert

```mermaid
flowchart TD
  A["Settings or Home banner"] --> B["Alert screen"]
  B --> C["Set amount and on/off"]
  C --> D{"Any estimated day below it?"}
  D -->|Yes| E["In-app status names the first date"]
  D -->|No| F["In-app status says none"]
  E --> G{"Browser permission"}
  G -->|Granted| H["Notification only while this page is open"]
  G -->|Denied or unavailable| I["Explain that the in-app alert remains"]
```

**Covers:** FR-06. Background scheduling is an explicit non-behavior.

## 5. Stale, unreadable, offline

```mermaid
flowchart TD
  A["Open app"] --> B{"Storage readable?"}
  B -->|No| C["Offer download of raw text, then confirm erase"]
  B -->|Yes| D{"Balance date older than 7 days?"}
  D -->|Yes| E["Banner: update before you rely on it"]
  D -->|No| F["Home"]
  E --> G["Update balance"]
  F --> H{"Browser offline?"}
  H -->|Yes| I["Banner: entries stay in this browser"]
```

Past occurrences are not rolled forward onto a stale balance. The estimate still starts on the saved date so the math can be inspected, and the banner says spending since that date is missing.

## 6. Export and delete

From Settings, download writes a JSON file on the device. Delete asks a second time. Cancel is the first button in the dialog. Escape closes the dialog. After delete, the explainer returns and storage no longer has the record.

## Entry and exit for the primary screen

| Screen | Enter from | Primary exit |
| --- | --- | --- |
| Home | Open app, save balance, save item | Explanation, what-if, timeline, add item |
| Explanation | Home “See the calculation” | Back via Home in the bar |
| What-if | Home “Try a purchase” | Discard, or add to plan then item detail |
