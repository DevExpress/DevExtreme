import {
  Injectable,
} from '@angular/core';

export class OilPrice {
  date: Date;

  aVal1: number;

  aVal2: number;

  tVal1: number;

  tVal2: number;
}

const oilPrices: OilPrice[] = [{
  date: new Date(2005, 0, 1),
  aVal1: 34.33,
  aVal2: 43.29,
  tVal1: 40.18,
  tVal2: 49.91,
}, {
  date: new Date(2005, 1, 1),
  aVal1: 42.24,
  aVal2: 47.07,
  tVal1: 29.65,
  tVal2: 51.75,
}, {
  date: new Date(2005, 2, 1),
  aVal1: 42.93,
  aVal2: 52.77,
  tVal1: 51.01,
  tVal2: 56.72,
}, {
  date: new Date(2005, 3, 1),
  aVal1: 44.24,
  aVal2: 54.14,
  tVal1: 48.06,
  tVal2: 57.27,
}, {
  date: new Date(2005, 4, 1),
  aVal1: 44.47,
  aVal2: 49.03,
  tVal1: 47.28,
  tVal2: 52.07,
}, {
  date: new Date(2005, 5, 1),
  aVal1: 50.55,
  aVal2: 57.94,
  tVal1: 55.01,
  tVal2: 60.54,
}, {
  date: new Date(2005, 6, 1),
  aVal1: 52.79,
  aVal2: 58.98,
  tVal1: 55.52,
  tVal2: 61.28,
}, {
  date: new Date(2005, 7, 1),
  aVal1: 56.49,
  aVal2: 67.06,
  tVal1: 62.23,
  tVal2: 68.94,
}, {
  date: new Date(2005, 8, 1),
  aVal1: 62.77,
  aVal2: 66.72,
  tVal1: 65.19,
  tVal2: 69.47,
}, {
  date: new Date(2005, 9, 1),
  aVal1: 57.52,
  aVal2: 63.47,
  tVal1: 59.35,
  tVal2: 65.47,
}, {
  date: new Date(2005, 10, 1),
  aVal1: 52.92,
  aVal2: 59.98,
  tVal1: 56.15,
  tVal2: 61.78,
}, {
  date: new Date(2005, 11, 1),
  aVal1: 55.22,
  aVal2: 55.22,
  tVal1: 57.34,
  tVal2: 57.37,
}];

@Injectable()
export class Service {
  getOilPrices(): OilPrice[] {
    return oilPrices;
  }
}
