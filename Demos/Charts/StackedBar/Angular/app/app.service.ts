import { Injectable } from '@angular/core';

export class MaleAgeStructure {
    state: string;
    young: number;
    middle: number;
    older: number;
}

let maleAgeData: MaleAgeStructure[] = [{
    state: "Germany",
    young: 6.7,
    middle: 28.6,
    older: 5.1
}, {
    state: "Japan",
    young: 9.6,
    middle: 43.4,
    older: 9
}, {
    state: "Russia",
    young: 13.5,
    middle: 49,
    older: 5.8
}, {
    state: "USA",
    young: 30,
    middle: 90.3,
    older: 14.5
}];

@Injectable()
export class Service {
    getMaleAgeData(): MaleAgeStructure[] {
        return maleAgeData;
    }
}
