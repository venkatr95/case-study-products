# Interaction states — Rewear prototype

| Surface | Default | Empty | Loading | Success | Error | Disabled | Offline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Welcome | Two starts | n/a | n/a | Routes to wardrobe | n/a | n/a | Banner if the browser is offline |
| Wardrobe | Grid and count | Copy plus Add and Sample | n/a | Toast after sample load | No-match copy | n/a | Banner, grid still works |
| Filters | Chips reflect state | n/a | n/a | Show results | No matches after close | n/a | Works |
| Add item | Empty draft or edit draft | Photo well says no photo | Progress percent | Toast and detail | Field alert or photo alert | Save waits during read | Works |
| Item detail | Tags, wear, outfits | No outfits yet | n/a | Wear logged toast | Missing id redirects | n/a | Works |
| Outfit builder | Work / mild defaults on a new draft | No items: link to add | n/a | Outfit detail | Save rule alert | n/a | Works |
| Suggestions | Work / cold | Gap panel | Recomputes on change | Saved outfit | “No longer available” if the set vanished | n/a | Works |
| Trips | List with packed counts | Points to outfits | n/a | Packing toast | Validation alert | Build disabled with zero outfits | Works |
| Packing | Unchecked rows | “No items yet” if outfits are empty | n/a | Checkbox persists | Removed outfit noted | n/a | Works |
| Settings | Current prefs | n/a | n/a | Toasts for currency and deletes | Confirm required | n/a | Works |
| Dialogs | Cancel plus action | n/a | n/a | Action runs | n/a | n/a | Works |

Permission-denied does not have a dedicated screen. The file input uses the platform picker. Cancelling it leaves the form alone. The prototype never requests geolocation, camera as a live stream, or notifications.

Keyboard: skip link, focus ring, dialog trap, Escape. Touch: 44px controls, bottom nav respects the safe area inset.

Undo exists for one case: deleting a single photo. Other deletes are confirmed and final inside this browser.
