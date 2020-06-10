import { Injectable } from '@angular/core';

export class OilProduction {
    state: string;
    year1970: number;
    year1980: number;
    year1990: number;
    year2000: number;
    year2008: number;
    year2009: number;
}

let oilProductionData: OilProduction[]  = [{
    state: "Saudi Arabia",
    year1970: 192.2,
    year1980: 509.8,
    year1990: 342.6,
    year2000: 456.3,
    year2008: 515.3,
    year2009: 459.5
}, {
    state: "USA",
    year1970: 533.5,
    year1980: 480.2,
    year1990: 416.6,
    year2000: 352.6,
    year2008: 304.9,
    year2009: 325.3
}, {
    state: "China",
    year1970: 30.7,
    year1980: 106,
    year1990: 138.3,
    year2000: 162.6,
    year2008: 195.1,
    year2009: 189
}, {
    state: "Canada",
    year1970: 70.1,
    year1980: 83.3,
    year1990: 92.6,
    year2000: 126.9,
    year2008: 157.7,
    year2009: 155.7
}, {
    state: "Mexico",
    year1970: 24.2,
    year1980: 107.2,
    year1990: 146.3,
    year2000: 171.2,
    year2008: 157.7,
    year2009: 147.5
}];

@Injectable()
export class Service {
    getOilProductionData(): OilProduction[] {
        return oilProductionData;
    }
}