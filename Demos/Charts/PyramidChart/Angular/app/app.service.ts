import { Injectable } from '@angular/core';

export class Data {
    count: number;
    level: string;
}

let data: Data[] = [{
    count: 75,
    level: "Junior Engineer"
}, {
    count: 95,
    level: "Mid-Level Engineer"
}, {
    count: 53,
    level: "Senior Engineer"
}, {
    count: 23,
    level: "Lead Engineer"
}, {
    count: 18,
    level: "Architect"
}];

@Injectable()
export class Service {
    getData(): Data[] {
        return data;
    }
}