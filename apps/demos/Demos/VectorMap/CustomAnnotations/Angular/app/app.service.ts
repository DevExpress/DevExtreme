import { Injectable } from '@angular/core';

export class StatesCollection {
  coordinates: number[];

  offsetX?: number;

  offsetY?: number;

  data: { name: string, [key: string]: unknown };
}

const statesData: StatesCollection[] = [
  {
    coordinates: [-75.4999, 43.00035],
    data: {
      name: 'New York',
      population: 19746227,
      capital: 'Albany',
      area: 141297,
    },
  },
  {
    coordinates: [-89, 40],
    offsetX: -100,
    offsetY: -80,
    data: {
      name: 'Illinois',
      population: 12880580,
      capital: 'Springfield',
      area: 149995,
    },
  },
  {
    coordinates: [-81.760254, 27.994402],
    data: {
      name: 'Florida',
      population: 19893297,
      capital: 'Tallahassee',
      area: 170312,
    },
  },
  {
    coordinates: [-100, 31],
    data: {
      name: 'Texas',
      population: 26956958,
      capital: 'Austin',
      area: 695662,
    },
  },
  {
    coordinates: [-119.417931, 36.778259],
    data: {
      name: 'California',
      population: 38802500,
      capital: 'Sacramento',
      area: 423967,
    },
  },
];

@Injectable()
export class Service {
  getStatesData(): StatesCollection[] {
    return statesData;
  }
}
