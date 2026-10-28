# Competitive analysis

**Reviewed:** 22 October 2026.
**Method:** Public product pages, help pages, and news posts. Feature claims are limited to what those sources describe. Absence is not asserted unless the source's described model makes the gap visible. Pricing is included only where the source states it.

AccessPath is not positioned as the first accessible map. The opening is narrower: preference-based comparison that keeps evidence quality visible, including unknown.

## AccessMap

**Sources:** [Taskar Center for Accessible Technology](https://tcat.cs.washington.edu/accessmap/), [UW News on OS-CONNECT, 25 March 2025](https://www.washington.edu/news/2025/03/25/os-connect-accessmap-accessible-sidewalks/), [CREATE, 21 September 2026](https://create.uw.edu/accessmap-expands-beyond-the-sidewalk/), [OpenStreetMap wiki, updated 7 October 2026](https://wiki.openstreetmap.org/wiki/AccessMap).

**Audience and promise:** Pedestrians, wheelchair users, blind and low-vision travelers, caregivers, planners, and researchers. The public description is personalized accessible pedestrian routing rather than one route for everyone.

**What is documented:** Custom limits for uphill and downhill steepness, avoiding raised curbs and stairs, street avoidance, and screen-reader landmark options. Coverage grew from parts of Seattle toward a statewide sidewalk dataset (OS-CONNECT). A 2026 World Cup customization mapped entrances, clearance, and door swing, and the tool was embedded in Seattle's official companion app. The OSM wiki lists routing profiles for foot and wheelchair, and records public-transport mode as no.

**Relevance:** This is the closest published product to AccessPath's preference model, and it is a reason to treat Seattle as the pilot hypothesis. AccessPath does not claim those sidewalk geometries. The design difference to hold is evidence status on each compared route: confirmed, community-reported, and unknown, with conflicts still listed. AccessMap's own confidence language was not fully audited in this pass. **To validate:** current AccessMap route cards, and whether unknown attributes are labeled or simply omitted.

## Google Maps

**Sources:** [Find wheelchair-accessible places](https://support.google.com/maps/answer/9882117), [BGR, 2 October 2026](https://www.bgr.com/2271448/google-maps-wheelchair-accessible-routes-what-they-show/), [Android Police, 26 September 2026](https://www.androidpolice.com/google-maps-pwd-wheelchair-accessibility-walking-setting/). The New York Times reported on 13 March 2026 that Google had added stair-free surface routes in addition to wheelchair-accessible transit; that is journalism, not a help-page specification.

**Audience and promise:** General navigation, with accessibility as a set of options and place attributes.

**What is documented:** Place attributes for wheelchair-accessible entrance, restroom, seating, parking, and elevator, in certain countries. A route option labeled wheelchair accessible for transit and, in recent reporting, for walking. Walking paths are described as avoiding steps. Place data is contributed in large part through Local Guides. Help text defines an accessible entrance partly by width and by the absence of steps or the presence of a ramp.

**Friction relative to this brief:** The control found in reporting is a single wheelchair-accessible switch, not separate stair, curb, and grade settings. Journalism notes that contributed data can lag a broken elevator or construction. **To validate in the app:** whether a walking result explains unknown blocks, or only draws the filtered route.

## Citymapper

**Sources:** [Wheelchair accessible routing](https://citymapper.com/news/2004/wheelchair-accessible-routing), [Step-free routing](https://content.citymapper.com/news/2519/step-free-routing), [Inclusive navigation](https://citymapper.com/news/2262/inclusive-navigation-citymappers-step-free-routes).

**Audience and promise:** Multimodal city trips. Step-free routes are described as free, available by planning a trip and choosing Step-free, and useful for wheelchairs, luggage, and strollers.

**What is documented:** Routes that avoid stairs and wide gaps, direction to station entrances with lifts or ramps, adjusted walking times, and a preference for simpler transfers over raw speed. Citymapper has written that it delayed launch until station data felt reliable, and it asks people to report issues in the app. Coverage is city by city, not global.

**Friction relative to this brief:** The published control is one step-free choice. Grade limits and per-segment evidence labels are not described in these posts. **To validate:** the current route-detail screen in a covered city, and what an issue report's status looks like after submission.

## Wheelmap

**Sources:** [About](https://news.wheelmap.org/en/about-wheelmap/), [FAQ](https://news.wheelmap.org/en/faq/), [Mapping](https://news.wheelmap.org/en/mapping/).

**Audience and promise:** A free, worldwide map of wheelchair-accessible places, from Sozialheld*innen, based on OpenStreetMap. It is a place map, not a router.

**What is documented:** A traffic-light rating. Green is fully wheelchair accessible (no steps at the entrance, rooms reachable without steps). Orange is partial, including at most one step up to 7 cm. Red is not accessible. Grey is unknown and still needs a rating. Toilet access is a second rating. The about page has described information on over 3.2 million places. Grey is an explicit unknown state, which matters: AccessPath cannot claim to have invented "unknown."

**Friction relative to this brief:** The rating is one wheelchair definition, encoded first as color. It answers "can a wheelchair user get in?" rather than "which of these routes fits the settings I set today?" Route comparison is outside its described job.

## Adjacent tools, not fully reviewed

- **AXS Map and AccessNow** appear with OpenStreetMap, Project Sidewalk, and Wheelmap in a July 2026 comparative paper on crowdsourced accessibility platforms ([Zenodo abstract](https://zenodo.org/records/21146988)). This pass did not re-test their current apps. They are treated as place-rating substitutes, not as audited routers.
- **Apple Maps** is described by secondary travel guides as offering wheelchair-accessible routes in some regions. That was not checked against Apple's current help documentation. **To validate.**
- **Ezymob** was described in French press on 21 October 2026 as an inclusive trip planner. The product was not used for this analysis.

## Opportunity AccessPath is designed around

| Job | Strong existing pattern | AccessPath emphasis |
| --- | --- | --- |
| Avoid stairs on a trip | Citymapper step-free, Google wheelchair option, AccessMap curb and stair avoidance | Keep the failing route visible and say which confirmed fact caused the conflict |
| Limit steepness | AccessMap grade preferences | A small set of grade limits, with unknown grade blocking a "match" |
| Know a place is unrated | Wheelmap grey | The same honesty on route segments, not only on place pins |
| Trust a crowd note | Report tools in several of the products | Pending versus verified, and no promotion from community to confirmed |
| Different needs on different days | Separate products or one wheelchair mode | Editable presets, including a stroller or luggage starting point that is not a diagnosis |

## What not to copy

- A green "fully accessible" pin. Wheelmap's green means a specific step rule; using that phrase for a whole route would break AccessPath's guardrail.
- Color as the only code for evidence. Wheelmap's traffic light needs text. AccessPath uses the words and a shape or line pattern.
- A filter that hides every non-matching route. The short, stair-filled route is part of the explanation.

## Implication for the pilot

Seattle is the hypothesis because AccessMap and OS-CONNECT show that sidewalk-level data is a real conversation there, not because AccessPath can ship on it tomorrow. Licensing, coverage, and update frequency still have to be checked before any build beyond this prototype.
