# Prototype flow

**Build:** TypeScript, no UI framework. Source in `app/src`. Browser runs `app/dist` after `npm test` or `npm run build`.
**Run:** From `app/`, `npm install`, `npm test`, `npm start`. Open `http://127.0.0.1:4175`.
**Data:** Illustrative Seattle sample in `app/src/sample.ts`. Not for street use.

## The three-minute path

1. Home. Read the sample banner.
2. Set access preferences. Choose Step-free. Save preferences.
3. Plan. Origin: Cal Anderson Park, south path. Destination: Pike Place Market, First Avenue entrance. Compare routes.
4. Read the three statuses. Madison matches on confirmed data. Pike and Seneca has unknown grade and an unknown curb ramp. Pine Street direct conflicts on stairs and a 10% grade.
5. Open Madison gentle. Read Union Street and the unknown surface on Western Avenue. Choose this route. Undo is on the page.
6. Optional: open the south arcade entrance from First Avenue and read two pending reports that are not merged.
7. Optional: report a barrier on Pine Street link. Land on Pending review. Withdraw or keep it.

Direct review links, which hide the prototype panel: `/?shot=results`, `map`, `detail`, `place`, `report`, `status`, `nomatch`, `outside`, `error`, `offline`, `location`, `loading`, `preferences`, `saved`, `trip`, `home`.

## What the path proves

The UVP is visible without a narrator: the shortest route is not the recommended one, and the reason is written as confirmed stairs and a confirmed grade, beside a route whose gaps are labeled unknown.

## Known limits of the flow

- Places are a fixed list. Typing a free address is not implemented.
- Only three origin-destination pairs have routes.
- The map is a schematic.
- Reports and preferences stay in this browser.
- `shot=status` and `shot=saved` write into that browser's storage.
- Refresh drops the in-memory trip and returns home.
- No account, no live feed, no turn-by-turn guidance.
