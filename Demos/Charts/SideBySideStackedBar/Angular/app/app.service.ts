import { Injectable } from '@angular/core';

export class Population {
    state: string;
    maleyoung: number;
    malemiddle: number;
    maleolder: number;
    femaleyoung: number;
    femalemiddle: number;
    femaleolder: number;
}

let populationData: Population[]  = [{
    state: "USA",
    maleyoung: 29.956,
    malemiddle: 90.354,
    maleolder: 14.472,
    femaleyoung: 28.597,
    femalemiddle: 91.827,
    femaleolder: 20.362
}, {
    state: "Brazil",
    maleyoung: 25.607,
    malemiddle: 55.793,
    maleolder: 3.727,
    femaleyoung: 24.67,
    femalemiddle: 57.598,
    femaleolder: 5.462
}, {
    state: "Russia",
    maleyoung: 13.493,
    malemiddle: 48.983,
    maleolder: 5.802,
    femaleyoung: 12.971,
    femalemiddle: 52.14,
    femaleolder: 12.61
}, {
    state: "Japan",
    maleyoung: 9.575,
    malemiddle: 43.363,
    maleolder: 9.024,
    femaleyoung: 9.105,
    femalemiddle: 42.98,
    femaleolder: 12.501
}, {
    state: "Mexico",
    maleyoung: 17.306,
    malemiddle: 30.223,
    maleolder: 1.927,
    femaleyoung: 16.632,
    femalemiddle: 31.868,
    femaleolder: 2.391
}, {
    state: "Germany",
    maleyoung: 6.679,
    malemiddle: 28.638,
    maleolder: 5.133,
    femaleyoung: 6.333,
    femalemiddle: 27.693,
    femaleolder: 8.318
}, {
    state: "United Kindom",
    maleyoung: 5.816,
    malemiddle: 19.622,
    maleolder: 3.864,
    femaleyoung: 5.519,
    femalemiddle: 19.228,
    femaleolder: 5.459
}];

@Injectable()
export class Service {
    getPopulationData(): Population[] {
        return populationData;
    }
}