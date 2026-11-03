The DevExtreme [Map](/Documentation/Guide/UI_Components/Map/Overview/) supports the [OpenStreetMap](https://www.openstreetmap.org/) provider (OSM). This [provider](/Documentation/ApiReference/UI_Components/dxMap/Configuration/#provider) allows you to connect the Map to OSM-based tile, geocoding, and routing services. The provider supports core Map features such as markers, routes, and tooltips.

This demo uses [Stadia Maps](https://stadiamaps.com/) services to display map tiles and calculate a route between four markers.

<!--split-->

[note]

Map tiles in this demo are provided by [Stadia Maps](https://stadiamaps.com/) under Developer Express Inc.'s own subscription and used for demonstration purposes only. The product does not include map tiles, map data, or a tile-service license.

[/note]

Set the [provider](/Documentation/ApiReference/UI_Components/dxMap/Configuration/#provider) to *"osm"* to use the OSM provider in your app. [Add the OpenLayers library](/Documentation/Guide/UI_Components/Map/OpenStreetMap_Provider/#Configure_OpenLayers) and specify your own mapping services in [providerConfig](/Documentation/ApiReference/UI_Components/dxMap/Configuration/providerConfig/) property. This demo configures [tileServer](/Documentation/ApiReference/UI_Components/dxMap/Configuration/providerConfig/#tileServer) and [calculateRoute](/Documentation/ApiReference/UI_Components/dxMap/Configuration/providerConfig/#calculateRoute) to connect the Map to Stadia Maps tile and routing services.

Use the custom drop-down menus below the Map to pick transportation mode (driving/walking) and route color. Click a marker to display a tooltip. The Times Square marker displays a [custom icon](/Documentation/ApiReference/UI_Components/dxMap/Configuration/markers/#iconSrc) and a custom tooltip with a close button.

Refer to the following help topic for setup instructions and security considerations: [OpenStreetMap Provider](/Documentation/Guide/UI_Components/Map/OpenStreetMap_Provider/).
