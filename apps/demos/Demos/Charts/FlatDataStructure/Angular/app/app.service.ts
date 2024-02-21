import { Injectable } from '@angular/core';

export interface CitiesPopulation {
  id: string;
  name: string;
  parentId?: string;
  value?: number;
  country?: string;
}

const citiesPopulations: CitiesPopulation[] = [{
  id: '1',
  name: 'Africa',
}, {
  id: '1_1',
  parentId: '1',
  value: 21324000,
  name: 'Lagos',
  country: 'Nigeria',
}, {
  id: '1_2',
  parentId: '1',
  value: 9735000,
  name: 'Kinshasa',
  country: 'Democratic Republic of the Congo',
}, {
  id: '1_3',
  parentId: '1',
  value: 9278441,
  name: 'Cairo',
  country: 'Egypt',
}, {
  id: '2',
  name: 'Asia',
}, {
  id: '2_1',
  parentId: '2',
  value: 24256800,
  name: 'Shanghai',
  country: 'China',
}, {
  id: '2_2',
  parentId: '2',
  value: 23500000,
  name: 'Karachi',
  country: 'Pakistan',
}, {
  id: '2_3',
  parentId: '2',
  value: 21516000,
  name: 'Beijing',
  country: 'China',
}, {
  id: '2_4',
  parentId: '2',
  value: 16787941,
  name: 'Delhi',
  country: 'India',
}, {
  id: '2_5',
  parentId: '2',
  value: 15200000,
  name: 'Tianjin',
  country: 'China',
}, {
  id: '3',
  name: 'Australia',
}, {
  id: '3_1',
  parentId: '3',
  value: 4840600,
  name: 'Sydney',
  country: 'Austraila',
}, {
  id: '3_2',
  parentId: '3',
  value: 4440000,
  name: 'Melbourne',
  country: 'Austraila',
}, {
  id: '4',
  name: 'Europe',
}, {
  id: '4_1',
  parentId: '4',
  value: 14160467,
  name: 'Istanbul',
  country: 'Turkey',
}, {
  id: '4_2',
  parentId: '4',
  value: 12197596,
  name: 'Moscow',
  country: 'Russia',
}, {
  id: '4_3',
  parentId: '4',
  value: 8538689,
  name: 'London',
  country: 'United Kingdom',
}, {
  id: '4_4',
  parentId: '4',
  value: 5191690,
  name: 'Saint Petersburg',
  country: 'Russia',
}, {
  id: '4_5',
  parentId: '4',
  value: 4470800,
  name: 'Ankara',
  country: 'Turkey',
}, {
  id: '4_6',
  parentId: '4',
  value: 3517424,
  name: 'Berlin',
  country: 'Germany',
}, {
  id: '5',
  name: 'North America',
}, {
  id: '5_1',
  parentId: '5',
  value: 8874724,
  name: 'Mexico City',
  country: 'Mexico',
}, {
  id: '5_2',
  parentId: '5',
  value: 8550405,
  name: 'New York City',
  country: 'United States',
}, {
  id: '5_3',
  parentId: '5',
  value: 3884307,
  name: 'Los Angeles',
  country: 'United States',
}, {
  id: '5_4',
  parentId: '5',
  value: 2808503,
  name: 'Toronto',
  country: 'Canada',
}, {
  id: '6',
  name: 'South America',
}, {
  id: '6_1',
  parentId: '6',
  value: 11895893,
  name: 'São Paulo',
  country: 'Brazil',
}, {
  id: '6_2',
  parentId: '6',
  value: 8693387,
  name: 'Lima',
  country: 'Peru',
}, {
  id: '6_3',
  parentId: '6',
  value: 7776845,
  name: 'Bogotá',
  country: 'Colombia',
}, {
  id: '6_4',
  parentId: '6',
  value: 6429923,
  name: 'Rio de Janeiro',
  country: 'Brazil',
}];

@Injectable()
export class Service {
  getCitiesPopulations() {
    return citiesPopulations;
  }
}
