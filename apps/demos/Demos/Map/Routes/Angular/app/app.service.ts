import { Injectable } from '@angular/core';

export class Marker {
  location: unknown;
}

export type APIKey = {
  azure?: string;
  
  bing?: string;

  google?: string;

  googleStatic?: string;
};

export class Route {
  weight: number;

  color: string;

  opacity: number;

  mode: string;

  locations: any[];
}

const markers: Marker[] = [{
  location: '40.7825, -73.966111',
}, {
  location: [40.755833, -73.986389],
}, {
  location: {
    lat: 40.753889,
    lng: -73.981389,
  },
}, {
  location: 'City Hall Park,New York,NY',
}];

const routes: Route[] = [{
  weight: 6,
  color: 'blue',
  opacity: 0.5,
  mode: '',
  locations: [
    [40.782500, -73.966111],
    [40.755833, -73.986389],
    [40.753889, -73.981389],
    'City Hall Park,New York,NY',
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
