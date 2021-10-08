import { Injectable } from '@angular/core';

export class Attributes {
  name: string;
}

export class Marker {
  coordinates: number[];

  attributes: Attributes;
}

const markers: Marker[] = [
  {
    coordinates: [-0.1262, 51.5002],
    attributes: {
      name: 'London',
    },
  },
  {
    coordinates: [149.1286, -35.2820],
    attributes: {
      name: 'Canberra',
    },
  },
  {
    coordinates: [139.6823, 35.6785],
    attributes: {
      name: 'Tokyo',
    },
  },
  {
    coordinates: [-77.0241, 38.8921],
    attributes: {
      name: 'Washington',
    },
  },
  {
    coordinates: [-75.6794, 45.4214],
    attributes: {
      name: 'Ottawa',
    },
  },
  {
    coordinates: [37.617778, 55.751667],
    attributes: {
      name: 'Moscow',
    },
  },
  {
    coordinates: [116.4, 39.933333],
    attributes: {
      name: 'Beijing',
    },
  },
  {
    coordinates: [12.5, 41.9],
    attributes: {
      name: 'Rome',
    },
  },
  {
    coordinates: [23.716667, 38],
    attributes: {
      name: 'Athens',
    },
  },
  {
    coordinates: [2.333333, 48.833333],
    attributes: {
      name: 'Paris',
    },
  },
  {
    coordinates: [-3.683333, 40.4],
    attributes: {
      name: 'Madrid',
    },
  },
  {
    coordinates: [-47.866667, -15.798889],
    attributes: {
      name: 'Brasilia',
    },
  },
];

@Injectable()
export class Service {
  getMarkers(): Marker[] {
    return markers;
  }
}
