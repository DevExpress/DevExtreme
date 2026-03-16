import { Injectable } from '@angular/core';

export class Population {
  country: string;

  y014: number;

  y1564: number;

  y65: number;
}

const populationData: Population[] = [{
  country: 'India',
  y014: 351600000,
  y1564: 974800000,
  y65: 101500000,
}, {
  country: 'United States',
  y014: 58600000,
  y1564: 219300000,
  y65: 60700000,
}, {
  country: 'United Kingdom',
  y014: 11900000,
  y1564: 44200000,
  y65: 12000000,
}, {
  country: 'Brazil',
  y014: 43200000,
  y1564: 151600000,
  y65: 24100000,
}, {
  country: 'Canada',
  y014: 6000000,
  y1564: 26000000,
  y65: 7900000,
}];

@Injectable()
export class Service {
  getPopulationData(): Population[] {
    return populationData;
  }
}
