import { Injectable } from '@angular/core';

export class MedalsInfo {
    year: number;
    gold: number;
    silver: number;
}

let medalsInfo: MedalsInfo[] = [{
    year: 1904,
    gold: null,
    silver: null
}, {
    year: 1908,
    gold: 5,
    silver: 5
}, {
    year: 1912,
    gold: 7,
    silver: 4
}, {
    year: 1916,
    gold: null,
    silver: null
}, {
    year: 1920,
    gold: 9,
    silver: 19
}, {
    year: 1924,
    gold: 13,
    silver: 15
}, {
    year: 1928,
    gold: 6,
    silver: 10
}, {
    year: 1932,
    gold: 10,
    silver: 5
}, {
    year: 1936,
    gold: 7,
    silver: 6
}, {
    year: 1940,
    gold: null,
    silver: null
}, {
    year: 1944,
    gold: null,
    silver: null
}, {
    year: 1948,
    gold: 10,
    silver: 6
}, {
    year: 1952,
    gold: 6,
    silver: 6
}, {
    year: 1956,
    gold: 4,
    silver: 4
}, {
    year: 1960,
    gold: null,
    silver: 2
}, {
    year: 1964,
    gold: 1,
    silver: 8
}, {
    year: 1968,
    gold: 7,
    silver: 3
}, {
    year: 1972,
    gold: 2,
    silver: 4
}, {
    year: 1976,
    gold: 2,
    silver: 3
}, {
    year: 1980,
    gold: 6,
    silver: 5
}, {
    year: 1984,
    gold: 5,
    silver: 7
}, {
    year: 1988,
    gold: 6,
    silver: 4
}, {
    year: 1992,
    gold: 8,
    silver: 5
}, {
    year: 1996,
    gold: 15,
    silver: 7
}, {
    year: 2000,
    gold: 13,
    silver: 14
}, {
    year: 2004,
    gold: 11,
    silver: 9
}, {
    year: 2008,
    gold: 7,
    silver: 16
}];

@Injectable()
export class Service {
    getMedalsInfo(): MedalsInfo[] {
        return medalsInfo;
    }
}