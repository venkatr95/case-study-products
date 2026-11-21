# Prototype flow

**Stack:** Vite 6, TypeScript strict, no React. Domain logic is plain functions. `createApp` renders strings into one root. Tests inject storage, clock, hash, download, and online.

**Run:** from `prototype/`:

```powershell
npm test
npm run dev
```

Dev server: `http://localhost:5185/` (strict port).

Production check:

```powershell
npm run build
npm run preview
```

Preview: `http://localhost:4185/`. On this machine Vite binds the localhost name. Use that host, not `127.0.0.1`, if the numeric address refuses the connection.

Add `?demo=1` when `freshloop.v1` is empty to open the sample kitchen. Example: `http://localhost:5185/?demo=1#/pantry`.

Do not type real medical or payment data. Storage is not encrypted.

## Primary journey, a few minutes

1. Welcome. Read the UVP and the reminder limit.
2. Try the sample kitchen. Pantry shows 4 Use soon and 1 Date passed on the fixture date.
3. Open the use-soon list. Ginger is Opened. Yogurt is Date passed.
4. Cook. Open Spinach and chickpea skillet. Required amounts are covered. Cumin is optional. Salt and pepper are staples.
5. Shop for what's missing. Nothing is selected to buy. Staples are listed as left off.
6. Open Yogurt oat bowl. Yogurt is Check because the pantry unit is piece and the recipe unit is grams.
7. Plan. Skillet on day one, lemon chicken on day two. Build the list. Lemon and garlic are the gap. Spinach is not.
8. Add selected items. Shop shows them.
9. I cooked this on the skillet. Update pantry. Spinach is 50 g. Undo restores 200 g.

That journey is the body of `prototype/test/flow.test.ts`.

## Other paths worth clicking

- Quick add Spinach and cancel the duplicate dialog.
- Add with an empty name.
- Barcode `000000111111`, then leave without saving. Oat milk is absent.
- Settings, Don't allow on reminders, then Cook with vegan. Lemon chicken is hidden.
- Corrupt the stored value to `{not-json` and reload. Download, then erase.
- Go offline in the browser. The banner appears and spinach remains.

## Start and end

**Start:** no kitchen, or the fictional sample. **End:** a shopping list whose gaps are explained, or a pantry that reflects a confirmed cooked meal, with undo still available.

## Known limitations

- Seven original recipes. Not a licensed catalog.
- Two fictional barcodes. No product database.
- Receipt OCR is a dialog, not a scan.
- Reminders die with the tab.
- One kitchen. No accounts. No sync.
- Batch edit does not change quantities. Partial consume is per item.
- happy-dom covers the click path. It is not a browser engine.
- No Figma prototype.
