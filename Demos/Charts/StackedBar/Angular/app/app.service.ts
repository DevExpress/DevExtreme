import { Injectable } from '@angular/core';

export class MaleAgeStructure {
    state: string;
    young: number;
    middle: number;
    older: number;
}

let maleAgeData: MaleAgeStructure[] = [{
    state: "Germany",
    young: 5.3,
    middle: 26,
    older: 8
}, {
    state: "Japan",
    young: 6.45,
    middle: 30.5,
    older: 11.22
}, {
    state: "Russia",
    young: 12.56,
    middle: 45.5,
    older: 6.5
}, {
    state: "USA",
    young: 32,
    middle: 87,
    older: 15
}];

@Injectable()
export class Service {
    getMaleAgeData(): MaleAgeStructure[] {
        return maleAgeData;
    }
}
