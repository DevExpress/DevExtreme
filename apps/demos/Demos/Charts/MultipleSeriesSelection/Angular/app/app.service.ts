import { Injectable } from '@angular/core';

export class Statistics {
  year: number;

  IE7: number;

  IE8?: number;

  IE9?: number;

  IE10?: number;
}

const statisticsData: Statistics[] = [{
  year: 2006,
  IE7: 0.011,
}, {
  year: 2007,
  IE7: 0.192,
}, {
  year: 2008,
  IE7: 0.265,
}, {
  year: 2009,
  IE7: 0.213,
  IE8: 0.052,
}, {
  year: 2010,
  IE7: 0.091,
  IE8: 0.160,
}, {
  year: 2011,
  IE7: 0.053,
  IE8: 0.141,
  IE9: 0.031,
}, {
  year: 2012,
  IE7: 0.021,
  IE8: 0.088,
  IE9: 0.065,
  IE10: 0.001,
}, {
  year: 2013,
  IE7: 0.008,
  IE8: 0.052,
  IE9: 0.039,
  IE10: 0.026,
}];

@Injectable()
export class Service {
  getStatisticsData(): Statistics[] {
    return statisticsData;
  }
}
