DevExtreme [Map](/Documentation/Guide/UI_Components/Map/Overview/) supports [OpenStreetMap](https://www.openstreetmap.org/) (OSM). The OSM [provider](/Documentation/ApiReference/UI_Components/dxMap/Configuration/#provider) allows you to connect the Map to OSM-based mapping services that offer a cost-effective alternative to Azure Maps or Google Maps. You can display map styles that match your app design and choose third-party/self-hosted services that meet your requirements.

This demo leverages [Stadia Maps](https://stadiamaps.com/) services to display map tiles and calculate a route between four markers. Use the drop-down menus below the Map to change the transportation mode (driving/walking) and route color. Click a marker to open its tooltip. The Times Square marker displays a [custom icon](/Documentation/ApiReference/UI_Components/dxMap/Configuration/markers/#iconSrc) and opens a tooltip with a close button.

<!--split-->

[note]

Map tiles in this demo are provided by [Stadia Maps](https://stadiamaps.com/) under Developer Express Inc's own subscription, for demonstration purposes only. The product does not include map tiles, map data or a tile-service license.

[/note]

Set [provider](/Documentation/ApiReference/UI_Components/dxMap/Configuration/#provider) to *"osm"* to use the OSM provider in your app. [Add the OpenLayers library](/Documentation/Guide/UI_Components/Map/OpenStreetMap_Provider/#Configure_OpenLayers) and specify your own mapping services in [providerConfig](/Documentation/ApiReference/UI_Components/dxMap/Configuration/providerConfig/) properties. This demo configures [tileServer](/Documentation/ApiReference/UI_Components/dxMap/Configuration/providerConfig/#tileServer) and [calculateRoute](/Documentation/ApiReference/UI_Components/dxMap/Configuration/providerConfig/#calculateRoute) to connect the Map to Stadia Maps tile and routing services.

Refer to the following help topic for setup instructions and security recommendations: [OpenStreetMap Provider](/Documentation/Guide/UI_Components/Map/OpenStreetMap_Provider/).
