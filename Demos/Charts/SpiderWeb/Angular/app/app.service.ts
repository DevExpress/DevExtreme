import { Injectable } from '@angular/core';

export class Production {
    arg: string;
    apples: number;
    grapes: number;
    lemons: number;
    oranges: number;
}

let productionData: Production[] = [{
    arg: "USA",
    apples: 4.21,
    grapes: 6.22,
    lemons: 0.8,
    oranges: 7.47
}, {
    arg: "China",
    apples: 3.33,
    grapes: 8.65,
    lemons: 1.06,
    oranges: 5
}, {
    arg: "Turkey",
    apples: 2.6,
    grapes: 4.25,
    lemons: 0.78,
    oranges: 1.71
}, {
    arg: "Italy",
    apples: 2.2,
    grapes: 7.78,
    lemons: 0.52,
    oranges: 2.39
}, {
    arg: "India",
    apples: 2.16,
    grapes: 2.26,
    lemons: 3.09,
    oranges: 6.26
}];

@Injectable()
export class Service {
    getProductionData(): Production[] {
        return productionData;
    }
}
