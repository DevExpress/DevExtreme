import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection, ViewEncapsulation } from '@angular/core';
import { DxMapModule, type DxMapTypes } from 'devextreme-angular/ui/map';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import 'devextreme/ui/map/openlayers';
import type OpenLayersMap from 'ol/Map.js';
import type LineString from 'ol/geom/LineString.js';
import Attribution from 'ol/control/Attribution.js';
import Polyline from 'ol/format/Polyline.js';
import { Service } from './app.service';

const routeCache = new Map<string, DxMapTypes.OsmGeoJsonLineString>();

async function calculateRoute({ locations, mode }: DxMapTypes.CalculateOsmRouteInfo): Promise<DxMapTypes.OsmGeoJsonLineString> {
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
    coordinates: trip.legs.flatMap((leg: { shape: string }) => (format.readGeometry(leg.shape) as LineString).getCoordinates()),
  };
  routeCache.set(body, route);
  return route;
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [DxMapModule, DxSelectBoxModule],
})
export class AppComponent {
  markers: DxMapTypes.Properties['markers'];

  routes: DxMapTypes.Properties['routes'];

  tileServer: DxMapTypes.OsmTileServerConfig = {
    // Demo only: tiles are served under Developer Express Inc's Stadia Maps subscription via domain-based authentication.
    // This configuration will not work on your domain. Configure your own tile provider here.
    url: 'https://tiles-eu.stadiamaps.com/tiles/alidade_bright/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/attribution/" target="_blank" rel="noopener">Stadia Maps</a> '
      + '&copy; <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> '
      + '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
    maxZoom: 20,
  };

  calculateRoute = calculateRoute;

  constructor(service: Service) {
    this.markers = service.getMarkers().map((marker) => (marker.iconSrc
      ? { ...marker, onClick: this.onMarkerClick }
      : marker));
    this.routes = service.getRoutes();
  }

  onMarkerClick({ tooltip }: DxMapTypes.MarkerClickEvent) {
    tooltip?.option({
      showTitle: true,
      showCloseButton: true,
      wrapperAttr: {
        class: 'dx-map-marker-popover compact-marker-tooltip',
      },
    });
  }

  onMapReady({ originalMap }: DxMapTypes.ReadyEvent) {
    const map = originalMap as OpenLayersMap;
    // Ensure attribution is visible to comply with the Stadia Maps Terms of Service.
    const attribution = map.getControls().getArray()
      .find((control) => control instanceof Attribution);
    if (attribution) {
      map.removeControl(attribution);
    }
    map.addControl(new Attribution({ collapsible: false }));
  }

  setMode({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.routes = this.routes.map((route) => ({ ...route, mode: value }));
  }

  selectColor({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.routes = this.routes.map((route) => ({ ...route, color: value }));
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
