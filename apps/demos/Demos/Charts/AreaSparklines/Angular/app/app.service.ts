import { Injectable } from '@angular/core';

export class CostInfo {
  month: number;

  2010: number;

  2011: number;

  2012: number;
}

const copperCosts: CostInfo[] = [{
  month: 1,
  2010: 7341,
  2011: 9585,
  2012: 7501,
}, {
  month: 2,
  2010: 7016,
  2011: 10026,
  2012: 8470,
}, {
  month: 3,
  2010: 7202,
  2011: 9889,
  2012: 8591,
}, {
  month: 4,
  2010: 7851,
  2011: 9460,
  2012: 8459,
}, {
  month: 5,
  2010: 7481,
  2011: 9373,
  2012: 8320,
}, {
  month: 6,
  2010: 6532,
  2011: 9108,
  2012: 7465,
}, {
  month: 7,
  2010: 6498,
  2011: 9295,
  2012: 7475,
}, {
  month: 8,
  2010: 7191,
  2011: 9834,
  2012: 7430,
}, {
  month: 9,
  2010: 7596,
  2011: 9121,
  2012: 7614,
}, {
  month: 10,
  2010: 8057,
  2011: 7125,
  2012: 8245,
}, {
  month: 11,
  2010: 8373,
  2011: 7871,
  2012: 7727,
}, {
  month: 12,
  2010: 8636,
  2011: 7725,
  2012: 7880,
}];

const nickelCosts: CostInfo[] = [{
  month: 1,
  2010: 18974,
  2011: 24298,
  2012: 18322,
}, {
  month: 2,
  2010: 18162,
  2011: 27929,
  2012: 21093,
}, {
  month: 3,
  2010: 20535,
  2011: 28802,
  2012: 19701,
}, {
  month: 4,
  2010: 24562,
  2011: 26142,
  2012: 17695,
}, {
  month: 5,
  2010: 26131,
  2011: 26753,
  2012: 17549,
}, {
  month: 6,
  2010: 19278,
  2011: 23055,
  2012: 16436,
}, {
  month: 7,
  2010: 19475,
  2011: 22870,
  2012: 16382,
}, {
  month: 8,
  2010: 20701,
  2011: 24388,
  2012: 15687,
}, {
  month: 9,
  2010: 21266,
  2011: 21845,
  2012: 16085,
}, {
  month: 10,
  2010: 23358,
  2011: 18346,
  2012: 18250,
}, {
  month: 11,
  2010: 23150,
  2011: 18822,
  2012: 16083,
}, {
  month: 12,
  2010: 23282,
  2011: 17320,
  2012: 17104,
}];

const palladiumCosts: CostInfo[] = [{
  month: 1,
  2010: 398,
  2011: 788,
  2012: 649,
}, {
  month: 2,
  2010: 422,
  2011: 817,
  2012: 698,
}, {
  month: 3,
  2010: 431,
  2011: 812,
  2012: 713,
}, {
  month: 4,
  2010: 481,
  2011: 760,
  2012: 654,
}, {
  month: 5,
  2010: 551,
  2011: 774,
  2012: 665,
}, {
  month: 6,
  2010: 449,
  2011: 775,
  2012: 609,
}, {
  month: 7,
  2010: 442,
  2011: 750,
  2012: 584,
}, {
  month: 8,
  2010: 482,
  2011: 827,
  2012: 580,
}, {
  month: 9,
  2010: 517,
  2011: 776,
  2012: 632,
}, {
  month: 10,
  2010: 566,
  2011: 624,
  2012: 657,
}, {
  month: 11,
  2010: 630,
  2011: 651,
  2012: 601,
}, {
  month: 12,
  2010: 737,
  2011: 615,
  2012: 675,
}];

@Injectable()
export class Service {
  getCopperCosts(): CostInfo[] {
    return copperCosts;
  }

  getNickelCosts(): CostInfo[] {
    return nickelCosts;
  }

  getPalladiumCosts(): CostInfo[] {
    return palladiumCosts;
  }
}
