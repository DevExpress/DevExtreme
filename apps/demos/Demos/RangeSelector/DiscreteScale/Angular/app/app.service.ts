import { Injectable } from '@angular/core';

export class ProductionData {
  country: string;

  copper: number;
}

const data: ProductionData[] = [
  { country: 'Chile', copper: 5700000 },
  { country: 'United States', copper: 1220000 },
  { country: 'Peru', copper: 1300000 },
  { country: 'China', copper: 1650000 },
  { country: 'Australia', copper: 990000 },
  { country: 'Russia', copper: 930000 },
  { country: 'DR Congo', copper: 900000 },
  { country: 'Finland', copper: 119000 },
];

@Injectable()
export class Service {
  getData(): ProductionData[] {
    return data;
  }
}
