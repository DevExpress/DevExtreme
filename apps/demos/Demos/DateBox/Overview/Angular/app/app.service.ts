import { Injectable } from '@angular/core';

const federalHolidays: Date[] = [
  new Date(2017, 0, 1),
  new Date(2017, 0, 2),
  new Date(2017, 0, 16),
  new Date(2017, 1, 20),
  new Date(2017, 4, 29),
  new Date(2017, 6, 4),
  new Date(2017, 8, 4),
  new Date(2017, 9, 9),
  new Date(2017, 10, 11),
  new Date(2017, 10, 23),
  new Date(2017, 11, 25),
];

@Injectable()
export class Service {
  getFederalHolidays() : Date[] {
    return federalHolidays;
  }
}
