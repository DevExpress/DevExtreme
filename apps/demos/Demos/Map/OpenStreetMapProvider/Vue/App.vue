<template>
  <div>
    <DxMap
      provider="osm"
      :zoom="14"
      :height="440"
      width="100%"
      :controls="true"
      :markers="markers"
      :routes="routes"
      @ready="onMapReady"
    >
      <DxProviderConfig
        :tile-server="tileServer"
        :calculate-route="calculateRoute"
      />
    </DxMap>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Set mode</span>
        <DxSelectBox
          :items="routeModes"
          :input-attr="{ 'aria-label': 'Mode' }"
          value="walking"
          @value-changed="updateRoutesMode"
        />
      </div>
      <div class="option">
        <span>Route color</span>
        <DxSelectBox
          :items="routeColors"
          :input-attr="{ 'aria-label': 'Route color' }"
          value="blue"
          @value-changed="updateRoutesColor"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxMap, { DxProviderConfig, type DxMapTypes } from 'devextreme-vue/map';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import 'devextreme/ui/map/openlayers';
import type OpenLayersMap from 'ol/Map.js';
import type LineString from 'ol/geom/LineString.js';
import Attribution from 'ol/control/Attribution.js';
import Polyline from 'ol/format/Polyline.js';
import { markersData, routesData } from './data.ts';

const routeCache = new Map<string, DxMapTypes.OsmGeoJsonLineString>();

async function calculateRoute(
  { locations, mode }: DxMapTypes.CalculateOsmRouteInfo,
): Promise<DxMapTypes.OsmGeoJsonLineString> {
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
  const route: DxMapTypes.OsmGeoJsonLineString = {
    type: 'LineString',
    coordinates: trip.legs.flatMap((leg: { shape: string }) => (
      (format.readGeometry(leg.shape) as LineString).getCoordinates()
    )),
  };
  routeCache.set(body, route);
  return route;
}

const tileServer: DxMapTypes.OsmTileServerConfig = {
  // Demo only: tiles are served under Developer Express Inc's Stadia Maps subscription
  // via domain-based authentication.
  // This configuration will not work on your domain. Configure your own tile provider here.
  url: 'https://tiles-eu.stadiamaps.com/tiles/alidade_bright/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://stadiamaps.com/attribution/" target="_blank" rel="noopener">Stadia Maps</a> '
    + '&copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> '
    + '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  maxZoom: 20,
};

function onMarkerClick({ tooltip }: DxMapTypes.MarkerClickEvent) {
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

function onMapReady({ originalMap }: DxMapTypes.ReadyEvent) {
  const map = originalMap as OpenLayersMap;
  // Ensure attribution is visible to comply with the Stadia Maps Terms of Service.
  const attribution = map.getControls().getArray()
    .find((control) => control instanceof Attribution);
  if (attribution) {
    map.removeControl(attribution);
  }
  map.addControl(new Attribution({ collapsible: false }));
}

const routes = ref(routesData);
const routeModes = ['driving', 'walking'];
const routeColors = ['blue', 'green', 'red'];

function updateRoutesMode({ value }: DxSelectBoxTypes.ValueChangedEvent) {
  routes.value = routes.value.map((route) => ({ ...route, mode: value }));
}

function updateRoutesColor({ value }: DxSelectBoxTypes.ValueChangedEvent) {
  routes.value = routes.value.map((route) => ({ ...route, color: value }));
}
</script>
<style>
@import url('ol/ol.css');

.options {
  padding: 20px;
  background-color: var(--dx-color-options-panel-bg);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.option > span {
  display: inline-block;
  width: 90px;
}

.option > .dx-selectbox {
  width: 100%;
  max-width: 350px;
}

.compact-marker-tooltip .dx-popup-title {
  padding: 4px 8px;
}

.compact-marker-tooltip .dx-popup-title .dx-toolbar-items-container {
  height: 24px;
}

.compact-marker-tooltip .dx-popup-title .dx-closebutton {
  width: 24px;
  min-width: 24px;
  height: 24px;
}

.compact-marker-tooltip .dx-closebutton .dx-button-content {
  padding: 1px;
}
</style>
