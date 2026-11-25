import { Injectable } from '@angular/core';
import type { DxMapTypes } from 'devextreme-angular/ui/map';

type MapMarker = NonNullable<DxMapTypes.Properties['markers']>[number];

export type Marker = Omit<MapMarker, 'tooltip'> & {
  tooltip: {
    isShown: boolean;
    text: string;
  };
};

export type APIKey = {
  azure?: string;

  bing?: string;

  google?: string;

  googleStatic?: string;
};

const markerUrl = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/maps/map-marker.png';

const markers: Marker[] = [{
  location: [40.755833, -73.986389],
  tooltip: {
    isShown: false,
    text: 'Times Square',
  },
}, {
  location: '40.7825, -73.966111',
  tooltip: {
    isShown: false,
    text: 'Central Park',
  },
}, {
  location: {
    lat: 40.753889,
    lng: -73.981389,
  },
  tooltip: {
    isShown: false,
    text: 'Fifth Avenue',
  },
}, {
  location: {
    lat: 40.705748,
    lng: -73.996299,
  },
  tooltip: {
    isShown: false,
    text: 'Brooklyn Bridge',
  },
}];

@Injectable()
export class Service {
  getMarkerUrl(): string {
    return markerUrl;
  }

  getMarkers(): Marker[] {
    return markers;
  }
}
