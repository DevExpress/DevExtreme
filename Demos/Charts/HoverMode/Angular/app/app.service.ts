import { Injectable } from '@angular/core';

export class GrossProduct {
  state: string;

  year1998: number;

  year2001: number;

  year2004: number;
}

const grossProductData: GrossProduct[] = [{
  state: 'Illinois',
  year1998: 374,
  year2001: 427,
  year2004: 479,
}, {
  state: 'Indiana',
  year1998: 129,
  year2001: 146,
  year2004: 177,
}, {
  state: 'Michigan',
  year1998: 259,
  year2001: 286,
  year2004: 323,
}, {
  state: 'Ohio',
  year1998: 299,
  year2001: 325,
  year2004: 368,
}, {
  state: 'Wisconsin',
  year1998: 110,
  year2001: 132,
  year2004: 162,
}];

@Injectable()
export class Service {
  getGrossProductData(): GrossProduct[] {
    return grossProductData;
  }
}
