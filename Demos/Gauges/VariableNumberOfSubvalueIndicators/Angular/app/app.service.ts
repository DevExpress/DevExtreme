import { Injectable } from '@angular/core';

export class PowerInfo {
    name: string;
    primary: number;
    secondary: number[];
}

let powerInfo: PowerInfo[] = [{
    name: 'Meat',
    primary: 8,
    secondary: [7, 3]
}, {
    name: 'Fish',
    primary: 7,
    secondary: [7, 5, 1]
}, {
    name: 'Grocery',
    primary: 5,
    secondary: [1, 3]
}, {
    name: 'Greengrocery',
    primary: 3,
    secondary: [1]
}, {
    name: 'Stationery',
    primary: 2,
    secondary: []
}];

@Injectable()
export class Service {
    getPowerInfo(): PowerInfo[] {
        return powerInfo;
    }
}
