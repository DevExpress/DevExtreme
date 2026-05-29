import { Injectable } from '@angular/core';

export class OilProductionDataItem {
  state: string;

  year2000: number;

  year2010: number;

  year2020: number;

  year2021: number;

  year2022: number;
}

const oilProductionData: OilProductionDataItem[] = [{
  state: 'Saudi Arabia',
  year2000: 408,
  year2010: 407,
  year2020: 498,
  year2021: 515,
  year2022: 602,
}, {
  state: 'USA',
  year2000: 288,
  year2010: 270,
  year2020: 713,
  year2021: 711,
  year2022: 762,
}, {
  state: 'Mexico',
  year2000: 150,
  year2010: 146,
  year2020: 101,
  year2021: 97,
  year2022: 95,
}];

@Injectable()
export class Service {
  getOilProductionData(): OilProductionDataItem[] {
    return oilProductionData;
  }
}
