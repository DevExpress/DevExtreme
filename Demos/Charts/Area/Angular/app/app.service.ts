import { Injectable } from '@angular/core';

export class Population {
    country: string;
    y014: number;
    y1564: number;
    y65: number;
}

let populationData: Population[] = [{
    country: "China",
    y014: 320866959,
    y1564: 853191410,
    y65: 87774113
}, {
    country: "India",
    y014: 340419115,
    y1564: 626520945,
    y65: 47063757
}, {
    country: "United States",
    y014: 58554755,
    y1564: 182172625,
    y65: 34835293
}, {
    country: "Indonesia",
    y014: 68715705,
    y1564: 146014815,
    y65: 10053690
}, {
    country: "Brazil",
    y014: 50278034,
    y1564: 113391494,
    y65: 9190842
}, {
    country: "Russia",
    y014: 26465156,
    y1564: 101123777,
    y65: 18412243
}];

@Injectable()
export class Service {
    getPopulationData(): Population[] {
        return populationData;
    }
}
