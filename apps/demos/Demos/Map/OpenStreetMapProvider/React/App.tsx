import React, { useCallback, useState } from 'react';
import MapComponent, { ProviderConfig, type MapTypes } from 'devextreme-react/map';
import SelectBox from 'devextreme-react/select-box';
import 'devextreme/ui/map/openlayers';
import type OpenLayersMap from 'ol/Map.js';
import type LineString from 'ol/geom/LineString.js';
import Attribution from 'ol/control/Attribution.js';
import Polyline from 'ol/format/Polyline.js';
import { markersData, routesData } from './data.ts';

const routeCache = new Map<string, MapTypes.OsmGeoJsonLineString>();

async function calculateRoute({ locations, mode }: MapTypes.CalculateOsmRouteInfo): Promise<MapTypes.OsmGeoJsonLineString> {
  const body = JSON.stringify({
    locations: locations.map(({ lat, lng }) => ({ lat, lon: lng })),
    costing: mode === 'walking' ? 'pedestrian' : 'auto',
    directions_type: 'none',
  });
  const cachedRoute = routeCache.get(body);
  if (cachedRoute) {
    return cachedRoute;
  }

  const response = await fetch('https://api-eu.stadiamaps.com/route/v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!response.ok) {
    throw new Error(`Stadia Maps routing failed: HTTP ${response.status}`);
  }

  const { trip } = await response.json();
  if (!trip?.legs?.length) {
    throw new Error('Stadia Maps returned no route.');
  }
  const format = new Polyline({ factor: 1e6 });
  const route: MapTypes.OsmGeoJsonLineString = {
    type: 'LineString',
    coordinates: trip.legs.flatMap((leg: { shape: string }) => (format.readGeometry(leg.shape) as LineString).getCoordinates()),
  };
  routeCache.set(body, route);
  return route;
}

const tileServer: MapTypes.OsmTileServerConfig = {
  // Demo only: tiles are served under Developer Express Inc's Stadia Maps subscription via domain-based authentication.
  // This configuration will not work on your domain. Configure your own tile provider here.
  url: 'https://tiles-eu.stadiamaps.com/tiles/alidade_bright/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://stadiamaps.com/attribution/" target="_blank" rel="noopener">Stadia Maps</a> '
    + '&copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> '
    + '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  maxZoom: 20,
};

function onMarkerClick({ tooltip }: MapTypes.MarkerClickEvent) {
  tooltip?.option({
    showTitle: true,
    showCloseButton: true,
    wrapperAttr: {
      class: 'dx-map-marker-popover compact-marker-tooltip',
    },
  });
}

const markers = markersData.map((marker) => (marker.iconSrc
  ? { ...marker, onClick: onMarkerClick }
  : marker));

function onMapReady({ originalMap }: MapTypes.ReadyEvent) {
  const map = originalMap as OpenLayersMap;
  // Ensure attribution is visible to comply with the Stadia Maps Terms of Service.
  const attribution = map.getControls().getArray()
    .find((control) => control instanceof Attribution);
  if (attribution) {
    map.removeControl(attribution);
  }
  map.addControl(new Attribution({ collapsible: false }));
}

const modes: MapTypes.RouteMode[] = ['driving', 'walking'];
const routeColors = ['blue', 'green', 'red'];
const modeLabel = { 'aria-label': 'Mode' };
const colorLabel = { 'aria-label': 'Route color' };

export default function App() {
  const [routes, setRoutes] = useState(routesData);

  const setMode = useCallback((value: MapTypes.RouteMode) => {
    setRoutes((current) => current.map((route) => ({ ...route, mode: value })));
  }, []);

  const selectColor = useCallback((value: string) => {
    setRoutes((current) => current.map((route) => ({ ...route, color: value })));
  }, []);

  return (
    <div>
      <MapComponent
        provider="osm"
        defaultZoom={14}
        height={440}
        width="100%"
        controls={true}
        markers={markers}
        routes={routes}
        onReady={onMapReady}
      >
        <ProviderConfig tileServer={tileServer} calculateRoute={calculateRoute} />
      </MapComponent>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Set mode</span>
          <SelectBox
            items={modes}
            defaultValue="walking"
            inputAttr={modeLabel}
            onValueChange={setMode}
          />
        </div>
        <div className="option">
          <span>Route color</span>
          <SelectBox
            items={routeColors}
            defaultValue="blue"
            inputAttr={colorLabel}
            onValueChange={selectColor}
          />
        </div>
      </div>
    </div>
  );
}
