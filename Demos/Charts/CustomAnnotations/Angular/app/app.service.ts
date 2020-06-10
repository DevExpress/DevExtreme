import { Injectable } from '@angular/core';

export interface State {
    name: string;
    population: number;
    capital: string;
    area: number;
}  

const populationData: State[] = [{
    name: 'California',
    population: 38802500,
    capital: 'Sacramento',
    area: 423967
  }, {
    name: 'Texas',
    population: 26956958,
    capital: 'Austin',
    area: 695662
  }, {
    name: 'Florida',
    population: 19893297,
    capital: 'Tallahassee',
    area: 170312
  }, {
    name: 'New York',
    population: 19746227,
    capital: 'Albany',
    area: 141297
  }, {
    name: 'Illinois',
    population: 12880580,
    capital: 'Springfield',
    area: 149995
}];

@Injectable()
export class Service {
    getPopulationData(): State[] {
        return populationData;
    }
}