import { Injectable } from '@angular/core';

export class MedalsInfo {
    country: string;
    gold: number;
    silver: number;
    bronze: number;
}

let medalsInfo: MedalsInfo[] = [{
    country: "USA",
    gold: 36,
    silver: 38,
    bronze: 36
}, {
    country: "China",
    gold: 51,
    silver: 21,
    bronze: 28
}, {
    country: "Russia",
    gold: 23,
    silver: 21,
    bronze: 28
}, {
    country: "Britain",
    gold: 19,
    silver: 13,
    bronze: 15
}, {
    country: "Australia",
    gold: 14,
    silver: 15,
    bronze: 17
}, {
    country: "Germany",
    gold: 16,
    silver: 10,
    bronze: 15
}];

@Injectable()
export class Service {
    getMedalsInfo(): MedalsInfo[] {
        return medalsInfo;
    }
}