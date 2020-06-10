import { Injectable } from '@angular/core';

export class Month {
    id: number;
    name: string;
}

let months: Month[] = [{
    id: 1,
    name: "January"
}, {
    id: 2,
    name: "February"
}, {
    id: 3,
    name: "March"
}, {
    id: 4,
    name: "April"
}, {
    id: 5,
    name: "May"
}, {
    id: 6,
    name: "June"
}, {
    id: 7,
    name: "July"
}, {
    id: 8,
    name: "August"
}, {
    id: 9,
    name: "September"
}, {
    id: 10,
    name: "October"
}, {
    id: 11,
    name: "November"
}, {
    id: 12,
    name: "December"
}];

@Injectable()
export class Service {
    getMonths(): Month[] {
        return months;
    }
}
