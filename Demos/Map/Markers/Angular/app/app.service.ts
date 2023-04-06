import { Injectable } from '@angular/core';

export class Tooltip {
  isShown: boolean;

  text: string;
}

export class Marker {
  location: any;

  tooltip: Tooltip;
}

export type APIKey = {
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
  location: 'Brooklyn Bridge,New York,NY',
  tooltip: {
    isShown: false,
    text: 'Brooklyn Bridge',
  },
}];

@Injectable()
export class Service {
  getMarkerUrl() : string {
    return markerUrl;
  }

  getMarkers() : Marker[] {
    return markers;
  }
}
