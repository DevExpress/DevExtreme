import { Injectable } from '@angular/core';

export class Medals {
    country: string;
    medals: number;
}

let allMedals: Medals[] = [{
    country: "USA",
    medals: 110
}, {
    country: "China",
    medals: 100
}, {
    country: "Russia",
    medals: 71
}, {
    country: "UK",
    medals: 47
}, {
    country: "Australia",
    medals: 46
}, {
    country: "Germany",
    medals: 41
}, {
    country: "France",
    medals: 41
}, {
    country: "South Korea",
    medals: 31
}];

let goldMedals: Medals[] = [{
    country: "China",
    medals: 51
}, {
    country: "USA",
    medals: 36
}, {
    country: "Russia",
    medals: 22
}, {
    country: "UK",
    medals: 19
}, {
    country: "Germany",
    medals: 16
}, {
    country: "Australia",
    medals: 14
}, {
    country: "South Korea",
    medals: 13
}, {
    country: "France",
    medals: 7
}];

@Injectable()
export class Service {
    getAllMedals(): Medals[] {
        return allMedals;
    }
    getGoldMedals(): Medals[] {
        return goldMedals;
    }
}