import { Injectable } from '@angular/core';
import type { DxMapTypes } from 'devextreme-angular/ui/map';

export type Marker = NonNullable<DxMapTypes.Properties['markers']>[number];

export type Route = NonNullable<DxMapTypes.Properties['routes']>[number];

const markers: Marker[] = [{
  location: '40.7825, -73.966111',
  tooltip: { text: 'Central Park' },
}, {
  location: [40.755833, -73.986389],
  iconSrc: '../../../../images/Maps/map-marker.png',
  tooltip: { text: 'Times Square' },
}, {
  location: { lat: 40.753889, lng: -73.981389 },
  tooltip: { text: 'Fifth Avenue' },
}, {
  location: [40.713474, -74.005536],
  tooltip: { text: 'City Hall Park' },
}];

const routes: Route[] = [{
  weight: 6,
  color: 'blue',
  opacity: 0.5,
  mode: 'walking',
  locations: [
    [40.7825, -73.966111],
    [40.755833, -73.986389],
    [40.753889, -73.981389],
    [40.713474, -74.005536],
  ],
}];

@Injectable()
export class Service {
  getMarkers(): Marker[] {
    return markers;
  }

  getRoutes(): Route[] {
    return routes;
  }
}
