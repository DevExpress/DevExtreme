import { Injectable } from '@angular/core';

export class SolarSystemObject {
  name: string;

  mass: number;
}

const data: SolarSystemObject[] = [{
  name: 'Jupiter',
  mass: 318,
}, {
  name: 'Saturn',
  mass: 95,
}, {
  name: 'Uranus',
  mass: 14.6,
}, {
  name: 'Neptune',
  mass: 17.2,
}, {
  name: 'Earth',
  mass: 1,
}, {
  name: 'Venus',
  mass: 0.82,
}, {
  name: 'Mars',
  mass: 0.11,
}, {
  name: 'Mercury',
  mass: 0.06,
}];

@Injectable()
export class Service {
  getData(): SolarSystemObject[] {
    return data;
  }
}
