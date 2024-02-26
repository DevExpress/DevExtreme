import { Injectable } from '@angular/core';

export class Population {
  total1: number;

  total2?: number;

  total3?: number;

  total4?: number;

  older1: number;

  older2?: number;

  older3?: number;

  older4?: number;

  perc1: number;

  perc2?: number;

  perc3?: number;

  perc4?: number;

  tag1: string;

  tag2?: string;

  tag3?: string;

  tag4?: string;
}

export class CorrelationDescription {
  name: string;

  argumentField: string;

  valueField: string;

  sizeField: string;

  tagField: string;
}

const populationData: Population[] = [{
  total1: 9.5,
  total2: 168.8,
  total3: 127.2,
  older1: 2.4,
  older2: 8.8,
  older3: 40.1,
  perc1: 25.4,
  perc2: 5.3,
  perc3: 31.6,
  tag1: 'Sweden',
  tag2: 'Nigeria',
  tag3: 'Japan',
}, {
  total1: 82.8,
  total2: 91.7,
  total3: 90.8,
  older1: 21.9,
  older2: 4.6,
  older3: 8.0,
  perc1: 26.7,
  perc2: 5.4,
  perc3: 8.9,
  tag1: 'Germany',
  tag2: 'Ethiopia',
  tag3: 'Viet Nam',
}, {
  total1: 16.7,
  total2: 80.7,
  total3: 21.1,
  older1: 3.8,
  older2: 7.0,
  older3: 2.7,
  perc1: 22.8,
  perc2: 8.4,
  perc3: 12.9,
  tag1: 'Netherlands',
  tag2: 'Egypt',
  tag3: 'Sri Lanka',
}, {
  total1: 62.8,
  total2: 52.4,
  total3: 96.7,
  older1: 14.4,
  older2: 4.0,
  older3: 5.9,
  perc1: 23.0,
  perc2: 7.8,
  perc3: 6.1,
  tag1: 'United Kingdom',
  tag2: 'South Africa',
  tag3: 'Philippines',
}, {
  total1: 38.2,
  total2: 43.2,
  total3: 66.8,
  older1: 7.8,
  older2: 1.8,
  older3: 9.6,
  perc1: 20.4,
  perc2: 4.3,
  perc3: 13.7,
  tag1: 'Poland',
  tag2: 'Kenya',
  tag3: 'Thailand',
}, {
  total1: 45.5,
  total3: 154.7,
  total4: 34.8,
  older1: 9.5,
  older3: 10.3,
  older4: 7.2,
  perc1: 21.1,
  perc3: 6.8,
  perc4: 20.8,
  tag1: 'Ukraine',
  tag3: 'Bangladesh',
  tag4: 'Canada',
}, {
  total1: 143.2,
  total4: 120.8,
  older1: 26.5,
  older4: 11.0,
  perc1: 18.6,
  perc4: 9.5,
  tag1: 'Russian Federation',
  tag4: 'Mexico',
}];

const correlationSource: CorrelationDescription[] = [{
  name: 'Europe',
  argumentField: 'total1',
  valueField: 'older1',
  sizeField: 'perc1',
  tagField: 'tag1',
}, {
  name: 'Africa',
  argumentField: 'total2',
  valueField: 'older2',
  sizeField: 'perc2',
  tagField: 'tag2',
}, {
  name: 'Asia',
  argumentField: 'total3',
  valueField: 'older3',
  sizeField: 'perc3',
  tagField: 'tag3',
}, {
  name: 'North America',
  argumentField: 'total4',
  valueField: 'older4',
  sizeField: 'perc4',
  tagField: 'tag4',
}];

@Injectable()
export class Service {
  getPopulationData(): Population[] {
    return populationData;
  }

  getCorrelationSource() : CorrelationDescription[] {
    return correlationSource;
  }
}
