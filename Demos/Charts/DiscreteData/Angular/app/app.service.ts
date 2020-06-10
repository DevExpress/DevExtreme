import { Injectable } from '@angular/core';

export class Temperature {
    arg: string;
    day: number;
    night: number;
}

let temperaturesData: Temperature[] = [{
    arg: "January",
    day: 6,
    night: 2
}, {
    arg: "February",
    day: 7,
    night: 2
}, {
    arg: "March",
    day: 10,
    night: 3
}, {
    arg: "April",
    day: 14,
    night: 5
}, {
    arg: "May",
    day: 18,
    night: 8
}, {
    arg: "June",
    day: 21,
    night: 11
}, {
    arg: "July",
    day: 22,
    night: 13
}, {
    arg: "August",
    day: 22,
    night: 13
}, {
    arg: "September",
    day: 19,
    night: 11
}, {
    arg: "October",
    day: 15,
    night: 8
}, {
    arg: "November",
    day: 10,
    night: 5
}, {
    arg: "December",
    day: 7,
    night: 3
}];

@Injectable()
export class Service {
    getTemperaturesData(): Temperature[] {
        return temperaturesData;
    }
}